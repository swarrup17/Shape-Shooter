// Game code starts here

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Adjust canvas dimensions
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

// Game variables
let player, bullets, enemies, score, gameOver, enemySpeedMultiplier, collisionDetected, collisionEnemyIndex, stars;
let starSpeed = 0.2;
let isPaused = false; // Add pause state

// Patterns for enemy movement
const patterns = ['wave', 'zigzag', 'spiral'];

// Helper functions
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
}

function getRandomColorGradient() {
    const baseColor = getRandomColor();
    const gradientColor = getRandomColor();
    return [baseColor, gradientColor];
}

// Initialize game variables
function init() {
    player = {
        x: canvas.width / 2,
        y: canvas.height - 50,
        size: 20,
        color: 'limegreen',
        speed: 7
    };

    bullets = [];
    enemies = [];
    score = 0;
    gameOver = false;
    enemySpeedMultiplier = 1;
    collisionDetected = false;
    collisionEnemyIndex = null;

    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: starSpeed
        });
    }
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    if (!gameOver) {
        if (e.key === ' ') {
            if (isPaused) {
                unpauseGame(); // Unpause if the game is paused
            } else {
                bullets.push({ x: player.x, y: player.y, size: 5, color: 'red', speed: 5 });
            }
        } else if (e.key === 'ArrowLeft') {
            player.x -= player.speed;
        } else if (e.key === 'ArrowRight') {
            player.x += player.speed;
        } else if (e.key === 'ArrowUp') {
            player.y -= player.speed;
        } else if (e.key === 'ArrowDown') {
            player.y += player.speed;
        }

        // Keep player within canvas bounds
        player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
        player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));
    } else {
        if (e.key === ' ') {
            init();
            update();
        }
    }
});

// Draw background with stars
function drawBackground() {
    context.fillStyle = '#001d3d';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#ffffff';
    for (let star of stars) {
        context.beginPath();
        context.arc(star.x, star.y, Math.random() * 2 + 1, 0, Math.PI * 2);
        context.fill();
    }
}

// Game update loop
function update() {
    if (gameOver || isPaused) return; // Stop the game if it's over or paused

    drawBackground();

    // Update star positions
    for (let star of stars) {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }

    // Update bullets
    bullets = bullets.filter((bullet) => {
        bullet.y -= bullet.speed;
        return bullet.y > 0;
    });

    // Spawn enemies
    if (Math.random() < 0.02) {
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        enemies.push({
            x: Math.random() * canvas.width,
            y: 0,
            size: 15 + Math.random() * 25,
            speed: 2 * enemySpeedMultiplier,
            pattern: pattern,
            angle: 0,
            amplitude: Math.random() * 20,
            colors: getRandomColorGradient()
        });
    }

    // Update enemies
    enemies.forEach((enemy) => {
        switch (enemy.pattern) {
            case 'wave':
                enemy.x += Math.sin(enemy.y / 20) * enemy.amplitude;
                break;
            case 'zigzag':
                enemy.x += Math.sin(enemy.y / 20) * enemy.amplitude * (Math.sin(enemy.y / 10) * 0.5);
                break;
            case 'spiral':
                enemy.angle += 0.05;
                enemy.x += Math.cos(enemy.angle) * enemy.speed;
                enemy.y += Math.sin(enemy.angle) * enemy.speed;
                return;
        }
        enemy.y += enemy.speed;
    });

    // Handle collisions between bullets and enemies
    bullets = bullets.filter((bullet) => {
        for (let j = 0; j < enemies.length; j++) {
            const dx = bullet.x - enemies[j].x;
            const dy = bullet.y - enemies[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < bullet.size + enemies[j].size) {
                enemies.splice(j, 1);
                score += 1;

                return false;
            }
        }
        return true;
    });

    // Increase enemy speed as score increases
    if (score >= 4 && enemySpeedMultiplier === 1) {
        enemySpeedMultiplier *= 1.25;
    } else if (score >= 8 && enemySpeedMultiplier === 1.25) {
        enemySpeedMultiplier *= 2;
    }

    // Check for player collision with enemies
    for (let enemy of enemies) {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.size + enemy.size) {
            gameOver = true;
            collisionDetected = true;

            alert(`Game Over! Your score: ${score}\nPress Space to play again.`);
            saveScore(score);
            return;
        }
    }

    // Draw player
    drawRocket(player.x, player.y, player.size, player.color);

    // Draw bullets
    bullets.forEach((bullet) => {
        context.fillStyle = bullet.color;
        context.beginPath();
        context.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
        context.fill();
    });

    // Draw enemies
    enemies.forEach((enemy) => {
        drawRoughShape(enemy.x, enemy.y, enemy.size, enemy.colors);
    });

    // Display score
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText(`Score: ${score}`, 10, 30);

    requestAnimationFrame(update);
}

// Draw player rocket
function drawRocket(x, y, size, color) {
    context.fillStyle = color;

    context.beginPath();
    context.moveTo(x, y - size);
    context.lineTo(x - size / 2, y);
    context.lineTo(x + size / 2, y);
    context.closePath();
    context.fill();

    context.fillStyle = 'darkgray';
    context.fillRect(x - size / 4, y, size / 2, size / 2);

    context.fillStyle = 'orange';
    context.beginPath();
    context.moveTo(x - size / 4, y + size);
    context.lineTo(x, y + size * 1.5);
    context.lineTo(x + size / 4, y + size);
    context.closePath();
    context.fill();
}

// Draw rough-shaped enemies
function drawRoughShape(x, y, size, colors) {
    const gradient = context.createLinearGradient(x - size / 2, y - size / 2, x + size / 2, y + size / 2);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);

    context.fillStyle = gradient;
    context.beginPath();
    const points = 5 + Math.floor(Math.random() * 5);
    for (let i = 0; i < points; i++) {
        const angle = Math.PI * 2 * (i / points);
        const radius = size * 0.5 + Math.random() * size * 0.5;
        const px = x + radius * Math.cos(angle);
        const py = y + radius * Math.sin(angle);
        if (i === 0) context.moveTo(px, py);
        else context.lineTo(px, py);
    }
    context.closePath();
    context.fill();
}

// Save score to backend
function saveScore(score) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'save_score.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(`score=${score}`);
}

// Pause the game
function pauseGame() {
    isPaused = true;
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.font = '30px Arial';
    context.fillText('Game Paused', canvas.width / 2 - 100, canvas.height / 2);
}

// Unpause the game
function unpauseGame() {
    isPaused = false;
    update();
}

// Start the game
canvas.style.display = 'block';
init();
update();
