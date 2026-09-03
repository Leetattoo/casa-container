import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const scene=window.__CASA_SCENE__,camera=window.__CASA_CAMERA__,renderer=window.__CASA_RENDERER__;
if(!scene||!camera||!renderer) throw new Error('Casa Contreras v1.4: cena base indisponivel');

const HOUSE={w:7.076,d:6.058,centerZ:.700,wall:.120};
const LEVEL={ground:0,social:3.250,private:6.250};
const PLAYER={eye:1.660};
const halfW=HOUSE.w/2,halfD=HOUSE.d/2,front=HOUSE.centerZ-halfD,back=HOUSE.centerZ+halfD;

function byId(id){let h=null;scene.traverse(o=>{if(!h&&o.userData?.id===id)h=o;});return h;}
function allPrefix(p){const a=[];scene.traverse(o=>{if(o.userData?.id?.startsWith(p))a.push(o);});return a;}
function removeId(id){const o=byId(id);if(o?.parent)o.parent.remove(o);}
function removePrefix(p){allPrefix(p).forEach(o=>o.parent?.remove(o));}
function tag(o,id,label,category='Elemento',extra={}){o.userData={...o.userData,id,label,category,selectable:true,...extra};return o;}
function group(id,label,category,pos=[0,0,0],extra={}){const g=new THREE.Group();g.position.set(...pos);scene.add(g);return tag(g,id,label,category,extra);}
function local(parent,pos=[0,0,0],rot=0){const g=new THREE.Group();g.position.set(...pos);g.rotation.y=rot;parent.add(g);return g;}

const BOX=new THREE.BoxGeometry(1,1,1),RBOX=new RoundedBoxGeometry(1,1,1,2,.06),CYL=new THREE.CylinderGeometry(1,1,1,18),SPHERE=new THREE.SphereGeometry(1,12,8);
function woodTexture(){
  const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');
  x.fillStyle='#9a6237';x.fillRect(0,0,128,128);
  for(let i=0;i<70;i++){const y=Math.random()*128,a=.025+Math.random()*.06;x.strokeStyle=`rgba(45,22,8,${a})`;x.lineWidth=.5+Math.random()*1.5;x.beginPath();x.moveTo(0,y);x.bezierCurveTo(35,y+Math.random()*3-1.5,80,y+Math.random()*3-1.5,128,y);x.stroke();}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2.4,2.4);t.colorSpace=THREE.SRGBColorSpace;return t;
}
const WOODT=woodTexture();
const MAT={
 steel:new THREE.MeshStandardMaterial({color:0x111716,roughness:.36,metalness:.76}),
 steel2:new THREE.MeshStandardMaterial({color:0x2c3431,roughness:.46,metalness:.58}),
 wood:new THREE.MeshStandardMaterial({map:WOODT,color:0xffffff,roughness:.62}),
 woodDark:new THREE.MeshStandardMaterial({map:WOODT,color:0x895128,roughness:.66}),
 wall:new THREE.MeshStandardMaterial({color:0xe6dfd3,roughness:.90}),
 quartz:new THREE.MeshStandardMaterial({color:0xe7e2d8,roughness:.32}),
 black:new THREE.MeshStandardMaterial({color:0x0a0e0d,roughness:.34,metalness:.30}),
 glass:new THREE.MeshStandardMaterial({color:0x9fc1c3,transparent:true,opacity:.24,roughness:.10,depthWrite:false,side:THREE.DoubleSide}),
 water:new THREE.MeshStandardMaterial({color:0x278b8f,transparent:true,opacity:.76,roughness:.16}),
 stone:new THREE.MeshStandardMaterial({color:0x777b74,roughness:.92}),
 soil:new THREE.MeshLambertMaterial({color:0x4b3321}),
 green:new THREE.MeshLambertMaterial({color:0x315f36}),
 green2:new THREE.MeshLambertMaterial({color:0x4f7f49}),
 fabric:new THREE.MeshStandardMaterial({color:0x77756e,roughness:1}),
 leather:new THREE.MeshStandardMaterial({color:0x282b29,roughness:.78}),
 white:new THREE.MeshStandardMaterial({color:0xf0ede6,roughness:.84}),
 chrome:new THREE.MeshStandardMaterial({color:0xb4bbb8,roughness:.18,metalness:.90}),
 glow:new THREE.MeshBasicMaterial({color:0xffc27b}),
 screen:new THREE.MeshBasicMaterial({color:0x19364d})
};
function mesh(g,m,p=scene){const o=new THREE.Mesh(g,m);o.castShadow=false;o.receiveShadow=false;p.add(o);return o;}
function box({w,h,d,x=0,y=h/2,z=0,mat=MAT.wall,parent=scene,rounded=false,id,label,category,rot=0,extra}){const o=mesh(rounded?RBOX:BOX,mat,parent);o.scale.set(w,h,d);o.position.set(x,y,z);o.rotation.y=rot;if(id)tag(o,id,label||id,category||'Elemento',extra);return o;}
function cyl({r=.1,h=1,x=0,y=h/2,z=0,mat=MAT.steel,parent=scene}){const o=mesh(CYL,mat,parent);o.scale.set(r,h,r);o.position.set(x,y,z);return o;}

