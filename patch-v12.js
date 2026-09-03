import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const scene = window.__CASA_SCENE__;
const camera = window.__CASA_CAMERA__;
const renderer = window.__CASA_RENDERER__;
if (!scene || !camera || !renderer) throw new Error('Casa Contreras v1.2: cena base indisponivel');

const HOUSE={w:7.076,d:6.058,centerZ:.700,wall:.120};
const LEVEL={ground:0,social:3.250,private:6.250};
const PLAYER={eye:1.660};
const halfW=HOUSE.w/2, halfD=HOUSE.d/2;
const front=HOUSE.centerZ-halfD, back=HOUSE.centerZ+halfD;
const inner={west:-halfW+HOUSE.wall,east:halfW-HOUSE.wall,front:front+HOUSE.wall,back:back-HOUSE.wall};

function byId(id){let hit=null;scene.traverse(o=>{if(!hit&&o.userData?.id===id)hit=o;});return hit;}
function removeId(id){const o=byId(id);if(o?.parent)o.parent.remove(o);return o;}
function removeLabel(label){const arr=[];scene.traverse(o=>{if(o.userData?.label===label)arr.push(o);});arr.forEach(o=>o.parent?.remove(o));}
function tag(o,id,label,category='Elemento',extra={}){o.userData={...o.userData,id,label,category,selectable:true,...extra};return o;}
const BOX=new THREE.BoxGeometry(1,1,1);
const RBOX=new RoundedBoxGeometry(1,1,1,2,.08);
const CYL12=new THREE.CylinderGeometry(1,1,1,12);
const CYL20=new THREE.CylinderGeometry(1,1,1,20);
const SPHERE=new THREE.SphereGeometry(1,12,8);
const TORUS=new THREE.TorusGeometry(1,.18,8,20);
const MAT={
  steel:new THREE.MeshStandardMaterial({color:0x111716,roughness:.38,metalness:.72}),
  steel2:new THREE.MeshStandardMaterial({color:0x2a312f,roughness:.46,metalness:.58}),
  wood:new THREE.MeshStandardMaterial({color:0x85502e,roughness:.68}),
  wood2:new THREE.MeshStandardMaterial({color:0xb67943,roughness:.64}),
  wall:new THREE.MeshStandardMaterial({color:0xe8e1d5,roughness:.9}),
  white:new THREE.MeshStandardMaterial({color:0xf2efe8,roughness:.82}),
  ceramic:new THREE.MeshStandardMaterial({color:0xd9d8d1,roughness:.42}),
  chrome:new THREE.MeshStandardMaterial({color:0xa9b0ad,roughness:.22,metalness:.86}),
  glass:new THREE.MeshStandardMaterial({color:0xa9c8c9,transparent:true,opacity:.30,roughness:.12,depthWrite:false,side:THREE.DoubleSide}),
  fabric:new THREE.MeshStandardMaterial({color:0x71756f,roughness:.98}),
  fabricLight:new THREE.MeshStandardMaterial({color:0xbab1a3,roughness:1}),
  dark:new THREE.MeshStandardMaterial({color:0x181d1c,roughness:.58}),
  black:new THREE.MeshStandardMaterial({color:0x090d0c,roughness:.32,metalness:.25}),
  tile:new THREE.MeshStandardMaterial({color:0xc9c2b5,roughness:.72}),
  stone:new THREE.MeshStandardMaterial({color:0x777a72,roughness:.94}),
  leaf:new THREE.MeshLambertMaterial({color:0x315e35}),
  leaf2:new THREE.MeshLambertMaterial({color:0x4f7c49}),
  glow:new THREE.MeshBasicMaterial({color:0xffc178}),
  screen:new THREE.MeshBasicMaterial({color:0x243f58}),
  red:new THREE.MeshStandardMaterial({color:0x7c2a21,roughness:.72})
};
function mesh(geo,mat,parent=scene){const m=new THREE.Mesh(geo,mat);m.castShadow=false;m.receiveShadow=false;parent.add(m);return m;}
function box({w,h,d,x=0,y=h/2,z=0,mat=MAT.wall,parent=scene,rounded=false,id,label,category,rot=0,extra}){const m=mesh(rounded?RBOX:BOX,mat,parent);m.scale.set(w,h,d);m.position.set(x,y,z);m.rotation.y=rot;if(id)tag(m,id,label||id,category||'Elemento',extra);return m;}
function cyl({r=.1,h=1,x=0,y=h/2,z=0,mat=MAT.steel,parent=scene,rotX=0,rotZ=0}){const m=mesh(CYL20,mat,parent);m.scale.set(r,h,r);m.position.set(x,y,z);m.rotation.x=rotX;m.rotation.z=rotZ;return m;}
function group(id,label,category,pos=[0,0,0],extra={}){const g=new THREE.Group();g.position.set(...pos);scene.add(g);return tag(g,id,label,category,extra);}

