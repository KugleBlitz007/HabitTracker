document.addEventListener('DOMContentLoaded', function() {
    const habitBoxes = document.querySelectorAll('.habit-box');
    const timeBoxes = document.querySelectorAll('.time-box');
    const API_KEY = '$2a$10$KMjxRh5ITdh/hqS4iCEsTeT1e3SZTCv/0LklzIhtct466BH.9j6DO'; // Replace with your JSONBin API Key
    const BIN_ID = '66665824acd3cb34a855386b'; // Replace with your JSONBin Bin ID

    // Fetch data from JSONBin
    fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        method: 'GET',
        headers: {
            'X-Master-Key': API_KEY
        }
    })
    .then(response => response.json())
    .then(data => {
        const habits = data.record.habits;
        const calendar = data.record.calendar;

        // Process habits
        habitBoxes.forEach((habitBox, index) => {
            const bars = habitBox.querySelectorAll('.progress-bar');
            const habitLevel = habitBox.querySelector('.habit-level');
            let progress = habits[`progress-${index}`] || 0;
            let level = habits[`level-${index}`] || 0;

            bars.forEach((bar, barIndex) => {
                if (barIndex < progress) {
                    bar.classList.add('clicked');
                }

                bar.addEventListener('click', function() {
                    if (bar.classList.contains('clicked')) {
                        bar.classList.remove('clicked');
                        progress -= 1;
                    } else {
                        bar.classList.add('clicked');
                        progress += 1;
                    }
                    habits[`progress-${index}`] = progress;
                    if (progress === bars.length) {
                        level += 1;
                        progress = 0;
                        bars.forEach(b => b.classList.remove('clicked'));
                        habits[`progress-${index}`] = progress;
                        habits[`level-${index}`] = level;
                    }
                    updateHabitLevel(habitLevel, level);
                    saveProgress({habits, calendar});
                });
            });

            function updateHabitLevel(levelElement, level) {
                levelElement.textContent = level;
            }

            habitLevel.setAttribute('contenteditable', 'true');
            habitLevel.addEventListener('blur', function() {
                level = parseInt(habitLevel.textContent);
                habits[`level-${index}`] = level;
                saveProgress({habits, calendar});
            });

            updateHabitLevel(habitLevel, level);
        });

        // Process calendar
        timeBoxes.forEach((timeBox, index) => {
            const timeElement = timeBox.querySelector('.time');
            const activityElement = timeBox.querySelector('.activity');
            const timeText = calendar[`time-${index}`] || '';
            const activityText = calendar[`activity-${index}`] || '';

            timeElement.textContent = timeText;
            activityElement.textContent = activityText;

            function saveCalendarData() {
                calendar[`time-${index}`] = timeElement.textContent;
                calendar[`activity-${index}`] = activityElement.textContent;
                saveProgress({habits, calendar});
            }

            timeElement.addEventListener('blur', saveCalendarData);
            activityElement.addEventListener('blur', saveCalendarData);
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

        timeBoxes.forEach((timeBox, index) => {
            const timeElement = timeBox.querySelector('.time');
            const timeText = calendar[`time-${index}`] || '';
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
});