import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

/**
 * CASA CONTRERAS — TOUR 3D v0.2
 * Referência visual vigente: prancha geral aprovada pelo usuário em 02/09/2026.
 *
 * REGRAS DIMENSIONAIS:
 * - lote EXATO: 10.000 x 25.000 m
 * - casa: 7.076 m (fachada) x 6.058 m (profundidade)
 * - dois pavimentos habitáveis + térreo/pilotis funcional
 * - vão central de 2.200 m TOTALMENTE fechado e integrado ao volume útil
 * - sacadas/decks são externos ao envelope dos containers
 */

const CFG = Object.freeze({
  lot: { width: 10.0, length: 25.0 },
  house: { width: 7.076, depth: 6.058, centerZ: 0.70 },
  levels: { ground: 0.0, social: 3.25, private: 6.25 },
  floorHeight: 3.0,
  eyeHeight: 1.66,
  wallThickness: 0.12,
  centralGap: 2.20,
  balconyDepth: 1.80,
  frontZ: -12.5,
  backZ: 12.5,
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb9c9bd);
scene.fog = new THREE.FogExp2(0xb9c9bd, 0.022);

const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.03, 120);
camera.position.set(-3.7, CFG.eyeHeight, -11.5);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
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
const topbar = document.getElementById('topbar');

topbar.innerHTML = `<b>CASA CONTRERAS — TOUR 3D v0.2</b><br><span class="muted">Referência: implantação aprovada • terreno 10,00 × 25,00 m • casa 7,076 × 6,058 m<br>WASD andar • mouse olhar • Shift correr • Espaço pular • clique selecionar/feedback • 1/2/3 trocar nível</span>`;

enter.addEventListener('click', () => controls.lock());
controls.addEventListener('lock', () => { start.style.display = 'none'; });
controls.addEventListener('unlock', () => {
  if (feedback.style.display !== 'grid') start.style.display = 'grid';
});

scene.add(new THREE.HemisphereLight(0xe9f5ff, 0x3d4d32, 1.55));
const sun = new THREE.DirectionalLight(0xffebc2, 2.9);
sun.position.set(-13, 20, -14);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -20;
sun.shadow.camera.right = 20;
sun.shadow.camera.top = 24;
sun.shadow.camera.bottom = -24;
scene.add(sun);
const ambientWarm = new THREE.PointLight(0xffb975, 22, 30, 2);
ambientWarm.position.set(0, 7.0, 1.0);
scene.add(ambientWarm);

const M = {
  grass: new THREE.MeshStandardMaterial({ color: 0x5f7f50, roughness: 1 }),
  darkGrass: new THREE.MeshStandardMaterial({ color: 0x3f653e, roughness: 1 }),
  path: new THREE.MeshStandardMaterial({ color: 0xa19a8a, roughness: 0.94 }),
  concrete: new THREE.MeshStandardMaterial({ color: 0x8f9290, roughness: 0.92 }),
  concreteDark: new THREE.MeshStandardMaterial({ color: 0x656966, roughness: 0.95 }),
  steel: new THREE.MeshStandardMaterial({ color: 0x202624, roughness: 0.5, metalness: 0.68 }),
  steel2: new THREE.MeshStandardMaterial({ color: 0x121817, roughness: 0.42, metalness: 0.74 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x875a35, roughness: 0.78 }),
  woodLight: new THREE.MeshStandardMaterial({ color: 0xa7794e, roughness: 0.8 }),
  wall: new THREE.MeshStandardMaterial({ color: 0xdfd9cd, roughness: 0.88 }),
  wallDark: new THREE.MeshStandardMaterial({ color: 0x2b302d, roughness: 0.78 }),
  container: new THREE.MeshStandardMaterial({ color: 0x343d39, roughness: 0.67, metalness: 0.4 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0xbfd7d4, transparent: true, opacity: 0.33, roughness: 0.07, transmission: 0.45, side: THREE.DoubleSide }),
  water: new THREE.MeshPhysicalMaterial({ color: 0x31879a, roughness: 0.12, metalness: 0.0, transparent: true, opacity: 0.82, transmission: 0.18 }),
  waterDark: new THREE.MeshPhysicalMaterial({ color: 0x2b6971, roughness: 0.18, transparent: true, opacity: 0.86 }),
  rock: new THREE.MeshStandardMaterial({ color: 0x777a70, roughness: 1 }),
  rock2: new THREE.MeshStandardMaterial({ color: 0x95968b, roughness: 1 }),
  soil: new THREE.MeshStandardMaterial({ color: 0x5d402d, roughness: 1 }),
  leaf: new THREE.MeshStandardMaterial({ color: 0x315f33, roughness: 0.92 }),
  leaf2: new THREE.MeshStandardMaterial({ color: 0x4f7f42, roughness: 0.92 }),
  leaf3: new THREE.MeshStandardMaterial({ color: 0x6f994e, roughness: 0.95 }),
  solar: new THREE.MeshStandardMaterial({ color: 0x173c59, roughness: 0.22, metalness: 0.45 }),
  white: new THREE.MeshStandardMaterial({ color: 0xede7dc, roughness: 0.82 }),
  black: new THREE.MeshStandardMaterial({ color: 0x111514, roughness: 0.8 }),
  red: new THREE.MeshStandardMaterial({ color: 0xb24e40, roughness: 0.8 }),
  crop: new THREE.MeshStandardMaterial({ color: 0x5c933e, roughness: 0.9 }),
  crop2: new THREE.MeshStandardMaterial({ color: 0x7da44a, roughness: 0.9 }),
};

const interactables = [];
const collisionBoxes = [];
let hovered = null;
let selected = null;
let highlighted = null;
const raycaster = new THREE.Raycaster();
const centerNdc = new THREE.Vector2(0, 0);

