// eslint-disable-next-line no-undef
const socket = io('http://localhost:8180');
const svg = document.getElementById('gameMap');
const pisos = document.getElementById('pisos');

socket.emit('join', 'player');

const moving = { up: false, down: false, left: false, right: false };

document.addEventListener('keydown', (event) => {
  if (event.key === 'w' || event.key === 'ArrowUp') {
    moving.up = true;
  } else if (event.key === 's' || event.key === 'ArrowDown') {
    moving.down = true;
  } else if (event.key === 'a' || event.key === 'ArrowLeft') {
    moving.left = true;
  } else if (event.key === 'd' || event.key === 'ArrowRight') {
    moving.right = true;
  }

  if (moving.up && moving.down) return;
  if (moving.left && moving.right) return;
  movePlayer();

  if (event.key === 'Enter' || event.key === ' ') {
    socket.emit('recoger', 'item');
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'w' || event.key === 'ArrowUp') {
    moving.up = false;
  } else if (event.key === 's' || event.key === 'ArrowDown') {
    moving.down = false;
  } else if (event.key === 'a' || event.key === 'ArrowLeft') {
    moving.left = false;
  } else if (event.key === 'd' || event.key === 'ArrowRight') {
    moving.right = false;
  }
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
  if (moving.down) newY = Math.min(465, dataPlayer.y + dataPlayer.speed);
  if (moving.left) newX = Math.max(0, dataPlayer.x - dataPlayer.speed);
  if (moving.right) newX = Math.min(625, dataPlayer.x + dataPlayer.speed);

  dataPlayer.x = newX;
  dataPlayer.y = newY;
  socket.emit('move', dataPlayer);
}

// Añadir el listener para las rocas
socket.on('bricks', (bricks) => {
  const stonesGroup = document.getElementById('stones');

  const existingBricks = new Map();
  stonesGroup.childNodes.forEach((child) => {
    if (child.id) existingBricks.set(child.id, child);
  });

  bricks.forEach((brick) => {
    const brickElement = existingBricks.get(brick.id);

    if (!brickElement) {
      const brickElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      brickElement.setAttributeNS(null, 'href', '../assets/mapElements/ladrillo.png');
      brickElement.setAttributeNS(null, 'x', brick.x);
      brickElement.setAttributeNS(null, 'y', brick.y);
      brickElement.setAttributeNS(null, 'width', '20');
      brickElement.setAttributeNS(null, 'height', '20');
      stonesGroup.appendChild(brickElement);
    }
  });
});

const currentPlayers = [];
socket.on('drawPlayers', (players) => {
  currentPlayers.push(...players);
  drawPlayers(players);
  console.log(players);
});

function drawPlayers (players) {
  const playersGroup = document.getElementById('players');

  const existingPlayers = new Map();
  playersGroup.childNodes.forEach((child) => {
    if (child.id) existingPlayers.set(child.id, child);
  });

  players.forEach((player) => {
    let playerElement = existingPlayers.get(player.id);

    if (!playerElement) {
      playerElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      playerElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '../assets/img/fotoPlayer.png');
      playerElement.setAttributeNS(null, 'id', player.id);
      playerElement.setAttributeNS(null, 'width', '40');
      playerElement.setAttributeNS(null, 'height', '40');
      playersGroup.appendChild(playerElement);
    }

    playerElement.setAttributeNS(null, 'x', player.position.x);
    playerElement.setAttributeNS(null, 'y', player.position.y);

    existingPlayers.delete(player.id);
  });

  existingPlayers.forEach((playerElement) => {
    playersGroup.removeChild(playerElement);
  });
}
// Añadir listener para el mensaje de inicio del juego
socket.on('gameStart', (data) => {
  window.alert(data.message);
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