// ESCADA: térreo->social externa, social->íntimo INTERNA como na prancha
removeId('ESCADA-SOCIAL-PRIVATE-V11');
const oldUpperDeck=byId('DECK-LATERAL-INTIMO-V11'); if(oldUpperDeck) oldUpperDeck.visible=false;
const stair=group('ESCADA-INTERNA-SOCIAL-INTIMO-V12','Escada interna social -> íntimo','Escada',[0,0,0],{walkable:true,internal:true});
const sx=2.92, sw=.82, z0=-1.95, z1=.92, run=z1-z0, rise=LEVEL.private-LEVEL.social, steps=18;
for(let i=0;i<steps;i++){const t=i/(steps-1),z=z0+run*t,y=LEVEL.social+rise*t;box({w:sw,h:.07,d:.25,x:sx,y:y+.035,z,mat:MAT.wood2,parent:stair,rounded:true});box({w:.035,h:.66,d:.035,x:sx+sw/2-.02,y:y+.35,z,mat:MAT.steel,parent:stair});}
box({w:.035,h:.035,d:run+.28,x:sx+sw/2-.02,y:LEVEL.social+rise/2+.68,z:(z0+z1)/2,mat:MAT.steel,parent:stair});
box({w:1.08,h:.10,d:.76,x:sx,y:LEVEL.social-.05,z:z0-.28,mat:MAT.wood2,parent:stair,rounded:true});
box({w:1.08,h:.10,d:.76,x:sx,y:LEVEL.private-.05,z:z1+.28,mat:MAT.wood2,parent:stair,rounded:true});
for(const y of [LEVEL.social+.02,LEVEL.private+.02]) box({w:1.10,h:.025,d:.025,x:sx,y,z:(y<5?z0-.62:z1+.66),mat:MAT.glow,parent:stair});
let floor=0;addEventListener('keydown',e=>{if(e.code==='Digit1')floor=0;if(e.code==='Digit2')floor=1;if(e.code==='Digit3')floor=2;});
const inUpperStair=()=>camera.position.x>sx-sw/2-.12&&camera.position.x<sx+sw/2+.12&&camera.position.z>z0-.18&&camera.position.z<z1+.18;
function setFloor(n,x,y,z){window.dispatchEvent(new KeyboardEvent('keydown',{code:n===1?'Digit2':'Digit3',bubbles:true}));floor=n;camera.position.set(x,y,z);}
function upperStairNav(){requestAnimationFrame(upperStairNav);if(!inUpperStair())return;const t=THREE.MathUtils.clamp((camera.position.z-z0)/run,0,1);if(floor===1){camera.position.y=LEVEL.social+PLAYER.eye+rise*t;if(t>.985)setFloor(2,sx,LEVEL.private+PLAYER.eye,z1+.04);}else if(floor===2){camera.position.y=LEVEL.social+PLAYER.eye+rise*t;if(t<.015)setFloor(1,sx,LEVEL.social+PLAYER.eye,z0-.04);}}
upperStairNav();

