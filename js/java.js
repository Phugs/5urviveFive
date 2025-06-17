import dataBase from "./data.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const hud = document.getElementById("hud");
const message = document.getElementById("message");
const playButton = document.getElementById("playButton");
const alert = document.getElementById("ALERT");
const resetButton = document.getElementById("resetButton");
const confirmReset = document.getElementById("confirmReset");
const confirm = document.getElementById("confirm");
const cancel = document.getElementById("cancel");

let arenaColor = "white"; // <- Nova variável
let arenaCenter = { x: 0, y: 0 };
let cursorPos = { x: 0, y: 0 };
let enemy = {
  x: 0,
  y: 0,
  speed: dataBase.firstEnemySpeed,
};
let enemyRadius = 15;
let secondEnemy = null;
let sombras = [];
let realShadowIndex = 0;
let shadowTimer = 0;
let moedas = [];
let startTime = null;
let gameEnded = false;
let tailEnemy = null;
let tailSegments = [];
let bombardEnemy = null;
let bombs = [];
let lastBombTime = 0;
let meteorShowerActive = false;
let meteors = [];
let meteorSpawnInterval = 1; // a cada 0.5 segundos nasce um meteoro
let meteorLastSpawnTime = 0;
let arenaTarget = { x: arenaCenter.x, y: arenaCenter.y }; // Posição alvo da arena
let movementTimer = 0; // Timer para controlar o tempo até o próximo sorteio
let moveStarted = false; // Indica se a movimentação foi iniciada
let arenaSpeed = 1;
let yellowEnemies = [];

function detectZoom() {
  const zoom = window.innerWidth / window.outerWidth;
  if (canvas.style.display === "block") {
    alert.style.display = "block";
    setTimeout(() => reiniciarPagina(), 2000);
  }
  dataBase.achieve1 = true;
  saveGame();
  console.log(`Zoom detectado: ${zoom}`);
}
window.addEventListener('resize', detectZoom);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    reiniciarPagina()
  } else {
    console.log("Usuário voltou para o site.");
  }
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  arenaCenter = { x: canvas.width / 2, y: canvas.height / 2 };
  cursorPos = { x: arenaCenter.x, y: arenaCenter.y };
}

loadGame();

function spawnYellowEnemy() {
  const angle = Math.random() * Math.PI * 2;
  const spawnDistance = dataBase.arenaRadius + 150;
  yellowEnemies.push({
    x: arenaCenter.x + Math.cos(angle) * spawnDistance,
    y: arenaCenter.y + Math.sin(angle) * spawnDistance,
    speed: dataBase.yellowEnemySpeed,
    target: null, // alvo moeda
  });
}

canvas.addEventListener("click", function (e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const dx = mouseX - enemy.x;
  const dy = mouseY - enemy.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance <= enemyRadius) {
    dataBase.achieve2 = true;
    saveGame();
    // Você pode adicionar alguma ação aqui, como remover o inimigo, etc.
  }
});


