import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const scene=window.__CASA_SCENE__, camera=window.__CASA_CAMERA__, renderer=window.__CASA_RENDERER__;
if(!scene||!camera||!renderer) throw new Error('Casa Contreras v1.6: cena base indisponível');

const HOUSE={w:7.076,d:6.058,centerZ:.700,wall:.120};
const LEVEL={ground:0,social:3.250,private:6.250,roof:9.220};
const EYE=1.660, halfW=HOUSE.w/2, halfD=HOUSE.d/2, front=HOUSE.centerZ-halfD, back=HOUSE.centerZ+halfD;
const inner={west:-halfW+HOUSE.wall,east:halfW-HOUSE.wall,front:front+HOUSE.wall,back:back-HOUSE.wall};

function byId(id){let h=null;scene.traverse(o=>{if(!h&&o.userData?.id===id)h=o;});return h;}
function allPrefix(p){const a=[];scene.traverse(o=>{if(o.userData?.id?.startsWith(p))a.push(o);});return a;}
function removeId(id){const o=byId(id);if(o?.parent)o.parent.remove(o);return o;}
function removePrefix(p){allPrefix(p).forEach(o=>o.parent?.remove(o));}
function tag(o,id,label,category='Elemento',extra={}){o.userData={...o.userData,id,label,category,selectable:true,...extra};return o;}
function group(id,label,category,pos=[0,0,0],extra={}){const g=new THREE.Group();g.position.set(...pos);scene.add(g);return tag(g,id,label,category,extra);}
function local(parent,pos=[0,0,0],rot=0){const g=new THREE.Group();g.position.set(...pos);g.rotation.y=rot;parent.add(g);return g;}

const BOX=new THREE.BoxGeometry(1,1,1),RBOX=new RoundedBoxGeometry(1,1,1,2,.05),CYL=new THREE.CylinderGeometry(1,1,1,14),SPHERE=new THREE.SphereGeometry(1,10,7);
const M={
 steel:new THREE.MeshStandardMaterial({color:0x111716,roughness:.38,metalness:.72}),
 steel2:new THREE.MeshStandardMaterial({color:0x2c3431,roughness:.48,metalness:.55}),
 wood:new THREE.MeshStandardMaterial({color:0x9d6237,roughness:.68}),
 wood2:new THREE.MeshStandardMaterial({color:0xbe8250,roughness:.64}),
 wall:new THREE.MeshStandardMaterial({color:0xe8e2d8,roughness:.91}),
 quartz:new THREE.MeshStandardMaterial({color:0xeee9df,roughness:.34}),
 black:new THREE.MeshStandardMaterial({color:0x0b0f0f,roughness:.40,metalness:.28}),
 glass:new THREE.MeshStandardMaterial({color:0xa6c4c6,transparent:true,opacity:.25,roughness:.13,depthWrite:false,side:THREE.DoubleSide}),
 water:new THREE.MeshStandardMaterial({color:0x278b91,transparent:true,opacity:.82,roughness:.16}),
 soil:new THREE.MeshLambertMaterial({color:0x503522}),green:new THREE.MeshLambertMaterial({color:0x35683c}),green2:new THREE.MeshLambertMaterial({color:0x54854e}),
 white:new THREE.MeshStandardMaterial({color:0xf2eee7,roughness:.87}),fabric:new THREE.MeshStandardMaterial({color:0x7d7b75,roughness:1}),fabric2:new THREE.MeshStandardMaterial({color:0xb7b1a8,roughness:1}),
 chrome:new THREE.MeshStandardMaterial({color:0xb8bfbc,roughness:.18,metalness:.9}),solar:new THREE.MeshStandardMaterial({color:0x123c59,roughness:.22,metalness:.66}),
 fruit:new THREE.MeshLambertMaterial({color:0xd86c31}),fruit2:new THREE.MeshLambertMaterial({color:0xe2b73f}),red:new THREE.MeshLambertMaterial({color:0xb94638})
};
function mesh(g,m,p=scene){const o=new THREE.Mesh(g,m);o.castShadow=false;o.receiveShadow=false;p.add(o);return o;}
function box({w,h,d,x=0,y=h/2,z=0,mat=M.wall,parent=scene,rounded=false,id,label,category,rot=0,extra}){const o=mesh(rounded?RBOX:BOX,mat,parent);o.scale.set(w,h,d);o.position.set(x,y,z);o.rotation.y=rot;if(id)tag(o,id,label||id,category||'Elemento',extra);return o;}
function cyl({r=.1,h=1,x=0,y=h/2,z=0,mat=M.steel,parent=scene,id,label,category}){const o=mesh(CYL,mat,parent);o.scale.set(r,h,r);o.position.set(x,y,z);if(id)tag(o,id,label||id,category||'Elemento');return o;}

