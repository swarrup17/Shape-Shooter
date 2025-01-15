document.addEventListener('DOMContentLoaded', () => {
    const leaderboardContainer = document.getElementById('leaderboard');

    fetch('leaderboard.php')
        .then(response => response.json())
        .then(data => {
            data.forEach((entry, index) => {
                const div = document.createElement('div');
                div.innerHTML = `${index + 1}. <strong>${entry.username}</strong> - ${entry.score} points`;
                leaderboardContainer.appendChild(div);
            });
        })
        .catch(err => {
            leaderboardContainer.innerHTML = 'Error loading leaderboard.';
            console.error(err);
        });
});