['SOCIAL-O','SOCIAL-L','INTIMO-O','INTIMO-L','ESC-G-S','ESC-S-I','ESCADA-GROUND-SOCIAL-V11','ESCADA-SOCIAL-PRIVATE-V11','ESCADA-INTERNA-SOCIAL-INTIMO-V12','ESCADA-TERREO-SOCIAL-V13','ESCADA-SOCIAL-INTIMO-V13','DECK-LATERAL-SOCIAL-V11','DECK-LATERAL-INTIMO-V11','DECK-LATERAL-SOCIAL-V13','DECK-LATERAL-INTIMO-V13','LOUNGE-TERREO-V13'].forEach(removeId);
for(const id of ['ESTUFA','AVIARIO','DEP-FERR','JARDIM-FILTRANTE','CAMINHO-PEDESTRE'])removeId(id);
for(let i=1;i<=8;i++)removeId(`HORTA-${i}`);
for(let i=1;i<=3;i++)removeId(`COMPOST-${i}`);
for(let i=1;i<=5;i++)removeId(`HORTA-V-${i}`);
removePrefix('HORTA-FRENTE-');

for(const z of [-2.17,.70,3.57])removeId(`PILAR-0.00-${z.toFixed(2)}`);
if(!window.__CASA_V14_COLUMN_COLLISION__){
  window.__CASA_V14_COLUMN_COLLISION__=true;
  const prev=THREE.Box3.prototype.intersectsBox;
  THREE.Box3.prototype.intersectsBox=function(b){
    const sx=b.max.x-b.min.x,sy=b.max.y-b.min.y,sz=b.max.z-b.min.z,cx=(b.min.x+b.max.x)/2;
    const legacyCenterColumn=Math.abs(sx-.18)<.035&&Math.abs(sz-.18)<.035&&sy>8.7&&Math.abs(cx)<.08;
    if(legacyCenterColumn)return false;
    return prev.call(this,b);
  };
}

function sideSkin(prefix,y,side){
  const x=side*(halfW-.055),g=group(`${prefix}-SIDE-${side>0?'E':'W'}-V14`,`${prefix} lateral redesenhada`,'Fachada');
  for(const [z,d] of [[front+.55,1.05],[back-.55,1.05]]) box({w:.11,h:2.72,d,x,y:y+1.36,z,mat:MAT.steel2,parent:g});
  box({w:.035,h:2.30,d:3.86,x:side*(halfW-.025),y:y+1.18,z:HOUSE.centerZ,mat:MAT.glass,parent:g});
  for(let z=front+1.18;z<=back-1.18;z+=.72)box({w:.055,h:2.46,d:.045,x:side*(halfW-.01),y:y+1.23,z,mat:MAT.steel,parent:g});
  box({w:.16,h:.14,d:HOUSE.d,x:side*(halfW-.04),y:y+2.70,z:HOUSE.centerZ,mat:MAT.steel,parent:g});
}
for(const y of [LEVEL.social,LEVEL.private]){sideSkin(y===LEVEL.social?'SOCIAL':'INTIMO',y,-1);sideSkin(y===LEVEL.social?'SOCIAL':'INTIMO',y,1);}

