import * as THREE from 'three';

const scene=window.__CASA_SCENE__,renderer=window.__CASA_RENDERER__,camera=window.__CASA_CAMERA__;
if(!scene||!renderer||!camera) throw new Error('Casa Contreras v1.16: cena indisponível');

const HOUSE={w:7.076,d:6.058,centerZ:.700,wall:.120};
const LEVEL={social:3.250,private:6.250,roof:9.220};
const halfW=HOUSE.w/2,halfD=HOUSE.d/2,front=HOUSE.centerZ-halfD,back=HOUSE.centerZ+halfD;

function byId(id){let h=null;scene.traverse(o=>{if(!h&&o.userData?.id===id)h=o;});return h;}
function removeId(id){const o=byId(id);if(o?.parent)o.parent.remove(o);}
function tag(o,id,label,category='Acabamento'){o.userData={...o.userData,id,label,category,selectable:true};return o;}
function box(parent,w,h,d,x,y,z,mat,rot=0){const m=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),mat);m.scale.set(w,h,d);m.position.set(x,y,z);m.rotation.y=rot;m.castShadow=false;m.receiveShadow=false;parent.add(m);return m;}
function seeded(seed=1337){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296);}

renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.04;
renderer.shadowMap.enabled=false;
renderer.setPixelRatio(Math.min(devicePixelRatio||1,.94));
scene.fog=new THREE.Fog(0xc8d5d8,33,82);

const hemis=[],dirs=[];
scene.traverse(o=>{if(o.isHemisphereLight)hemis.push(o);if(o.isDirectionalLight)dirs.push(o);if(o.isPointLight)o.visible=false;});
hemis.forEach((l,i)=>{l.color.set(i?0xd8e7eb:0xdcecf0);l.groundColor.set(0x59624c);l.intensity=i?0.45:1.25;});
dirs.sort((a,b)=>b.intensity-a.intensity);
dirs.forEach((l,i)=>{l.castShadow=false;if(i===0){l.color.set(0xffd7aa);l.intensity=2.25;l.position.set(-11,18,-13);}else{l.color.set(0xcadcf2);l.intensity=.34;l.position.set(9,8,11);}});

function textureCanvas(kind,size=256){
  const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d'),rnd=seeded(kind.split('').reduce((a,v)=>a+v.charCodeAt(0),0)*97+17);
  x.fillStyle='#808080';x.fillRect(0,0,size,size);
  if(kind==='wood'){
    x.fillStyle='#777';x.fillRect(0,0,size,size);
    for(let i=0;i<120;i++){const y=(i*17+rnd()*9)%size;x.strokeStyle=`rgba(230,230,230,${.035+rnd()*.07})`;x.lineWidth=.5+rnd()*1.7;x.beginPath();x.moveTo(0,y);x.bezierCurveTo(size*.28,y+Math.sin(i*.43)*7,size*.72,y+Math.cos(i*.31)*8,size,y+Math.sin(i*.27)*4);x.stroke();}
  }else if(kind==='plaster'){
    for(let i=0;i<5200;i++){const v=Math.floor(98+rnd()*70);x.fillStyle=`rgba(${v},${v},${v},${.05+rnd()*.08})`;const s=rnd()<.92?1:2;x.fillRect(rnd()*size,rnd()*size,s,s);}
  }else if(kind==='metal'){
    x.fillStyle='#777';x.fillRect(0,0,size,size);for(let i=0;i<260;i++){const xx=(i*29)%size;x.fillStyle=`rgba(230,230,230,${.02+rnd()*.045})`;x.fillRect(xx,0,1,size);}
    for(let i=0;i<1300;i++){const v=100+rnd()*80;x.fillStyle=`rgba(${v},${v},${v},.035)`;x.fillRect(rnd()*size,rnd()*size,1,1);}
  }else if(kind==='fabric'){
    x.fillStyle='#777';x.fillRect(0,0,size,size);for(let y=0;y<size;y+=4){x.fillStyle='rgba(235,235,235,.07)';x.fillRect(0,y,size,1);}for(let xx=0;xx<size;xx+=4){x.fillStyle='rgba(25,25,25,.055)';x.fillRect(xx,0,1,size);}
  }else if(kind==='water'){
    x.fillStyle='#777';x.fillRect(0,0,size,size);for(let i=0;i<45;i++){const y=i*6+rnd()*3;x.strokeStyle=`rgba(220,220,220,${.04+rnd()*.08})`;x.lineWidth=.7+rnd();x.beginPath();for(let xx=0;xx<=size;xx+=8){const yy=y+Math.sin(xx*.075+i*.71)*3.2+Math.sin(xx*.029+i)*1.8;if(xx===0)x.moveTo(xx,yy);else x.lineTo(xx,yy);}x.stroke();}
  }
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.NoColorSpace;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy?.()||1);return t;
}
const bump={wood:textureCanvas('wood'),plaster:textureCanvas('plaster'),metal:textureCanvas('metal'),fabric:textureCanvas('fabric'),water:textureCanvas('water')};
bump.wood.repeat.set(3,4);bump.plaster.repeat.set(4,4);bump.metal.repeat.set(5,5);bump.fabric.repeat.set(5,5);bump.water.repeat.set(3.2,5.4);

