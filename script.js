document.addEventListener('DOMContentLoaded', function() {
    const habitBoxes = document.querySelectorAll('.habit-box');
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
        const habits = data.record;
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
                    saveProgress(habits);
                    
                });
            });

            function updateHabitLevel(levelElement, level) {
                levelElement.textContent = level;
            }

            habitLevel.setAttribute('contenteditable', 'true');
            habitLevel.addEventListener('blur', function() {
                level = parseInt(habitLevel.textContent);
                habits[`level-${index}`] = level;
                saveProgress(habits);
            });

            updateHabitLevel(habitLevel, level);
        });
    });

    // Save progress to JSONBin
    function saveProgress(habits) {
        fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY
            },
            body: JSON.stringify(habits)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Progress saved:', data);
        })
        .catch(error => {
            console.error('Error saving progress:', error);
        });
    }
});