function updateMovement(deltaTime) {
  if (gameEnded) return;

  const elapsed = (Date.now() - startTime) / 1000;

  // Começa a movimentação após 210 segundos (3 minutos e 30 segundos)
  if (elapsed >= dataBase.arenaMovementTime && !moveStarted) {
    moveStarted = true;
    // Sorteia uma nova posição aleatória para a arena
    arenaTarget = {
      x:
        Math.random() * (canvas.width - dataBase.arenaRadius * 2) +
        dataBase.arenaRadius,
      y:
        Math.random() * (canvas.height - dataBase.arenaRadius * 2) +
        dataBase.arenaRadius,
    };
  }

  // Mover a arena em direção à posição alvo
  if (moveStarted) {
    const dx = arenaTarget.x - arenaCenter.x;
    const dy = arenaTarget.y - arenaCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = arenaSpeed; // A velocidade de movimentação pode ser ajustada conforme necessário

    // Se a arena ainda não atingiu a posição alvo, mover em direção a ela
    if (distance > speed) {
      arenaCenter.x += (dx / distance) * speed;
      arenaCenter.y += (dy / distance) * speed;
    } else {
      // Caso contrário, sorteia uma nova posição aleatória
      arenaTarget = {
        x:
          Math.random() * (canvas.width - dataBase.arenaRadius * 2) +
          dataBase.arenaRadius,
        y:
          Math.random() * (canvas.height - dataBase.arenaRadius * 2) +
          dataBase.arenaRadius,
      };
    }
  }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

canvas.addEventListener("mousemove", function (e) {
  if (gameEnded) return;
  const rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  const dx = x - arenaCenter.x;
  const dy = y - arenaCenter.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > dataBase.arenaRadius) {
    const angle = Math.atan2(dy, dx);
    x = arenaCenter.x + Math.cos(angle) * dataBase.arenaRadius;
    y = arenaCenter.y + Math.sin(angle) * dataBase.arenaRadius;
  }
  cursorPos.x = x;
  cursorPos.y = y;
});

function spawnEnemy() {
  dataBase.shield = true;
  setTimeout(() => {
    dataBase.shield = false;
  }, 1000);
  const angle = Math.random() * Math.PI * 2;
  const spawnDistance = dataBase.arenaRadius + 200;
  enemy.x = arenaCenter.x + Math.cos(angle) * spawnDistance;
  enemy.y = arenaCenter.y + Math.sin(angle) * spawnDistance;
}

function spawnMoeda() {
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * dataBase.arenaRadius;
  const x = arenaCenter.x + Math.cos(angle) * distance;
  const y = arenaCenter.y + Math.sin(angle) * distance;
  moedas.push({ x, y, spawnTime: Date.now() });
}

function spawnSecondEnemy() {
  const angle = Math.random() * Math.PI * 2;
  const spawnDistance = dataBase.arenaRadius + 100;
  secondEnemy = {
    x: arenaCenter.x + Math.cos(angle) * spawnDistance,
    y: arenaCenter.y + Math.sin(angle) * spawnDistance,
    radius: 15,
    speed: dataBase.secondEnemySpeed,
  };
  teleportSecondEnemy();
}

function teleportSecondEnemy() {
  sombras = [];
  let newPositions = [];

  const elapsed = (Date.now() - startTime) / 1000;

  if (elapsed >= dataBase.secondEnemyShadowStartTime) {
    for (let i = 0; i < dataBase.maxShadows; i++) {
      let safe = false;
      while (!safe) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * dataBase.arenaRadius;
        const newX = arenaCenter.x + Math.cos(angle) * distance;
        const newY = arenaCenter.y + Math.sin(angle) * distance;
        const distToCursor = Math.hypot(cursorPos.x - newX, cursorPos.y - newY);
        if (distToCursor > 100) {
          newPositions.push({ x: newX, y: newY, radius: 20 });
          safe = true;
        }
      }
    }
    sombras = newPositions;
    realShadowIndex = Math.floor(Math.random() * 3);
  } else {
    let safe = false;
    while (!safe) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * dataBase.arenaRadius;
      const newX = arenaCenter.x + Math.cos(angle) * distance;
      const newY = arenaCenter.y + Math.sin(angle) * distance;
      const distToCursor = Math.hypot(cursorPos.x - newX, cursorPos.y - newY);
      if (distToCursor > 100) {
        sombras = [{ x: newX, y: newY, radius: 20 }];
        realShadowIndex = 0;
        safe = true;
      }
    }
  }
  shadowTimer = 0;
}

function spawnTailEnemy() {
  tailEnemy = {
    x: arenaCenter.x,
    y: arenaCenter.y,
    speed: dataBase.tailEnemySpeed,
    radius: 12,
  };
  tailSegments = [];
}

