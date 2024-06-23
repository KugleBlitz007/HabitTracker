<?php
include 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'];
    $type = $_POST['type'];
    $quantity = $_POST['quantity'];
    $expiry_date = $_POST['expiry_date'];
    $location = $_POST['location'];
    $icon = $_FILES['icon']['name'];
    $target_dir = "images/ingredients/";
    $target_file = $target_dir . basename($_FILES["icon"]["name"]);

    // Attempt to upload the file
    if (move_uploaded_file($_FILES["icon"]["tmp_name"], $target_file)) {
        // Add or update logic based on whether an ID is provided
        if (isset($_POST['id']) && !empty($_POST['id'])) {
            // Update existing ingredient
            $id = $_POST['id'];
            $stmt = $conn->prepare("UPDATE ingredients SET name=?, type=?, quantity=?, expiry_date=?, location=?, icons=? WHERE id=?");
            $stmt->bind_param("ssssssi", $name, $type, $quantity, $expiry_date, $location, $icon, $id);
        } else {
            // Insert new ingredient
            $stmt = $conn->prepare("INSERT INTO ingredients (name, type, quantity, expiry_date, location, icons) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssss", $name, $type, $quantity, $expiry_date, $location, $icon);
        }

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "id" => $stmt->insert_id]);
        } else {
            echo json_encode(["status" => "error", "message" => $stmt->error]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to upload file."]);
    }

    $stmt->close();
    $conn->close();
}
?>
