import * as THREE from 'three';

const scene=window.__CASA_SCENE__;
if(!scene) throw new Error('Casa Contreras v1.2 fix: cena indisponivel');
const HOUSE={w:7.076,d:6.058,centerZ:.700};
const LEVEL={social:3.250,private:6.250};
const halfW=HOUSE.w/2,halfD=HOUSE.d/2,front=HOUSE.centerZ-halfD,back=HOUSE.centerZ+halfD;
function byId(id){let hit=null;scene.traverse(o=>{if(!hit&&o.userData?.id===id)hit=o;});return hit;}
function removeId(id){const o=byId(id);if(o?.parent)o.parent.remove(o);return o;}
function tag(o,id,label,category='Elemento',extra={}){o.userData={...o.userData,id,label,category,selectable:true,...extra};return o;}
const BOX=new THREE.BoxGeometry(1,1,1);
const wood=new THREE.MeshStandardMaterial({color:0xb67943,roughness:.64});
const wall=new THREE.MeshStandardMaterial({color:0xe8e1d5,roughness:.9});
function box({w,h,d,x=0,y=h/2,z=0,mat=wall,parent=scene,id,label,category}){const m=new THREE.Mesh(BOX,mat);m.scale.set(w,h,d);m.position.set(x,y,z);m.castShadow=false;m.receiveShadow=false;parent.add(m);if(id)tag(m,id,label||id,category);return m;}
const tv=byId('TV-SALA');if(tv){tv.position.x=2.38;tv.updateMatrixWorld(true);}removeId('PAREDE-MIDIA-V12');box({w:.10,h:2.50,d:1.86,x:2.47,y:LEVEL.social+1.25,z:-.58,mat:wall,id:'PAREDE-MIDIA-V12',label:'Parede de mídia / separação da escada',category:'Sala'});
removeId('PISO-INTIMO');const floor=new THREE.Group();scene.add(floor);tag(floor,'PISO-INTIMO','Pavimento íntimo com vão real da escada','Pavimento',{stairOpening:true});const openX0=2.42,openX1=3.42,openZ0=-2.10,openZ1=1.25;box({w:openX0+halfW,h:.14,d:HOUSE.d,x:(-halfW+openX0)/2,y:LEVEL.private-.07,z:HOUSE.centerZ,mat:wood,parent:floor});box({w:halfW-openX1,h:.14,d:HOUSE.d,x:(openX1+halfW)/2,y:LEVEL.private-.07,z:HOUSE.centerZ,mat:wood,parent:floor});box({w:openX1-openX0,h:.14,d:openZ0-front,x:(openX0+openX1)/2,y:LEVEL.private-.07,z:(front+openZ0)/2,mat:wood,parent:floor});box({w:openX1-openX0,h:.14,d:back-openZ1,x:(openX0+openX1)/2,y:LEVEL.private-.07,z:(openZ1+back)/2,mat:wood,parent:floor});
const stair=byId('ESCADA-INTERNA-SOCIAL-INTIMO-V12');const tvBox=tv?new THREE.Box3().setFromObject(tv):null;const stairBox=stair?new THREE.Box3().setFromObject(stair):null;const intersects=!!(tvBox&&stairBox&&tvBox.intersectsBox(stairBox));window.__CASA_V12_FIX__={version:'v1.2.1',tvStairOverlap:intersects,privateFloorOpening:true};if(intersects)console.warn('[Casa Contreras] TV ainda intersecta escada',window.__CASA_V12_FIX__);else console.info('[Casa Contreras] v1.2.1 fix OK',window.__CASA_V12_FIX__);
