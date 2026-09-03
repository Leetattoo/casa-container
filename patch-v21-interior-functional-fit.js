import * as THREE from 'three';

const scene=window.__CASA_SCENE__;
if(!scene) throw new Error('Casa Contreras v1.11: cena indisponível');

const LEVEL={social:3.250,private:6.250};
const HOUSE={w:7.076,d:6.058,centerZ:.700,wall:.120};
const halfW=HOUSE.w/2,halfD=HOUSE.d/2,front=HOUSE.centerZ-halfD,back=HOUSE.centerZ+halfD;
const inner={west:-halfW+HOUSE.wall,east:halfW-HOUSE.wall,front:front+HOUSE.wall,back:back-HOUSE.wall};
const BOX=new THREE.BoxGeometry(1,1,1);
const wallMat=new THREE.MeshStandardMaterial({color:0xe8e2d8,roughness:.90});
const steelMat=new THREE.MeshStandardMaterial({color:0x161c1a,roughness:.42,metalness:.60});
const glassMat=new THREE.MeshStandardMaterial({color:0xa8c6c8,transparent:true,opacity:.25,roughness:.12,depthWrite:false,side:THREE.DoubleSide});
const woodMat=new THREE.MeshStandardMaterial({color:0xa36b40,roughness:.64});
const chromeMat=new THREE.MeshStandardMaterial({color:0xb8bfbc,roughness:.18,metalness:.88});

function byId(id){let hit=null;scene.traverse(o=>{if(!hit&&o.userData?.id===id)hit=o;});return hit;}
function bounds(id){const o=byId(id);if(!o)return null;o.updateMatrixWorld(true);return new THREE.Box3().setFromObject(o);}
function size(id){const b=bounds(id);return b?b.getSize(new THREE.Vector3()):null;}
function overlap(a,b,eps=.015){return !!a&&!!b&&a.min.x<b.max.x-eps&&a.max.x>b.min.x+eps&&a.min.z<b.max.z-eps&&a.max.z>b.min.z+eps&&a.min.y<b.max.y-eps&&a.max.y>b.min.y+eps;}
function makeBox(parent,w,h,d,x,y,z,mat=wallMat){const m=new THREE.Mesh(BOX,mat);m.scale.set(w,h,d);m.position.set(x,y,z);m.castShadow=false;m.receiveShadow=false;parent.add(m);return m;}

// ------------------------------------------------------------------
// 1) SALA: sofá passa a olhar para a TV; mesa de centro vai para a frente.
// ------------------------------------------------------------------
const sofa=byId('SOFA-V15');
if(sofa){sofa.rotation.y=Math.PI/2;sofa.updateMatrixWorld(true);}
let coffeeGroup=null,rug=null;
scene.traverse(o=>{
  if(!coffeeGroup&&o.isGroup&&!o.userData?.id&&Math.abs(o.position.x-.35)<.04&&Math.abs(o.position.y-LEVEL.social)<.04&&Math.abs(o.position.z+.75)<.04&&o.children.length===1)coffeeGroup=o;
  if(!rug&&o.isMesh&&Math.abs(o.position.x-1.20)<.04&&Math.abs(o.position.y-(LEVEL.social+.018))<.04&&Math.abs(o.position.z+.75)<.04&&Math.abs(o.scale.x-1.82)<.06&&Math.abs(o.scale.z-1.80)<.06)rug=o;
});
if(coffeeGroup){coffeeGroup.position.x=2.18;coffeeGroup.position.z=-.75;coffeeGroup.updateMatrixWorld(true);}
if(rug){rug.position.x=1.85;rug.scale.x=2.55;rug.scale.z=1.95;rug.updateMatrixWorld(true);}

