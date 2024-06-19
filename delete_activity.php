<?php
header('Content-Type: application/json');

// Database configuration
include('db_config.php');

// Get the raw POST data
$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("DELETE FROM timetable WHERE id = :id");
    $stmt->bindParam(':id', $data['id']);
    $stmt->execute();

    echo json_encode(['status' => 'success']);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$conn = null;
?>
