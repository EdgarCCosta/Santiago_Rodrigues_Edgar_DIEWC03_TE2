'use strict';

let arraySocios = [];

// Cargar socios al inicio
$(document).ready(function () {
    cargarSociosJSON().then(data => {
        arraySocios = data;
    });
});

function cargarSociosJSON() {
    let path = 'usuarios.json';

    let request = new Request(path, {
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        method: 'GET'
    });

    return fetch(request)
        .then(response => response.json())
        .catch(error => console.error('Error al cargar datos de socios:', error));
}

function validateForm() {
    const username = $('#username').val();
    const password = $('#password').val();

    // Buscar el usuario en el array de socios
    const usuarioEncontrado = arraySocios.find(socio => socio.usuario === username);

    if (usuarioEncontrado) {
        // Verificar si la contraseña coincide
        if (usuarioEncontrado.contraseña === password) {
            // Construir expresión regular que incluye caracteres especiales
            const specialChars = '¡"#$%&\'()*+.-/:;<=>¿@[\\]^_`{';
            const passwordRegex = new RegExp('[' + specialChars + ']');

            // Verificar si la contraseña contiene caracteres especiales
            const specialChar = password.match(passwordRegex);

            if (specialChar) {
                // Mostrar mensaje indicando que la contraseña contiene un carácter especial
                showError(`La contraseña contiene un carácter especial: ${specialChar[0]}`);
            } else {
                // Redirigir a la página juego.html si la contraseña es válida
                window.location.href = "juego.html";
            }
        } else {
            showError("La contraseña no coincide.");
        }
    } else {
        showError("El usuario no está registrado");
    }
}

function showError(message) {
    const errorMessage = $('#errorMessage');
    errorMessage.text(message);
    errorMessage.show();
}
