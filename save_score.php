<?php
require 'config.php';
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    die("Unauthorized access");
}

// Get user ID and score from session and POST
$user_id = $_SESSION['user_id'];  // Fix the typo here
$score = $_POST['score'];

// Validate score (optional, depending on your needs)
if (!is_numeric($score)) {
    die("Invalid score");
}

try {
    // Prepare and execute the insert statement
    $stmt = $conn->prepare("INSERT INTO scores (user_id, score) VALUES (?, ?)");
    $stmt->bind_param("ii", $user_id, $score);
    $stmt->execute();
    echo "Score saved successfully.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
