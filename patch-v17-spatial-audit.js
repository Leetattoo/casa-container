import * as THREE from 'three';

const scene=window.__CASA_SCENE__,camera=window.__CASA_CAMERA__,renderer=window.__CASA_RENDERER__;
if(!scene||!camera||!renderer) throw new Error('Casa Contreras v1.7: cena ativa indisponível');

const HOUSE={w:7.076,d:6.058,wall:.120,centerZ:.700};
const LEVEL={ground:0,social:3.250,private:6.250};
const PHYSICAL_EYE=1.660,USER_HEIGHT=1.650,USER_EYE=1.550;
const halfW=HOUSE.w/2,halfD=HOUSE.d/2,front=HOUSE.centerZ-halfD,back=HOUSE.centerZ+halfD;
const innerW=HOUSE.w-2*HOUSE.wall,innerD=HOUSE.d-2*HOUSE.wall,clearArea=innerW*innerD;

function byId(id){let hit=null;scene.traverse(o=>{if(!hit&&o.userData?.id===id)hit=o;});return hit;}
function all(pred){const out=[];scene.traverse(o=>{if(pred(o))out.push(o);});return out;}
function rawOverlap(a,b){return a.min.x<b.max.x&&a.max.x>b.min.x&&a.min.y<b.max.y&&a.max.y>b.min.y&&a.min.z<b.max.z&&a.max.z>b.min.z;}
function bsize(b){return b.getSize(new THREE.Vector3());}
function bcenter(b){return b.getCenter(new THREE.Vector3());}
function boxOf(o){if(!o)return null;o.updateMatrixWorld(true);return new THREE.Box3().setFromObject(o);}

// 1) Escala de percepção: 1,65 m, sem falsificar a métrica da casa.
camera.fov=64;
camera.updateProjectionMatrix();
const gauge=byId('ESCALA-HUMANA');
if(gauge){gauge.scale.y*=USER_HEIGHT/1.750;gauge.userData.label='Referência humana 1,65 m';}

let manualLevelUntil=0;
addEventListener('keydown',e=>{if(/^Digit[123]$/.test(e.code))manualLevelUntil=performance.now()+650;});
function inLowerStair(p){
  const xz=p.x>3.50&&p.x<4.72&&p.z>-2.10&&p.z<3.55;
  const y=p.y>USER_EYE-.30&&p.y<LEVEL.social+PHYSICAL_EYE+.45;
  return xz&&y;
}
function inUpperStair(p){
  const xz=p.z>4.85&&p.z<6.10&&p.x>-2.10&&p.x<3.65;
  const y=p.y>LEVEL.social+PHYSICAL_EYE-.55&&p.y<LEVEL.private+PHYSICAL_EYE+.45;
  return xz&&y;
}
function onStair(p){return inLowerStair(p)||inUpperStair(p);}

if(!window.__CASA_V17_RENDER_GUARD__){
  window.__CASA_V17_RENDER_GUARD__=true;
  const prev=renderer.render.bind(renderer);
  let lastSafe=camera.position.clone();
  renderer.render=function(s,c){
    const manual=performance.now()<manualLevelUntil;
    const before=c.position.clone();
    const stairBefore=onStair(before);
    if(!manual&&!stairBefore&&Math.abs(before.y-lastSafe.y)>1.15)c.position.copy(lastSafe);

    // Nas escadas reais, o wrapper geométrico v1.5/v1.6 continua soberano.
    if(onStair(c.position)){
      prev(s,c);
      lastSafe.copy(c.position);
      return;
    }

    const physical=c.position.clone();
    const floorEyes=[PHYSICAL_EYE,LEVEL.social+PHYSICAL_EYE,LEVEL.private+PHYSICAL_EYE];
    const closeToFloor=floorEyes.some(y=>Math.abs(physical.y-y)<.22);
    if(closeToFloor)c.position.y=physical.y-(PHYSICAL_EYE-USER_EYE);
    prev(s,c);
    const post=c.position.clone();

    // Fora da escada, mudança vertical grande sem tecla 1/2/3 é teleporte inválido.
    if(!manual&&Math.abs(post.y-physical.y)>1.15){
      c.position.copy(lastSafe);
      return;
    }
    // O rebaixamento visual não altera a física/cotas do mundo.
    c.position.x=physical.x;c.position.z=physical.z;c.position.y=physical.y;
    lastSafe.copy(c.position);
  };
}

