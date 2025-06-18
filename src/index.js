// src/index.js
import { gameController } from './gameController.js';


document.addEventListener('DOMContentLoaded', () => {
    // Initialize the game controller once the DOM is fully loaded.
    // The gameController will handle the "Start Game" button internally
    // to transition from placement to the playing phase.
    gameController.initGame();
});