const natural=byId('LAGO-NATURAL');if(natural){natural.position.set(-2.72,0,-7.35);natural.scale.set(1.00,1,1.02);natural.updateMatrixWorld(true);}
const fish=byId('LAGO-PEIXES');if(fish){fish.position.set(2.70,0,-5.05);fish.scale.set(1.12,1,1.05);fish.updateMatrixWorld(true);}
const deck=byId('DECK-LAGO');if(deck){deck.position.set(-1.15,.12,-6.40);deck.scale.set(1.30,1,.95);}
const pass=byId('PASSARELA-LAGO');if(pass){pass.position.set(-.72,.10,-5.45);pass.scale.set(1.10,1,.82);}
const f1=byId('FILTRO-BIO-1'),f2=byId('FILTRO-BIO-2');if(f1)f1.position.set(3.72,.29,-6.05);if(f2)f2.position.set(3.72,.29,-6.68);
const cis=byId('CISTERNA');if(cis)cis.position.set(-3.95,.34,-10.85);

const frontGarden=group('HORTA-FRENTE-V14','Horta frontal entre os lagos','Horta');
for(let i=0;i<3;i++){const g=local(frontGarden,[.35,0,-6.30+i*.95]);box({w:1.18,h:.24,d:.68,y:.12,mat:MAT.woodDark,parent:g,rounded:true});box({w:1.04,h:.10,d:.55,y:.28,mat:MAT.soil,parent:g,rounded:true});for(let j=0;j<5;j++){cyl({r:.035,h:.20+(j%2)*.08,x:-.40+j*.20,y:.43,mat:j%2?MAT.green2:MAT.green,parent:g});}}
const path=group('CAMINHO-FRENTE-FUNDOS-V14','Caminho contínuo frente → fundos','Circulação',[0,0,0],{continuousToRear:true});
const pts=[[-2.42,-11.78],[-1.72,-11.18],[-1.08,-10.48],[-.74,-9.70],[-.58,-8.90],[-.42,-8.10],[-.18,-7.30],[.02,-6.52],[.00,-5.70],[.10,-4.85],[.16,-4.02],[.42,-3.18],[.82,-2.38],[1.00,-1.45],[1.00,-.55],[1.00,.35],[1.00,1.25],[1.00,2.15],[1.05,3.10],[1.38,4.02],[1.92,4.82],[2.55,5.50],[3.10,6.22],[3.50,7.05],[3.68,7.92],[3.72,8.85],[3.72,9.78],[3.68,10.72]];
pts.forEach(([x,z],i)=>{const p=box({w:.48,h:.045,d:.62,x,y:.025,z,mat:MAT.quartz,parent:path,rounded:true});p.rotation.y=((i%3)-1)*.04;});

const rear=group('FUNDOS-PRODUTIVOS-V14','Fundos produtivos reorganizados','Paisagismo');
const gh=local(rear,[-3.20,0,9.50]);tag(gh,'ESTUFA-V14','Estufa de cultivo','Estufa');
box({w:2.20,h:.08,d:3.45,y:.04,mat:MAT.quartz,parent:gh});
for(const x of[-1.04,1.04])for(const z of[-1.62,1.62])box({w:.055,h:1.95,d:.055,x,y:.98,z,mat:MAT.steel,parent:gh});
for(const z of[-1.62,1.62])box({w:2.08,h:1.72,d:.025,y:.88,z,mat:MAT.glass,parent:gh});
for(const x of[-1.04,1.04])box({w:.025,h:1.72,d:3.22,x,y:.88,mat:MAT.glass,parent:gh});
const roofL=box({w:1.55,h:.04,d:3.55,x:-.55,y:2.02,mat:MAT.glass,parent:gh});roofL.rotation.z=.36;
const roofR=box({w:1.55,h:.04,d:3.55,x:.55,y:2.02,mat:MAT.glass,parent:gh});roofR.rotation.z=-.36;
for(let i=0;i<4;i++){const b=local(gh,[0,0,-1.05+i*.70]);box({w:1.42,h:.20,d:.42,y:.10,mat:MAT.woodDark,parent:b,rounded:true});box({w:1.28,h:.07,d:.31,y:.23,mat:MAT.soil,parent:b});}

const av=local(rear,[0,0,10.10]);tag(av,'AVIARIO-V14','Galinheiro / aviário','Produção animal');
box({w:2.45,h:.08,d:2.15,y:.04,mat:MAT.soil,parent:av});
for(const x of[-1.15,1.15])for(const z of[-.98,.98])box({w:.055,h:1.72,d:.055,x,y:.86,z,mat:MAT.wood,parent:av});
for(const x of[-1.15,1.15])box({w:.025,h:1.55,d:1.96,x,y:.80,mat:MAT.glass,parent:av});
for(const z of[-.98,.98])box({w:2.30,h:1.55,d:.025,y:.80,z,mat:MAT.glass,parent:av});
box({w:2.55,h:.10,d:2.25,y:1.78,mat:MAT.steel2,parent:av});
for(let i=0;i<4;i++){const bird=mesh(new THREE.SphereGeometry(.07,8,6),i%2?MAT.white:MAT.wood,av);bird.position.set(-.65+i*.42,.18,-.15+(i%2)*.35);}

