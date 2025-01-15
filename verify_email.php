<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $code = $_POST['code'];

    $query = "SELECT * FROM users WHERE email = '$email' AND verification_code = '$code'";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) > 0) {
        $updateQuery = "UPDATE users SET is_verified = 1 WHERE email = '$email'";
        if (mysqli_query($conn, $updateQuery)) {
            echo "Email verified successfully.";
        } else {
            echo "Error: " . mysqli_error($conn);
        }
    } else {
        echo "Invalid verification code.";
    }
}
?>