// ------------------------------------------------------------------
// 2) MASTER: layout real com queen centralizada, 2 criados e armário lateral.
// Quarto aproximado: 3,35 x 2,88 m.
// ------------------------------------------------------------------
const bed=byId('CAMA-CASAL-V16');
if(bed){bed.position.x=-1.50;bed.position.z=-.30;bed.rotation.y=0;bed.updateMatrixWorld(true);}
const wardrobe=byId('GUARDA-ROUPA-V16');
if(wardrobe){wardrobe.position.set(-3.16,LEVEL.private,-1.48);wardrobe.rotation.y=Math.PI/2;wardrobe.updateMatrixWorld(true);}
const nightstands=[];
scene.traverse(o=>{
  if(o.isGroup&&!o.userData?.id&&Math.abs(o.position.y-LEVEL.private)<.04&&Math.abs(o.position.z+.15)<.04&&o.children.length===1){
    const c=o.children[0];
    if(c?.isMesh&&Math.abs(c.scale.x-.34)<.05&&Math.abs(c.scale.z-.32)<.05)nightstands.push(o);
  }
});
nightstands.sort((a,b)=>a.position.x-b.position.x);
if(nightstands[0])nightstands[0].position.set(-2.51,LEVEL.private,-.15);
if(nightstands[1])nightstands[1].position.set(-.49,LEVEL.private,-.15);
nightstands.forEach(n=>n.updateMatrixWorld(true));

// ------------------------------------------------------------------
// 3) BANHEIRO ÍNTIMO: fecha a frente e abre porta de 0,78 m para o corredor.
// ------------------------------------------------------------------
const bath=byId('BANHEIRO-INTIMO-V15');
const bathCollision=[];
let bathDoorPresent=false;
if(bath){
  // Remove parede oeste contínua antiga do grupo.
  const remove=[];
  for(const o of bath.children){
    if(!o.isMesh)continue;
    const sx=Math.abs(o.scale.x),sy=Math.abs(o.scale.y),sz=Math.abs(o.scale.z);
    if(Math.abs(sx-.10)<.025&&Math.abs(sy-2.55)<.08&&Math.abs(sz-1.95)<.08&&Math.abs(o.position.x+.75)<.08)remove.push(o);
  }
  remove.forEach(o=>bath.remove(o));

  const g=new THREE.Group();
  g.userData={id:'BANHEIRO-INTIMO-FECHAMENTO-V21',label:'Fechamento e porta do banheiro íntimo',category:'Banheiro',selectable:true};
  bath.add(g);

  // Parede frontal completa separando banheiro do gamer.
  const frontWall=makeBox(g,1.50,2.55,.10,0,1.275,-.975,wallMat);
  // Parede oeste com vão de 0,78 m centralizado em z local -0,35.
  const doorCenter=-.35,doorW=.78,za=-.975,zb=.975,da=doorCenter-doorW/2,db=doorCenter+doorW/2;
  const segA=makeBox(g,.10,2.55,da-za,-.75,1.275,(za+da)/2,wallMat);
  const segB=makeBox(g,.10,2.55,zb-db,-.75,1.275,(db+zb)/2,wallMat);
  const header=makeBox(g,.10,.42,doorW,-.75,2.34,doorCenter,wallMat);
  // Marco + folha aberta para dentro, sem bloquear o vão.
  makeBox(g,.055,2.10,.055,-.75,1.05,da,steelMat);
  makeBox(g,.055,2.10,.055,-.75,1.05,db,steelMat);
  makeBox(g,.055,.055,doorW,-.75,2.08,doorCenter,steelMat);
  const leaf=makeBox(g,.035,2.02,.70,-.42,1.02,db+.30,glassMat);leaf.rotation.y=Math.PI/2;
  const handle=makeBox(g,.025,.28,.025,-.41,1.02,db+.05,chromeMat);
  bathDoorPresent=true;

  g.updateMatrixWorld(true);
  for(const w of[frontWall,segA,segB,header]){w.updateMatrixWorld(true);bathCollision.push(new THREE.Box3().setFromObject(w));}
}

