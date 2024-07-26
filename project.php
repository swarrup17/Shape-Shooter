<?php

$conn = new mysqli("localhost","root","","web_project");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }else{
    echo "connected";
  }                      
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
   $score = $_POST['score'];
   $stmt = $conn->prepare("INSERT INTO scores (score) VALUES (?)");
   $stmt->bind_param("i", $score);

   // Execute the statement
   if ($stmt->execute()) {
       echo "New score saved successfully";
   } else {
       echo "Error: " . $stmt->error;
   }

   $stmt->close();
   $conn->close();
}
?>
                                                                      ?>