<?php
// Include your server configuration file
include 'db_config.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Round and Rectangle Box Layout</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="css/styles-discussions.css?v=1.0"> <!-- Add a version query string -->
</head>
<body>
<div class="top-space">
        <!-- Future button layout can be added here -->
    </div>
    <div class="container">
        <div id="round-box" class="round-box">
            <img id="round-box-img" src="images/add-icon.png" alt="Image Description">
        </div>
        <div class="rectangle-box" contenteditable="true" id="text-box">
            New Discussion
            <div class="check-button" id="check-button"  contenteditable="false">‎</div>
        </div>
    </div>
    <div id="output-container"></div> <!-- Container for new elements -->
    <div id="image-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Select an Image</h2>
            <div class="image-list">
                <img src="images/icons/Johann.jpg" alt="Image 1" class="selectable-image">
                <img src="images/icons/Ticia.jpg" alt="Image 2" class="selectable-image">
                <img src="images/icons/Titinana.jpg" alt="Image 3" class="selectable-image">
                <img src="images/icons/Pierre.jpg" alt="Image 4" class="selectable-image">
                <img src="images/icons/Papa.jpg" alt="Image 5" class="selectable-image">
                <img src="images/icons/Maman.jpg" alt="Image 6" class="selectable-image">
                <img src="images/icons/Jaylan.jpg" alt="Image 7" class="selectable-image">
                <img src="images/icons/Nanne.jpg" alt="Image 8" class="selectable-image">
                <img src="images/icons/Bill.jpg" alt="Image 9" class="selectable-image">
                <img src="images/icons/Jamila.jpg" alt="Image 10" class="selectable-image">
                <img src="images/icons/Mariam.jpg" alt="Image 11" class="selectable-image">
                <!-- Add more images as needed -->
            </div>
        </div>
    </div>
    <script src="js/script-discussions.js"></script>
</body>
</html>



