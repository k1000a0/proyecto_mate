// ======================================
// ELEMENTOS
// ======================================

const player =
  document.getElementById("player");

const platforms =
  document.querySelectorAll(".platform");

const game =
  document.getElementById("game");

const scoreDisplay =
  document.getElementById("score");


// ======================================
// BOTONES
// ======================================

const leftBtn =
  document.getElementById("leftBtn");

const rightBtn =
  document.getElementById("rightBtn");

const jumpBtn =
  document.getElementById("jumpBtn");


// ======================================
// PREGUNTAS
// ======================================

const questionBox =
  document.getElementById("questionBox");

const questionText =
  document.getElementById("questionText");

const answerInput =
  document.getElementById("answerInput");

const answerBtn =
  document.getElementById("answerBtn");


// ======================================
// CONFIGURACIÓN DEL MUNDO
// ======================================

// Estas son las dimensiones originales
// de tu juego.

const WORLD_WIDTH = 800;

const WORLD_HEIGHT = 400;


// ======================================
// JUGADOR
// ======================================

const PLAYER_WIDTH = 40;

const PLAYER_HEIGHT = 40;


// ======================================
// POSICIÓN
// ======================================

let x = 100;

let y = 100;


// ======================================
// FÍSICA
// ======================================

let velocityY = 0;

const gravity = 0.5;

let jumping = true;


// ======================================
// VELOCIDAD
// ======================================

const speed = 5;


// ======================================
// MONEDA
// ======================================

let coin = null;


// ======================================
// PUNTAJE
// ======================================

let score = 0;


// ======================================
// CONTROLES
// ======================================

const keys = {

  left: false,

  right: false

};


// ======================================
// PREGUNTAS
// ======================================

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
    question:
      "¿Cuál es la capital de Costa Rica?",
    answer: "san jose"
  }

];


// ======================================
// ESCALA RESPONSIVE
// ======================================

function getScale() {

  return (
    game.clientWidth /
    WORLD_WIDTH
  );

}


// ======================================
// OBTENER POSICIÓN DE PLATAFORMA
// ======================================

function getPlatformData(platform) {

  const left =
    parseFloat(
      platform.style.left
    );

  const top =
    parseFloat(
      platform.style.top
    );

  const width =
    parseFloat(
      platform.style.width
    );


  return {

    left:
      (left / 100) *
      WORLD_WIDTH,

    top:
      (top / 100) *
      WORLD_HEIGHT,

    width:
      (width / 100) *
      WORLD_WIDTH

  };

}


// ======================================
// BOTÓN IZQUIERDA
// ======================================

function startLeft(e) {

  e.preventDefault();

  keys.left = true;

}


function stopLeft(e) {

  e.preventDefault();

  keys.left = false;

}


leftBtn.addEventListener(
  "pointerdown",
  startLeft
);


leftBtn.addEventListener(
  "pointerup",
  stopLeft
);


leftBtn.addEventListener(
  "pointercancel",
  stopLeft
);


leftBtn.addEventListener(
  "pointerleave",
  stopLeft
);


// ======================================
// BOTÓN DERECHA
// ======================================

function startRight(e) {

  e.preventDefault();

  keys.right = true;

}


function stopRight(e) {

  e.preventDefault();

  keys.right = false;

}


rightBtn.addEventListener(
  "pointerdown",
  startRight
);


rightBtn.addEventListener(
  "pointerup",
  stopRight
);


rightBtn.addEventListener(
  "pointercancel",
  stopRight
);


rightBtn.addEventListener(
  "pointerleave",
  stopRight
);


// ======================================
// BOTÓN SALTAR
// ======================================

function jump() {

  if (!jumping) {

    velocityY = -13;

    jumping = true;

  }

}


jumpBtn.addEventListener(
  "pointerdown",
  (e) => {

    e.preventDefault();

    jump();

  }
);


// ======================================
// GENERAR MONEDA
// ======================================

function spawnCoin() {

  if (coin) return;


  coin =
    document.createElement("div");


  coin.classList.add("coin");


  const randomX =

    Math.floor(
      Math.random() *
      700
    ) + 20;


  const randomY =

    Math.floor(
      Math.random() *
      250
    ) + 50;


  /*
    Guardamos las posiciones
    en coordenadas del mundo.
  */

  coin.dataset.x =
    randomX;

  coin.dataset.y =
    randomY;


  game.appendChild(coin);

}


// ======================================
// ACTUALIZAR MONEDA
// ======================================

function updateCoin() {

  if (!coin) return;


  const scale =
    getScale();


  const coinX =
    parseFloat(
      coin.dataset.x
    );


  const coinY =
    parseFloat(
      coin.dataset.y
    );


  coin.style.left =

    (
      coinX *
      scale
    ) + "px";


  coin.style.top =

    (
      coinY *
      scale
    ) + "px";

}


// ======================================
// COLISIÓN CON MONEDA
// ======================================

