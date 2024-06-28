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
    <link rel="stylesheet" href="css/styles-ingredients.css?v=1.0"> <!-- Add a version query string -->
</head>
<body>
    <div class="top-space">
       
    </div>
    <div class="container">
    <div id="round-box" class="round-box">
            <img id="round-box-img" src="images/add-icon.png" alt="Add Ingredient">
        </div>
        <div id="select-box" class="round-box">
            <span id="select-button">Select</span>
        </div>
        
        <button id="cancel-button" style="display: none;">Cancel</button>
    
        </div>
        
       
    </div>
    
    <!-- Add Ingredient Modal -->
    <div id="add-ingredient-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <form id="ingredient-form" enctype="multipart/form-data">
                <input type="text" id="name" name="name" placeholder="Name" required>
                <input type="text" id="type" name="type" placeholder="Type" required>
                <input type="text" id="quantity" name="quantity" placeholder="Quantity" required>
                <input type="date" id="expiry_date" name="expiry_date" placeholder="Expiry Date">
                <input type="text" id="location" name="location" placeholder="Location" required>
                <input type="file" id="icon" name="icon" accept="image/*">
                <button type="submit">Save Ingredient</button>
            </form>
        </div>
    </div>
    
    <div id="output-container" style="
    padding-bottom: 60px;
"></div> <!-- Container for displaying ingredients -->
    
    <!-- Edit Ingredient Modal -->
    <div id="edit-ingredient-modal" class="modal">
        <div class="modal-content">
            <span class="close edit-close">&times;</span> <!-- Add a unique class -->
            <form id="edit-ingredient-form">
                <label for="edit-name">Name:</label>
                <input type="text" id="edit-name" name="name">

                <label for="edit-type">Type:</label>
                <input type="text" id="edit-type" name="type">

                <label for="edit-quantity">Quantity:</label>
                <input type="text" id="edit-quantity" name="quantity">

                <label for="edit-expiry-date">Expiry Date:</label>
                <input type="date" id="edit-expiry-date" name="expiry_date">

                <label for="edit-location">Location:</label>
                <input type="text" id="edit-location" name="location">

                <label for="edit-icon">Icon:</label>
                <img id="edit-icon" src="">

                <button type="submit">Save Changes</button>
                <button type="button" id="delete-ingredient">Delete Ingredient</button>
            </form>
        </div>
    </div>
    
    <div id="image-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <!-- Modal content goes here -->
        </div>
    </div>
    
    <!-- Move Ingredients Modal -->
    <div id="move-ingredients-modal" class="modal">
        <div class="modal-content">
            <span class="close move-close">&times;</span>
            <h2>Move Ingredients</h2>
            <button class="move-to" data-location="Fridge">Fridge</button>
            <button class="move-to" data-location="Store">Store</button>
            <button class="move-to" data-location="List">List</button>
            <button class="move-to" data-location="Pantry">Pantry</button>
        </div>
    </div>
    
    <!-- Navigation bar -->
    <div class="nav-bar">
        <button id="home-button" class="active">Home</button>
        <button id="store-button">Store</button>
        <button id="list-button">List</button>
        <button id="recipe-button">Recipe</button>
    </div>
    
    <script src="js/script-ingredients.js"></script>
</body>
</html>
