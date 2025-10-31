//  MAZE RUNNER – versión con sprites y sonidos
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const mapCols = 29;
const mapRows = 20;
const cellSize = 32;

canvas.width = mapCols * cellSize;
canvas.height = mapRows * cellSize;

//  Variables del juego
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


//  Sprites
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

//  Sonidos
const musicBackground = new Audio("musica_fondo.mp3");
musicBackground.loop = true;
musicBackground.volume = 0.3;

const soundPoint = new Audio("punto.mp3");
const soundLevelComplete = new Audio("nivel_completado.mp3");

//  Modal de Términos
document.addEventListener("DOMContentLoaded", () => {
  const modal = new bootstrap.Modal(document.getElementById("terminosModal"));
  modal.show();

  const checkbox = document.getElementById("aceptoTerminos");
  const btnAceptar = document.getElementById("btnAceptarTerminos");

  checkbox.addEventListener("change", () => {
    btnAceptar.disabled = !checkbox.checked;
  });

  btnAceptar.addEventListener("click", () => {
    modal.hide();
    document.getElementById("character-select").style.display = "block";
  });

  document.getElementById("character-select").style.display = "none";
});
