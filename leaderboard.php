<?php
require 'config.php';

$query = "
    SELECT users.username, scores.score 
    FROM scores 
    JOIN users ON scores.user_id = users.id 
    ORDER BY scores.score DESC
";
$result = mysqli_query($conn, $query);

$leaderboard = [];
while ($row = mysqli_fetch_assoc($result)) {
    $leaderboard[] = $row;
}

echo json_encode($leaderboard);
?>