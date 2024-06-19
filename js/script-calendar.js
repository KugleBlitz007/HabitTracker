document.addEventListener('DOMContentLoaded', function() {
    const timeBoxesContainer = document.querySelector('.calendar-container');
    const addBox = document.getElementById('add-box');
    const BASE_URL = 'http://localhost:8888';

    let timetable = {};

    // Fetch data from the backend
    fetch(`${BASE_URL}/fetch_timetable.php`)
        .then(response => response.json())
        .then(data => {
            timetable = data;

            // Process existing timetable entries
            Object.keys(timetable).forEach((key) => {
                const timeText = timetable[key].time || '';
                const activityText = timetable[key].activity || '';

                if (timeText && activityText) { // Only create boxes if time and activity are not empty
                    const timeBox = createTimeBox(key, timeText, activityText, timetable[key].details || '');
                    timeBoxesContainer.appendChild(timeBox);
                }
            });

            // Highlight current time activity
            highlightCurrentTimeActivity(timetable);
        });

    // Save progress to the backend
    function saveProgress(data) {
        fetch(`${BASE_URL}/save_timetable.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Progress saved:', data);
        })
        .catch(error => {
            console.error('Error saving progress:', error);
        });
    }

    // Function to highlight the current time activity
    function highlightCurrentTimeActivity(timetable) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute; // Convert to minutes for easier comparison

        timeBoxesContainer.querySelectorAll('.time-box').forEach((timeBox) => {
            const timeElement = timeBox.querySelector('.time');
            const timeText = timeElement.textContent || '';
            const [startTime, endTime] = timeText.split(' - ');

            const start = convertTimeToMinutes(startTime);
            const end = convertTimeToMinutes(endTime);

            if (currentTime >= start && currentTime < end) {
                timeBox.classList.add('highlight');
                timeBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                timeBox.classList.remove('highlight');
            }
        });
    }

    // Function to convert time string (e.g., "9:30") to minutes
    function convertTimeToMinutes(time) {
        const [hour, minute] = time.split(':').map(Number);
        return hour * 60 + minute;
    }

    // Check and highlight the current time activity every minute
    setInterval(() => {
        fetch(`${BASE_URL}/fetch_timetable.php`)
            .then(response => response.json())
            .then(data => {
                timetable = data;
                highlightCurrentTimeActivity(timetable);
            });
    }, 60000); // Check every 60000 ms (1 minute)

   // Add new activity box
   addBox.addEventListener('click', () => {
    const newId = Object.keys(timetable).length + 1;
        const newBox = createTimeBox(newId, 'New Time', 'New Activity', '');
    timeBoxesContainer.appendChild(newBox);

    const newActivity = {
        id: newId,
        time: 'New Time',
        activity: 'New Activity',
        details: ''
    };

    // Add new activity to the timetable object
    timetable[newId] = newActivity;

    // Save new activity to the backend
    fetch(`${BASE_URL}/add_activity.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newActivity)
    })
    .then(response => response.json())
    .then(data => {
        console.log('New activity added:', data);
    })
    .catch(error => {
        console.error('Error adding new activity:', error);
    });

    // Scroll to the bottom of the container
    newBox.scrollIntoView({ behavior: 'smooth', block: 'end' });
});


    // Function to toggle expand/collapse of a time box
    function toggleExpandTimeBox(timeBox, key) {
        if (!timeBox.classList.contains('expanded')) {
            // Temporarily add a margin to the bottom of the page
            document.body.style.marginBottom = '1000px';
            
            timeBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            setTimeout(() => {
                expandTimeBox(timeBox, key);
                // Remove the temporary margin
                document.body.style.marginBottom = '';
            }, 500); // Delay to allow scrolling before expanding
        } 
    }

    function updateTimetableOrder() {
        const updatedTimetable = {};
        const timeBoxes = timeBoxesContainer.querySelectorAll('.time-box');
        timeBoxes.forEach((box, index) => {
            const key = box.id;
            updatedTimetable[key] = timetable[key];
        });
        timetable = updatedTimetable;
        saveProgress(timetable);
    }

    // Function to expand a time box
    function expandTimeBox(timeBox, key) {
        timeBox.classList.add('expanded');

        const detailsBox = document.createElement('div');
        detailsBox.classList.add('details-box', 'visible');

        const detailsInput = document.createElement('textarea');
        detailsInput.classList.add('details-input');
        detailsInput.placeholder = 'Add details about this activity...';
        detailsInput.value = timetable[key].details || '';

        const detailsButtons = document.createElement('div');
        detailsButtons.classList.add('details-buttons');

        const closeButton = document.createElement('button');
        closeButton.classList.add('close-btn');
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', function() {
            collapseTimeBox(timeBox, key);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            timeBox.remove();
            delete timetable[key];
            saveProgress(timetable);

            // Remove the activity from the backend
            fetch(`${BASE_URL}/delete_activity.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: key })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Activity deleted:', data);
            })
            .catch(error => {
                console.error('Error deleting activity:', error);
            });
        });

        const upButton = document.createElement('button');
        upButton.classList.add('up-btn');
        upButton.textContent = 'Up';
        upButton.addEventListener('click', function() {
            const prevSibling = timeBox.previousElementSibling;
            if (prevSibling && prevSibling.classList.contains('time-box')) {
                swapTimetableEntries(timeBox.id, prevSibling.id);
                timeBoxesContainer.insertBefore(timeBox, prevSibling);
                updateTimetableOrder();
            }
        });


        const downButton = document.createElement('button');
        downButton.classList.add('down-btn');
        downButton.textContent = 'Down';
        downButton.addEventListener('click', function() {
            const nextSibling = timeBox.nextElementSibling;
            if (nextSibling && nextSibling.classList.contains('time-box')) {
                swapTimetableEntries(timeBox.id, nextSibling.id);
                timeBoxesContainer.insertBefore(nextSibling, timeBox);
                updateTimetableOrder();
            }
        });

        detailsButtons.appendChild(closeButton);
        detailsButtons.appendChild(deleteButton);
        detailsBox.appendChild(detailsInput);
        detailsBox.appendChild(detailsButtons);
        detailsButtons.appendChild(upButton);
        detailsButtons.appendChild(downButton);
        timeBox.appendChild(detailsBox);

        detailsInput.addEventListener('blur', function() {
            timetable[key].details = detailsInput.value;
            saveProgress(timetable);
        });
    }

    // Function to collapse a time box
    function collapseTimeBox(timeBox, key) {
        timeBox.classList.remove('expanded');
        timeBox.querySelector('.details-box').remove();
        document.body.style.paddingTop = '500px';
        timeBox.scrollIntoView({ behavior: 'smooth', block: 'end' });
        document.body.style.paddingTop = '';
    }

    // Function to create a time box element
    function createTimeBox(key, timeText, activityText, detailsText) {
        const timeBox = document.createElement('div');
        timeBox.classList.add('time-box');
        timeBox.id = key;

        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        timeElement.contentEditable = true;
        timeElement.textContent = timeText;

        const activityElement = document.createElement('div');
        activityElement.classList.add('activity');
        activityElement.contentEditable = true;
        activityElement.textContent = activityText;

        timeBox.appendChild(timeElement);
        timeBox.appendChild(activityElement);

        timeBox.addEventListener('click', function(event) {
            if (!event.target.closest('.details-box')) {
                toggleExpandTimeBox(timeBox, key);
            }
        });

        timeElement.addEventListener('blur', function() {
            timetable[key] = {
                time: timeElement.textContent,
                activity: activityElement.textContent,
                details: detailsText
            };
            saveProgress(timetable);
        });

        activityElement.addEventListener('blur', function() {
            timetable[key] = {
                time: timeElement.textContent,
                activity: activityElement.textContent,
                details: detailsText
            };
            saveProgress(timetable);
        });

        return timeBox;
    }

    
    // Function to swap timetable entries
    function swapTimetableEntries(id1, id2) {
        const temp = timetable[id1];
        timetable[id1] = timetable[id2];
        timetable[id2] = temp;
        saveProgress(timetable);
    }
});
