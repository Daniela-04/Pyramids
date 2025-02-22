// eslint-disable-next-line no-undef
const socket = io('http://localhost:8180');
const svg = document.getElementById('gameMap');
const pisos = document.getElementById('pisos');

socket.emit('join', 'player');

const moving = { up: false, down: false, left: false, right: false };

document.addEventListener('keydown', (event) => {
  if (['w', 'ArrowUp'].includes(event.key)) moving.up = true;
  if (['s', 'ArrowDown'].includes(event.key)) moving.down = true;
  if (['a', 'ArrowLeft'].includes(event.key)) moving.left = true;
  if (['d', 'ArrowRight'].includes(event.key)) moving.right = true;
  movePlayer();

  if (event.key === 'Enter' || event.key === ' ') {
    socket.emit('recoger', 'item');
  }
});

document.addEventListener('keyup', (event) => {
  if (['w', 'ArrowUp'].includes(event.key)) moving.up = false;
  if (['s', 'ArrowDown'].includes(event.key)) moving.down = false;
  if (['a', 'ArrowLeft'].includes(event.key)) moving.left = false;
  if (['d', 'ArrowRight'].includes(event.key)) moving.right = false;
});
const dataPlayer = {};
socket.on('coordinates', (data) => {
  dataPlayer.x = data.x;
  dataPlayer.y = data.y;
  dataPlayer.speed = data.speed;
  console.log(dataPlayer);
});

function movePlayer () {
  let newX = dataPlayer.x;
  let newY = dataPlayer.y;

  if (moving.up) newY = Math.max(0, dataPlayer.y - dataPlayer.speed);
  if (moving.down) newY = Math.min(440, dataPlayer.y + dataPlayer.speed);
  if (moving.left) newX = Math.max(0, dataPlayer.x - dataPlayer.speed);
  if (moving.right) newX = Math.min(600, dataPlayer.x + dataPlayer.speed);

  // Si las coordenadas han cambiado, enviarlas al servidor
  if (newX !== dataPlayer.x || newY !== dataPlayer.y) {
    dataPlayer.x = newX;
    dataPlayer.y = newY;
    socket.emit('move', dataPlayer);
  }
}

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

const currentPlayers = {};
socket.on('drawPlayers', (players) => {
  players.forEach(player => {
    currentPlayers[player.id] = player;
  });
  drawPlayers();
});

function drawPlayers () {
  const playersGroup = document.getElementById('players');

  playersGroup.innerHTML = '';
  for (const id in currentPlayers) {
    const player = currentPlayers[id];

    const playerElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    playerElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '../assets/img/fotoPlayer.png');
    playerElement.setAttribute('x', player.position.x);
    playerElement.setAttribute('y', player.position.y);
    playerElement.setAttribute('width', '40');
    playerElement.setAttribute('height', '40');
    playersGroup.appendChild(playerElement);
  }
}

// Añadir listener para el mensaje de inicio del juego
socket.on('gameStart', (data) => {
  window.alert(data.message);
  update();
});

// Añadir listener para el mensaje de parada
socket.on('gameStop', (data) => {
  window.alert(data.message);
});

socket.on('mapUpdated', (map) => {
  svg.setAttribute('width', map.width);
  svg.setAttribute('height', map.height);
  svg.setAttribute('viewBox', `0 0 ${map.width} ${map.height}`);
  pisos.value = map.pisos;
});

let isUpdating = false;

function update () {
  if (!isUpdating) {
    isUpdating = true;
    window.requestAnimationFrame(() => {
      movePlayer();
      drawPlayers();
      isUpdating = false;
      update();
    });
  }
}