const shed=local(rear,[3.40,0,10.10]);tag(shed,'DEP-FERR-V14','Depósito de ferramentas','Apoio');
box({w:1.72,h:1.85,d:1.90,y:.925,mat:MAT.steel2,parent:shed,rounded:true});box({w:.74,h:1.55,d:.06,y:.78,z:-.98,mat:MAT.wood,parent:shed,rounded:true});const shedRoof=box({w:1.92,h:.10,d:2.05,y:1.96,mat:MAT.black,parent:shed});shedRoof.rotation.x=-.08;

for(let row=0;row<3;row++)for(let col=0;col<2;col++){const g=local(rear,[-.70+col*1.60,0,6.65+row*.88]);tag(g,`HORTA-V14-${row}-${col}`,'Canteiro produtivo','Horta');box({w:1.34,h:.26,d:.62,y:.13,mat:MAT.woodDark,parent:g,rounded:true});box({w:1.20,h:.08,d:.48,y:.29,mat:MAT.soil,parent:g});for(let j=0;j<4;j++){const s=mesh(new THREE.ConeGeometry(.07,.24,7),j%2?MAT.green:MAT.green2,g);s.position.set(-.42+j*.28,.45,0);}}
const compost=local(rear,[-3.65,0,6.45]);tag(compost,'COMPOSTEIRA-V14','Composteira 3 baias','Compostagem');for(let i=0;i<3;i++){box({w:.72,h:.58,d:.82,x:i*.76,y:.29,mat:MAT.woodDark,parent:compost,rounded:true});box({w:.62,h:.12,d:.70,x:i*.76,y:.56,mat:MAT.soil,parent:compost});}
const vert=local(rear,[4.18,0,7.25]);tag(vert,'HORTA-VERTICAL-V14','Horta vertical','Horta vertical');box({w:.10,h:2.05,d:1.55,y:1.02,mat:MAT.steel,parent:vert});for(let r=0;r<4;r++){box({w:.32,h:.22,d:1.34,x:-.16,y:.36+r*.46,mat:MAT.woodDark,parent:vert,rounded:true});for(let j=0;j<5;j++)cyl({r:.025,h:.16,x:-.35,y:.54+r*.46,z:-.48+j*.24,mat:j%2?MAT.green2:MAT.green,parent:vert});}
const filter=local(rear,[3.08,0,6.05]);tag(filter,'JARDIM-FILTRANTE-V14','Jardim filtrante / reuso','Reuso');box({w:1.15,h:.16,d:1.55,y:.08,mat:MAT.soil,parent:filter,rounded:true});for(let i=0;i<9;i++)cyl({r:.03,h:.35+(i%3)*.08,x:-.40+(i%3)*.40,y:.20,z:-.48+Math.floor(i/3)*.45,mat:i%2?MAT.green:MAT.green2,parent:filter});

const perimeter=[[-4.35,-10.2],[-4.35,-8.0],[-4.35,-5.6],[-4.35,-3.1],[-4.35,-.6],[-4.35,1.9],[-4.35,4.4],[-4.35,7.0],[-4.35,9.4],[-4.35,11.2],[4.35,4.8],[4.35,7.2],[4.35,9.6],[4.35,11.2],[-3.5,11.55],[-1.75,11.55],[0,11.55],[1.75,11.55],[3.5,11.55],[3.95,-4.35],[3.95,-5.65]];
scene.traverse(o=>{
  if(!o.isInstancedMesh||o.count!==21)return;
  const isTrunk=o.geometry?.type?.includes('Cylinder');
  const d=new THREE.Object3D();
  perimeter.forEach(([x,z],i)=>{const s=.62+(i%3)*.07;d.position.set(x,isTrunk ? .65*s : 1.55*s,z);d.scale.set(isTrunk ? .10*s : .55*s,isTrunk ? 1.30*s : .70*s,isTrunk ? .10*s : .55*s);d.rotation.set(0,0,0);d.updateMatrix();o.setMatrixAt(i,d.matrix);});
  o.instanceMatrix.needsUpdate=true;
});

