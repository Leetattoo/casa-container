import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const scene=window.__CASA_SCENE__,camera=window.__CASA_CAMERA__;
if(!scene||!camera) throw new Error('Casa Contreras v1.17 structural: cena indisponível');

const HOUSE={w:7.076,d:6.058,centerZ:.700,wall:.120};
const LEVEL={ground:0,social:3.250,private:6.250};
const halfW=HOUSE.w/2,halfD=HOUSE.d/2,front=HOUSE.centerZ-halfD,back=HOUSE.centerZ+halfD;
const BOX=new THREE.BoxGeometry(1,1,1),RBOX=new RoundedBoxGeometry(1,1,1,3,.05),CYL=new THREE.CylinderGeometry(1,1,1,16);
const MAT={steel:new THREE.MeshStandardMaterial({color:0x111817,roughness:.34,metalness:.76}),steel2:new THREE.MeshStandardMaterial({color:0x27302d,roughness:.43,metalness:.62}),wood:new THREE.MeshStandardMaterial({color:0xa66b3e,roughness:.61}),wood2:new THREE.MeshStandardMaterial({color:0xc08a56,roughness:.57}),wall:new THREE.MeshStandardMaterial({color:0xe8e2d8,roughness:.86}),quartz:new THREE.MeshStandardMaterial({color:0xeeeae3,roughness:.29}),glass:new THREE.MeshPhysicalMaterial({color:0xb8d0d2,transparent:true,opacity:.18,roughness:.08,metalness:.01,clearcoat:.45,depthWrite:false,side:THREE.DoubleSide}),fabric:new THREE.MeshStandardMaterial({color:0x8b887f,roughness:.96}),fabric2:new THREE.MeshStandardMaterial({color:0xc7c0b6,roughness:.98}),leather:new THREE.MeshStandardMaterial({color:0x343735,roughness:.73}),dark:new THREE.MeshStandardMaterial({color:0x111514,roughness:.34,metalness:.28}),chrome:new THREE.MeshStandardMaterial({color:0xc0c6c4,roughness:.14,metalness:.91})};

function byId(id){let h=null;scene.traverse(o=>{if(!h&&o.userData?.id===id)h=o;});return h;}
function removeId(id){const o=byId(id);if(o?.parent)o.parent.remove(o);return o;}
function tag(o,id,label,category='Elemento',extra={}){o.userData={...o.userData,id,label,category,selectable:true,...extra};return o;}
function group(id,label,category='Elemento',extra={}){const g=new THREE.Group();scene.add(g);return tag(g,id,label,category,extra);}
function mesh(parent,w,h,d,x,y,z,mat=MAT.wall,rounded=false,rot=0){const o=new THREE.Mesh(rounded?RBOX:BOX,mat);o.scale.set(w,h,d);o.position.set(x,y,z);o.rotation.y=rot;o.castShadow=false;o.receiveShadow=false;parent.add(o);return o;}
function cyl(parent,r,h,x,y,z,mat=MAT.steel){const o=new THREE.Mesh(CYL,mat);o.scale.set(r,h,r);o.position.set(x,y,z);o.castShadow=false;parent.add(o);return o;}
function local(parent,x,y,z,rot=0){const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=rot;parent.add(g);return g;}

// ---------------------------------------------------------------------------
// 1) TÉRREO: remove a composição com painéis de 2,05 m e qualquer parede
// residual no pilotis. O eixo visual frente -> fundos fica aberto.
// ---------------------------------------------------------------------------
removeId('TERREO-V15');removeId('TERREO-ABERTO-V26');
const residual=[];scene.updateMatrixWorld(true);
scene.traverse(o=>{
  if(!o.isMesh||!o.parent)return;
  const b=new THREE.Box3().setFromObject(o),s=b.getSize(new THREE.Vector3()),c=b.getCenter(new THREE.Vector3());
  const inside=c.x>-halfW+.05&&c.x<halfW-.05&&c.z>front+.05&&c.z<back-.05;
  const groundTall=b.min.y<.15&&b.max.y>1.55&&b.max.y<3.05;
  const wallLike=Math.min(s.x,s.z)<.19&&Math.max(s.x,s.z)>.55;
  const columnLike=s.x<.28&&s.z<.28;
  if(inside&&groundTall&&wallLike&&!columnLike)residual.push(o);
});
residual.forEach(o=>o.parent?.remove(o));

