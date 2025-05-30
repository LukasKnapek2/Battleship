export function createShip(length, name = 'Unnamed Ship') {
  if (length <= 0) {
    throw new Error('Ship length must be greater than zero');
  }
  const hits = Array(length).fill(false);
  let sunk = false;

  function hit(position) {
    if (position < 0 || position >= length) {
      throw new Error('Position out of bounds');
    }
    hits[position] = true;
    checkSunk();
  }

  function checkSunk() {
    sunk = hits.every(hit => hit);
  }

  function isSunk() {
    return sunk;
  }

  return {
    name,
    length,
    hit,
    isSunk,
  };
}
