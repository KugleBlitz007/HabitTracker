<?php
include 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $text = $_POST['text'];
    $icon = $_POST['icon'];

    $stmt = $conn->prepare("INSERT INTO discussions (text, icons) VALUES (?, ?)");
    $stmt->bind_param("ss", $text, $icon);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["status" => "error", "message" => $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}
?>