function tag(obj, id, label, category = 'Elemento', extra = {}) {
  obj.userData = { ...obj.userData, id, label, category, selectable: true, ...extra };
  interactables.push(obj);
  return obj;
}
function meshBox({ w, h, d, x = 0, y = h / 2, z = 0, mat = M.wall, id, label, category, collide = false, shadow = true, parent = scene, extra }) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = shadow; mesh.receiveShadow = true; parent.add(mesh);
  if (id) tag(mesh, id, label || id, category, extra);
  if (collide) collisionBoxes.push({ mesh, box: new THREE.Box3().setFromObject(mesh) });
  return mesh;
}
function meshCylinder({ r = 0.2, h = 1, x = 0, y = h / 2, z = 0, mat = M.wood, id, label, category, segments = 20, parent = scene, extra }) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, segments), mat);
  mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh);
  if (id) tag(mesh, id, label || id, category, extra); return mesh;
}
function meshSphere({ r = 0.5, x = 0, y = r, z = 0, mat = M.leaf, id, label, category, parent = scene, scale = [1,1,1], extra }) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), mat);
  mesh.position.set(x, y, z); mesh.scale.set(...scale); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh);
  if (id) tag(mesh, id, label || id, category, extra); return mesh;
}
function wall(id, label, x, yBase, z, w, h, d, mat = M.wall, extra = {}) {
  return meshBox({ w, h, d, x, y: yBase + h / 2, z, mat, id, label, category: 'Parede', collide: true, extra });
}
function labelSprite(text, pos, scale = 1) {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext('2d'); ctx.fillStyle = 'rgba(5,15,10,.72)'; ctx.fillRect(0,0,512,128);
  ctx.fillStyle = '#fff'; ctx.font = '700 39px system-ui'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(text,256,64);
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));
  sprite.position.copy(pos); sprite.scale.set(3.2*scale,0.8*scale,1); scene.add(sprite); return sprite;
}
function plantCluster(x,z,radius=0.25,count=5,mat=M.crop,y=0.16){
  const g=new THREE.Group();
  for(let i=0;i<count;i++){const a=(i/count)*Math.PI*2,rr=radius*(0.25+(i%3)/3);meshSphere({r:0.11+(i%2)*0.035,x:Math.cos(a)*rr,y,z:Math.sin(a)*rr,mat,parent:g,scale:[1,0.75,1]});}
  g.position.set(x,0,z); scene.add(g); return g;
}

meshBox({w:10,h:0.16,d:25,x:0,y:-0.08,z:0,mat:M.grass,id:'LOT-10X25',label:'Terreno 10,00 × 25,00 m',category:'Terreno',extra:{width:10,length:25}});
wall('MURO-OESTE','Muro lateral oeste',-4.94,0,0,0.12,1.65,25,M.concreteDark);
wall('MURO-LESTE','Muro lateral leste',4.94,0,0,0.12,1.65,25,M.concreteDark);
wall('MURO-FUNDO','Muro de fundos',0,0,12.44,10,1.65,0.12,M.concreteDark);
wall('MURO-FR-1','Muro frontal esquerdo',-3.96,0,-12.44,2.05,1.55,0.12,M.concreteDark);
wall('MURO-FR-2','Muro frontal central',-0.95,0,-12.44,1.75,1.55,0.12,M.concreteDark);
wall('MURO-FR-3','Muro frontal direito',4.20,0,-12.44,1.55,1.55,0.12,M.concreteDark);
meshBox({w:1.05,h:1.45,d:0.08,x:-2.55,y:0.725,z:-12.37,mat:M.wood,id:'PORTAO-PEDESTRE',label:'Portão de pedestres',category:'Acesso',collide:true});
meshBox({w:2.85,h:1.45,d:0.08,x:2.25,y:0.725,z:-12.37,mat:M.wood,id:'PORTAO-VEICULO',label:'Portão de veículos',category:'Acesso',collide:true});
meshBox({w:2.55,h:0.025,d:10.45,x:2.25,y:0.0125,z:-7.15,mat:M.path,id:'DRIVEWAY',label:'Entrada para o carro',category:'Circulação'});
for(let i=0;i<18;i++) meshBox({w:0.52,h:0.028,d:0.72,x:-2.55,y:0.014,z:-11.8+i*0.72,mat:M.path,id:`PEDRA-CAMINHO-${i+1}`,label:'Caminho de pedestres',category:'Circulação'});
labelSprite('10,00 m',new THREE.Vector3(0,0.45,-12.15),0.55);

function tree(id,label,x,z,s=1,crownMat=M.leaf){
  const g=new THREE.Group(); meshCylinder({r:0.13*s,h:1.35*s,x:0,y:0.675*s,z:0,mat:M.wood,parent:g});
  meshSphere({r:0.58*s,x:0,y:1.55*s,z:0,mat:crownMat,parent:g,scale:[0.92,1.18,0.92]});
  meshSphere({r:0.42*s,x:-0.26*s,y:1.45*s,z:0.15*s,mat:M.leaf2,parent:g});
  meshSphere({r:0.38*s,x:0.25*s,y:1.43*s,z:-0.12*s,mat:M.leaf3,parent:g}); g.position.set(x,0,z); scene.add(g); tag(g,id,label,'Pomar/Agrofloresta',{species:label}); return g;
}
const orchardNames=['Bananeira','Jabuticabeira','Mangueira','Aceroleira','Limoeiro','Mexeriqueira']; let ti=0;
for(const z of [-10.8,-8.6,-6.4,-4.2,-2.0,0.2,2.4,4.6,6.8,9.0,11.0]) tree(`POMAR-O-${++ti}`,orchardNames[(ti-1)%orchardNames.length],-4.45,z,0.68+(ti%3)*0.06,ti%2?M.leaf:M.leaf2);
for(const z of [-10.5,-8.0,-5.5,-3.0,-0.5,2.0,4.5,7.0,9.5,11.2]) tree(`POMAR-L-${++ti}`,orchardNames[(ti-1)%orchardNames.length],4.45,z,0.65+(ti%2)*0.07,ti%2?M.leaf2:M.leaf);
for(const x of [-3.6,-2.0,0,2.0,3.6]) tree(`POMAR-FUNDO-${++ti}`,orchardNames[(ti-1)%orchardNames.length],x,11.65,0.72,M.leaf);

