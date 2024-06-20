document.addEventListener('DOMContentLoaded', function() {
    const homeBoxes = document.querySelectorAll('.home-box');
    const BASE_URL = 'http://localhost:8888/htdocs'; // Adjust if necessary

    async function fetchData(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}/${endpoint}`, { method: 'GET' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch data from ${endpoint}:`, error);
            return null;
        }
    }

    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    async function displayRandomQuote() {
        const quotes = await fetchData('fetch_quotes.php');
        if (quotes) {
            const quoteBox = document.getElementById('quote-box');
            const randomQuote = getRandomItem(Object.values(quotes));
            quoteBox.innerHTML = `
                <div class="quote-text">${randomQuote.text}</div>
                <div class="quote-author">- ${randomQuote.author}</div>
            `;
            quoteBox.addEventListener('click', () => {
                window.location.href = 'quotes.php';
            });
        }
    }

    async function displayHighlight() {
        const timetable = await fetchData('fetch_timetable.php');
        if (timetable) {
            const highlightBox = document.getElementById('highlight-box');
            let highlightText = 'No current highlights';
            let highlightTime = '';
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();

            for (const key in timetable) {
                const { time, activity } = timetable[key];
                if (time && activity) {
                    const [startTime, endTime] = time.split(' - ').map(convertTimeToMinutes);
                    if (currentTime >= startTime && currentTime < endTime) {
                        highlightText = activity;
                        highlightTime = time;
                        break;
                    }
                }
            }

            highlightBox.innerHTML = `
                <div class="highlight-time">${highlightTime}</div>
                <div class="highlight-text">${highlightText}</div>
            `;
            highlightBox.addEventListener('click', () => {
                window.location.href = 'calendar.php';
            });
        }
    }

    async function displayRandomHabit() {
        const habits = await fetchData('get_habits.php');
        if (habits) {
            const habitBox = document.getElementById('habit-box');
            const randomHabit = getRandomItem(habits);
            const habitIndex = randomHabit.id - 1;
            const habitImages = [
                'images/terminal.png',
                'images/dumbell.png',
                'images/camera.png',
                'images/charisma.png',
                'images/culture.png',
                'images/school.png'
            ];
            const habitTitles = [
                'Coding',
                'Exercise',
                'Photography',
                'Charisma',
                'Culture',
                'School'
            ];

            habitBox.innerHTML = `
                <div class="image-box">
                    <img src="${habitImages[habitIndex]}" alt="Habit Icon">
                </div>
                <div class="habit-title">${habitTitles[habitIndex]}</div>
                <div class="progress-container">
                    <div class="habit-level" contenteditable="true">Level: ${randomHabit.level}</div>
                    <div class="progress-bars">
                        ${Array(10).fill(0).map((_, i) => `
                            <div class="progress-bar ${i < randomHabit.progress ? 'filled' : ''}"></div>
                        `).join('')}
                    </div>
                </div>
            `;

            const bars = habitBox.querySelectorAll('.progress-bar');
            const habitLevelElement = habitBox.querySelector('.habit-level');
            let progress = randomHabit.progress;
            let level = randomHabit.level;

            function updateHabitLevel(levelElement, level) {
                levelElement.textContent = `Level: ${level}`;
            }

            async function saveProgress(habit) {
                try {
                    const response = await fetch(`${BASE_URL}/save_habit.php`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(habit)
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    console.log('Progress saved:', await response.text());
                } catch (error) {
                    console.error('Error saving progress:', error);
                }
            }

            bars.forEach((bar, barIndex) => {
                bar.addEventListener('click', () => {
                    if (bar.classList.contains('filled')) {
                        bar.classList.remove('filled');
                        progress--;
                    } else {
                        bar.classList.add('filled');
                        progress++;
                    }
                    randomHabit.progress = progress;

                    if (progress === bars.length) {
                        level++;
                        progress = 0;
                        bars.forEach(b => b.classList.remove('filled'));
                        randomHabit.progress = progress;
                        randomHabit.level = level;
                    }

                    updateHabitLevel(habitLevelElement, level);
                    saveProgress(randomHabit);
                });
            });

            habitLevelElement.addEventListener('blur', () => {
                const newLevel = parseInt(habitLevelElement.textContent.replace('Level: ', ''), 10);
                if (!isNaN(newLevel) && newLevel !== level) {
                    level = newLevel;
                    randomHabit.level = level;
                    saveProgress(randomHabit);
                } else {
                    updateHabitLevel(habitLevelElement, level);
                }
            });

            updateHabitLevel(habitLevelElement, level);
        }
    }

    async function fetchDiscussionById(id) {
        try {
            const response = await fetch(`${BASE_URL}/fetch_discussions.php?id=${id}`, { method: 'GET' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const discussions = await response.json();
            return discussions.length > 0 ? discussions[0] : null;
        } catch (error) {
            console.error(`Failed to fetch discussion with ID ${id}:`, error);
            return null;
        }
    }

    async function displayRandomDiscussion() {
        const discussions = await fetchData('fetch_discussions.php');
        if (discussions && discussions.length > 0) {
            const randomDiscussionId = getRandomItem(discussions).id;
            const randomDiscussion = await fetchDiscussionById(randomDiscussionId);
            if (randomDiscussion && randomDiscussion.icons && randomDiscussion.text) {
                const discussionBox = document.getElementById('discussion-box');
                discussionBox.innerHTML = `
                    <div class="round-box">
                        <img src="${randomDiscussion.icons}" alt="Discussion Icon">
                    </div>
                    <div class="rectangle-box">${randomDiscussion.text}</div>
                `;
                discussionBox.addEventListener('click', () => {
                    window.location.href = 'discussions.php';
                });
            } else {
                console.error('Invalid discussion data:', randomDiscussion);
            }
        } else {
            console.error('No discussions found or invalid data format.');
        }
    }

    function convertTimeToMinutes(time) {
        const [hour, minute] = time.split(':').map(Number);
        return hour * 60 + minute;
    }

    displayRandomQuote();
    displayHighlight();
    displayRandomHabit();
    displayRandomDiscussion();

    setInterval(displayRandomHabit, Math.floor(Math.random() * 5000) + 5000);
    setInterval(displayRandomQuote, 10000);
    setInterval(displayRandomDiscussion, 10000); // Change discussion every 10 seconds

    homeBoxes.forEach((box, index) => {
        if (index > 0) { // Skip the first box
            box.addEventListener('click', () => {
                window.location.href = 'habit.php';
            });
        }
    });
});
