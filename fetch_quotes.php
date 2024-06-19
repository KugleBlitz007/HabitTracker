<?php
header('Content-Type: application/json');

// Database configuration
include('db_config.php');

function html_entity_decode_utf8($string) {
    return html_entity_decode($string, ENT_QUOTES | ENT_HTML401, 'UTF-8');
}

try {
    $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("SELECT id, text, author FROM quotes");
    $stmt->execute();

    $quotes = array();
    while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $quotes[$row['id']] = [
            'text' => html_entity_decode_utf8($row['text']),
            'author' => html_entity_decode_utf8($row['author'])
        ];
    }

    echo json_encode($quotes);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

$conn = null;
?>
