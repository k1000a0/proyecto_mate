// ==================================================
// ELEMENTOS DE LAS PANTALLAS
// ==================================================

const startScreen =
  document.getElementById(
    "startScreen"
  );

const gameScreen =
  document.getElementById(
    "gameScreen"
  );

const endScreen =
  document.getElementById(
    "endScreen"
  );


// ==================================================
// ELEMENTOS DEL INICIO
// ==================================================

const playerNameInput =
  document.getElementById(
    "playerName"
  );

const startBtn =
  document.getElementById(
    "startBtn"
  );

const nameError =
  document.getElementById(
    "nameError"
  );


// ==================================================
// ELEMENTOS DEL JUEGO
// ==================================================

const game =
  document.getElementById(
    "game"
  );

const player =
  document.getElementById(
    "player"
  );

const platforms =
  document.querySelectorAll(
    ".platform"
  );

const playerDisplay =
  document.getElementById(
    "playerDisplay"
  );

const scoreDisplay =
  document.getElementById(
    "score"
  );

const timerDisplay =
  document.getElementById(
    "timer"
  );


// ==================================================
// ELEMENTOS DE LA PANTALLA FINAL
// ==================================================

const finalPlayerName =
  document.getElementById(
    "finalPlayerName"
  );

const finalScore =
  document.getElementById(
    "finalScore"
  );

const restartBtn =
  document.getElementById(
    "restartBtn"
  );


// ==================================================
// ELEMENTOS DE PREGUNTAS
// ==================================================

const questionBox =
  document.getElementById(
    "questionBox"
  );

const questionText =
  document.getElementById(
    "questionText"
  );

const answerInput =
  document.getElementById(
    "answerInput"
  );

const answerBtn =
  document.getElementById(
    "answerBtn"
  );


// ==================================================
// BOTONES
// ==================================================

const leftBtn =
  document.getElementById(
    "leftBtn"
  );

const rightBtn =
  document.getElementById(
    "rightBtn"
  );

const jumpBtn =
  document.getElementById(
    "jumpBtn"
  );


// ==================================================
// CONFIGURACIÓN DEL MUNDO
// ==================================================

const WORLD_WIDTH = 800;

const WORLD_HEIGHT = 400;

const PLAYER_WIDTH = 40;

const PLAYER_HEIGHT = 40;


// ==================================================
// VARIABLES DEL JUGADOR
// ==================================================

let x = 100;

let y = 100;

let velocityY = 0;

const gravity = 0.5;

const speed = 5;

let jumping = true;


// ==================================================
// CONTROLES
// ==================================================

const keys = {

  left: false,

  right: false

};


// ==================================================
// MONEDA
// ==================================================

let coin = null;


// ==================================================
// PUNTUACIÓN
// ==================================================

let score = 0;


// ==================================================
// NOMBRE
// ==================================================

let currentPlayerName = "";


// ==================================================
// CRONÓMETRO
// ==================================================

let timeLeft = 10 * 60;

let timerInterval = null;


// ==================================================
// PREGUNTAS
// ==================================================

const questions = [

  {
    question:
      "¿Cuánto es 5 + 3?",

    answer:
      "8"

  },


  {
    question:
      "¿Cuánto es 10 - 4?",

    answer:
      "6"

  },


  {
    question:
      "¿Cuánto es 3 x 4?",

    answer:
      "12"

  },


  {
    question:
      "¿Cuál es la capital de Costa Rica?",

    answer:
      "san jose"

  }

];


// ==================================================
// COMENZAR JUEGO
// ==================================================

startBtn.addEventListener(
  "click",
  startGame
);


playerNameInput.addEventListener(
  "keydown",
  (e) => {

    if (
      e.key === "Enter"
    ) {

      startGame();

    }

  }
);


function startGame() {


  // Obtener nombre

  const name =

    playerNameInput.value
      .trim();


  // Validar nombre

  if (
    name === ""
  ) {

    nameError.style.display =
      "block";

    playerNameInput.focus();

    return;

  }


  // Guardar nombre

  currentPlayerName =
    name;


  // Mostrar nombre

  playerDisplay.textContent =

    "👤 " +
    currentPlayerName;


  // Ocultar inicio

  startScreen.style.display =
    "none";


  // Mostrar juego

  gameScreen.style.display =
    "block";


  // Reiniciar variables

  score = 0;

  scoreDisplay.textContent =
    "⭐ Puntos: 0";


  x = 100;

  y = 100;

  velocityY = 0;

  jumping = true;


  // Reiniciar tiempo

  timeLeft =
    10 * 60;


  updateTimerDisplay();


  // Iniciar cronómetro

  startTimer();


  // Crear moneda

  if (!coin) {

    spawnCoin();

  }

}


// ==================================================
// CRONÓMETRO
// ==================================================

function startTimer() {


  // Detener cronómetro anterior

  clearInterval(
    timerInterval
  );


  timerInterval =

    setInterval(
      () => {


        timeLeft--;


        updateTimerDisplay();


        // Tiempo terminado

        if (
          timeLeft <= 0
        ) {

          clearInterval(
            timerInterval
          );


          endGame();

        }


      },
      1000
    );

}


function updateTimerDisplay() {


  const minutes =

    Math.floor(
      timeLeft / 60
    );


  const seconds =

    timeLeft % 60;


  timerDisplay.textContent =

    "⏱️ " +

    String(minutes)
      .padStart(
        2,
        "0"
      ) +

    ":" +

    String(seconds)
      .padStart(
        2,
        "0"
      );

}


// ==================================================
// FINALIZAR JUEGO
// ==================================================

