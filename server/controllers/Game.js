import WebSocketHandler from './WebSocketHandler.js';

export class Game {
  init () {
    WebSocketHandler.on('iniciar', this.start);
  }

  start (data) {
    console.log(`Juego iniciado: ${data}`);
  }
}

export default new Game();
