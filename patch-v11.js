import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const scene = window.__CASA_SCENE__;
const camera = window.__CASA_CAMERA__;
const renderer = window.__CASA_RENDERER__;
if (!scene || !camera || !renderer) throw new Error('Casa Contreras v1.1: cena base indisponivel');

const HOUSE = Object.freeze({ w: 7.076, d: 6.058, centerZ: 0.700, wall: 0.120 });
const LEVEL = Object.freeze({ ground: 0, social: 3.250, private: 6.250 });
const PLAYER = Object.freeze({ eye: 1.660, height: 1.750 });
const halfW = HOUSE.w / 2;
const halfD = HOUSE.d / 2;
const houseFront = HOUSE.centerZ - halfD;
const houseBack = HOUSE.centerZ + halfD;
const inner = Object.freeze({ west: -halfW + HOUSE.wall, east: halfW - HOUSE.wall, front: houseFront + HOUSE.wall, back: houseBack - HOUSE.wall });

function byId(id) { let hit = null; scene.traverse(o => { if (!hit && o.userData?.id === id) hit = o; }); return hit; }
function removeId(id) { const o = byId(id); if (o?.parent) o.parent.remove(o); return o; }
function removeWhere(fn) { const doomed = []; scene.traverse(o => { if (o !== scene && fn(o)) doomed.push(o); }); doomed.forEach(o => o.parent?.remove(o)); return doomed.length; }
function tag(o, id, label, category = 'Elemento', extra = {}) { o.userData = { ...o.userData, id, label, category, selectable: true, ...extra }; return o; }

const MAT = {
  steel: new THREE.MeshStandardMaterial({ color: 0x111817, roughness: 0.38, metalness: 0.72 }),
  steel2: new THREE.MeshStandardMaterial({ color: 0x28312e, roughness: 0.44, metalness: 0.60 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x8a542f, roughness: 0.68 }),
  wood2: new THREE.MeshStandardMaterial({ color: 0xb87942, roughness: 0.64 }),
  wall: new THREE.MeshStandardMaterial({ color: 0xe7e0d3, roughness: 0.90 }),
  white: new THREE.MeshStandardMaterial({ color: 0xf1eee7, roughness: 0.88 }),
  fabric: new THREE.MeshStandardMaterial({ color: 0x6d746f, roughness: 0.98 }),
  fabric2: new THREE.MeshStandardMaterial({ color: 0x9a9387, roughness: 0.98 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x181d1c, roughness: 0.58 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x9fbfc0, transparent: true, opacity: 0.28, roughness: 0.12, depthWrite: false, side: THREE.DoubleSide }),
  stone: new THREE.MeshStandardMaterial({ color: 0x777a72, roughness: 0.94 }),
  paver: new THREE.MeshStandardMaterial({ color: 0x9b927f, roughness: 0.95 }),
  soil: new THREE.MeshLambertMaterial({ color: 0x4c3422 }),
  leaf: new THREE.MeshLambertMaterial({ color: 0x315f36 }),
  leaf2: new THREE.MeshLambertMaterial({ color: 0x4a7946 }),
  water: new THREE.MeshStandardMaterial({ color: 0x2b7e86, transparent: true, opacity: 0.78, roughness: 0.18 }),
  glow: new THREE.MeshBasicMaterial({ color: 0xffbf73 }),
};
const BOX = new THREE.BoxGeometry(1, 1, 1);
const RBOX = new RoundedBoxGeometry(1, 1, 1, 2, 0.08);
const CYL = new THREE.CylinderGeometry(1, 1, 1, 14);

function box({ w, h, d, x = 0, y = h / 2, z = 0, mat = MAT.wall, parent = scene, rounded = false, id, label, category, extra }) {
  const m = new THREE.Mesh(rounded ? RBOX : BOX, mat);
  m.scale.set(w, h, d); m.position.set(x, y, z); m.castShadow = false; m.receiveShadow = false; parent.add(m);
  if (id) tag(m, id, label || id, category || 'Elemento', extra);
  return m;
}
function cyl({ r = 0.1, h = 1, x = 0, y = h / 2, z = 0, mat = MAT.steel, parent = scene }) {
  const m = new THREE.Mesh(CYL, mat); m.scale.set(r, h, r); m.position.set(x, y, z); m.castShadow = false; m.receiveShadow = false; parent.add(m); return m;
}
function group(id, label, category, pos = [0, 0, 0], extra = {}) { const g = new THREE.Group(); g.position.set(...pos); scene.add(g); return tag(g, id, label, category, extra); }