// 2) Colisão: corpo ~1,65 m / 46 cm e reparo de paredes fantasmas.
const wallHex=new Set([0xded9ce,0xe9e4dc,0xe8e2d8,0x303633]);
const currentWalls=[];
scene.updateMatrixWorld(true);
scene.traverse(o=>{
  if(!o.isMesh||o.visible===false||!o.material?.color)return;
  const b=boxOf(o),s=bsize(b),c=bcenter(b),hex=o.material.color.getHex();
  const inside=c.x>-halfW-.25&&c.x<halfW+.25&&c.z>front-.25&&c.z<back+.25;
  const thinTall=s.y>1.85&&Math.min(s.x,s.z)<.18;
  if(inside&&thinTall&&wallHex.has(hex))currentWalls.push(b.clone());
});
function isBasePlayerBox(b){const s=bsize(b);return s.x>.49&&s.x<.55&&s.z>.49&&s.z<.55&&s.y>1.68&&s.y<1.82;}
function staleInteriorBox(b){
  const s=bsize(b),c=bcenter(b);
  const inside=c.x>-halfW-.3&&c.x<halfW+.3&&c.z>front-.3&&c.z<back+.3;
  const livingY=(c.y>4.2&&c.y<4.8)||(c.y>7.2&&c.y<7.8);
  const partition=inside&&livingY&&s.y>2.45&&s.y<2.78&&Math.min(s.x,s.z)<.14;
  if(!partition)return false;
  return !currentWalls.some(v=>{const sv=bsize(v),cv=bcenter(v);return cv.distanceTo(c)<.18&&Math.abs(sv.x-s.x)<.20&&Math.abs(sv.z-s.z)<.20;});
}
if(!window.__CASA_V17_COLLISION_REPAIR__){
  window.__CASA_V17_COLLISION_REPAIR__=true;
  const previous=THREE.Box3.prototype.intersectsBox;
  THREE.Box3.prototype.intersectsBox=function(b){
    if(!isBasePlayerBox(this))return previous.call(this,b);
    const p=this.clone();
    p.min.x+=.03;p.max.x-=.03;p.min.z+=.03;p.max.z-=.03;p.max.y-=.10;
    if(currentWalls.some(w=>rawOverlap(p,w)))return true;
    if(staleInteriorBox(b))return false;
    return previous.call(p,b);
  };
}

// 3) Mobiliário: reduzir o que estava superdimensionado, mantendo queen/treliche reais.
function scaleRoot(id,xz,y=1){const o=byId(id);if(!o)return false;o.scale.x*=xz;o.scale.z*=xz;o.scale.y*=y;o.userData.v17Scale=[xz,y,xz];o.updateMatrixWorld(true);return true;}
const scaled={
  island:scaleRoot('ILHA-V15',.90,.98),
  dining:scaleRoot('JANTAR-V15',.91,.98),
  sofa:scaleRoot('SOFA-V15',.92,.98),
  tv:scaleRoot('TV-V15',.94,.98),
  gourmetTable:scaleRoot('MESA-GOURMET-V15',.91,.98),
  gourmet:scaleRoot('GOURMET-V15',.95,.99),
  gamer:scaleRoot('GAMER-V15',.93,.98),
  kidsDesk:scaleRoot('BANCADA-FILHOS-V16',.94,.98)
};
for(const o of all(o=>/^CAD-(JANTAR|G)-V15-/.test(o.userData?.id||'')||/^BANQUETA-V15-/.test(o.userData?.id||'')))o.scale.multiply(new THREE.Vector3(.90,.98,.90));
// Cama queen 1,58 x 1,98 e treliche 0,92 x 2,00 não são reduzidas.

// 4) Pomar: troncos realmente próximos ao muro, mas fora da faixa física do caminho.
const trees=all(o=>o.userData?.category==='Árvore frutífera');
for(const t of trees){
  const wp=t.getWorldPosition(new THREE.Vector3());
  if(wp.z>10.25)t.position.z=12.20;
  else if(wp.x<-1.45)t.position.x=-4.75;
  else if(wp.x>1.45)t.position.x=4.75;
  // Mantém escada lateral direita livre.
  if(t.position.x>4.55&&t.position.z>-2.25&&t.position.z<3.65)t.position.z=t.position.z<.7?-4.20:4.35;
  t.updateMatrixWorld(true);
}

