import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// ============================================================
// CASA CONTRERAS — TOUR 3D v0.1
// Fonte de verdade dimensional desta primeira versão navegável.
// ============================================================
const CFG = Object.freeze({
  lot: { width: 10.0, length: 25.0 },
  house: { width: 6.058, depth: 7.076, centerZ: -2.50 },
  levels: { ground: 0, social: 3.25, private: 6.25 },
  floorHeight: 3.0,
  eyeHeight: 1.66,
  wallThickness: 0.12,
  centralGap: 2.20,
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd5d3);
scene.fog = new THREE.Fog(0xbfd5d3, 24, 48);

const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.03, 100);
camera.position.set(0, CFG.eyeHeight, -11.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.prepend(renderer.domElement);

const controls = new PointerLockControls(camera, document.body);
const enter = document.getElementById('enter');
const start = document.getElementById('start');
const selectedLabel = document.getElementById('selected');
const feedback = document.getElementById('feedback');
const feedbackTitle = document.getElementById('feedbackTitle');
const feedbackMeta = document.getElementById('feedbackMeta');
const feedbackText = document.getElementById('feedbackText');
const cancelFeedback = document.getElementById('cancelFeedback');
const sendFeedback = document.getElementById('sendFeedback');
const toastEl = document.getElementById('toast');

enter.addEventListener('click', () => controls.lock());
controls.addEventListener('lock', () => { start.style.display = 'none'; });
controls.addEventListener('unlock', () => {
  if (feedback.style.display !== 'grid') start.style.display = 'grid';
});

// ---------- Lights ----------
scene.add(new THREE.HemisphereLight(0xeaf5ff, 0x526047, 1.75));
const sun = new THREE.DirectionalLight(0xfff2d1, 2.25);
sun.position.set(-12, 18, -10);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -20;
sun.shadow.camera.right = 20;
sun.shadow.camera.top = 20;
sun.shadow.camera.bottom = -20;
scene.add(sun);

const warm = new THREE.PointLight(0xffc98e, 28, 22, 2);
warm.position.set(0, 7.5, -2.5);
scene.add(warm);

// ---------- Shared state ----------
const interactables = [];
const collisionBoxes = [];
const selectableRoots = new Set();
let hovered = null;
let selected = null;
let prevHighlight = null;
const raycaster = new THREE.Raycaster();
const centerNdc = new THREE.Vector2(0, 0);

const mats = {
  ground: new THREE.MeshStandardMaterial({ color: 0x6f8f5e, roughness: 1 }),
  path: new THREE.MeshStandardMaterial({ color: 0x9b9385, roughness: 0.95 }),
  water: new THREE.MeshPhysicalMaterial({ color: 0x3e8f9f, roughness: 0.15, metalness: 0.0, transmission: 0.12, transparent: true, opacity: 0.82 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x8c5d34, roughness: 0.8 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x222a27, roughness: 0.55, metalness: 0.65 }),
  wall: new THREE.MeshStandardMaterial({ color: 0xe8e1d3, roughness: 0.86 }),
  darkWall: new THREE.MeshStandardMaterial({ color: 0x2d3732, roughness: 0.72 }),
  floor: new THREE.MeshStandardMaterial({ color: 0xb8895e, roughness: 0.7 }),
  concrete: new THREE.MeshStandardMaterial({ color: 0x8b8f8c, roughness: 0.92 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0xb9e2df, transparent: true, opacity: 0.38, roughness: 0.05, transmission: 0.75, side: THREE.DoubleSide }),
  leaf: new THREE.MeshStandardMaterial({ color: 0x3e6f3e, roughness: 0.92 }),
  leaf2: new THREE.MeshStandardMaterial({ color: 0x5b8d4f, roughness: 0.92 }),
  soil: new THREE.MeshStandardMaterial({ color: 0x5f4532, roughness: 1 }),
  solar: new THREE.MeshStandardMaterial({ color: 0x193c59, roughness: 0.25, metalness: 0.4 }),
  red: new THREE.MeshStandardMaterial({ color: 0xb64f42, roughness: 0.8 }),
};

function tag(obj, id, label, category = 'Elemento') {
  obj.userData = { ...obj.userData, id, label, category, selectable: true };
  interactables.push(obj);
  selectableRoots.add(obj);
  return obj;
}

function box({ w, h, d, x = 0, y = h / 2, z = 0, mat = mats.wall, id, label, category, collide = false, shadow = true }) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = shadow;
  mesh.receiveShadow = true;
  scene.add(mesh);
  if (id) tag(mesh, id, label || id, category);
  if (collide) collisionBoxes.push({ mesh, box: new THREE.Box3().setFromObject(mesh) });
  return mesh;
}