function spawnBombardEnemy() {
  bombardEnemy = {
    angle: 0,
    radius: dataBase.arenaRadius + 50,
    speed: 0.02,
  };
  bombs = [];
  lastBombTime = 0;
}

function update(deltaTime) {
  if (gameEnded) return;

  const elapsed = (Date.now() - startTime) / 1000;

  if (elapsed >= dataBase.reduceArenaTime) {
    if (dataBase.arenaRadius > dataBase.minArenaRadius) {
      const shrinkRate = 10 * (deltaTime / 1000); // 10 unidades por segundo
      dataBase.arenaRadius = Math.max(
        dataBase.minArenaRadius,
        dataBase.arenaRadius - shrinkRate
      );
      arenaColor = "red"; // Arena ficando vermelha enquanto diminui
    } else {
      arenaColor = "white"; // Quando parar de diminuir
    }
  }

  if (elapsed >= dataBase.maxTime) {
    dataBase.maxTime = elapsed;
  }
  if (gameEnded) return;

  updateMovement(deltaTime); // Chama a função de movimentação

  if (!enemy.spawned && elapsed > 0.1) {
    spawnEnemy();
    enemy.spawned = true; // Marcar que já nasceu
  }

  function updateYellowEnemies(deltaTime) {
    if (gameEnded) return;

    // Spawn inicial dos amarelos
    const elapsed = (Date.now() - startTime) / 1000;
    if (
      elapsed >= dataBase.yellowEnemySpawnTime &&
      yellowEnemies.length === 0
    ) {
      spawnYellowEnemy();
    }

    // Atualizar movimento dos amarelos
    for (let i = 0; i < yellowEnemies.length; i++) {
      const yellow = yellowEnemies[i];

      // Procurar moeda se não tiver alvo
      if (!yellow.target || !moedas.includes(yellow.target)) {
        yellow.target =
          moedas.length > 0
            ? moedas[Math.floor(Math.random() * moedas.length)]
            : null;
      }

      if (yellow.target) {
        const dx = yellow.target.x - yellow.x;
        const dy = yellow.target.y - yellow.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 2) {
          yellow.x += (dx / dist) * yellow.speed * (deltaTime / 16.67);
          yellow.y += (dy / dist) * yellow.speed * (deltaTime / 16.67);
        } else {
          // Pegou a moeda
          moedas = moedas.filter((m) => m !== yellow.target);
          yellow.target = null;

          // Chance de spawnar mais um amarelo
          if (
            Math.random() < dataBase.yellowSpawnChance &&
            yellowEnemies.length < dataBase.yellowMaxEnemies
          ) {
            spawnYellowEnemy();
          }
        }
      }

      // Se tocar no jogador, game over
      if (Math.hypot(cursorPos.x - yellow.x, cursorPos.y - yellow.y) < 15) {
        endGame(false);
      }
    }
  }

  updateYellowEnemies(deltaTime);

  if (enemy.speed < dataBase.maxEnemySpeed) {
    enemy.speed = dataBase.firstEnemySpeed + elapsed * 0.05;
  } else {
    enemy.speed = dataBase.maxEnemySpeed;
  }



  // Inimigo vermelho
  const dx = cursorPos.x - enemy.x;
  const dy = cursorPos.y - enemy.y;
  const angle = Math.atan2(dy, dx);
  enemy.x += Math.cos(angle) * enemy.speed * (deltaTime / 16.67);
  enemy.y += Math.sin(angle) * enemy.speed * (deltaTime / 16.67);

  if (Math.hypot(cursorPos.x - enemy.x, cursorPos.y - enemy.y) < 15) {
    endGame(false);
  }

  // Moedas
  moedas = moedas.filter((m) => {
    const coinDist = Math.hypot(cursorPos.x - m.x, cursorPos.y - m.y);
    if (coinDist < 10) {
      dataBase.pontos += dataBase.coinValue;
      saveGame();
      return false;
    }
    return Date.now() - m.spawnTime < 5000;
  });

  if (Math.random() < dataBase.moedaSpawnChance) {
    spawnMoeda();
  }

  // Segundo inimigo roxo
  if (!secondEnemy && elapsed >= dataBase.secondEnemySpawnTime) {
    spawnSecondEnemy();
  }

  if (secondEnemy) {
    shadowTimer += deltaTime / 1000;

    if (shadowTimer >= dataBase.shadowDuration) {
      secondEnemy.x = sombras[realShadowIndex].x;
      secondEnemy.y = sombras[realShadowIndex].y;
      sombras = [];
      teleportSecondEnemy();
    }

    const dx2 = cursorPos.x - secondEnemy.x;
    const dy2 = cursorPos.y - secondEnemy.y;
    const angle2 = Math.atan2(dy2, dx2);
    secondEnemy.x += Math.cos(angle2) * secondEnemy.speed * (deltaTime / 16.67);
    secondEnemy.y += Math.sin(angle2) * secondEnemy.speed * (deltaTime / 16.67);

    if (
      Math.hypot(cursorPos.x - secondEnemy.x, cursorPos.y - secondEnemy.y) < 15
    ) {
      endGame(false);
    }
  }

  // Cauda inimiga
  if (!tailEnemy && elapsed >= dataBase.tailEnemySpawnTime) {
    spawnTailEnemy();
  }

  if (tailEnemy) {
    const dx3 = cursorPos.x - tailEnemy.x;
    const dy3 = cursorPos.y - tailEnemy.y;
    const angle3 = Math.atan2(dy3, dx3);
    tailEnemy.x += Math.cos(angle3) * tailEnemy.speed * (deltaTime / 16.67);
    tailEnemy.y += Math.sin(angle3) * tailEnemy.speed * (deltaTime / 16.67);

    tailSegments.push({ x: tailEnemy.x, y: tailEnemy.y });

    if (tailSegments.length > dataBase.tailMaxLength) {
      tailSegments.shift();
    }

    for (let seg of tailSegments) {
      if (Math.hypot(cursorPos.x - seg.x, cursorPos.y - seg.y) < 8) {
        endGame(false);
      }
    }

    if (
      Math.hypot(cursorPos.x - tailEnemy.x, cursorPos.y - tailEnemy.y) <
      tailEnemy.radius
    ) {
      endGame(false);
    }
  }

  // Bombardeiro
  if (!bombardEnemy && elapsed >= dataBase.bombardEnemySpawnTime) {
    spawnBombardEnemy();
  }

  if (bombardEnemy) {
    bombardEnemy.angle += bombardEnemy.speed * (deltaTime / 16.67);
    const x =
      arenaCenter.x + Math.cos(bombardEnemy.angle) * bombardEnemy.radius;
    const y =
      arenaCenter.y + Math.sin(bombardEnemy.angle) * bombardEnemy.radius;

    // Soltar bombas
    lastBombTime += deltaTime / 1000;
    if (lastBombTime >= dataBase.bombardBombInterval) {
      bombs.push({ x, y, spawnTime: Date.now() });
      lastBombTime = 0;
    }

    // Atualizar bombas
    bombs = bombs.filter((bomb) => {
      if (Date.now() - bomb.spawnTime >= 2000) {
        if (
          Math.hypot(cursorPos.x - bomb.x, cursorPos.y - bomb.y) <
          dataBase.bombExplosionRadius
        ) {
          endGame(false);
        }
        return false;
      }
      return true;
    });
  }

  // Ativa chuva de meteoros após 150s
  if (elapsed >= dataBase.meteorStartTime) {
    meteorShowerActive = true;
  }

  // Se ativo, faz chover meteoros
  if (meteorShowerActive) {
    meteorLastSpawnTime += deltaTime / 1000;
    if (meteorLastSpawnTime >= meteorSpawnInterval) {
      spawnMeteor();
      meteorLastSpawnTime = 0;
    }

    // Atualiza meteoro
    meteors = meteors.filter((meteor) => {
      meteor.y += meteor.speed;
      if (meteor.y > canvas.height) return false; // Remove se sair da tela
      if (Math.hypot(cursorPos.x - meteor.x, cursorPos.y - meteor.y) < 20) {
        endGame(false); // Jogador morre se tocar
        return false;
      }
      return true;
    });
  }


  document.getElementById("hud-points").innerHTML = `
  <img src="image/DNA.png" alt="Points" style="width: 40px; vertical-align: middle; margin-right: 8px; margin-bottom: 10px; border-radius: 50%; border-style: solid; border-width: 2px; border-color: white;">
  Points: ${saveData.pontos}
`;

