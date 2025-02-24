// eslint-disable-next-line no-undef
const socket = io('http://localhost:8180');
const svg = document.getElementById('gameMap');
const area2 = document.getElementById('area2');
const pisos = document.getElementById('pisos');
const piramide1 = document.getElementById('piramide1');
const piramide2 = document.getElementById('piramide2');

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

// Modificar la función movePlayer
function movePlayer () {
  let newX = dataPlayer.x;
  let newY = dataPlayer.y;

  // Guardar la posición anterior
  const oldX = newX;
  const oldY = newY;

  // Mover basado en las teclas presionadas
  if (moving.up) newY = Math.max(0, dataPlayer.y - dataPlayer.speed);
  if (moving.down) newY = Math.min(svg.getAttribute('height') - 40, dataPlayer.y + dataPlayer.speed);
  if (moving.left) newX = Math.max(0, dataPlayer.x - dataPlayer.speed);
  if (moving.right) newX = Math.min(svg.getAttribute('width') - 40, dataPlayer.x + dataPlayer.speed);

  // Verificar colisión con otros jugadores
  if (checkPlayerCollision(newX, newY)) {
    // Si hay colisión, mantener la posición anterior
    newX = oldX;
    newY = oldY;
  }

  // Si las coordenadas han cambiado y no hay colisión, actualizar
  if (newX !== dataPlayer.x || newY !== dataPlayer.y) {
    dataPlayer.x = newX;
    dataPlayer.y = newY;
    socket.emit('move', dataPlayer);

    const playerElement = document.getElementById(dataPlayer.id);
    if (playerElement) {
      playerElement.setAttribute('x', newX);
      playerElement.setAttribute('y', newY);
    }
  }
}

function checkCollisionBetweenRects (rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
}

function checkPlayerCollision (newX, newY) {
  const playerRect = {
    x: newX,
    y: newY,
    width: 40,
    height: 40
  };

  for (const id in currentPlayers) {
    if (id === dataPlayer.id) continue; // Ignorar el jugador actual

    const otherPlayer = currentPlayers[id];
    const otherPlayerRect = {
      x: otherPlayer.position.x,
      y: otherPlayer.position.y,
      width: 40,
      height: 40
    };

    if (checkCollisionBetweenRects(playerRect, otherPlayerRect)) {
      return true;
    }
  }
  return false;
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
// Asegurarse de que update() se inicie cuando comienza el juego
socket.on('gameStart', (data) => {
  window.alert(data.message);
  update(); // Iniciar el bucle de actualización
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
  piramide2.setAttribute('x', map.width - 90);
  piramide2.setAttribute('y', map.height - 90);
  pisos.value = map.pisos;
});

socket.on('setPyramid', (pisos) => {
  actualizarPisos(pisos, piramide1);
  actualizarPisos(pisos, piramide2);
});

socket.on('newStone', (data) => {
  const { currentStones, remainingLevels, team } = data;
  console.log(data);
  const piramide = team === 'purple' ? piramide1 : piramide2;
  console.log(`#ladrillo_F${remainingLevels}-${currentStones}`);

  piramide.querySelector(`#ladrillo_F${remainingLevels}-${currentStones}`).classList.remove('gray');
});

let isUpdating = false;

// Modificar la función update para que se ejecute continuamente
function update () {
  if (!isUpdating) {
    isUpdating = true;
    window.requestAnimationFrame(() => {
      movePlayer(); // Mover al jugador si hay teclas presionadas
      isUpdating = false;
      update();
    });
  }
}

function actualizarPisos (nPisos) {
  document.querySelectorAll("[id$='-F5'], [id$='-F6'], [id$='-F7'], [id$='-F8']").forEach(figura => {
    const pisoNumero = parseInt(figura.id.split('-F')[1], 10);

    figura.style.display = (pisoNumero <= nPisos) ? 'block' : 'none';
  });
}
