import WebSocketHandler from './WebSocketHandler.js';
export default class Pyramid {
  #team;
  #contador = 0;
  #levels;
  #currentLevel;
  // #numberOfStones;
  #currentStones = 0;
  // #stonesperPiramidLevel = {
  //   4: 10,
  //   5: 15,
  //   6: 21,
  //   7: 28,
  //   8: 36
  // };

  constructor (pisos, team) {
    this.#team = team;
    this.#levels = pisos;
    // this.#numberOfStones = this.#stonesperPiramidLevel[pisos];
  }

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

  isCompleted () {
    return this.#levels === 1;
  }
}