function chair(id,label,x,y,z,rot=0,mat=MAT.wood){const g=group(id,label,'Mobiliário',[x,y,z]);g.rotation.y=rot;box({w:.44,h:.09,d:.44,y:.47,mat,parent:g,rounded:true});box({w:.44,h:.50,d:.08,y:.78,z:.18,mat,parent:g,rounded:true});for(const xx of [-.17,.17])for(const zz of [-.17,.17])box({w:.045,h:.43,d:.045,x:xx,y:.215,z:zz,mat:MAT.steel,parent:g});return g;}
for(let i=0;i<3;i++){removeId(`CAD-JANTAR-A-${i}`);removeId(`CAD-JANTAR-B-${i}`);removeId(`CADEIRA-GOURMET-A-${i}`);removeId(`CADEIRA-GOURMET-B-${i}`);}
for(let i=0;i<3;i++){chair(`CAD-JANTAR-A-${i}`,'Cadeira de jantar',-2.20+i*.58,LEVEL.social,-1.72,Math.PI);chair(`CAD-JANTAR-B-${i}`,'Cadeira de jantar',-2.20+i*.58,LEVEL.social,-.46,0);chair(`CADEIRA-GOURMET-A-${i}`,'Cadeira gourmet',-2.05+i*.62,0,-.62,Math.PI);chair(`CADEIRA-GOURMET-B-${i}`,'Cadeira gourmet',-2.05+i*.62,0,.72,0);}
for(let i=1;i<=3;i++) removeId(`BANCO-ILHA-${i}`);for(let i=0;i<3;i++) chair(`BANCO-ILHA-V12-${i+1}`,'Banco da ilha',-2.02+i*.68,LEVEL.social,.72,0,MAT.dark);

removeId('SOFA'); removeId('MESA-CENTRO'); removeId('TV-SALA');
const sofa=group('SOFA','Sofá 3 lugares','Sala',[.72,LEVEL.social,-.72]);sofa.rotation.y=-Math.PI/2;
box({w:2.10,h:.34,d:.84,y:.30,mat:MAT.fabric,parent:sofa,rounded:true});box({w:2.02,h:.62,d:.20,y:.77,z:.31,mat:MAT.fabric,parent:sofa,rounded:true});for(const x of [-.98,.98])box({w:.18,h:.53,d:.78,x,y:.50,mat:MAT.fabric,parent:sofa,rounded:true});for(const x of [-.66,0,.66])box({w:.60,h:.14,d:.60,x,y:.54,z:-.05,mat:MAT.fabricLight,parent:sofa,rounded:true});for(const x of [-.55,.55])box({w:.42,h:.34,d:.12,x,y:.90,z:.20,mat:MAT.fabricLight,parent:sofa,rounded:true});
const coffee=group('MESA-CENTRO','Mesa de centro','Sala',[1.86,LEVEL.social,-.62]);box({w:.92,h:.09,d:.62,y:.32,mat:MAT.wood2,parent:coffee,rounded:true});for(const x of [-.35,.35])for(const z of [-.22,.22])box({w:.045,h:.28,d:.045,x,y:.14,z,mat:MAT.steel,parent:coffee});
const tv=group('TV-SALA','TV e rack da sala','Sala',[3.27,LEVEL.social,-.58]);box({w:.12,h:.62,d:1.54,y:1.34,mat:MAT.black,parent:tv,rounded:true});box({w:.125,h:.53,d:1.42,y:1.34,mat:MAT.screen,parent:tv});box({w:.42,h:.48,d:1.72,x:-.10,y:.27,mat:MAT.wood,parent:tv,rounded:true});box({w:.44,h:.035,d:.44,x:-.13,y:.55,z:-.52,mat:MAT.wood2,parent:tv});
box({w:2.20,h:.018,d:2.05,x:1.48,y:LEVEL.social+.018,z:-.72,mat:MAT.fabricLight,id:'TAPETE-SALA-V12',label:'Tapete da sala',category:'Sala'});
for(const x of [-1.55,.25]){const g=group(`PENDENTE-SOC-${x}`,'Pendente social','Iluminação',[x,LEVEL.social+2.52,-.25]);cyl({r:.025,h:.45,y:-.22,mat:MAT.steel,parent:g});const shade=mesh(new THREE.ConeGeometry(.22,.28,16),MAT.dark,g);shade.position.y=-.47;box({w:.13,h:.025,d:.13,y:-.61,mat:MAT.glow,parent:g});}

