document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const errorContainer = document.getElementById('error');
  const errorContent = document.querySelector('#error .card__content');

  if (email.endsWith('@sapalomera.cat') && email.length > 0) {
    try {
      const response = await fetch('/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

      if (response.status === 200) {
        window.location.href = '/choose';
      } else {
        const errorData = await response.json();
        errorContent.textContent = errorData.error;
        errorContainer.removeAttribute('hidden');
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = "Inicia amb l'email del sapa";
    errorContent.textContent = error;
    errorContainer.removeAttribute('hidden');
  }
});
