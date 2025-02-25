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
    this.bluePyramid = new Pyramid();
    this.purplePyramid = new Pyramid();
    this.map = new Map();
    this.isRunning = false;
    this.interval = null;
  }

  /**
   * Inicializa el juego
   * Configura los eventos de WebSocket
   */
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

  /**
   * Inicia el juego
   * Genera piedras en el mapa y las transmite a los clientes
   */
  start () {
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
        }
      } else {
        clearInterval(this.interval);
      }
    }, 500);
  }

  /**
   * Detiene el juego
   * @param {boolean} win - Indica si el juego se detuvo por una victoria
   */
  stop (win = false) {
    this.isRunning = false;
    clearInterval(this.interval);
    if (!win) {
      WebSocketHandler.broadcast('gameStop', { message: 'El administrador ha detenido el juego' });
    } else {
      WebSocketHandler.broadcast('gameStop', { message: `El Equipo ${this.getWinner()} ha ganado` });
    }
  }

  /**
   * Obtiene el equipo ganador
   * @returns {string|null} El nombre del equipo ganador o null si no hay ganador
   */
  getWinner () {
    if (this.bluePyramid.isCompleted()) return 'Azul';
    if (this.purplePyramid.isCompleted()) return 'Morado';
    return null;
  }

  /**
   * Añade un jugador a la lista de jugadores
   * @param {string} playerId - Identificador del jugador
   * @param {Socket} socket - Socket del jugador
   */
  addPlayer (playerId, socket) {
    this.blueTeam = !this.blueTeam;
    const player = new Player(playerId, 'Player');
    const position = this.map.generateRandomPosition();
    player.setPosition(position.x, position.y);
    player.setTeam(this.blueTeam ? 'blue' : 'purple');
    this.players.push(player);
    socket.emit('coordinates', { id: playerId, x: position.x, y: position.y, speed: configs.player.speed, hasStone: player.hasStone });
  }

  /**
   * Mueve un jugador a una nueva posición
   * @param {Object} coords - Coordenadas del jugador
   * @param {Socket} socket - Socket del jugador
   */
  movePlayer (coords, socket) {
    const playerId = socket.id;
    const player = this.players.find((player) => player.id === playerId);
    if (player) {
      player.setPosition(coords.x, coords.y);
      WebSocketHandler.broadcast('drawPlayers', this.playersToArray());
    }
  }

  /**
   * Recoge una piedra
   * @param {Object} data - Datos del jugador y la piedra
   */
  pickUpBrick ({ playerId, brickId }) {
    const player = this.players.find(player => player.id === playerId);
    if (player && !player.hasStone) {
      this.map.stones = this.map.stones.filter(brick => brick.id !== brickId);
      player.pickUpStone();
      WebSocketHandler.broadcast('bricks', this.map.stones);
      WebSocketHandler.broadcast('drawPlayers', this.playersToArray());
    }
  }

  /**
   * Deja una piedra
   * @param {Object} data - Datos del jugador y la posición
   */
  dropBrick ({ playerId, x, y }) {
    const player = this.players.find(player => player.id === playerId);
    if (player && player.hasStone) {
      if (!this.map.checkAreaColission(x, y, player.team)) {
        const newStone = {
          id: `brick${Date.now()}`,
          x,
          y
        };
        this.map.stones.push(newStone);
        player.dropStone();
        WebSocketHandler.broadcast('bricks', this.map.stones);
        WebSocketHandler.broadcast('drawPlayers', this.playersToArray());
      } else {
        player.dropStone();
        if (!this.getWinner()) {
          if (player.team === 'blue') this.bluePyramid.addStone();
          else this.purplePyramid.addStone();

          // Generar un nuevo ladrillo aleatorio
          const position = this.map.generateRandomPosition();
          if (this.map.isPositionAvailable(position.x, position.y)) {
            const newStone = {
              id: `brick${Date.now()}`,
              x: position.x,
              y: position.y
            };
            this.map.stones.push(newStone);
            WebSocketHandler.broadcast('bricks', this.map.stones);
          }
        } else {
          this.stop(true);
        }
      }
    }
  }

  /**
   * Configura el mapa del juego
   * @param {Object} settings - Configuraciones del mapa
   */
  configureMap (settings) {
    this.bluePyramid = new Pyramid(settings.pisos, 'blue');
    this.purplePyramid = new Pyramid(settings.pisos, 'purple');
    this.map = new Map(settings.width, settings.height);
  }

  /**
   * Elimina un jugador del juego
   * @param {string} playerId - Identificador del jugador
   */
  removePlayer (playerId) {
    this.players = this.players.filter(player => player.id !== playerId);
    WebSocketHandler.broadcast('drawPlayers', this.playersToArray());
  }

  /**
   * Convierte el estado de los jugadores a un array de objetos
   * @returns {Array} Array de objetos representando a los jugadores
   */
  playersToArray () {
    return this.players.map((player) => player.toObject());
  }

  /**
   * Obtiene el estado del juego
   * @returns {boolean} True si el juego está en curso, false en caso contrario
   */
  getState () {
    return this.isRunning;
  }
}

export default new Game();
