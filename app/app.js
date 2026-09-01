window.addEventListener('DOMContentLoaded', function () {
  const savedUsername = localStorage.getItem('demo_remembered_username');
  if (savedUsername) {
    document.getElementById('username').value = savedUsername;
    document.getElementById('remember-me').checked = true;
  }
});

document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const rememberMe = document.getElementById('remember-me').checked;
  const errorEl = document.getElementById('login-error');

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  if (username === 'locked_user') {
    showError('Account locked');
    return;
  }

  if (username === 'demo_user' && password === 'demo_pass123') {
    if (rememberMe) {
      localStorage.setItem('demo_remembered_username', username);
    } else {
      localStorage.removeItem('demo_remembered_username');
    }
    window.location.href = 'dashboard.html';
    return;
  }

  showError('Invalid credentials');
});