function cylinder({ r = 0.2, h = 1, x = 0, y = h / 2, z = 0, mat = mats.wood, id, label, category }) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 16), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  if (id) tag(mesh, id, label || id, category);
  return mesh;
}

function wallSegment(id, label, x, yBase, z, w, h, d, mat = mats.wall) {
  return box({ w, h, d, x, y: yBase + h / 2, z, mat, id, label, category: 'Parede', collide: true });
}

function labelSprite(text, pos, scale = 1) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(5,15,10,.72)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = '700 42px system-ui';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sprite.position.copy(pos);
  sprite.scale.set(3.4 * scale, 0.85 * scale, 1);
  scene.add(sprite);
  return sprite;
}

// ============================================================
// TERRENO 10 x 25 — geometria exata e retangular
// ============================================================
const ground = box({ w: CFG.lot.width, h: 0.18, d: CFG.lot.length, x: 0, y: -0.09, z: 0, mat: mats.ground, id: 'LOT-10X25', label: 'Terreno 10,00 × 25,00 m', category: 'Terreno' });

wallSegment('MURO-E', 'Muro lateral esquerdo', -CFG.lot.width / 2 + 0.06, 0, 0, 0.12, 1.5, CFG.lot.length, mats.darkWall);
wallSegment('MURO-D', 'Muro lateral direito', CFG.lot.width / 2 - 0.06, 0, 0, 0.12, 1.5, CFG.lot.length, mats.darkWall);
wallSegment('MURO-FUNDO', 'Muro de fundo', 0, 0, CFG.lot.length / 2 - 0.06, CFG.lot.width, 1.5, 0.12, mats.darkWall);
wallSegment('MURO-FR-ESQ', 'Muro frontal esquerdo', -3.55, 0, -CFG.lot.length / 2 + 0.06, 2.9, 1.5, 0.12, mats.darkWall);
wallSegment('MURO-FR-DIR', 'Muro frontal direito', 3.55, 0, -CFG.lot.length / 2 + 0.06, 2.9, 1.5, 0.12, mats.darkWall);

box({ w: 3.0, h: 0.03, d: 8.6, x: -1.65, y: 0.015, z: -8.2, mat: mats.path, id: 'ACESSO-CARRO', label: 'Entrada de veículo — 3,00 m', category: 'Circulação' });
labelSprite('ENTRADA', new THREE.Vector3(-1.65, 0.42, -11.6), 0.75);

// ============================================================
// CASA — envelope exato 6.058 x 7.076, girado no lote 10x25
// ============================================================
const HW = CFG.house.width;
const HD = CFG.house.depth;
const HZ = CFG.house.centerZ;
const socialY = CFG.levels.social;
const privateY = CFG.levels.private;

const px = HW / 2 - 0.20;
const pz = HD / 2 - 0.20;
for (const x of [-px, px]) for (const zOff of [-pz, pz]) {
  box({ w: 0.22, h: socialY, d: 0.22, x, y: socialY / 2, z: HZ + zOff, mat: mats.steel, id: `PILAR-${x<0?'E':'D'}-${zOff<0?'F':'T'}`, label: 'Pilar metálico conceitual', category: 'Estrutura', collide: true });
}
for (const x of [-px, px]) box({ w: 0.20, h: socialY, d: 0.20, x, y: socialY / 2, z: HZ, mat: mats.steel, id: `PILAR-M-${x<0?'E':'D'}`, label: 'Pilar intermediário', category: 'Estrutura', collide: true });

