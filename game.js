// 🎮 MAZE RUNNER – versión con sprites y sonidos
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const mapCols = 29;
const mapRows = 20;
const cellSize = 32;

canvas.width = mapCols * cellSize;
canvas.height = mapRows * cellSize;

// 🔢 Variables del juego
let playerX = 1;
let playerY = 1;
let selectedColor = null;
let personajeSeleccionado = 1;
let playerDirection = "down";
let level = 0;
let score = 0;
let timeLeft = 60;
let timerInterval;
let gameStarted = false;

// 🎨 Colores de los personajes
const playerColors = {
  1: "#ff5555",
  2: "#55ff55",
  3: "#5599ff"
};

// 🖼️ Sprites por dirección
const playerSprites = {
  1: { up: new Image(), down: new Image(), left: new Image(), right: new Image() },
  2: { up: new Image(), down: new Image(), left: new Image(), right: new Image() },
  3: { up: new Image(), down: new Image(), left: new Image(), right: new Image() }
};

for (let i = 1; i <= 3; i++) {
  playerSprites[i].up.src = `player${i}_up.png`;
  playerSprites[i].down.src = `player${i}_down.png`;
  playerSprites[i].left.src = `player${i}_left.png`;
  playerSprites[i].right.src = `player${i}_right.png`;
}

// 🔊 Sonidos
const musicBackground = new Audio("musica_fondo.mp3");
musicBackground.loop = true;
musicBackground.volume = 0.3;

const soundPoint = new Audio("punto.mp3");
const soundLevelComplete = new Audio("nivel_completado.mp3");

// 🗺 Niveles
// 🗺 Niveles
const levels = [
  // Nivel 1
  {
    map: `
11111111111111111111111111111
10100000000000000011101111111
10101110110101101011101100001
10100010110100001010001101011
10101000010101101010100101011
10111111010100000010110101011
10000001010110101000110101011
11111101010100101010100101011
11000001010110101010100101011
11011111000000101010100000011
11000000000110101000101111011
11111111010000101111101000011
11111111010110101100001101111
11111111000000101111101100111
11000000011101101110100110111
11011111011101100000110110111
11011111000001111110000010001
11000000011101111110101111101
11111111111100000000101111101
11111111111111111111111111111
    `,
    start: [1, 1],
    exit: [27, 18]
  },

  // Nivel 2
  {
    map: `
11111111111111111111111111111
10000011010000011010111000001
10111011010111000010111011101
10110001010010110110111011101
10001100001010000000010011101
11101111100010111101110100001
10000010101110111101000001111
10111000100011000101011010001
10101011111010010101011010101
10101010000011110111011010101
10001011111000000000011010101
11111010000011111011111010111
10000011111011111011111010111
11101111111011011001000010111
10001010000011011011011110111
11101011110111011011011110001
10001000010100000011010001101
11101111010001111111010101101
10000000011101111111000100001
11111111111111111111111111111
    `,
    start: [1, 18],
    exit: [27 , 10]
  },

  // Nivel 3
  {
    map: `
11111111111111111111111111111
11011011001111010000010000001
10000000000011010111011111101
11011111111011010001000000001
10000000001000000101111111101
11111111111011011000000000011
10000000001011001011111111011
10111111101001100000000000001
10000011101101111010101011101
11111010001101111010101011101
10001010111101000010101011001
10101010100001011110101011111
10101010101101011111101000001
10101010100001000000101011111
10100010101111011110101011111
10111110100011011000101000001
10100000111000001010111111101
10101111111010101010001111101
10100000000010101011100000001
11111111111111111111111111111
    `,
    start: [22, 1],
    exit: [1, 18]
  }
];
let map = [];
let exit = { x: 0, y: 0 };

// 🟡 Puntos dorados
function placePoints() {
  for (let y = 1; y < map.length - 1; y++) {
    for (let x = 1; x < map[y].length - 1; x++) {
      if (map[y][x] === 0 && !(x === playerX && y === playerY) && !(x === exit.x && y === exit.y)) {
        if (Math.random() < 0.05) map[y][x] = 2;
      }
    }
  }
}

// ⏱️ Temporizador
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 60;
  document.getElementById("timer").textContent = `Tiempo: ${timeLeft}`;
  timerInterval = setInterval(() => {
    if (!gameStarted) return;
    timeLeft--;
    document.getElementById("timer").textContent = `Tiempo: ${timeLeft}`;
    if (timeLeft <= 0) {
      showMessage("⏰ ¡Se acabó el tiempo!");
      restartLevel();
    }
  }, 1000);
}

