document.addEventListener('DOMContentLoaded', function() {
    const timeBoxesContainer = document.querySelector('.calendar-container');
    const addBox = document.getElementById('add-box');
    const API_KEY = '$2a$10$KMjxRh5ITdh/hqS4iCEsTeT1e3SZTCv/0LklzIhtct466BH.9j6DO'; // Replace with your JSONBin API Key
    const BIN_ID = '666861d1ad19ca34f8778b21'; // Replace with your JSONBin Bin ID

    let calendar = {};

    // Fetch data from JSONBin
    fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        method: 'GET',
        headers: {
            'X-Master-Key': API_KEY
        }
    })
    .then(response => response.json())
    .then(data => {
        calendar = data.record.calendar;

        // Process existing calendar entries
        Object.keys(calendar).forEach((key, index) => {
            const timeText = calendar[key].time || '';
            const activityText = calendar[key].activity || '';

            if (timeText && activityText) { // Only create boxes if time and activity are not empty
                const timeBox = createTimeBox(key, timeText, activityText);
                timeBoxesContainer.appendChild(timeBox);
            }
        });

        // Highlight current time activity
        highlightCurrentTimeActivity(calendar);
    });

    // Save progress to JSONBin
    function saveProgress(data) {
        fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
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
    function highlightCurrentTimeActivity(calendar) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute; // Convert to minutes for easier comparison

        timeBoxesContainer.querySelectorAll('.time-box').forEach((timeBox, index) => {
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
        fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': API_KEY
            }
        })
        .then(response => response.json())
        .then(data => {
            const calendar = data.record.calendar;
            highlightCurrentTimeActivity(calendar);
        });
    }, 60000); // Check every 60000 ms (1 minute)

    // Add new activity box
    addBox.addEventListener('click', () => {
        const newIndex = `box-${Object.keys(calendar).length + 1}`;
        const newBox = createTimeBox(newIndex, 'New Time', 'New Activity');
        timeBoxesContainer.appendChild(newBox);

        calendar[newIndex] = {
            time: 'New Time',
            activity: 'New Activity'
        };

        saveProgress({ calendar }); // Save immediately after adding
    });

    // Function to toggle expand/collapse of a time box
    function toggleExpandTimeBox(timeBox, key) {
        if (!timeBox.classList.contains('expanded')) {
            timeBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                expandTimeBox(timeBox, key);
            }, 500); // Delay to allow scrolling before expanding
        } else {
            collapseTimeBox(timeBox, key);
        }
    }

    // Function to expand a time box
    function expandTimeBox(timeBox, key) {
        timeBox.classList.add('expanded');

        const detailsBox = document.createElement('div');
        detailsBox.classList.add('details-box', 'visible');

        const detailsInput = document.createElement('textarea');
        detailsInput.classList.add('details-input');
        detailsInput.placeholder = 'Add details about this activity...';
        detailsInput.value = calendar[key].details || '';

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
            delete calendar[key];
            saveProgress({ calendar });
        });

        detailsButtons.appendChild(closeButton);
        detailsButtons.appendChild(deleteButton);
        detailsBox.appendChild(detailsInput);
        detailsBox.appendChild(detailsButtons);
        timeBox.appendChild(detailsBox);

        detailsInput.addEventListener('blur', function() {
            calendar[key].details = detailsInput.value;
            saveProgress({ calendar });
        });
    }

    // Function to collapse a time box
    function collapseTimeBox(timeBox, key) {
        timeBox.classList.remove('expanded');
        timeBox.querySelector('.details-box').remove();
    }

    // Function to create a time box element
    function createTimeBox(key, timeText, activityText) {
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
            calendar[key] = {
                time: timeElement.textContent,
                activity: activityElement.textContent
            };
            saveProgress({ calendar });
        });

        activityElement.addEventListener('blur', function() {
            calendar[key] = {
                time: timeElement.textContent,
                activity: activityElement.textContent
            };
            saveProgress({ calendar });
        });

        return timeBox;
    }
});
