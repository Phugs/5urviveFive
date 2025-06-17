const dataBase = {
  maxTime: 0,
  pontos: 0,
  lifes: 0,
  shield: false,

  // Arena settings
  arenaRadius: 300,
  minArenaRadius: 200,

  // Enemy settings
  maxShadows: 7,
  purpleCooldown: 1000,
  firstEnemySpeed: 2,
  maxEnemySpeed: 99,
  secondEnemySpeed: 5,
  tailEnemySpeed: 2.5,
  tailMaxLength: 200,
  shadowDuration: 1,
  yellowEnemySpeed: 2.5,
  yellowEnemySpeed: 2.5,
  yellowSpawnChance: 0.1,
  yellowMaxEnemies: 5,
  bombardBombInterval: 2,
  bombExplosionRadius: 200,

  // Coin settings
  moedaSpawnChance: 0.003,
  coinValue: 1,

  // Game timings
  winTimeLimit: 300,
  secondEnemySpawnTime: 30,
  tailEnemySpawnTime: 60,
  secondEnemyShadowStartTime: 90,
  yellowEnemySpawnTime: 120,
  bombardEnemySpawnTime: 150,
  reduceArenaTime: 180,
  meteorStartTime: 210,
  arenaMovementTime: 240,

  // Achievements
  achieve1: false,
  achieve2: false,
  achieve3: false,
  achieve4: false,
  achieve5: false,
  achieve6: false,
  achieve7: false,
  achieve8: false,
  achieve9: false,
  achieve10: false,

  totalUpLines: 2,
  maxLines: 3,
  lifeLevel: 0,
  skillUpLevel: 0,
  redLevel: 0,
  purpleLevel: 0,
  blueLevel: 0,
  shadowsLevel: 0,
  yellowLevel: 0,
  orangeLevel: 0,
  minimizerLevel: 0,
  meteorLevel: 0,
  moveLevel: 0,
};
export default dataBase;
