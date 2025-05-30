import { createShip } from "../src/ship.js";

test("Ship is not sunk when not all positions are hit", () => {
  const ship = createShip(3);
  ship.hit(0);
  ship.hit(1);
  expect(ship.isSunk()).toBe(false);
});

test("Ship is sunk when all positions are hit", () => {
  const ship = createShip(3);
  ship.hit(0);
  ship.hit(1);
  ship.hit(2);
  expect(ship.isSunk()).toBe(true);
});

test("Ship throws error when hitting out of bounds", () => {
  const ship = createShip(3);
  expect(() => ship.hit(5)).toThrow("Position out of bounds");
});
test("Ship throws error when hitting negative position", () => {
  const ship = createShip(3);
  expect(() => ship.hit(-1)).toThrow("Position out of bounds");
});
test("Ship throws error when length is zero or negative", () => {
  expect(() => createShip(0)).toThrow("Ship length must be greater than zero");
  expect(() => createShip(-1)).toThrow("Ship length must be greater than zero");
});
test("Ship can be created with a custom name", () => {
  const ship = createShip(3, "Battleship");
  expect(ship.name).toBe("Battleship");
});
