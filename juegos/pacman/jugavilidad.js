const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level-display');
const livesDisplay = document.getElementById('lives-display');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayText = document.getElementById('overlay-text');
const startBtn = document.getElementById('start-btn');

const tileSize = 28;
const cols = 20;
const rows = 15;
canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

// ========== LABERINTOS ==========
// 1 = pared, 0 = punto, 2 = vacío, 3 = energizante
const MAP_TEMPLATES = [
    // Nivel 1
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,3,1],
        [1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,0,1],
        [1,0,1,1,1,0,0,0,1,1,1,1,0,0,0,1,1,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,2,2,1,1,1,0,1,1,1,0,1],
        [1,0,0,1,0,0,0,2,2,2,2,2,2,0,0,0,1,0,0,1],
        [1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1],
        [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
        [1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,0,1],
        [1,0,1,1,1,0,0,0,1,1,1,1,0,0,0,1,1,1,0,1],
        [1,3,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    // Nivel 2
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,3,1],
        [1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1],
        [1,0,1,1,0,1,0,1,0,0,0,1,0,1,0,1,1,1,0,1],
        [1,0,0,1,0,0,0,1,0,1,0,1,0,0,0,0,1,0,0,1],
        [1,0,1,1,1,0,1,1,2,2,2,1,1,0,1,1,1,0,1,1],
        [1,0,0,0,1,0,0,2,2,2,2,2,0,0,1,0,0,0,0,1],
        [1,1,1,0,1,0,1,1,1,2,1,1,1,0,1,0,1,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,1],
        [1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,0,1,1,1,1,0,0,1,1,0,1,0,1,1,0,1],
        [1,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1],
        [1,3,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    // Nivel 3
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,3,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,3,1],
        [1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,1,0,0,1,1,0,0,1,0,0,0,1,0,1],
        [1,0,1,0,1,0,1,0,1,1,1,1,0,1,0,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,2,2,0,0,0,0,1,0,0,0,1],
        [1,0,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,2,2,2,2,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1,0,1],
        [1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,1],
        [1,3,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,3,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
];

let map = [];
let level = 1;
let dotsLeft = 0;
let lives = 3;
let score = 0;
let frightenedTimer = 0;
let dotFlash = 0;
let combo = 0;
let fruit = null;
let fruitTimer = 0;
let floats = []; // textos flotantes de puntuación

// ========== MOVIMIENTO ==========
// Movimiento top-down por laberinto con física de colisión circular.
// Tanto Pac-Man como los fantasmas se alinean a la rejilla: giran en las
// intersecciones y nunca se atascan contra las paredes.

let baseSpeed = 3.2; // px por frame

const pacman = {
    x: 0, y: 0,
    radius: tileSize / 2 - 4.5,
    dirX: 1, dirY: 0,     // dirección de avance (visual)
    nextDirX: 0, nextDirY: 0, // dirección deseada (buffered)
    lastCx: -1, lastCy: -1,   // última casilla visitada (detección de giro)
    mouthAngle: 0.2,
    mouthSpeed: 0.03
};

const ghostDefs = [
    { name: 'Blinky', color: '#FF0000', speed: 0.92, ai: 'chase', },
    { name: 'Pinky',  color: '#FFB8FF', speed: 0.85, ai: 'ambush', },
    { name: 'Inky',   color: '#00FFFF', speed: 0.80, ai: 'random', },
    { name: 'Clyde',  color: '#FFB852', speed: 0.76, ai: 'patrol', },
];
const ghosts = [];

// ========== SONIDO (WebAudio, sin archivos) ==========
let audioCtx = null;
let audioEnabled = false;
function initAudio() {
    if (!audioCtx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AC();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    audioEnabled = true;
}
function tone(freq, dur, type = 'square', vol = 0.06) {
    if (!audioCtx || !audioEnabled) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
}
const sounds = {
    waka() { tone(180 + Math.random() * 40, 0.08, 'square', 0.05); },
    energizer() { [330, 440, 550].forEach((f, i) => setTimeout(() => tone(f, 0.12, 'triangle', 0.06), i * 70)); },
    eatGhost() { [600, 400, 200].forEach((f, i) => setTimeout(() => tone(f, 0.15, 'sawtooth', 0.06), i * 90)); },
    death() { [400, 300, 200, 120].forEach((f, i) => setTimeout(() => tone(f, 0.2, 'triangle', 0.07), i * 180)); },
    levelUp() { [330, 392, 494, 659].forEach((f, i) => setTimeout(() => tone(f, 0.2, 'triangle', 0.07), i * 130)); },
    fruit() { [500, 700, 900].forEach((f, i) => setTimeout(() => tone(f, 0.12, 'sine', 0.08), i * 80)); },
};

// ========== UTILIDADES MAPA ==========
function tileCenter(tx, ty) { return { x: tx * tileSize + tileSize / 2, y: ty * tileSize + tileSize / 2 }; }
function findDotTile() {
    for (let r = 0; r < map.length; r++)
        for (let c = 0; c < map[r].length; c++)
            if (map[r][c] === 0) return tileCenter(c, r);
    return tileCenter(1, 1);
}
function ghostHouseTile() {
    for (let r = 0; r < map.length; r++)
        for (let c = 0; c < map[r].length; c++)
            if (map[r][c] === 2) return tileCenter(c, r);
    return tileCenter(9, 6);
}

// ========== FÍSICA: COLISIÓN CÍRCULO vs TILES ==========
// Comprueba si un círculo en (x,y) de radio r colisiona con alguna pared.
function circleHitsWall(x, y, r) {
    const minX = Math.floor((x - r) / tileSize);
    const maxX = Math.floor((x + r) / tileSize);
    const minY = Math.floor((y - r) / tileSize);
    const maxY = Math.floor((y + r) / tileSize);
    for (let ty = minY; ty <= maxY; ty++) {
        for (let tx = minX; tx <= maxX; tx++) {
            if (!map[ty] || !map[ty][tx]) continue;
            if (map[ty][tx] !== 1) continue;
            const closestX = Math.max(tx * tileSize, Math.min(x, tx * tileSize + tileSize));
            const closestY = Math.max(ty * tileSize, Math.min(y, ty * tileSize + tileSize));
            const dx = x - closestX;
            const dy = y - closestY;
            if (dx * dx + dy * dy < r * r) return true;
        }
    }
    return false;
}

// ¿La casilla (c, r) tiene pared en la dirección (dx, dy)?
function wallAt(c, r, dx, dy) {
    const nc = c + dx;
    const nr = r + dy;
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return true;
    return map[nr][nc] === 1;
}

// Mover a lo largo de la rejilla de una sola vez (paso discreto por tile).
// Devuelve si hubo avance real.
function tileIndexOf(pos) {
    return Math.round(pos / tileSize - 0.5);
}
function moveEntityGrid(ent, speed, chooseDir) {
    // Índice de la casilla en la que estamos (los centros están en n+0.5 tiles)
    const cx = tileIndexOf(ent.x);
    const cy = tileIndexOf(ent.y);
    // ¿Estamos centrados en una casilla, listos para decidir rumbo?
    const gx = ent.x / tileSize - 0.5;
    const gy = ent.y / tileSize - 0.5;
    const aligned = Math.abs(gx - cx) < 0.03 && Math.abs(gy - cy) < 0.03;

    // Sigue en la dirección actual mientras el camino esté despejado
    const nextX = ent.x + ent.dirX * speed;
    const nextY = ent.y + ent.dirY * speed;
    if (!circleHitsWall(nextX, nextY, ent.radius)) {
        ent.x = nextX;
        ent.y = nextY;
        // Fijar rumbo visual una vez alineado: centrar en fila/columna
        if (Math.abs(ent.dirX) > 0) ent.y = cy * tileSize + tileSize / 2;
        if (Math.abs(ent.dirY) > 0) ent.x = cx * tileSize + tileSize / 2;
        return true;
    }

    // Si estamos alineados y bloqueados por una pared, elegir nueva dirección
    if (aligned) {
        const dir = chooseDir(ent, cx, cy);
        ent.dirX = dir.dx;
        ent.dirY = dir.dy;
        const nx2 = ent.x + ent.dirX * speed;
        const ny2 = ent.y + ent.dirY * speed;
        if (!circleHitsWall(nx2, ny2, ent.radius)) {
            ent.x = nx2;
            ent.y = ny2;
            if (Math.abs(ent.dirX) > 0) ent.y = cy * tileSize + tileSize / 2;
            if (Math.abs(ent.dirY) > 0) ent.x = cx * tileSize + tileSize / 2;
            return true;
        }
    }
    return false;
}

function loadLevel(lvl) {
    const template = MAP_TEMPLATES[(lvl - 1) % MAP_TEMPLATES.length];
    map = template.map(row => row.slice());
    dotsLeft = 0;
    for (let r = 0; r < map.length; r++)
        for (let c = 0; c < map[r].length; c++)
            if (map[r][c] === 0 || map[r][c] === 3) dotsLeft++;

    const spawn = findDotTile();
    pacman.x = spawn.x;
    pacman.y = spawn.y;
    pacman.dirX = 1; pacman.dirY = 0;
    pacman.nextDirX = 0; pacman.nextDirY = 0;
    pacman.lastCx = tileIndexOf(pacman.x);
    pacman.lastCy = tileIndexOf(pacman.y);

    const house = ghostHouseTile();
    ghosts.length = 0;
    for (let i = 0; i < ghostDefs.length; i++) {
        const def = ghostDefs[i];
        ghosts.push({
            id: i,
            name: def.name,
            color: def.color,
            ai: def.ai,
            baseSpeedMult: def.speed,
            speed: baseSpeed * def.speed * (1 + (lvl - 1) * 0.06),
            frightSpeed: baseSpeed * 0.5,
            x: house.x,
            y: house.y,
            radius: tileSize / 2 - 6,
            dirX: 0, dirY: 0,
            frightened: false,
            releaseDelay: (i + 1) * 100
        });
    }
    frightenedTimer = 0;
    combo = 0;
    fruit = null;
    fruitTimer = 0;
}

// ========== CONTROL ==========
window.addEventListener('keydown', (e) => {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d',' '].includes(e.key)) {
        if (e.key !== ' ') e.preventDefault();
    }
    switch (e.key) {
        case 'ArrowUp': case 'w': initAudio(); pacman.nextDirX = 0; pacman.nextDirY = -1; pacman.lastCx = pacman.lastCy = -1; break;
        case 'ArrowDown': case 's': initAudio(); pacman.nextDirX = 0; pacman.nextDirY = 1; pacman.lastCx = pacman.lastCy = -1; break;
        case 'ArrowLeft': case 'a': initAudio(); pacman.nextDirX = -1; pacman.nextDirY = 0; pacman.lastCx = pacman.lastCy = -1; break;
        case 'ArrowRight': case 'd': initAudio(); pacman.nextDirX = 1; pacman.nextDirY = 0; pacman.lastCx = pacman.lastCy = -1; break;
    }
});

// ========== MOVIMIENTO PACMAN ==========
// Movimiento por rejilla con dirección amortiguada (cola de input) y giro
// garantizado en los centros de casilla: se alinea al centro y decide allí,
// de modo que nunca se le escapa un giro ni se atasca contra una pared.
function pacmanTileTurn(centerX, centerY) {
    if (pacman.nextDirX === 0 && pacman.nextDirY === 0) return;
    if (pacman.nextDirX === pacman.dirX && pacman.nextDirY === pacman.dirY) return;
    // La casilla en la dirección deseada debe estar libre
    if (wallAt(centerX, centerY, pacman.nextDirX, pacman.nextDirY)) return;
    pacman.dirX = pacman.nextDirX;
    pacman.dirY = pacman.nextDirY;
}

function updatePacman() {
    // Índice y centro de la casilla actual
    const cx = tileIndexOf(pacman.x);
    const cy = tileIndexOf(pacman.y);
    const centerX = cx * tileSize + tileSize / 2;
    const centerY = cy * tileSize + tileSize / 2;
    const offX = pacman.x - centerX;
    const offY = pacman.y - centerY;

    // Eje transversal: fijar siempre para no desviarse
    if (pacman.dirY === 0) pacman.y = centerY;
    else pacman.x = centerX;

    // Al estar en el centro de una casilla (intersección), decidimos el giro
    // una sola vez por tile (guarda lastCx/lastCy) → nunca se escapa un giro
    // ni oscilamos sobre el centro.
    if ((cx !== pacman.lastCx || cy !== pacman.lastCy)
        && Math.abs(offX) < baseSpeed + 1
        && Math.abs(offY) < baseSpeed + 1) {
        pacman.lastCx = cx;
        pacman.lastCy = cy;
        pacmanTileTurn(cx, cy);
        // re-centrar transversal tras el giro
        if (pacman.dirY === 0) pacman.y = cy * tileSize + tileSize / 2;
        else pacman.x = cx * tileSize + tileSize / 2;
    }

    // Avanzar si el siguiente hueco está libre
    const nx = pacman.x + pacman.dirX * baseSpeed;
    const ny = pacman.y + pacman.dirY * baseSpeed;
    let moved = false;
    if (!circleHitsWall(nx, ny, pacman.radius)) {
        pacman.x = nx;
        pacman.y = ny;
        moved = true;
    }

    // Comer puntos
    const tx = Math.floor(pacman.x / tileSize);
    const ty = Math.floor(pacman.y / tileSize);
    if (map[ty] && map[ty][tx] === 0) {
        map[ty][tx] = 2;
        dotsLeft--;
        score += 10;
        sounds.waka();
    } else if (map[ty] && map[ty][tx] === 3) {
        map[ty][tx] = 2;
        dotsLeft--;
        score += 50;
        frightenedTimer = 420;
        combo = 0;
        sounds.energizer();
        ghosts.forEach(g => { g.frightened = true; g.speed = g.frightSpeed; });
    }

    // Fruta bonus periódica
    if (fruitTimer > 0) {
        fruitTimer--;
        if (fruitTimer === 0) fruit = null;
    }

    // Animación boca
    if (moved) {
        pacman.mouthAngle += pacman.mouthSpeed;
        if (pacman.mouthAngle > 0.4 || pacman.mouthAngle < 0.05) pacman.mouthSpeed = -pacman.mouthSpeed;
    }

    // Punto flotante de puntuación animada
    for (let i = floats.length - 1; i >= 0; i--) {
        floats[i].y -= 1;
        floats[i].life--;
        if (floats[i].life <= 0) floats.splice(i, 1);
    }
}

// ========== IA FANTASMAS ==========
function ghostTarget(ghost) {
    const ptx = Math.floor(pacman.x / tileSize);
    const pty = Math.floor(pacman.y / tileSize);
    switch (ghost.ai) {
        case 'chase': return { x: ptx, y: pty };
        case 'ambush': return { x: ptx + pacman.dirX * 2, y: pty + pacman.dirY * 2 };
        case 'random':
            if (Math.floor(Math.random() * 5) === 0)
                return { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
            return { x: ptx, y: pty };
        case 'patrol': return { x: cols - 1 - ptx, y: rows - 1 - pty };
        default: return { x: ptx, y: pty };
    }
}

// Elige la dirección (tile a tile) con menor coste Manhattan hacia el objetivo,
// sin volver atrás y sin chocar con paredes. Nunca devuelve null.
function chooseGhostDir(ghost, tx, ty) {
    const dirs = [
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
    ];
    let target;
    if (ghost.frightened) {
        // Huir: dirección que más aleje al jugador
        const px = Math.floor(pacman.x / tileSize);
        const py = Math.floor(pacman.y / tileSize);
        target = { x: px, y: py };
    } else {
        target = ghostTarget(ghost);
    }

    let best = null;
    let bestScore = ghost.frightened ? -Infinity : Infinity;
    for (const d of dirs) {
        if (d.dx === -ghost.dirX && d.dy === -ghost.dirY) continue;
        if (wallAt(tx, ty, d.dx, d.dy)) continue;
        const dist = Math.abs((tx + d.dx) - target.x) + Math.abs((ty + d.dy) - target.y);
        const better = ghost.frightened ? dist > bestScore : dist < bestScore;
        if (better) { bestScore = dist; best = d; }
    }
    // Respaldo: recorrer dirs hasta hallar un hueco (evita quedarse atascado)
    if (!best) {
        for (const d of dirs) {
            if (!wallAt(tx, ty, d.dx, d.dy)) { best = d; break; }
        }
    }
    return best || { dx: -ghost.dirX, dy: -ghost.dirY };
}

function updateGhosts() {
    if (frightenedTimer > 0) {
        frightenedTimer--;
        if (frightenedTimer === 0) {
            ghosts.forEach(g => { g.frightened = false; g.speed = baseSpeed * g.baseSpeedMult * (1 + (level - 1) * 0.06); });
        }
    }

    for (const g of ghosts) {
        if (g.releaseDelay > 0) { g.releaseDelay--; continue; }

        const gx = g.x / tileSize - 0.5;
        const gy = g.y / tileSize - 0.5;
        const cx = Math.round(gx);
        const cy = Math.round(gy);
        const aligned = Math.abs(gx - cx) < 0.03 && Math.abs(gy - cy) < 0.03;

        // Al llegar al centro de una casilla, decidir el siguiente rumbo
        if (aligned) {
            const d = chooseGhostDir(g, cx, cy);
            g.dirX = d.dx;
            g.dirY = d.dy;
        }

        // Moverse; si choca, no se queda atascado: se replanteará en el centro
        moveEntityGrid(g, g.speed, chooseGhostDir);
    }
}

function checkGhostCollision() {
    for (let i = ghosts.length - 1; i >= 0; i--) {
        const g = ghosts[i];
        if (g.releaseDelay > 0) continue;
        const dist = Math.hypot(pacman.x - g.x, pacman.y - g.y);
        if (dist < pacman.radius + pacman.radius * 0.7) {
            if (g.frightened) {
                combo++;
                const pts = 200 * combo;
                score += pts;
                floats.push({ x: g.x, y: g.y - 10, life: 45, text: pts });
                sounds.eatGhost();
                g.frightened = false;
                const house = ghostHouseTile();
                g.x = house.x;
                g.y = house.y;
                g.dirX = 0; g.dirY = 0;
                g.releaseDelay = (g.id + 1) * 120;
                g.speed = baseSpeed * g.baseSpeedMult * (1 + (level - 1) * 0.06);
            } else {
                loseLife();
                return true;
            }
        }
    }
    return false;
}

function loseLife() {
    lives--;
    livesDisplay.textContent = lives;
    sounds.death();
    if (lives <= 0) {
        gameOver();
    } else {
        showOverlay('¡PERDISTE UNA VIDA!', 'Tienes ' + lives + ' vida(s) restantes.', 'CONTINUAR');
        paused = true;
        // reiniciar posiciones sin recargar mapa
        const spawn = findDotTile();
        pacman.x = spawn.x; pacman.y = spawn.y;
        pacman.dirX = 1; pacman.dirY = 0;
        pacman.nextDirX = 0; pacman.nextDirY = 0;
        pacman.lastCx = tileIndexOf(pacman.x);
        pacman.lastCy = tileIndexOf(pacman.y);
        ghosts.forEach(g => {
            const house = ghostHouseTile();
            g.x = house.x;
            g.y = house.y;
            g.releaseDelay = (g.id + 1) * 100;
            g.frightened = false;
            g.dirX = 0; g.dirY = 0;
        });
    }
}

function gameOver() {
    showOverlay('GAME OVER', 'Puntuación final: ' + score, 'REINICIAR');
    paused = true;
    gameOverFlag = true;
}

function nextLevel() {
    level++;
    levelDisplay.textContent = level;
    loadLevel(level);
    sounds.levelUp();
    showOverlay('¡NIVEL ' + level + '!', 'Nuevo laberinto. ¡Más rápido y difícil!', 'JUGAR');
    paused = true;
}

// ========== DIBUJADO ==========
function drawWall(x, y) {
    const g = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
    g.addColorStop(0, '#1a0033');
    g.addColorStop(0.5, '#5600ff');
    g.addColorStop(1, '#2b0080');
    ctx.fillStyle = g;
    const r = 6;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + tileSize, y, x + tileSize, y + tileSize, r);
    ctx.arcTo(x + tileSize, y + tileSize, x, y + tileSize, r);
    ctx.arcTo(x, y + tileSize, x, y, r);
    ctx.arcTo(x, y, x + tileSize, y, r);
    ctx.fill();
    ctx.strokeStyle = 'rgba(160,120,255,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function drawDot(cx, cy, isEnergizer) {
    if (isEnergizer) {
        const pulse = 3 + Math.sin(dotFlash * 0.1) * 1.5;
        ctx.fillStyle = '#ffdd00';
        ctx.shadowColor = '#ffdd00';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(cx, cy, pulse + 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    } else {
        ctx.fillStyle = '#FFB8FF';
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawGhost(g) {
    const x = g.x, y = g.y, r = pacman.radius - 3;
    ctx.save();
    ctx.shadowBlur = 12;
    ctx.shadowColor = g.frightened ? '#ffdd00' : g.color;
    ctx.fillStyle = g.frightened
        ? (frightenedTimer < 140 && frightenedTimer % 40 < 20 ? '#4466ff' : '#1a2a7a')
        : g.color;
    ctx.beginPath();
    ctx.arc(x, y - r * 0.2, r, Math.PI, 0);
    for (let i = 0; i <= 3; i++) {
        ctx.lineTo(x - r + (i / 3) * 2 * r, y + r * 0.8 - ((i % 2) * r * 0.3));
    }
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    const eyeR = r * 0.24, eyeOffset = r * 0.4;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x - eyeOffset, y - r * 0.3, eyeR, 0, Math.PI * 2);
    ctx.arc(x + eyeOffset, y - r * 0.3, eyeR, 0, Math.PI * 2);
    ctx.fill();
    if (g.frightened) {
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - eyeOffset, y + r * 0.4);
        ctx.lineTo(x + eyeOffset, y + r * 0.4);
        ctx.stroke();
    } else {
        ctx.fillStyle = '#1a2a7a';
        ctx.beginPath();
        ctx.arc(x - eyeOffset, y - r * 0.3, eyeR * 0.6, 0, Math.PI * 2);
        ctx.arc(x + eyeOffset, y - r * 0.3, eyeR * 0.6, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function drawPacman() {
    let angle = 0;
    if (pacman.dirX === 1) angle = 0;
    else if (pacman.dirX === -1) angle = Math.PI;
    if (pacman.dirY === 1) angle = Math.PI / 2;
    else if (pacman.dirY === -1) angle = (3 * Math.PI) / 2;

    ctx.save();
    ctx.shadowColor = '#ffee00';
    ctx.shadowBlur = 15;
    const g = ctx.createRadialGradient(pacman.x - 3, pacman.y - 3, 2, pacman.x, pacman.y, pacman.radius);
    g.addColorStop(0, '#ffffaa');
    g.addColorStop(1, '#ffdd00');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, pacman.radius, angle + pacman.mouthAngle, angle + Math.PI * 2 - pacman.mouthAngle);
    ctx.lineTo(pacman.x, pacman.y);
    ctx.fill();
    ctx.restore();
}

function drawFloats() {
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    for (const f of floats) {
        ctx.fillStyle = `rgba(255,255,0,${f.life / 45})`;
        ctx.shadowColor = '#ff8800'; ctx.shadowBlur = 8;
        ctx.fillText(f.text, f.x, f.y);
        ctx.shadowBlur = 0;
    }
}

const FRUITS = [
    { emoji: '🍒', color: '#ff4444', value: 100 },
    { emoji: '🍓', color: '#ff7777', value: 300 },
    { emoji: '🍊', color: '#ffaa44', value: 500 },
];
function drawFruit() {
    if (!fruit) return;
    const f = FRUITS[fruit.type];
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = f.color;
    ctx.fillText(f.emoji, fruit.x, fruit.y + 8);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dotFlash++;
    for (let r = 0; r < map.length; r++)
        for (let c = 0; c < map[r].length; c++) {
            const v = map[r][c];
            if (v === 1) drawWall(c * tileSize, r * tileSize);
            else if (v === 0 || v === 3) drawDot(c * tileSize + tileSize / 2, r * tileSize + tileSize / 2, v === 3);
        }

    drawFruit();
    for (const g of ghosts) drawGhost(g);
    drawPacman();
    drawFloats();
}

// ========== OVERLAY ==========
function showOverlay(title, text, btnText) {
    overlayTitle.textContent = title;
    overlayText.textContent = text;
    startBtn.textContent = btnText;
    overlay.classList.remove('hidden');
}
function hideOverlay() { overlay.classList.add('hidden'); }

// ========== BUCLE ==========
let paused = true;
let gameOverFlag = false;

startBtn.addEventListener('click', () => {
    initAudio();
    if (gameOverFlag) {
        score = 0; lives = 3; level = 1;
        scoreDisplay.textContent = 0;
        livesDisplay.textContent = 3;
        levelDisplay.textContent = 1;
        gameOverFlag = false;
        loadLevel(1);
    }
    hideOverlay();
    paused = false;
});

// Fruta periódica y bucle de juego
let frame = 0;
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    if (paused) return;
    frame++;

    updatePacman();
    updateGhosts();
    if (checkGhostCollision()) return;

    // Aparecer fruta aleatoria a mitad de nivel
    if (dotsLeft > 0 && !fruit && frame % 600 === 100) {
        fruitTimer = 450;
        const fruitPos = findDotTile();
        fruit = {
            type: Math.floor(Math.random() * FRUITS.length),
            x: fruitPos.x,
            y: fruitPos.y
        };
    }

    // Comer fruta
    if (fruit) {
        const dist = Math.hypot(pacman.x - fruit.x, pacman.y - fruit.y);
        if (dist < pacman.radius + 12) {
            score += FRUITS[fruit.type].value;
            floats.push({ x: fruit.x, y: fruit.y - 10, life: 50, text: '+' + FRUITS[fruit.type].value });
            sounds.fruit();
            fruit = null;
            fruitTimer = 0;
        }
    }

    scoreDisplay.textContent = score;
    if (dotsLeft <= 0) nextLevel();
}

// Inicializar
loadLevel(1);
scoreDisplay.textContent = 0;
levelDisplay.textContent = 1;
livesDisplay.textContent = 3;
showOverlay('PAC-MAN ARCADE', 'Come todos los puntos para pasar de nivel. ¡Los energizantes te dejan comer fantasmas!', 'JUGAR');
gameLoop();
