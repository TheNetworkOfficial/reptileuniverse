document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // Include cookies in the request
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.message === 'Logged in successfully') {
            window.location.href = 'index.html';
        }
    })
    .catch(error => console.error('Error:', error));
});