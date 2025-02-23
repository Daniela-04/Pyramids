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
    if (dataPlayer.hasStone) {
      socket.emit('soltar', {
        playerId: dataPlayer.id,
        x: dataPlayer.x,
        y: dataPlayer.y
      });
      dataPlayer.hasStone = false; // Actualizar el estado local
    } else {
      const collidedBrick = checkCollisionWithBricks();
      if (collidedBrick && !dataPlayer.hasStone) {
        socket.emit('recoger', {
          playerId: dataPlayer.id,
          brickId: collidedBrick.id
        });
        dataPlayer.hasStone = true; // Actualizar el estado local
      }
    }
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
  dataPlayer.hasStone = data.hasStone;
  console.log(dataPlayer);
});
// Añadir listener para el mensaje de juego en curso
// Mostramos mensaje en pantalla
socket.on('gameRunning', (data) => {
  window.location.href = '/lobby';
});

// Recargamos pagina sin gameStopped = false
socket.on('gameStopped', () => {
  window.location.href = '/player';
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

function checkCollisionWithBricks () {
  const stonesGroup = document.getElementById('stones');
  const playerRect = {
    x: dataPlayer.x,
    y: dataPlayer.y,
    width: 40,
    height: 40
  };

  for (const brickElement of stonesGroup.children) {
    const brickRect = {
      x: parseInt(brickElement.getAttribute('x')),
      y: parseInt(brickElement.getAttribute('y')),
      width: parseInt(brickElement.getAttribute('width')),
      height: parseInt(brickElement.getAttribute('height')),
      id: brickElement.getAttribute('id')
    };

    if (playerRect.x < brickRect.x + brickRect.width &&
        playerRect.x + playerRect.width > brickRect.x &&
        playerRect.y < brickRect.y + brickRect.height &&
        playerRect.y + playerRect.height > brickRect.y) {
      return brickRect;
    }
  }
  return null;
}

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
    brickElement.setAttributeNS(null, 'id', brick.id);
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
