import * as THREE from 'three';
const scene=window.__CASA_SCENE__;if(!scene)throw new Error('Casa Contreras cleanup: cena indisponível');
function byId(id){let h=null;scene.traverse(o=>{if(!h&&o.userData?.id===id)h=o;});return h;}
function under(o,ancestor){let p=o;while(p){if(p===ancestor)return true;p=p.parent;}return false;}
for(const id of['ACESSO-TRASEIRO-SOCIAL-V24','ACESSO-TRASEIRO-INTIMO-V24']){const o=byId(id);if(o)o.visible=false;}
const HOUSE={w:7.076,d:6.058,centerZ:.700},halfW=HOUSE.w/2,halfD=HOUSE.d/2,front=HOUSE.centerZ-halfD,back=HOUSE.centerZ+halfD;
const currentGround=byId('TERREO-ABERTO-V26'),removed=[];scene.updateMatrixWorld(true);
scene.traverse(o=>{if(!o.isMesh||!o.parent||under(o,currentGround))return;const b=new THREE.Box3().setFromObject(o),s=b.getSize(new THREE.Vector3()),c=b.getCenter(new THREE.Vector3());const inside=c.x>-halfW+.05&&c.x<halfW-.05&&c.z>front+.05&&c.z<back-.05;const groundWall=b.min.y<.15&&b.max.y>1.55&&b.max.y<3.05&&Math.min(s.x,s.z)<.19&&Math.max(s.x,s.z)>.55;const column=s.x<.28&&s.z<.28;if(inside&&groundWall&&!column)removed.push(o);});removed.forEach(o=>o.parent?.remove(o));
const audit={version:'v1.17-legacy-cleanup',oldDoorsHidden:true,residualGroundWallsRemoved:removed.length,groundV26:!!currentGround,stairsV26:!!byId('ESCADAS-EXTERNAS-V26'),doorsV26:!!byId('PORTAS-ARQUITETONICAS-V26'),containerV26:!!byId('CONTAINER-IDENTITY-V26'),pass:!!currentGround&&!!byId('ESCADAS-EXTERNAS-V26')&&!!byId('PORTAS-ARQUITETONICAS-V26')&&!!byId('CONTAINER-IDENTITY-V26')};window.__CASA_AUDIT_V27__=audit;console.info('[Casa Contreras] LEGACY CLEANUP',audit);
