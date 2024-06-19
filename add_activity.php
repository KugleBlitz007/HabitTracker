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

    $stmt = $conn->prepare("INSERT INTO timetable (id, time, activity, details) VALUES (:id, :time, :activity, :details)");
    $stmt->bindParam(':id', $data['id']);
    $stmt->bindParam(':time', $data['time']);
    $stmt->bindParam(':activity', $data['activity']);
    $stmt->bindParam(':details', $data['details']);
    $stmt->execute();
    $lastId = $conn->lastInsertId(); // Get the ID of the newly inserted row
    echo json_encode(['status' => 'success', 'id' => $lastId]);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$conn = null;
?>