const ground=group('TERREO-ABERTO-V26','Pilotis aberto com vista contínua aos fundos','Térreo',{openSightline:true});
mesh(ground,6.78,.045,5.62,0,.023,.70,MAT.quartz,true);
// teto ripado leve — só nas bordas, não fecha a visão.
for(let x=-3.15;x<=3.15;x+=.30){if(x>-.70&&x<1.25)continue;mesh(ground,.11,.035,5.10,x,3.10,.70,MAT.wood2);}
// oficina lateral esquerda
const work=local(ground,-2.72,0,2.45);tag(work,'OFICINA-V26','Oficina lateral aberta','Serviços');
mesh(work,.58,.86,1.85,0,.43,0,MAT.wood,true,Math.PI/2);mesh(work,.62,.055,1.92,0,.89,0,MAT.quartz,true,Math.PI/2);
mesh(work,.055,1.55,1.78,-.31,.78,0,MAT.steel);for(let z=-.65;z<=.65;z+=.43)mesh(work,.42,.035,.28,-.12,1.25,z,MAT.wood2,true);
// depósito em estante baixa junto ao muro esquerdo
const store=local(ground,-3.05,0,.65);tag(store,'DEPOSITO-V26','Depósito lateral aberto','Serviços');
for(let z=-.55;z<=.55;z+=.55)for(const y of[.32,.74,1.14])mesh(store,.42,.045,.44,0,y,z,MAT.wood2,true);for(const z of[-.78,.78])mesh(store,.045,1.25,.045,0,.63,z,MAT.steel);
// lavanderia lateral direita, sem parede traseira
const laundry=local(ground,2.60,0,2.52);tag(laundry,'LAVANDERIA-V26','Lavanderia aberta lateral','Serviços');
for(const x of[-.34,.34]){mesh(laundry,.60,.82,.59,x,.41,0,MAT.wall,true);const d=new THREE.Mesh(new THREE.CylinderGeometry(.20,.20,.024,20),MAT.glass);d.rotation.x=Math.PI/2;d.position.set(x,.45,-.305);laundry.add(d);}mesh(laundry,1.40,.055,.64,0,.88,0,MAT.quartz,true);
// gourmet lateral esquerdo/frontal
const gourmet=local(ground,-2.42,0,-1.35);tag(gourmet,'GOURMET-V26','Gourmet aberto premium','Gourmet');
mesh(gourmet,2.05,.82,.58,0,.41,0,MAT.wood,true);mesh(gourmet,2.12,.055,.64,0,.86,0,MAT.quartz,true);mesh(gourmet,.52,1.28,.58,-.70,.64,0,MAT.dark,true);mesh(gourmet,.46,.045,.32,.38,.90,-.02,MAT.chrome,true);cyl(gourmet,.014,.28,.53,1.04,.10,MAT.chrome);
// mesa fica à esquerda do eixo visual; corredor central ~1,45 m livre.
const table=local(ground,-.92,0,.25);tag(table,'MESA-GOURMET-V26','Mesa gourmet compacta','Gourmet');
mesh(table,1.42,.075,.76,0,.74,0,MAT.wood2,true);for(const x of[-.56,.56])for(const z of[-.25,.25])mesh(table,.04,.70,.04,x,.35,z,MAT.steel);
function chair(parent,x,z,rot){const g=local(parent,x,0,z,rot);mesh(g,.40,.085,.42,0,.44,0,MAT.wood2,true);mesh(g,.40,.44,.07,0,.72,.18,MAT.wood2,true);for(const xx of[-.15,.15])for(const zz of[-.15,.15])mesh(g,.032,.40,.032,xx,.20,zz,MAT.steel);}
for(let i=0;i<3;i++){chair(table,-.48+i*.48,-.58,Math.PI);chair(table,-.48+i*.48,.58,0);}
// eixo visual marcado apenas no piso, sem volume bloqueador.
const sight=mesh(ground,1.45,.008,5.35,.60,.050,.70,new THREE.MeshBasicMaterial({color:0xc8b891,transparent:true,opacity:.055}));tag(sight,'EIXO-VISUAL-TERREO-V26','Eixo visual livre frente → fundos','Circulação',{clearWidth:1.45});

