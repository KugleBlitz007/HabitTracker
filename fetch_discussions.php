<?php
include 'db_config.php';

$result = $conn->query("SELECT * FROM discussions");

$discussions = [];
while ($row = $result->fetch_assoc()) {
    $discussions[] = $row;
}

echo json_encode($discussions);

$conn->close();
?>
