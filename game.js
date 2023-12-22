document.addEventListener("DOMContentLoaded", function () {

  const jugador = document.getElementById("jugador");
  const areaJuego = document.getElementById("area-dejego");
  const contenedorBalas = document.getElementById("contenedor-debalas");

  // Arrays para almacenar balas y enemigos
  const balas = [];
  const enemigos = [];

  // Velocidad constante de las balas
  const velocidadBala = 5;
  let posicaoJugador = 185;

  // Variables para contadores
  let tempoInicial = new Date().getTime();
  let contadorenemigosDestruidos = 0;

  // Crear jugador
  jugador.style.left = posicaoJugador + "px";
 

  // Crear y posicionar enemigos
  const numeroEnemigos = 21;
  const enemigosPorLinea = 7;

  for (let i = 0; i < numeroEnemigos; i++) {
    const enemigo = document.createElement("div");
    enemigo.className = "enemigo";
    areaJuego.appendChild(enemigo);
    enemigos.push(enemigo);

    // Calculate position based on rows and columns
    const linea = Math.floor(i / enemigosPorLinea);
    const columna = i % enemigosPorLinea;
    const enemigoPositionX = columna * 30; // Adjust spacing as needed
    const enemigoPositionY = linea * 30; // Adjust spacing as needed

    enemigo.style.left = enemigoPositionX + "px";
    enemigo.style.top = enemigoPositionY + "px";
  }

  // Eventos de teclado para mover el jugador y disparar
  document.addEventListener("keydown", function (event) {
    handleKeyPress(event);
  });

  // Mover balas a intervalos regulares
  const moverIntervaloBala = setInterval(moverBalas, 16); // 16ms is approximately 60 frames per second

  // Mover enemigos a intervalos regulares
  const moverIntervaloEnemigos = setInterval(moverEnemigos, 50);

  // Actualizar contadores a intervalos regulares
  const updateIntervaloInfo = setInterval(updateInfo, 1000); // Update every second

  // Función para manejar eventos de teclado
  function handleKeyPress(event) {
    if (event.key === "ArrowUp") {
      disparar();
    } else if (event.key === "ArrowLeft" && posicaoJugador > 0) {
      posicaoJugador = Math.max(posicaoJugador - 25, 0);
    } else if (event.key === "ArrowRight" && posicaoJugador < areaJuego.clientWidth - jugador.clientWidth) {
      posicaoJugador = Math.min(posicaoJugador + 25, areaJuego.clientWidth - jugador.clientWidth);
    }
    jugador.style.left = posicaoJugador + "px";
  }

  // Mover balas a intervalos regulares
  function moverBalas() {
    for (let bala of balas) {
      let balaPositionY = parseInt(getComputedStyle(bala).top);
      balaPositionY -= velocidadBala;
      bala.style.top = balaPositionY + "px";

      // Check colisión con enemigos
      if (checkColisaoBalaEnemigo(bala)) {
        // Destruir la bala si colisiona con un enemigo
        destruirBala(bala);
      }

      // Eliminar la bala si sale de la zona de juego
      if (balaPositionY < 0) {
        destruirBala(bala);
      }
    }
  }

  // Función para verificar colisión entre bala y enemigo
  function checkColisaoBalaEnemigo(bala) {
    for (let enemigo of enemigos) {
      const balaRect = bala.getBoundingClientRect();
      const enemigoRect = enemigo.getBoundingClientRect();

      if (
        balaRect.top < enemigoRect.bottom && balaRect.bottom > enemigoRect.top &&
        balaRect.left < enemigoRect.right && balaRect.right > enemigoRect.left
      ) {
        enemigo.style.backgroundColor = "orange";
        setTimeout(() => {
          resetenemigoColor(enemigo);
          destroiEnemigo(enemigo);
          contadorenemigosDestruidos++;
          updateInfo();
        }, 150); // Tiempo en que el enemigo queda naranja
        return true; // Devolver true para indicar colisión
      }
    }

    return false; // Devolver false en caso de no colisión
  }

  // Mover enemigos a intervalos regulares
  let moveRight = true;
  let bordeAlcanzado = false;

  function moverEnemigos() {
    if (verificarColisaoJugador()) {
      return;
    }

    // Mover enemigos
    for (let enemigo of enemigos) {
      let enemigoPositionX = parseInt(getComputedStyle(enemigo).left);

      if (moveRight) {
        enemigoPositionX = Math.min(enemigoPositionX + 5, areaJuego.clientWidth - enemigo.clientWidth);
      } else {
        enemigoPositionX = Math.max(enemigoPositionX - 5, 0);
      }

      enemigo.style.left = enemigoPositionX + "px";

      // Verificar si los enemigos alcanzan el borde
      if (
        (moveRight && enemigoPositionX >= areaJuego.clientWidth - enemigo.clientWidth - 5) ||
        (!moveRight && enemigoPositionX <= 5)
      ) {
        bordeAlcanzado = true;
      }
    }

    // Mover enemigos hacia abajo en caso de que alcancen el borde
    if (bordeAlcanzado) {
      moveRight = !moveRight;
      moverEnemigosDown();
      bordeAlcanzado = false;
    }
  }

  // Función para mover enemigos hacia abajo
  function moverEnemigosDown() {
    for (let enemigo of enemigos) {
      let enemigoPositionY = parseInt(getComputedStyle(enemigo).top);
      enemigoPositionY += 30;
      enemigo.style.top = enemigoPositionY + "px";
    }
  }

  // Función para actualizar los contadores y mostrarlos en HTML
  function updateInfo() {
    const tiempoActual = new Date().getTime();
    const tiempoPasado = Math.floor((tiempoActual - tempoInicial) / 1000); // Tiempo en segundos

    document.getElementById("tiempo").innerText = tiempoPasado;
    document.getElementById("enemigos-destruidos").innerText = contadorenemigosDestruidos;

    // Verificar si todos los enemigos están destruidos
    if (contadorenemigosDestruidos === numeroEnemigos) {
      youWin();
    }
  }

  // Función para restablecer el color original de un enemigo
  function resetenemigoColor(enemigo) {
    // Restaurar el color original del enemigo después de 500ms
    setTimeout(() => {
      enemigo.style.backgroundColor = "purple"; // Puedes ajustar el color original según sea necesario
    }, 500);
  }

  // Función para destruir una bala
  function destruirBala(bala) {
    contenedorBalas.removeChild(bala);
    balas.splice(balas.indexOf(bala), 1);
  }

  // Función para destruir un enemigo
  function destroiEnemigo(enemigo) {
    areaJuego.removeChild(enemigo);
    enemigos.splice(enemigos.indexOf(enemigo), 1);
  }

  // Función para verificar la colisión entre enemigo y jugador
  function verificarColisaoJugador() {
    const jugadorRect = jugador.getBoundingClientRect();

    for (let enemigo of enemigos) {
      const enemigoRect = enemigo.getBoundingClientRect();

      if (
        jugadorRect.top < enemigoRect.bottom &&
        jugadorRect.bottom > enemigoRect.top &&
        jugadorRect.left < enemigoRect.right &&
        jugadorRect.right > enemigoRect.left
      ) {
        gameOver();
        return true;
      }
    }

    return false;
  }

  // Función para mostrar "Game Over"
  function gameOver() {
    const gameOverElemento = document.getElementById("you-lose");
    gameOverElemento.innerText = "GAME OVER!";
    gameOverElemento.classList.add("game-over");
    // Detener los intervalos de movimiento de enemigos, balas y actualización de contadores
    clearInterval(moverIntervaloEnemigos);
    clearInterval(moverIntervaloBala);
    clearInterval(updateIntervaloInfo);
  }

  // Función para mostrar "You Win"
  function youWin() {
    const youWinElemento = document.getElementById("you-win");
    youWinElemento.innerText = "YOU WIN!";
    youWinElemento.classList.add("win");
    // Detener los intervalos de movimiento de enemigos, balas y actualización de contadores
    clearInterval(moverIntervaloEnemigos);
    clearInterval(moverIntervaloBala);
    clearInterval(updateIntervaloInfo);
  }

  // Función para disparar
  function disparar() {
    const bala = document.createElement("div");
    bala.className = "bala";
    contenedorBalas.appendChild(bala);

    // Posicionar la bala en relación a la posición del jugador
    const balaPositionX = posicaoJugador + jugador.clientWidth / 2;
    const balaPositionY = areaJuego.clientHeight - 25;

    bala.style.left = balaPositionX + "px";
    bala.style.top = balaPositionY + "px";

    balas.push(bala);
  }

  function resetGame() {
    // Restablecer valores iniciales y eliminar elementos adicionales
    tempoInicial = new Date().getTime();
    contadorenemigosDestruidos = 0;
    posicaoJugador = 185;

    for (let bala of balas) {
        contenedorBalas.removeChild(bala);
    }
    balas.length = 0;

    for (let enemigo of enemigos) {
        areaJuego.removeChild(enemigo);
    }
    enemigos.length = 0;

    // Volver a crear enemigos
    for (let i = 0; i < numeroEnemigos; i++) {
        const enemigo = document.createElement("div");
        enemigo.className = "enemigo";
        areaJuego.appendChild(enemigo);
        enemigos.push(enemigo);

        // Calcular posición basada en filas y columnas
        const linea = Math.floor(i / enemigosPorLinea);
        const columna = i % enemigosPorLinea;
        const enemigoPositionX = columna * 30; // Ajustar espaciado según sea necesario
        const enemigoPositionY = linea * 30; // Ajustar espaciado según sea necesario

        enemigo.style.left = enemigoPositionX + "px";
        enemigo.style.top = enemigoPositionY + "px";
    }

    // Restablecer estilos y clases
    document.getElementById("you-win").classList.remove("win");
    document.getElementById("you-win").innerText = "";
    document.getElementById("you-lose").classList.remove("game-over");
    document.getElementById("you-lose").innerText = "";

    // Reiniciar intervalos de movimiento y actualización
    moverIntervaloEnemigos = setInterval(moverEnemigos, 50);
    moverIntervaloBala = setInterval(moverBalas, 16);
    updateIntervaloInfo = setInterval(updateInfo, 1000);
}


});
