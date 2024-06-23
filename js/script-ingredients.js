document.addEventListener('DOMContentLoaded', function() {
    const roundBox = document.getElementById('round-box');
    const addIngredientModal = document.getElementById('add-ingredient-modal');
    const closeModal = document.querySelector('.close');

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
    const outputContainer = document.getElementById('output-container');

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

            console.log({editName, editType, editQuantity, editExpiryDate, editLocation, editIcon}); // Log to see which is null

            if (editName && editType && editQuantity && editExpiryDate && editLocation && editIcon) {
                editName.value = ingredient.name;
                editType.value = ingredient.type;
                editQuantity.value = ingredient.quantity;
                editExpiryDate.value = ingredient.expiry_date;
                editLocation.value = ingredient.location;
                editIcon.src = `images/ingredients/${ingredient.icons}`;
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

                    // Add event listener to open edit modal
                    ingredientElement.addEventListener('click', function() {
                        openEditModal(ingredient);
                    });

                    document.getElementById('output-container').appendChild(ingredientElement);
                });
            }
        };
        xhr.send();
    }

    fetchIngredients();

    // Handle form submission
    document.getElementById('ingredient-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "save_ingredients.php", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log("Response:", xhr.responseText);
                } else {
                    console.error("Failed with status:", xhr.status, "Response:", xhr.responseText);
                }
            }
        };
        xhr.send(formData);
    });

    // Close edit modal when clicking the close button
    const editModalCloseButton = document.querySelector('.close');
    editModalCloseButton.addEventListener('click', function() {
        const editModal = document.getElementById('edit-ingredient-modal');
        editModal.style.display = 'none';
    });

    // Handle edit form submission
    const editForm = document.getElementById('edit-ingredient-form');
    editForm.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent the default form submission

        const formData = new FormData(this);  // Gather form data

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
                // Optionally close the modal here
                document.getElementById('edit-ingredient-modal').style.display = 'none';
            } else {
                alert('Failed to update ingredient: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
