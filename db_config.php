<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "habittracker";
$port = 8889; // Add this line if necessary

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname,$port);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>