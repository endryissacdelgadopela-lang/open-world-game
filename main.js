let scene, camera, renderer;
let player, ground, road, sky;
let coins = 1000;
let money = 1000;
let health = 100;
let kills = 0;
let missionComplete = false;
let gameStarted = false;
let dayTime = true;

const keys = {
  w: false,
  a: false,
  s: false,
  d: false
};

const npcs = [];
const houses = [];
const trees = [];

const canvas = document.getElementById("game");
const menu = document.getElementById("menu");
const adminPanel = document.getElementById("adminPanel");

const moneyEl = document.getElementById("money");
const coinsEl = document.getElementById("coins");
const healthEl = document.getElementById("health");
const killsEl = document.getElementById("kills");
const missionEl = document.getElementById("mission");
const playBtn = document.getElementById("playBtn");
const resetBtn = document.getElementById("resetBtn");
const actionBtn = document.getElementById("actionBtn");

function saveGame() {
  localStorage.setItem("ow_money", String(money));
  localStorage.setItem("ow_health", String(health));
  localStorage.setItem("ow_kills", String(kills));
  localStorage.setItem("ow_coins", String(coins));
}

function loadGame() {
  const savedMoney = localStorage.getItem("ow_money");
  const savedHealth = localStorage.getItem("ow_health");
  const savedKills = localStorage.getItem("ow_kills");
  const savedCoins = localStorage.getItem("ow_coins");

  if (savedMoney !== null) money = parseInt(savedMoney, 10);
  if (savedHealth !== null) health = parseInt(savedHealth, 10);
  if (savedKills !== null) kills = parseInt(savedKills, 10);
  if (savedCoins !== null) coins = parseInt(savedCoins, 10);
}

function updateUI() {
  moneyEl.textContent = money;
  coinsEl.textContent = coins;
  healthEl.textContent = Math.max(0, Math.floor(health));
  killsEl.textContent = kills;

  if (missionComplete) {
    missionEl.textContent = "Misión completada";
  } else {
    missionEl.textContent = "Elimina 5 NPC";
  }
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.Fog(0x87ceeb, 70, 260);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 1.8);
  sun.position.set(40, 80, 30);
  scene.add(sun);

  ground = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 600, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x3cb043 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  road = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 600, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x3b3b3b })
  );
  road.rotation.x = -Math.PI / 2;
  road.position.y = 0.02;
  scene.add(road);

  player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshStandardMaterial({ color: 0x005eff })
  );
  player.position.set(0, 1, 0);
  scene.add(player);

  createWorld();
  createNPCs(30);

  camera.position.set(0, 7, 12);
  camera.lookAt(player.position);

  updateUI();
}

function createHouse(x, z, color = 0xa7a7a7) {
  const house = new THREE.Mesh(
    new THREE.BoxGeometry(6, 5, 6),
    new THREE.MeshStandardMaterial({ color })
  );
  house.position.set(x, 2.5, z);
  scene.add(house);
  houses.push(house);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(4.5, 2.2, 4),
    new THREE.MeshStandardMaterial({ color: 0x7a3f1e })
  );
  roof.position.set(x, 5.4, z);
  roof.rotation.y = Math.PI / 4;
  scene.add(roof);
}

function createTree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.45, 2.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x7b4a1a })
  );
  trunk.position.set(x, 1.1, z);
  scene.add(trunk);
  trees.push(trunk);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(1.4, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0x1f7a28 })
  );
  leaves.position.set(x, 3.1, z);
  scene.add(leaves);
  trees.push(leaves);
}

function createNPC(x, z) {
  const npc = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshStandardMaterial({ color: 0xe53935 })
  );
  npc.position.set(x, 1, z);
  npc.userData = {
    vx: (Math.random() - 0.5) * 0.03,
    vz: (Math.random() - 0.5) * 0.03
  };
  scene.add(npc);
  npcs.push(npc);
}

