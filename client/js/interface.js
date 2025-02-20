
const button = document.getElementById('cerrarSesionButton');

if (button) {
  button.addEventListener('click', function () {
    window.location.href = '/choose';
  });
}