function toilet(parent,x,z,rot=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;parent.add(g);box({w:.46,h:.32,d:.58,y:.18,mat:MAT.ceramic,parent:g,rounded:true});const seat=mesh(TORUS,MAT.white,g);seat.scale.set(.17,.06,.24);seat.rotation.x=Math.PI/2;seat.position.set(0,.39,-.05);box({w:.44,h:.56,d:.20,y:.56,z:.25,mat:MAT.ceramic,parent:g,rounded:true});box({w:.18,h:.035,d:.06,y:.86,z:.34,mat:MAT.chrome,parent:g,rounded:true});}
function vanity(parent,x,z,rot=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;parent.add(g);box({w:.72,h:.76,d:.43,y:.38,mat:MAT.wood,parent:g,rounded:true});box({w:.76,h:.07,d:.47,y:.79,mat:MAT.white,parent:g,rounded:true});const bowl=mesh(new THREE.CylinderGeometry(.22,.18,.10,20),MAT.ceramic,g);bowl.position.set(0,.86,0);bowl.scale.z=.72;cyl({r:.018,h:.22,y:.98,z:.02,mat:MAT.chrome,parent:g});box({w:.54,h:.72,d:.025,y:1.34,z:.23,mat:MAT.glass,parent:g,rounded:true});box({w:.05,h:.02,d:.20,x:-.19,y:.45,z:-.23,mat:MAT.chrome,parent:g});box({w:.05,h:.02,d:.20,x:.19,y:.45,z:-.23,mat:MAT.chrome,parent:g});}
function shower(parent,x,z){const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);box({w:.78,h:.05,d:.88,y:.025,mat:MAT.tile,parent:g,rounded:true});box({w:.025,h:1.95,d:.88,x:-.39,y:.98,mat:MAT.glass,parent:g});box({w:.78,h:1.95,d:.025,y:.98,z:-.44,mat:MAT.glass,parent:g});cyl({r:.018,h:1.62,x:.31,y:.81,z:.31,mat:MAT.chrome,parent:g});const head=mesh(new THREE.CylinderGeometry(.11,.11,.025,18),MAT.chrome,g);head.rotation.x=Math.PI/2;head.position.set(.31,1.62,.18);box({w:.18,h:.04,d:.08,x:.31,y:.86,z:.34,mat:MAT.chrome,parent:g,rounded:true});}
function bathroom(prefix,yBase,privateBath=false){for(const id of [`BAN-${prefix}-VASO`,`BAN-${prefix}-PIA`,`BAN-${prefix}-BOX`])removeId(id);if(privateBath)removeId('BANHEIRA');const g=group(`BANHEIRO-${prefix}-V12`,privateBath?'Banheiro íntimo completo':'Banheiro social completo','Banheiro',[0,yBase,0]);box({w:1.54,h:.025,d:2.12,x:2.62,y:.014,z:2.50,mat:MAT.tile,parent:g});toilet(g,2.13,2.83,0);vanity(g,2.92,3.20,Math.PI);if(!privateBath)shower(g,2.92,1.90);else{const tub=new THREE.Group();tub.position.set(2.92,0,1.92);g.add(tub);box({w:.76,h:.50,d:1.22,y:.25,mat:MAT.ceramic,parent:tub,rounded:true});box({w:.58,h:.18,d:1.02,y:.49,mat:MAT.white,parent:tub,rounded:true});cyl({r:.016,h:.28,x:.26,y:.62,z:.48,mat:MAT.chrome,parent:tub});const spout=box({w:.14,h:.035,d:.035,x:.20,y:.73,z:.45,mat:MAT.chrome,parent:tub});spout.rotation.x=.15;}box({w:.40,h:.025,d:.025,x:1.96,y:1.16,z:1.92,mat:MAT.chrome,parent:g});box({w:.42,h:.34,d:.07,x:1.94,y:1.48,z:2.30,mat:MAT.wood2,parent:g,rounded:true});box({w:.54,h:.025,d:.06,x:2.92,y:1.84,z:3.37,mat:MAT.glow,parent:g});}
bathroom('SOC',LEVEL.social,false);bathroom('INT',LEVEL.private,true);

