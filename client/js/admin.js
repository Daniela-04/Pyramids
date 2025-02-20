// eslint-disable-next-line no-undef
const socket = io('http://localhost:8180');

socket.emit('join', 'admin');

document.querySelector('#engegar').addEventListener('click', () => {
  socket.emit('iniciar', true);
});
