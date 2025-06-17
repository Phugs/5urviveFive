import dataBase from "./data.js";
import saveData from "./java.js";

const startScreen = document.getElementById("startScreen");
const indexHUD = document.getElementById("index");
const infoName = document.getElementById("infoName");
const infoText = document.getElementById("infoText");
const infoImg = document.getElementById("infoImg");
const indexInfo = document.getElementById("indexInfo");
const indexButton = document.getElementById("indexButton");
const closeButton = document.getElementById("closeButton");
const buttonRed = document.getElementById("buttonRed");
const buttonPurple = document.getElementById("buttonPurple");
const buttonBlue = document.getElementById("buttonBlue");
const buttonShadows = document.getElementById("buttonShadows");
const buttonOrange = document.getElementById("buttonOrange");
const buttonMinimizer = document.getElementById("buttonMinimizer");
const buttonMeteor = document.getElementById("buttonMeteor");
const buttonMove = document.getElementById("buttonMove");
const indexRed =  document.getElementById("buttonRed");
const indexPurple =  document.getElementById("buttonPurple");
const indexBlue =  document.getElementById("buttonBlue");
const indexShadows =  document.getElementById("buttonShadows");
const indexOrange =  document.getElementById("buttonOrange");
const indexMinimizer =  document.getElementById("buttonMinimizer");
const indexMeteor =  document.getElementById("buttonMeteor");
const indexMove =  document.getElementById("buttonMove");
const indexYellow =  document.getElementById("buttonYellow");

indexButton.addEventListener("click", openIndex);
closeButton.addEventListener("click", closeIndex);
buttonRed.addEventListener("click", openRedInfo);
buttonPurple.addEventListener("click", openPurpleInfo);
buttonBlue.addEventListener("click", openBlueInfo);
buttonShadows.addEventListener("click", openShadowsInfo);
buttonOrange.addEventListener("click", openOrangeInfo);
buttonMinimizer.addEventListener("click", openMinimizerInfo);
buttonMeteor.addEventListener("click", openMeteorInfo);
buttonMove.addEventListener("click", openMoveInfo);
buttonYellow.addEventListener("click", openYellowInfo);

function updateIndex() {
  if (dataBase.maxTime >= dataBase.secondEnemySpawnTime) {
    indexPurple.style.display = "block";
    dataBase.maxLines = dataBase.totalUpLines + 2;
  }
  if (dataBase.maxTime >= dataBase.tailEnemySpawnTime) {
    indexBlue.style.display = "block";
    dataBase.maxLines = dataBase.totalUpLines + 3;
  }
  if (dataBase.maxTime >= dataBase.secondEnemyShadowStartTime) {
    indexShadows.style.display = "block";
    dataBase.maxLines = dataBase.totalUpLines + 4;
  }
  if (dataBase.maxTime >= dataBase.yellowEnemySpawnTime) {
    indexYellow.style.display = "block";
    dataBase.maxLines = dataBase.totalUpLines + 5;
  }
  if (dataBase.maxTime >= dataBase.bombardEnemySpawnTime) {
    indexOrange.style.display = "block";
    dataBase.maxLines = dataBase.totalUpLines + 6;
  }
  if (dataBase.maxTime >= dataBase.reduceArenaTime) {
    indexMinimizer.style.display = "block";
    dataBase.maxLines = dataBase.totalUpLines + 7;
  }
  if (dataBase.maxTime >= dataBase.meteorStartTime) {
    indexMeteor.style.display = "block";
    dataBase.maxLines = dataBase.totalUpLines + 8;
  }
  if (dataBase.maxTime >= dataBase.arenaMovementTime) {
    indexMove.style.display = "block";
    dataBase.maxLines = dataBase.totalUpLines + 9;
  }
}

function openIndex() {
  startScreen.style.display = "none";
  indexHUD.style.display = "block";
}

function closeIndex() {
  startScreen.style.display = "block";
  indexHUD.style.display = "none";
  indexInfo.style.display = "none";
}

function openRedInfo() {
  indexInfo.style.display = "flex";
  infoName.textContent = "Red";
  infoText.textContent = "Texto Aqui";
  infoImg.src = "./image/red.png";
  infoText.textContent = 'Um inimigo vermelho simples que te persegue. A cada segundo, ele fica mais rápido, isso é culpa "deles".'
}

function openPurpleInfo() {
  indexInfo.style.display = "flex";
  infoName.textContent = "Purple";
  infoText.textContent = "Texto Aqui";
  infoImg.src = "./image/purple.png";
  infoText.textContent = "Surge um segundo inimigo que cria sombras falsas pela arena. Ele pode teleportar entre essas sombras e te caçar de forma imprevisível, exigindo atenção redobrada para adivinhar sua posição verdadeira."
}

function openBlueInfo() {
  indexInfo.style.display = "flex";
  infoName.textContent = "Blue";
  infoText.textContent = "Texto Aqui";
  infoImg.src = "./image/blue.png";
  infoText.textContent = "Um novo inimigo aparece, deixando um rastro mortal pelo caminho. Você não pode encostar nem no Blue nem em sua trilha... São lagrimas?"
}

function openShadowsInfo() {
  indexInfo.style.display = "flex";
  infoName.textContent = "Purple Shadows";
  infoText.textContent = "Texto Aqui";
  infoImg.src = "./image/shadow.png";
  infoText.textContent = "Após um tempo Purple começou a dividir suas sombras, fazendo sua proxima localização ser imprevisivel"
}

function openYellowInfo() {
  indexInfo.style.display = "flex";
  infoName.textContent = "Yellow";
  infoText.textContent = "Texto Aqui";
  infoImg.src = "./image/yellow.png";
  infoText.textContent = '"Cuidado com o amarelo" diziam eles... não te persegue, porém o toque ainda é mortal, ele vive correndo atras das moedas e caso pegue ela, tem chance de se multiplicar. Se atente com as moedas!!'
}

function openOrangeInfo() {
  indexInfo.style.display = "flex";
  infoName.textContent = "Orange";
  infoText.textContent = "Texto Aqui";
  infoImg.src = "./image/orange.png";
  infoText.textContent = "Um inimigo externo circula a arena, lançando bombas que explodem ao tocar o chão. Você precisa desviar não só dos inimigos, mas também dos perigosos projéteis caindo do céu."
}

function openMinimizerInfo() {
  indexInfo.style.display = "flex";
  infoName.textContent = "Minimizer";
  infoText.textContent = "Texto Aqui";
  infoImg.src = "./image/minimizer.png";
  infoText.textContent = "A arena começa a encolher, apertando o espaço disponível para se mover. A borda fica vermelha enquanto diminui, aumentando ainda mais a pressão para sobreviver em um campo cada vez menor."
}

function openMeteorInfo() {
  indexInfo.style.display = "flex";
  infoName.textContent = "Meteor Shower";
  infoText.textContent = "Texto Aqui";
  infoImg.src = "./image/meteor.png";
  infoText.textContent = "Meteoros começam a cair sem aviso, criando perigos aleatórios e imprevisíveis pelo mapa. Sobreviver agora depende de reflexos rápidos e muita atenção ao ambiente."
}

function openMoveInfo() {
  indexInfo.style.display = "flex";
  infoName.textContent = "Move!!";
  infoText.textContent = "Texto Aqui";
  infoImg.src = "./image/move.png";
  infoText.textContent = "Depois de um tempo, a própria arena começa a se mover aleatoriamente pelo mapa. Você precisa acompanhar o movimento dela para continuar protegido, enquanto ainda foge dos inimigos e obstáculos."
}

updateIndex();