box({ w: HW + 0.25, h: 0.22, d: 0.20, x: 0, y: socialY - 0.11, z: HZ - pz, mat: mats.steel, id: 'VIGA-FRONTAL', label: 'Viga principal frontal', category: 'Estrutura' });
box({ w: HW + 0.25, h: 0.22, d: 0.20, x: 0, y: socialY - 0.11, z: HZ + pz, mat: mats.steel, id: 'VIGA-TRASEIRA', label: 'Viga principal traseira', category: 'Estrutura' });

box({ w: HW, h: 0.16, d: HD, x: 0, y: socialY - 0.08, z: HZ, mat: mats.floor, id: 'PISO-SOCIAL', label: 'Piso do pavimento social', category: 'Pavimento' });
box({ w: HW, h: 0.16, d: HD, x: 0, y: privateY - 0.08, z: HZ, mat: mats.floor, id: 'PISO-INTIMO', label: 'Piso do pavimento íntimo', category: 'Pavimento' });

function buildFloorShell(levelName, yBase, prefix) {
  const wh = 2.82;
  const t = CFG.wallThickness;
  wallSegment(`${prefix}-FR-E`, `${levelName} — parede frontal esquerda`, -1.92, yBase, HZ - HD/2 + t/2, 2.15, wh, t);
  wallSegment(`${prefix}-FR-D`, `${levelName} — parede frontal direita`, 1.92, yBase, HZ - HD/2 + t/2, 2.15, wh, t);
  wallSegment(`${prefix}-FR-TOP`, `${levelName} — verga frontal`, 0, yBase + 2.28, HZ - HD/2 + t/2, 1.68, 0.54, t);
  wallSegment(`${prefix}-LAT-E`, `${levelName} — fachada lateral esquerda`, -HW/2 + t/2, yBase, HZ, t, wh, HD);
  wallSegment(`${prefix}-LAT-D`, `${levelName} — fachada lateral direita`, HW/2 - t/2, yBase, HZ, t, wh, HD);
  wallSegment(`${prefix}-TR-E`, `${levelName} — parede traseira esquerda`, -2.10, yBase, HZ + HD/2 - t/2, 1.75, wh, t);
  wallSegment(`${prefix}-TR-D`, `${levelName} — parede traseira direita`, 2.10, yBase, HZ + HD/2 - t/2, 1.75, wh, t);
  wallSegment(`${prefix}-TR-TOP`, `${levelName} — verga traseira`, 0, yBase + 2.35, HZ + HD/2 - t/2, 2.45, 0.47, t);

  box({ w: 1.55, h: 2.22, d: 0.035, x: 0, y: yBase + 1.11, z: HZ - HD/2 + 0.08, mat: mats.glass, id: `${prefix}-VIDRO-FR`, label: `${levelName} — porta/vidro frontal`, category: 'Esquadria', collide: false });
  box({ w: 2.35, h: 2.28, d: 0.035, x: 0, y: yBase + 1.14, z: HZ + HD/2 - 0.08, mat: mats.glass, id: `${prefix}-VIDRO-TR`, label: `${levelName} — grande vidro para o jardim`, category: 'Esquadria', collide: false });
}

buildFloorShell('Pavimento social', socialY, 'SOC');
buildFloorShell('Pavimento íntimo', privateY, 'INT');

box({ w: HW + 0.75, h: 0.16, d: HD + 0.95, x: 0, y: 9.26, z: HZ, mat: mats.darkWall, id: 'COBERTURA', label: 'Cobertura independente ventilada', category: 'Cobertura' });
for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
  const panel = box({ w: 1.08, h: 0.06, d: 1.55, x: -1.8 + c*1.2, y: 9.39, z: HZ - 1.0 + r*1.7, mat: mats.solar, id: `FV-${r+1}-${c+1}`, label: `Painel fotovoltaico ${r+1}.${c+1}`, category: 'Energia' });
  panel.rotation.x = -0.08;
}