const materialStats={wood:0,plaster:0,metal:0,fabric:0,glass:0,solar:0};
const mats=new Set();scene.traverse(o=>{if(!o.isMesh)return;for(const m of(Array.isArray(o.material)?o.material:[o.material]))if(m)mats.add(m);});
for(const m of mats){
  if(!m.color||m.isMeshBasicMaterial)continue;
  const {r,g,b}=m.color;const metalness=m.metalness??0,rough=m.roughness??1;
  if(m.transparent&&m.opacity<.55){
    if(b>=g*.86&&g>=r*.82){m.opacity=Math.min(m.opacity,.21);if('roughness'in m)m.roughness=.10;if('metalness'in m)m.metalness=.02;if('envMapIntensity'in m)m.envMapIntensity=1.2;m.depthWrite=false;materialStats.glass++;}
    continue;
  }
  if(metalness>.48){
    if(b>r*1.12&&b>g*.96){if('roughness'in m)m.roughness=.20;if('metalness'in m)m.metalness=.68;materialStats.solar++;}
    else{m.bumpMap=bump.metal;m.bumpScale=.006;if('roughness'in m)m.roughness=Math.min(Math.max(rough,.32),.52);materialStats.metal++;}
  }else if(r>g*1.12&&g>b*.96&&r>.24&&r<.82){
    m.bumpMap=bump.wood;m.bumpScale=.014;if('roughness'in m)m.roughness=Math.min(Math.max(rough,.56),.74);materialStats.wood++;
  }else if(r>.67&&g>.64&&b>.58){
    m.bumpMap=bump.plaster;m.bumpScale=.010;if('roughness'in m)m.roughness=Math.max(rough,.80);materialStats.plaster++;
  }else if(rough>.92&&metalness<.1){
    m.bumpMap=bump.fabric;m.bumpScale=.020;materialStats.fabric++;
  }
  m.needsUpdate=true;
}

removeId('AGUA-REALISMO-V25');
const waterDetail=tag(new THREE.Group(),'AGUA-REALISMO-V25','Profundidade e acabamento dos lagos','Água');scene.add(waterDetail);
const waterMat=new THREE.MeshPhysicalMaterial({color:0x2b8085,transparent:true,opacity:.67,roughness:.13,metalness:.02,clearcoat:1,clearcoatRoughness:.08,bumpMap:bump.water,bumpScale:.025,depthWrite:false,side:THREE.DoubleSide});
const fishWaterMat=waterMat.clone();fishWaterMat.color.set(0x286e72);fishWaterMat.opacity=.70;
let upgradedWater=0;
for(const [id,mat] of[['LAGO-NATURAL-V15',waterMat],['LAGO-PEIXES-V15',fishWaterMat]]){
  const g=byId(id);if(!g)continue;
  let waterMesh=null;
  g.traverse(o=>{if(!waterMesh&&o.isMesh&&(o.geometry?.type==='ShapeGeometry'||o.position.y<.07)&&o.material?.transparent)waterMesh=o;});
  if(waterMesh){waterMesh.material=mat;waterMesh.renderOrder=3;upgradedWater++;const basin=new THREE.Mesh(waterMesh.geometry.clone(),new THREE.MeshLambertMaterial({color:id.includes('NATURAL')?0x234e45:0x263f39,transparent:true,opacity:.72,side:THREE.DoubleSide}));basin.rotation.copy(waterMesh.rotation);basin.position.copy(waterMesh.position);basin.position.y-=.025;basin.scale.set(.985,.985,.985);g.add(basin);}
}
let waveFrame=0;function animateWater(){waveFrame++;if(waveFrame%2===0){bump.water.offset.x=(bump.water.offset.x+.00042)%1;bump.water.offset.y=(bump.water.offset.y+.00018)%1;}requestAnimationFrame(animateWater);}requestAnimationFrame(animateWater);

