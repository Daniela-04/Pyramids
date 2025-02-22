// eslint-disable-next-line no-undef
const socket = io('http://localhost:8180');
const svg = document.getElementById('gameMap');
const area2 = document.getElementById('area2');
const pisos = document.getElementById('pisos');

socket.emit('join', 'player');

const moving = { up: false, down: false, left: false, right: false };

document.addEventListener('keydown', (event) => {
  if (['w', 'ArrowUp'].includes(event.key)) moving.up = true;
  if (['s', 'ArrowDown'].includes(event.key)) moving.down = true;
  if (['a', 'ArrowLeft'].includes(event.key)) moving.left = true;
  if (['d', 'ArrowRight'].includes(event.key)) moving.right = true;
  movePlayer();

  if (['Enter', ' '].includes(event.key)) {
    // verificar colicion con un ladrillo

    const playerX = dataPlayer.x;
    const playerY = dataPlayer.y;

    console.log(playerX, playerY, dataPlayer.id);
    console.log(document.getElementById(dataPlayer.id));
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
  dataPlayer.id = data.id;
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

// function checkCollision (element1, element2) {
//   const rect1 = element1.getBoundingClientRect();
//   const rect2 = element2.getBoundingClientRect();
//   return rect1.top < rect2.bottom && rect1.bottom > rect2.top && rect1.left < rect2.right && rect1.right > rect2.left;
// }
// Añadir el listener para las rocas
socket.on('bricks', (bricks) => {
  const stonesGroup = document.getElementById('stones');
  stonesGroup.innerHTML = '';
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

let currentPlayers = {};
socket.on('drawPlayers', (players) => {
  currentPlayers = {};
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
    const teamColor = player.team === 'blue' ? '../assets/img/fotoPlayer.png' : '../assets/img/fotoPlayer2.png';

    const playerElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    playerElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', teamColor);
    playerElement.setAttributeNS(null, 'id', player.id);
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
  const playersGroup = document.getElementById('players');
  playersGroup.innerHTML = '';
  window.alert(data.message);
});

socket.on('mapUpdated', (map) => {
  svg.setAttribute('width', map.width);
  svg.setAttribute('height', map.height);
  svg.setAttribute('viewBox', `0 0 ${map.width} ${map.height}`);
  area2.setAttribute('x', map.width - 90);
  area2.setAttribute('y', map.height - 90);
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
