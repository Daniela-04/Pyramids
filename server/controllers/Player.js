export default class Player {
  constructor (id, name) {
    this.id = id;
    this.name = name;
    this.position = { x: 0, y: 0 };
    this.hasStone = false;
  }

  move (direction) {
    // Cambia la posición del jugador
    // Verificar si la nueva posición es válida
    // Actualizar la posición del jugador
  }

  setPosition (x, y) {
    // Establece la posición del jugador
    this.position.x = x;
    this.position.y = y;
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
}
