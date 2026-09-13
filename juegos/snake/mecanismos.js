const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const finalScoreDisplay = document.getElementById('final-score');
const readyScreen = document.getElementById('ready-screen');
const pauseScreen = document.getElementById('pause-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const restartBtn = document.getElementById('restart-btn');
const pauseBtn = document.getElementById('pause-btn');

// Configuración de la cuadrícula
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Velocidad del juego (ms por tick). Baja la velocidad => más rápido.
const BASE_SPEED = 110;
const MIN_SPEED = 60;

// Estados posibles: ready | playing | paused | gameOver
let state = 'ready';

// Variables de juego
let snake = [];
let food = { x: 0, y: 0 };
let bonusFood = null; // Comida dorada bonus
let bonusTicks = 0;   // Cuenta regresiva de la comida bonus
let dx = gridSize;
let dy = 0;
let score = 0;
let foodsEaten = 0;
let highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
let tick = 0;
let gameInterval;
let currentDelay = BASE_SPEED;
let changingDirection = false;
let particles = [];

highScoreDisplay.textContent = highScore;

document.addEventListener('keydown', handleKeyPress);
restartBtn.addEventListener('click', resetGame);
pauseBtn.addEventListener('click', togglePause);

// Controles táctiles (deslizar el dedo sobre el canvas)
let touchStart = null;
canvas.addEventListener('touchstart', (e) => {
  const t = e.changedTouches[0];
  touchStart = { x: t.clientX, y: t.clientY };
}, { passive: true });

canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

canvas.addEventListener('touchend', (e) => {
  if (!touchStart) return;
  const t = e.changedTouches[0];
  const dxPx = t.clientX - touchStart.x;
  const dyPx = t.clientY - touchStart.y;
  touchStart = null;
  if (Math.abs(dxPx) < 20 && Math.abs(dyPx) < 20) return;
  if (Math.abs(dxPx) > Math.abs(dyPx)) {
    setDirection(dxPx > 0 ? 'right' : 'left');
  } else {
    setDirection(dyPx > 0 ? 'down' : 'up');
  }
});

resetGame();

function resetGame() {
  snake = [
    { x: 160, y: 200 },
    { x: 140, y: 200 },
    { x: 120, y: 200 }
  ];
  score = 0;
  foodsEaten = 0;
  dx = gridSize;
  dy = 0;
  bonusFood = null;
  particles = [];
  state = 'ready';
  scoreDisplay.textContent = score;

  clearInterval(gameInterval);
  gameOverScreen.classList.add('hidden');
  pauseScreen.classList.add('hidden');
  readyScreen.classList.remove('hidden');

  generateFood();
  clearCanvas();
  drawFood();
  drawSnake();
}

function startGame() {
  readyScreen.classList.add('hidden');
  state = 'playing';
  startInterval();
}

function startInterval() {
  clearInterval(gameInterval);
  currentDelay = getDelay();
  gameInterval = setInterval(mainLoop, currentDelay);
}

// La velocidad aumenta cada vez que se come comida
function getDelay() {
  return Math.max(MIN_SPEED, BASE_SPEED - foodsEaten * 4);
}

function mainLoop() {
  if (state !== 'playing') return;

  if (hasGameEnded()) {
    state = 'gameOver';
    clearInterval(gameInterval);
    finalScoreDisplay.textContent = 'PUNTOS: ' + score;
    gameOverScreen.classList.remove('hidden');
    return;
  }

  tick++;
  changingDirection = false;
  moveSnake();

  if (bonusFood) {
    bonusTicks--;
    if (bonusTicks <= 0) bonusFood = null;
  }

  clearCanvas();
  drawFood();
  drawBonusFood();
  drawSnake();
  updateParticles();

  maybeReschedule();
}

function maybeReschedule() {
  const delay = getDelay();
  if (delay !== currentDelay) {
    currentDelay = delay;
    startInterval();
  }
}

function clearCanvas() {
  ctx.fillStyle = '#080811';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  snake.forEach((part, index) => {
    // Degradado del color: cabeza brillante -> cola más apagada
    const ratio = index / Math.max(1, snake.length - 1);
    const g = Math.round(240 - 160 * ratio);
    const b = Math.round(255 - 130 * ratio);
    ctx.fillStyle = `rgb(0, ${g}, ${b})`;

    if (index === 0) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00f0ff';
    } else {
      ctx.shadowBlur = 0;
    }

    ctx.fillRect(part.x, part.y, gridSize - 2, gridSize - 2);

    if (index === 0) drawEyes(part);
  });
  ctx.shadowBlur = 0;
}

function drawEyes(part) {
  ctx.fillStyle = '#ffffff';
  const s = 3;
  if (dx === -gridSize) {
    ctx.fillRect(part.x + 4, part.y + 5, s, s);
    ctx.fillRect(part.x + 4, part.y + 12, s, s);
  } else if (dx === gridSize) {
    ctx.fillRect(part.x + 13, part.y + 5, s, s);
    ctx.fillRect(part.x + 13, part.y + 12, s, s);
  } else if (dy === -gridSize) {
    ctx.fillRect(part.x + 5, part.y + 4, s, s);
    ctx.fillRect(part.x + 12, part.y + 4, s, s);
  } else {
    ctx.fillRect(part.x + 5, part.y + 13, s, s);
    ctx.fillRect(part.x + 12, part.y + 13, s, s);
  }
}

