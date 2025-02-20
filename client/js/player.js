/* global alert */
// eslint-disable-next-line no-undef
const socket = io('http://localhost:8180');

socket.emit('join', 'player');

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' || event.key === 'w') {
    socket.emit('move', 'up');
  }
  if (event.key === 'ArrowDown' || event.key === 's') {
    socket.emit('move', 'down');
  }
  if (event.key === 'ArrowLeft' || event.key === 'a') {
    socket.emit('move', 'left');
  }
  if (event.key === 'ArrowRight' || event.key === 'd') {
    socket.emit('move', 'right');
  }

  if (event.key === 'Enter' || event.key === ' ') {
    socket.emit('recoger', 'item');
  }
});

// Añadir el listener para las rocas
socket.on('bricks', (bricks) => {
  const stonesGroup = document.getElementById('stones');
  stonesGroup.innerHTML = ''; // Clear existing bricks
  bricks.forEach((brick) => {
    const brickElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    brickElement.setAttributeNS(null, 'href', '../assets/mapElements/ladrillo.png');
    brickElement.setAttributeNS(null, 'x', brick.x);
    brickElement.setAttributeNS(null, 'y', brick.y);
    brickElement.setAttributeNS(null, 'width', '20');
    brickElement.setAttributeNS(null, 'height', '20');
    stonesGroup.appendChild(brickElement);
  });
});

// Añadir listener para el mensaje de inicio del juego
socket.on('gameStart', (data) => {
  alert(data.message);
  // También podrías crear un modal más elegante en lugar de usar alert
});

// Añadir listener para el mensaje de parada
socket.on('gameStop', (data) => {
  alert(data.message);
  // También podrías crear un modal más elegante en lugar de usar alert
});
