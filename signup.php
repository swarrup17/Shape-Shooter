<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve form data and sanitize inputs
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hash the password
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $age = intval($_POST['age']);
    $gender = mysqli_real_escape_string($conn, $_POST['gender']);

    // Check if the username or email already exists
    $check_query = "SELECT * FROM users WHERE username = ? OR email = ?";
    $stmt = $conn->prepare($check_query);
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // If username or email exists, show an error message
        echo "<p style='color: red; font-size: 18px; font-family: Arial, sans-serif; text-align: center; margin-top: 20px;'>
              Username or Email already exists. Please try again with a different one.
              </p>";
    } else {
        // Insert user into the database
        $query = "INSERT INTO users (username, password, email, age, gender, is_verified) 
                  VALUES (?, ?, ?, ?, ?, 1)"; // Set is_verified to 1 as verification is no longer needed
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssssi", $username, $password, $email, $age, $gender);

        if ($stmt->execute()) {
            // Redirect to index.php after successful registration
            header("Location: home.php");
            exit(); // Ensure no further code is executed after redirection
        } else {
            // Database error
            echo "<p style='color: red; font-size: 18px; font-family: Arial, sans-serif; text-align: center; margin-top: 20px;'>
                  Error: " . $stmt->error . "
                  </p>";
        }
    }

    $stmt->close(); // Close the prepared statement
}
?>