removeId('CORRUGACAO-CONTAINER-V25');
const ribs=tag(new THREE.Group(),'CORRUGACAO-CONTAINER-V25','Corrugação e perfis do container','Fachada');scene.add(ribs);
const ribMat=new THREE.MeshStandardMaterial({color:0x1e2825,roughness:.39,metalness:.68,bumpMap:bump.metal,bumpScale:.004});
let ribCount=0;
function ribPanel(y,z,side){const x0=side<0?-halfW+.10:halfW-.78,x1=side<0?-halfW+.78:halfW-.10;for(let x=x0;x<=x1+.001;x+=.105){box(ribs,.018,2.36,.024,x,y+1.19,z,ribMat);ribCount++;}}
for(const y of[LEVEL.social,LEVEL.private]){ribPanel(y,front+.035,-1);ribPanel(y,front+.035,1);ribPanel(y,back-.035,-1);ribPanel(y,back-.035,1);}
for(const y of[LEVEL.social,LEVEL.private])for(const z of[front+.05,back-.05]){box(ribs,HOUSE.w-.18,.035,.035,0,y+.08,z,ribMat);box(ribs,HOUSE.w-.18,.035,.035,0,y+2.42,z,ribMat);ribCount+=2;}

removeId('MICRODETALHES-INTERIOR-V25');
const details=tag(new THREE.Group(),'MICRODETALHES-INTERIOR-V25','Rodapés e detalhes interiores','Interior');scene.add(details);
const baseMat=new THREE.MeshStandardMaterial({color:0x383c38,roughness:.52,metalness:.18});
const chrome=new THREE.MeshStandardMaterial({color:0xb9c2c0,roughness:.15,metalness:.90});
const dark=new THREE.MeshStandardMaterial({color:0x171c1b,roughness:.35,metalness:.32});
let detailCount=0;
for(const y of[LEVEL.social,LEVEL.private]){box(details,HOUSE.w-.30,.065,.035,0,y+.034,front+.14,baseMat);box(details,HOUSE.w-.30,.065,.035,0,y+.034,back-.14,baseMat);detailCount+=2;for(const x of[-halfW+.14,halfW-.14]){box(details,.035,.065,HOUSE.d-.32,x,y+.034,HOUSE.centerZ,baseMat);detailCount++;}}
const kitchen=byId('COZINHA-V15');if(kitchen){
  box(details,2.22,.09,.035,-2.05,LEVEL.social+.095,2.91,dark);detailCount++;
  for(const x of[-2.80,-2.31,-1.82,-1.33]){box(details,.012,.24,.018,x,LEVEL.social+.54,2.905,chrome);detailCount++;}
  const sink=new THREE.Mesh(new THREE.BoxGeometry(.46,.025,.30),dark);sink.position.set(-1.60,LEVEL.social+.915,3.17);details.add(sink);detailCount++;
  const stem=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.27,12),chrome);stem.position.set(-1.40,LEVEL.social+1.055,3.29);details.add(stem);detailCount++;
  const spout=new THREE.Mesh(new THREE.TorusGeometry(.115,.012,8,20,Math.PI),chrome);spout.rotation.x=Math.PI/2;spout.rotation.z=Math.PI/2;spout.position.set(-1.40,LEVEL.social+1.17,3.19);details.add(spout);detailCount++;
}