function checkCoinCollision() {

  if (!coin) return;


  const coinX =
    parseFloat(
      coin.dataset.x
    );


  const coinY =
    parseFloat(
      coin.dataset.y
    );


  const touching =

    x <
      coinX + 25 &&

    x + PLAYER_WIDTH >
      coinX &&

    y <
      coinY + 25 &&

    y + PLAYER_HEIGHT >
      coinY;


  if (touching) {

    keys.left = false;

    keys.right = false;


    const randomQuestion =

      questions[
        Math.floor(
          Math.random() *
          questions.length
        )
      ];


    questionText.textContent =
      randomQuestion.question;


    questionBox.dataset.answer =
      randomQuestion.answer;


    answerInput.value = "";


    questionBox.style.display =
      "block";


    answerInput.focus();


    coin.remove();

    coin = null;

  }

}


// ======================================
// RESPONDER
// ======================================

answerBtn.addEventListener(
  "click",
  answerQuestion
);


answerInput.addEventListener(
  "keydown",
  (e) => {

    if (e.key === "Enter") {

      answerQuestion();

    }

  }
);


function answerQuestion() {

  const answer =

    answerInput.value
      .toLowerCase()
      .trim();


  const correctAnswer =

    questionBox.dataset.answer;


  if (
    answer ===
    correctAnswer
  ) {

    score++;


    scoreDisplay.textContent =

      "Puntos: " +
      score;


    alert(
      "¡Correcto! 🎉"
    );

  } else {

    alert(

      "Incorrecto 😢\n" +

      "La respuesta correcta era: " +

      correctAnswer

    );

  }


  questionBox.style.display =
    "none";


  setTimeout(
    spawnCoin,
    300
  );

}


// ======================================
// COLISIONES
// ======================================

function checkPlatformCollisions(
  previousY
) {

  let onPlatform = false;


  platforms.forEach(
    (platform) => {


      const data =
        getPlatformData(
          platform
        );


      const pLeft =
        data.left;


      const pTop =
        data.top;


      const pWidth =
        data.width;


      const playerBottom =

        y +
        PLAYER_HEIGHT;


      const previousBottom =

        previousY +
        PLAYER_HEIGHT;


      const playerRight =

        x +
        PLAYER_WIDTH;


      const landed =

        previousBottom <=
          pTop &&

        playerBottom >=
          pTop &&

        playerRight >
          pLeft &&

        x <
          pLeft +
          pWidth &&

        velocityY >= 0;


      if (landed) {

        y =

          pTop -
          PLAYER_HEIGHT;


        velocityY = 0;

        jumping = false;

        onPlatform = true;

      }

    }
  );


  return onPlatform;

}


// ======================================
// DIBUJAR JUGADOR
// ======================================

function drawPlayer() {

  const scale =
    getScale();


  player.style.left =

    (
      x *
      scale
    ) + "px";


  player.style.top =

    (
      y *
      scale
    ) + "px";


  player.style.width =

    (
      PLAYER_WIDTH *
      scale
    ) + "px";


  player.style.height =

    (
      PLAYER_HEIGHT *
      scale
    ) + "px";

}


// ======================================
// GAME LOOP
// ======================================

function gameLoop() {


  const previousY = y;


  // ------------------------------
  // MOVIMIENTO
  // ------------------------------

  if (keys.left) {

    x -= speed;

  }


  if (keys.right) {

    x += speed;

  }


  // ------------------------------
  // LÍMITES DEL MUNDO
  // ------------------------------

  if (x < 0) {

    x = 0;

  }


  if (
    x >
    WORLD_WIDTH -
    PLAYER_WIDTH
  ) {

    x =

      WORLD_WIDTH -
      PLAYER_WIDTH;

  }


  // ------------------------------
  // GRAVEDAD
  // ------------------------------

  velocityY += gravity;

  y += velocityY;


  // ------------------------------
  // PLATAFORMAS
  // ------------------------------

  let onPlatform =

    checkPlatformCollisions(
      previousY
    );


  // ------------------------------
  // SUELO
  // ------------------------------

  const groundY =

    WORLD_HEIGHT -
    PLAYER_HEIGHT;


  if (y >= groundY) {

    y = groundY;

    velocityY = 0;

    jumping = false;

    onPlatform = true;

  }


  // ------------------------------
  // ESTADO DE SALTO
  // ------------------------------

  if (!onPlatform) {

    jumping = true;

  }


  // ------------------------------
  // DIBUJAR
  // ------------------------------

  drawPlayer();

  updateCoin();


  // ------------------------------
  // MONEDA
  // ------------------------------

  checkCoinCollision();


  // ------------------------------
  // SIGUIENTE FRAME
  // ------------------------------

  requestAnimationFrame(
    gameLoop
  );

}


// ======================================
// INICIAR
// ======================================

spawnCoin();

gameLoop();


// ======================================
// RESPONSIVE
// ======================================

// Si cambia el tamaño de la pantalla,
// el juego se adapta automáticamente.

window.addEventListener(
  "resize",
  () => {

    drawPlayer();

    updateCoin();

  }
);