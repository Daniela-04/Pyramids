import configs from '../configs.js';
export default class Pyramid {
  #levels;
  constructor () {
    this.#levels = new Array(configs.map.pisos).fill(null);
  }

  addStone () {
    // Añade una piedra a la pirámide
    // Verificar si hay espacio en la pirámide
    // Colocar la piedra en el nivel correspondiente
  }

  setPisos (pisos) {
    console.log(`Pisos actualizados en pyramid.js: ${pisos}`);
    if (pisos >= configs.map.pisosMin && pisos <= configs.map.pisosMax) {
      this.#levels = new Array(pisos).fill(null);
    }
  }

  getPisos () {
    return this.#levels.length;
  }
}
