export default class Map {
  constructor (width, height) {
    this.width = width;
    this.height = height;
    this.stones = [];
  }

  generateStones (count) {
    // Genera piedras en posiciones aleatorias
    // Determinar ubicaciones aleatorias dentro de los límites del mapa
    // Colocar piedras en dichas ubicaciones
  }

  isPositionAvailable (x, y) {
    // Verifica si una posición está libre
    // Revisar si hay jugadores o piedras en la posición dada
    // Retornar true o false dependiendo del resultado
    if (this.stones.some(stone => stone.x === x && stone.y === y)) {
      return false;
    }
  }

  isValidPosition (x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false;
    }
    return true;
  }

  generateRandomPosition () {
    const x = Math.floor(Math.random() * this.width);
    const y = Math.floor(Math.random() * this.height);
    return { x, y };
  }
}
