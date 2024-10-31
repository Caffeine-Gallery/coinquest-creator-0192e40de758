import { backend } from "declarations/backend";

let gameState = {
    playerPosition: { x: 0, y: 0 },
    coins: [],
    score: 0
};

const GRID_SIZE = 10;

async function createCharacter(name, color) {
    showLoading(true);
    try {
        await backend.createCharacter(name, color);
        const state = await backend.getGameState();
        gameState = state;
        document.getElementById('character-creation').classList.add('d-none');
        document.getElementById('game-container').classList.remove('d-none');
        renderGame();
    } catch (error) {
        console.error('Error creating character:', error);
    }
    showLoading(false);
}

function showLoading(show) {
    document.getElementById('loading').classList.toggle('d-none', !show);
}

function renderGame() {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = '';
    
    // Create grid
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            
            // Render player
            if (x === gameState.playerPosition.x && y === gameState.playerPosition.y) {
                const player = document.createElement('div');
                player.className = 'player';
                player.style.backgroundColor = gameState.playerColor;
                cell.appendChild(player);
            }
            
            // Render coins
            if (gameState.coins.some(coin => coin.x === x && coin.y === y)) {
                const coin = document.createElement('div');
                coin.className = 'coin';
                cell.appendChild(coin);
            }
            
            grid.appendChild(cell);
        }
    }
    
    document.getElementById('score').textContent = gameState.score;
}

async function movePlayer(dx, dy) {
    const newX = gameState.playerPosition.x + dx;
    const newY = gameState.playerPosition.y + dy;
    
    if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
        showLoading(true);
        try {
            const newState = await backend.movePlayer(newX, newY);
            gameState = newState;
            renderGame();
        } catch (error) {
            console.error('Error moving player:', error);
        }
        showLoading(false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('create-character').addEventListener('click', () => {
        const name = document.getElementById('character-name').value;
        const color = document.getElementById('character-color').value;
        if (name) {
            createCharacter(name, color);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (document.getElementById('game-container').classList.contains('d-none')) {
            return;
        }
        
        switch (e.key) {
            case 'ArrowUp':
                movePlayer(0, -1);
                break;
            case 'ArrowDown':
                movePlayer(0, 1);
                break;
            case 'ArrowLeft':
                movePlayer(-1, 0);
                break;
            case 'ArrowRight':
                movePlayer(1, 0);
                break;
        }
    });
});
