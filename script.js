// Obtener elementos del HTML para poder manipularlos desde JavaScript
const player = document.getElementById("player");
const platforms = document.querySelectorAll(".platform");
const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");

// Variables del juego
let score = 0;      // Puntaje actual
let coin = null;    // Moneda actual en pantalla

// Posición inicial del jugador
let x = 100;
let y = 100;

// Variables de física
let velocityY = 0;  // Velocidad vertical
let gravity = 0.5;  // Fuerza de gravedad
let jumping = true; // Indica si el jugador está en el aire

// Velocidad horizontal del jugador
const speed = 5;

// Tamaño del jugador
const playerWidth = 40;
const playerHeight = 40;

// Objeto donde guardamos las teclas presionadas
const keys = {};


// ======================================
// BANCO DE PREGUNTAS
// ======================================

// Lista de preguntas que pueden aparecer al recoger una moneda
const questions = [
  {
    question: "¿Cuánto es 5 + 3?",
    answer: "8"
  },
  {
    question: "¿Cuánto es 10 - 4?",
    answer: "6"
  },
  {
    question: "¿Cuánto es 3 x 4?",
    answer: "12"
  },
  {
    question: "¿Cuál es la capital de Costa Rica?",
    answer: "san jose"
  }
];


// ======================================
// CONTROLES DEL TECLADO
// ======================================

// Se ejecuta cuando una tecla es presionada
document.addEventListener("keydown", (e) => {

  // Guardar la tecla como activa
  keys[e.key.toLowerCase()] = true;

  // Si se presiona espacio y no está saltando
  // aplicar fuerza hacia arriba
  if (e.code === "Space" && !jumping) {
    velocityY = -13;
    jumping = true;
  }
});

// Se ejecuta cuando una tecla deja de presionarse
document.addEventListener("keyup", (e) => {

  // Marcar la tecla como inactiva
  keys[e.key.toLowerCase()] = false;

});

// ======================================
// LIMPIAR TECLAS PRESIONADAS
// ======================================

// Reinicia todas las teclas para evitar
// que el jugador siga moviéndose después
// de responder una pregunta
function clearKeys() {

  for (const key in keys) {
    keys[key] = false;
  }

}

// ======================================
// GENERAR MONEDA
// ======================================

// Crea una moneda amarilla en una posición aleatoria
function spawnCoin() {

  // Si ya existe una moneda, no crear otra
  if (coin) return;

  // Crear elemento HTML
  coin = document.createElement("div");

  // Agregar clase CSS
  coin.classList.add("coin");

  // Generar coordenadas aleatorias
  const randomX = Math.floor(Math.random() * 700) + 20;
  const randomY = Math.floor(Math.random() * 250) + 50;

  // Posicionar moneda
  coin.style.left = randomX + "px";
  coin.style.top = randomY + "px";

  // Agregar moneda al mapa
  game.appendChild(coin);
}


// ======================================
// DETECTAR COLISIÓN CON MONEDA
// ======================================

// Verifica si el jugador tocó la moneda
function checkCoinCollision() {

  // Si no existe moneda, salir
  if (!coin) return;

  const coinX = parseInt(coin.style.left);
  const coinY = parseInt(coin.style.top);

  // Detectar si los rectángulos se superponen
  const touching =
    x < coinX + 20 &&
    x + playerWidth > coinX &&
    y < coinY + 20 &&
    y + playerHeight > coinY;

  // Si hubo contacto
  if (touching) {

    // Detener cualquier movimiento activo
    // antes de mostrar la pregunta
    clearKeys();
    // Elegir una pregunta aleatoria
    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];

    // Mostrar pregunta
    const answer = prompt(randomQuestion.question);

    // Validar respuesta
    if (
      answer &&
      answer.toLowerCase().trim() === randomQuestion.answer
    ) {

      // Sumar punto
      score++;

      // Actualizar marcador
      scoreDisplay.textContent =
        "Puntos: " + score;

      alert("¡Correcto! 🎉");

    } else {

      alert(
        "Incorrecto 😢\nLa respuesta correcta era: " +
        randomQuestion.answer
      );
    }

// Limpiar nuevamente las teclas por si
// el jugador soltó alguna mientras la
// ventana de pregunta estaba abierta
clearKeys();

    // Eliminar moneda actual
    coin.remove();
    coin = null;

    // Crear nueva moneda
    setTimeout(spawnCoin, 5);
  }
}


// ======================================
// COLISIONES CON PLATAFORMAS
// ======================================

// Verifica si el jugador aterrizó sobre una plataforma
function checkPlatformCollisions(previousY) {

  let onPlatform = false;

  platforms.forEach((platform) => {

    // Obtener posición de la plataforma
    const pLeft = parseInt(platform.style.left);
    const pTop = parseInt(platform.style.top);
    const pWidth = parseInt(platform.style.width);

    // Calcular bordes del jugador
    const playerBottom = y + playerHeight;
    const previousBottom = previousY + playerHeight;
    const playerRight = x + playerWidth;

    // Detectar aterrizaje desde arriba
    const landedOnPlatform =
      previousBottom <= pTop &&
      playerBottom >= pTop &&
      playerRight > pLeft &&
      x < pLeft + pWidth &&
      velocityY >= 0;

    if (landedOnPlatform) {

      // Colocar jugador encima de la plataforma
      y = pTop - playerHeight;

      // Detener caída
      velocityY = 0;

      // Ya no está saltando
      jumping = false;

      onPlatform = true;
    }
  });

  return onPlatform;
}


// ======================================
// GAME LOOP
// ======================================

// Esta función se ejecuta unas 60 veces por segundo
function gameLoop() {

  // Guardar posición anterior
  const previousY = y;

  // Movimiento hacia la izquierda
  if (keys["a"]) {
    x -= speed;
  }

  // Movimiento hacia la derecha
  if (keys["d"]) {
    x += speed;
  }

  // Evitar salir por la izquierda
  if (x < 0) {
    x = 0;
  }

  // Evitar salir por la derecha
  if (x > 760) {
    x = 760;
  }

  // Aplicar gravedad
  velocityY += gravity;

  // Mover jugador verticalmente
  y += velocityY;

  // Revisar plataformas
  let onPlatform =
    checkPlatformCollisions(previousY);

  // Detectar colisión con el suelo
  if (y > 310) {

    y = 310;
    velocityY = 0;
    jumping = false;
    onPlatform = true;
  }

  // Si no está sobre nada, sigue cayendo
  if (!onPlatform) {
    jumping = true;
  }

  // Dibujar jugador en pantalla
  player.style.left = x + "px";
  player.style.top = y + "px";

  // Revisar si tocó una moneda
  checkCoinCollision();

  // Pedir al navegador que ejecute
  // nuevamente gameLoop en el siguiente frame
  requestAnimationFrame(gameLoop);
}


// ======================================
// INICIO DEL JUEGO
// ======================================

// Crear la primera moneda
spawnCoin();

// Iniciar el ciclo principal
gameLoop();