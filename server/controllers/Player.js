import configs from '../../configs.js';
export default class Player {
  constructor (id) {
    this.id = id;
    this.position = { x: 0, y: 0 };
    this.hasStone = false;
    this.team = null;
  }

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

  setPosition (x, y) {
    // Establece la posición del jugador
    this.position.x = x;
    this.position.y = y;
  }

  setTeam (team) {
    this.team = team;
  }

  pickUpStone () {
    // Recoge una piedra
    // Verificar si hay una piedra en la posición del jugador
    // Asignar la piedra al jugador si está disponible
  }

  dropStone () {
    // Deja una piedra
    // Verificar si el jugador tiene una piedra
    // Colocar la piedra en la pirámide si está en la zona de construcción
  }

  toObject () {
    return { id: this.id, position: this.position, hasStone: this.hasStone, team: this.team };
  }
}
