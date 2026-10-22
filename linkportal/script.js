// Setup initial empty structure if local storage doesn't exist yet
const defaultLinks = {
    proxies: [],
    games: [],
    apps: []
};

// Fetch data from local storage or fall back to empty template
let database = JSON.parse(localStorage.getItem('unblocked_hub')) || defaultLinks;

const form = document.getElementById('linkForm');

// Function to refresh user interface grids
function displayLinks() {
    const categories = ['proxies', 'games', 'apps'];
    
    categories.forEach(cat => {
        const container = document.getElementById(cat);
        container.innerHTML = ''; // Wipe out current inner contents to avoid duplication

        // Handle empty categories gracefully
        if (database[cat].length === 0) {
            container.innerHTML = `<p style="color: #64748b; font-style: italic; font-size: 0.9rem;">No links added yet.</p>`;
            return;
        }

        // Generate clickable cards for saved parameters
        database[cat].forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.name}</a>
                <button class="delete-btn" onclick="deleteLink('${cat}', ${index})">×</button>
            `;
            container.appendChild(card);
        });
    });
}

// Intercept submission to process parameters in-browser
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('siteName').value;
    const url = document.getElementById('siteUrl').value;
    const category = document.getElementById('siteCategory').value;

    // Append submission entry payload directly into state object array
    database[category].push({ name, url });
    localStorage.setItem('unblocked_hub', JSON.stringify(database));
    
    // Refresh DOM view arrays and wipe form text inputs cleanly
    displayLinks();
    form.reset();
});

// Remove entry from index placement maps and save state changes 
window.deleteLink = function(category, index) {
    database[category].splice(index, 1);
    localStorage.setItem('unblocked_hub', JSON.stringify(database));
    displayLinks();
}

// Initial draw logic execution block triggers on script load
displayLinks();
