<?php
include 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Handle bulk update for ingredient locations
    if (isset($_POST['bulk_update']) && $_POST['bulk_update'] == 'true') {
        $ids = json_decode($_POST['ids'], true); // Decode the JSON array of IDs
        $new_location = $_POST['new_location'];
        $id_placeholders = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $conn->prepare("UPDATE ingredients SET location=? WHERE id IN ($id_placeholders)");
        $types = str_repeat('i', count($ids));
        $stmt->bind_param("s" . $types, $new_location, ...$ids);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => $stmt->error]);
        }

        $stmt->close();
        $conn->close();
        exit;
    }

    $name = $_POST['name'];
    $type = $_POST['type'];
    $quantity = $_POST['quantity'];
    $expiry_date = $_POST['expiry_date'];
    $location = $_POST['location'];
    $icon = isset($_FILES['icon']['name']) && !empty($_FILES['icon']['name']) ? $_FILES['icon']['name'] : null;
    $target_dir = "images/ingredients/";
    $target_file = $icon ? $target_dir . basename($_FILES["icon"]["name"]) : null;

    // Attempt to upload the file if a new one is provided
    if ($icon && !move_uploaded_file($_FILES["icon"]["tmp_name"], $target_file)) {
        echo json_encode(["status" => "error", "message" => "Failed to upload file."]);
        exit;
    }

    // Add or update logic based on whether an ID is provided
    if (isset($_POST['id']) && !empty($_POST['id'])) {
        // Update existing ingredient
        $id = $_POST['id'];
        if ($icon) {
            $stmt = $conn->prepare("UPDATE ingredients SET name=?, type=?, quantity=?, expiry_date=?, location=?, icons=? WHERE id=?");
            $stmt->bind_param("ssssssi", $name, $type, $quantity, $expiry_date, $location, $icon, $id);
        } else {
            $stmt = $conn->prepare("UPDATE ingredients SET name=?, type=?, quantity=?, expiry_date=?, location=? WHERE id=?");
            $stmt->bind_param("sssssi", $name, $type, $quantity, $expiry_date, $location, $id);
        }
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

    $stmt->close();
    $conn->close();
}
?>