// 🔁 Cargar nivel
function loadLevel(lvl) {
  const lvlData = levels[lvl];
  map = lvlData.map.trim().split("\n").map(r => r.split("").map(Number));
  playerX = lvlData.start[0];
  playerY = lvlData.start[1];
  exit = { x: lvlData.exit[0], y: lvlData.exit[1] };
  placePoints();
  draw();
  document.getElementById("level").textContent = `Nivel: ${level + 1} / ${levels.length}`;
  startTimer();
}

// 🧩 Dibujar mapa
function drawMap() {
  for (let r = 0; r < mapRows; r++) {
    for (let c = 0; c < mapCols; c++) {
      if (map[r][c] === 1) {
        const grad = ctx.createLinearGradient(c*cellSize, r*cellSize, c*cellSize+cellSize, r*cellSize+cellSize);
        grad.addColorStop(0,"#3b0d0d");
        grad.addColorStop(1,"#7b1e1e");
        ctx.fillStyle = grad;
      } else if (map[r][c] === 2) {
        const grad = ctx.createRadialGradient(
          c*cellSize+cellSize/2, r*cellSize+cellSize/2, 2,
          c*cellSize+cellSize/2, r*cellSize+cellSize/2, cellSize/4
        );
        grad.addColorStop(0,"#ffea70");
        grad.addColorStop(1,"#b8860b");
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = "#100";
      }
      ctx.fillRect(c*cellSize, r*cellSize, cellSize, cellSize);
    }
  }

  const exitGrad = ctx.createRadialGradient(
    exit.x*cellSize + cellSize/2, exit.y*cellSize + cellSize/2,
    4,
    exit.x*cellSize + cellSize/2, exit.y*cellSize + cellSize/2,
    cellSize
  );
  exitGrad.addColorStop(0,"#00ffff");
  exitGrad.addColorStop(1,"#004d4d");
  ctx.fillStyle = exitGrad;
  ctx.fillRect(exit.x*cellSize, exit.y*cellSize, cellSize, cellSize);
}

// 🧍 Dibujar jugador con sprite
function drawPlayer() {
  if (!selectedColor || !playerDirection) return;
  const sprite = playerSprites[personajeSeleccionado][playerDirection];
  const scale = 1.5;
const offset = (cellSize * scale - cellSize) / 2;

ctx.drawImage(
  sprite,
  playerX * cellSize - offset,
  playerY * cellSize - offset,
  cellSize * scale,
  cellSize * scale
);

}

// ✨ Mostrar mensaje visual
function showMessage(msg, duration = 3000) {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = msg;
  messageDiv.classList.add("show");
  setTimeout(() => messageDiv.classList.remove("show"), duration);
}

// 🖼️ Dibujar todo
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawPlayer();
}

// 🎮 Movimiento
document.addEventListener("keydown", (e) => {
  if (!gameStarted) return;
  let newX = playerX;
  let newY = playerY;

  if (["w","W"].includes(e.key)) {
    newY--;
    playerDirection = "up";
  } else if (["s","S"].includes(e.key)) {
    newY++;
    playerDirection = "down";
  } else if (["a","A"].includes(e.key)) {
    newX--;
    playerDirection = "left";
  } else if (["d","D"].includes(e.key)) {
    newX++;
    playerDirection = "right";
  }

  if (map[newY][newX] !== 1) {
    playerX = newX;
    playerY = newY;
    if (map[newY][newX] === 2) {
      score += 10;
      map[newY][newX] = 0;
      document.getElementById("score").textContent = `Puntaje: ${score}`;
      soundPoint.play();
    }
  }

  if (playerX === exit.x && playerY === exit.y) levelComplete();
  draw();
});

// 🏁 Nivel completado
function levelComplete() {
  soundLevelComplete.play();
  score += 100;
  document.getElementById("score").textContent = `Puntaje: ${score}`;

  if (level < levels.length - 1) {
    showMessage(`¡Completaste el nivel ${level + 1}!`);
    level++;
    loadLevel(level);
  } else {
    gameStarted = false;
    musicBackground.pause();
    showMessage(`🎉 ¡Felicidades! Puntaje final: ${score}`, 5000);
  }
}

// 🔁 Reiniciar nivel
function restartLevel() {
  loadLevel(level);
}

// ▶️ Iniciar juego
function startGame() {
  gameStarted = true;
  document.getElementById("message").textContent = "";
  loadLevel(level);
  musicBackground.currentTime = 0;
  musicBackground.play();
}

// 🧍 Selección de personaje
const characterButtons = document.querySelectorAll("#character-select button");
characterButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    personajeSeleccionado = index + 1;
    selectedColor = playerColors[personajeSeleccionado];
    document.getElementById("start").style.display = "inline-block";
  });
});

// ▶️ Botones
document.getElementById("start").addEventListener("click", () => {
  startGame();
  document.getElementById("start").style.display = "none";
});
document.get