function pond(id,label,x,z,rx,rz,mat=M.water){
  const water=new THREE.Mesh(new THREE.CylinderGeometry(1,1,0.14,40),mat); water.scale.set(rx,1,rz); water.position.set(x,-0.01,z); water.receiveShadow=true; scene.add(water); tag(water,id,label,'Água',{rx,rz});
  for(let i=0;i<24;i++){const a=(i/24)*Math.PI*2;meshSphere({r:0.18+(i%4)*0.025,x:x+Math.cos(a)*rx*1.02,y:0.10,z:z+Math.sin(a)*rz*1.02,mat:i%2?M.rock:M.rock2,scale:[1.2,0.65,1]});}
  for(let i=0;i<7;i++) plantCluster(x+Math.cos(i*0.9)*rx*0.74,z+Math.sin(i*0.9)*rz*0.74,0.15,4,i%2?M.leaf2:M.leaf3,0.12); return water;
}
pond('LAGO-NATURAL','Lago natural de banho',-2.60,-7.60,1.75,2.45,M.water);
pond('LAGO-PEIXES','Lago de peixes para consumo',1.25,-6.75,1.15,1.75,M.waterDark);
meshBox({w:1.45,h:0.12,d:2.50,x:-1.15,y:0.15,z:-7.35,mat:M.wood,id:'DECK-LAGO',label:'Deck do lago natural',category:'Lazer'});
meshBox({w:0.75,h:0.08,d:1.15,x:-1.95,y:0.11,z:-6.15,mat:M.wood,id:'PASSARELA-LAGO',label:'Passarela entre lago e jardim',category:'Lazer'});
for(let i=0;i<2;i++) meshCylinder({r:0.37,h:0.68,x:3.72+i*0.62,y:0.34,z:-8.55,mat:M.black,id:`FILTRO-BIO-${i+1}`,label:'Filtro biológico dos lagos',category:'Sistema de água'});
meshCylinder({r:0.62,h:0.75,x:-3.75,y:0.375,z:-10.75,mat:M.concrete,id:'CISTERNA-CHUVA',label:'Cisterna de captação de chuva',category:'Sistema de água',extra:{use:'água de chuva para irrigação e usos não potáveis'}});
for(let i=0;i<4;i++){const z=-10.0+i*0.75;meshBox({w:1.30,h:0.28,d:0.58,x:-0.15,y:0.14,z,mat:M.wood,id:`CANTEIRO-FRONTAL-${i+1}`,label:'Canteiro frontal de hortaliças',category:'Horta'});meshBox({w:1.12,h:0.12,d:0.45,x:-0.15,y:0.31,z,mat:M.soil});for(let j=0;j<4;j++)plantCluster(-0.57+j*0.28,z,0.07,3,j%2?M.crop:M.crop2,0.39);}

const HW=CFG.house.width,HD=CFG.house.depth,HZ=CFG.house.centerZ,socialY=CFG.levels.social,privateY=CFG.levels.private,halfW=HW/2,halfD=HD/2;
function structuralFrame(yTop){const x0=halfW-0.20,z0=halfD-0.20;for(const x of [-x0,0,x0])for(const zo of [-z0,z0])meshBox({w:0.20,h:yTop,d:0.20,x,y:yTop/2,z:HZ+zo,mat:M.steel2,id:`PILAR-${x.toFixed(2)}-${zo.toFixed(2)}`,label:'Pilar metálico independente',category:'Estrutura',collide:true});}
structuralFrame(socialY);
for(const z of [HZ-halfD+0.12,HZ+halfD-0.12,HZ]) meshBox({w:HW+0.12,h:0.24,d:0.18,x:0,y:socialY-0.12,z,mat:M.steel2,id:`VIGA-T-${z}`,label:'Viga principal térreo',category:'Estrutura'});
meshBox({w:HW,h:0.18,d:HD,x:0,y:socialY-0.09,z:HZ,mat:M.woodLight,id:'PISO-SOCIAL',label:'Piso pavimento social',category:'Pavimento'});
meshBox({w:HW,h:0.18,d:HD,x:0,y:privateY-0.09,z:HZ,mat:M.woodLight,id:'PISO-INTIMO',label:'Piso pavimento íntimo',category:'Pavimento'});
for(const baseY of [socialY,privateY]){const x0=halfW-0.16,z0=halfD-0.16;for(const x of [-x0,x0])for(const zo of [-z0,z0])meshBox({w:0.18,h:2.92,d:0.18,x,y:baseY+1.46,z:HZ+zo,mat:M.steel2,id:`PILAR-SUP-${baseY}-${x}-${zo}`,label:'Pilar metálico superior',category:'Estrutura'});}

