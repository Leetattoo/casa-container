import * as THREE from 'three';

const scene=window.__CASA_SCENE__,renderer=window.__CASA_RENDERER__;
if(!scene||!renderer) throw new Error('Casa Contreras v1.12: cena indisponível');

function byId(id){let hit=null;scene.traverse(o=>{if(!hit&&o.userData?.id===id)hit=o;});return hit;}
function all(pred){const out=[];scene.traverse(o=>{if(pred(o))out.push(o);});return out;}
function worldBounds(o){o.updateMatrixWorld(true);return new THREE.Box3().setFromObject(o);}

function shadowTexture(){
  const c=document.createElement('canvas');c.width=c.height=128;
  const x=c.getContext('2d'),g=x.createRadialGradient(64,64,5,64,64,62);
  g.addColorStop(0,'rgba(0,0,0,.48)');g.addColorStop(.45,'rgba(0,0,0,.22)');g.addColorStop(1,'rgba(0,0,0,0)');
  x.fillStyle=g;x.fillRect(0,0,128,128);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
const shadowMat=new THREE.MeshBasicMaterial({map:shadowTexture(),transparent:true,opacity:.52,depthWrite:false,side:THREE.DoubleSide});
const shadowGeo=new THREE.PlaneGeometry(1,1);
const shadowItems=[];
function addShadowFor(id,y,pad=1.12){const o=byId(id);if(!o)return;const b=worldBounds(o),s=b.getSize(new THREE.Vector3()),c=b.getCenter(new THREE.Vector3());shadowItems.push({x:c.x,y,z:c.z,sx:Math.max(.35,s.x*pad),sz:Math.max(.35,s.z*pad)});}
addShadowFor('SOFA-V15',3.266,1.18);addShadowFor('JANTAR-V15',3.264,1.08);addShadowFor('ILHA-V15',3.264,1.08);addShadowFor('CAMA-CASAL-V16',6.264,1.08);addShadowFor('TRELICHE-V16',6.264,1.06);addShadowFor('GAMER-V15',6.264,1.08);addShadowFor('COBERTURA-GARAGEM-V15',.018,.92);addShadowFor('CISTERNA-V15',.018,1.15);
const trees=all(o=>o.userData?.category==='Árvore frutífera');
for(const t of trees){const p=t.getWorldPosition(new THREE.Vector3());shadowItems.push({x:p.x,y:.014,z:p.z,sx:1.15,sz:.90});}
if(shadowItems.length){const inst=new THREE.InstancedMesh(shadowGeo,shadowMat,shadowItems.length),d=new THREE.Object3D();shadowItems.forEach((v,i)=>{d.position.set(v.x,v.y,v.z);d.rotation.set(-Math.PI/2,0,0);d.scale.set(v.sx,v.sz,1);d.updateMatrix();inst.setMatrixAt(i,d.matrix);});inst.instanceMatrix.needsUpdate=true;inst.renderOrder=-1;scene.add(inst);}

const woodMat=new THREE.MeshStandardMaterial({color:0x6f482d,roughness:.88});
const soilMat=new THREE.MeshLambertMaterial({color:0x4b3526});
const branchGeo=new THREE.CylinderGeometry(1,1,1,8),mulchGeo=new THREE.CylinderGeometry(1,1,1,20);
const branchData=[];
for(const t of trees){const p=t.getWorldPosition(new THREE.Vector3());for(let k=0;k<3;k++){const a=k*Math.PI*2/3+.35,dir=new THREE.Vector3(Math.cos(a)*.72,.62,Math.sin(a)*.72).normalize();branchData.push({p:p.clone().add(new THREE.Vector3(0,1.03,0)).addScaledVector(dir,.27),dir,len:.58});}}
if(branchData.length){const inst=new THREE.InstancedMesh(branchGeo,woodMat,branchData.length),d=new THREE.Object3D(),up=new THREE.Vector3(0,1,0);branchData.forEach((v,i)=>{d.position.copy(v.p);d.quaternion.setFromUnitVectors(up,v.dir);d.scale.set(.028,v.len,.028);d.updateMatrix();inst.setMatrixAt(i,d.matrix);});inst.instanceMatrix.needsUpdate=true;scene.add(inst);}
if(trees.length){const inst=new THREE.InstancedMesh(mulchGeo,soilMat,trees.length),d=new THREE.Object3D();trees.forEach((t,i)=>{const p=t.getWorldPosition(new THREE.Vector3());d.position.set(p.x,.018,p.z);d.rotation.set(0,(i*.37)%Math.PI,0);d.scale.set(.38,.035,.34);d.updateMatrix();inst.setMatrixAt(i,d.matrix);});inst.instanceMatrix.needsUpdate=true;scene.add(inst);}

const path=byId('CAMINHO-LATERAL-V15');
let pathAdjusted=0;
if(path){path.children.forEach((o,i)=>{if(!o.isMesh)return;const f=1+((i%5)-2)*.008;o.rotation.y=((i%7)-3)*.012;o.scale.x*=f;o.scale.z*=1-((i%3)-1)*.007;o.position.x+=((i%4)-1.5)*.008;o.updateMatrixWorld(true);pathAdjusted++;});}

const highlightMat=new THREE.MeshBasicMaterial({color:0xd9f2f2,transparent:true,opacity:.13,depthWrite:false,side:THREE.DoubleSide});
const hiGroup=new THREE.Group();hiGroup.userData={id:'REFLEXOS-VIDRO-V22',label:'Reflexos leves em vidro',category:'Acabamento',selectable:false};scene.add(hiGroup);
// Lateral leste: plano YZ -> rotação 90°. Fundo: plano XY -> sem rotação Y.
for(const [x,y,z,w,h,rot] of[[3.505,4.40,2.15,.025,1.45,Math.PI/2],[-1.00,7.42,3.665,.72,1.25,0]]){const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),highlightMat);p.position.set(x,y,z);p.rotation.y=rot;p.rotation.z=-.10;hiGroup.add(p);}

renderer.shadowMap.enabled=false;
renderer.setPixelRatio(Math.min(devicePixelRatio||1,.92));
renderer.toneMappingExposure=1.11;

const audit={
 version:'v1.12-lightweight-realism',
 contactShadowInstances:shadowItems.length,
 fruitTrees:trees.length,
 branchInstances:branchData.length,
 mulchInstances:trees.length,
 pathAdjusted,
 glassHighlights:hiGroup.children.length,
 dynamicShadowMap:false,
 addedApproxDrawCalls:3+hiGroup.children.length,
 performanceIntent:'mais profundidade visual sem sombras dinâmicas/pós-processamento pesado',
 pass:shadowItems.length>0&&trees.length>0&&branchData.length===trees.length*3&&hiGroup.children.length===2
};
window.__CASA_AUDIT_V22__=audit;
console.info('[Casa Contreras] AUDIT v1.12',audit);
const top=document.getElementById('topbar');if(top)top.innerHTML=`<b>CASA CONTRERAS — v1.12 LIGHTWEIGHT REALISM</b><br><span class="muted">layout funcional v1.11 • navegação sem teleporte v1.10 • sombras de contato falsas • galhos/solo instanciados • caminho menos uniforme • vidro com brilho leve • sem shadowMap dinâmico<br>7,076 × 6,058 m • referência humana 1,65 m • performance preservada</span>`;