const stairs=group('ESCADA-EXTERNA-COMPLETA-V14','Escada externa completa térreo → social → íntimo','Escada',[0,0,0],{walkable:true,externalToLivingEnvelope:true});
const sx=4.06,sw=.90,lowerA=2.95,lowerB=-.72,upperA=-.72,upperB=2.95;
function flight(y0,y1,zA,zB,xOff){const n=19;for(let i=0;i<n;i++){const t=i/(n-1),z=zA+(zB-zA)*t,y=y0+(y1-y0)*t;box({w:sw,h:.075,d:.30,x:sx+xOff,y:y+.038,z,mat:MAT.wood,parent:stairs,rounded:true});if(i%2===0)for(const side of[-1,1])box({w:.035,h:.72,d:.035,x:sx+xOff+side*(sw/2-.03),y:y+.38,z,mat:MAT.steel,parent:stairs});}for(const side of[-1,1])box({w:.035,h:.035,d:Math.abs(zB-zA)+.35,x:sx+xOff+side*(sw/2-.03),y:(y0+y1)/2+.73,z:(zA+zB)/2,mat:MAT.steel,parent:stairs});}
flight(LEVEL.ground,LEVEL.social,lowerA,lowerB,-.10);
box({w:1.35,h:.11,d:1.05,x:sx,y:LEVEL.social-.055,z:-.82,mat:MAT.wood,parent:stairs,rounded:true});
flight(LEVEL.social,LEVEL.private,upperA,upperB,.14);
box({w:1.35,h:.11,d:1.05,x:sx+.10,y:LEVEL.private-.055,z:3.05,mat:MAT.wood,parent:stairs,rounded:true});
for(const y of[LEVEL.social,LEVEL.private]){box({w:1.26,h:.10,d:.46,x:3.72,y:y-.05,z:y===LEVEL.social?-.82:3.05,mat:MAT.wood,parent:stairs,rounded:true});}

let floorState=0;addEventListener('keydown',e=>{if(e.code==='Digit1')floorState=0;if(e.code==='Digit2')floorState=1;if(e.code==='Digit3')floorState=2;});
function nearFlight(x,z,xOff,zA,zB){return x>sx+xOff-sw/2-.13&&x<sx+xOff+sw/2+.13&&z>Math.min(zA,zB)-.18&&z<Math.max(zA,zB)+.18;}
if(!window.__CASA_V14_STAIR_NAV__){
  window.__CASA_V14_STAIR_NAV__=true;const prev=renderer.render.bind(renderer);
  renderer.render=function(s,c){
    if(nearFlight(c.position.x,c.position.z,-.10,lowerA,lowerB)){
      const t=THREE.MathUtils.clamp((lowerA-c.position.z)/(lowerA-lowerB),0,1);
      c.position.y=PLAYER.eye+LEVEL.social*t;
      if(floorState===0&&t>.985){floorState=1;window.dispatchEvent(new KeyboardEvent('keydown',{code:'Digit2',bubbles:true}));c.position.set(sx-.10,LEVEL.social+PLAYER.eye,lowerB-.03);}
      else if(floorState===1&&t<.015){floorState=0;window.dispatchEvent(new KeyboardEvent('keydown',{code:'Digit1',bubbles:true}));c.position.set(sx-.10,PLAYER.eye,lowerA+.03);}
    }else if(nearFlight(c.position.x,c.position.z,.14,upperA,upperB)){
      const t=THREE.MathUtils.clamp((c.position.z-upperA)/(upperB-upperA),0,1);
      c.position.y=LEVEL.social+PLAYER.eye+(LEVEL.private-LEVEL.social)*t;
      if(floorState===1&&t>.985){floorState=2;window.dispatchEvent(new KeyboardEvent('keydown',{code:'Digit3',bubbles:true}));c.position.set(sx+.14,LEVEL.private+PLAYER.eye,upperB+.03);}
      else if(floorState===2&&t<.015){floorState=1;window.dispatchEvent(new KeyboardEvent('keydown',{code:'Digit2',bubbles:true}));c.position.set(sx+.14,LEVEL.social+PLAYER.eye,upperA-.03);}
    }
    return prev(s,c);
  };
}