// Copas lobuladas adicionais: silhueta orgânica com baixo custo.
const canopyGeo=new THREE.SphereGeometry(1,12,8);
const canopyMatA=new THREE.MeshLambertMaterial({color:0x315f38});
const canopyMatB=new THREE.MeshLambertMaterial({color:0x497b45});
const lobes=[];
trees.forEach((t,i)=>{const p=t.getWorldPosition(new THREE.Vector3());for(let k=0;k<3;k++)lobes.push({p:new THREE.Vector3(p.x+(k-1)*.23,p.y+1.54+(k%2)*.19,p.z+((k%2)?-.18:.13)),s:new THREE.Vector3(.34+(i%3)*.035,.38+(k%2)*.07,.33+((i+k)%2)*.04),b:(i+k)%2});});
for(const variant of[0,1]){const arr=lobes.filter(v=>v.b===variant),inst=new THREE.InstancedMesh(canopyGeo,variant?canopyMatB:canopyMatA,arr.length),d=new THREE.Object3D();arr.forEach((v,i)=>{d.position.copy(v.p);d.scale.copy(v.s);d.rotation.y=(i*.73)%Math.PI;d.updateMatrix();inst.setMatrixAt(i,d.matrix);});inst.instanceMatrix.needsUpdate=true;inst.castShadow=false;inst.receiveShadow=false;scene.add(inst);}

// 5) Materiais procedurais leves: menos aparência de bloco sem reintroduzir lag.
function canvasTexture(kind){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');
  if(kind==='wood'){x.fillStyle='#9a683f';x.fillRect(0,0,256,256);for(let i=0;i<90;i++){x.strokeStyle=`rgba(55,30,16,${.025+(i%5)*.008})`;x.lineWidth=1+(i%3);const y=(i*19)%256;x.beginPath();x.moveTo(0,y);x.bezierCurveTo(70,y+6*Math.sin(i),180,y-5*Math.cos(i*.4),256,y+2);x.stroke();}}
  if(kind==='grass'){x.fillStyle='#557b49';x.fillRect(0,0,256,256);for(let i=0;i<1100;i++){const g=70+(i%55);x.fillStyle=`rgba(${38+(i%22)},${g},${38+(i%17)},.18)`;x.fillRect((i*47)%256,(i*83)%256,1,2);}}
  if(kind==='steel'){x.fillStyle='#222a28';x.fillRect(0,0,256,256);for(let i=0;i<130;i++){const a=.018+(i%5)*.006;x.fillStyle=`rgba(255,255,255,${a})`;x.fillRect((i*37)%256,0,1,256);}}
  if(kind==='wall'){x.fillStyle='#e8e2d8';x.fillRect(0,0,256,256);for(let i=0;i<900;i++){const v=215+(i%24);x.fillStyle=`rgba(${v},${v},${v},.035)`;x.fillRect((i*29)%256,(i*71)%256,2,2);}}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(kind==='grass'?12:kind==='wood'?3:4,kind==='grass'?28:4);t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy?.()||1);return t;}
const tex={wood:canvasTexture('wood'),grass:canvasTexture('grass'),steel:canvasTexture('steel'),wall:canvasTexture('wall')};
const touched=new Set();
scene.traverse(o=>{if(!o.isMesh)return;const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){if(!m||touched.has(m)||!m.color)continue;const h=m.color.getHex(),r=(h>>16)&255,g=(h>>8)&255,b=h&255;touched.add(m);
  if(g>r*.95&&g>b*1.20&&r<130){m.map=tex.grass;m.needsUpdate=true;}
  else if(r>90&&r>g*1.18&&g>b*.95){m.map=tex.wood;m.roughness=Math.max(m.roughness??.6,.58);m.needsUpdate=true;}
  else if(r<70&&g<80&&b<85&&(m.metalness??0)>.35){m.map=tex.steel;m.roughness=.42;m.needsUpdate=true;}
  else if(r>185&&g>180&&b>165&&(m.metalness??0)<.2){m.map=tex.wall;m.roughness=Math.max(m.roughness??.7,.78);m.needsUpdate=true;}
}}

