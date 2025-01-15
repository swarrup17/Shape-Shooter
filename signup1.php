<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signup</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Create an Account</h1>
        <form action="signup.php" method="POST">
            <!-- Username field -->
            <input type="text" name="username" placeholder="Enter your username" required>
            
            <!-- Password field -->
            <input type="password" name="password" placeholder="Enter your password" required>
            
            <!-- Email field -->
            <input type="email" name="email" placeholder="Enter your email" required>
            
            <!-- Age field -->
            <input type="number" name="age" placeholder="Enter your age" required min="1" max="120">
            
            <!-- Gender selection -->
            <select name="gender" required>
                <option value="" disabled selected>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            
            <!-- Submit button -->
            <button type="submit">Signup</button>
        </form>
        <p style="display: inline-block;
    margin: 8px;
    padding: 15px 25px;
    background-color:rgb(0, 1, 3);
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    transition: transform 0.2s, background-color 0.3s;">Already have an account? <a href="login1.php" class="login">Login here</a></p>
    </div>
</body>
</html>
