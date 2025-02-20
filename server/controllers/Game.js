import WebSocketHandler from './WebSocketHandler.js';
import Mapa from './Mapa.js';
import Pyramid from './Pyramid.js';

export class Game {
  constructor () {
    this.players = [];
    this.map = new Mapa();
    this.pyramid = new Pyramid();
  }

  init () {
    WebSocketHandler.on('iniciar', this.start);
  }

  start (data) {
    console.log(`Juego iniciado: ${data}`);
  }

  stop () {
    // Detiene el juego
    // Cambia estado del juego a inactivo
    // Notifica a los jugadores que el juego ha terminado
  }

  addPlayer (player) {
    // Añade un jugador
    // Verificar que no supere el número máximo de jugadores
    // Asignar una posición inicial dentro del mapa
  }

  removePlayer (playerId) {
    // Elimina un jugador
    // Buscar al jugador por su ID y eliminarlo de la lista
    // Notificar a otros jugadores sobre la salida
  }

  updateGameState () {
    // Actualiza el estado del juego
    // Mueve jugadores automáticamente
    // Genera nuevos elementos en el mapa si es necesario
  }
}

export default new Game();
