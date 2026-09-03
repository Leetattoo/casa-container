import * as THREE from 'three';

const scene=window.__CASA_SCENE__;
if(!scene) throw new Error('Casa Contreras v1.6 finalize: cena indisponível');
function byId(id){let h=null;scene.traverse(o=>{if(!h&&o.userData?.id===id)h=o;});return h;}
function removeId(id){const o=byId(id);if(o?.parent)o.parent.remove(o);return o;}
function tag(o,id,label,category='Elemento'){o.userData={...o.userData,id,label,category,selectable:true};return o;}
function group(id,label,category='Elemento'){const g=new THREE.Group();scene.add(g);return tag(g,id,label,category);}
const BOX=new THREE.BoxGeometry(1,1,1),SPH=new THREE.SphereGeometry(1,10,7),CYL=new THREE.CylinderGeometry(1,1,1,12),CIRCLE=new THREE.CircleGeometry(1,16);
const steel=new THREE.MeshStandardMaterial({color:0x121817,roughness:.4,metalness:.72});
const wood=new THREE.MeshStandardMaterial({color:0xa56a3d,roughness:.68});
const green=new THREE.MeshLambertMaterial({color:0x416f43});
const green2=new THREE.MeshLambertMaterial({color:0x5a8b50});
const glow=new THREE.MeshBasicMaterial({color:0xffbd72});
const darkWater=new THREE.MeshStandardMaterial({color:0x1d666d,transparent:true,opacity:.42,roughness:.14,depthWrite:false});
const lilyMat=new THREE.MeshLambertMaterial({color:0x4c864a,side:THREE.DoubleSide});
function mesh(g,m,p=scene){const o=new THREE.Mesh(g,m);o.castShadow=false;o.receiveShadow=false;p.add(o);return o;}
function box(w,h,d,x,y,z,m=steel,p=scene){const o=mesh(BOX,m,p);o.scale.set(w,h,d);o.position.set(x,y,z);return o;}
function cyl(r,h,x,y,z,m=steel,p=scene){const o=mesh(CYL,m,p);o.scale.set(r,h,r);o.position.set(x,y,z);return o;}

const deck=byId('DECK-LAGO-V15');if(deck)deck.position.set(0,0,0);
const lounge=byId('LOUNGE-LAGO-V16');if(lounge)lounge.position.x=.16;

removeId('CAPTACAO-CHUVA-V16');
const rain=group('CAPTACAO-CHUVA-V16','Calhas e descidas de água de chuva','Sistema de água');
const front=-2.329,back=3.729,roofY=9.22;
box(7.72,.07,.07,0,roofY+.03,front-.37,steel,rain);box(7.72,.07,.07,0,roofY+.03,back+.37,steel,rain);
box(.065,8.70,.065,-3.68,4.48,front-.37,steel,rain);
box(.065,.065,8.02,-3.68,.18,-6.70,steel,rain);
box(.52,.065,.065,-3.44,.18,-10.71,steel,rain);

removeId('BRISES-FACHADA-V16');
const brises=group('BRISES-FACHADA-V16','Brises verticais de madeira','Fachada');
for(const y0 of[3.25,6.25])for(const cx of[-2.74,2.74])for(let i=-4;i<=4;i++)box(.045,2.28,.055,cx+i*.105,y0+1.18,-2.285,wood,brises);

removeId('ILUMINACAO-ARQ-V16');
const led=group('ILUMINACAO-ARQ-V16','Iluminação arquitetônica quente','Iluminação');
for(const y of[3.16,6.16]){box(6.75,.025,.025,0,y,-4.06,glow,led);box(6.75,.025,.025,0,y,5.08,glow,led);}
for(const [x,z] of[[-3.73,-10.3],[-3.73,-8.0],[-3.73,-5.7],[-3.73,-3.4],[-3.73,4.6],[-3.73,7.0],[-3.73,9.4]]){box(.035,.34,.035,x,.17,z,steel,led);box(.10,.035,.10,x,.36,z,glow,led);}

removeId('JARDINEIRAS-SACADAS-V16');
const planters=group('JARDINEIRAS-SACADAS-V16','Jardineiras das sacadas','Paisagismo');
for(const y of[3.25,6.25])for(const z of[-3.72,4.78])for(const x of[-2.85,2.85]){box(.62,.24,.30,x,y+.12,z,wood,planters);for(const dx of[-.19,0,.19]){const s=mesh(SPH,dx===0?green2:green,planters);s.scale.set(.11,.16,.11);s.position.set(x+dx,y+.36,z);}}

const natural=byId('LAGO-NATURAL-V15');if(natural){
  const shallow=mesh(new THREE.CircleGeometry(.82,28),darkWater,natural);shallow.rotation.x=-Math.PI/2;shallow.scale.set(1.12,1.55,1);shallow.position.y=.045;
  for(const [x,z,s] of[[-.62,-.35,.17],[-.20,.62,.13],[.48,-.58,.15]]){const pad=mesh(CIRCLE,lilyMat,natural);pad.rotation.x=-Math.PI/2;pad.scale.set(s,s,s);pad.position.set(x,.055,z);}
}
const fish=byId('LAGO-PEIXES-V15');if(fish){
  for(let i=0;i<5;i++){const f=mesh(SPH,new THREE.MeshLambertMaterial({color:i%2?0xe0a33c:0xc96536}),fish);f.scale.set(.10,.035,.045);f.position.set(-.25+(i%3)*.22,.07,-.42+Math.floor(i/3)*.45);f.rotation.y=(i*.8)%Math.PI;}
}

removeId('BORDA-VEGETAL-LAGOS-V16');
const edge=group('BORDA-VEGETAL-LAGOS-V16','Vegetação de borda dos lagos','Paisagismo');
for(const [cx,cz,rx,rz] of[[-2.25,-7.35,1.30,1.84],[1.72,-5.30,.86,1.17]])for(let i=0;i<10;i++){const a=i/10*Math.PI*2,x=cx+Math.cos(a)*rx,z=cz+Math.sin(a)*rz;if(x<-3.65)continue;for(let k=0;k<2;k++)cyl(.018,.28+k*.07,x+k*.04,.16+k*.025,z+k*.03,i%2?green:green2,edge);}

window.__CASA_V16_FINALIZE__={deckReset:!!deck,loungeDryZone:!!lounge,rainSafeRoute:true,brises:true,architecturalLighting:true,pondDepth:true};
console.info('[Casa Contreras] v1.6 finalize',window.__CASA_V16_FINALIZE__);