function createWorld() {
  createHouse(12, 16, 0xb0b0b0);
  createHouse(-14, 20, 0x9f9f9f);
  createHouse(22, -18, 0xc2b280);
  createHouse(-28, -12, 0xaaaaaa);
  createHouse(35, 30, 0x9e9e9e);
  createHouse(-38, 34, 0x8f8f8f);

  for (let i = 0; i < 70; i++) {
    const x = Math.random() * 540 - 270;
    const z = Math.random() * 540 - 270;
    if (Math.abs(x) < 14) continue;
    createTree(x, z);
  }

  for (let i = 0; i < 10; i++) {
    createHouse(Math.random() * 220 - 110, Math.random() * 220 - 110);
  }
}

function createNPCs(count) {
  for (let i = 0; i < count; i++) {
    createNPC(Math.random() * 180 - 90, Math.random() * 180 - 90);
  }
}

function toggleAdmin() {
  adminPanel.style.display = adminPanel.style.display === "block" ? "none" : "block";
}

function addMoney() {
  money += 1000;
  updateUI();
  saveGame();
}

function healPlayer() {
  health = 100;
  updateUI();
  saveGame();
}

function spawnNPC() {
  createNPC(player.position.x + 6, player.position.z + 6);
}

function dayMode() {
  dayTime = true;
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog.color = new THREE.Color(0x87ceeb);
}

function nightMode() {
  dayTime = false;
  scene.background = new THREE.Color(0x06111f);
  scene.fog.color = new THREE.Color(0x06111f);
}

function endMissionIfNeeded() {
  if (kills >= 5 && !missionComplete) {
    missionComplete = true;
    money += 500;
    updateUI();
    saveGame();
  }
}

function removeNPC(index) {
  const npc = npcs[index];
  scene.remove(npc);
  npcs.splice(index, 1);
  money += 50;
  kills += 1;
  updateUI();
  saveGame();
  endMissionIfNeeded();
}

function actionNearNPC() {
  for (let i = npcs.length - 1; i >= 0; i--) {
    const npc = npcs[i];
    const dist = player.position.distanceTo(npc.position);
    if (dist < 4.5) {
      removeNPC(i);
      return;
    }
  }
}

function resetGame() {
  localStorage.removeItem("ow_money");
  localStorage.removeItem("ow_health");
  localStorage.removeItem("ow_kills");
  localStorage.removeItem("ow_coins");
  location.reload();
}

playBtn.addEventListener("click", () => {
  menu.style.display = "none";
  gameStarted = true;
});

resetBtn.addEventListener("click", resetGame);

window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();

  if (k in keys) keys[k] = true;

  if (k === "p") toggleAdmin();
  if (k === "e") actionNearNPC();
});

window.addEventListener("keyup", (e) => {
  const k = e.key.toLowerCase();
  if (k in keys) keys[k] = false;
});

document.querySelectorAll("#mobileControls button[data-key]").forEach((btn) => {
  const key = btn.dataset.key;
  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keys[key] = true;
  });
  btn.addEventListener("touchend", (e) => {
    e.preventDefault();
    keys[key] = false;
  });
});

actionBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  actionNearNPC();
});

actionBtn.addEventListener("click", actionNearNPC);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);

  if (!scene || !camera || !renderer) return;

  const speed = 0.24;

  if (gameStarted) {
    if (keys.w) player.position.z -= speed;
    if (keys.s) player.position.z += speed;
    if (keys.a) player.position.x -= speed;
    if (keys.d) player.position.x += speed;

    player.position.x = THREE.MathUtils.clamp(player.position.x, -290, 290);
    player.position.z = THREE.MathUtils.clamp(player.position.z, -290, 290);

    npcs.forEach((npc) => {
      npc.position.x += npc.userData.vx;
      npc.position.z += npc.userData.vz;

      if (Math.abs(npc.position.x) > 290) npc.userData.vx *= -1;
      if (Math.abs(npc.position.z) > 290) npc.userData.vz *= -1;

      const dist = npc.position.distanceTo(player.position);
      if (dist < 3) {
        health -= 0.04;
      }
    });

    if (health <= 0) {
      health = 0;
      updateUI();
      saveGame();
      alert("GAME OVER");
      location.reload();
      return;
    }

    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 12;
    camera.position.y = player.position.y + 7;
    camera.lookAt(player.position);

    updateUI();
  }

  renderer.render(scene, camera);
}

loadGame();
init();
animate();

setInterval(saveGame, 3000);
