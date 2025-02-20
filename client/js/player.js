export class Player {
  #socket = null;
  init () {
    this.initSocket();
  }

  initSocket () {
    // eslint-disable-next-line no-undef
    this.#socket = io('http://localhost:8180');
    this.#socket.emit('join', 'player');
  }
}