// 1. Implantacao: redistribui a frente e cria um caminho real ate os fundos.
removeId('CAMINHO-PEDESTRE');
const natural = byId('LAGO-NATURAL'); if (natural) { natural.position.set(-2.78, 0, -7.10); natural.scale.set(0.92, 1, 0.88); natural.updateMatrixWorld(true); }
const fish = byId('LAGO-PEIXES'); if (fish) { fish.position.set(2.72, 0, -4.88); fish.scale.set(0.95, 1, 1.02); fish.updateMatrixWorld(true); }
const deck = byId('DECK-LAGO'); if (deck) { deck.position.set(-1.28, 0.12, -6.58); deck.scale.set(1.12, 1, 0.92); deck.updateMatrixWorld(true); }
const pass = byId('PASSARELA-LAGO'); if (pass) { pass.position.set(-1.15, 0.10, -5.58); pass.scale.set(0.95, 1, 0.86); pass.updateMatrixWorld(true); }
const f1 = byId('FILTRO-BIO-1'); if (f1) f1.position.set(3.58, 0.29, -5.82);
const f2 = byId('FILTRO-BIO-2'); if (f2) f2.position.set(3.58, 0.29, -6.42);
const cis = byId('CISTERNA'); if (cis) cis.position.set(-3.95, 0.34, -10.85);

for (let i = 0; i < 3; i++) {
  const g = group(`HORTA-FRENTE-${i + 1}`, `Canteiro frontal ${i + 1}`, 'Horta frontal', [0.62, 0, -5.75 + i * 1.05]);
  box({ w: 1.18, h: 0.24, d: 0.74, y: 0.12, mat: MAT.wood, parent: g, rounded: true });
  box({ w: 1.04, h: 0.10, d: 0.60, y: 0.29, mat: MAT.soil, parent: g, rounded: true });
  for (let j = 0; j < 5; j++) cyl({ r: 0.045, h: 0.22 + (j % 2) * 0.06, x: -0.40 + j * 0.20, y: 0.43, z: 0, mat: j % 2 ? MAT.leaf2 : MAT.leaf, parent: g });
}

const pathPts = [
  [-2.48,-11.80],[-2.05,-11.20],[-1.60,-10.55],[-1.14,-9.88],[-0.72,-9.18],[-0.42,-8.44],[-0.24,-7.68],[-0.16,-6.92],[-0.12,-6.14],[-0.10,-5.36],[-0.05,-4.58],[0.10,-3.80],[0.42,-3.08],[0.82,-2.38],[1.02,-1.60],[1.02,-0.82],[1.02,-0.04],[1.02,0.74],[1.02,1.52],[1.02,2.30],[1.02,3.08],[1.20,3.86],[1.62,4.48],[2.15,5.02],[2.72,5.52],[3.18,6.14],[3.55,6.86],[3.72,7.64],[3.76,8.46],[3.76,9.30],[3.76,10.18],[3.70,11.02]
];
const pathGroup = group('CAMINHO-CONTINUO-V11', 'Caminho continuo frente-fundos', 'Circulacao', [0,0,0], { continuousToRear: true });
pathPts.forEach(([x,z],i) => {
  const s = box({ w: 0.48, h: 0.045, d: 0.62, x, y: 0.028, z, mat: MAT.paver, parent: pathGroup, rounded: true });
  s.rotation.y = (i % 3 - 1) * 0.055;
});