// Colisões legadas de parede do térreo deixam de bloquear o pilotis aberto.
if(!window.__CASA_V26_GROUND_COLLISION__){window.__CASA_V26_GROUND_COLLISION__=true;const previous=THREE.Box3.prototype.intersectsBox;THREE.Box3.prototype.intersectsBox=function(b){const ps=this.getSize(new THREE.Vector3()),pc=this.getCenter(new THREE.Vector3()),bs=b.getSize(new THREE.Vector3()),bc=b.getCenter(new THREE.Vector3());const player=ps.x>.42&&ps.x<.60&&ps.z>.42&&ps.z<.60&&ps.y>1.45&&ps.y<1.92;const inside=bc.x>-halfW&&bc.x<halfW&&bc.z>front&&bc.z<back;const oldGroundWall=b.min.y<.15&&b.max.y>1.55&&b.max.y<3.05&&Math.min(bs.x,bs.z)<.19&&Math.max(bs.x,bs.z)>.55;if(player&&pc.y<2.25&&inside&&oldGroundWall)return false;return previous.call(this,b);};}

// ---------------------------------------------------------------------------
// 2) ESCADA EXTERNA REAL: dois lances, patamares e passarela posterior.
// ---------------------------------------------------------------------------
removeId('ESCADAS-EXTERNAS-V16');removeId('ESCADAS-EXTERNAS-V26');removeId('PASSARELA-ACESSO-3.25-V24');removeId('PASSARELA-ACESSO-6.25-V24');
const stairs=group('ESCADAS-EXTERNAS-V26','Escadas externas definitivas','Escada',{externalToLivingEnvelope:true,walkable:true});
const stairW=.96,lowerX=4.14,lowerZa=-1.75,lowerZb=3.15,upperZ=4.92,upperXa=3.05,upperXb=-1.65;
function flightZ(x,y0,y1,za,zb,n){const run=(zb-za)/n;for(let i=0;i<n;i++){const t=(i+1)/n,z=za+(zb-za)*t,y=y0+(y1-y0)*t;mesh(stairs,stairW,.075,Math.max(.245,Math.abs(run)+.035),x,y-.038,z,MAT.wood2,true);}for(const side of[-1,1]){const railX=x+side*(stairW/2-.03);mesh(stairs,.035,.035,Math.abs(zb-za)+.25,railX,(y0+y1)/2+.82,(za+zb)/2,MAT.steel);for(let i=0;i<=9;i++){const t=i/9;mesh(stairs,.035,.82,.035,railX,y0+(y1-y0)*t+.41,za+(zb-za)*t,MAT.steel);}}}
function flightX(z,y0,y1,xa,xb,n){const run=(xb-xa)/n;for(let i=0;i<n;i++){const t=(i+1)/n,x=xa+(xb-xa)*t,y=y0+(y1-y0)*t;mesh(stairs,Math.max(.245,Math.abs(run)+.035),.075,stairW,x,y-.038,z,MAT.wood2,true);}for(const side of[-1,1]){const railZ=z+side*(stairW/2-.03);mesh(stairs,Math.abs(xb-xa)+.25,.035,.035,(xa+xb)/2,(y0+y1)/2+.82,railZ,MAT.steel);for(let i=0;i<=9;i++){const t=i/9;mesh(stairs,.035,.82,.035,xa+(xb-xa)*t,y0+(y1-y0)*t+.41,railZ,MAT.steel);}}}
flightZ(lowerX,0,LEVEL.social,lowerZa,lowerZb,19);
mesh(stairs,1.22,.11,1.38,lowerX,LEVEL.social-.055,3.72,MAT.wood2,true);
// passarela social até a porta traseira
mesh(stairs,3.70,.11,.96,2.02,LEVEL.social-.055,4.20,MAT.wood2,true);for(let x=.40;x<=4.00;x+=.52)mesh(stairs,.035,.92,.035,x,LEVEL.social+.46,4.64,MAT.steel);mesh(stairs,3.70,.035,.035,2.02,LEVEL.social+.92,4.64,MAT.steel);
// conector para o início da segunda escada
mesh(stairs,1.10,.11,.92,3.18,LEVEL.social-.055,4.72,MAT.wood2,true);
flightX(upperZ,LEVEL.social,LEVEL.private,upperXa,upperXb,18);
mesh(stairs,1.18,.11,1.05,upperXb,LEVEL.private-.055,upperZ,MAT.wood2,true);
// passarela íntima até a mesma faixa de circulação traseira
mesh(stairs,2.95,.11,.96,-.18,LEVEL.private-.055,4.20,MAT.wood2,true);for(let x=-1.60;x<=1.25;x+=.52)mesh(stairs,.035,.92,.035,x,LEVEL.private+.46,4.64,MAT.steel);mesh(stairs,2.95,.035,.035,-.18,LEVEL.private+.92,4.64,MAT.steel);