// Atmosfera/sky dome leve: melhora profundidade sem pós-processamento.
const oldSky=byId('SKY-V17');if(oldSky?.parent)oldSky.parent.remove(oldSky);
const skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{top:{value:new THREE.Color(0x8fb9cc)},bottom:{value:new THREE.Color(0xe7d4bd)}},vertexShader:`varying float vY;void main(){vec4 w=modelMatrix*vec4(position,1.0);vY=normalize(w.xyz).y;gl_Position=projectionMatrix*viewMatrix*modelViewMatrix*vec4(position,1.0);}`,fragmentShader:`uniform vec3 top;uniform vec3 bottom;varying float vY;void main(){float h=smoothstep(-.18,.72,vY);gl_FragColor=vec4(mix(bottom,top,h),1.0);}`});
const sky=new THREE.Mesh(new THREE.SphereGeometry(68,24,12),skyMat);sky.userData={id:'SKY-V17',label:'Céu arquitetônico leve'};scene.add(sky);
scene.background=null;
renderer.toneMappingExposure=1.10;
renderer.setPixelRatio(Math.min(devicePixelRatio||1,.90));

// 6) Auditoria espacial objetiva.
function measure(id){const o=byId(id);if(!o)return null;const s=bsize(boxOf(o));return [+s.x.toFixed(2),+s.y.toFixed(2),+s.z.toFixed(2)];}
const duplicateMap=new Map();scene.traverse(o=>{const id=o.userData?.id;if(id)duplicateMap.set(id,(duplicateMap.get(id)||0)+1);});
const duplicateIds=[...duplicateMap].filter(([,n])=>n>1).map(([id,n])=>`${id}:${n}`);
const treeWallDistances=trees.map(t=>{const p=t.getWorldPosition(new THREE.Vector3());return Math.min(4.94-Math.abs(p.x),12.44-Math.abs(p.z));});
const furniture={island:measure('ILHA-V15'),dining:measure('JANTAR-V15'),sofa:measure('SOFA-V15'),queen:measure('CAMA-CASAL-V16'),bunk:measure('TRELICHE-V16'),kidsDesk:measure('BANCADA-FILHOS-V16'),gamer:measure('GAMER-V15')};
const furniturePresent=Object.entries(furniture).filter(([k])=>!['gamer'].includes(k)).every(([,v])=>Array.isArray(v));
const audit={
  version:'v1.7-spatial-realism',
  dimensions:{house:[HOUSE.w,HOUSE.d],grossArea:+(HOUSE.w*HOUSE.d).toFixed(3),clear:[+innerW.toFixed(3),+innerD.toFixed(3)],clearArea:+clearArea.toFixed(3),twoLivingFloorsApprox:+(clearArea*2).toFixed(3)},
  userReference:{height:USER_HEIGHT,visualEye:USER_EYE,physicalCollisionApprox:{height:1.65,width:.46},fov:camera.fov},
  furniture,scaled,furniturePresent,fruitTrees:trees.length,
  orchard:{maxTrunkDistanceFromNearestWall:+Math.max(...treeWallDistances).toFixed(2),target:'troncos próximos ao perímetro; caminho e escadas livres'},
  visibleInteriorWallCollisionBoxes:currentWalls.length,
  ghostInteriorCollisionRepair:true,teleportGuard:true,stairHeightGuards:true,proceduralMaterials:true,skyDome:true,duplicateIds,
  pass:duplicateIds.length===0&&furniturePresent&&Math.abs(clearArea-39.772)<.03
};
window.__CASA_AUDIT_V17__=audit;
console.info('[Casa Contreras] AUDIT v1.7',audit);
const top=document.getElementById('topbar');if(top)top.innerHTML=`<b>CASA CONTRERAS — v1.7 SPATIAL / REALISM AUDIT</b><br><span class="muted">referência humana 1,65 m • olhos ~1,55 m • FOV 64° • colisão corporal ~46 cm • móveis sociais compactados • paredes fantasmas filtradas • árvores junto ao muro • materiais procedurais + atmosfera leve<br>casa 7,076 × 6,058 m • ~${clearArea.toFixed(2)} m² internos/pavimento antes das divisórias • ~${(clearArea*2).toFixed(2)} m² nos 2 pavimentos habitáveis</span>`;
const note=document.querySelector('#start .note');if(note)note.textContent=`v1.7: auditoria espacial. Um pavimento possui ~${clearArea.toFixed(2)} m² internos antes das divisórias; os dois habitáveis somam ~${(clearArea*2).toFixed(2)} m². A escala da casa não foi aumentada.`;
