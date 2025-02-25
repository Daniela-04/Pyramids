import Game from './Game.js';
import WebSocketHandler from './WebSocketHandler.js';

export class Admin {
  /**
   * Configura el juego con los ajustes proporcionados
   * @param {Object} settings - Configuraciones del juego
   */
  static configureGame (settings) {
    Game.configureMap(settings);
    WebSocketHandler.broadcast('mapUpdated', settings);
    WebSocketHandler.broadcast('setPyramid', settings.pisos);
  }

  /**
   * Inicia el juego
   * Verifica si el mapa está configurado antes de iniciar el juego
   */
  static startGame () {
    if (!Game.map) {
      console.error('El mapa no está configurado');
      return;
    }

    Game.start();
  }

  /**
   * Detiene el juego
   */
  static stopGame () {
    Game.stop();
  }
}
