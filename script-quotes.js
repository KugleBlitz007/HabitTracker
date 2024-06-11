document.addEventListener('DOMContentLoaded', function() {
        const quotesContainer = document.querySelector('.quotes-container');
        const addBox = document.getElementById('add-box');
        const API_KEY = '$2a$10$KMjxRh5ITdh/hqS4iCEsTeT1e3SZTCv/0LklzIhtct466BH.9j6DO'; // Replace with your JSONBin API Key
        const BIN_ID = '66688707e41b4d34e401df26'; // Replace with your JSONBin Bin ID
    
        let quotes = {};
    
        // Fetch data from JSONBin
        fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-Key': API_KEY
            }
        })
        .then(response => response.json())
        .then(data => {
            quotes = data.record.quotes || {};
    
            // Process existing quotes
            Object.keys(quotes).forEach((key) => {
                const quoteText = quotes[key].text || '';
                const quoteAuthor = quotes[key].author || '';
    
                if (quoteText) { // Only create boxes if text is not empty
                    const quoteBox = createQuoteBox(key, quoteText, quoteAuthor);
                    quotesContainer.appendChild(quoteBox);
                }
            });
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
    
        // Add new quote box
        addBox.addEventListener('click', () => {
            const newIndex = `quote-${Object.keys(quotes).length + 1}`;
            const newBox = createQuoteBox(newIndex, 'New Quote', 'Author');
            quotesContainer.appendChild(newBox);
    
            quotes[newIndex] = {
                text: 'New Quote',
                author: 'Author'
            };
    
            saveProgress({ quotes }); // Save immediately after adding
            newBox.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
    
        // Function to create a quote box element
        function createQuoteBox(key, quoteText, quoteAuthor) {
            const quoteBox = document.createElement('div');
            quoteBox.classList.add('quote-box');
            quoteBox.id = key;
    
            const quoteElement = document.createElement('div');
            quoteElement.classList.add('quote-text');
            quoteElement.contentEditable = true;
            quoteElement.textContent = quoteText;
    
            const authorElement = document.createElement('div');
            authorElement.classList.add('quote-author');
            authorElement.contentEditable = true;
            authorElement.textContent = quoteAuthor;
    
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'X';
            deleteButton.addEventListener('click', function() {
                quoteBox.remove();
                delete quotes[key];
                saveProgress({ quotes });
            });
    
            quoteElement.addEventListener('blur', function() {
                quotes[key].text = quoteElement.textContent;
                saveProgress({ quotes });
            });
    
            authorElement.addEventListener('blur', function() {
                quotes[key].author = authorElement.textContent;
                saveProgress({ quotes });
            });
    
            quoteBox.appendChild(quoteElement);
            quoteBox.appendChild(authorElement);
            quoteBox.appendChild(deleteButton);
    
            return quoteBox;
        }
    });
    