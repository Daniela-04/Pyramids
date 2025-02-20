import configs from '../configs.js';
export default class Map {
  constructor (width = configs.map.width, height = configs.map.height) {
    this.width = width;
    this.height = height;
    this.stones = [];
  }

  generateStones (count) {
    while (this.stones.length < count) {
      const position = this.generateRandomPosition();
      if (this.isPositionAvailable(position.x, position.y)) {
        this.stones.push(position);
      }
      console.log(this.stones);
    }
  }

  isPositionAvailable (x, y) {
    return !this.stones.some(stone => stone.x === x && stone.y === y);
  }

  isValidPosition (x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  generateRandomPosition () {
    const x = Math.floor(Math.random() * (this.width - 20)); // Restamos 20 para el tamaño del ladrillo
    const y = Math.floor(Math.random() * (this.height - 20)); // Restamos 20 para el tamaño del ladrillo
    return { x, y };
  }

  setWidth (width) {
    if (width >= configs.map.maxWidth && width <= configs.map.minWidth) {
      this.width = width;
    }
  }

  setHeight (height) {
    if (height >= configs.map.maxHeight && height <= configs.map.minHeight) {
      this.height = height;
    }
  }

  getWidth () {
    return this.width;
  }

  getHeight () {
    return this.height;
  }
}
