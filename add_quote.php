<?php
header('Content-Type: application/json');

// Database configuration
include('db_config.php');

// Function to encode HTML entities
function html_encode_utf8($string) {
    return htmlentities($string, ENT_QUOTES | ENT_HTML401, 'UTF-8');
}

// Get the raw POST data
$postData = file_get_contents('php://input');
$data = json_decode($postData, true);

try {
    $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("INSERT INTO quotes (text, author) VALUES (:text, :author)");
    $stmt->bindParam(':text', html_encode_utf8($data['text']));
    $stmt->bindParam(':author', html_encode_utf8($data['author']));
    $stmt->execute();

    $lastId = $conn->lastInsertId(); // Get the ID of the newly inserted row
    echo json_encode(['status' => 'success', 'id' => $lastId]);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$conn = null;
?>