function balcony(z, id, label) {
  const depth = 1.15;
  box({ w: HW + 0.15, h: 0.12, d: depth, x: 0, y: privateY - 0.02, z, mat: mats.wood, id, label, category: 'Sacada' });
  for (const x of [-HW/2, 0, HW/2]) cylinder({ r: 0.025, h: 1.05, x, y: privateY + 0.52, z: z + (z < HZ ? -depth/2+0.05 : depth/2-0.05), mat: mats.steel });
  box({ w: HW, h: 0.05, d: 0.05, x:0, y:privateY+1.02, z: z + (z < HZ ? -depth/2+0.05 : depth/2-0.05), mat:mats.steel });
}
balcony(HZ - HD/2 - 0.575, 'SACADA-FRONTAL', 'Sacada frontal do pavimento íntimo');
balcony(HZ + HD/2 + 0.575, 'SACADA-TRASEIRA', 'Sacada traseira para o jardim');

// ============================================================
// TÉRREO FUNCIONAL
// ============================================================
box({ w: 2.8, h: 0.05, d: 5.2, x: -1.45, y: 0.025, z: HZ - 0.75, mat: mats.concrete, id: 'GARAGEM', label: 'Garagem sob pilotis', category: 'Térreo' });
box({ w: 2.50, h: 0.90, d: 0.70, x: 1.55, y: 0.45, z: HZ - 2.25, mat: mats.wood, id: 'BANCADA-OFICINA', label: 'Bancada da oficina', category: 'Oficina', collide: true });
box({ w: 2.65, h: 1.85, d: 0.10, x: 1.55, y: 0.93, z: HZ - 3.05, mat: mats.darkWall, id: 'PAINEL-OFICINA', label: 'Painel de ferramentas', category: 'Oficina', collide: true });
box({ w: 2.55, h: 0.92, d: 0.70, x: 1.55, y: 0.46, z: HZ + 2.25, mat: mats.wood, id: 'BANCADA-GOURMET', label: 'Bancada gourmet', category: 'Gourmet', collide: true });
box({ w: 0.82, h: 1.35, d: 0.72, x: 2.12, y: 0.675, z: HZ + 1.62, mat: mats.red, id: 'CHURRASQUEIRA', label: 'Churrasqueira / núcleo gourmet', category: 'Gourmet', collide: true });
box({ w: 0.72, h: 0.92, d: 0.72, x: -2.20, y: 0.46, z: HZ + 2.2, mat: mats.wall, id: 'LAVA-SECA', label: 'Lavanderia — lava/seca', category: 'Lavanderia', collide: true });
box({ w: 0.72, h: 0.86, d: 0.60, x: -1.38, y: 0.43, z: HZ + 2.2, mat: mats.concrete, id: 'TANQUE', label: 'Lavanderia — tanque', category: 'Lavanderia', collide: true });

// ============================================================
// INTERIORES — zoneamento inicial coerente com a planta V0.1
// ============================================================
wallSegment('SOC-WC-A', 'Banheiro social — divisória', 1.16, socialY, HZ - 2.55, 0.10, 2.65, 1.85);
wallSegment('SOC-WC-B', 'Banheiro social — parede', 2.05, socialY, HZ - 1.65, 1.85, 2.65, 0.10);
box({ w: 2.25, h: 0.90, d: 0.62, x: 1.65, y: socialY + 0.45, z: HZ + 1.92, mat: mats.wood, id: 'COZ-BANCADA', label: 'Cozinha — bancada principal', category: 'Cozinha', collide: true });
box({ w: 1.55, h: 0.90, d: 0.72, x: 0.95, y: socialY + 0.45, z: HZ + 0.15, mat: mats.wood, id: 'COZ-ILHA', label: 'Cozinha — ilha', category: 'Cozinha', collide: true });
box({ w: 2.25, h: 0.44, d: 0.92, x: -1.45, y: socialY + 0.22, z: HZ + 0.55, mat: mats.darkWall, id: 'SOFA', label: 'Sala — sofá', category: 'Sala', collide: true });
box({ w: 1.55, h: 0.75, d: 0.85, x: -0.15, y: socialY + 0.375, z: HZ - 0.85, mat: mats.wood, id: 'MESA-JANTAR', label: 'Jantar — mesa', category: 'Sala/Jantar', collide: true });

