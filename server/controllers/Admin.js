import Game from './Game.js';
import WebSocketHandler from './WebSocketHandler.js';

export class Admin {
  static configureGame (settings) {
    Game.configureMap(settings);
    WebSocketHandler.broadcast('mapUpdated', settings);
    WebSocketHandler.broadcast('setPyramid', settings.pisos);
  }

  static startGame () {
    if (!Game.map) {
      console.error('El mapa no está configurado');
      return;
    }

    Game.start();
  }

  static stopGame () {
    Game.stop();
  }
}
