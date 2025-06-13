import { createGameboard } from './gameboard.js';
import { createShip } from './ship.js';

const gameboard = createGameboard();

const carrier = createShip(5, "carrier");
const battleship = createShip(4, "battleship");

try {
    gameboard.placeShip(carrier, [0, 0], 'horizontal');
    gameboard.placeShip(battleship, [2, 0], 'vertical');

    console.log(gameboard.getBoard()); // See the board state

    gameboard.receiveAttack([0, 0]); // Hit carrier
    gameboard.receiveAttack([0, 1]); // Hit carrier
    gameboard.receiveAttack([5, 5]); // Miss
    gameboard.receiveAttack([2, 0]); // Hit battleship

    console.log("Missed attacks:", gameboard.getMissedAttacks());
    console.log("All ships sunk?", gameboard.allShipsSunk());

    // Sink the carrier
    carrier.hit();
    carrier.hit();
    carrier.hit();
    carrier.hit();
    console.log("Carrier sunk?", carrier.isSunk());

    // Sink the battleship
    battleship.hit();
    battleship.hit();
    battleship.hit();
    console.log("Battleship sunk?", battleship.isSunk());


    console.log("All ships sunk?", gameboard.allShipsSunk()); // Should be true if all hit enough times

    console.log(gameboard.getBoard()); // See the final board state
        gameboard.receiveAttack([2, 0]); // Hit battleship

} catch (error) {
    console.error(error.message);
}