function containerLines(yBase,prefix){const h=2.82,t=0.12;wall(`${prefix}-LAT-O`,`Fachada lateral oeste — ${prefix}`,-halfW+t/2,yBase,HZ,t,h,HD,M.container,{containerSide:true});wall(`${prefix}-LAT-L`,`Fachada lateral leste — ${prefix}`,halfW-t/2,yBase,HZ,t,h,HD,M.container,{containerSide:true});const frontZ=HZ-halfD+t/2;wall(`${prefix}-FR-1`,`Fachada frontal esquerda — ${prefix}`,-2.78,yBase,frontZ,1.30,h,t,M.container);wall(`${prefix}-FR-2`,`Pilar/faixa frontal central esquerda — ${prefix}`,-0.92,yBase,frontZ,0.28,h,t,M.container);wall(`${prefix}-FR-3`,`Pilar/faixa frontal central direita — ${prefix}`,0.92,yBase,frontZ,0.28,h,t,M.container);wall(`${prefix}-FR-4`,`Fachada frontal direita — ${prefix}`,2.78,yBase,frontZ,1.30,h,t,M.container);wall(`${prefix}-FR-VERGA`,`Verga frontal — ${prefix}`,0,yBase+2.46,frontZ,4.15,0.36,t,M.container);const backZ=HZ+halfD-t/2;wall(`${prefix}-TR-1`,`Fachada traseira esquerda — ${prefix}`,-2.65,yBase,backZ,1.55,h,t,M.container);wall(`${prefix}-TR-2`,`Fachada traseira direita — ${prefix}`,2.65,yBase,backZ,1.55,h,t,M.container);wall(`${prefix}-TR-VERGA`,`Verga traseira — ${prefix}`,0,yBase+2.42,backZ,3.85,0.40,t,M.container);for(const x of [-1.75,0,1.75])meshBox({w:1.40,h:2.30,d:0.032,x,y:yBase+1.15,z:frontZ+0.04,mat:M.glass,id:`${prefix}-GLASS-F-${x}`,label:`Grande esquadria frontal — ${prefix}`,category:'Esquadria'});meshBox({w:3.62,h:2.24,d:0.032,x:0,y:yBase+1.12,z:backZ-0.04,mat:M.glass,id:`${prefix}-GLASS-TR`,label:`Grande esquadria traseira — ${prefix}`,category:'Esquadria'});}
containerLines(socialY,'SOCIAL'); containerLines(privateY,'INTIMO');
meshBox({w:CFG.centralGap,h:2.78,d:0.10,x:0,y:socialY+1.39,z:HZ,mat:new THREE.MeshStandardMaterial({color:0x3b443f,transparent:true,opacity:0.06}),id:'VAO-CENTRAL-SOCIAL',label:'Vão central fechado e útil — social',category:'Área útil',extra:{width:CFG.centralGap,closed:true}});
meshBox({w:CFG.centralGap,h:2.78,d:0.10,x:0,y:privateY+1.39,z:HZ,mat:new THREE.MeshStandardMaterial({color:0x3b443f,transparent:true,opacity:0.06}),id:'VAO-CENTRAL-INTIMO',label:'Vão central fechado e útil — íntimo',category:'Área útil',extra:{width:CFG.centralGap,closed:true}});

function balcony(y,prefix){const frontZ=HZ-halfD-CFG.balconyDepth/2;meshBox({w:HW+0.15,h:0.14,d:CFG.balconyDepth,x:0,y:y-0.07,z:frontZ,mat:M.wood,id:`${prefix}-SACADA-FR`,label:`Sacada frontal ${prefix}`,category:'Sacada'});meshBox({w:HW+0.05,h:0.05,d:0.05,x:0,y:y+1.05,z:frontZ-CFG.balconyDepth/2+0.05,mat:M.steel2,id:`${prefix}-GC-FR`,label:'Guarda-corpo sacada',category:'Segurança'});for(let x=-halfW;x<=halfW;x+=0.55)meshBox({w:0.035,h:1.05,d:0.035,x,y:y+0.52,z:frontZ-CFG.balconyDepth/2+0.05,mat:M.steel2});for(const side of [-1,1]){meshBox({w:0.78,h:0.14,d:HD+CFG.balconyDepth,x:side*(halfW+0.39),y:y-0.07,z:HZ-CFG.balconyDepth/2,mat:M.wood,id:`${prefix}-SACADA-LAT-${side<0?'O':'L'}`,label:'Sacada lateral parcial',category:'Sacada'});meshBox({w:0.05,h:1.05,d:HD+CFG.balconyDepth,x:side*(halfW+0.77),y:y+0.52,z:HZ-CFG.balconyDepth/2,mat:M.steel2});}}
balcony(socialY,'SOCIAL'); balcony(privateY,'INTIMO');
meshBox({w:HW+0.95,h:0.18,d:HD+1.10,x:0,y:9.30,z:HZ,mat:M.steel,id:'COBERTURA',label:'Cobertura independente ventilada',category:'Cobertura'});
for(let r=0;r<2;r++)for(let c=0;c<4;c++)meshBox({w:1.35,h:0.06,d:1.55,x:-2.15+c*1.43,y:9.46,z:HZ-0.9+r*1.72,mat:M.solar,id:`FV-${r+1}-${c+1}`,label:'Painel fotovoltaico',category:'Energia solar'});
meshCylinder({r:0.38,h:0.90,x:2.75,y:9.80,z:HZ+1.85,mat:M.concrete,id:'RESERVATORIO-OPERACIONAL',label:'Reservatório operacional pequeno',category:'Sistema de água'});

