import WebSocketHandler from './WebSocketHandler.js';

/**
 * Clase Pyramid
 * Representa una pirámide de ladrillos
 */
export default class Pyramid {
  #team;
  #contador = 0;
  #levels;
  #currentStones = 0;
  // #stonesperPiramidLevel = {
  //   4: 10,
  //   5: 15,
  //   6: 21,
  //   7: 28,
  //   8: 36
  // };

  /**
   * Constructor de la clase Pyramid
   * @param {number} pisos - Número de niveles de la pirámide
   * @param {string} team - Nombre del equipo
   */
  constructor (pisos, team) {
    this.#team = team;
    this.#levels = pisos;
  }

  /**
   * Añade una piedra a la pirámide
   * Incrementa el contador de piedras actuales y el contador total
   * Emite un evento de WebSocket con la información actualizada
   * Si el contador alcanza el número de niveles, reinicia el contador y decrementa los niveles restantes
   */
  addStone () {
    this.#currentStones++;
    this.#contador++;
    WebSocketHandler.broadcast('newStone', { team: this.#team, currentStones: this.#currentStones, remainingLevels: this.#levels });

    if (this.#contador === this.#levels) {
      this.#levels--;
      this.#contador = 0;
      this.#currentStones = 0;
    }
  }

  /**
   * Verifica si la pirámide está completada
   * @returns {boolean} True si la pirámide está completada, false en caso contrario
   */
  isCompleted () {
    return this.#levels === 1;
  }
}
