// eslint-disable-next-line no-undef
const socket = io('http://localhost:8180');

// Redirigir a /player cuando el juego se detenga
socket.on('gameStopped', () => {
  window.location.href = '/player';
});

// Redirigir a /player cuando el juego se inicie
socket.on('gameStart', () => {
  window.location.href = '/player';
});
