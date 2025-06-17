// src/index.js
import { gameController } from './gameController.js'; // Assuming gameController is exported as a named export

document.addEventListener('DOMContentLoaded', () => {
    // You might want a "Start Game" button to trigger initGame
    const startGameButton = document.getElementById('start-game-btn');
    if (startGameButton) {
        startGameButton.addEventListener('click', () => {
            gameController.initGame();
        });
    } else {
        // If no button, initialize immediately (for development)
        gameController.initGame();
    }
});