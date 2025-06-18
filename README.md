# Battleship Game

A classic game of Battleship implemented in JavaScript, HTML, and CSS. Players can place their ships on a 10x10 grid and then take turns attacking their opponent's grid to sink all their ships.

## Features

-   **Interactive Ship Placement:** Drag and drop your ships onto your board.
-   **Ship Rotation:** Rotate ships between horizontal and vertical orientations during placement.
-   **Player vs. Computer:** Play against a computer opponent that randomly places its ships and attacks.
-   **Turn-based Gameplay:** Players take turns attacking each other's boards.
-   **Visual Feedback:** Clearly see hits, misses, and sunk ships.
-   **Game State Management:** The game progresses through placement, playing, and game-over states.

## How to Play

1.  **Clone the Repository (or Download Files):**
    ```bash
    git clone https://github.com/LukasKnapek2/Battleship.git
    cd Battleship
    ```
2.  **Open `index.html`:**
    Navigate to the project directory and open the `index.html` file in your web browser.

3.  **Ship Placement Phase:**
    *   You will see a list of available ships (Carrier, Battleship, etc.) in the "Placement Tools" area.
    *   Click and drag a ship from the list onto your board (the left grid).
    *   To rotate a ship before placing it, click the "Rotate Ship" button. The preview of the ship in the list will update.
    *   Place all your ships. The "Start Game" button will become active once all ships are on your board.
    *   The computer opponent will automatically place its ships.

4.  **Playing Phase:**
    *   Click the "Start Game" button.
    *   It's your turn first. Click on a cell in the "Enemy Board" (the right grid) to attack.
    *   A **red cell** indicates a hit on an enemy ship.
    *   A **blue cell with a dot** indicates a miss.
    *   After your attack, the computer will take its turn.
    *   Continue taking turns attacking each other's boards.

5.  **Winning the Game:**
    *   The first player to sink all of their opponent's ships wins the game!

## Project Structure

-   `index.html`: The main HTML file for the game.
-   `style.css`: Contains all the styling for the game interface.
-   `src/`: Directory containing the JavaScript modules:
    -   `index.js`: Entry point, initializes the game.
    -   `gameController.js`: Manages the overall game flow, player turns, and DOM updates.
    -   `player.js`: Factory function to create player objects (human and computer).
    -   `gameboard.js`: Factory function to create gameboard objects, handling ship placement and attacks.
    -   `ship.js`: Factory function to create ship objects with properties like length, hits, and sunk status.
-   `tests/`: Directory containing Jest tests for the JavaScript modules.

## Technologies Used

-   HTML5
-   CSS3
-   JavaScript (ES6 Modules)
-   Jest (for testing)
-   Babel (for transpiling JavaScript for Jest)