const gh = byId('ESTUFA'); if (gh) gh.position.set(-3.35, 0, 9.55);
const av = byId('AVIARIO'); if (av) av.position.set(0.10, 0, 10.05);
const tools = byId('DEP-FERR'); if (tools) tools.position.set(3.48, 1.00, 10.20);
for (let i = 1; i <= 3; i++) { const c = byId(`COMPOST-${i}`); if (c) c.position.set(-3.75 + (i - 1) * 0.78, 0.34, 6.25); }
for (let i = 1; i <= 5; i++) { const v = byId(`HORTA-V-${i}`); if (v) v.position.set(4.12, 0.48 + (i - 1) * 0.36, 6.65); }
const filterGarden = byId('JARDIM-FILTRANTE'); if (filterGarden) filterGarden.position.set(3.00, 0.08, 7.25);

// 2. Escadas externas reais: dois lances empilhados + decks laterais. Nao consomem area de moradia.
removeId('ESC-G-S'); removeId('ESC-S-I');
const stairX = 4.10, stairW = 0.88, stairZ0 = 1.30, stairZ1 = -3.38, stairRun = stairZ0 - stairZ1;
function makeStair(id, label, baseY, rise) {
  const g = group(id, label, 'Escada', [0,0,0], { walkable: true, externalToLivingEnvelope: true, width: stairW, rise, run: stairRun });
  const steps = 19;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1), z = stairZ0 + (stairZ1 - stairZ0) * t, y = baseY + rise * t;
    box({ w: stairW, h: 0.075, d: 0.34, x: stairX, y: y + 0.037, z, mat: MAT.wood2, parent: g, rounded: true });
    if (i % 2 === 0) box({ w: 0.035, h: 0.72, d: 0.035, x: stairX + stairW/2 - 0.025, y: y + 0.39, z, mat: MAT.steel, parent: g });
  }
  box({ w: 0.04, h: 0.04, d: stairRun + 0.30, x: stairX + stairW/2, y: baseY + rise/2 + 0.76, z: (stairZ0 + stairZ1)/2, mat: MAT.steel, parent: g });
  return g;
}
makeStair('ESCADA-GROUND-SOCIAL-V11', 'Escada terreo -> social', LEVEL.ground, LEVEL.social - LEVEL.ground);
makeStair('ESCADA-SOCIAL-PRIVATE-V11', 'Escada social -> intimo', LEVEL.social, LEVEL.private - LEVEL.social);
function sideDeck(id, y) {
  const g = group(id, 'Deck lateral de circulacao', 'Sacada/Circulacao', [0,0,0], { externalToLivingEnvelope: true });
  box({ w: 1.30, h: 0.11, d: 5.25, x: 4.18, y: y - 0.055, z: -1.02, mat: MAT.wood2, parent: g });
  box({ w: 0.04, h: 0.04, d: 5.25, x: 4.78, y: y + 1.02, z: -1.02, mat: MAT.steel, parent: g });
  for (let z = -3.45; z <= 1.45; z += 0.55) box({ w: 0.035, h: 0.95, d: 0.035, x: 4.78, y: y + 0.48, z, mat: MAT.steel, parent: g });
  return g;
}
sideDeck('DECK-LATERAL-SOCIAL-V11', LEVEL.social);
sideDeck('DECK-LATERAL-INTIMO-V11', LEVEL.private);