if(!window.__CASA_V16_LEVEL_GUARD__){
  window.__CASA_V16_LEVEL_GUARD__=true;
  const nativeDispatch=window.dispatchEvent.bind(window);
  window.dispatchEvent=function(ev){
    if(window.__CASA_V16_SUPPRESS_SYNTHETIC_LEVEL__ && ev instanceof KeyboardEvent && !ev.isTrusted && /^Digit[123]$/.test(ev.code)) return true;
    return nativeDispatch(ev);
  };
  const prevRender=renderer.render.bind(renderer);
  renderer.render=function(s,c){
    const beforeY=c.position.y;
    const oldLower=c.position.x>3.52&&c.position.x<4.76&&c.position.z>-1.95&&c.position.z<3.35;
    const oldUpper=c.position.z>4.56&&c.position.z<5.80&&c.position.x>-1.90&&c.position.x<3.40;
    const falseUpper=oldUpper && beforeY < LEVEL.social+EYE-.55;
    const falseLower=oldLower && beforeY > LEVEL.social+EYE+.55;
    window.__CASA_V16_SUPPRESS_SYNTHETIC_LEVEL__=falseUpper||falseLower;
    const out=prevRender(s,c);
    window.__CASA_V16_SUPPRESS_SYNTHETIC_LEVEL__=false;
    if(falseUpper||falseLower)c.position.y=beforeY;
    return out;
  };
}

removeId('ESCADAS-V15');
const stairs=group('ESCADAS-EXTERNAS-V16','Escadas 100% externas — térreo/social/íntimo','Escada',[0,0,0],{externalToLivingEnvelope:true,walkable:true});
const stairW=.92, lowerX=4.14, lowerZa=-1.75, lowerZb=3.15, upperZ=5.55, upperXa=3.20, upperXb=-1.70;
function flightZ(x,y0,y1,za,zb,n){for(let i=0;i<n;i++){const t=(i+1)/n;box({w:stairW,h:.075,d:.28,x,y:y0+(y1-y0)*t-.037,z:za+(zb-za)*t,mat:M.wood2,parent:stairs,rounded:true});}for(const side of[-1,1]){box({w:.035,h:.035,d:Math.abs(zb-za)+.28,x:x+side*(stairW/2-.03),y:(y0+y1)/2+.80,z:(za+zb)/2,mat:M.steel,parent:stairs});for(let i=0;i<=8;i++){const t=i/8;box({w:.035,h:.80,d:.035,x:x+side*(stairW/2-.03),y:y0+(y1-y0)*t+.40,z:za+(zb-za)*t,mat:M.steel,parent:stairs});}}}
function flightX(z,y0,y1,xa,xb,n){for(let i=0;i<n;i++){const t=(i+1)/n;box({w:.28,h:.075,d:stairW,x:xa+(xb-xa)*t,y:y0+(y1-y0)*t-.037,z,mat:M.wood2,parent:stairs,rounded:true});}for(const side of[-1,1]){box({w:Math.abs(xb-xa)+.28,h:.035,d:.035,x:(xa+xb)/2,y:(y0+y1)/2+.80,z:z+side*(stairW/2-.03),mat:M.steel,parent:stairs});for(let i=0;i<=8;i++){const t=i/8;box({w:.035,h:.80,d:.035,x:xa+(xb-xa)*t,y:y0+(y1-y0)*t+.40,z:z+side*(stairW/2-.03),mat:M.steel,parent:stairs});}}}
flightZ(lowerX,0,LEVEL.social,lowerZa,lowerZb,18);
box({w:1.30,h:.11,d:1.25,x:lowerX,y:LEVEL.social-.055,z:3.68,mat:M.wood2,parent:stairs,rounded:true});
box({w:1.28,h:.11,d:1.45,x:3.58,y:LEVEL.social-.055,z:4.42,mat:M.wood2,parent:stairs,rounded:true});
box({w:1.18,h:.11,d:.90,x:3.20,y:LEVEL.social-.055,z:5.18,mat:M.wood2,parent:stairs,rounded:true});
flightX(upperZ,LEVEL.social,LEVEL.private,upperXa,upperXb,17);
box({w:1.18,h:.11,d:.92,x:upperXb,y:LEVEL.private-.055,z:upperZ,mat:M.wood2,parent:stairs,rounded:true});
box({w:1.18,h:.11,d:.90,x:upperXb,y:LEVEL.private-.055,z:5.16,mat:M.wood2,parent:stairs,rounded:true});

