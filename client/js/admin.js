// eslint-disable-next-line no-undef
const socket = io('http://localhost:8180');

socket.emit('join', 'admin');

/* document.querySelector('#engegar').addEventListener('click', () => {
  socket.emit('iniciar', true);
}); */

const width = document.getElementById('width');
const height = document.getElementById('height');
const pisos = document.getElementById('pisos');

document.addEventListener('DOMContentLoaded', () => {
  socket.emit('inicializeMap', { width: width.value, height: height.value, pisos: pisos.value });
});

width.addEventListener('change', (event) => {
  socket.emit('changeWidth', event.target.value);
});

height.addEventListener('change', (event) => {
  socket.emit('changeHeight', event.target.value);
});

pisos.getElementById('pisos').addEventListener('change', (event) => {
  socket.emit('changePisos', event.target.value);
});
