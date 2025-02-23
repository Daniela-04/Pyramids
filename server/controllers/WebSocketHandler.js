import { Server } from 'socket.io';
import configs from '../../configs.js';
import { createServer } from 'http';
// importo el modulo Game para el estado del juego
import Game from './Game.js';

export default class WebSocketHandler {
  static #httpServer;
  static #io;
  static #eventListeners = new Map();

  static init () {
    this.#httpServer = createServer();
    this.#io = new Server(this.#httpServer, { cors: { origin: '*' } });
    this.#httpServer.listen(configs.socketPort);
    this.handleConnection();
  }

  /**
   * Maneja conexiones entrantes
   * @listens connection
   */
  static handleConnection () {
    this.#io.on('connection', (socket) => {
      this.handleEvents(socket);
    });
  }

  /**
   * Maneja eventos de un socket
   * @param {Socket} socket - Socket del cliente
   */
  static handleEvents (socket) {
    socket.on('disconnect', () => {
      this.#emitEvent('leave', socket.id);
    });
    socket.on('iniciar', () => {
      this.#emitEvent('startGame');
      this.broadcast('gameStart', { message: 'El administrador ha iniciado el juego' });
    });

    socket.on('inicializeMap', (settings) => {
      // console.log('Admin configuró el mapa:', settings);
      this.#emitEvent('configureGame', settings);
    });

    socket.on('join', (role) => {
      console.log(`Cliente ${socket.id} se ha unido como ${role}`);
      if (role === 'player') {
        // Enviamos el estado del juego a los nuevos jugadores
        if (Game.getState()) {
          socket.emit('gameRunning', { message: 'El juego ya está en curso' });
        } else {
          this.#emitEvent('join', socket.id, socket);
        }
      }
      // console.log(this.#eventListeners);
    });

    socket.on('move', (coords) => {
      this.#emitEvent('move', coords, socket);
      // console.log(`Cliente ${socket.id} se ha movido hacia ${coords.x}, ${coords.y}`);
    });

    socket.on('recoger', (data) => {
      console.log(`Cliente ${data.playerId} ha recogido la piedra ${data.brickId}`);
      this.#emitEvent('recoger', data);
    });

    socket.on('soltar', (data) => {
      console.log(`Cliente ${data.playerId} ha soltado la piedra en (${data.x}, ${data.y})`);
      this.#emitEvent('soltar', data);
    });

    socket.on('stopGame', () => {
      this.#emitEvent('stopGame');
      this.broadcast('gameStop', { message: 'El administrador ha detenido el juego' });
    });

    socket.on('gameStopped', () => {
      this.broadcast('gameStopped');
    });
  }

  /**
   * Registra un callback para un evento en particular.
   *
   * @param {string} event - El nombre del evento al que se va a registrar el callback.
   * @param {function} callback - El callback que se va a ejecutar cuando se emita el evento.
   */

  static on (event, callback) {
    this.#eventListeners.set(event, callback);
  }

  /**
   * Emite un evento a los listeners registrados para ese evento.
   *
   * @param {string} event - El nombre del evento a emitir.
   * @param {*} data - Los datos que se van a pasar al listener.
   * @param {Socket} socket - El socket que ha emitido el evento (opcional).
   */
  static #emitEvent (event, data, socket) {
    if (this.#eventListeners.has(event)) {
      this.#eventListeners.get(event)(data, socket);
    }
  }

  /**
   * Broadcasts an event with the specified data to all connected clients.
   *
   * @param {string} event - The name of the event to broadcast.
   * @param {*} data - The data to send with the event to all clients.
   */

  static broadcast (event, data) {
    this.#io.emit(event, data);
  }
}