const priv=byId('INTIMO-V15');
if(priv){
  const direct=[...priv.children];
  for(const o of direct){
    if(!o.isMesh)continue;
    const sx=Math.abs(o.scale.x),sy=Math.abs(o.scale.y),sz=Math.abs(o.scale.z);
    if(Math.abs(sx-.10)<.025&&Math.abs(sy-2.60)<.06&&Math.abs(sz-5.80)<.08)priv.remove(o);
  }
  const x=-.02,h=2.60,door=.88;
  const segs=[[inner.front,-1.45],[-.57,1.64],[2.52,inner.back]];
  for(const [za,zb] of segs)box({w:.10,h,d:zb-za,x,y:LEVEL.private+h/2,z:(za+zb)/2,mat:M.wall,parent:priv});
  for(const z of[-1.01,2.08])box({w:.10,h:.48,d:door,x,y:LEVEL.private+2.36,z,mat:M.wall,parent:priv});
}

removeId('MASTER-V15');removeId('TRELICHE-V15');removeId('BANCADA-FILHOS-V15');
if(priv){
  const master=local(priv,[0,0,0]);tag(master,'MASTER-V16','Quarto casal realinhado','Quarto casal');
  const bed=local(master,[-2.10,LEVEL.private,-.30],0);tag(bed,'CAMA-CASAL-V16','Cama queen 1,58 × 1,98 m','Quarto casal');
  box({w:1.58,h:.16,d:1.98,y:.14,mat:M.wood2,parent:bed,rounded:true});box({w:1.52,h:.18,d:1.90,y:.31,mat:M.white,parent:bed,rounded:true});box({w:1.58,h:.90,d:.10,y:.70,z:.94,mat:M.wood,parent:bed,rounded:true});
  for(const x of[-.38,.38])box({w:.58,h:.10,d:.35,x,y:.50,z:.60,mat:M.white,parent:bed,rounded:true});
  for(const x of[-3.15,-1.05]){const n=local(master,[x,LEVEL.private,-.15]);box({w:.34,h:.40,d:.32,y:.20,mat:M.wood,parent:n,rounded:true});}
  const ward=local(master,[-3.10,LEVEL.private,-1.55],Math.PI/2);tag(ward,'GUARDA-ROUPA-V16','Guarda-roupa casal','Quarto casal');box({w:1.18,h:2.02,d:.48,y:1.01,mat:M.wall,parent:ward,rounded:true});for(const x of[-.36,0,.36])box({w:.32,h:1.90,d:.025,x,y:.99,z:-.25,mat:M.wood,parent:ward,rounded:true});

  const kids=local(priv,[0,0,0]);tag(kids,'QUARTO-FILHOS-V16','Quarto dos 3 filhos','Quarto 3 filhos');
  const bunk=local(kids,[-2.94,LEVEL.private,2.18],0);tag(bunk,'TRELICHE-V16','Treliche 3 camas sobrepostas','Quarto 3 filhos',{footprint:[.92,2.00]});
  for(const x of[-.43,.43])for(const z of[-.95,.95])box({w:.05,h:2.32,d:.05,x,y:1.16,z,mat:M.steel,parent:bunk});
  [.34,1.10,1.86].forEach(yy=>{box({w:.92,h:.07,d:2.00,y:yy-.07,mat:M.wood2,parent:bunk});box({w:.84,h:.13,d:1.90,y:yy,mat:M.white,parent:bunk,rounded:true});box({w:.04,h:.25,d:1.82,x:.44,y:yy+.22,mat:M.steel,parent:bunk});});
  for(let y=.38;y<=2.05;y+=.33)box({w:.38,h:.03,d:.04,x:.46,y,z:-.78,mat:M.steel,parent:bunk});
  const desk=local(kids,[-1.55,LEVEL.private,3.30]);tag(desk,'BANCADA-FILHOS-V16','Bancada estudo dos 3 filhos','Quarto 3 filhos');box({w:1.82,h:.07,d:.40,y:.73,mat:M.wood2,parent:desk,rounded:true});
  for(const x of[-.58,0,.58]){box({w:.30,h:.10,d:.32,x,y:.44,z:-.46,mat:M.fabric,parent:desk,rounded:true});box({w:.04,h:.38,d:.04,x,y:.19,z:-.46,mat:M.steel,parent:desk});}
  const kw=local(kids,[-.62,LEVEL.private,2.90]);tag(kw,'ARMARIO-FILHOS-V16','Armário dos filhos','Quarto 3 filhos');box({w:.60,h:1.95,d:.42,y:.98,mat:M.wall,parent:kw,rounded:true});
}