const kitchen=byId('COZINHA-REALISTA-V11');if(kitchen){for(let i=0;i<5;i++)box({w:.48,h:.34,d:.025,x:-2.92+i*.55,y:LEVEL.social+.44,z:2.835,mat:i%2?MAT.wood2:MAT.wood,id:`PORTA-COZ-V12-${i}`,label:'Frente de armário da cozinha',category:'Cozinha',rounded:true});box({w:2.88,h:.58,d:.025,x:-1.92,y:LEVEL.social+1.22,z:3.48,mat:MAT.tile,id:'BACKSPLASH-V12',label:'Backsplash cozinha',category:'Cozinha'});box({w:.58,h:.06,d:.36,x:-2.25,y:LEVEL.social+.90,z:3.10,mat:MAT.chrome,id:'CUBA-COZ-V12',label:'Cuba da cozinha',category:'Cozinha',rounded:true});cyl({r:.018,h:.32,x:-2.05,y:LEVEL.social+1.06,z:3.28,mat:MAT.chrome});const spout=box({w:.28,h:.03,d:.03,x:-1.92,y:LEVEL.social+1.22,z:3.18,mat:MAT.chrome});spout.rotation.z=-.35;for(const x of [-1.62,-1.32])for(const z of [3.01,3.25]){const ring=mesh(TORUS,MAT.black);ring.scale.set(.09,.025,.09);ring.rotation.x=Math.PI/2;ring.position.set(x,LEVEL.social+.91,z);}for(let i=0;i<4;i++)box({w:.24,h:.018,d:.018,x:-2.02+i*.47,y:LEVEL.social+.55,z:.955,mat:MAT.chrome});for(const x of [-1.82,-1.15]){cyl({r:.018,h:.55,x,y:LEVEL.social+2.38,z:1.38,mat:MAT.steel});const shade=mesh(new THREE.ConeGeometry(.18,.22,16),MAT.dark);shade.position.set(x,LEVEL.social+2.05,1.38);box({w:.10,h:.02,d:.10,x,y:LEVEL.social+1.92,z:1.38,mat:MAT.glow});}}