meshBox({w:HW,h:0.06,d:HD,x:0,y:0.03,z:HZ,mat:M.concrete,id:'PISO-TERREO',label:'Piso térreo funcional',category:'Pavimento'});
const backServiceZ=HZ+1.65;
wall('TER-OFI-FUNDO','Parede oficina',-2.46,0,backServiceZ+1.20,2.15,2.55,0.12,M.wallDark);wall('TER-DEP-FUNDO','Parede depósito',-0.15,0,backServiceZ+1.20,1.95,2.55,0.12,M.wallDark);wall('TER-LAV-FUNDO','Parede lavanderia',2.25,0,backServiceZ+1.20,2.15,2.55,0.12,M.wallDark);wall('TER-DIV-1','Divisória oficina/depósito',-1.33,0,backServiceZ,0.12,2.55,2.45,M.wallDark);wall('TER-DIV-2','Divisória depósito/lavanderia',1.05,0,backServiceZ,0.12,2.55,2.45,M.wallDark);
labelSprite('OFICINA',new THREE.Vector3(-2.43,2.05,HZ+2.42),0.52);labelSprite('DEPÓSITO',new THREE.Vector3(-0.15,2.05,HZ+2.42),0.47);labelSprite('LAVANDERIA',new THREE.Vector3(2.25,2.05,HZ+2.42),0.45);
meshBox({w:1.82,h:0.82,d:0.62,x:-2.40,y:0.41,z:HZ+1.85,mat:M.wood,id:'BANCADA-OFICINA',label:'Bancada da oficina',category:'Oficina'});for(let i=0;i<5;i++)meshBox({w:0.07,h:0.55,d:0.08,x:-3.12+i*0.34,y:1.20,z:HZ+2.18,mat:i%2?M.red:M.steel2,id:`FERRAMENTA-${i+1}`,label:'Ferramenta da oficina',category:'Oficina'});for(let i=0;i<3;i++)meshBox({w:1.25,h:0.08,d:0.45,x:-0.15,y:0.55+i*0.55,z:HZ+1.95,mat:M.wood,id:`PRATELEIRA-DEP-${i+1}`,label:'Prateleira do depósito',category:'Depósito'});
meshBox({w:0.75,h:0.90,d:0.68,x:1.80,y:0.45,z:HZ+1.90,mat:M.white,id:'LAVADORA',label:'Máquina de lavar',category:'Lavanderia'});meshBox({w:0.75,h:0.90,d:0.68,x:2.62,y:0.45,z:HZ+1.90,mat:M.white,id:'SECADORA',label:'Secadora / módulo de lavanderia',category:'Lavanderia'});meshBox({w:1.65,h:0.12,d:0.62,x:2.20,y:1.04,z:HZ+1.90,mat:M.wood,id:'BANCADA-LAV',label:'Bancada da lavanderia',category:'Lavanderia'});
meshBox({w:2.45,h:0.88,d:0.66,x:-0.70,y:0.44,z:HZ-1.48,mat:M.wood,id:'BANCADA-GOURMET',label:'Bancada da área gourmet',category:'Área gourmet'});meshBox({w:0.85,h:1.35,d:0.62,x:-2.42,y:0.675,z:HZ-1.48,mat:M.steel,id:'CHURRASQUEIRA',label:'Churrasqueira',category:'Área gourmet'});meshBox({w:2.55,h:0.12,d:1.02,x:-0.55,y:0.74,z:HZ+0.20,mat:M.woodLight,id:'MESA-GOURMET',label:'Mesa grande da área gourmet',category:'Área gourmet'});for(let i=0;i<8;i++){const row=i<4?-1:1,col=i%4;meshBox({w:0.42,h:0.47,d:0.42,x:-1.35+col*0.54,y:0.235,z:HZ+0.20+row*0.80,mat:M.wood,id:`CADEIRA-GOURMET-${i+1}`,label:'Cadeira gourmet',category:'Mobiliário'});}
meshBox({w:2.50,h:0.035,d:3.45,x:2.22,y:0.017,z:HZ-1.15,mat:M.concreteDark,id:'VAGA-COBERTA',label:'Garagem coberta sob pilotis',category:'Garagem'});meshBox({w:1.75,h:0.65,d:3.85,x:2.22,y:0.52,z:HZ-1.05,mat:M.black,id:'CARRO-REF',label:'Veículo de referência',category:'Garagem'});meshBox({w:1.42,h:0.48,d:1.75,x:2.22,y:1.03,z:HZ-1.05,mat:M.glass});

const sY=socialY;
meshBox({w:2.82,h:0.92,d:0.66,x:-2.00,y:sY+0.46,z:HZ+2.18,mat:M.wood,id:'COZ-BANCADA',label:'Bancada principal da cozinha',category:'Cozinha'});meshBox({w:0.80,h:1.95,d:0.72,x:-3.05,y:sY+0.975,z:HZ+1.82,mat:M.steel,id:'COZ-GELADEIRA',label:'Geladeira',category:'Cozinha'});meshBox({w:0.86,h:0.92,d:0.70,x:-1.35,y:sY+0.46,z:HZ+2.12,mat:M.steel,id:'COZ-FOGAO',label:'Fogão/cooktop',category:'Cozinha'});meshBox({w:2.35,h:0.92,d:0.82,x:-1.55,y:sY+0.46,z:HZ+0.64,mat:M.woodLight,id:'COZ-ILHA',label:'Ilha central da cozinha',category:'Cozinha'});for(let i=0;i<3;i++)meshBox({w:0.38,h:0.50,d:0.38,x:-2.25+i*0.68,y:sY+0.25,z:HZ+0.05,mat:M.wood,id:`BANCO-ILHA-${i+1}`,label:'Banco da ilha',category:'Cozinha'});
wall('BAN-SOC-O','Banheiro social parede oeste',1.35,sY,HZ+2.08,0.10,2.65,1.72,M.wall);wall('BAN-SOC-F','Banheiro social parede frontal',2.20,sY,HZ+1.22,1.75,2.65,0.10,M.wall);meshBox({w:0.52,h:0.42,d:0.68,x:1.78,y:sY+0.21,z:HZ+2.42,mat:M.white,id:'BAN-SOC-VASO',label:'Vaso sanitário social',category:'Banheiro'});meshBox({w:0.78,h:0.12,d:0.48,x:2.55,y:sY+0.82,z:HZ+2.47,mat:M.wood,id:'BAN-SOC-PIA',label:'Pia banheiro social',category:'Banheiro'});meshBox({w:0.74,h:2.1,d:0.04,x:2.63,y:sY+1.05,z:HZ+1.36,mat:M.glass,id:'BAN-SOC-BOX',label:'Box banheiro social',category:'Banheiro'});
meshBox({w:2.35,h:0.82,d:0.92,x:1.25,y:sY+0.41,z:HZ-0.42,mat:M.white,id:'SOFA-SOCIAL',label:'Sofá da sala',category:'Sala'});meshBox({w:1.25,h:0.28,d:0.72,x:0.55,y:sY+0.14,z:HZ-1.52,mat:M.wood,id:'MESA-CENTRO',label:'Mesa de centro',category:'Sala'});meshBox({w:1.75,h:0.92,d:0.18,x:3.23,y:sY+1.22,z:HZ-0.45,mat:M.black,id:'TV-SALA',label:'TV da sala',category:'Sala'});meshBox({w:2.20,h:0.12,d:0.95,x:-1.35,y:sY+0.76,z:HZ-1.25,mat:M.woodLight,id:'MESA-JANTAR',label:'Mesa de jantar',category:'Sala/Jantar'});for(let i=0;i<6;i++){const side=i<3?-1:1,idx=i%3;meshBox({w:0.38,h:0.47,d:0.38,x:-2.05+idx*0.70,y:sY+0.235,z:HZ-1.25+side*0.67,mat:M.wood,id:`CADEIRA-JANTAR-${i+1}`,label:'Cadeira de jantar',category:'Sala/Jantar'});}

