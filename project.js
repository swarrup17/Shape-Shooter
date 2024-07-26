const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const shootSound = document.getElementById('shootSound');
const hitSound = document.getElementById('hitSound');
const gameoverSound = document.getElementById('gameoverSound');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

let player;
let bullets;
let enemies;
let score;
let gameOver;
let enemySpeedMultiplier;
let collisionDetected;
let collisionEnemyIndex; // Index of the enemy that collided with the player
let stars; // Array to store star positions and speeds
let starSpeed = 0.2; // Speed of stars

// Custom patterns
const patterns = ['wave', 'zigzag', 'spiral'];

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

function init() {
    player = {
        x: canvas.width / 2,
        y: canvas.height - 50,
        size: 20,
        color: 'limegreen', // Rocket color
        speed: 7
    };

    bullets = [];
    enemies = [];
    score = 0;
    gameOver = false;
    enemySpeedMultiplier = 1;
    collisionDetected = false; // Track if collision is detected
    collisionEnemyIndex = null; // No collision enemy initially

    // Initialize stars
    stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: starSpeed
        });
    }
}

document.addEventListener('keydown', (e) => {
    if (!gameOver) {
        if (e.key === ' ') {
            bullets.push({ x: player.x, y: player.y, size: 5, color: 'red', speed: 5 });
            shootSound.play(); // Play shoot sound
        } else if (e.key === 'ArrowLeft') {
            player.x -= player.speed;
        } else if (e.key === 'ArrowRight') {
            player.x += player.speed;
        } else if (e.key === 'ArrowUp') {
            player.y -= player.speed;
        } else if (e.key === 'ArrowDown') {
            player.y += player.speed;
        }

        // Ensure the player stays within the canvas boundaries
        if (player.x < player.size) player.x = player.size;
        if (player.x > canvas.width - player.size) player.x = canvas.width - player.size;
        if (player.y < player.size) player.y = player.size;
        if (player.y > canvas.height - player.size) player.y = canvas.height - player.size;
    } else {
        if (e.key === ' ') {
            init();
            update();
        }
    }
});

function drawBackground() {
    // Draw sky background
    context.fillStyle = '#001d3d'; // Dark blue sky
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    context.fillStyle = '#ffffff'; // White stars
    for (let star of stars) {
        context.beginPath();
        context.arc(star.x, star.y, Math.random() * 2 + 1, 0, Math.PI * 2);
        context.fill();
    }
}

