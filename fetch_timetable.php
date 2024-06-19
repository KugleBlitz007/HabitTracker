<?php
header('Content-Type: application/json');

// Database configuration
include('db_config.php');

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("SELECT id, time, activity, details FROM timetable");
    $stmt->execute();

    $timetable = array();
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $timetable[$row['id']] = $row;
    }

    echo json_encode($timetable);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$conn = null;
?>