let floorState = 0, stairMode = null;
addEventListener('keydown', e => { if (e.code === 'Digit1') floorState = 0; if (e.code === 'Digit2') floorState = 1; if (e.code === 'Digit3') floorState = 2; });
function syncFloor(level, x, y, z) {
  const ev = new KeyboardEvent('keydown', { code: level === 0 ? 'Digit1' : level === 1 ? 'Digit2' : 'Digit3', bubbles: true });
  window.dispatchEvent(ev);
  floorState = level;
  camera.position.set(x, y, z);
  stairMode = null;
}
function stairProgress(z) { return THREE.MathUtils.clamp((stairZ0 - z) / stairRun, 0, 1); }
function onStairXZ() { return camera.position.x > stairX - stairW/2 - 0.10 && camera.position.x < stairX + stairW/2 + 0.10 && camera.position.z < stairZ0 + 0.20 && camera.position.z > stairZ1 - 0.20; }
function stairNav() {
  requestAnimationFrame(stairNav);
  if (!onStairXZ()) { stairMode = null; return; }
  const z = camera.position.z;
  if (!stairMode) {
    if (floorState === 0) stairMode = 'lower';
    else if (floorState === 2) stairMode = 'upper';
    else if (floorState === 1 && z < -2.70) stairMode = 'lower';
    else if (floorState === 1 && z > 0.62) stairMode = 'upper';
    else return;
  }
  const t = stairProgress(z);
  if (stairMode === 'lower') {
    camera.position.y = PLAYER.eye + LEVEL.social * t;
    if (floorState === 0 && t > 0.985) syncFloor(1, stairX, LEVEL.social + PLAYER.eye, stairZ1 - 0.02);
    else if (floorState === 1 && t < 0.015) syncFloor(0, stairX, PLAYER.eye, stairZ0 + 0.02);
  } else {
    camera.position.y = LEVEL.social + PLAYER.eye + (LEVEL.private - LEVEL.social) * t;
    if (floorState === 1 && t > 0.985) syncFloor(2, stairX, LEVEL.private + PLAYER.eye, stairZ1 - 0.02);
    else if (floorState === 2 && t < 0.015) syncFloor(1, stairX, LEVEL.social + PLAYER.eye, stairZ0 + 0.02);
  }
}
stairNav();

// 3. Mobiliario detalhado.
function removeByLabel(labels) { const set = new Set(labels); return removeWhere(o => set.has(o.userData?.label)); }
function chair(id, label, x, y, z, rot = 0, mat = MAT.wood) {
  const g = group(id, label, 'Mobiliario', [x,y,z]); g.rotation.y = rot;
  box({ w: 0.44, h: 0.09, d: 0.44, y: 0.47, mat, parent: g, rounded: true });
  box({ w: 0.44, h: 0.50, d: 0.08, y: 0.78, z: 0.18, mat, parent: g, rounded: true });
  for (const xx of [-0.17,0.17]) for (const zz of [-0.17,0.17]) box({ w: 0.045, h: 0.43, d: 0.045, x: xx, y: 0.215, z: zz, mat: MAT.steel, parent: g });
  return g;
}
function diningTable(id, label, x, y, z) {
  const g = group(id, label, 'Mobiliario', [x,y,z]);
  box({ w: 1.70, h: 0.10, d: 0.88, y: 0.74, mat: MAT.wood2, parent: g, rounded: true });
  for (const xx of [-0.68,0.68]) for (const zz of [-0.30,0.30]) box({ w: 0.07, h: 0.70, d: 0.07, x: xx, y: 0.35, z: zz, mat: MAT.steel, parent: g });
  return g;
}
function sofa() {
  removeId('SOFA');
  const g = group('SOFA', 'Sofa 3 lugares', 'Sala', [1.28, LEVEL.social, -0.62]);
  box({ w: 2.12, h: 0.36, d: 0.82, y: 0.31, mat: MAT.fabric, parent: g, rounded: true });
  box({ w: 2.02, h: 0.62, d: 0.20, y: 0.77, z: 0.31, mat: MAT.fabric, parent: g, rounded: true });
  box({ w: 0.18, h: 0.55, d: 0.78, x: -1.00, y: 0.52, mat: MAT.fabric, parent: g, rounded: true });
  box({ w: 0.18, h: 0.55, d: 0.78, x: 1.00, y: 0.52, mat: MAT.fabric, parent: g, rounded: true });
  for (const x of [-0.68,0,0.68]) box({ w: 0.62, h: 0.15, d: 0.62, x, y: 0.55, z: -0.04, mat: MAT.fabric2, parent: g, rounded: true });
}
sofa();
removeId('MESA-CENTRO'); const coffee = group('MESA-CENTRO','Mesa de centro','Sala',[0.30,LEVEL.social,-1.62]);
box({w:1.05,h:0.10,d:0.58,y:0.32,mat:MAT.wood2,parent:coffee,rounded:true}); for(const x of [-.42,.42]) for(const z of [-.20,.20]) box({w:.045,h:.28,d:.045,x,y:.14,z,mat:MAT.steel,parent:coffee});
removeId('MESA-JANTAR'); removeByLabel(['Cadeira de jantar']); diningTable('MESA-JANTAR','Mesa de jantar',-1.62,LEVEL.social,-1.08);
for (let i=0;i<3;i++){ chair(`CAD-JANTAR-A-${i}`,'Cadeira de jantar',-2.20+i*.58,LEVEL.social,-1.72,0,MAT.wood); chair(`CAD-JANTAR-B-${i}`,'Cadeira de jantar',-2.20+i*.58,LEVEL.social,-0.46,Math.PI,MAT.wood); }

