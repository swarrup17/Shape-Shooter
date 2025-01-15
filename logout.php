<?php
session_start();
session_unset();  // Removes all session variables
session_destroy();  // Destroys the session

// Redirect the user to the homepage or login page
header("Location: index.php");
exit();
?>
