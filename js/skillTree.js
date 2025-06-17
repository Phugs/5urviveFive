import skillData from "./skillData.js";
import dataBase from "./data.js";
import saveData from "./java.js";

const skillButton = document.getElementById("skillButton");
const skillTree = document.getElementById("skill-tree");
const startScreen = document.getElementById("startScreen");
const backgroundGif = document.getElementById("backgroundGif");
const configButton = document.getElementById("configButton");
const achievButton = document.getElementById("achievButton");
const closeButtonSkill = document.getElementById("closeButtonSkill")

skillButton.addEventListener("click", openSkillTree);
closeButtonSkill.addEventListener("click", closeSkillTree);

function openSkillTree() {
    skillTree.style.display = "block";
    startScreen.style.display = "none";
    backgroundGif.style.display = "none";
    configButton.style.display = "none";
    achievButton.style.display = "none";
    loadGame();
}

function closeSkillTree() {
    skillTree.style.display = "none";
    startScreen.style.display = "block";
    backgroundGif.style.display = "block";
    configButton.style.display = "block";
    achievButton.style.display = "block";
    saveGame();
}


// Espaçamento entre colunas na árvore de skills (horizontal)
const columnSpacing = 250;

// Espaçamento entre níveis na árvore de skills (vertical)
const rowSpacing = 150;

// =============================
// Variáveis internas do sistema (não altere a não ser que saiba o que faz)
// =============================
const content = document.getElementById('content');
const canvas = document.getElementById('connection-lines');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const positions = new Map();
const usedCoords = [];
const skillElements = new Map();
const boughtSkills = new Set();
const coinDisplay = document.getElementById('coins');

function updateCoinDisplay() {
    coinDisplay.textContent = dataBase.pontos;
}

function applySavedSkillLevels() {
    const levelMap = {
        "Life": dataBase.lifeLevel,
        "Skills": dataBase.skillUpLevel,
        "Red": dataBase.redLevel,
        "Purple": dataBase.purpleLevel,
        "Blue": dataBase.blueLevel,
        "Shadows": dataBase.shadowsLevel,
        "Yellow": dataBase.yellowLevel,
        "Orange": dataBase.orangeLevel,
        "Minimizer": dataBase.minimizerLevel,
        "Meteor": dataBase.meteorLevel,
        "Move": dataBase.moveLevel
    };

    for (const [prefix, level] of Object.entries(levelMap)) {
        for (let i = 1; i <= level; i++) {
            const skillId = `${prefix} ${i}`;
            const skill = skillData.find(s => s.id === skillId);
            if (skill) {
                boughtSkills.add(skillId);
            }
        }
    }

    updateSkillStates();
}

function increaseSkillLevel(skillId) {
    const skillPrefix = skillId.split(" ")[0];
    const levelKeyMap = {
        "Skills": "skillUpLevel",
        "Life": "lifeLevel",
        "Red": "redLevel",
        "Purple": "purpleLevel",
        "Blue": "blueLevel",
        "Shadows": "shadowsLevel",
        "Yellow": "yellowLevel",
        "Orange": "orangeLevel",
        "Minimizer": "minimizerLevel",
        "Meteor": "meteorLevel",
        "Move": "moveLevel"
    };

    if (levelKeyMap[skillPrefix]) {
        dataBase[levelKeyMap[skillPrefix]]++;
    }


    // Print de todos os níveis
    console.log("Níveis de Skills:");
    console.log("Skills:", dataBase.skillUpLevel);
    console.log("Life:", dataBase.lifeLevel);
    console.log("Red:", dataBase.redLevel);
    console.log("Purple:", dataBase.purpleLevel);
    console.log("Blue:", dataBase.blueLevel);
    console.log("Shadows:", dataBase.shadowsLevel);
    console.log("Yellow:", dataBase.yellowLevel);
    console.log("Orange:", dataBase.orangeLevel);
    console.log("Minimizer:", dataBase.minimizerLevel);
    console.log("Meteor:", dataBase.meteorLevel);
    console.log("Move:", dataBase.moveLevel);

    saveGame();
}

