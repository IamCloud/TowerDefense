class Coords {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
