// src/player.js
import { createGameboard } from './gameboard.js';


export function createPlayer(name, type = 'human') {
    const isValidName = (inputName) => {
        return typeof inputName === 'string' && inputName.trim().length > 0;
    };

    if (!isValidName(name)) {
        throw new Error('Invalid player name. Name must be a non-empty string.');
    }

    if (type !== 'human' && type !== 'computer') {
        throw new Error('Invalid player type. Use "human" or "computer".');
    }

    const playerName = name;
    const playerType = type;
    const gameboard = createGameboard();

    const attackedCoordinates = new Set();

    function generateRandomValidAttack() {
        let row, col;
        let coordString;
        let isAlreadyAttacked;

        do {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            coordString = `${row},${col}`;
            isAlreadyAttacked = attackedCoordinates.has(coordString);
        } while (isAlreadyAttacked);

        return [row, col];
    }

    function placeShip(ship, coordinates, orientation) {
        gameboard.placeShip(ship, coordinates, orientation);
    }

    function attack(opponentPlayer, coordinates = null) {
        if (!opponentPlayer || !opponentPlayer.gameboard) {
            throw new Error('Invalid opponent player object provided.');
        }

        let chosenCoordinates;

        if (playerType === 'human') {
            if (!Array.isArray(coordinates) || coordinates.length !== 2 ||
                typeof coordinates[0] !== 'number' || typeof coordinates[1] !== 'number') {
                throw new Error('Human players must provide valid [row, col] coordinates for attack.');
            }
            chosenCoordinates = coordinates;
        } else {
            chosenCoordinates = generateRandomValidAttack();
        }

        attackedCoordinates.add(`${chosenCoordinates[0]},${chosenCoordinates[1]}`);

        try {
            const result = opponentPlayer.gameboard.receiveAttack(chosenCoordinates);
            return result;
        } catch (error) {
            throw error;
        }
    }

    return {
        name: playerName,
        type: playerType,
        gameboard,
        placeShip,
        attack,
    };
}