function createSkill(skill, x, y) {
    const el = document.createElement('div');
    el.className = 'skill';
    el.style.left = `${x - 32}px`;
    el.style.top = `${y - 32}px`;
    el.style.backgroundImage = `url('${skill.image}')`;
    el.title = skill.id;

    // Salva o elemento para manipulação futura
    skillElements.set(skill.id, el);

    // Se for skill raiz, já compra automaticamente e habilita próxima
    if (skill.requires === null) {
        boughtSkills.add(skill.id);
        el.classList.add('enabled');
        el.style.opacity = '1';
    }

    content.appendChild(el);

    // Evento click para abrir HUD de compra se permitido
    el.addEventListener('click', (e) => {
        e.stopPropagation();

        if (boughtSkills.has(skill.id)) {
            // Skill já comprada → mostrar HUD sem botão de compra
            showBuyHUD(skill, el, true); // true = modo visualização
        } else {
            // Skill ainda não comprada → só mostra HUD se puder comprar
            if (!canBuy(skill.id)) return;
            showBuyHUD(skill, el, false);
        }
    });

}

function drawLine(from, to, color = '#ffffff') {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Gera a árvore de skills
function generateTree() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 3;

    // Extraí prefixos únicos (ex: "Damage", "Click")
    const uniqueLines = [...new Set(skillData
        .filter(skill => skill.id !== 'Root')
        .map(skill => skill.id.split(' ')[0])
    )];

    // Limita a 10 linhas únicas
    const lines = uniqueLines.slice(0, dataBase.maxLines);

    // Calcula o deslocamento horizontal para centralizar todas as linhas
    const totalColumns = lines.length;
    const startOffset = -((totalColumns - 1) / 2) * columnSpacing;

    const columnOffsets = {};
    lines.forEach((line, index) => {
        columnOffsets[line] = startOffset + index * columnSpacing;
    });

    // Cria skills para cada linha (Damage, Click, etc.)
    const linesGoingUp = dataBase.totalUpLines; // ajuste conforme necessário

    const upLines = lines.slice(0, linesGoingUp);
    const downLines = lines.slice(linesGoingUp);

    const drawLines = (lineArray, isGoingUp) => {
        const offset = (lineArray.length - 1) / 2;

        for (let i = 0; i < lineArray.length; i++) {
            const line = lineArray[i];
            const x = centerX + (i - offset) * columnSpacing;


            let level = 1;
            while (true) {
                const skillId = `${line} ${level}`;
                const skill = skillData.find(s => s.id === skillId);
                if (!skill) break;

                const y = centerY + (isGoingUp ? -level * rowSpacing : level * rowSpacing);

                positions.set(skill.id, { x, y });
                usedCoords.push({ x, y });
                createSkill(skill, x, y);

                const parentId = skill.requires;
                if (parentId && positions.has(parentId)) {
                    const from = positions.get(parentId);
                    let color = '#fff4';
                    if (boughtSkills.has(skill.requires) && boughtSkills.has(skill.id)) {
                        color = '#22ff22';
                    } else if (boughtSkills.has(skill.requires)) {
                        color = '#ffffff';
                    }
                    drawLine(from, { x, y }, color);
                }

                level++;
            }
        }
    };

    drawLines(upLines, true);   // colunas que sobem
    drawLines(downLines, false); // colunas que descem


    // Posiciona a root no centro
    const rootSkill = skillData.find(s => s.id === 'Root');
    if (rootSkill) {
        positions.set('Root', { x: centerX, y: centerY });
        usedCoords.push({ x: centerX, y: centerY });
        createSkill(rootSkill, centerX, centerY);

        // Conecta root aos primeiros níveis
        for (let line of lines) {
            const first = skillData.find(s => s.id === `${line} 1`);
            if (first && positions.has(first.id)) {
                let color = boughtSkills.has(first.id) ? '#22ff22' : '#ffffff';
                drawLine(positions.get('Root'), positions.get(first.id), color);
            }
        }
    }

    updateSkillStates();
    applySavedSkillLevels();
}