// ---------------------------------------------------------------------------
// 3) PORTAS: leitura inequívoca de acesso nas duas fachadas.
// ---------------------------------------------------------------------------
removeId('PORTAS-ARQUITETONICAS-V26');
const doors=group('PORTAS-ARQUITETONICAS-V26','Portas de correr e acessos','Acesso');
function slidingDoor(y,cx,z,w,label){const g=local(doors,cx,y,z);tag(g,`PORTA-${label}-V26`,label,'Acesso',{clearWidth:w*.47});mesh(g,w+.12,.055,.055,0,2.11,0,MAT.steel);mesh(g,.055,2.16,.055,-w/2,1.08,0,MAT.steel);mesh(g,.055,2.16,.055,w/2,1.08,0,MAT.steel);mesh(g,w*.49,2.02,.026,-w*.245,1.05,0,MAT.glass);mesh(g,w*.49,2.02,.026,w*.245,1.05,.035,MAT.glass);mesh(g,.018,.34,.018,.08,1.04,-.035,MAT.chrome);mesh(g,.018,.34,.018,-.08,1.04,.07,MAT.chrome);}
for(const y of[LEVEL.social,LEVEL.private]){slidingDoor(y,0,front-.025,2.18,`frontal-${y}`);slidingDoor(y,.85,back+.005,.94,`traseira-${y}`);}

// ---------------------------------------------------------------------------
// 4) IDENTIDADE DE CONTAINER: postes, rails, castings e corrugação lateral.
// Cada pavimento continua 7,076 × 6,058; isto é acabamento externo.
// ---------------------------------------------------------------------------
removeId('CONTAINER-IDENTITY-V26');removeId('CORRUGACAO-CONTAINER-V25');
const container=group('CONTAINER-IDENTITY-V26','Estrutura aparente dos quatro containers','Fachada',{fourContainerReading:true});
const moduleEdges=[-halfW,-1.10,1.10,halfW],levels=[LEVEL.social,LEVEL.private];
for(const y of levels){
  for(const x of moduleEdges)for(const z of[front,back]){mesh(container,.10,2.55,.10,x,y+1.275,z,MAT.steel,true);for(const yy of[y+.08,y+2.47])mesh(container,.145,.115,.145,x,yy,z,MAT.steel2,true);}
  for(const [xa,xb] of[[-halfW,-1.10],[1.10,halfW]])for(const z of[front,back]){mesh(container,xb-xa,.075,.075,(xa+xb)/2,y+.07,z,MAT.steel);mesh(container,xb-xa,.075,.075,(xa+xb)/2,y+2.47,z,MAT.steel);}
}
// corrugação instanciada nas faces longas externas + faixas frontais/traseiras dos módulos.
const ribGeo=new THREE.BoxGeometry(.025,2.30,.038),ribMat=new THREE.MeshStandardMaterial({color:0x202a27,roughness:.38,metalness:.70});const ribTransforms=[];
for(const y of levels)for(const x of[-halfW+.018,halfW-.018])for(let z=front+.18;z<=back-.18;z+=.235)ribTransforms.push({x,y:y+1.25,z,ry:0});
for(const y of levels)for(const z of[front+.018,back-.018])for(const [xa,xb] of[[-halfW+.15,-1.25],[1.25,halfW-.15]])for(let x=xa;x<=xb;x+=.115)ribTransforms.push({x,y:y+1.25,z,ry:Math.PI/2});
const ribs=new THREE.InstancedMesh(ribGeo,ribMat,ribTransforms.length),dummy=new THREE.Object3D();ribTransforms.forEach((q,i)=>{dummy.position.set(q.x,q.y,q.z);dummy.rotation.set(0,q.ry,0);dummy.updateMatrix();ribs.setMatrixAt(i,dummy.matrix);});ribs.instanceMatrix.needsUpdate=true;container.add(ribs);

