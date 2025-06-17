// src/gameController.js
import { createPlayer } from './player.js';
import { createShip } from './ship.js'; // Need this for predetermined ships

const gameController = (() => {
    let player1; // Human player
    let player2; // Computer player
    let currentPlayer;
    let opponentPlayer;

    const playerBoardContainer = document.getElementById('player-board-container');
    const opponentBoardContainer = document.getElementById('opponent-board-container');
    const messageDisplay = document.getElementById('message');

    // --- DOM Rendering ---
    const renderBoard = (boardObj, containerEl, isPlayerBoard = false) => {
        containerEl.innerHTML = ''; // Clear previous board
        const boardGrid = boardObj.getBoard(); // Assuming gameboard exposes getBoard()
        const missedAttacks = boardObj.getMissedAttacks();
        const ships = boardObj.getShips(); // To check if a ship is at a coordinate

        for (let r = 0; r < 10; r++) {
            for (let c = 0; c < 10; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;

                const cellContent = boardGrid[r][c];

                if (cellContent === 'miss') {
                    cell.classList.add('miss');
                } else if (typeof cellContent === 'object' && cellContent !== null && cellContent.ship) {
                    // It's a ship segment
                    if (cellContent.ship.getHitSegments()[cellContent.segmentIndex]) {
                         cell.classList.add('hit'); // Segment has been hit
                    } else if (isPlayerBoard) {
                        // Only show player's own ships (unhit parts)
                        cell.classList.add('ship');
                    }
                }

                // If this is the opponent's board, add click listener for attacks
                if (!isPlayerBoard) {
                    cell.classList.add('clickable-cell'); // Add a class for styling/cursor
                    cell.addEventListener('click', handleAttack);
                }

                containerEl.appendChild(cell);
            }
        }
    };

    const updateMessage = (msg) => {
        messageDisplay.textContent = msg;
    };

    // --- Game Initialization ---
    const initGame = () => {
        player1 = createPlayer('Human Player', 'human');
        player2 = createPlayer('Computer Player', 'computer');

        // Predetermined ship placement for now
        placePredeterminedShips(player1);
        placePredeterminedShips(player2);

        currentPlayer = player1; // Human goes first
        opponentPlayer = player2;

        updateMessage(`${currentPlayer.name}'s turn to attack!`);
        renderBoards(); // Render both boards for the first time
    };

    const placePredeterminedShips = (player) => {
        // Example ships: 5, 4, 3, 3, 2
        // Player 1 ships
        player.placeShip(createShip(5), [0, 0], 'horizontal'); // Carrier
        player.placeShip(createShip(4), [2, 0], 'horizontal'); // Battleship
        player.placeShip(createShip(3), [4, 0], 'horizontal'); // Destroyer
        player.placeShip(createShip(3), [6, 0], 'vertical');   // Submarine
        player.placeShip(createShip(2), [0, 9], 'vertical');   // Patrol Boat
    };


    // --- Game Flow & Turn Management ---

    const renderBoards = () => {
        renderBoard(player1.gameboard, playerBoardContainer, true); // Player's own board
        renderBoard(player2.gameboard, opponentBoardContainer, false); // Opponent's board (for attacking)
    };

    const handleAttack = (e) => {
        if (currentPlayer.type === 'computer') return; // Prevent human from clicking during computer's turn

        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        const coordinates = [row, col];

        playTurn(coordinates);
    };

    const playTurn = (coordinates = null) => {
        let attackResult;
        try {
            if (currentPlayer.type === 'human') {
                attackResult = currentPlayer.attack(opponentPlayer, coordinates);
            } else { // Computer's turn
                attackResult = currentPlayer.attack(opponentPlayer); // Computer generates its own coordinates
            }
        } catch (error) {
            // Handle invalid attacks (already attacked spot, out of bounds)
            updateMessage(`Invalid move: ${error.message}. ${currentPlayer.name}'s turn again.`);
            renderBoards(); // Re-render to show no change
            return; // Stay on current player's turn
        }

        updateMessage(`${currentPlayer.name}'s attack: ${attackResult.toUpperCase()}!`);
        renderBoards(); // Update boards after attack

        if (checkGameOver()) {
            updateMessage(`${opponentPlayer.name}'s fleet is sunk! ${currentPlayer.name} wins!`);
            // Disable further attacks (remove event listeners or add a flag)
            opponentBoardContainer.querySelectorAll('.cell').forEach(cell => {
                cell.removeEventListener('click', handleAttack);
                cell.classList.remove('clickable-cell');
            });
            return;
        }

        // Switch turns after a valid attack
        switchTurn();

        updateMessage(`${opponentPlayer.name}'s turn!`);

        // If it's now the computer's turn, trigger its attack after a short delay for UX
        if (currentPlayer.type === 'computer') {
            setTimeout(() => {
                playTurn(); // Computer attacks
            }, 1000); // 1 second delay
        }
    };

    const switchTurn = () => {
        [currentPlayer, opponentPlayer] = [opponentPlayer, currentPlayer]; // Swap players
    };

    const checkGameOver = () => {
        return opponentPlayer.gameboard.allShipsSunk();
    };


    return {
        initGame,
    };
})();

export { gameController };