document.getElementById("hud-time").innerHTML = `
  <img src="image/Time.png" alt="Time" style="width: 40px; vertical-align: middle; margin-right: 8px; margin-bottom: 10px;  border-radius: 50%; border-style: solid; border-width: 2px; border-color: white;">
  Time Alive: ${Math.floor(elapsed)}s
`;

document.getElementById("hud-max").innerHTML = `
  <img src="image/MaxTime.png" alt="Max Time" style="width: 40px; vertical-align: middle; margin-right: 8px; margin-bottom: 10px; border-radius: 50%; border-style: solid; border-width: 2px; border-color: white;">
  MaxTime: ${Math.floor(dataBase.maxTime)}s
`;



  if (elapsed >= dataBase.winTimeLimit) {
    endGame(true);
  }
}

function spawnMeteor() {
  const x = Math.random() * canvas.width;
  const y = -20; // Começa fora da tela
  const speed = 5 + Math.random() * 3; // Velocidade aleatória
  meteors.push({ x, y, speed });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(arenaCenter.x, arenaCenter.y, dataBase.arenaRadius, 0, Math.PI * 2);
  ctx.strokeStyle = arenaColor;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cursorPos.x, cursorPos.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = "cyan";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(enemy.x, enemy.y, enemyRadius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();

  for (const m of moedas) {
    ctx.beginPath();
    ctx.arc(m.x, m.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = "gold";
    ctx.fill();
  }

  if (sombras.length > 0) {
    for (let i = 0; i < sombras.length; i++) {
      const s = sombras[i];
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(128, 0, 128, 0.23)";
      ctx.fill();
    }
  }

  if (secondEnemy) {
    ctx.beginPath();
    ctx.arc(secondEnemy.x, secondEnemy.y, secondEnemy.radius, 0, Math.PI * 2);
    ctx.fillStyle = "purple";
    ctx.fill();
  }

  if (tailEnemy) {
    for (let i = 0; i < tailSegments.length; i++) {
      const seg = tailSegments[i];
      ctx.beginPath();
      ctx.arc(seg.x, seg.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 255, ${(i + 1) / tailSegments.length})`;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(tailEnemy.x, tailEnemy.y, tailEnemy.radius, 0, Math.PI * 2);
    ctx.fillStyle = "aqua";
    ctx.fill();
  }

  if (bombardEnemy) {
    const x =
      arenaCenter.x + Math.cos(bombardEnemy.angle) * bombardEnemy.radius;
    const y =
      arenaCenter.y + Math.sin(bombardEnemy.angle) * bombardEnemy.radius;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();
  }

  // Desenhando a área da explosão das bombas
  for (const bomb of bombs) {
    ctx.beginPath();
    ctx.arc(bomb.x, bomb.y, dataBase.bombExplosionRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 0, 0, 0.06)"; // cor com transparência
    ctx.fill();

    // Desenhando a bomba (no centro da área de explosão)
    ctx.beginPath();
    ctx.arc(bomb.x, bomb.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "darkred";
    ctx.fill();
  }

  // Desenhar meteoros
  for (let meteor of meteors) {
    ctx.beginPath();
    ctx.arc(meteor.x, meteor.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();
  }

  for (let yellowEnemie of yellowEnemies) {
    ctx.fillStyle = "yellow";
    yellowEnemies.forEach((yellow) => {
      ctx.beginPath();
      ctx.arc(yellow.x, yellow.y, 10, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

function endGame(victory) {
  if (dataBase.shield) {
    // Se o escudo já está ativo, o jogador não deve tomar dano.
    message.innerText = "Escudo ativo! Você não perdeu vida.";
    return; // sai da função, sem perder vida
  }

  // Se o escudo não está ativo:
  if (dataBase.lifes === 0) {
    saveGame();
    gameEnded = true;
    message.innerText = victory ? "Você venceu!" : "Game Over!";
    message.style.display = "block";
    setTimeout(() => backToMenu(), 1000);
  } else if (dataBase.lifes > 0) {
    dataBase.lifes -= 1;

    // Ativa o escudo temporário
    dataBase.shield = true;
    setTimeout(() => {
      dataBase.shield = false;
    }, 1000); // escudo por 3 segundos
  }
}



function backToMenu() {
  // Esconde a tela inicial
  document.getElementById("startScreen").style.display = "block";

  // Mostra o jogo
  document.getElementById("hud").style.display = "none";
  document.getElementById("message").style.display = "none";
  document.getElementById("gameCanvas").style.display = "none";

  reiniciarPagina();
}
let lastTime = 0;
function gameLoop(timestamp) {
  if (!startTime) startTime = Date.now();
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  update(deltaTime);
  draw();
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  startTime = Date.now();
  gameEnded = false;

  enemy = { x: 0, y: 0, speed: dataBase.firstEnemySpeed };
  secondEnemy = null;
  sombras = [];
  realShadowIndex = 0;
  shadowTimer = 0;
  moedas = [];
  tailEnemy = null;
  tailSegments = [];
  bombardEnemy = null;
  bombs = [];
  lastBombTime = 0;
  meteors = [];
  meteorShowerActive = false;
  moveStarted = false;
  arenaColor = "white";
  dataBase.arenaRadius = 300; // Resetar para o valor original
  document.getElementById("message").style.display = "none";
  moveStarted = false;
  arenaTarget = { x: arenaCenter.x, y: arenaCenter.y };

  resizeCanvas(); // Reposicionar tudo no centro
}

function reiniciarPagina() {
  location.reload();
}

const saveData = {
  pontos: dataBase.pontos,
  maxTime: dataBase.maxTime,
  achieve1: dataBase.achieve1,
  achieve2: dataBase.achieve2,
};

function saveGame() {
  (saveData.pontos = dataBase.pontos),
    (saveData.maxTime = dataBase.maxTime),
    (saveData.achieve1 = dataBase.achieve1),
    (saveData.achieve2 = dataBase.achieve2),
    (saveData.maxLines = dataBase.maxLines),
    (saveData.skillUpLevel = dataBase.skillUpLevel),
    (saveData.redLevel = dataBase.redLevel),
    (saveData.lifeLevel = dataBase.lifeLevel),
    (saveData.purpleLevel = dataBase.purpleLevel),
    (saveData.blueLevel = dataBase.blueLevel),
    (saveData.shadowsLevel = dataBase.shadowsLevel),
    (saveData.yellowLevel = dataBase.yellowLevel),
    (saveData.orangeLevel = dataBase.orangeLevel),
    (saveData.minimizerLevel = dataBase.minimizerLevel),
    (saveData.meteorLevel = dataBase.meteorLevel),
    (saveData.moveLevel = dataBase.moveLevel),
    localStorage.setItem("saveData", JSON.stringify(saveData));
}

function loadGame() {
  const saved = localStorage.getItem("saveData");
  if (saved) {
    const saveData = JSON.parse(saved);
    dataBase.pontos = saveData.pontos || 0;
    dataBase.maxTime = saveData.maxTime;
    dataBase.achieve1 = saveData.achieve1;
    dataBase.achieve2 = saveData.achieve2;
    dataBase.maxLines = saveData.maxLines;
    dataBase.skillUpLevel = saveData.skillUpLevel;
    dataBase.redLevel = saveData.redLevel;
    dataBase.lifeLevel = saveData.lifeLevel;
    dataBase.purpleLevel = saveData.purpleLevel;
    dataBase.blueLevel = saveData.blueLevel;
    dataBase.shadowsLevel = saveData.shadowsLevel;
    dataBase.yellowLevel = saveData.yellowLevel;
    dataBase.orangeLevel = saveData.orangeLevel;
    dataBase.minimizerLevel = saveData.minimizerLevel;
    dataBase.meteorLevel = saveData.meteorLevel;
    dataBase.moveLevel = saveData.moveLevel;
  }
}

function dataReset() {
  localStorage.clear();
  location.reload();
}

function openConfirm() {
  confirmReset.style.display = "block";
  configHUD.style.display = "none";
}

function cancelDataReset() {
  confirmReset.style.display = "none";
  startScreen.style.display = "block";
}

confirm.addEventListener("click", dataReset);
cancel.addEventListener("click", cancelDataReset);
resetButton.addEventListener("click", openConfirm);
playButton.addEventListener("click", startGame);

function startGame() {
  applySkills();
  // Esconde a tela inicial
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("configButton").style.display = "none";
  document.getElementById("achievButton").style.display = "none";

  // Mostra o jogo
  document.getElementById("hud").style.display = "block";
  document.getElementById("message").style.display = "block";
  document.getElementById("gameCanvas").style.display = "block";

  // Agora sim começa o jogo!

  requestAnimationFrame(gameLoop);
  resetGame();

  setInterval(saveGame, 10000); // salva a cada 10 segundos

  // Chama a função que você já tem no seu jogo
}

export default saveData;


function applySkills() {

  //COIN SKILL BUFFS
  if (dataBase.skillUpLevel === 1) {
    dataBase.moedaSpawnChance = 0.006;
  } else if (dataBase.skillUpLevel === 2) {
    dataBase.moedaSpawnChance = 0.009;
  } else if (dataBase.skillUpLevel === 3) {
    dataBase.moedaSpawnChance = 0.012;
  }

  //COIN SKILL BUFFS
  if (dataBase.lifeLevel === 1) {
    dataBase.lifes = 1;
  }

  //RED SKILL BUFFS
  if (dataBase.redLevel === 1) {
    dataBase.maxEnemySpeed = 15;
  } else if (dataBase.redLevel === 2) {
    dataBase.maxEnemySpeed = 14;
  } else if (dataBase.redLevel === 3) {
    dataBase.maxEnemySpeed = 13;
  }

  //PURPLE SKILL BUFFS
  else if (dataBase.purpleLevel === 1) {
    dataBase.secondEnemySpeed = 4;
  } else if (dataBase.purpleLevel === 2) {
    dataBase.secondEnemySpeed = 3;
  } else if (dataBase.purpleLevel === 3) {
    dataBase.secondEnemySpeed = 2.5;
  }

  //BLUE SKILL BUFFS
  else if (dataBase.blueLevel === 1) {
    dataBase.tailMaxLength = 180;
  } else if (dataBase.blueLevel === 2) {
    dataBase.tailMaxLength = 160;
  } else if (dataBase.blueLevel === 3) {
    dataBase.tailMaxLength = 140;
  }

  //SHADOWS SKILL BUFFS
  if (dataBase.shadowsLevel === 1) {
    dataBase.maxShadows = 6;
  } else if (dataBase.shadowsLevel === 2) {
    dataBase.maxShadows = 5;
  } else if (dataBase.shadowsLevel === 3) {
    dataBase.maxShadows = 4;
  }
}
