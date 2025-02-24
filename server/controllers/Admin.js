import Game from './Game.js';
import WebSocketHandler from './WebSocketHandler.js';

export class Admin {
  static configureGame (settings) {
    console.log('Configurando juego:', settings);
    Game.configureMap(settings);
    WebSocketHandler.broadcast('mapUpdated', settings);
    WebSocketHandler.broadcast('setPyramid', settings.pisos);
  }

  static startGame () {
    // console.log('Iniciando juego desde Admin');
    if (!Game.map) {
      console.error('El mapa no está configurado');
      return;
    }

    Game.start();
  }

  static stopGame () {
    console.log('Deteniendo juego');
    Game.stop();
  }
}