wallSegment('INT-WC-A', 'Banheiro superior — divisória', 1.16, privateY, HZ - 2.55, 0.10, 2.65, 1.85);
wallSegment('INT-WC-B', 'Banheiro superior — parede', 2.05, privateY, HZ - 1.65, 1.85, 2.65, 0.10);
wallSegment('INT-CH-FILHOS', 'Quarto dos filhos — divisória', -1.0, privateY, HZ + 0.65, 0.10, 2.65, 5.35);
wallSegment('INT-CASAL', 'Quarto casal — divisória', 1.08, privateY, HZ + 1.12, 0.10, 2.65, 4.05);

for (let i = 0; i < 3; i++) box({ w: 0.88, h: 0.38, d: 1.88, x: -2.0 + (i%2)*0.92, y: privateY + 0.19 + (i===2?0.92:0), z: HZ + 1.8, mat: mats.wall, id: `CAMA-FILHO-${i+1}`, label: `Cama / módulo filho ${i+1}`, category: 'Quarto dos filhos', collide: true });
box({ w: 1.55, h: 0.42, d: 1.98, x: 2.0, y: privateY + 0.21, z: HZ + 1.55, mat: mats.wall, id: 'CAMA-CASAL', label: 'Cama do casal', category: 'Quarto do casal', collide: true });
box({ w: 1.85, h: 0.76, d: 0.58, x: 0.0, y: privateY + 0.38, z: HZ - 0.30, mat: mats.wood, id: 'MESA-GAMER', label: 'Escritório/Gamer — bancada', category: 'Escritório/Gamer', collide: true });
box({ w: 1.50, h: 0.50, d: 0.72, x: 2.05, y: privateY + 0.25, z: HZ - 2.15, mat: mats.wall, id: 'BANHEIRA', label: 'Banheira compacta — carga estrutural a dimensionar', category: 'Banheiro superior', collide: true });

// ============================================================
// SISTEMAS PRODUTIVOS / PAISAGISMO
// ============================================================
function addTree(x, z, idx, scale = 1) {
  const trunk = cylinder({ r: 0.10*scale, h: 1.35*scale, x, y: 0.675*scale, z, mat: mats.wood, id: `ARVORE-${idx}`, label: `Árvore frutífera perimetral ${idx}`, category: 'Pomar' });
  const crown = new THREE.Mesh(new THREE.SphereGeometry(0.62*scale, 14, 10), idx%2?mats.leaf:mats.leaf2);
  crown.position.set(x, 1.55*scale, z);
  crown.castShadow = true;
  scene.add(crown);
  crown.userData.parentSelectable = trunk;
  interactables.push(crown);
}
let treeId = 1;
for (const z of [-10.0,-7.4,-4.8,-2.0,0.8,3.5,6.2,9.0,11.2]) {
  if (Math.abs(z - HZ) < 4.2) continue;
  addTree(-4.25, z, treeId++, 0.92);
  addTree(4.25, z, treeId++, 0.92);
}
addTree(-4.15, 11.2, treeId++, 1.05);
addTree(0, 11.15, treeId++, 1.08);
addTree(4.15, 11.2, treeId++, 1.05);

for (let i=0;i<4;i++) {
  box({ w: 1.25, h: 0.28, d: 3.15, x: -2.35 + i*1.55, y: 0.14, z: 5.7, mat: mats.soil, id: `CANTEIRO-${i+1}`, label: `Canteiro produtivo ${i+1}`, category: 'Horta horizontal' });
  for (let r=0;r<4;r++) for(let c=0;c<2;c++) {
    const plant = new THREE.Mesh(new THREE.SphereGeometry(0.10, 8, 6), mats.leaf2);
    plant.position.set(-2.35+i*1.55 + (c?0.26:-0.26), 0.37, 4.65+r*0.65);
    scene.add(plant);
  }
}
labelSprite('HORTA', new THREE.Vector3(0, 0.95, 4.2), 0.7);

