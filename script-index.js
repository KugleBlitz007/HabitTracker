document.addEventListener('DOMContentLoaded', function() {
            const homeBoxes = document.querySelectorAll('.home-box');
            const API_KEY = '$2a$10$KMjxRh5ITdh/hqS4iCEsTeT1e3SZTCv/0LklzIhtct466BH.9j6DO'; // Replace with your JSONBin API Key
            const QUOTES_BIN_ID = '66688707e41b4d34e401df26'; // Replace with your JSONBin Bin ID
        
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
        
            // Display the first random quote
            displayRandomQuote();
        
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
        