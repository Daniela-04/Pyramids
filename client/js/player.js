/* global alert */
// eslint-disable-next-line no-undef
const socket = io('http://localhost:8180');
const svg = document.getElementById('gameMap');
const pisos = document.getElementById('pisos');

socket.emit('join', 'player');

// const moving = { up: false, down: false, left: false, right: false };

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

socket.on('drawPlayers', (players) => {
  const playersGroup = document.getElementById('players');
  playersGroup.innerHTML = '';
  players.forEach((player) => {
    const playerElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    playerElement.setAttributeNS(null, 'href', '../assets/img/fotoPlayer.png');
    playerElement.setAttributeNS(null, 'id', player.id);
    playerElement.setAttributeNS(null, 'x', player.position.x);
    playerElement.setAttributeNS(null, 'y', player.position.y);
    playerElement.setAttributeNS(null, 'width', '40');
    playerElement.setAttributeNS(null, 'height', '40');
    document.getElementById('players').appendChild(playerElement);
  });
});
// Añadir listener para el mensaje de inicio del juego
socket.on('gameStart', (data) => {
  alert(data.message);
});

// Añadir listener para el mensaje de parada
socket.on('gameStop', (data) => {
  alert(data.message);
});

socket.on('mapUpdated', (map) => {
  svg.setAttribute('width', map.width);
  svg.setAttribute('height', map.height);
  svg.setAttribute('viewBox', `0 0 ${map.width} ${map.height}`);
  pisos.value = map.pisos;
});
