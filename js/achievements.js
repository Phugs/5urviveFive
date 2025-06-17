import dataBase from "./data.js";

const buttonAchievements = document.getElementById("achievButton");
const achievementsHUD = document.getElementById("achievementsHUD");
const startScreen = document.getElementById("startScreen");
const indexHUD = document.getElementById("index");
const configHUD = document.getElementById("configHUD");
const configButton = document.getElementById("configButton");
const confirmReset = document.getElementById("confirmReset");
const achieve1 = document.getElementById("achiev1");
const achieve2 = document.getElementById("achiev2");
const achieve3 = document.getElementById("achiev3");
const achieve4 = document.getElementById("achiev4");
const achieve5 = document.getElementById("achiev5");
const achieve6 = document.getElementById("achiev6");
const achieve7 = document.getElementById("achiev7");
const achieve8 = document.getElementById("achiev8");
const achieve9 = document.getElementById("achiev9");
const achieve10 = document.getElementById("achiev10");

buttonAchievements.addEventListener("click", openAchievements);

function openAchievements() {
  if (achievementsHUD.style.display === "block") {
    achievementsHUD.style.display = "none";
    startScreen.style.display = "block";
    configHUD.style.display = "none";
    buttonAchievements.style.backgroundColor = "rgba(123, 123, 123, 0.526)"
  } else {
    achievementsHUD.style.display = "block";
    startScreen.style.display = "none";
    indexHUD.style.display = "none";
    configHUD.style.display = "none";
    buttonAchievements.style.backgroundColor = "rgba(255, 255, 255, 0.526)";
    configButton.style.backgroundColor = "rgba(123, 123, 123, 0.526)";
    confirmReset.style.display = "none";;
  }

  updateAchievements();
}

function updateAchievements() {
  if (dataBase.achieve1 === true) {
    achieve1.style.display = "block";
  }
  if (dataBase.achieve2 === true) {
    achieve2.style.display = "block";
  }
  if (dataBase.achieve3 === true) {
    achieve3.style.display = "block";
  }
  if (dataBase.achieve4 === true) {
    achieve4.style.display = "block";
  }
  if (dataBase.achieve5 === true) {
    achieve5.style.display = "block";
  }
  if (dataBase.achieve6 === true) {
    achieve6.style.display = "block";
  }
  if (dataBase.achieve7 === true) {
    achieve7.style.display = "block";
  }
  if (dataBase.achieve8 === true) {
    achieve8.style.display = "block";
  }
  if (dataBase.achieve9 === true) {
    achieve9.style.display = "block";
  }
  if (dataBase.achieve10 === true) {
    achieve10.style.display = "block";
  }
}
