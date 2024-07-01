<?php
include 'db_config.php';

// Get the JSON data from the request
$data = json_decode(file_get_contents('php://input'), true);

$date = $data['date'];
$progress = $data['progress'];

// Update the progress in the database
$sql = "UPDATE habit_calendar SET progress = ? WHERE date = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('is', $progress, $date);

$response = array();
if ($stmt->execute()) {
    $response['success'] = true;
} else {
    $response['success'] = false;
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>
