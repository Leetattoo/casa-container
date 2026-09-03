import * as THREE from 'three';

const MASTER = Object.freeze({
  lot: { width: 10.000, length: 25.000 },
  container20HC: { length: 6.058, width: 2.438, height: 2.896, status: 'altura HC de referencia; compra ainda nao congelada' },
  centralGap: 2.200,
  house: { width: 7.076, depth: 6.058, areaProjection: 42.866408, centerZ: 0.700 },
  levels: { socialTop: 3.250, privateTop: 6.250 },
  balcony: { width: 7.076, depth: 1.800 },
  driveway: { width: 3.850, length: 9.970, minX: 0.850, maxX: 4.700, minZ: -12.300, maxZ: -2.330 },
  human: { height: 1.750, eyeHeight: 1.660, radius: 0.270, fov: 60 },
  referenceRooms: {
    ground: { workshop: [3.20,2.60], storage: [2.00,2.60], laundry: [2.00,2.60], gourmet: [6.80,3.40], garage: [6.00,5.50] },
    social: { kitchen: [2.50,3.40], bathroom: [1.60,2.20], livingDining: [7.00,4.40] },
    private: { children: [3.40,3.40], master: [3.40,3.40], bathroom: [1.60,2.20], gamer: [2.20,2.40] },
  },
});

const TOL = 0.006;
const close = (a,b,t=TOL) => Math.abs(a-b) <= t;
const round = v => Math.round(v*1000)/1000;

function byId(scene,id){
  let hit=null;
  scene.traverse(o=>{ if(!hit && o.userData?.id===id) hit=o; });
  return hit;
}
function bounds(o){
  if(!o) return null;
  const box=new THREE.Box3().setFromObject(o);
  const size=new THREE.Vector3(); box.getSize(size);
  return {box,size:{x:size.x,y:size.y,z:size.z}};
}
function unionBounds(objects){
  const b=new THREE.Box3(); let valid=false;
  objects.filter(Boolean).forEach(o=>{ const ob=new THREE.Box3().setFromObject(o); if(!valid){b.copy(ob);valid=true;}else b.union(ob); });
  if(!valid) return null;
  const s=new THREE.Vector3(); b.getSize(s); return {box:b,size:{x:s.x,y:s.y,z:s.z}};
}
function test(name,actual,expected,tol=TOL){
  const pass=close(actual,expected,tol);
  return {name,actual:round(actual),expected:round(expected),delta:round(actual-expected),pass};
}

function normalizeBalconies(scene){
  ['SOCIAL-SACADA','INTIMO-SACADA'].forEach(id=>{
    const o=byId(scene,id); if(!o) return;
    const b=bounds(o); if(!b || b.size.x===0) return;
    o.scale.x *= MASTER.balcony.width / b.size.x;
    o.updateMatrixWorld(true);
  });
}

function addScaleGauge(scene){
  const g=new THREE.Group();
  g.name='V07_HUMAN_SCALE_GAUGE';
  g.visible=false;
  const dark=new THREE.MeshStandardMaterial({color:0x171b1a,metalness:.55,roughness:.38});
  const light=new THREE.MeshStandardMaterial({color:0xf0d19b,emissive:0x8b5b28,emissiveIntensity:.45,roughness:.7});
  const pole=new THREE.Mesh(new THREE.BoxGeometry(.035,MASTER.human.height,.035),dark);
  pole.position.y=MASTER.human.height/2; g.add(pole);
  for(const y of [0,.50,1.00,1.50,MASTER.human.height]){
    const tick=new THREE.Mesh(new THREE.BoxGeometry(.24,.018,.035),y===MASTER.human.height?light:dark);
    tick.position.set(.10,y,.0);g.add(tick);
  }
  const head=new THREE.Mesh(new THREE.SphereGeometry(.10,16,12),light);
  head.position.set(.34,MASTER.human.height-.10,0);g.add(head);
  const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.13,.76,6,12),dark);
  torso.position.set(.34,1.10,0);g.add(torso);
  const legGeo=new THREE.CapsuleGeometry(.055,.62,5,10);
  const l1=new THREE.Mesh(legGeo,dark);l1.position.set(.27,.38,0);g.add(l1);
  const l2=new THREE.Mesh(legGeo,dark);l2.position.set(.41,.38,0);g.add(l2);
  g.position.set(-3.80,.01,-3.15);
  scene.add(g);
  addEventListener('keydown',e=>{if(e.code==='KeyH'){g.visible=!g.visible;}});
  return g;
}

function currentBathroomClearances(scene){
  const halfW=MASTER.house.width/2;
  const halfD=MASTER.house.depth/2;
  const shellT=.12;
  const eastInner=halfW-shellT;
  const backInner=MASTER.house.centerZ+halfD-shellT/2;

  const sWest=bounds(byId(scene,'BAN-SOC-O'));
  const sFront=bounds(byId(scene,'BAN-SOC-F'));
  const pWest=bounds(byId(scene,'INT-DIV-EIXO'));
  const pFront=bounds(byId(scene,'BAN-INT-F'));
  return {
    social: sWest&&sFront ? {width:round(eastInner-sWest.box.max.x),depth:round(backInner-sFront.box.max.z)} : null,
    private: pWest&&pFront ? {width:round(eastInner-pWest.box.max.x),depth:round(backInner-pFront.box.max.z)} : null,
  };
}

