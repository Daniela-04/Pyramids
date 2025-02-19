document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;

  if (email.endsWith('@sapalomera.cat') && email.length > 0) {
    const formData = new FormData();
    try {
      const response = fetch('/login',
        {
          method: 'POST',
          body: formData
        });
      if (response.status === 200) {
        window.location.href = '/choose';
      } else {
        const error = await response.error.text();
        const errorElement = document.querySelector('#error-card .card__content');

        const errorDiv = document.createElement('p');
        errorDiv.classList.add('error');
        errorDiv.textContent = error;
        errorElement.appendChild(errorDiv);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    const errorDiv = document.createElement('p');
    errorDiv.classList.add('error');
    errorDiv.textContent = 'Dominio no permitido';
    document.getElementById('error').appendChild(errorDiv);
  }
});

document.getElementById('email').addEventListener('click', () => {});

document.getElementById('error').addEventListener('click', function () {});
