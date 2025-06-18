// src/gameController.js
import { createPlayer } from './player.js';
import { createShip } from './ship.js';

const gameController = (() => {
    let player1;
    let player2;
    let currentPlayer;
    let opponentPlayer;
    let gameState = 'placement';

    let availableShipsToPlace = [];
    let currentShipOrientation = 'horizontal';
    let draggedShip = null;

    const playerBoardContainer = document.getElementById('player-board-container');
    const opponentBoardContainer = document.getElementById('opponent-board-container');
    const messageDisplay = document.getElementById('message');
    const shipsToPlaceContainer = document.getElementById('ships-to-place');
    const rotateShipBtn = document.getElementById('rotate-ship-btn');
    const startGameBtn = document.getElementById('start-game-btn');

    const renderBoard = (boardObj, containerEl, isPlayerBoard = false) => {
        containerEl.innerHTML = '';
        const boardGrid = boardObj.getBoard();

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
                    if (cellContent.ship.getHitSegments()[cellContent.segmentIndex]) {
                         cell.classList.add('hit');
                    } else if (isPlayerBoard) {
                        cell.classList.add('ship');
                    }
                }

                if (isPlayerBoard && gameState === 'placement') {
                    cell.addEventListener('dragover', handleDragOver);
                    cell.addEventListener('dragleave', handleDragLeave);
                    cell.addEventListener('drop', handleDrop);
                } else if (!isPlayerBoard && gameState === 'playing') {
                    cell.classList.add('clickable-cell');
                    cell.addEventListener('click', handleAttack);
                }

                containerEl.appendChild(cell);
            }
        }
    };

    const updateMessage = (msg) => {
        messageDisplay.textContent = msg;
    };

    const updateGameStateClasses = () => {
        document.body.className = '';
        document.body.classList.add(`game-state-${gameState}`);
    };

    const initGame = () => {
        player1 = createPlayer('Human Player', 'human');
        player2 = createPlayer('Computer Player', 'computer');

        availableShipsToPlace = [
            createShip(5, 'Carrier'),
            createShip(4, 'Battleship'),
            createShip(3, 'Destroyer'),
            createShip(3, 'Submarine'),
            createShip(2, 'Patrol Boat')
        ];
 console.log('Ships initialized:', availableShipsToPlace);
        placeComputerShipsRandomly(player2);

        currentPlayer = player1;
        opponentPlayer = player2;
        gameState = 'placement';

        updateGameStateClasses();
        updateMessage(`Place your ships, ${currentPlayer.name}!`);
        renderPlacementArea();
        renderBoards();

        rotateShipBtn.addEventListener('click', toggleShipOrientation);
        startGameBtn.addEventListener('click', startPlayingPhase);
    };

    const placeComputerShipsRandomly = (computerPlayer) => {
        const ships = [
            createShip(5, 'Carrier'), createShip(4, 'Battleship'),
            createShip(3, 'Destroyer'), createShip(3, 'Submarine'),
            createShip(2, 'Patrol Boat')
        ];

        ships.forEach(ship => {
            let placed = false;
            while (!placed) {
                const row = Math.floor(Math.random() * 10);
                const col = Math.floor(Math.random() * 10);
                const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                try {
                    computerPlayer.placeShip(ship, [row, col], orientation);
                    placed = true;
                } catch (error) {
                    // console.log("Computer failed to place, retrying...", error.message);
                }
            }
        });
    };

    const renderPlacementArea = () => {
        shipsToPlaceContainer.innerHTML = '';

        availableShipsToPlace.forEach((ship, index) => {
            const shipDiv = document.createElement('div');
            shipDiv.classList.add('draggable-ship');
            if (currentShipOrientation === 'vertical') {
                shipDiv.classList.add('vertical');
            }
            shipDiv.dataset.length = ship.length;
            shipDiv.dataset.index = index;
            shipDiv.setAttribute('draggable', 'true');

            for (let i = 0; i < ship.length; i++) {
                const segment = document.createElement('div');
                segment.classList.add('draggable-ship-segment');
                shipDiv.appendChild(segment);
            }

            shipDiv.addEventListener('dragstart', handleDragStart);
            shipDiv.addEventListener('dragend', handleDragEnd);

            shipsToPlaceContainer.appendChild(shipDiv);
        });

        rotateShipBtn.textContent = `Rotate Ship (${currentShipOrientation.charAt(0).toUpperCase() + currentShipOrientation.slice(1)})`;

        if (availableShipsToPlace.length === 0) {
            startGameBtn.disabled = false;
            updateMessage("All ships placed! Click 'Start Game' to begin.");
        } else {
            startGameBtn.disabled = true;
        }
    };

    const toggleShipOrientation = () => {
        currentShipOrientation = currentShipOrientation === 'horizontal' ? 'vertical' : 'horizontal';
        renderPlacementArea(); // Re-render to update ship visuals
    };

    const handleDragStart = (e) => {
        const shipIndex = parseInt(e.target.dataset.index);
        draggedShip = availableShipsToPlace[shipIndex];

        e.dataTransfer.setData('text/plain', JSON.stringify({ index: shipIndex }));
        e.dataTransfer.effectAllowed = 'move';

        e.target.classList.add('dragging');
        document.body.classList.add('dragging-ship');
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('dragging');
        document.body.classList.remove('dragging-ship');
        clearPlacementPreview();
        draggedShip = null;
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        clearPlacementPreview();
        if (!draggedShip) return;

        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);

        if (isNaN(row) || isNaN(col)) return;

        let isValid = true;
        let cellsToPreview = [];

        for (let i = 0; i < draggedShip.length; i++) {
            let r = row;
            let c = col;
            if (currentShipOrientation === 'horizontal') {
                c += i;
            } else {
                r += i;
            }

            if (r < 0 || r >= 10 || c < 0 || c >= 10) {
                isValid = false;
                break;
            }

            const cell = playerBoardContainer.querySelector(`[data-row="${r}"][data-col="${c}"]`);
            if (cell) {
                cellsToPreview.push(cell);
                if (cell.classList.contains('ship')) {
                    isValid = false;
                }
            } else {
                isValid = false;
                break;
            }
        }

        cellsToPreview.forEach(cell => {
            if (isValid) {
                cell.classList.add('placement-preview');
            } else {
                cell.classList.add('placement-preview-invalid');
            }
        });
    };

    const handleDragLeave = (e) => {
        clearPlacementPreview();
    };

    const clearPlacementPreview = () => {
        playerBoardContainer.querySelectorAll('.cell.placement-preview, .cell.placement-preview-invalid')
            .forEach(cell => {
                cell.classList.remove('placement-preview', 'placement-preview-invalid');
            });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        clearPlacementPreview();

        if (!draggedShip) {
            updateMessage("Error: No ship being dragged.");
            return;
        }

        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        const coordinates = [row, col];

        try {
            player1.placeShip(draggedShip, coordinates, currentShipOrientation);

            const indexToRemove = availableShipsToPlace.findIndex(ship => ship === draggedShip);
            if (indexToRemove > -1) {
                availableShipsToPlace.splice(indexToRemove, 1);
            }
            draggedShip = null;

            renderBoards();
            renderPlacementArea();

            if (availableShipsToPlace.length === 0) {
                updateMessage("All ships placed! Click 'Start Game' to begin.");
                startGameBtn.disabled = false;
            } else {
                updateMessage(`Place your next ship!`);
            }

        } catch (error) {
            updateMessage(`Placement Error: ${error.message}. Try again.`);
            renderBoards();
        }
    };

    const startPlayingPhase = () => {
        if (availableShipsToPlace.length > 0) {
            updateMessage("Please place all your ships before starting the game.");
            return;
        }

        gameState = 'playing';
        updateGameStateClasses();

        renderBoards();
        updateMessage(`${currentPlayer.name}'s turn to attack!`);
    };

    const renderBoards = () => {
        renderBoard(player1.gameboard, playerBoardContainer, true);
        renderBoard(player2.gameboard, opponentBoardContainer, false);
    };

    const handleAttack = (e) => {
        if (gameState !== 'playing' || currentPlayer.type === 'computer') return;

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
            } else {
                attackResult = currentPlayer.attack(opponentPlayer);
            }
        } catch (error) {
            updateMessage(`Invalid move: ${error.message}. ${currentPlayer.name}'s turn again.`);
            renderBoards();
            if (currentPlayer.type === 'computer') {
                 setTimeout(() => playTurn(), 500);
            }
            return;
        }

        updateMessage(`${currentPlayer.name}'s attack: ${attackResult.toUpperCase()}!`);
        renderBoards();

        if (checkGameOver()) {
            gameState = 'game_over';
            updateGameStateClasses();
            updateMessage(`${opponentPlayer.name}'s fleet is sunk! ${currentPlayer.name} wins!`);
            opponentBoardContainer.querySelectorAll('.cell').forEach(cell => {
                cell.removeEventListener('click', handleAttack);
                cell.classList.remove('clickable-cell');
            });
            playerBoardContainer.querySelectorAll('.cell').forEach(cell => {
                cell.removeEventListener('dragover', handleDragOver);
                cell.removeEventListener('dragleave', handleDragLeave);
                cell.removeEventListener('drop', handleDrop);
                cell.classList.remove('clickable-cell');
            });
            rotateShipBtn.removeEventListener('click', toggleShipOrientation);
            startGameBtn.removeEventListener('click', startPlayingPhase);
            return;
        }

        switchTurn();

        updateMessage(`${opponentPlayer.name}'s turn!`);

        if (currentPlayer.type === 'computer') {
            setTimeout(() => {
                playTurn();
            }, 1000);
        }
    };

    const switchTurn = () => {
        [currentPlayer, opponentPlayer] = [opponentPlayer, currentPlayer];
    };

    const checkGameOver = () => {
        return opponentPlayer.gameboard.allShipsSunk();
    };

    return {
        initGame,
    };
})();

export { gameController };