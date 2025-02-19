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
    socket.on('iniciar', (data) => {
      this.#emitEvent('iniciar', data);
      console.log(this.#eventListeners);
    });

    socket.on('join', (role) => {
      console.log(`Cliente ${socket.id} se ha unido como ${role}`);
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