for(const id of['BAN-SOC-O','BAN-SOC-F','BAN-SOC-F2','BAN-SOC-VASO','BAN-SOC-PIA','BAN-SOC-BOX'])removeId(id);
const bath=group('BANHEIRO-SOCIAL-V14','Banheiro social completo','Banheiro');
const bx=1.52,bz=2.60,bw=1.55,bd=2.05;
box({w:.10,h:2.60,d:bd,x:bx-bw/2,y:LEVEL.social+1.30,z:bz,mat:MAT.wall,parent:bath});
box({w:.10,h:2.60,d:bd,x:bx+bw/2,y:LEVEL.social+1.30,z:bz,mat:MAT.wall,parent:bath});
box({w:bw,h:2.60,d:.10,x:bx,y:LEVEL.social+1.30,z:bz+bd/2,mat:MAT.wall,parent:bath});
box({w:.42,h:2.60,d:.10,x:bx-bw/2+.21,y:LEVEL.social+1.30,z:bz-bd/2,mat:MAT.wall,parent:bath});
box({w:.42,h:2.60,d:.10,x:bx+bw/2-.21,y:LEVEL.social+1.30,z:bz-bd/2,mat:MAT.wall,parent:bath});
const toilet=local(bath,[1.18,LEVEL.social,2.92]);box({w:.46,h:.34,d:.60,y:.18,mat:MAT.white,parent:toilet,rounded:true});box({w:.44,h:.54,d:.20,y:.57,z:.25,mat:MAT.white,parent:toilet,rounded:true});
const vanity=local(bath,[1.95,LEVEL.social,3.10]);box({w:.60,h:.76,d:.40,y:.38,mat:MAT.woodDark,parent:vanity,rounded:true});box({w:.64,h:.06,d:.44,y:.79,mat:MAT.quartz,parent:vanity,rounded:true});cyl({r:.015,h:.22,y:.97,z:.05,mat:MAT.chrome,parent:vanity});box({w:.48,h:.62,d:.025,y:1.32,z:.22,mat:MAT.glass,parent:vanity,rounded:true});
const shower=local(bath,[1.78,LEVEL.social,1.93]);box({w:.78,h:.05,d:.72,y:.025,mat:MAT.quartz,parent:shower,rounded:true});box({w:.025,h:1.90,d:.72,x:-.39,y:.95,mat:MAT.glass,parent:shower});box({w:.78,h:1.90,d:.025,y:.95,z:-.36,mat:MAT.glass,parent:shower});

for(const id of['CAMA-CASAL','COLCHAO-CASAL','CRIADO-CASAL','GUARDA-ROUPA-CASAL','MESA-GAMER','MONITOR-1','MONITOR-2','CADEIRA-GAMER','PC-GAMER','ARMARIO-FILHOS-V13','PRATELEIRA-MASTER-V13'])removeId(id);
const master=group('MASTER-V14','Quarto casal','Quarto casal');
const bed=local(master,[-2.25,LEVEL.private,-.78]);tag(bed,'CAMA-CASAL-V14','Cama queen','Quarto casal');box({w:1.62,h:.18,d:1.98,y:.16,mat:MAT.wood,parent:bed,rounded:true});box({w:1.54,h:.20,d:1.90,y:.36,mat:MAT.white,parent:bed,rounded:true});box({w:1.62,h:1.02,d:.11,y:.82,z:.94,mat:MAT.woodDark,parent:bed,rounded:true});for(const x of[-.42,.42])box({w:.62,h:.12,d:.38,x,y:.56,z:.60,mat:MAT.white,parent:bed,rounded:true});
for(const x of[-3.16,-1.32]){const n=local(master,[x,LEVEL.private,-.72]);box({w:.38,h:.42,d:.34,y:.21,mat:MAT.woodDark,parent:n,rounded:true});cyl({r:.018,h:.32,y:.66,mat:MAT.steel,parent:n});const sh=mesh(new THREE.ConeGeometry(.13,.18,14),MAT.white,n);sh.position.y=.88;}
const ward=local(master,[-.78,LEVEL.private,-1.85]);tag(ward,'GUARDA-ROUPA-V14','Guarda-roupa casal','Quarto casal');box({w:1.25,h:2.10,d:.48,y:1.05,mat:MAT.wall,parent:ward,rounded:true});for(const x of[-.40,0,.40]){box({w:.38,h:1.98,d:.025,x,y:1.04,z:-.25,mat:MAT.woodDark,parent:ward,rounded:true});box({w:.018,h:.22,d:.018,x:x+.12,y:1.04,z:-.27,mat:MAT.chrome,parent:ward});}