for (const id of ['COZ-BANCADA','COZ-ILHA','COZ-GELADEIRA','COZ-FOGAO']) removeId(id);
const kitchen = group('COZINHA-REALISTA-V11','Cozinha integrada','Cozinha',[0,0,0]);
box({w:2.82,h:.84,d:.62,x:-1.92,y:LEVEL.social+.42,z:3.16,mat:MAT.wood,parent:kitchen,rounded:true});
box({w:2.90,h:.055,d:.68,x:-1.92,y:LEVEL.social+.865,z:3.15,mat:MAT.dark,parent:kitchen,rounded:true});
for(let i=0;i<4;i++){box({w:.60,h:.66,d:.025,x:-2.82+i*.62,y:LEVEL.social+.46,z:2.835,mat:MAT.wood2,parent:kitchen,rounded:true});box({w:.20,h:.018,d:.018,x:-2.82+i*.62,y:LEVEL.social+.48,z:2.815,mat:MAT.steel,parent:kitchen});}
box({w:.76,h:1.86,d:.70,x:-3.02,y:LEVEL.social+.93,z:2.42,mat:MAT.steel2,parent:kitchen,rounded:true});
box({w:.018,h:.64,d:.018,x:-3.02,y:LEVEL.social+1.02,z:2.055,mat:MAT.steel,parent:kitchen});
const island=group('COZ-ILHA','Ilha da cozinha','Cozinha',[-1.30,LEVEL.social,1.36]); box({w:2.05,h:.82,d:.78,y:.41,mat:MAT.wood,parent:island,rounded:true}); box({w:2.16,h:.06,d:.88,y:.85,mat:MAT.dark,parent:island,rounded:true});

for(const id of ['CAMA-CASAL','COLCHAO-CASAL','CRIADO-CASAL']) removeId(id);
const masterBed = group('CAMA-CASAL','Cama casal queen','Quarto casal',[-2.18,LEVEL.private,-0.95]);
box({w:1.66,h:.20,d:2.06,y:.18,mat:MAT.wood2,parent:masterBed,rounded:true}); box({w:1.56,h:.20,d:1.96,y:.38,mat:MAT.white,parent:masterBed,rounded:true}); box({w:1.66,h:1.05,d:.12,y:.80,z:.97,mat:MAT.wood,parent:masterBed,rounded:true});
for(const x of [-.42,.42]) box({w:.64,h:.12,d:.38,x,y:.55,z:.63,mat:MAT.white,parent:masterBed,rounded:true});
const bedside=group('CRIADO-CASAL','Criado-mudo','Quarto casal',[-3.10,LEVEL.private,-.98]); box({w:.42,h:.44,d:.38,y:.22,mat:MAT.wood,parent:bedside,rounded:true}); box({w:.22,h:.018,d:.018,y:.30,z:-.20,mat:MAT.steel,parent:bedside});

removeId('MESA-GOURMET'); removeByLabel(['Cadeira gourmet']); diningTable('MESA-GOURMET','Mesa gourmet',-1.45,0,0.08);
for(let i=0;i<3;i++){chair(`CADEIRA-GOURMET-A-${i}`,'Cadeira gourmet',-2.05+i*.62,0,-.62,0,MAT.wood);chair(`CADEIRA-GOURMET-B-${i}`,'Cadeira gourmet',-2.05+i*.62,0,.72,Math.PI,MAT.wood);}

