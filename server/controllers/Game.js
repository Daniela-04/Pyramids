import WebSocketHandler from './WebSocketHandler.js';
import Mapa from './Mapa.js';
import Pyramid from './Pyramid.js';
import Player from './Player.js';

export class Game {
  constructor () {
    this.players = [];
    this.pyramid = new Pyramid();
  }

  init () {
    WebSocketHandler.on('iniciar', this.start.bind(this));
    WebSocketHandler.on('inicializeMap', this.configureMap.bind(this));
    WebSocketHandler.on('join', this.addPlayer.bind(this));
  }

  start (data) {
    console.log(`Juego iniciado: ${data}`);
  }

  stop () {
    // Detiene el juego
    // Cambia estado del juego a inactivo
    // Notifica a los jugadores que el juego ha terminado
  }

  addPlayer (playerId) {
    const player = new Player(playerId, 'Player');
    const position = this.map.generateRandomPosition();
    console.log(position);
    this.players.push(player);
    console.log(this.players);
  }

  configureMap (settings) {
    this.map = new Mapa(settings.width, settings.height);
    console.log(this.map);
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
