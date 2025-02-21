import { Server } from 'socket.io';
import configs from '../configs.js';
import { createServer } from 'http';

export default class WebSocketHandler {
  static #httpServer;
  static #io;
  static #eventListeners = new Map();

  static init () {
    this.#httpServer = createServer();
    this.#io = new Server(this.#httpServer, { cors: { origin: '*' } });
    this.#httpServer.listen(configs.socketPort);
    this.handleConnections();
  }

  static handleConnections () {
    this.#io.on('connection', (socket) => {
      this.handleEvents(socket);
    });
  }

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
        this.#emitEvent('join', socket.id, socket);
      }
      // console.log(this.#eventListeners);
    });

    socket.on('move', (direction) => {
      this.#emitEvent('move', socket, direction);
      console.log(`Cliente ${socket.id} se ha movido hacia ${direction}`);
    });

    socket.on('recoger', (item) => {
      console.log(`Cliente ${socket.id} ha recogido un(a) ${item}`);
    });

    socket.on('stopGame', () => {
      this.#emitEvent('stopGame');
      this.broadcast('gameStop', { message: 'El administrador ha detenido el juego' });
    });
  }

  static on (event, callback) {
    this.#eventListeners.set(event, callback);
  }

  static #emitEvent (event, socket, data) {
    if (this.#eventListeners.has(event)) {
      this.#eventListeners.get(event)(socket, data);
    }
  }

  static broadcast (event, data) {
    this.#io.emit(event, data);
  }
}