// 4. Fachada e paisagismo com instancing para manter desempenho.
const ribGeo = new THREE.BoxGeometry(0.028, 2.58, 0.055); const ribCount = 44; const ribs = new THREE.InstancedMesh(ribGeo, MAT.steel2, ribCount); const dummy = new THREE.Object3D(); let ri=0;
for(const yBase of [LEVEL.social,LEVEL.private]) for(const side of [-1,1]) for(let j=0;j<11;j++){ const z=houseFront+.34+j*.52; dummy.position.set(side*(halfW+.012),yBase+1.40,z); dummy.updateMatrix(); ribs.setMatrixAt(ri++,dummy.matrix); } scene.add(ribs);
for(const y of [LEVEL.social-.03,LEVEL.private-.03]) for(let x=-2.8;x<=2.8;x+=1.4) box({w:.46,h:.025,d:.05,x,y,z:houseFront-.10,mat:MAT.glow});
const shrubGeo=new THREE.SphereGeometry(1,7,5), shrubN=48, shrubs=new THREE.InstancedMesh(shrubGeo,MAT.leaf2,shrubN); let si=0;
for(let i=0;i<18;i++){const a=i/18*Math.PI*2;dummy.position.set(-2.78+Math.cos(a)*1.55,.24,-7.10+Math.sin(a)*1.92);dummy.scale.set(.18,.24,.18);dummy.updateMatrix();shrubs.setMatrixAt(si++,dummy.matrix);}
for(let i=0;i<12;i++){const a=i/12*Math.PI*2;dummy.position.set(2.72+Math.cos(a)*.92,.22,-4.88+Math.sin(a)*1.36);dummy.scale.set(.16,.22,.16);dummy.updateMatrix();shrubs.setMatrixAt(si++,dummy.matrix);}
while(si<shrubN){const x=-4.25+(si%6)*1.55,z=5.2+Math.floor((si-30)/6)*1.55;dummy.position.set(x,.20,z);dummy.scale.set(.16,.21,.16);dummy.updateMatrix();shrubs.setMatrixAt(si++,dummy.matrix);} scene.add(shrubs);

function box3(o){ return o ? new THREE.Box3().setFromObject(o) : null; }
function overlapXZ(a,b,margin=0){ if(!a||!b)return false; return !(a.max.x<=b.min.x+margin||a.min.x>=b.max.x-margin||a.max.z<=b.min.z+margin||a.min.z>=b.max.z-margin); }
const naturalBox=box3(natural), fishBox=box3(fish), parkingBox=box3(byId('VAGA-FRENTE-V10'));
const pathViolations=[]; for(const stone of pathGroup.children){const sb=box3(stone);if(overlapXZ(sb,naturalBox)||overlapXZ(sb,fishBox)||overlapXZ(sb,parkingBox))pathViolations.push(stone.position.toArray().map(v=>+v.toFixed(2)));}
window.__CASA_SITE_QA__={version:'v1.1-reference-layout',house:[7.076,6.058],balconyExternal:true,stairs:{external:true,walkable:true,lowerRise:3.25,upperRise:3.0,width:stairW},continuousRearPath:true,pathViolations,pass:pathViolations.length===0};
console.info('[Casa Contreras] QA implantacao v1.1',window.__CASA_SITE_QA__);

const top=document.getElementById('topbar'); if(top)top.innerHTML=`<b>CASA CONTRERAS — v1.1 REFERENCIA + CIRCULACAO</b><br><span class="muted">7,076 x 6,058 m por pavimento • sacadas externas • escadas caminhaveis pela lateral direita • caminho continuo ate os fundos<br>WASD • mouse • 1/2/3 • H escala • G grade 1 m • Q qualidade • F feedbacks</span>`;
const note=document.querySelector('#start .note'); if(note)note.textContent='Implantacao redistribuida para se aproximar da prancha: lagos separados, horta frontal, caminho continuo, fundos produtivos e escadas reais entre os tres niveis.';
window.__CASA_V11__={version:'v1.1-reference-realism',stairsWalkable:true,continuousRearPath:true,furnitureDetailed:true,siteQA:window.__CASA_SITE_QA__};
