<?php
include 'db_config.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];
$level = $data['level'];
$progress = $data['progress'];

$sql = "UPDATE habits SET level=?, progress=? WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('iii', $level, $progress, $id);

if ($stmt->execute()) {
    echo "Success";
} else {
    echo "Error: " . $conn->error;
}

$stmt->close();
$conn->close();
?>