box({ w: 0.16, h: 2.25, d: 2.9, x: 4.0, y: 1.125, z: 1.45, mat: mats.wood, id: 'HORTA-VERTICAL', label: 'Horta vertical', category: 'Horta vertical', collide: true });
for (let yy=0.45; yy<2.1; yy+=0.42) for(let zz=0.35; zz<2.65; zz+=0.55) {
  const p = new THREE.Mesh(new THREE.SphereGeometry(0.11,8,6), mats.leaf2);
  p.position.set(3.88, yy, 0.1+zz);
  scene.add(p);
}

const greenhouse = new THREE.Group();
greenhouse.position.set(-2.9, 0, 9.0);
scene.add(greenhouse);
const ghBase = new THREE.Mesh(new THREE.BoxGeometry(2.4,0.08,2.6), mats.concrete); ghBase.position.y=0.04; greenhouse.add(ghBase);
for (const x of [-1.15,1.15]) for(const z of [-1.25,1.25]) { const p=new THREE.Mesh(new THREE.BoxGeometry(.06,2.0,.06),mats.steel);p.position.set(x,1.0,z);greenhouse.add(p); }
const ghRoof = new THREE.Mesh(new THREE.BoxGeometry(2.45,0.05,2.65), mats.glass); ghRoof.position.y=2.02; greenhouse.add(ghRoof);
const ghSide1=new THREE.Mesh(new THREE.BoxGeometry(.04,1.95,2.5),mats.glass);ghSide1.position.set(-1.18,1.0,0);greenhouse.add(ghSide1);
const ghSide2=ghSide1.clone();ghSide2.position.x=1.18;greenhouse.add(ghSide2);
greenhouse.userData={id:'ESTUFA',label:'Estufa produtiva',category:'Estufa',selectable:true}; interactables.push(greenhouse); selectableRoots.add(greenhouse);

box({ w: 2.35, h: 1.75, d: 2.55, x: 2.75, y: 0.875, z: 9.0, mat: new THREE.MeshStandardMaterial({color:0x6a5036,wireframe:true}), id: 'AVIARIO', label: 'Aviário / galinheiro', category: 'Criação', collide: true });
box({ w: 1.45, h: 0.78, d: 1.25, x: 2.75, y: 0.39, z: 9.3, mat: mats.wood, id: 'GALINHEIRO-ABRIGO', label: 'Abrigo das galinhas', category: 'Criação', collide: true });

for(let i=0;i<3;i++) box({ w:0.82,h:0.75,d:0.82,x:1.65+i*0.9,y:0.375,z:11.3,mat:mats.wood,id:`COMPOST-${i+1}`,label:`Composteira — baia ${i+1}`,category:'Compostagem',collide:true });

const pond1 = new THREE.Mesh(new THREE.CapsuleGeometry(1.55, 2.1, 12, 24), mats.water);
pond1.rotation.x = Math.PI/2; pond1.scale.set(1.35,1,0.06); pond1.position.set(-1.25,0.055,1.8); scene.add(pond1);
tag(pond1,'LAGO-NATURAL','Lago natural de banho — sistema separado','Água/Lazer');

const pond2 = new THREE.Mesh(new THREE.CylinderGeometry(1.18,1.18,0.10,40), mats.water);
pond2.position.set(2.55,0.05,3.15); scene.add(pond2);
tag(pond2,'LAGO-PEIXES','Tanque/lago de piscicultura','Piscicultura');

box({ w: 1.25, h: 0.10, d: 1.25, x: -3.9, y: 0.05, z: 8.0, mat: mats.concrete, id: 'CISTERNA', label: 'Acesso à cisterna de chuva (reservatório enterrado)', category: 'Reuso de água' });
box({ w:1.45,h:1.45,d:0.72,x:-4.0,y:0.725,z:5.0,mat:mats.darkWall,id:'CENTRAL-REUSO',label:'Central técnica — chuva / águas cinzas / irrigação',category:'Reuso de água',collide:true });

labelSprite('CASA', new THREE.Vector3(0, 2.0, HZ-HD/2-0.75), 0.65);
labelSprite('POMAR / HORTA', new THREE.Vector3(0, 1.3, 7.9), 0.65);