removeId('PISO-TERREO');
const oldAisle=byId('CORREDOR-TERREO-V15');if(oldAisle){oldAisle.position.set(2.55,.055,.10);oldAisle.scale.set(1.10,1,1.04);}
const groundFinish=byId('PISO-TERREO-ACABAMENTO-V15');if(groundFinish)groundFinish.position.y=.045;

const cis=byId('CISTERNA-V15');if(cis){cis.position.set(-3.22,0,-10.72);cis.userData.label='Cisterna frontal de captação de chuva ~1500 L';}
removePrefix('HORTA-FRENTE-V16');
const frontBeds=group('HORTA-FRENTE-V16','Horta frontal compacta','Horta');
for(let i=0;i<3;i++){const z=-9.08+i*.91,g=local(frontBeds,[.03,0,z]);tag(g,`HORTA-FRENTE-V16-${i+1}`,'Canteiro frontal','Horta');box({w:.92,h:.23,d:.62,y:.115,mat:M.wood,parent:g,rounded:true});box({w:.80,h:.07,d:.50,y:.26,mat:M.soil,parent:g});for(let j=0;j<4;j++){const p=mesh(new THREE.ConeGeometry(.055,.20,7),j%2?M.green:M.green2,g);p.position.set(-.28+j*.19,.40,0);}}

const deck=byId('DECK-LAGO-V15');if(deck){deck.position.set(-.75,0,-6.92);}
const lounge=group('LOUNGE-LAGO-V16','Espreguiçadeiras do lago','Lazer');
for(const z of[-7.38,-6.58]){const g=local(lounge,[-.78,0,z],-.10);box({w:.55,h:.10,d:1.48,y:.18,mat:M.wood2,parent:g,rounded:true});const backRest=box({w:.55,h:.08,d:.72,y:.48,z:.48,mat:M.wood2,parent:g,rounded:true});backRest.rotation.x=-.52;}

removeId('RESERVATORIO-V16');
const tank=group('RESERVATORIO-V16','Reservatório operacional de cobertura','Sistema de água',[2.72,LEVEL.roof,.95]);cyl({r:.36,h:.78,y:.43,mat:M.steel2,parent:tank});cyl({r:.30,h:.05,y:.84,mat:M.black,parent:tank});
const rain=group('CAPTACAO-CHUVA-V16','Calhas e descidas de água de chuva','Sistema de água');
box({w:HOUSE.w+.64,h:.08,d:.08,x:0,y:LEVEL.roof+.02,z:front-.38,mat:M.steel,parent:rain});box({w:HOUSE.w+.64,h:.08,d:.08,x:0,y:LEVEL.roof+.02,z:back+.38,mat:M.steel,parent:rain});
box({w:.07,h:8.55,d:.07,x:-3.25,y:4.45,z:front-.38,mat:M.steel,parent:rain});box({w:.07,h:.07,d:8.05,x:-3.25,y:.20,z:-6.70,mat:M.steel,parent:rain});

const pv=byId('FOTOVOLTAICO-V15');if(pv){pv.position.set(0,0,0);}
for(const o of allPrefix('FV-V15-')){o.material=M.solar;}