// Verifica se pode comprar a skill (tem que ter comprado o requisito)
function canBuy(skillId) {
    const skill = skillData.find(s => s.id === skillId);
    if (!skill) return false;

    // Se não tem requisito, já comprada (root)
    if (!skill.requires) return true;
    return boughtSkills.has(skill.requires);

}

// Atualiza quais skills ficam habilitadas para clique (opacity e cursor)
function updateSkillStates() {
    for (let skill of skillData) {
        const el = skillElements.get(skill.id);
        if (!el) continue;

        if (boughtSkills.has(skill.id)) {
            // Skill comprada: borda verde, opacidade 1, cursor default
            el.style.filter = 'blur(0px)';
            el.classList.add('enabled');
            el.style.cursor = 'default';
            el.style.borderColor = '#22ff22';  // verde
        } else if (canBuy(skill.id)) {
            // Pode comprar: borda branca, opacidade 1, cursor pointer
            el.style.filter = 'blur(0px)';
            el.classList.add('enabled');
            el.style.cursor = 'pointer';
            el.style.borderColor = '#ffffff';  // branco
        } else {
            // Bloqueada: borda vermelha, opacidade 0.4, cursor default
            el.style.filter = 'grayscale(100%)';
            el.classList.remove('enabled');
            el.style.cursor = 'default';
            el.style.borderColor = '#fff4';  // Cinza
        }
    }
}


// HUD para comprar skill
let buyHUD = null;
function showBuyHUD(skill, skillElement, alreadyBought = false) {
    if (buyHUD) {
        buyHUD.remove();
        buyHUD = null;
    }

    buyHUD = document.createElement('div');
    buyHUD.id = 'buy-hud';

    const affordable = dataBase.pontos >= skill.cost;

    buyHUD.innerHTML = `
  <div><strong>${skill.id}</strong></div>
  <div style="margin-top:6px;">${skill.description}</div>
  <div style="margin-top:8px;">Cost: <strong>${skill.cost} Skill Points</strong></div>
  ${alreadyBought ? '' : `<button ${affordable ? '' : 'disabled style="opacity:0.5; cursor: not-allowed;"'}>Learn</button>`}
`;


    content.appendChild(buyHUD);

    const rect = skillElement.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    let left = rect.left - contentRect.left + 70;
    let top = rect.top - contentRect.top - 10;

    buyHUD.style.left = `${left}px`;
    buyHUD.style.top = `${top}px`;

    const btn = buyHUD.querySelector('button');
    btn.addEventListener('click', () => {
        if (dataBase.pontos >= skill.cost) {
            dataBase.pontos -= skill.cost;
            boughtSkills.add(skill.id);

            // Aumenta o nível da skill correspondente
            increaseSkillLevel(skill.id);

            updateCoinDisplay();
            updateSkillStates();
            buyHUD.remove();
            buyHUD = null;
        }
    });
}


function hideBuyHUD() {
    if (buyHUD) {
        buyHUD.remove();
        buyHUD = null;
    }
}

// Comprar skill: adiciona ao comprado e atualiza visual
function buySkill(skillId) {
    boughtSkills.add(skillId);
    updateSkillStates();
}

// Gera árvore e conecta tudo
generateTree();
updateCoinDisplay();


// Drag para mover a tela
let isDragging = false;
let startX, startY;
let offsetX = 0, offsetY = 0;

skillTree.addEventListener('mousedown', (e) => {
    // Só inicia drag se clicar fora do HUD
    if (buyHUD && buyHUD.contains(e.target)) return;

    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    skillTree.style.cursor = 'grabbing';

    // Fecha HUD ao iniciar drag
    hideBuyHUD();
});

skillTree.addEventListener('mousemove', (e) => {
    // Atualiza linhas com novo offset
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let skill of skillData) {
        const pos = positions.get(skill.id);
        if (!pos || !skill.requires) continue;
        const parent = positions.get(skill.requires);
        if (!parent) continue;
        let color = '#fff4';
        if (boughtSkills.has(skill.requires) && boughtSkills.has(skill.id)) {
            color = '#22ff22';
        } else if (boughtSkills.has(skill.requires)) {
            color = '#ffffff';
        }
        drawLine(
            { x: parent.x + offsetX, y: parent.y + offsetY },
            { x: pos.x + offsetX, y: pos.y + offsetY },
            color
        );

    }

    if (!isDragging) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    content.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    skillTree.style.cursor = 'grab';
});

