// src/index.js
document.addEventListener('DOMContentLoaded', () => {
    let characters = [];
    let currentCharacter = null;

    // DOM Elements
    const characterBar = document.getElementById('character-bar');
    const characterName = document.getElementById('name');
    const characterImage = document.getElementById('image');
    const voteCount = document.getElementById('vote-count');
    const votesForm = document.getElementById('votes-form');
    const resetBtn = document.getElementById('reset-btn');
    const characterForm = document.getElementById('character-form');

    // Initial Fetch of Characters
    fetch('http://localhost:3000/characters')
        .then(response => response.json())
        .then(data => {
            characters = data;
            renderCharacterBar();
            if (characters.length > 0) {
                showCharacterDetails(characters[0]);
            }
        });

    // Render Character Bar
    function renderCharacterBar() {
        characterBar.innerHTML = '';
        characters.forEach(character => {
            const span = document.createElement('span');
            span.textContent = character.name;
            span.addEventListener('click', () => showCharacterDetails(character));
            characterBar.appendChild(span);
        });
    }

    // Show Character Details
    function showCharacterDetails(character) {
        currentCharacter = character;
        characterName.textContent = character.name;
        characterImage.src = character.image;
        voteCount.textContent = character.votes;
    }

    // Handle Votes Form Submission
    votesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentCharacter) return;

        const votesInput = document.getElementById('votes');
        const votesToAdd = parseInt(votesInput.value) || 0;
        
        // Update locally
        currentCharacter.votes += votesToAdd;
        voteCount.textContent = currentCharacter.votes;
        votesInput.value = '';

        // Update server (Extra Bonus)
        updateServerVotes(currentCharacter.id, currentCharacter.votes);
    });

    // Handle Reset Votes
    resetBtn.addEventListener('click', () => {
        if (!currentCharacter) return;

        // Update locally
        currentCharacter.votes = 0;
        voteCount.textContent = 0;

        // Update server (Extra Bonus)
        updateServerVotes(currentCharacter.id, 0);
    });

    // Handle New Character Form Submission (Bonus + Extra Bonus)
    characterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newCharacter = {
            name: formData.get('name'),
            image: formData.get('image-url'),
            votes: 0
        };

        // Post to server (Extra Bonus)
        fetch('http://localhost:3000/characters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCharacter)
        })
        .then(response => response.json())
        .then(savedCharacter => {
            // Update local characters array
            characters.push(savedCharacter);
            
            // Add to character bar
            const span = document.createElement('span');
            span.textContent = savedCharacter.name;
            span.addEventListener('click', () => showCharacterDetails(savedCharacter));
            characterBar.appendChild(span);

            // Show new character details
            showCharacterDetails(savedCharacter);

            // Clear form
            characterForm.reset();
        });
    });

    // Helper function for PATCH requests (Extra Bonus)
    function updateServerVotes(characterId, newVotes) {
        fetch(`http://localhost:3000/characters/${characterId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ votes: newVotes })
        });
    }
});