function endGame() {


  // Detener cronómetro

  clearInterval(
    timerInterval
  );


  // Cerrar pregunta

  questionBox.style.display =
    "none";


  // Mostrar datos finales

  finalPlayerName.textContent =

    currentPlayerName;


  finalScore.textContent =

    score;


  // Ocultar juego

  gameScreen.style.display =
    "none";


  // Mostrar pantalla final

  endScreen.style.display =
    "flex";


  // Detener movimiento

  keys.left = false;

  keys.right = false;

}


// ==================================================
// REINICIAR
// ==================================================

restartBtn.addEventListener(
  "click",
  () => {


    // Ocultar pantalla final

    endScreen.style.display =
      "none";


    // Mostrar inicio

    startScreen.style.display =
      "flex";


    // Limpiar nombre

    playerNameInput.value = "";


    // Limpiar moneda

    if (coin) {

      coin.remove();

      coin = null;

    }

  }
);


// ==================================================
// ESCALA RESPONSIVE
// ==================================================

function getScale() {


  return (

    game.clientWidth /
    WORLD_WIDTH

  );

}


// ==================================================
// DIBUJAR JUGADOR
// ==================================================

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


// ==================================================
// CONTROLES TÁCTILES
// ==================================================


// IZQUIERDA

leftBtn.addEventListener(
  "pointerdown",
  (e) => {

    e.preventDefault();

    keys.left = true;

  }
);


leftBtn.addEventListener(
  "pointerup",
  () => {

    keys.left = false;

  }
);


leftBtn.addEventListener(
  "pointerleave",
  () => {

    keys.left = false;

  }
);


leftBtn.addEventListener(
  "pointercancel",
  () => {

    keys.left = false;

  }
);


// DERECHA

rightBtn.addEventListener(
  "pointerdown",
  (e) => {

    e.preventDefault();

    keys.right = true;

  }
);


rightBtn.addEventListener(
  "pointerup",
  () => {

    keys.right = false;

  }
);


rightBtn.addEventListener(
  "pointerleave",
  () => {

    keys.right = false;

  }
);


rightBtn.addEventListener(
  "pointercancel",
  () => {

    keys.right = false;

  }
);


// SALTAR

jumpBtn.addEventListener(
  "pointerdown",
  (e) => {

    e.preventDefault();

    jump();

  }
);


function jump() {


  if (
    !jumping
  ) {

    velocityY = -13;

    jumping = true;

  }

}


// ==================================================
// GENERAR MONEDA
// ==================================================

function spawnCoin() {


  if (coin) return;


  coin =
    document.createElement(
      "div"
    );


  coin.classList.add(
    "coin"
  );


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


  coin.dataset.x =
    randomX;


  coin.dataset.y =
    randomY;


  game.appendChild(
    coin
  );


  updateCoin();

}


// ==================================================
// ACTUALIZAR MONEDA
// ==================================================

function updateCoin() {


  if (
    !coin
  ) return;


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


  coin.style.width =

    (
      25 *
      scale
    ) + "px";


  coin.style.height =

    (
      25 *
      scale
    ) + "px";

}


// ==================================================
// COLISIÓN CON MONEDA
// ==================================================

function checkCoinCollision() {


  if (
    !coin
  ) return;


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


  if (
    touching
  ) {


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
      "flex";


    answerInput.focus();


    coin.remove();

    coin = null;

  }

}


// ==================================================
// RESPONDER PREGUNTA
// ==================================================

answerBtn.addEventListener(
  "click",
  answerQuestion
);


answerInput.addEventListener(
  "keydown",
  (e) => {

    if (
      e.key === "Enter"
    ) {

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

      "⭐ Puntos: " +
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


// ==================================================
// COLISIONES CON PLATAFORMAS
// ==================================================

function getPlatformData(
  platform
) {


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

      (
        left /
        100
      ) *
      WORLD_WIDTH,


    top:

      (
        top /
        100
      ) *
      WORLD_HEIGHT,


    width:

      (
        width /
        100
      ) *
      WORLD_WIDTH

  };

}


// ==================================================
// DETECTAR PLATAFORMAS
// ==================================================

function checkPlatformCollisions(
  previousY
) {


  let onPlatform =
    false;


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


      if (
        landed
      ) {


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


// ==================================================
// GAME LOOP
// ==================================================

function gameLoop() {


  const previousY =
    y;


  // MOVIMIENTO

  if (
    keys.left
  ) {

    x -= speed;

  }


  if (
    keys.right
  ) {

    x += speed;

  }


  // LÍMITES

  if (
    x < 0
  ) {

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


  // GRAVEDAD

  velocityY +=
    gravity;


  y +=
    velocityY;


  // PLATAFORMAS

  let onPlatform =

    checkPlatformCollisions(
      previousY
    );


  // SUELO

  const groundY =

    WORLD_HEIGHT -
    PLAYER_HEIGHT;


  if (
    y >= groundY
  ) {


    y =
      groundY;


    velocityY =
      0;


    jumping =
      false;


    onPlatform =
      true;

  }


  // ESTADO DE SALTO

  if (
    !onPlatform
  ) {

    jumping =
      true;

  }


  // DIBUJAR

  drawPlayer();

  updateCoin();

  checkCoinCollision();


  requestAnimationFrame(
    gameLoop
  );

}


// ==================================================
// REDIMENSIONAR
// ==================================================

window.addEventListener(
  "resize",
  () => {

    drawPlayer();

    updateCoin();

  }
);


// ==================================================
// INICIAR GAME LOOP
// ==================================================

gameLoop();