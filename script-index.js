document.addEventListener('DOMContentLoaded', function() {
    const homeBoxes = document.querySelectorAll('.home-box');
    const API_KEY = '$2a$10$KMjxRh5ITdh/hqS4iCEsTeT1e3SZTCv/0LklzIhtct466BH.9j6DO'; // Replace with your JSONBin API Key
    const QUOTES_BIN_ID = '66688707e41b4d34e401df26'; // Replace with your JSONBin Bin ID for quotes
    const HIGHLIGHTS_BIN_ID = '666861d1ad19ca34f8778b21'; // Replace with your JSONBin Bin ID for highlights

    function fetchQuotes() {
        return fetch(`https://api.jsonbin.io/v3/b/${QUOTES_BIN_ID}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': API_KEY
            }
        })
        .then(response => response.json())
        .then(data => data.record.quotes);
    }

    function fetchHighlight() {
        return fetch(`https://api.jsonbin.io/v3/b/${HIGHLIGHTS_BIN_ID}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': API_KEY
            }
        })
        .then(response => response.json())
        .then(data => data.record.calendar);
    }

    function getRandomQuote(quotes) {
        const keys = Object.keys(quotes);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return quotes[randomKey];
    }

    function displayRandomQuote() {
        fetchQuotes().then(quotes => {
            const quoteBox = document.getElementById('quote-box');
            const randomQuote = getRandomQuote(quotes);
            const quoteText = randomQuote.text;
            const quoteAuthor = randomQuote.author;

            quoteBox.innerHTML = `
                <div class="quote-text">${quoteText}</div>
                <div class="quote-author">- ${quoteAuthor}</div>
            `;
            quoteBox.addEventListener('click', function() {
                window.location.href = 'quotes.html';
            });
        });
    }

    function displayHighlight() {
        fetchHighlight().then(calendar => {
            const highlightBox = document.getElementById('highlight-box');
            let highlightText = 'No current highlights';
            let highlightTime = '';
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTime = currentHour * 60 + currentMinute; // Convert to minutes for easier comparison

            for (const key in calendar) {
                if (calendar.hasOwnProperty(key)) {
                    const timeText = calendar[key].time || '';
                    const activityText = calendar[key].activity || '';

                    if (timeText && activityText) {
                        const [startTime, endTime] = timeText.split(' - ');

                        const start = convertTimeToMinutes(startTime);
                        const end = convertTimeToMinutes(endTime);

                        if (currentTime >= start && currentTime < end) {
                            highlightText = activityText;
                            highlightTime = timeText;
                            break;
                        }
                    }
                }
            }

            highlightBox.innerHTML = `
                <div class="highlight-time">${highlightTime}</div>
                <div class="highlight-text">${highlightText}</div>
            `;
            highlightBox.addEventListener('click', function() {
                window.location.href = 'calendar.html';
            });
        });
    }

    function convertTimeToMinutes(time) {
        const [hour, minute] = time.split(':').map(Number);
        return hour * 60 + minute;
    }

    // Display the first random quote
    displayRandomQuote();

    // Display the highlight
    displayHighlight();

    // Change the quote randomly every 10 seconds
    setInterval(displayRandomQuote, 10000);

    // Set up other home boxes to navigate to different pages
    homeBoxes.forEach((box, index) => {
        if (index > 0) { // Skip the first box
            box.addEventListener('click', function() {
                window.location.href = `page${index + 1}.html`;
            });
        }
    });
});