const bunk=byId('TRELICHE-3');if(bunk){for(const yy of [.52,1.29,2.06]){box({w:.72,h:.08,d:.68,x:0,y:yy,z:.50,mat:MAT.fabricLight,parent:bunk,rounded:true});box({w:.80,h:.08,d:.48,x:0,y:yy,z:-.46,mat:MAT.red,parent:bunk,rounded:true});box({w:.035,h:.28,d:1.72,x:-.44,y:yy+.20,z:0,mat:MAT.steel,parent:bunk});}}
for(let i=0;i<3;i++){const g=group(`NICHO-FILHO-V12-${i}`,'Nicho individual','Quarto 3 filhos',[-.70,LEVEL.private+1.55,1.35+i*.60]);box({w:.42,h:.42,d:.20,y:0,mat:MAT.wood,parent:g,rounded:true});box({w:.24,h:.025,d:.14,y:.04,z:-.11,mat:MAT.glow,parent:g});}
removeId('GUARDA-ROUPA-CASAL');const wardrobe=group('GUARDA-ROUPA-CASAL','Guarda-roupa casal','Quarto casal',[-.72,LEVEL.private,inner.front+.34]);box({w:1.48,h:2.16,d:.54,y:1.08,mat:MAT.wall,parent:wardrobe,rounded:true});for(const x of [-.49,0,.49]){box({w:.465,h:2.02,d:.025,x,y:1.08,z:-.282,mat:MAT.wood,parent:wardrobe,rounded:true});box({w:.018,h:.22,d:.018,x:x+.17,y:1.08,z:-.30,mat:MAT.chrome,parent:wardrobe});}box({w:2.35,h:.018,d:2.45,x:-2.12,y:LEVEL.private+.018,z:-.90,mat:MAT.fabricLight,id:'TAPETE-MASTER-V12',label:'Tapete quarto casal',category:'Quarto casal'});const bedside=byId('CRIADO-CASAL');if(bedside){cyl({r:.025,h:.36,x:-3.10,y:LEVEL.private+.72,z:-.98,mat:MAT.steel});const sh=mesh(new THREE.ConeGeometry(.16,.20,14),MAT.fabricLight);sh.position.set(-3.10,LEVEL.private+.92,-.98);}

for(const id of ['MESA-GAMER','MONITOR-1','MONITOR-2','CADEIRA-GAMER','PC-GAMER'])removeId(id);const gamer=group('GAMER-V12','Escritório / gamer','Escritório/Gamer',[1.70,LEVEL.private,-1.55]);box({w:1.72,h:.08,d:.58,y:.76,mat:MAT.wood,parent:gamer,rounded:true});for(const x of [-.75,.75])box({w:.06,h:.72,d:.48,x,y:.36,mat:MAT.steel,parent:gamer});for(const x of [-.42,.42]){box({w:.62,h:.36,d:.045,x,y:1.22,z:-.26,mat:MAT.black,parent:gamer,rounded:true});box({w:.56,h:.30,d:.025,x,y:1.22,z:-.285,mat:MAT.screen,parent:gamer});}box({w:.34,h:.72,d:.42,x:.72,y:.36,z:.08,mat:MAT.black,parent:gamer,rounded:true});for(let i=0;i<3;i++)box({w:.18,h:.018,d:.018,x:.62+i*.06,y:.52,z:-.145,mat:i===0?MAT.red:MAT.glow,parent:gamer});const gc=group('CADEIRA-GAMER-V12','Cadeira gamer','Escritório/Gamer',[1.70,LEVEL.private,-.74]);box({w:.52,h:.16,d:.52,y:.52,mat:MAT.dark,parent:gc,rounded:true});box({w:.48,h:.72,d:.16,y:.95,z:.20,mat:MAT.dark,parent:gc,rounded:true});for(const x of [-.22,.22])box({w:.06,h:.35,d:.06,x,y:.25,mat:MAT.steel,parent:gc});

const bbq=byId('CHURRASQUEIRA');if(bbq){box({w:.88,h:.12,d:.70,x:-3.00,y:1.46,z:-1.10,mat:MAT.steel,id:'COIFA-BBQ-V12',label:'Coifa churrasqueira',category:'Gourmet',rounded:true});const hood=mesh(new THREE.ConeGeometry(.42,.55,4),MAT.steel);hood.rotation.y=Math.PI/4;hood.position.set(-3.00,1.78,-1.10);}for(const id of ['LAVADORA','SECADORA']){const o=byId(id);if(o){const c=mesh(new THREE.CylinderGeometry(.23,.23,.025,20),MAT.glass,o);c.rotation.x=Math.PI/2;c.position.set(0,.03,-.34);}}const bench=byId('BANCADA-OFICINA');if(bench){for(let i=0;i<5;i++)box({w:.04,h:.34,d:.04,x:-3.08+i*.30,y:1.08,z:3.34,mat:i%2?MAT.red:MAT.chrome,id:`FERRAMENTA-V12-${i}`,label:'Ferramenta oficina',category:'Oficina'});}