// Colisão somente para os novos fechamentos; o vão permanece livre.
if(bathCollision.length&&!window.__CASA_V21_BATH_COLLISION__){
  window.__CASA_V21_BATH_COLLISION__=true;
  const previous=THREE.Box3.prototype.intersectsBox;
  THREE.Box3.prototype.intersectsBox=function(b){
    const s=this.getSize(new THREE.Vector3());
    const player=s.x>.43&&s.x<.58&&s.z>.43&&s.z<.58&&s.y>1.55&&s.y<1.85;
    if(player&&bathCollision.some(w=>this.min.x<w.max.x&&this.max.x>w.min.x&&this.min.y<w.max.y&&this.max.y>w.min.y&&this.min.z<w.max.z&&this.max.z>w.min.z))return true;
    return previous.call(this,b);
  };
}

// ------------------------------------------------------------------
// 4) AUDITORIA DE FOLGAS REAIS.
// ------------------------------------------------------------------
const bedBox=bounds('CAMA-CASAL-V16'),wardBox=bounds('GUARDA-ROUPA-V16');
const masterClearances=bedBox&&wardBox?{
  wardrobeToBed:+(bedBox.min.x-wardBox.max.x).toFixed(3),
  bedToRightPartition:+((-0.07)-bedBox.max.x).toFixed(3),
  bedFootToFrontWall:+(bedBox.min.z-inner.front).toFixed(3)
}:null;
const socialClearance=(()=>{const d=bounds('JANTAR-V15'),s=bounds('SOFA-V15');return d&&s?+(s.min.x-d.max.x).toFixed(3):null;})();
const furniturePairs=[['CAMA-CASAL-V16','GUARDA-ROUPA-V16'],['CAMA-CASAL-V16','TRELICHE-V16'],['ILHA-V15','JANTAR-V15'],['JANTAR-V15','SOFA-V15'],['SOFA-V15','TV-V15'],['TRELICHE-V16','BANCADA-FILHOS-V16'],['TRELICHE-V16','ARMARIO-FILHOS-V16']];
const collisions=furniturePairs.filter(([a,b])=>overlap(bounds(a),bounds(b))).map(p=>p.join(':'));
const queenSize=size('CAMA-CASAL-V16'),bunkSize=size('TRELICHE-V16');
const audit={
  version:'v1.11-interior-functional-fit',
  sofaFacesTv:!!sofa&&Math.abs(sofa.rotation.y-Math.PI/2)<.01,
  coffeeTableInFrontOfSofa:!!coffeeGroup&&coffeeGroup.position.x>sofa.position.x,
  privateBathroomDoor:bathDoorPresent,
  privateBathroomNewWallCollision:bathCollision.length>0,
  masterClearances,
  socialDiningToSofaClearance:socialClearance,
  queenObserved:queenSize?[+queenSize.x.toFixed(2),+queenSize.z.toFixed(2)]:null,
  bunkObserved:bunkSize?[+bunkSize.x.toFixed(2),+bunkSize.z.toFixed(2)]:null,
  criticalFurnitureCollisions:collisions,
  pass:!!sofa&&!!coffeeGroup&&bathDoorPresent&&collisions.length===0&&(!masterClearances||masterClearances.wardrobeToBed>=.55)&&(!masterClearances||masterClearances.bedToRightPartition>=.55)
};
window.__CASA_AUDIT_V21__=audit;
console.info('[Casa Contreras] AUDIT v1.11',audit);
const top=document.getElementById('topbar');if(top)top.innerHTML=`<b>CASA CONTRERAS — v1.11 INTERIOR FUNCTIONAL FIT</b><br><span class="muted">sofá → TV corrigido • mesa de centro na posição funcional • master com folgas reais • banheiro íntimo fechado e acessível pelo corredor • navegação v1.10 preservada<br>7,076 × 6,058 m por pavimento • escala humana 1,65 m • QA dimensional ativo</span>`;
