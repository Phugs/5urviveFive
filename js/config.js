const configButton = document.getElementById("configButton");
const configHUD = document.getElementById("configHUD");
const startScreen = document.getElementById("startScreen");
const achievementsHUD = document.getElementById("achievementsHUD");
const buttonAchievements = document.getElementById("achievButton");
const indexHUD = document.getElementById("index");
const confirmReset = document.getElementById("confirmReset");

configButton.addEventListener("click", openConfig);

function openConfig() {
  if (configHUD.style.display === "block") {
    configHUD.style.display = "none";
    startScreen.style.display = "block";
    achievementsHUD.style.display = "none";
    configButton.style.backgroundColor = "rgba(123, 123, 123, 0.526)"
  } else {
    configHUD.style.display = "block";
    startScreen.style.display = "none";
        achievementsHUD.style.display = "none";
        configButton.style.backgroundColor = "rgba(255, 255, 255, 0.526)";
        buttonAchievements.style.backgroundColor = "rgba(123, 123, 123, 0.526)";
        indexHUD.style.display = "none";
        confirmReset.style.display = "none";
  }
}
