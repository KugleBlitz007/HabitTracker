document.addEventListener('DOMContentLoaded', function() {
    const roundBox = document.getElementById('round-box');
    const addIngredientModal = document.getElementById('add-ingredient-modal');
    const closeModal = document.querySelector('.close');
    const outputContainer = document.getElementById('output-container');

    // Event listener to open the modal
    roundBox.addEventListener('click', function() {
        addIngredientModal.style.display = 'block';
    });

    // Event listener to close the modal
    closeModal.addEventListener('click', function() {
        console.log("Close button clicked");  // Check if this logs when you click the close button
        addIngredientModal.style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target == addIngredientModal) {
            addIngredientModal.style.display = 'none';
        }
    });

    const roundBoxImg = document.getElementById('round-box-img');
    const textBox = document.getElementById('text-box');
    const checkButton = document.getElementById('check-button');
    const modal = document.getElementById('image-modal');
    const selectableImages = document.querySelectorAll('.selectable-image');

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    selectableImages.forEach(function(image) {
        image.addEventListener('click', function() {
            roundBoxImg.src = image.src;
            modal.style.display = 'none';
        });
    });

    // Function to open the edit modal
    function openEditModal(ingredient) {
        const editModal = document.getElementById('edit-ingredient-modal');
        console.log('Modal element:', editModal);

        if (editModal) {
            const editName = document.getElementById('edit-name');
            const editType = document.getElementById('edit-type');
            const editQuantity = document.getElementById('edit-quantity');
            const editExpiryDate = document.getElementById('edit-expiry-date');
            const editLocation = document.getElementById('edit-location');
            const editIcon = document.getElementById('edit-icon');
            const editForm = document.getElementById('edit-ingredient-form');

            console.log({editName, editType, editQuantity, editExpiryDate, editLocation, editIcon}); // Log to see which is null

            if (editName && editType && editQuantity && editExpiryDate && editLocation && editIcon) {
                editName.value = ingredient.name;
                editType.value = ingredient.type;
                editQuantity.value = ingredient.quantity;
                editExpiryDate.value = ingredient.expiry_date;
                editLocation.value = ingredient.location;
                editIcon.src = `images/ingredients/${ingredient.icons}`;
                editForm.dataset.id = ingredient.id; // Store the ingredient ID in the form's dataset
                document.getElementById('edit-ingredient-modal').style.display = 'block';
            } else {
                console.error('One or more elements are missing in the modal form.');
            }
        } else {
            console.error('Edit modal is not found in the DOM.');
        }
    }

    // Fetch and display existing ingredients
    function fetchIngredients() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "fetch_ingredients.php", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const ingredients = JSON.parse(xhr.responseText);
                displayIngredients(ingredients);
            }
        };
        xhr.send();
    }

    function displayIngredients(ingredients) {
        outputContainer.innerHTML = ''; // Clear existing content
        ingredients.forEach(ingredient => {
            const ingredientElement = document.createElement('div');
            ingredientElement.className = 'ingredient-item';

            const imageContainer = document.createElement('div');
            imageContainer.className = 'ingredient-image-container';
            const image = document.createElement('img');
            image.src = `images/ingredients/${ingredient.icons}`;
            image.alt = `${ingredient.name}`;
            image.className = 'ingredient-image';
            imageContainer.appendChild(image);

            const textContainer = document.createElement('div');
            textContainer.className = 'ingredient-text-container';
            textContainer.innerHTML = `
                <div class="ingredient-name">${ingredient.name}</div>
                <div class="ingredient-quantity">${ingredient.quantity}</div>
            `;

            ingredientElement.appendChild(imageContainer);
            ingredientElement.appendChild(textContainer);

            // Add event listener to open edit modal or select ingredient
            ingredientElement.addEventListener('click', function() {
                if (selecting) {
                    this.classList.toggle('selected');
                    if (this.classList.contains('selected')) {
                        selectedIngredients.push(ingredient);
                    } else {
                        selectedIngredients = selectedIngredients.filter(item => item.id !== ingredient.id);
                    }
                } else {
                    openEditModal(ingredient);
                }
            });

            outputContainer.appendChild(ingredientElement);
        });
    }

    // Handle form submission for adding a new ingredient
    document.getElementById('ingredient-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "save_ingredients.php", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log("Response:", xhr.responseText);
                    addIngredientModal.style.display = 'none'; // Close the modal
                    fetchIngredients(); // Refresh the ingredients list
                } else {
                    console.error("Failed with status:", xhr.status, "Response:", xhr.responseText);
                }
            }
        };
        xhr.send(formData);
    });

    // Close edit modal when clicking the close button
    const editModalCloseButton = document.querySelector('#edit-ingredient-modal .close.edit-close');
    editModalCloseButton.addEventListener('click', function() {
        const editModal = document.getElementById('edit-ingredient-modal');
        editModal.style.display = 'none';
    });

    // Handle edit form submission
    const editForm = document.getElementById('edit-ingredient-form');
    editForm.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent the default form submission

        const formData = new FormData(this);  // Gather form data
        formData.append('id', this.dataset.id); // Append the ingredient ID to the form data

        // Perform the AJAX request
        fetch('save_ingredients.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Log the response from the server
            if (data.status === 'success') {
                alert('Ingredient updated successfully!');
                document.getElementById('edit-ingredient-modal').style.display = 'none'; // Close the modal
                fetchIngredients(); // Refresh the ingredients list
            } else {
                alert('Failed to update ingredient: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Handle delete button click
    const deleteButton = document.getElementById('delete-ingredient');
    deleteButton.addEventListener('click', function() {
        const ingredientId = editForm.dataset.id;

        if (confirm('Are you sure you want to delete this ingredient?')) {
            // Perform the AJAX request to delete the ingredient
            fetch('delete_ingredient.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `id=${ingredientId}`
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);  // Log the response from the server
                if (data.status === 'success') {
                    alert('Ingredient deleted successfully!');
                    document.getElementById('edit-ingredient-modal').style.display = 'none'; // Close the modal
                    fetchIngredients(); // Refresh the ingredients list
                } else {
                    alert('Failed to delete ingredient: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });

    // Filter ingredients based on location
    function filterIngredients(location) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "fetch_ingredients.php", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const ingredients = JSON.parse(xhr.responseText);
                const filteredIngredients = ingredients.filter(ingredient => {
                    if (location === 'home') {
                        return ingredient.location !== 'Store' && ingredient.location !== 'List';
                    }
                    return ingredient.location === location;
                });
                displayIngredients(filteredIngredients);
            }
        };
        xhr.send();
    }

    // Event listeners for navigation buttons
    const navButtons = document.querySelectorAll('.nav-bar button');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'active' class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            // Add 'active' class to the clicked button
            this.classList.add('active');

            // Filter ingredients based on the button clicked
            if (this.id === 'home-button') {
                filterIngredients('home');
            } else if (this.id === 'store-button') {
                filterIngredients('Store');
            } else if (this.id === 'list-button') {
                filterIngredients('List');
            } else if (this.id === 'recipe-button') {
                // No action for now
            }
        });
    });

    // Set the initial active button and filter ingredients to 'home'
    document.getElementById('home-button').classList.add('active');
    filterIngredients('home');

    const selectButton = document.getElementById('select-button');
    const cancelButton = document.getElementById('cancel-button');
    const moveIngredientsModal = document.getElementById('move-ingredients-modal');
    const moveCloseButton = document.querySelector('.move-close');
    let selecting = false;
    let selectedIngredients = [];

    selectButton.addEventListener('click', function() {
        selecting = !selecting;
        if (selecting) {
            selectButton.textContent = 'Move To';
            cancelButton.style.display = 'inline-block';
        } else {
            moveIngredientsModal.style.display = 'block';
        }
    });

    cancelButton.addEventListener('click', function() {
        selecting = false;
        selectButton.textContent = 'Select';
        cancelButton.style.display = 'none';
        selectedIngredients = [];
        document.querySelectorAll('.ingredient-item.selected').forEach(item => item.classList.remove('selected'));
    });

    moveCloseButton.addEventListener('click', function() {
        moveIngredientsModal.style.display = 'none';
    });

    document.querySelectorAll('.move-to').forEach(button => {
        button.addEventListener('click', function() {
            const newLocation = this.dataset.location;
            const ids = selectedIngredients.map(ingredient => ingredient.id);

            fetch('save_ingredients.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `bulk_update=true&ids=${JSON.stringify(ids)}&new_location=${newLocation}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Ingredients moved successfully!');
                    moveIngredientsModal.style.display = 'none';
                    fetchIngredients(); // Refresh the ingredients list
                } else {
                    alert('Failed to move ingredients: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
});
