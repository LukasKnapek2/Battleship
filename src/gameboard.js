// gameboard.js
export function createGameboard() {
    const board = Array(10).fill(null).map(() => Array(10).fill(null));
    const ships = [];
    const missedAttacks = [];

    function isValidCoordinate(row, col) {
        return row >= 0 && row < 10 && col >= 0 && col < 10;
    }

    function placeShip(_ship, _coordinates, _orientation) {
        if (!_ship || !_coordinates || !_orientation) {
            throw new Error('Invalid parameters for placing ship');
        }
        if (_orientation !== 'horizontal' && _orientation !== 'vertical') {
            throw new Error('Invalid orientation. Use "horizontal" or "vertical".');
        }
        if (_coordinates.length !== 2 || !Array.isArray(_coordinates) ||
            typeof _coordinates[0] !== 'number' || typeof _coordinates[1] !== 'number') {
            throw new Error('Coordinates must be an array of two numbers [row, col]');
        }

        const [startRow, startCol] = _coordinates;
        const shipLength = _ship.length;

        for (let i = 0; i < shipLength; i++) {
            let currentRow = startRow;
            let currentCol = startCol;

            if (_orientation === 'horizontal') {
                currentCol = startCol + i;
            } else {
                currentRow = startRow + i;
            }

            if (!isValidCoordinate(currentRow, currentCol)) {
                throw new Error('Ship placement out of bounds.');
            }
            if (board[currentRow][currentCol] !== null) {
                throw new Error('Ship collides with another ship or existing placement.');
            }
        }

        for (let i = 0; i < shipLength; i++) {
            let currentRow = startRow;
            let currentCol = startCol;

            if (_orientation === 'horizontal') {
                currentCol = startCol + i;
            } else {
                currentRow = startRow + i;
            }
            board[currentRow][currentCol] = {
                ship: _ship,
                segmentIndex: i
            };
        }

        ships.push(_ship);
    }

    function receiveAttack(_coordinates) {
        if (_coordinates.length !== 2 || !Array.isArray(_coordinates) ||
            typeof _coordinates[0] !== 'number' || typeof _coordinates[1] !== 'number') {
            throw new Error('Attack coordinates must be an array of two numbers [row, col]');
        }

        const [row, col] = _coordinates;

        if (!isValidCoordinate(row, col)) {
            throw new Error('Attack coordinates are out of bounds.');
        }

        const target = board[row][col];

        if (target === 'miss') {
            throw new Error('Coordinates have already been attacked (miss).');
        }

        if (target !== null && typeof target === 'object' && target.ship) {
            if (target.ship.getHitSegments && target.ship.getHitSegments()[target.segmentIndex]) {
               throw new Error('Coordinates have already been attacked (hit ship segment).');
            }
        }

        if (target === null) {
            board[row][col] = 'miss';
            missedAttacks.push(_coordinates);
            return 'miss';
        } else if (typeof target === 'object' && target.ship && typeof target.segmentIndex === 'number') {
            const hitSuccessful = target.ship.hit(target.segmentIndex);
            if (hitSuccessful) {
                return 'hit';
            } else {
                throw new Error('Attempted to hit an already hit ship segment.');
            }
        }
    }

    function getShipAt(_coordinates) {
        if (_coordinates.length !== 2 || !Array.isArray(_coordinates)) {
            throw new Error('Coordinates must be an array of two numbers');
        }
        const [row, col] = _coordinates;
        if (!isValidCoordinate(row, col)) {
            return null;
        }
        const content = board[row][col];
        return (typeof content === 'object' && content !== null && content.ship) ? content.ship : null;
    }

    function getMissedAttacks() {
        return missedAttacks;
    }

    function allShipsSunk() {
        return ships.length > 0 && ships.every(ship => ship.isSunk());
    }

    function getBoard() {
        return board;
    }

    return {
        placeShip,
        receiveAttack,
        getShipAt,
        getMissedAttacks,
        allShipsSunk,
        getBoard
    };
}