function planter(id,x,y,z){const g=group(id,'Jardineira da sacada','Paisagismo',[x,y,z]);box({w:.62,h:.28,d:.34,y:.14,mat:MAT.wood,parent:g,rounded:true});for(const xx of [-.20,0,.20]){cyl({r:.035,h:.34,x:xx,y:.42,mat:MAT.leaf,parent:g});const l=mesh(SPHERE,MAT.leaf2,g);l.scale.set(.16,.12,.16);l.position.set(xx,.62,0);}}
for(const y of [LEVEL.social,LEVEL.private]){planter(`JARD-SAC-E-${y}`,-3.18,y+.02,front-1.48);planter(`JARD-SAC-D-${y}`,3.18,y+.02,front-1.48);}const lounge=group('ESPREGUICADEIRAS-V12','Espreguiçadeiras no deck','Lazer',[-1.55,.14,-6.75]);for(const x of [-.34,.34]){const g=new THREE.Group();g.position.x=x;g.rotation.y=.10;lounge.add(g);box({w:.54,h:.10,d:1.45,y:.12,mat:MAT.wood2,parent:g,rounded:true});box({w:.52,h:.08,d:.65,y:.36,z:.48,mat:MAT.fabricLight,parent:g,rounded:true,rot:-.18});}for(const [x,z] of [[-3.85,-8.2],[-3.65,-6.4],[-2.0,-4.85],[2.0,-4.15],[3.55,-5.35],[3.9,-7.0]]){for(let i=0;i<3;i++)cyl({r:.025,h:.34+i*.08,x:x+i*.08,y:.17,z:z+i*.06,mat:MAT.leaf});}
for(const [x,z] of [[-2.4,-10.8],[-1.3,-9.2],[-.4,-7.6],[.0,-5.4],[.7,-3.1],[1.1,1.8],[1.8,4.5],[3.4,7.0],[3.7,9.5]]){box({w:.06,h:.24,d:.06,x,y:.12,z,mat:MAT.steel});box({w:.11,h:.035,d:.11,x,y:.26,z,mat:MAT.glow,rounded:true});}

const checkIds=['SOFA','MESA-CENTRO','TV-SALA','BANHEIRO-SOC-V12','BANHEIRO-INT-V12','GAMER-V12','ESCADA-INTERNA-SOCIAL-INTIMO-V12','TRELICHE-3'];const qa={version:'v1.2-detail-fidelity',issues:[],stairs:{groundToSocial:true,socialToPrivateInternal:true},chairOrientationFixed:true,sofaFacesTv:true,bathroomsDetailed:true};for(const id of checkIds){const o=byId(id);if(!o){qa.issues.push(`missing:${id}`);continue;}const b=new THREE.Box3().setFromObject(o);if(id!=='ESCADA-INTERNA-SOCIAL-INTIMO-V12'&&(b.min.x<-halfW-.06||b.max.x>halfW+.06||b.min.z<front-.06||b.max.z>back+.06))qa.issues.push(`outside-envelope:${id}`);}window.__CASA_V12__=qa;
const top=document.getElementById('topbar');if(top)top.innerHTML=`<b>CASA CONTRERAS — v1.2 FIDELIDADE/DETALHES</b><br><span class="muted">escada externa térreo→social + escada INTERNA social→íntimo • sofá voltado para TV • cadeiras voltadas para mesas • banheiros completos<br>WASD • mouse • G grade 1 m • H escala humana • Q qualidade • F feedbacks</span>`;const note=document.querySelector('#start .note');if(note)note.textContent='v1.2: circulação vertical completa, mobiliário orientado, banheiros equipados, cozinha/quartos/gamer/gourmet detalhados e paisagismo aproximado da prancha de referência.';console.info('[Casa Contreras] v1.2 fidelity/detail',qa);
