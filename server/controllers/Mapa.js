import configs from '../../configs.js';

export default class Map {
  constructor (width = configs.map.width, height = configs.map.height) {
    this.width = width;
    this.height = height;
    this.stones = [];
  }

  /**
   * Genera piedras en posiciones aleatorias en el mapa
   * @param {number} count - Número de piedras a generar
   */
  generateStones (count) {
    while (this.stones.length < count) {
      const position = this.generateRandomPosition();
      if (this.isPositionAvailable(position.x, position.y)) {
        this.stones.push(position);
      }
    }
  }

  /**
   * Verifica si una posición está disponible
   * @param {number} x - Coordenada x
   * @param {number} y - Coordenada y
   * @returns {boolean} True si en la posición no hay piedras, false en caso contrario
   */
  isPositionAvailable (x, y) {
    return !this.stones.some(stone => stone.x === x && stone.y === y);
  }

  /**
   * Verifica si una posición es válida dentro del mapa
   * @param {number} x - Coordenada x
   * @param {number} y - Coordenada y
   * @returns {boolean} True si la posición es válida, false en caso contrario
   */
  isValidPosition (x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  /**
   * Verifica si una posición esta en la zona de un equipo específico
   * @param {number} x - Coordenada x
   * @param {number} y - Coordenada y
   * @param {string} team - Nombre del equipo
   * @returns {boolean} True si está, false en caso contrario
   */
  checkAreaColission (x, y, team) {
    if (team === 'purple') {
      if (x >= 0 && x <= 90 && y >= 0 && y <= 90) return true;
    } else {
      if (x >= this.width - 90 && x <= this.width && y >= this.height - 90 && y <= this.height) return true;
    }

    return false;
  }

  /**
   * Verifica si una posición está fuera de las zonas de piramide
   * @param {number} x - Coordenada x
   * @param {number} y - Coordenada y
   * @returns {boolean} True si esta fuera, false en caso contrario
   */
  checkDropZone (x, y) {
    if (x >= 0 && x <= 90 && y >= 0 && y <= 90) return false;
    if (x >= this.width - 90 && x <= this.width && y >= this.height - 90 && y <= this.height) return false;
    return true;
  }

  /**
   * Genera una posición aleatoria en el mapa
   * @returns {Object} Un objeto con las coordenadas x e y
   */
  generateRandomPosition () {
    const x = Math.floor(Math.random() * (this.width - 20));
    const y = Math.floor(Math.random() * (this.height - 20));
    if (x >= 0 && x <= 90 && y >= 0 && y <= 90) return this.generateRandomPosition();
    if (x >= this.width - 90 && x <= this.width && y >= this.height - 90 && y <= this.height) return this.generateRandomPosition();
    return { x, y };
  }

  /**
   * Establece el ancho del mapa
   * @param {number} width - Nuevo ancho del mapa
   */
  setWidth (width) {
    if (width >= configs.map.maxWidth && width <= configs.map.minWidth) {
      this.width = width;
    }
  }

  /**
   * Establece la altura del mapa
   * @param {number} height - Nueva altura del mapa
   */
  setHeight (height) {
    if (height >= configs.map.maxHeight && height <= configs.map.minHeight) {
      this.height = height;
    }
  }

  /**
   * Obtiene el ancho del mapa
   * @returns {number} El ancho del mapa
   */
  getWidth () {
    return this.width;
  }

  /**
   * Obtiene la altura del mapa
   * @returns {number} La altura del mapa
   */
  getHeight () {
    return this.height;
  }

  /**
   * Añade una piedra en una posición específica
   * @param {number} x - Coordenada x
   * @param {number} y - Coordenada y
   * @returns {Object} La nueva piedra añadida
   */
  addStone (x, y) {
    const newStone = {
      id: `brick${Date.now()}`,
      x,
      y,
      width: 20,
      height: 20
    };
    this.stones.push(newStone);
    return newStone;
  }
}
