document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verificar las credenciales (usuario y contraseña)
    if (username === 'alosamu' && password === '28092021') {
        // Redirigir al álbum
        window.location.href = 'album/album.html';
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});