function stairFlight(prefix,baseY,startZ,endZ){const steps=16,x=4.04;for(let i=0;i<steps;i++){const t=i/(steps-1),y=baseY+t*3.0,z=startZ+(endZ-startZ)*t;meshBox({w:0.95,h:0.08,d:0.28,x,y,z,mat:M.woodLight,id:`${prefix}-STEP-${i+1}`,label:'Degrau da escada',category:'Escada'});}const length=Math.hypot(endZ-startZ,3.0),zMid=(startZ+endZ)/2,angle=Math.atan2(3.0,endZ-startZ);for(const dx of [-0.38,0.38]){const rail=meshBox({w:0.07,h:0.07,d:length,x:x+dx,y:baseY+1.5,z:zMid,mat:M.steel2});rail.rotation.x=angle;}}
stairFlight('ESC-G-S',0.15,HZ+3.60,HZ-0.15);stairFlight('ESC-S-I',3.25,HZ-0.15,HZ+3.60);

const pY=privateY;
wall('INT-DIV-A','Divisória íntima principal',0.10,pY,HZ,0.10,2.68,HD,M.wall);wall('INT-DIV-B','Divisória casal/filhos',-1.78,pY,HZ+0.18,3.70,2.68,0.10,M.wall);
for(let i=0;i<3;i++){meshBox({w:0.88,h:0.46,d:1.92,x:-2.78+i*1.08,y:pY+0.23,z:HZ+1.74,mat:M.woodLight,id:`CAMA-FILHO-${i+1}`,label:`Cama filho ${i+1}`,category:'Quarto dos filhos'});meshBox({w:0.82,h:0.18,d:1.78,x:-2.78+i*1.08,y:pY+0.55,z:HZ+1.74,mat:M.white});}
meshBox({w:3.05,h:0.78,d:0.55,x:-1.85,y:pY+0.39,z:HZ+0.10,mat:M.wood,id:'BANCADA-FILHOS',label:'Bancada de estudo dos 3 filhos',category:'Quarto dos filhos'});for(let i=0;i<3;i++)meshBox({w:0.40,h:0.50,d:0.40,x:-2.80+i*0.95,y:pY+0.25,z:HZ-0.35,mat:M.black,id:`CADEIRA-FILHO-${i+1}`,label:'Cadeira de estudo',category:'Quarto dos filhos'});
meshBox({w:1.62,h:0.45,d:2.02,x:-2.10,y:pY+0.225,z:HZ-1.42,mat:M.woodLight,id:'CAMA-CASAL',label:'Cama do casal',category:'Quarto casal'});meshBox({w:1.52,h:0.18,d:1.92,x:-2.10,y:pY+0.52,z:HZ-1.42,mat:M.white});meshBox({w:0.48,h:0.52,d:0.44,x:-3.14,y:pY+0.26,z:HZ-1.55,mat:M.wood,id:'CRIADO-CASAL-1',label:'Criado-mudo',category:'Quarto casal'});meshBox({w:0.48,h:0.52,d:0.44,x:-1.06,y:pY+0.26,z:HZ-1.55,mat:M.wood,id:'CRIADO-CASAL-2',label:'Criado-mudo',category:'Quarto casal'});
wall('BAN-INT-F','Banheiro superior parede frontal',1.68,pY,HZ+1.08,3.22,2.68,0.10,M.wall);meshBox({w:0.54,h:0.42,d:0.68,x:1.35,y:pY+0.21,z:HZ+2.18,mat:M.white,id:'BAN-INT-VASO',label:'Vaso sanitário superior',category:'Banheiro'});meshBox({w:1.10,h:0.56,d:1.65,x:2.63,y:pY+0.28,z:HZ+2.08,mat:M.white,id:'BANHEIRA',label:'Banheira compacta',category:'Banheiro',extra:{structuralLoad:'a dimensionar'}});meshBox({w:0.85,h:0.12,d:0.46,x:1.22,y:pY+0.82,z:HZ+1.35,mat:M.wood,id:'BAN-INT-PIA',label:'Pia banheiro superior',category:'Banheiro'});
meshBox({w:2.52,h:0.78,d:0.62,x:2.15,y:pY+0.39,z:HZ-1.42,mat:M.wood,id:'MESA-GAMER',label:'Bancada escritório/gamer',category:'Escritório/Gamer'});for(let i=0;i<2;i++)meshBox({w:0.74,h:0.46,d:0.08,x:1.65+i*1.0,y:pY+1.12,z:HZ-1.69,mat:M.black,id:`MONITOR-${i+1}`,label:'Monitor gamer',category:'Escritório/Gamer'});meshBox({w:0.54,h:0.82,d:0.58,x:1.55,y:pY+0.41,z:HZ-0.72,mat:M.black,id:'CADEIRA-GAMER',label:'Cadeira gamer',category:'Escritório/Gamer'});meshBox({w:0.50,h:1.02,d:0.52,x:3.00,y:pY+0.51,z:HZ-1.30,mat:M.black,id:'PC-GAMER',label:'PC gamer',category:'Escritório/Gamer'});

