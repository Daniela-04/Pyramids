// eslint-disable-next-line no-undef
const socket = io('http://localhost:8180');
let gameRunning = false;
const engegerButton = document.querySelector('#engegar');

socket.emit('join', 'admin');

const width = document.getElementById('width');
const height = document.getElementById('height');
const pisos = document.getElementById('pisos');

// Configurar mapa
document.querySelector('#configurar').addEventListener('click', (event) => {
  const settings = {
    width: parseInt(width.value),
    height: parseInt(height.value),
    pisos: parseInt(pisos.value)
  };
  socket.emit('inicializeMap', settings);
});

// Iniciar/Parar juego
engegerButton.addEventListener('click', (event) => {
  if (!gameRunning) {
    socket.emit('iniciar');
    engegerButton.textContent = 'Parar';
    engegerButton.classList.add('stopping');
    gameRunning = true;
  } else {
    socket.emit('stopGame');
    engegerButton.textContent = 'Engegar';
    engegerButton.classList.remove('stopping');
    gameRunning = false;
  }
});

// Recibir y mostrar ladrillos
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
