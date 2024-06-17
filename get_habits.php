<?php
include 'db_config.php';

$sql = "SELECT id, icon, level, progress FROM habits";
$result = $conn->query($sql);

$habits = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $habits[] = $row;
    }
}

echo json_encode($habits);

$conn->close();
?>