import configs from '../../configs.js';

export default class Player {
  /**
   * Constructor de la clase Player
   * @param {string} id - Identificador único del jugador
   */
  constructor (id) {
    this.id = id;
    this.position = { x: 0, y: 0 };
    this.hasStone = false;
    this.team = null;
  }

  /**
   * Mueve al jugador en una dirección específica
   * @param {string} direction - Dirección en la que se mueve el jugador ('left', 'right', 'up', 'down')
   */
  move (direction) {
    if (direction === 'left') {
      this.position.x -= configs.player.speed;
    }
    if (direction === 'right') {
      this.position.x += configs.player.speed;
    }
    if (direction === 'up') {
      this.position.y -= configs.player.speed;
    }
    if (direction === 'down') {
      this.position.y += configs.player.speed;
    }
  }

  /**
   * Establece la posición del jugador
   * @param {number} x - Coordenada x
   * @param {number} y - Coordenada y
   */
  setPosition (x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  /**
   * Establece el equipo del jugador
   * @param {string} team - Nombre del equipo
   */
  setTeam (team) {
    this.team = team;
  }

  /**
   * Recoge una piedra
   */
  pickUpStone () {
    this.hasStone = true;
  }

  /**
   * Deja una piedra
   */
  dropStone () {
    this.hasStone = false;
  }

  /**
   * Convierte el estado del jugador a un objeto
   * @returns {Object} Representación del jugador como objeto
   */
  toObject () {
    return { id: this.id, position: this.position, hasStone: this.hasStone, team: this.team };
  }
}
