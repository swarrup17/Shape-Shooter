<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve and sanitize form data
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $password = $_POST['password']; // Password is not hashed here since we will verify it later

    // Query to fetch the user data
    $query = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        // User exists, verify the password
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            // Password is correct; start a session
            session_start();
            $_SESSION['username'] = $user['username'];
            $_SESSION['user_id'] = $user['id'];

            // Redirect to a dashboard or home page
            header("Location: home.php");
            exit();
        } else {
            // Incorrect password
            echo "<p style='color: red; font-size: 18px; font-family: Arial, sans-serif; text-align: center; margin-top: 20px;'>
                  Incorrect username or password. Please try again.
                  </p>";
        }
    } else {
        // User does not exist
        echo "<p style='color: red; font-size: 18px; font-family: Arial, sans-serif; text-align: center; margin-top: 20px;'>
              User not found. Please check your username or sign up.
              </p>";
    }

    $stmt->close(); // Close the prepared statement
}
?>
