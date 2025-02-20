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
  console.log(event.key);
});
