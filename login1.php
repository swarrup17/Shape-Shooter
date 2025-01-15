<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Login</h1>
        <form action="login.php" method="POST">
            <input type="text" name="username" placeholder="Enter username" required>
            <input type="password" name="password" placeholder="Enter password" required>
            <button type="submit">Login</button>
        </form>
        <p style="display: inline-block;
    margin: 10px;
    padding: 12px 25px;
    background-color:rgb(1, 3, 11);
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    transition: transform 0.2s, background-color 0.3s;">Don't have an account? <a href="signup1.php"class="login">Sign Up</a></p>
    </div>
</body>
</html>