// Fecha HUD ao clicar fora
document.addEventListener('click', (e) => {
    if (buyHUD && !buyHUD.contains(e.target)) {
        hideBuyHUD();
    }
});

// Ajusta canvas ao redimensionar janela
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let skill of skillData) {
        const pos = positions.get(skill.id);
        if (!pos || !skill.requires) continue;
        const parent = positions.get(skill.requires);
        if (!parent) continue;
        let color = '#fff4';
        if (boughtSkills.has(skill.requires) && boughtSkills.has(skill.id)) {
            color = '#22ff22';
        } else if (boughtSkills.has(skill.requires)) {
            color = '#ffffff';
        }
        drawLine(
            { x: parent.x + offsetX, y: parent.y + offsetY },
            { x: pos.x + offsetX, y: pos.y + offsetY },
            color
        );

    }
});

// Suporte a toque (mobile)
let touchStartX = 0, touchStartY = 0;
let touchOffsetX = 0, touchOffsetY = 0;
let touchMoved = false;
let touchStartTime = 0;

skillTree.addEventListener('touchstart', (e) => {
    if (buyHUD && buyHUD.contains(e.target)) return;

    const touch = e.touches[0];
    isDragging = true;
    touchMoved = false;
    touchStartTime = Date.now();

    touchStartX = touch.clientX - offsetX;
    touchStartY = touch.clientY - offsetY;

    hideBuyHUD();
});

skillTree.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const touch = e.touches[0];
    const moveX = touch.clientX - touchStartX;
    const moveY = touch.clientY - touchStartY;

    // Marcar como movido se ultrapassar pequena distância
    if (Math.abs(moveX - offsetX) > 5 || Math.abs(moveY - offsetY) > 5) {
        touchMoved = true;
    }

    offsetX = moveX;
    offsetY = moveY;
    content.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

    // Atualiza linhas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let skill of skillData) {
        const pos = positions.get(skill.id);
        if (!pos || !skill.requires) continue;
        const parent = positions.get(skill.requires);
        if (!parent) continue;
        let color = '#fff4';
        if (boughtSkills.has(skill.requires) && boughtSkills.has(skill.id)) {
            color = '#22ff22';
        } else if (boughtSkills.has(skill.requires)) {
            color = '#ffffff';
        }
        drawLine(
            { x: parent.x + offsetX, y: parent.y + offsetY },
            { x: pos.x + offsetX, y: pos.y + offsetY },
            color
        );
    }

    e.preventDefault(); // Impede o scroll da página durante o arraste
}, { passive: false });

skillTree.addEventListener('touchend', (e) => {
    const elapsed = Date.now() - touchStartTime;

    // Se foi um toque rápido e sem movimento, deixar passar o clique
    if (!touchMoved && elapsed < 200) {
        const target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        if (target && target.classList.contains('skill')) {
            target.click(); // Dispara manualmente o clique
        }
    }

    isDragging = false;
});


function saveGame() {
    saveData.pontos = dataBase.pontos;
    saveData.maxTime = dataBase.maxTime;
    saveData.achieve1 = dataBase.achieve1;
    saveData.achieve2 = dataBase.achieve2;
    saveData.maxLines = dataBase.maxLines;
    saveData.skillUpLevel = dataBase.skillUpLevel;
    saveData.redLevel = dataBase.redLevel;
    saveData.lifeLevel = dataBase.lifeLevel;
    saveData.purpleLevel = dataBase.purpleLevel;
    saveData.blueLevel = dataBase.blueLevel;
    saveData.shadowsLevel = dataBase.shadowsLevel;
    saveData.yellowLevel = dataBase.yellowLevel;
    saveData.orangeLevel = dataBase.orangeLevel;
    saveData.minimizerLevel = dataBase.minimizerLevel;
    saveData.meteorLevel = dataBase.meteorLevel;
    saveData.moveLevel = dataBase.moveLevel;
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