removeId('GRAMA-3D-V25');
const grassRoot=tag(new THREE.Group(),'GRAMA-3D-V25','Grama 3D instanciada','Paisagismo');scene.add(grassRoot);
const bladeGeo=new THREE.ConeGeometry(.018,.15,3,1,false);
const bladeMatA=new THREE.MeshLambertMaterial({color:0x4e7443,side:THREE.DoubleSide});
const bladeMatB=new THREE.MeshLambertMaterial({color:0x668452,side:THREE.DoubleSide});
const rnd=seeded(25162026),bladeData=[[],[]];
for(let i=0;i<520;i++){
  const x=-4.75+rnd()*9.50,z=-12.10+rnd()*24.20;
  const inHouse=x>-4.15&&x<4.55&&z>front-1.8&&z<back+1.8;
  const inParking=x>.85&&z<-6.45;
  const inLeftPath=x>-4.72&&x<-3.72&&z>-11.3&&z<11.6;
  const nearPond=((x+2.25)**2/2.0+(z+7.35)**2/4.3<1.25)||((x-1.72)**2/1.1+(z+5.30)**2/2.0<1.25);
  if(inHouse||inParking||inLeftPath||nearPond){i--;continue;}
  bladeData[i%2].push({x,z,s:.75+rnd()*.70,r:rnd()*Math.PI});
}
for(let v=0;v<2;v++){const arr=bladeData[v],inst=new THREE.InstancedMesh(bladeGeo,v?bladeMatB:bladeMatA,arr.length),d=new THREE.Object3D();arr.forEach(q=>{d.position.set(q.x,.075*q.s,q.z);d.rotation.set((rnd()-.5)*.14,q.r,(rnd()-.5)*.14);d.scale.set(1,q.s,1);d.updateMatrix();inst.setMatrixAt(arr.indexOf(q),d.matrix);});inst.instanceMatrix.needsUpdate=true;inst.castShadow=false;grassRoot.add(inst);}

removeId('FOLHAGEM-FINA-V25');
const foliage=tag(new THREE.Group(),'FOLHAGEM-FINA-V25','Folhagem fina do pomar','Paisagismo');scene.add(foliage);
const trees=[];scene.traverse(o=>{if(o.userData?.category==='Árvore frutífera')trees.push(o);});
const leafGeo=new THREE.IcosahedronGeometry(1,0),leafMatA=new THREE.MeshLambertMaterial({color:0x3f703f}),leafMatB=new THREE.MeshLambertMaterial({color:0x527d46});
const leafData=[[],[]];
trees.forEach((t,ti)=>{const p=t.getWorldPosition(new THREE.Vector3());for(let k=0;k<5;k++){const a=(k/5)*Math.PI*2+ti*.41,rr=.38+(k%2)*.13;leafData[(ti+k)%2].push({x:p.x+Math.cos(a)*rr,y:p.y+1.45+(k%3)*.14,z:p.z+Math.sin(a)*rr,s:.16+(k%3)*.025,r:a});}});
for(let v=0;v<2;v++){const arr=leafData[v],inst=new THREE.InstancedMesh(leafGeo,v?leafMatB:leafMatA,arr.length),d=new THREE.Object3D();arr.forEach((q,i)=>{d.position.set(q.x,q.y,q.z);d.scale.set(q.s,q.s*.72,q.s*.92);d.rotation.set(i*.21,q.r,i*.11);d.updateMatrix();inst.setMatrixAt(i,d.matrix);});inst.instanceMatrix.needsUpdate=true;foliage.add(inst);}

const audit={version:'v1.16-realism-upgrade',dimensionsPreserved:{lot:[10,25],house:[7.076,6.058],human:1.65},renderer:{toneMapping:'ACESFilmic',exposure:renderer.toneMappingExposure,dprCap:.94,dynamicShadows:false},lights:{hemisphere:hemis.length,directional:dirs.length},materials:materialStats,waterBodiesUpgraded:upgradedWater,containerRibs:ribCount,interiorMicroDetails:detailCount,grassInstances:bladeData[0].length+bladeData[1].length,fruitTrees:trees.length,fineLeafInstances:leafData[0].length+leafData[1].length,geometryLayoutChanged:false,pass:upgradedWater>=2&&ribCount>20&&detailCount>8&&trees.length>0&&(bladeData[0].length+bladeData[1].length)>=400};
window.__CASA_AUDIT_V25__=audit;
console.info('[Casa Contreras] AUDIT v1.16 REALISM',audit);
const top=document.getElementById('topbar');if(top)top.innerHTML=`<b>CASA CONTRERAS — v1.16 REALISM UPGRADE</b><br><span class="muted">microtexturas PBR leves • água com clearcoat/ondas • vidro refinado • corrugação de container • grama 3D instanciada • folhagem fina • rodapés e cozinha detalhada • iluminação ACES recalibrada<br>7,076 × 6,058 m • referência humana 1,65 m • nenhuma geometria arquitetônica foi redimensionada • K mantém QA técnico</span>`;
