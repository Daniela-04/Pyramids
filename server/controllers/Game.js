import WebSocketHandler from './WebSocketHandler.js';
import configs from '../../configs.js';
import Map from './Mapa.js';
import Pyramid from './Pyramid.js';
import Player from './Player.js';
import { Admin } from './Admin.js';

export class Game {
  constructor () {
    this.players = [];
    this.blueTeam = false;
    this.pyramid = new Pyramid();
    this.map = new Map();
    this.isRunning = false;
    this.interval = null;
  }

  init () {
    WebSocketHandler.on('startGame', () => Admin.startGame());
    WebSocketHandler.on('configureGame', (settings) => Admin.configureGame(settings));
    WebSocketHandler.on('stopGame', () => this.stop());
    WebSocketHandler.on('join', this.addPlayer.bind(this));
    WebSocketHandler.on('leave', this.removePlayer.bind(this));
    WebSocketHandler.on('move', this.movePlayer.bind(this));
    WebSocketHandler.on('recoger', this.pickUpBrick.bind(this));
    WebSocketHandler.on('soltar', this.dropBrick.bind(this));
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
          this.map.stones.push({ ...position, id: `brick${stonesGenerated}` });
          stonesGenerated++;
          WebSocketHandler.broadcast('bricks', this.map.stones);
          // console.log(this.map.stones);
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

  addPlayer (playerId, socket) {
    this.blueTeam = !this.blueTeam;
    const player = new Player(playerId, 'Player');
    const position = this.map.generateRandomPosition();
    player.setPosition(position.x, position.y);
    player.setTeam(this.blueTeam ? 'blue' : 'purple');
    this.players.push(player);
    socket.emit('coordinates', { id: playerId, x: position.x, y: position.y, speed: configs.player.speed, hasStone: player.hasStone });
  }

  movePlayer (coords, socket) {
    const playerId = socket.id;
    const player = this.players.find((player) => player.id === playerId);
    if (player) {
      player.setPosition(coords.x, coords.y);
      WebSocketHandler.broadcast('drawPlayers', this.playersToArray());
    }
  }

  pickUpBrick ({ playerId, brickId }) {
    const player = this.players.find(player => player.id === playerId);
    if (player && !player.hasStone) {
      this.map.stones = this.map.stones.filter(brick => brick.id !== brickId);
      player.pickUpStone();
      WebSocketHandler.broadcast('bricks', this.map.stones);
      WebSocketHandler.broadcast('drawPlayers', this.playersToArray());
    }
  }

  dropBrick ({ playerId, x, y }) {
    const player = this.players.find(player => player.id === playerId);
    if (player && player.hasStone) {
      const newStone = {
        id: `brick${Date.now()}`,
        x,
        y
      };
      this.map.stones.push(newStone);
      player.dropStone();
      WebSocketHandler.broadcast('bricks', this.map.stones);
      WebSocketHandler.broadcast('drawPlayers', this.playersToArray());
    }
  }

  configureMap (settings) {
    this.map = new Map(settings.width, settings.height);
  }

  removePlayer (playerId) {
    this.players = this.players.filter(player => player.id !== playerId);
    WebSocketHandler.broadcast('drawPlayers', this.playersToArray());
  }

  updateGameState () {

  }

  playersToArray () {
    return this.players.map((player) => player.toObject());
  }

  // Método para obtener el estado del juego
  getState () {
    return this.isRunning;
  }
}

export default new Game();
