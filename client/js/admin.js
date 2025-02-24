// eslint-disable-next-line no-undef
const socket = io('http://localhost:8180');
let gameRunning = false;
let mapConfigured = false;

const engegerButton = document.querySelector('#engegar');
const configurarButton = document.querySelector('#configurar');

socket.emit('join', 'admin');

const width = document.getElementById('width');
const height = document.getElementById('height');
const pisos = document.getElementById('pisos');
const svg = document.getElementById('gameMap');
const piramide1 = document.getElementById('piramide1');
const piramide2 = document.getElementById('piramide2');
const area2 = document.getElementById('area2');

// Definir el objeto map
const map = {
  stones: []
};

// Configurar mapa
configurarButton.addEventListener('click', (event) => {
  const settings = {
    width: parseInt(width.value),
    height: parseInt(height.value),
    pisos: parseInt(pisos.value)
  };

  socket.emit('inicializeMap', settings);
  mapConfigured = true;
  engegerButton.style.display = 'block';
  configurarButton.style.display = 'none';
});

// Iniciar/Parar juego
engegerButton.addEventListener('click', (event) => {
  if (!gameRunning) {
    if (!mapConfigured) {
      window.alert('Primero debes configurar el mapa.');
      return;
    }
    socket.emit('iniciar');
    engegerButton.textContent = 'Parar';
    engegerButton.classList.add('stopping');
    gameRunning = true;
    configurarButton.style.display = 'none';
  } else {
    socket.emit('stopGame');
    engegerButton.textContent = 'Engegar';
    engegerButton.classList.remove('stopping');
    gameRunning = false;
    configurarButton.style.display = 'block';
  }
});

socket.on('setPyramid', (pisos) => {
  actualizarPisos(pisos, piramide1);
  actualizarPisos(pisos, piramide2);
});

// Recibir y mostrar ladrillos
socket.on('bricks', (bricks) => {
  map.stones = bricks; // Actualizar map.stones con los ladrillos recibidos
  const stonesGroup = document.getElementById('stones');
  stonesGroup.innerHTML = ''; // Limpiar el grupo de piedras
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

// Limpiar rocas al detener el juego
socket.on('gameStop', () => {
  const stonesGroup = document.getElementById('stones');
  stonesGroup.innerHTML = ''; // Eliminar todas las rocas
  const playersGroup = document.getElementById('players');
  playersGroup.innerHTML = ''; // Eliminar todos los jugadores
  window.alert('El juego ha sido detenido');
  gameRunning = false;
  engegerButton.textContent = 'Engegar';
  engegerButton.classList.remove('stopping');
  configurarButton.style.display = 'block';
});

socket.on('mapUpdated', (map) => {
  svg.setAttribute('width', map.width);
  svg.setAttribute('height', map.height);
  svg.setAttribute('viewBox', `0 0 ${map.width} ${map.height}`);
  area2.setAttribute('x', map.width - 90);
  area2.setAttribute('y', map.height - 90);
  piramide2.setAttribute('x', map.width - 90);
  piramide2.setAttribute('y', map.height - 90);
});

// Añadir listener para soltar rocas
socket.on('soltar', (data) => {
  const { playerId, x, y } = data;
  const player = currentPlayers.find(player => player.id === playerId);
  if (player && player.hasStone) {
    player.hasStone = false;
    const brick = { id: `brick${Date.now()}`, x, y };
    map.stones.push(brick); // Añadir la nueva roca al mapa
    socket.emit('bricks', map.stones); // Emitir el evento con las rocas actualizadas
  }
});

const currentPlayers = [];
socket.on('drawPlayers', (players) => {
  currentPlayers.push(...players);
  drawPlayers(players);
});

socket.on('newStone', (data) => {
  const { currentStones, remainingLevels, team } = data;
  console.log(data);
  const piramide = team === 'purple' ? piramide1 : piramide2;
  console.log(`#ladrillo_F${remainingLevels}-${currentStones}`);

  piramide.querySelector(`#ladrillo_F${remainingLevels}-${currentStones}`).classList.remove('gray');
});

function drawPlayers (players) {
  const playersGroup = document.getElementById('players');

  const existingPlayers = new Map();
  playersGroup.childNodes.forEach((child) => {
    if (child.id) existingPlayers.set(child.id, child);
  });

  players.forEach((player) => {
    let playerElement = existingPlayers.get(player.id);
    const teamColor = player.team === 'blue' ? '../assets/img/fotoPlayer.png' : '../assets/img/fotoPlayer2.png';

    if (!playerElement) {
      playerElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      playerElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', teamColor);
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

function actualizarPisos (nPisos) {
  document.querySelectorAll("[id$='-F5'], [id$='-F6'], [id$='-F7'], [id$='-F8']").forEach(figura => {
    const pisoNumero = parseInt(figura.id.split('-F')[1], 10);

    figura.style.display = (pisoNumero <= nPisos) ? 'block' : 'none';
  });
}