function raisedBed(id,x,z,w=1.65,d=0.62){meshBox({w,h:0.30,d,x,y:0.15,z,mat:M.wood,id,label:'Canteiro elevado de horta',category:'Horta'});meshBox({w:w-0.16,h:0.13,d:d-0.15,x,y:0.31,z,mat:M.soil});const cols=Math.max(3,Math.floor(w/0.35));for(let i=0;i<cols;i++)plantCluster(x-w/2+0.26+i*(w-0.52)/(cols-1),z,0.08,4,i%2?M.crop:M.crop2,0.42);}
[[-1.55,6.20],[-1.55,7.05],[-1.55,7.90],[-1.55,8.75],[0.30,6.20],[0.30,7.05],[0.30,7.90],[0.30,8.75]].forEach((p,i)=>raisedBed(`HORTA-${i+1}`,p[0],p[1],1.55,0.58));
const gh=new THREE.Group();gh.position.set(-3.25,0,9.55);scene.add(gh);meshBox({w:2.25,h:0.10,d:3.70,x:0,y:0.05,z:0,mat:M.concrete,id:'ESTUFA-PISO',label:'Piso da estufa',category:'Estufa',parent:gh});for(const x of [-1.08,1.08])for(const z of [-1.75,1.75])meshBox({w:0.07,h:2.20,d:0.07,x,y:1.10,z,mat:M.steel2,parent:gh});for(const z of [-1.75,1.75])meshBox({w:2.18,h:1.90,d:0.035,x:0,y:0.98,z,mat:M.glass,parent:gh});for(const x of [-1.08,1.08])meshBox({w:0.035,h:1.90,d:3.48,x,y:0.98,z:0,mat:M.glass,parent:gh});const roof1=meshBox({w:1.28,h:0.035,d:3.60,x:-0.55,y:2.15,z:0,mat:M.glass,parent:gh});roof1.rotation.z=-0.42;const roof2=meshBox({w:1.28,h:0.035,d:3.60,x:0.55,y:2.15,z:0,mat:M.glass,parent:gh});roof2.rotation.z=0.42;tag(gh,'ESTUFA','Estufa de cultivo protegido','Estufa');
const av=new THREE.Group();av.position.set(0.25,0,10.20);scene.add(av);meshBox({w:2.75,h:0.12,d:2.40,x:0,y:0.06,z:0,mat:M.soil,parent:av});for(const x of [-1.32,1.32])for(const z of [-1.12,1.12])meshBox({w:0.08,h:2.05,d:0.08,x,y:1.025,z,mat:M.wood,parent:av});for(const z of [-1.12,1.12])meshBox({w:2.62,h:1.65,d:0.025,x:0,y:0.86,z,mat:M.glass,parent:av});for(let i=0;i<5;i++)meshSphere({r:0.18,x:-0.9+i*0.45,y:0.28,z:(i%2?0.45:-0.35),mat:i%2?M.white:M.red,parent:av,scale:[1.2,0.8,1]});meshBox({w:2.82,h:0.12,d:2.50,x:0,y:2.08,z:0,mat:M.steel,parent:av});tag(av,'AVIARIO','Galinheiro / aviário','Produção animal');
meshBox({w:1.80,h:2.15,d:2.30,x:3.35,y:1.075,z:10.20,mat:M.wallDark,id:'DEPOSITO-FERRAMENTAS',label:'Depósito de ferramentas',category:'Apoio'});meshBox({w:0.82,h:1.70,d:0.06,x:3.35,y:0.85,z:9.02,mat:M.wood,id:'PORTA-DEPOSITO',label:'Porta depósito de ferramentas',category:'Apoio'});
for(let i=0;i<3;i++){meshBox({w:0.95,h:0.72,d:1.05,x:-3.45+i*1.0,y:0.36,z:6.35,mat:M.wood,id:`COMPOST-${i+1}`,label:`Composteira baia ${i+1}`,category:'Compostagem'});meshBox({w:0.76,h:0.18,d:0.84,x:-3.45+i*1.0,y:0.72,z:6.35,mat:i===0?M.soil:(i===1?M.darkGrass:M.soil)});}
for(let r=0;r<5;r++){meshBox({w:0.22,h:0.30,d:1.45,x:4.10,y:0.50+r*0.43,z:6.70,mat:M.wood,id:`HORTA-V-${r+1}`,label:'Módulo de horta vertical',category:'Horta vertical'});for(let j=0;j<4;j++)plantCluster(4.00,6.15+j*0.35,0.06,3,r%2?M.crop:M.crop2,0.76+r*0.43);}
meshBox({w:1.20,h:0.18,d:1.65,x:3.05,y:0.09,z:7.10,mat:M.soil,id:'JARDIM-FILTRANTE',label:'Jardim filtrante / águas cinzas',category:'Reuso de água'});for(let i=0;i<8;i++)plantCluster(2.72+(i%2)*0.55,6.50+(i%4)*0.36,0.11,4,M.leaf3,0.30);
for(const [x,z] of [[-4.25,-11.5],[4.25,-11.5],[-4.25,-5.0],[4.25,-4.2],[-4.25,4.8],[4.25,5.3],[-4.25,10.5],[4.25,10.5],[-1.1,-5.5],[1.0,-4.8]]){meshCylinder({r:0.045,h:0.35,x,y:0.175,z,mat:M.black});const p=new THREE.PointLight(0xffc47a,1.2,2.2,2);p.position.set(x,0.45,z);scene.add(p);}

