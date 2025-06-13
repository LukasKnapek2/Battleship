// gameboard.test.js
import { createGameboard } from "../src/gameboard.js";
import { createShip } from "../src/ship.js";

test("places a ship at specific coordinates and getShipAt returns the ship", () => {
  const board = createGameboard();
  const ship = createShip(3, "Submarine");
  board.placeShip(ship, [0, 0], "horizontal");

  expect(board.getShipAt([0, 0])).toBe(ship);
  expect(board.getShipAt([0, 1])).toBe(ship);
  expect(board.getShipAt([0, 2])).toBe(ship);

  expect(board.getShipAt([0, 3])).toBeNull();
  expect(board.getShipAt([1, 0])).toBeNull();
});

test("registers a hit on the correct ship part and calls ship.hit()", () => {
  const board = createGameboard();
  const ship = createShip(3);
  board.placeShip(ship, [0, 0], "horizontal");

  expect(ship.isSunk()).toBe(false);

  board.receiveAttack([0, 1]);

  expect(ship.getHitsCount()).toBe(1);
  expect(ship.isSunk()).toBe(false);

  board.receiveAttack([0, 0]);
  expect(ship.getHitsCount()).toBe(2);
  expect(ship.isSunk()).toBe(false);

  expect(() => board.receiveAttack([0, 0])).toThrow('Coordinates have already been attacked (hit ship segment).');
  expect(() => board.receiveAttack([0, 1])).toThrow('Coordinates have already been attacked (hit ship segment).');
});

test("records a missed attack when there is no ship", () => {
  const board = createGameboard();
  board.receiveAttack([4, 4]);

  expect(board.getMissedAttacks()).toContainEqual([4, 4]);

  expect(() => board.receiveAttack([4, 4])).toThrow('Coordinates have already been attacked (miss).');
});

test("correctly reports all ships as sunk", () => {
  const board = createGameboard();

  expect(board.allShipsSunk()).toBe(false);

  const ship1 = createShip(1, "Patrol Boat 1");
  const ship2 = createShip(2, "Destroyer 1");

  board.placeShip(ship1, [0, 0], "horizontal");
  board.placeShip(ship2, [2, 0], "horizontal");

  expect(board.allShipsSunk()).toBe(false);

  board.receiveAttack([0, 0]);
  expect(ship1.isSunk()).toBe(true);
  expect(board.allShipsSunk()).toBe(false);

  board.receiveAttack([2, 0]);
  board.receiveAttack([2, 1]);
  expect(ship2.isSunk()).toBe(true);

  expect(board.allShipsSunk()).toBe(true);
});

test("throws error when ship placement is out of bounds", () => {
  const board = createGameboard();
  const ship = createShip(5);

  expect(() => board.placeShip(ship, [0, 6], "horizontal")).toThrow("Ship placement out of bounds.");
  expect(() => board.placeShip(ship, [6, 0], "vertical")).toThrow("Ship placement out of bounds.");
  expect(() => board.placeShip(ship, [10, 0], "horizontal")).toThrow("Ship placement out of bounds.");
});

test("throws error when ship placement collides with another ship", () => {
  const board = createGameboard();
  const ship1 = createShip(3);
  const ship2 = createShip(2);

  board.placeShip(ship1, [0, 0], "horizontal");

  expect(() => board.placeShip(ship2, [0, 1], "horizontal")).toThrow("Ship collides with another ship or existing placement.");
  expect(() => board.placeShip(ship2, [0, 1], "vertical")).toThrow("Ship collides with another ship or existing placement.");

  const ship3 = createShip(3);
  board.placeShip(ship3, [5, 5], "vertical");
  expect(() => board.placeShip(ship2, [6, 5], "horizontal")).toThrow("Ship collides with another ship or existing placement.");
});

test("throws error when attacking an already missed coordinate", () => {
  const board = createGameboard();
  board.receiveAttack([1, 1]);
  expect(() => board.receiveAttack([1, 1])).toThrow('Coordinates have already been attacked (miss).');
});

test("throws error when attacking out of bounds coordinates", () => {
  const board = createGameboard();
  expect(() => board.receiveAttack([-1, 0])).toThrow('Attack coordinates are out of bounds.');
  expect(() => board.receiveAttack([10, 0])).toThrow('Attack coordinates are out of bounds.');
  expect(() => board.receiveAttack([0, -1])).toThrow('Attack coordinates are out of bounds.');
  expect(() => board.receiveAttack([0, 10])).toThrow('Attack coordinates are out of bounds.');
});

test("getBoard returns the internal board array", () => {
    const board = createGameboard();
    const ship = createShip(1);
    board.placeShip(ship, [0,0], 'horizontal');
    const internalBoard = board.getBoard();

    expect(internalBoard[0][0]).toEqual({ ship: ship, segmentIndex: 0 });
    expect(internalBoard[0][1]).toBeNull();

    board.receiveAttack([1,1]);
    expect(internalBoard[1][1]).toBe('miss');
});