// ============================================================
// PLAYER / MOVIMENTO FPS
// ============================================================
const keys = new Set();
let velocityY = 0;
let onGround = true;
let currentBaseY = 0;
const clock = new THREE.Clock();

addEventListener('keydown', (e) => {
  keys.add(e.code);
  if (e.code === 'Digit1') teleportLevel(0, -10.8);
  if (e.code === 'Digit2') teleportLevel(socialY, HZ - 1.0);
  if (e.code === 'Digit3') teleportLevel(privateY, HZ - 1.0);
  if (e.code === 'Space' && onGround && controls.isLocked) {
    velocityY = 5.0;
    onGround = false;
  }
});
addEventListener('keyup', (e) => keys.delete(e.code));

function teleportLevel(baseY, z) {
  camera.position.set(0, baseY + CFG.eyeHeight, z);
  currentBaseY = baseY;
  velocityY = 0; onGround = true;
  toast(baseY === 0 ? 'Térreo / terreno' : baseY === socialY ? 'Pavimento social' : 'Pavimento íntimo');
}

function collidesAt(pos) {
  const r = 0.27;
  const feet = pos.y - CFG.eyeHeight;
  const head = pos.y + 0.12;
  for (const c of collisionBoxes) {
    c.box.setFromObject(c.mesh);
    if (feet > c.box.max.y || head < c.box.min.y) continue;
    if (pos.x + r > c.box.min.x && pos.x - r < c.box.max.x && pos.z + r > c.box.min.z && pos.z - r < c.box.max.z) return true;
  }
  return false;
}

function enforceLotBounds(pos) {
  const pad = 0.28;
  pos.x = THREE.MathUtils.clamp(pos.x, -CFG.lot.width/2 + pad, CFG.lot.width/2 - pad);
  pos.z = THREE.MathUtils.clamp(pos.z, -CFG.lot.length/2 + pad, CFG.lot.length/2 - pad);
}

function updatePlayer(dt) {
  if (!controls.isLocked) return;
  const speed = (keys.has('ShiftLeft') || keys.has('ShiftRight')) ? 5.1 : 2.7;
  let f = 0, s = 0;
  if (keys.has('KeyW')) f += 1;
  if (keys.has('KeyS')) f -= 1;
  if (keys.has('KeyD')) s += 1;
  if (keys.has('KeyA')) s -= 1;
  const len = Math.hypot(f,s) || 1; f/=len; s/=len;

  const old = camera.position.clone();
  if (f) controls.moveForward(f * speed * dt);
  if (s) controls.moveRight(s * speed * dt);
  enforceLotBounds(camera.position);
  if (collidesAt(camera.position)) {
    camera.position.x = old.x;
    if (collidesAt(camera.position)) camera.position.z = old.z;
  }

  if (!onGround) {
    velocityY -= 12.5 * dt;
    camera.position.y += velocityY * dt;
    const floorY = currentBaseY + CFG.eyeHeight;
    if (camera.position.y <= floorY) { camera.position.y = floorY; velocityY = 0; onGround = true; }
  } else {
    camera.position.y = currentBaseY + CFG.eyeHeight;
  }
}

// ============================================================
// SELEÇÃO + FEEDBACK
// ============================================================
function rootSelectable(obj) {
  let p = obj;
  while (p) {
    if (p.userData?.selectable) return p;
    if (p.userData?.parentSelectable) return p.userData.parentSelectable;
    p = p.parent;
  }
  return null;
}

function raycastCenter() {
  raycaster.setFromCamera(centerNdc, camera);
  raycaster.far = 8.5;
  const hits = raycaster.intersectObjects(interactables, true);
  for (const h of hits) {
    const root = rootSelectable(h.object);
    if (root) return { root, hit: h };
  }
  return null;
}

function setHover(res) {
  const root = res?.root || null;
  if (hovered === root) return;
  hovered = root;
  if (!root) { selectedLabel.style.opacity = 0; return; }
  selectedLabel.textContent = `${root.userData.category} • ${root.userData.label}`;
  selectedLabel.style.opacity = 1;
}

