<?php
header('Content-Type: application/json');

// Database configuration
include('db_config.php');

$id = isset($_GET['id']) ? intval($_GET['id']) : null;

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($id !== null) {
        $stmt = $conn->prepare("SELECT id, text, icons FROM discussions WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    } else {
        $stmt = $conn->prepare("SELECT id, text, icons FROM discussions");
    }
    $stmt->execute();

    $discussions = array();
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $discussions[] = $row;
    }

    echo json_encode($discussions);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$conn = null;
?>