const keys={};let velocityY=0,onGround=true,activeLevel=0;const playerRadius=0.27,tmpDir=new THREE.Vector3(),tmpSide=new THREE.Vector3(),clock=new THREE.Clock();
addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='Digit1')setLevel(0);if(e.code==='Digit2')setLevel(1);if(e.code==='Digit3')setLevel(2);if(e.code==='Space'&&onGround){velocityY=4.25;onGround=false;}});addEventListener('keyup',e=>keys[e.code]=false);
function setLevel(level){activeLevel=level;const y=level===0?CFG.eyeHeight:(level===1?socialY+CFG.eyeHeight:privateY+CFG.eyeHeight);camera.position.y=y;if(level===0)camera.position.set(-2.45,y,-4.8);if(level===1)camera.position.set(0.25,y,HZ-1.1);if(level===2)camera.position.set(1.0,y,HZ-1.0);velocityY=0;onGround=true;toast(`Nível ${level===0?'térreo':level===1?'social':'íntimo'}`);}
function floorY(){if(activeLevel===0)return CFG.eyeHeight;if(activeLevel===1)return socialY+CFG.eyeHeight;return privateY+CFG.eyeHeight;}
function canMoveTo(pos){if(pos.x<-4.70||pos.x>4.70||pos.z<-12.15||pos.z>12.15)return false;const pt=new THREE.Box3(new THREE.Vector3(pos.x-playerRadius,pos.y-1.55,pos.z-playerRadius),new THREE.Vector3(pos.x+playerRadius,pos.y+0.25,pos.z+playerRadius));for(const c of collisionBoxes){c.box.setFromObject(c.mesh);if(pt.intersectsBox(c.box))return false;}return true;}
function updateMovement(dt){if(!controls.isLocked)return;const speed=(keys.ShiftLeft||keys.ShiftRight)?4.2:2.35,forward=(keys.KeyW?1:0)-(keys.KeyS?1:0),side=(keys.KeyD?1:0)-(keys.KeyA?1:0);camera.getWorldDirection(tmpDir);tmpDir.y=0;tmpDir.normalize();tmpSide.crossVectors(tmpDir,new THREE.Vector3(0,1,0)).normalize();const move=new THREE.Vector3();move.addScaledVector(tmpDir,forward*speed*dt);move.addScaledVector(tmpSide,side*speed*dt);const candidate=camera.position.clone().add(move);if(canMoveTo(candidate))camera.position.copy(candidate);velocityY-=10.2*dt;camera.position.y+=velocityY*dt;const fy=floorY();if(camera.position.y<=fy){camera.position.y=fy;velocityY=0;onGround=true;}}

function pick(){raycaster.setFromCamera(centerNdc,camera);const hits=raycaster.intersectObjects(interactables,true);if(!hits.length)return null;let obj=hits[0].object;while(obj&&!obj.userData?.selectable)obj=obj.parent;if(!obj)return null;return{obj,point:hits[0].point};}
function hoverUpdate(){if(!controls.isLocked)return;const hit=pick();hovered=hit;if(hit){selectedLabel.textContent=hit.obj.userData.label;selectedLabel.style.opacity='1';if(highlighted!==hit.obj){if(highlighted?.material?.emissive)highlighted.material.emissive.setHex(highlighted.userData._oldEm||0);highlighted=hit.obj;if(highlighted.material?.emissive){highlighted.userData._oldEm=highlighted.material.emissive.getHex();highlighted.material.emissive.setHex(0x274c35);}}}else{selectedLabel.style.opacity='0';if(highlighted?.material?.emissive)highlighted.material.emissive.setHex(highlighted.userData._oldEm||0);highlighted=null;}}
addEventListener('mousedown',e=>{if(e.button!==0||!controls.isLocked)return;const hit=pick();if(!hit)return;selected=hit;controls.unlock();openFeedback(hit);});
function openFeedback(hit){feedback.style.display='grid';feedbackTitle.textContent=`${hit.obj.userData.label}  [${hit.obj.userData.id}]`;const p=hit.point;feedbackMeta.textContent=`Categoria: ${hit.obj.userData.category}\nID: ${hit.obj.userData.id}\nClique: x=${p.x.toFixed(3)}  y=${p.y.toFixed(3)}  z=${p.z.toFixed(3)}\nCâmera: x=${camera.position.x.toFixed(3)}  y=${camera.position.y.toFixed(3)}  z=${camera.position.z.toFixed(3)}\nTerreno: 10.000 × 25.000 m\nCasa: 7.076 × 6.058 m\nVão central: 2.200 m fechado\nVersão: v0.2-reference-master`;feedbackText.value='';setTimeout(()=>feedbackText.focus(),60);}
cancelFeedback.addEventListener('click',()=>{feedback.style.display='none';selected=null;controls.lock();});
sendFeedback.addEventListener('click',()=>{if(!selected)return;const text=feedbackText.value.trim();if(!text){toast('Escreva o feedback primeiro.');return;}const o=selected.obj.userData,p=selected.point,title=`[3D] ${o.id} — ${o.label}`.slice(0,120),body=`## Feedback do Tour 3D\n\n**Elemento:** ${o.label}\n**ID:** \`${o.id}\`\n**Categoria:** ${o.category}\n**Versão:** v0.2-reference-master\n\n### Solicitação\n${text}\n\n### Coordenadas\n- Clique: \`${p.x.toFixed(3)}, ${p.y.toFixed(3)}, ${p.z.toFixed(3)}\`\n- Câmera: \`${camera.position.x.toFixed(3)}, ${camera.position.y.toFixed(3)}, ${camera.position.z.toFixed(3)}\`\n\n### Fonte de verdade dimensional\n- Terreno: **10,000 × 25,000 m**\n- Casa: **7,076 × 6,058 m**\n- Vão central: **2,200 m, totalmente fechado**\n- Referência visual: prancha geral aprovada em 02/09/2026\n\n> Feedback criado diretamente do modelo navegável Casa Contreras.`;localStorage.setItem(`casa-feedback-${Date.now()}`,JSON.stringify({title,body}));const url=`https://github.com/Leetattoo/casa-container/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;window.open(url,'_blank','noopener');feedback.style.display='none';selected=null;toast('Feedback preparado no GitHub.');});
function toast(msg){toastEl.textContent=msg;toastEl.style.opacity='1';toastEl.style.transform='translateY(0)';clearTimeout(toastEl._t);toastEl._t=setTimeout(()=>{toastEl.style.opacity='0';toastEl.style.transform='translateY(8px)';},1800);}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),0.04);updateMovement(dt);hoverUpdate();renderer.render(scene,camera);}animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