function flashSelection(root) {
  if (prevHighlight?.material?.emissive) prevHighlight.material.emissive.setHex(prevHighlight.userData.__oldEmissive || 0x000000);
  prevHighlight = root.isMesh ? root : root.children.find(c => c.isMesh && c.material?.emissive);
  if (prevHighlight?.material?.emissive) {
    prevHighlight.userData.__oldEmissive = prevHighlight.material.emissive.getHex();
    prevHighlight.material.emissive.setHex(0x234c2d);
  }
}

addEventListener('mousedown', (e) => {
  if (e.button !== 0 || !controls.isLocked) return;
  const res = raycastCenter();
  if (!res) return;
  selected = res;
  flashSelection(res.root);
  openFeedback(res);
});

function openFeedback(res) {
  const data = res.root.userData;
  const p = res.hit.point;
  feedbackTitle.textContent = `${data.category}: ${data.label}`;
  feedbackMeta.textContent = [
    `ID: ${data.id}`,
    `Ponto clicado: x=${p.x.toFixed(2)}m, y=${p.y.toFixed(2)}m, z=${p.z.toFixed(2)}m`,
    `Câmera: x=${camera.position.x.toFixed(2)}m, y=${camera.position.y.toFixed(2)}m, z=${camera.position.z.toFixed(2)}m`,
    `Terreno: ${CFG.lot.width.toFixed(2)} × ${CFG.lot.length.toFixed(2)} m`,
    `Casa: ${CFG.house.width.toFixed(3)} × ${CFG.house.depth.toFixed(3)} m`,
    `Versão: tour-3d-v0.1`
  ].join('\n');
  feedbackText.value = '';
  feedback.style.display = 'grid';
  controls.unlock();
  start.style.display = 'none';
  setTimeout(() => feedbackText.focus(), 50);
}

cancelFeedback.addEventListener('click', () => {
  feedback.style.display = 'none';
  controls.lock();
});

sendFeedback.addEventListener('click', () => {
  if (!selected) return;
  const txt = feedbackText.value.trim();
  if (!txt) { toast('Escreva o feedback primeiro.'); return; }
  const u = selected.root.userData;
  const p = selected.hit.point;
  const title = `[3D][${u.id}] ${txt.slice(0, 72)}`;
  const body = [
    `## Feedback no tour 3D`,
    ``,
    `**Elemento:** ${u.label}`,
    `**ID:** \`${u.id}\``,
    `**Categoria:** ${u.category}`,
    ``,
    `### Pedido`,
    txt,
    ``,
    `### Contexto automático`,
    `- Ponto clicado: x=${p.x.toFixed(3)}m, y=${p.y.toFixed(3)}m, z=${p.z.toFixed(3)}m`,
    `- Câmera: x=${camera.position.x.toFixed(3)}m, y=${camera.position.y.toFixed(3)}m, z=${camera.position.z.toFixed(3)}m`,
    `- Terreno: 10.000 × 25.000 m`,
    `- Envelope da casa: 6.058 × 7.076 m`,
    `- Versão: tour-3d-v0.1`,
    ``,
    `> Gerado pelo sistema de feedback in-world da Casa Contreras.`
  ].join('\n');
  const url = `https://github.com/Leetattoo/casa-container/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  const queue = JSON.parse(localStorage.getItem('casaContrerasFeedbackDrafts') || '[]');
  queue.push({ id:u.id, label:u.label, category:u.category, text:txt, point:{x:p.x,y:p.y,z:p.z}, createdAt:new Date().toISOString() });
  localStorage.setItem('casaContrerasFeedbackDrafts', JSON.stringify(queue));
  feedback.style.display = 'none';
  controls.lock();
  toast('GitHub aberto com o feedback preenchido.');
});

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.style.opacity = 1;
  toastEl.style.transform = 'translateY(0)';
  clearTimeout(toastEl.__t);
  toastEl.__t = setTimeout(() => { toastEl.style.opacity = 0; toastEl.style.transform = 'translateY(8px)'; }, 2200);
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  updatePlayer(dt);
  if (controls.isLocked) setHover(raycastCenter());
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

console.info('Casa Contreras 3D carregada', CFG);
