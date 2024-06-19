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

    foreach ($data as $id => $entry) {
        $stmt = $conn->prepare("REPLACE INTO quotes (id, text, author) VALUES (:id, :text, :author)");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':text', html_encode_utf8($entry['text']));
        $stmt->bindParam(':author', html_encode_utf8($entry['author']));
        $stmt->execute();
    }

    echo json_encode(['status' => 'success']);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$conn = null;
?>