function update() {
    if (gameOver) return;

    drawBackground();

    // Move stars
    for (let star of stars) {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }

    // Move bullets
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }

    // Generate enemies
    if (Math.random() < 0.02) {
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        enemies.push({
            x: Math.random() * canvas.width,
            y: 0,
            size: 15 + Math.random() * 25, // Random size between 15 and 40
            speed: 2 * enemySpeedMultiplier,
            shape: 'rough',
            pattern: pattern,
            angle: 0, // For spiral pattern
            amplitude: Math.random() * 20, // For wave pattern
            colors: getRandomColorGradient() // Array of colors for gradient effect
        });
    }

    // Move enemies
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        switch (enemy.pattern) {
            case 'wave':
                enemy.x += Math.sin(enemy.y / 20) * enemy.amplitude;
                enemy.y += enemy.speed;
                break;
            case 'zigzag':
                enemy.x += (Math.sin(enemy.y / 20) * enemy.amplitude) * (Math.sin(enemy.y / 10) * 0.5);
                enemy.y += enemy.speed;
                break;
            case 'spiral':
                enemy.angle += 0.05;
                enemy.x += Math.cos(enemy.angle) * enemy.speed;
                enemy.y += Math.sin(enemy.angle) * enemy.speed;
                break;
        }

        if (enemy.y > canvas.height || enemy.x < 0 || enemy.x > canvas.width) {
            enemies.splice(i, 1);
            i--;
        }
    }

    // Check for collisions with bullets
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            const dx = bullets[i].x - enemies[j].x;
            const dy = bullets[i].y - enemies[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < bullets[i].size + enemies[j].size) {
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                score += 1;
                hitSound.play(); // Play hit sound
                i--;
                break;
            }
        }
    }

    
    if (score >= 4 && enemySpeedMultiplier === 1) {
        enemySpeedMultiplier *= 1.25;
    }
    // Increase enemy speed after reaching a score of 8
    if (score >= 8 && enemySpeedMultiplier === 1.25) {
        enemySpeedMultiplier *= 2;
    }

    // Check for collisions with player
    for (let i = 0; i < enemies.length; i++) {
        const dx = player.x - enemies[i].x;
        const dy = player.y - enemies[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.size + enemies[i].size) {
            gameOver = true;
            collisionDetected = true; // Set collision detected flag
            collisionEnemyIndex = i; // Store the index of the colliding enemy
            gameoverSound.play(); // Play game over sound
            alert('Game Over! Your score: ' + score + '\nPress Space to play again.');
            saveScore(score);
            return;
        }
    }

    // Draw player (rocket)
    drawRocket(player.x, player.y, player.size, player.color);

    // Draw bullets
    for (let bullet of bullets) {
        context.fillStyle = bullet.color;
        context.beginPath();
        context.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
        context.fill();
    }

    // Draw enemies (random rough shapes with gradient colors)
    for (let i = 0; i < enemies.length; i++) {
        if (collisionDetected && i === collisionEnemyIndex) {
            drawRoughShape(enemies[i].x, enemies[i].y, enemies[i].size, 'red'); // Highlight colliding enemy
        } else {
            drawRoughShape(enemies[i].x, enemies[i].y, enemies[i].size, enemies[i].colors); // Draw with gradient colors
        }
    }

    // Draw score
    context.fillStyle = 'white';
    context.font = '20px Arial';
    context.fillText(`Score: ${score}`, 10, 30);

    // Highlight collision if detected
    if (collisionDetected) {
        context.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Semi-transparent red
        context.beginPath();
        context.arc(player.x, player.y, player.size, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Semi-transparent red
        context.beginPath();
        context.arc(enemies[collisionEnemyIndex].x, enemies[collisionEnemyIndex].y, enemies[collisionEnemyIndex].size, 0, Math.PI * 2);
        context.fill();
    }

    requestAnimationFrame(update);
}

function drawRocket(x, y, size, color) {
    context.fillStyle = color;
    
    // Rocket body
    context.beginPath();
    context.moveTo(x, y - size); // Top point
    context.lineTo(x - size / 2, y); // Bottom-left point
    context.lineTo(x + size / 2, y); // Bottom-right point
    context.closePath();
    context.fill();
    
    // Rocket body details
    context.fillStyle = 'darkgray';
    context.fillRect(x - size / 4, y, size / 2, size / 2); // Rocket body section

    // Rocket fins
    context.fillStyle = 'gray';
    context.beginPath();
    context.moveTo(x - size / 2, y); // Left fin start
    context.lineTo(x - size / 1.5, y + size / 2); // Left fin end
    context.lineTo(x - size / 2.5, y + size / 2); // Left fin bottom
    context.closePath();
    context.fill();

    context.beginPath();
    context.moveTo(x + size / 2, y); // Right fin start
    context.lineTo(x + size / 1.5, y + size / 2); // Right fin end
    context.lineTo(x + size / 2.5, y + size / 2); // Right fin bottom
    context.closePath();
    context.fill();

    // Rocket flame
    context.fillStyle = 'orange';
    context.beginPath();
    context.moveTo(x - size / 4, y + size); // Flame start
    context.lineTo(x, y + size * 1.5); // Flame peak
    context.lineTo(x + size / 4, y + size); // Flame end
    context.closePath();
    context.fill();
}

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

// Initialize the game
init();
update();
function saveScore(score) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'project.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(`score=${score}`);
}

// Call saveScore(score) whenever you want to save the score, e.g., game over.
if (gameOver) {
    saveScore(score);
}