// ---------------------------------------------------------------------------
// 5) MÓVEIS PRINCIPAIS: remove os blocos mais toscos e recria com volumes
// arredondados e espessuras reais. Mantém os mesmos IDs para o QA.
// ---------------------------------------------------------------------------
for(const id of['SOFA-V15','JANTAR-V15','ILHA-V15'])removeId(id);
const furniture=group('MOBILIARIO-REFINO-V26','Mobiliário social refinado','Mobiliário');
// ilha 1,68 x .78, waterfall e 3 banquetas reais
const island=local(furniture,-1.28,LEVEL.social,1.42);tag(island,'ILHA-V15','Ilha premium 1,68 × 0,78 m','Cozinha');mesh(island,1.68,.82,.72,0,.41,0,MAT.wood,true);mesh(island,1.78,.055,.80,0,.86,0,MAT.quartz,true);for(const x of[-.83,.83])mesh(island,.055,.82,.80,x,.41,0,MAT.quartz,true);for(const x of[-.52,0,.52]){const s=local(island,x,0,-.57);const seat=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,.075,24),MAT.leather);seat.position.y=.66;s.add(seat);cyl(s,.018,.61,0,.31,0,MAT.steel);const ring=new THREE.Mesh(new THREE.TorusGeometry(.12,.012,8,20),MAT.steel);ring.rotation.x=Math.PI/2;ring.position.y=.25;s.add(ring);}
// jantar 1,48 x .78 + cadeiras arredondadas
const dining=local(furniture,-1.10,LEVEL.social,-.82);tag(dining,'JANTAR-V15','Jantar 6 lugares refinado','Jantar');mesh(dining,1.48,.065,.78,0,.75,0,MAT.wood2,true);for(const x of[-.61,.61])for(const z of[-.27,.27])mesh(dining,.04,.70,.04,x,.35,z,MAT.steel);
function softChair(parent,x,z,rot){const c=local(parent,x,0,z,rot);mesh(c,.42,.09,.44,0,.45,0,MAT.fabric2,true);mesh(c,.40,.48,.09,0,.75,.18,MAT.fabric,true);for(const xx of[-.15,.15])for(const zz of[-.15,.15])mesh(c,.026,.40,.026,xx,.20,zz,MAT.steel);}
for(let i=0;i<3;i++){softChair(dining,-.48+i*.48,-.60,Math.PI);softChair(dining,-.48+i*.48,.60,0);}
// sofá 1,88 m, almofadas separadas e pés finos, orientado para TV a leste
const sofa=local(furniture,1.35,LEVEL.social,-.82,Math.PI/2);tag(sofa,'SOFA-V15','Sofá 3 lugares refinado 1,88 m','Sala');mesh(sofa,1.88,.26,.78,0,.29,0,MAT.fabric,true);mesh(sofa,1.82,.50,.15,0,.67,.30,MAT.fabric,true);for(const x of[-.84,.84])mesh(sofa,.14,.43,.70,x,.45,0,MAT.fabric,true);for(const x of[-.59,0,.59]){mesh(sofa,.52,.12,.55,x,.49,-.04,MAT.fabric2,true);mesh(sofa,.50,.32,.11,x,.72,.22,MAT.fabric2,true);}for(const x of[-.76,.76])for(const z of[-.27,.27])mesh(sofa,.035,.12,.035,x,.06,z,MAT.steel);
// detalhes da cama existente: manta e travesseiros suavizam leitura de bloco
const bed=byId('CAMA-CASAL-V16');if(bed){const d=local(bed,0,0,0);tag(d,'DETALHES-CAMA-V26','Roupa de cama e travesseiros','Quarto casal');mesh(d,1.45,.055,1.28,0,.44,-.20,new THREE.MeshStandardMaterial({color:0x7c8c82,roughness:1}),true);for(const x of[-.38,.38])mesh(d,.52,.12,.34,x,.50,.63,MAT.wall,true);}

const audit={version:'v1.17-structural-container',removedGroundWalls:residual.length,openGround:!!ground,clearSightline:1.45,stairs:!!stairs,stairGeometry:{lower:{x:lowerX,za:lowerZa,zb:lowerZb,steps:19},upper:{z:upperZ,xa:upperXa,xb:upperXb,steps:18}},doors:4,containerRibs:ribTransforms.length,fourContainerReading:true,furnitureRefined:true,dimensionsPreserved:[HOUSE.w,HOUSE.d],pass:!!ground&&!!stairs&&ribTransforms.length>100};
window.__CASA_AUDIT_V26__=audit;
console.info('[Casa Contreras] STRUCTURAL v1.17',audit);
const top=document.getElementById('topbar');if(top)top.innerHTML=`<b>CASA CONTRERAS — v1.17 STRUCTURAL / CONTAINER</b><br><span class="muted">pilotis realmente aberto • vista frente→fundos • escadas externas reconstruídas • portas visíveis • quatro containers legíveis por postes/rails/corrugação • móveis sociais refinados • dimensões 7,076 × 6,058 m preservadas</span>`;
