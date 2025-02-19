// eslint-disable-next-line no-undef
const socket = io('http://localhost:8180');

socket.emit('join', 'player');

document.getElementById('cerrarSesionButton').addEventListener('click', function () {
  window.location.href = '/choose';
});
