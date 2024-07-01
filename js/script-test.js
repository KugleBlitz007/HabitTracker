document.addEventListener('DOMContentLoaded', () => {
    const days = document.querySelectorAll('.day');
    const today = document.querySelector('.day.today');
    const roundBox = document.getElementById('round-box');
    const roundBoxImg = document.getElementById('round-box-img');
    const textBox = document.getElementById('text-box');
    const checkButton = document.getElementById('check-button');
    const modal = document.getElementById('image-modal');
    const closeModal = document.querySelector('.close');
    const selectableImages = document.querySelectorAll('.selectable-image');
    const outputContainer = document.getElementById('output-container');

    days.forEach(day => {
        day.addEventListener('click', () => {
            let progress = parseInt(day.getAttribute('data-progress'));
            progress = (progress + 1) % 5; // Cycle through 0 to 4
            day.setAttribute('data-progress', progress);

            // Remove all progress classes
            day.classList.remove('progress-1', 'progress-2', 'progress-3', 'progress-4');

            // Add the appropriate progress class
            if (progress > 0) {
                day.classList.add(`progress-${progress}`);
            }

            // Send the updated progress to the server
            const date = day.getAttribute('data-date');
            updateProgress(date, progress);
        });

        day.addEventListener('mouseover', () => {
            const date = day.getAttribute('data-date');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.innerText = date;
            day.appendChild(tooltip);
        });

        day.addEventListener('mouseout', () => {
            const tooltip = day.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });

    function updateProgress(date, progress) {
        fetch('update_progress.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date: date, progress: progress })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Progress updated successfully');
            } else {
                console.error('Failed to update progress');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Scroll to today's date
    if (today) {
        today.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }


    // Habit details 
    roundBox.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });

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

    function createNewDiscussionBox() {
        const newRoundBox = document.createElement('div');
        newRoundBox.className = 'round-box';
        const newRoundBoxImg = document.createElement('img');
        newRoundBoxImg.src = roundBoxImg.src;
        newRoundBoxImg.style.width = 'auto';
        newRoundBoxImg.style.height = '100%';
        newRoundBoxImg.style.objectFit = 'cover';
        newRoundBoxImg.style.borderRadius = '50%';
        newRoundBox.appendChild(newRoundBoxImg);

        const newRectangleBox = document.createElement('div');
        newRectangleBox.className = 'rectangle-box';
        newRectangleBox.textContent = textBox.textContent;

        const newCheckButton = document.createElement('div');
        newCheckButton.className = 'check-button';
        newCheckButton.textContent = '‎'; // Changed to use the "✓" symbol
        newCheckButton.setAttribute('contenteditable', 'false'); // Make check button non-editable
        newCheckButton.addEventListener('click', function() {
            // Send delete request to the server
            const xhrDelete = new XMLHttpRequest();
            xhrDelete.open("POST", "delete_day_to_day.php", true);
            xhrDelete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhrDelete.onreadystatechange = function() {
                if (xhrDelete.readyState === XMLHttpRequest.DONE) {
                    const response = JSON.parse(xhrDelete.responseText);
                    if (response.status === "success") {
                        newDiscussionBox.remove(); // Delete the discussion box
                        console.log("Discussion deleted successfully");
                    } else {
                        console.error("Error deleting discussion:", response.message);
                    }
                }
            };
            xhrDelete.send(`id=${newDiscussionBox.dataset.id}`);
        });

        const newDiscussionBox = document.createElement('div');
        newDiscussionBox.className = 'container';
        newDiscussionBox.appendChild(newRoundBox);
        newDiscussionBox.appendChild(newRectangleBox);
        newDiscussionBox.appendChild(newCheckButton); // Append check button to the container

        outputContainer.appendChild(newDiscussionBox);

        // Send data to the server
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "save_day_to_day.php", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const response = JSON.parse(xhr.responseText);
                if (response.status === "success") {
                    console.log("Discussion saved successfully");
                    newDiscussionBox.dataset.id = response.id; // Set the ID of the new discussion box
                } else {
                    console.error("Error saving discussion:", response.message);
                }
            }
        };
        xhr.send(`text=${encodeURIComponent(textBox.textContent)}&icon=${encodeURIComponent(roundBoxImg.src)}`);
    }

    checkButton.addEventListener('click', createNewDiscussionBox);

    // Fetch and display existing discussions
    function fetchDiscussions() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "fetch_day_to_day.php", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const discussions = JSON.parse(xhr.responseText);
                discussions.forEach(discussion => {
                    const newRoundBox = document.createElement('div');
                    newRoundBox.className = 'round-box';
                    const newRoundBoxImg = document.createElement('img');
                    newRoundBoxImg.src = discussion.icons;
                    newRoundBoxImg.style.width = 'auto';
                    newRoundBoxImg.style.height = '100%';
                    newRoundBoxImg.style.objectFit = 'cover';
                    newRoundBoxImg.style.borderRadius = '50%';
                    newRoundBox.appendChild(newRoundBoxImg);

                    const newRectangleBox = document.createElement('div');
                    newRectangleBox.className = 'rectangle-box';
                    newRectangleBox.textContent = discussion.text;

                    const newDiscussionBox = document.createElement('div');
                    newDiscussionBox.className = 'container';
                    newDiscussionBox.dataset.id = discussion.id; // Set the ID of the discussion box
                    newDiscussionBox.appendChild(newRoundBox);
                    newDiscussionBox.appendChild(newRectangleBox);

                    const newCheckButton = document.createElement('div');
                    newCheckButton.className = 'check-button';
                    newCheckButton.textContent = '‎'; // Changed to use the "✓" symbol
                    newCheckButton.setAttribute('contenteditable', 'false'); // Make check button non-editable
                    newCheckButton.addEventListener('click', function() {
                        // Send delete request to the server
                        const xhrDelete = new XMLHttpRequest();
                        xhrDelete.open("POST", "delete_day_to_day.php", true);
                        xhrDelete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        xhrDelete.onreadystatechange = function() {
                            if (xhrDelete.readyState === XMLHttpRequest.DONE) {
                                const response = JSON.parse(xhrDelete.responseText);
                                if (response.status === "success") {
                                    newDiscussionBox.remove(); // Delete the discussion box
                                    console.log("Discussion deleted successfully");
                                } else {
                                    console.error("Error deleting discussion:", response.message);
                                }
                            }
                        };
                        xhrDelete.send(`id=${discussion.id}`);
                    });

                    newDiscussionBox.appendChild(newCheckButton); // Append check button to the container

                    outputContainer.appendChild(newDiscussionBox);
                });
            }
        };
        xhr.send();
    }

    fetchDiscussions();
});

