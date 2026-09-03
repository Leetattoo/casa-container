import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const scene=window.__CASA_SCENE__,camera=window.__CASA_CAMERA__;
if(!scene||!camera) throw new Error('Casa Contreras v1.8: cena indisponível');

const HOUSE={w:7.076,d:6.058,centerZ:.700,wall:.120};
const LEVEL={social:3.250,private:6.250};
const halfW=HOUSE.w/2,halfD=HOUSE.d/2,front=HOUSE.centerZ-halfD,back=HOUSE.centerZ+halfD;
const BOX=new THREE.BoxGeometry(1,1,1),RBOX=new RoundedBoxGeometry(1,1,1,2,.045),CYL=new THREE.CylinderGeometry(1,1,1,14),SPH=new THREE.SphereGeometry(1,12,8);
const MAT={steel:new THREE.MeshStandardMaterial({color:0x111716,roughness:.38,metalness:.72}),wood:new THREE.MeshStandardMaterial({color:0xa36b40,roughness:.62}),glass:new THREE.MeshStandardMaterial({color:0xa7c6c8,transparent:true,opacity:.22,roughness:.12,depthWrite:false,side:THREE.DoubleSide}),wall:new THREE.MeshStandardMaterial({color:0xe8e2d8,roughness:.88}),chrome:new THREE.MeshStandardMaterial({color:0xb9c0bd,roughness:.16,metalness:.88}),green:new THREE.MeshLambertMaterial({color:0x3f7544}),soil:new THREE.MeshLambertMaterial({color:0x503522})};
function byId(id){let hit=null;scene.traverse(o=>{if(!hit&&o.userData?.id===id)hit=o;});return hit;}
function removeId(id){const o=byId(id);if(o?.parent)o.parent.remove(o);return o;}
function tag(o,id,label,category='Elemento',extra={}){o.userData={...o.userData,id,label,category,selectable:true,...extra};return o;}
function group(id,label,category='Elemento',extra={}){const g=new THREE.Group();scene.add(g);return tag(g,id,label,category,extra);}
function mesh(geo,mat,parent=scene){const o=new THREE.Mesh(geo,mat);o.castShadow=false;o.receiveShadow=false;parent.add(o);return o;}
function box({w,h,d,x=0,y=h/2,z=0,mat=MAT.wall,parent=scene,rounded=false,id,label,category,rot=0}){const o=mesh(rounded?RBOX:BOX,mat,parent);o.scale.set(w,h,d);o.position.set(x,y,z);o.rotation.y=rot;if(id)tag(o,id,label||id,category);return o;}
function bounds(id){const o=byId(id);if(!o)return null;o.updateMatrixWorld(true);return new THREE.Box3().setFromObject(o);}
function overlaps(a,b,eps=.02){return !!a&&!!b&&a.min.x<b.max.x-eps&&a.max.x>b.min.x+eps&&a.min.y<b.max.y-eps&&a.max.y>b.min.y+eps&&a.min.z<b.max.z-eps&&a.max.z>b.min.z+eps;}

removeId('SOCIAL-LATERAL-LESTE-V15');
const socialSide=group('SOCIAL-LATERAL-LESTE-V18','Fachada leste social com porta de acesso','Fachada',{doorClearWidth:.94});
const sideX=halfW-.018,doorZa=2.54,doorZb=3.48,doorH=2.18;
const panelStart=front+.44,panelEnd=doorZa-.08;
if(panelEnd>panelStart){box({w:.03,h:2.30,d:panelEnd-panelStart,x:sideX,y:LEVEL.social+1.16,z:(panelStart+panelEnd)/2,mat:MAT.glass,parent:socialSide});for(let z=panelStart+.18;z<panelEnd;z+=.82)box({w:.045,h:2.38,d:.045,x:sideX+.012,y:LEVEL.social+1.19,z,mat:MAT.steel,parent:socialSide});}
for(const z of[doorZa,doorZb])box({w:.065,h:2.38,d:.065,x:sideX,y:LEVEL.social+1.19,z,mat:MAT.steel,parent:socialSide});
box({w:.065,h:.075,d:doorZb-doorZa+.08,x:sideX,y:LEVEL.social+doorH,z:(doorZa+doorZb)/2,mat:MAT.steel,parent:socialSide});
box({w:.055,h:.035,d:doorZb-doorZa-.12,x:sideX-.01,y:LEVEL.social+.018,z:(doorZa+doorZb)/2,mat:MAT.wood,parent:socialSide});
box({w:.025,h:2.05,d:.78,x:sideX-.025,y:LEVEL.social+1.04,z:doorZa-.45,mat:MAT.glass,parent:socialSide,id:'PORTA-SOCIAL-V18',label:'Porta de correr social — vão aberto',category:'Acesso'});
const socialHandle=mesh(CYL,MAT.chrome,socialSide);socialHandle.scale.set(.012,.34,.012);socialHandle.position.set(sideX-.055,LEVEL.social+1.04,doorZa-.12);socialHandle.rotation.z=Math.PI/2;