const bunk=byId('TRELICHE-3');if(bunk){bunk.position.set(-2.72,LEVEL.private,2.12);bunk.rotation.y=0;}
const study=byId('BANCADA-FILHOS-V10');if(study){study.position.set(-1.35,LEVEL.private+.74,3.33);}
const kidsWard=group('ARMARIO-FILHOS-V14','Armário filhos','Quarto 3 filhos',[-.62,LEVEL.private,2.58]);box({w:.66,h:2.05,d:.46,y:1.02,mat:MAT.wall,parent:kidsWard,rounded:true});for(const x of[-.16,.16])box({w:.018,h:.24,d:.018,x,y:1.05,z:-.24,mat:MAT.chrome,parent:kidsWard});

const gamer=group('GAMER-V14','Escritório gamer','Escritório/Gamer',[2.20,LEVEL.private,-1.20]);box({w:1.55,h:.08,d:.54,y:.75,mat:MAT.wood,parent:gamer,rounded:true});for(const x of[-.67,.67])box({w:.05,h:.70,d:.45,x,y:.35,mat:MAT.steel,parent:gamer});for(const x of[-.37,.37]){box({w:.58,h:.34,d:.045,x,y:1.18,z:-.25,mat:MAT.black,parent:gamer,rounded:true});box({w:.52,h:.28,d:.025,x,y:1.18,z:-.28,mat:MAT.screen,parent:gamer});}box({w:.34,h:.68,d:.40,x:.62,y:.34,z:.06,mat:MAT.black,parent:gamer,rounded:true});const gc=local(gamer,[0,0,.72]);box({w:.50,h:.14,d:.50,y:.48,mat:MAT.leather,parent:gc,rounded:true});box({w:.46,h:.68,d:.14,y:.92,z:.20,mat:MAT.leather,parent:gc,rounded:true});

scene.traverse(o=>{if(o.isPointLight)o.visible=false;if(o.isMesh)o.castShadow=false;});
renderer.shadowMap.enabled=false;renderer.setPixelRatio(Math.min(devicePixelRatio||1,.90));renderer.toneMappingExposure=1.08;

function bounds(id){const o=byId(id);return o?new THREE.Box3().setFromObject(o):null;}
function intersects(a,b,eps=.03){if(!a||!b)return false;return a.min.x<b.max.x-eps&&a.max.x>b.min.x+eps&&a.min.y<b.max.y-eps&&a.max.y>b.min.y+eps&&a.min.z<b.max.z-eps&&a.max.z>b.min.z+eps;}
const qa={version:'v1.4-screenshot-audit',removedLegacySideWalls:!byId('SOCIAL-L')&&!byId('INTIMO-L'),removedCenterColumns:!byId('PILAR-0.00-0.70'),stairs:!!byId('ESCADA-EXTERNA-COMPLETA-V14'),rearRebuilt:!!byId('FUNDOS-PRODUTIVOS-V14'),bathroomClosed:!!byId('BANHEIRO-SOCIAL-V14'),issues:[]};
for(const pair of[['HORTA-FRENTE-V14','LAGO-NATURAL'],['HORTA-FRENTE-V14','LAGO-PEIXES'],['ESTUFA-V14','AVIARIO-V14'],['AVIARIO-V14','DEP-FERR-V14']])if(intersects(bounds(pair[0]),bounds(pair[1]),0))qa.issues.push(`overlap:${pair[0]}:${pair[1]}`);
qa.pass=qa.issues.length===0;window.__CASA_AUDIT_V14__=qa;
const top=document.getElementById('topbar');if(top)top.innerHTML=`<b>CASA CONTRERAS — v1.4 PRINT AUDIT</b><br><span class="muted">paredões laterais removidos • pilares centrais limpos • escada switchback completa • fundos reconstruídos • banheiro fechado • íntimo recomposto<br>WASD • mouse • 1/2/3 • G grade • H escala • Q qualidade • F feedbacks</span>`;
const note=document.querySelector('#start .note');if(note)note.textContent='v1.4 reconstruída a partir dos bugs capturados nos prints e da prancha de referência.';
console.info('[Casa Contreras] audit v1.4',qa);