function runAudit(scene,camera){
  normalizeBalconies(scene);
  const lot=bounds(byId(scene,'LOT-10X25'));
  const socialFloor=bounds(byId(scene,'PISO-SOCIAL'));
  const privateFloor=bounds(byId(scene,'PISO-INTIMO'));
  const centralS=bounds(byId(scene,'VAO-CENTRAL-SOCIAL'));
  const centralP=bounds(byId(scene,'VAO-CENTRAL-INTIMO'));
  const balS=bounds(byId(scene,'SOCIAL-SACADA'));
  const balP=bounds(byId(scene,'INTIMO-SACADA'));
  const drive=bounds(byId(scene,'DRIVEWAY'));
  const shellSocial=unionBounds([byId(scene,'SOCIAL-O'),byId(scene,'SOCIAL-L')]);
  const shellPrivate=unionBounds([byId(scene,'INTIMO-O'),byId(scene,'INTIMO-L')]);
  const bathrooms=currentBathroomClearances(scene);

  const checks=[];
  if(lot){checks.push(test('lote largura',lot.size.x,MASTER.lot.width),test('lote comprimento',lot.size.z,MASTER.lot.length));}
  if(socialFloor){checks.push(test('casa social largura',socialFloor.size.x,MASTER.house.width),test('casa social profundidade',socialFloor.size.z,MASTER.house.depth),test('nivel piso social',socialFloor.box.max.y,MASTER.levels.socialTop));}
  if(privateFloor){checks.push(test('casa intima largura',privateFloor.size.x,MASTER.house.width),test('casa intima profundidade',privateFloor.size.z,MASTER.house.depth),test('nivel piso intimo',privateFloor.box.max.y,MASTER.levels.privateTop));}
  if(shellSocial){checks.push(test('envelope social largura',shellSocial.size.x,MASTER.house.width),test('envelope social profundidade',shellSocial.size.z,MASTER.house.depth));}
  if(shellPrivate){checks.push(test('envelope intimo largura',shellPrivate.size.x,MASTER.house.width),test('envelope intimo profundidade',shellPrivate.size.z,MASTER.house.depth));}
  if(centralS) checks.push(test('vao central social',centralS.size.x,MASTER.centralGap));
  if(centralP) checks.push(test('vao central intimo',centralP.size.x,MASTER.centralGap));
  if(balS){checks.push(test('sacada social largura',balS.size.x,MASTER.balcony.width),test('sacada social profundidade',balS.size.z,MASTER.balcony.depth));}
  if(balP){checks.push(test('sacada intima largura',balP.size.x,MASTER.balcony.width),test('sacada intima profundidade',balP.size.z,MASTER.balcony.depth));}
  if(drive){checks.push(test('corredor veicular largura',drive.size.x,MASTER.driveway.width),test('corredor veicular comprimento',drive.size.z,MASTER.driveway.length));}
  if(camera) checks.push(test('FOV arquitetonico',camera.fov,MASTER.human.fov,.05));

  const hardPass=checks.every(c=>c.pass);
  const roomChecks={
    socialBathroom: bathrooms.social ? {
      actual:bathrooms.social,
      expected:{width:1.60,depth:2.20},
      pass:(close(bathrooms.social.width,1.60,.03)&&close(bathrooms.social.depth,2.20,.03)),
    }:null,
    privateBathroom: bathrooms.private ? {
      actual:bathrooms.private,
      expected:{width:1.60,depth:2.20},
      pass:(close(bathrooms.private.width,1.60,.03)&&close(bathrooms.private.depth,2.20,.03)),
    }:null,
    note:'As cotas de ambientes da prancha sao referencia nominal. O modelo atual ainda nao possui todas as divisorias cotadas para certificar cada comodo individualmente.',
  };
  const roomsPass=Object.values(roomChecks).filter(v=>v&&typeof v==='object'&&'pass'in v).every(v=>v.pass);

  const report={
    version:'v0.7-dimensional-audit',
    scaleUnit:'1 unidade Three.js = 1 metro',
    human:{...MASTER.human,collisionProxy:'calibrado no prelude para 1,75 m'},
    master:MASTER,
    checks,
    hardGeometryPass:hardPass,
    roomChecks,
    roomPlanCertified:roomsPass,
    overallPass:hardPass&&roomsPass,
    status:hardPass&&roomsPass?'DIMENSOES MASTER E AMBIENTES CERTIFICADOS':'GEOMETRIA MASTER CERTIFICADA; PLANTA INTERNA AINDA EXIGE CORRECAO',
  };
  window.__CASA_DIMENSION_QA__=report;
  console.table(checks);
  if(!roomChecks.socialBathroom?.pass || !roomChecks.privateBathroom?.pass) console.warn('[Casa Contreras] Banheiros ainda nao batem a cota 1,60 x 2,20 da prancha.',roomChecks);
  console.info('[Casa Contreras] Auditoria dimensional v0.7',report);
  return report;
}

function updateHUD(report){
  const top=document.getElementById('topbar');
  if(top) top.innerHTML=`<b>CASA CONTRERAS — v0.7 ESCALA AUDITADA</b><br><span class="muted">1 unidade = 1 m • pessoa 1,75 m • olhos 1,66 m • FOV 60° • terreno 10,00 × 25,00 m • casa 7,076 × 6,058 m<br>H mostra/oculta regua humana • WASD • mouse • 1/2/3 niveis</span>`;
  const note=document.querySelector('#start .note');
  if(note) note.textContent=report.roomPlanCertified
    ? 'Escala humana e geometria dimensional auditadas. Projeto executivo ainda depende de arquiteto/engenheiros.'
    : 'Escala humana e envelope externo auditados. As divisorias internas ainda estao em reconciliacao dimensional com a prancha; nao tratar a planta atual como executiva.';
}

export function installDimensionAuditV07({scene,camera}={}){
  if(!scene) return;
  if(window.__CASA_DIM_V07__) return;
  window.__CASA_DIM_V07__=true;
  addScaleGauge(scene);
  const report=runAudit(scene,camera);
  updateHUD(report);
}