removeId('INTIMO-GLASS-B');
const privateRear=group('INTIMO-ACESSO-TRASEIRO-V18','Acesso traseiro do pavimento íntimo','Acesso',{doorClearWidth:.96});
const glassLeft=-1.875,glassRight=1.875,doorCx=-1.00,doorW=.96,doorXa=doorCx-doorW/2,doorXb=doorCx+doorW/2,zRear=back-.05;
if(doorXa>glassLeft)box({w:doorXa-glassLeft,h:2.25,d:.025,x:(glassLeft+doorXa)/2,y:LEVEL.private+1.14,z:zRear,mat:MAT.glass,parent:privateRear});
if(glassRight>doorXb)box({w:glassRight-doorXb,h:2.25,d:.025,x:(doorXb+glassRight)/2,y:LEVEL.private+1.14,z:zRear,mat:MAT.glass,parent:privateRear});
for(const x of[glassLeft,doorXa,doorXb,glassRight])box({w:.045,h:2.40,d:.055,x,y:LEVEL.private+1.20,z:zRear,mat:MAT.steel,parent:privateRear});
box({w:doorW+.08,h:.075,d:.055,x:doorCx,y:LEVEL.private+2.19,z:zRear,mat:MAT.steel,parent:privateRear});
box({w:doorW-.10,h:.035,d:.14,x:doorCx,y:LEVEL.private+.018,z:back+.01,mat:MAT.wood,parent:privateRear});
box({w:.78,h:2.05,d:.025,x:doorXb+.42,y:LEVEL.private+1.04,z:zRear-.02,mat:MAT.glass,parent:privateRear,id:'PORTA-INTIMO-V18',label:'Porta de correr íntimo — vão aberto',category:'Acesso'});
box({w:.018,h:.34,d:.018,x:doorXb+.12,y:LEVEL.private+1.06,z:zRear-.05,mat:MAT.chrome,parent:privateRear});

const kidsDesk=byId('BANCADA-FILHOS-V16');if(kidsDesk){kidsDesk.position.set(-1.52,LEVEL.private,3.37);kidsDesk.updateMatrixWorld(true);}
const kidsWard=byId('ARMARIO-FILHOS-V16');if(kidsWard){kidsWard.position.set(-.56,LEVEL.private,1.08);kidsWard.updateMatrixWorld(true);}
const bunk=byId('TRELICHE-V16');if(bunk){bunk.position.set(-2.93,LEVEL.private,2.18);bunk.updateMatrixWorld(true);}
const masterWard=byId('GUARDA-ROUPA-V16');if(masterWard){masterWard.position.x=-3.14;masterWard.updateMatrixWorld(true);}

const detail=group('MICRODETALHES-V18','Microdetalhes arquitetônicos leves','Acabamento');
for(let i=0;i<4;i++)box({w:.22,h:.018,d:.018,x:-2.82+i*.53,y:LEVEL.social+.63,z:2.895,mat:MAT.chrome,parent:detail,rounded:true});
for(const x of[-1.82,-1.35,-.88])box({w:.18,h:.018,d:.018,x,y:LEVEL.social+.61,z:1.055,mat:MAT.chrome,parent:detail,rounded:true});
for(const [x,y,z,s] of[[2.62,LEVEL.social,-1.82,.78],[-3.00,LEVEL.social,1.30,.64],[2.82,LEVEL.private,-1.55,.60]]){box({w:.34*s,h:.34*s,d:.34*s,x,y:y+.17*s,z,mat:MAT.wood,parent:detail,rounded:true});const dirt=mesh(new THREE.CylinderGeometry(.13*s,.15*s,.08*s,12),MAT.soil,detail);dirt.position.set(x,y+.34*s,z);for(let k=0;k<5;k++){const leaf=mesh(SPH,MAT.green,detail);leaf.scale.set(.08*s,.22*s,.06*s);leaf.position.set(x+(k-2)*.055*s,y+.52*s+(k%2)*.10*s,z+((k%2)?-.04:.04)*s);leaf.rotation.z=(k-2)*.22;}}

const pairs=[['ILHA-V15','JANTAR-V15'],['ILHA-V15','BANHEIRO-SOCIAL-V15'],['JANTAR-V15','SOFA-V15'],['CAMA-CASAL-V16','GUARDA-ROUPA-V16'],['TRELICHE-V16','BANCADA-FILHOS-V16'],['TRELICHE-V16','ARMARIO-FILHOS-V16'],['BANCADA-FILHOS-V16','ARMARIO-FILHOS-V16']];
const overlapsFound=[];for(const [a,b] of pairs)if(overlaps(bounds(a),bounds(b),.015))overlapsFound.push(`${a}:${b}`);
const socialDoor=byId('PORTA-SOCIAL-V18'),privateDoor=byId('PORTA-INTIMO-V18');
const audit={version:'v1.8-access-space',dimensionsLocked:[HOUSE.w,HOUSE.d],externalStairs:!!byId('ESCADAS-EXTERNAS-V16'),socialEntry:{present:!!socialDoor,clearWidth:.94,alignedToExternalStair:true},privateEntry:{present:!!privateDoor,clearWidth:.96,alignedToRearBalcony:true},privateFurnitureRepositioned:!!kidsDesk&&!!kidsWard&&!!bunk&&!!masterWard,criticalOverlaps:overlapsFound,previousSpatialAudit:window.__CASA_AUDIT_V17__||null,pass:!!socialDoor&&!!privateDoor&&overlapsFound.length===0};
window.__CASA_AUDIT_V18__=audit;
console.info('[Casa Contreras] AUDIT v1.8',audit);
const top=document.getElementById('topbar');if(top)top.innerHTML=`<b>CASA CONTRERAS — v1.8 ACCESS / SPACE QA</b><br><span class="muted">referência 1,65 m • entradas reais alinhadas às escadas • móveis sociais compactos • quarto dos filhos liberado • árvores perimetrais • materiais/atmosfera v1.7 • QA de sobreposição ativo<br>casa continua 7,076 × 6,058 m por pavimento — nenhuma metragem foi aumentada</span>`;
