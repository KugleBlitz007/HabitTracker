document.addEventListener('DOMContentLoaded', function() {
    const quotesContainer = document.querySelector('.quotes-container');
    const addBox = document.getElementById('add-box');
    const BASE_URL = 'http://localhost:8888/htdocs'; // Adjust if necessary

    let quotes = {};

    // Helper function to decode HTML entities
    function decodeHtmlEntities(str) {
        const txt = document.createElement('textarea');
        txt.innerHTML = str;
        return txt.value;
    }

    // Fetch data from the backend
    fetch(`${BASE_URL}/fetch_quotes.php`)
        .then(response => response.json())
        .then(data => {
            quotes = data;

            // Process existing quotes
            Object.keys(quotes).forEach((key) => {
                const quoteText = decodeHtmlEntities(quotes[key].text || '');
                const quoteAuthor = decodeHtmlEntities(quotes[key].author || '');

                if (quoteText) { // Only create boxes if text is not empty
                    const quoteBox = createQuoteBox(key, quoteText, quoteAuthor);
                    quotesContainer.appendChild(quoteBox);
                }
            });
        });

    // Save progress to the backend
    function saveProgress(data) {
        fetch(`${BASE_URL}/save_quotes.php`, {
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

    // Add new quote box
    addBox.addEventListener('click', () => {
        const newId = Object.keys(quotes).length + 1;
        const newBox = createQuoteBox(newId, 'New Quote', 'Author');
        quotesContainer.appendChild(newBox);

        const newQuote = {
            id: newId,
            text: 'New Quote',
            author: 'Author'
        };

        // Add new quote to the quotes object
        quotes[newId] = newQuote;

        // Save new quote to the backend
        fetch(`${BASE_URL}/add_quote.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newQuote)
        })
        .then(response => response.json())
        .then(data => {
            console.log('New quote added:', data);
        })
        .catch(error => {
            console.error('Error adding new quote:', error);
        });

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
            fetch(`${BASE_URL}/delete_quote.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: key })
            })
            .then(response => response.text())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error deleting quote:', error);
            });
        });

        quoteElement.addEventListener('blur', function() {
            quotes[key].text = quoteElement.textContent;
            saveProgress(quotes);
        });

        authorElement.addEventListener('blur', function() {
            quotes[key].author = authorElement.textContent;
            saveProgress(quotes);
        });

        quoteBox.appendChild(quoteElement);
        quoteBox.appendChild(authorElement);
        quoteBox.appendChild(deleteButton);

        return quoteBox;
    }
});