const orchardExtra=group('POMAR-EXTRA-V16','Pomar frutífero complementar','Pomar');
const extra=[['BANANA',-3.05,5.05],['JABUTICABA',-3.02,8.65],['LARANJA',3.10,6.85],['LIMAO',3.05,8.15],['ACEROLA',3.08,10.55],['PITANGA',-1.05,11.15],['GOIABA',1.05,11.12],['MEXERICA',-3.00,-4.72]];
extra.forEach(([name,x,z],i)=>{const g=local(orchardExtra,[x,0,z]);tag(g,`FRUTIFERA-EXTRA-${i}-${name}`,name,'Árvore frutífera');cyl({r:.085,h:1.18,y:.59,mat:M.wood,parent:g});const crown=mesh(SPHERE,i%2?M.green:M.green2,g);crown.scale.set(.44,.58,.44);crown.position.y=1.42;const fm=i%3===0?M.fruit:i%3===1?M.fruit2:M.red;for(let k=0;k<4;k++){const f=mesh(SPHERE,fm,g);f.scale.set(.04,.04,.04);const a=k/4*Math.PI*2;f.position.set(Math.cos(a)*.27,1.42+(k%2)*.15,Math.sin(a)*.27);}});

const filterGarden=group('JARDIM-FILTRANTE-V16','Jardim filtrante / reuso','Reuso',[3.12,0,7.00]);box({w:1.05,h:.12,d:1.35,y:.06,mat:M.soil,parent:filterGarden,rounded:true});for(let i=0;i<7;i++){const p=mesh(new THREE.ConeGeometry(.06,.28,7),i%2?M.green:M.green2,filterGarden);p.position.set(-.34+(i%3)*.34,.24,-.42+Math.floor(i/3)*.38);}

function bounds(id){const o=byId(id);return o?new THREE.Box3().setFromObject(o):null;}
function overlaps(a,b,eps=.02){if(!a||!b)return false;return a.min.x<b.max.x-eps&&a.max.x>b.min.x+eps&&a.min.y<b.max.y-eps&&a.max.y>b.min.y+eps&&a.min.z<b.max.z-eps&&a.max.z>b.min.z+eps;}
const qa={version:'v1.6-heavy-bughunt',issues:[],stairsExternal:true,falseFloorJumpGuard:true,privateDoorOpenings:true,frontOptimized:true,required:{solar:!!byId('FOTOVOLTAICO-V15'),cistern:!!byId('CISTERNA-V15'),roofTank:!!byId('RESERVATORIO-V16'),frontBalcony:!!byId('SACADA-FRENTE-3.25-V15'),rearBalcony:!!byId('SACADA-FUNDOS-3.25-V15'),verticalGardenA:!!byId('HORTA-VERTICAL-A-V15'),fruitOrchard:!!byId('POMAR-FRUTIFERO-V15')}};
for(const [a,b] of[['HORTA-FRENTE-V16','LAGO-NATURAL-V15'],['HORTA-FRENTE-V16','LAGO-PEIXES-V15'],['HORTA-FRENTE-V16','COBERTURA-GARAGEM-V15'],['CISTERNA-V15','CAMINHO-LATERAL-V15'],['LOUNGE-LAGO-V16','CAMINHO-LATERAL-V15'],['JARDIM-FILTRANTE-V16','CAMINHO-LATERAL-V15'],['ESCADAS-EXTERNAS-V16','CAMINHO-LATERAL-V15']])if(overlaps(bounds(a),bounds(b),0))qa.issues.push(`overlap:${a}:${b}`);
for(const [k,v] of Object.entries(qa.required))if(!v)qa.issues.push(`missing:${k}`);
qa.pass=qa.issues.length===0;window.__CASA_AUDIT_V16__=qa;

scene.traverse(o=>{if(o.isPointLight)o.visible=false;if(o.isMesh)o.castShadow=false;});renderer.shadowMap.enabled=false;renderer.setPixelRatio(Math.min(devicePixelRatio||1,.86));camera.fov=58;camera.updateProjectionMatrix();
const top=document.getElementById('topbar');if(top)top.innerHTML=`<b>CASA CONTRERAS — v1.6 HEAVY BUG HUNT</b><br><span class="muted">escadas 100% externas • bug de troca de andar bloqueado • portas reais no íntimo • frente reaproveitada • cisterna frontal • solar + calhas • pomar ampliado • circulação auditada<br>WASD • mouse • 1/2/3 • G grade • H escala • Q qualidade • F feedbacks</span>`;
const note=document.querySelector('#start .note');if(note)note.textContent='v1.6: caça-bug estrutural e alinhamento incremental com as imagens de referência, sem alterar o envelope 7,076 × 6,058 m.';
console.info('[Casa Contreras] AUDIT v1.6',qa);