function moveSnake() {
  let newX = snake[0].x + dx;
  let newY = snake[0].y + dy;

  // Lógica de bordes infinitos / pasarela (Warping)
  if (newX < 0) {
    newX = canvas.width - gridSize;
  } else if (newX >= canvas.width) {
    newX = 0;
  }

  if (newY < 0) {
    newY = canvas.height - gridSize;
  } else if (newY >= canvas.height) {
    newY = 0;
  }

  const head = { x: newX, y: newY };
  snake.unshift(head);

  const headX = head.x + gridSize / 2;
  const headY = head.y + gridSize / 2;

  if (head.x === food.x && head.y === food.y) {
    foodsEaten++;
    score += 10;
    spawnParticles(headX, headY, '#ff007f');
    if (foodsEaten % 5 === 0) spawnBonusFood();
    generateFood();
  } else if (bonusFood && head.x === bonusFood.x && head.y === bonusFood.y) {
    score += 50;
    bonusFood = null;
    spawnParticles(headX, headY, '#ffd700');
  } else {
    snake.pop();
  }

  updateScore();
}

function updateScore() {
  scoreDisplay.textContent = score;
  if (score > highScore) {
    highScore = score;
    highScoreDisplay.textContent = highScore;
    localStorage.setItem('snakeHighScore', highScore);
  }
}

function generateFood() {
  const cell = randomEmptyCell();
  if (cell) food = cell;
}

function spawnBonusFood() {
  const cell = randomEmptyCell();
  if (!cell) return;
  bonusFood = cell;
  bonusTicks = 24;
}

function randomEmptyCell() {
  let x, y, occupied;
  do {
    x = Math.floor(Math.random() * tileCount) * gridSize;
    y = Math.floor(Math.random() * tileCount) * gridSize;
    occupied =
      snake.some((part) => part.x === x && part.y === y) ||
      (food.x === x && food.y === y) ||
      (bonusFood && bonusFood.x === x && bonusFood.y === y);
  } while (occupied && snake.length < tileCount * tileCount - 2);
  if (snake.length >= tileCount * tileCount - 2) return null;
  return { x, y };
}

function drawGlowCircle(cx, cy, diameter, color) {
  ctx.save();
  ctx.shadowBlur = 14;
  ctx.shadowColor = color;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, diameter / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawFood() {
  const pulse = 1 + Math.sin(tick * 0.3) * 0.15;
  drawGlowCircle(
    food.x + gridSize / 2,
    food.y + gridSize / 2,
    (gridSize - 4) * pulse,
    '#ff007f'
  );
}

function drawBonusFood() {
  if (!bonusFood) return;
  const cx = bonusFood.x + gridSize / 2;
  const cy = bonusFood.y + gridSize / 2;
  const pulse = 1.2 + Math.sin(tick * 0.4) * 0.25;
  drawGlowCircle(cx, cy, (gridSize - 2) * pulse, '#ffd700');

  // Anillo que muestra el tiempo restante
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#ffd700';
  const radius = gridSize / 2 + 5;
  const progress = Math.max(0, bonusTicks / 24) * Math.PI * 2;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + progress);
  ctx.stroke();
  ctx.restore();
}

function spawnParticles(cx, cy, color) {
  for (let i = 0; i < 14; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 2.5;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      color
    });
  }
}

function updateParticles() {
  const alive = [];
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.25;
    p.life -= 0.07;
    if (p.life > 0) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      drawGlowCircle(p.x, p.y, 5, p.color);
      ctx.restore();
      alive.push(p);
    }
  });
  particles = alive;
}

function setDirection(dir) {
  if (state === 'ready') startGame();
  if (state !== 'playing' || changingDirection) return;

  const goingUp = dy === -gridSize;
  const goingDown = dy === gridSize;
  const goingRight = dx === gridSize;
  const goingLeft = dx === -gridSize;

  if (dir === 'left' && !goingRight) {
    dx = -gridSize;
    dy = 0;
    changingDirection = true;
  } else if (dir === 'up' && !goingDown) {
    dx = 0;
    dy = -gridSize;
    changingDirection = true;
  } else if (dir === 'right' && !goingLeft) {
    dx = gridSize;
    dy = 0;
    changingDirection = true;
  } else if (dir === 'down' && !goingUp) {
    dx = 0;
    dy = gridSize;
    changingDirection = true;
  }
}

function togglePause() {
  if (state === 'playing') {
    state = 'paused';
    pauseScreen.classList.remove('hidden');
    clearInterval(gameInterval);
  } else if (state === 'paused') {
    state = 'playing';
    pauseScreen.classList.add('hidden');
    startInterval();
  }
}

function handleKeyPress(event) {
  const key = event.key.toLowerCase();
  const isArrow = ['arrowleft', 'arrowright', 'arrowup', 'arrowdown'].includes(key);
  if (isArrow) event.preventDefault();

  if ((key === 'enter' || key === ' ') && state === 'gameOver') {
    resetGame();
    return;
  }

  if (state === 'gameOver') return;

  if (key === ' ' || key === 'p' || key === 'escape') {
    event.preventDefault();
    togglePause();
    return;
  }

  if (key === 'a' || key === 'arrowleft') setDirection('left');
  else if (key === 'w' || key === 'arrowup') setDirection('up');
  else if (key === 'd' || key === 'arrowright') setDirection('right');
  else if (key === 's' || key === 'arrowdown') setDirection('down');
}

function hasGameEnded() {
  // Solo pierde si se choca contra su propio cuerpo
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}