import WebSocketHandler from './WebSocketHandler.js';
import Map from './Mapa.js';
import Pyramid from './Pyramid.js';
import Player from './Player.js';
import { Admin } from './Admin.js';

export class Game {
  constructor () {
    this.players = [];
    this.pyramid = new Pyramid();
    this.map = null;
    this.isRunning = false;
    this.interval = null;
  }

  init () {
    WebSocketHandler.on('startGame', () => Admin.startGame());
    WebSocketHandler.on('configureGame', (settings) => Admin.configureGame(settings));
    WebSocketHandler.on('stopGame', () => this.stop());
    WebSocketHandler.on('join', this.addPlayer.bind(this));
  }

  start () {
    console.log('Juego iniciado');
    this.isRunning = true;
    this.map.stones = []; // Reiniciar las rocas generadas
    WebSocketHandler.broadcast('bricks', this.map.stones); // Limpiar las rocas en los clientes
    let stonesGenerated = 0;
    this.interval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(this.interval);
        return;
      }

      if (stonesGenerated < 20) {
        const position = this.map.generateRandomPosition();
        if (this.map.isPositionAvailable(position.x, position.y)) {
          this.map.stones.push(position);
          stonesGenerated++;
          WebSocketHandler.broadcast('bricks', this.map.stones);
        }
      } else {
        clearInterval(this.interval);
      }
    }, 500);
  }

  stop () {
    console.log('Juego detenido');
    this.isRunning = false;
    clearInterval(this.interval);
    WebSocketHandler.broadcast('gameStop', { message: 'El administrador ha detenido el juego' });
  }

  addPlayer (playerId) {
    const player = new Player(playerId, 'Player');
    const position = this.map.generateRandomPosition();
    player.setPosition(position.x, position.y);
    this.players.push(player);
    console.log(this.players);
  }

  configureMap (settings) {
    this.map = new Map(settings.width, settings.height);
    console.log('Mapa configurado:', settings);
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
