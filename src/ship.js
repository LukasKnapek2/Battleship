// ship.js (Updated)

export function createShip(length, name = "Unnamed Ship") {
  if (length <= 0) {
    throw new Error("Ship length must be greater than zero");
  }

  const shipLength = length;
  const shipName = name;
  const hitSegments = Array(shipLength).fill(false);


  function hit(segmentIndex) {
    if (segmentIndex < 0 || segmentIndex >= shipLength) {
      throw new Error("Position out of bounds");
    }
    if (hitSegments[segmentIndex] === true) {
      return false;
    }
    hitSegments[segmentIndex] = true;
    return true;
  }


  function isSunk() {
    return hitSegments.every((segment) => segment === true);
  }


  function getHitsCount() {
    return hitSegments.filter((segment) => segment === true).length;
  }

  function getHitSegments() {
    return [...hitSegments];
  }
  return {
    length: shipLength,
    name: shipName,
    hit,
    isSunk,
    getHitsCount,
    getHitSegments
  };
}
