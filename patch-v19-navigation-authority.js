import * as THREE from 'three';

const scene=window.__CASA_SCENE__,camera=window.__CASA_CAMERA__,renderer=window.__CASA_RENDERER__;
if(!scene||!camera||!renderer) throw new Error('Casa Contreras v1.9: cena indisponível');

const HOUSE={w:7.076,d:6.058,centerZ:.700,wall:.120};
const LEVEL={ground:0,social:3.250,private:6.250};
const EYE_PHYS=1.660,EYE_VIS=1.550;
const halfW=HOUSE.w/2,halfD=HOUSE.d/2,front=HOUSE.centerZ-halfD,back=HOUSE.centerZ+halfD;
const inner={west:-halfW+HOUSE.wall,east:halfW-HOUSE.wall,front:front+HOUSE.wall,back:back-HOUSE.wall};

function byId(id){let hit=null;scene.traverse(o=>{if(!hit&&o.userData?.id===id)hit=o;});return hit;}
function bounds(id){const o=byId(id);if(!o)return null;o.updateMatrixWorld(true);return new THREE.Box3().setFromObject(o);}
function overlaps(a,b,eps=.02){return !!a&&!!b&&a.min.x<b.max.x-eps&&a.max.x>b.min.x+eps&&a.min.y<b.max.y-eps&&a.max.y>b.min.y+eps&&a.min.z<b.max.z-eps&&a.max.z>b.min.z+eps;}
function inBox2D(b,x0,x1,z0,z1){if(!b)return false;return b.min.x<x1&&b.max.x>x0&&b.min.z<z1&&b.max.z>z0;}

// ------------------------------------------------------------
// 1) NAVEGAÇÃO AUTORITATIVA
// Bypassa wrappers antigos de renderer.render e bloqueia eventos
// sintéticos Digit1/2/3 que não sejam emitidos por este controlador.
// ------------------------------------------------------------
const previousDispatch=window.dispatchEvent.bind(window);
if(!window.__CASA_V19_EVENT_GUARD__){
  window.__CASA_V19_EVENT_GUARD__=true;
  window.dispatchEvent=function(ev){
    const legacyDigit=ev instanceof KeyboardEvent&&!ev.isTrusted&&/^Digit[123]$/.test(ev.code)&&!window.__CASA_V19_ALLOW_LEVEL__;
    if(legacyDigit)return true;
    return previousDispatch(ev);
  };
}

let levelState=camera.position.y>LEVEL.private+1?2:camera.position.y>LEVEL.social+1?1:0;
let manualUntil=0;
addEventListener('keydown',e=>{
  if(e.code==='Digit1'){levelState=0;manualUntil=performance.now()+700;}
  if(e.code==='Digit2'){levelState=1;manualUntil=performance.now()+700;}
  if(e.code==='Digit3'){levelState=2;manualUntil=performance.now()+700;}
});
function setLevel(level){
  if(levelState===level)return;
  window.__CASA_V19_ALLOW_LEVEL__=true;
  const oldSuppress=window.__CASA_V16_SUPPRESS_SYNTHETIC_LEVEL__;
  window.__CASA_V16_SUPPRESS_SYNTHETIC_LEVEL__=false;
  try{previousDispatch(new KeyboardEvent('keydown',{code:`Digit${level+1}`,bubbles:true}));}finally{
    window.__CASA_V16_SUPPRESS_SYNTHETIC_LEVEL__=oldSuppress;
    window.__CASA_V19_ALLOW_LEVEL__=false;
  }
  levelState=level;
}

const lower={x:4.14,w:.92,za:-1.75,zb:3.15,y0:EYE_PHYS,y1:LEVEL.social+EYE_PHYS};
const upper={z:5.55,w:.92,xa:3.20,xb:-1.70,y0:LEVEL.social+EYE_PHYS,y1:LEVEL.private+EYE_PHYS};
function lowerZone(p){return p.x>lower.x-lower.w/2-.18&&p.x<lower.x+lower.w/2+.18&&p.z>lower.za-.22&&p.z<lower.zb+.22&&p.y>.95&&p.y<LEVEL.social+EYE_PHYS+.60;}
function upperZone(p){return p.z>upper.z-upper.w/2-.18&&p.z<upper.z+upper.w/2+.18&&p.x>upper.xb-.22&&p.x<upper.xa+.22&&p.y>LEVEL.social+EYE_PHYS-.62&&p.y<LEVEL.private+EYE_PHYS+.60;}

const nativeRender=THREE.WebGLRenderer.prototype.render;
renderer.render=function(s,c){
  const physical=c.position.clone();
  const manual=performance.now()<manualUntil;
  let stair='none',t=0,physicalY=physical.y;

  if(lowerZone(physical)){
    stair='lower';
    t=THREE.MathUtils.clamp((physical.z-lower.za)/(lower.zb-lower.za),0,1);
    physicalY=THREE.MathUtils.lerp(lower.y0,lower.y1,t);
    c.position.y=physicalY-EYE_PHYS+EYE_VIS;
    if(t>.975&&levelState===0)setLevel(1);
    if(t<.025&&levelState===1)setLevel(0);
  }else if(upperZone(physical)){
    stair='upper';
    t=THREE.MathUtils.clamp((upper.xa-physical.x)/(upper.xa-upper.xb),0,1);
    physicalY=THREE.MathUtils.lerp(upper.y0,upper.y1,t);
    c.position.y=physicalY-EYE_PHYS+EYE_VIS;
    if(t>.975&&levelState===1)setLevel(2);
    if(t<.025&&levelState===2)setLevel(1);
  }else{
    const floorEyes=[EYE_PHYS,LEVEL.social+EYE_PHYS,LEVEL.private+EYE_PHYS];
    const nearest=floorEyes.reduce((a,b)=>Math.abs(b-physical.y)<Math.abs(a-physical.y)?b:a,floorEyes[0]);
    if(Math.abs(nearest-physical.y)<.22)c.position.y=physical.y-(EYE_PHYS-EYE_VIS);
  }

  nativeRender.call(renderer,s,c);

  // A física continua em coordenadas de 1,66 m; apenas a visão é 1,55 m.
  c.position.x=physical.x;c.position.z=physical.z;c.position.y=stair==='none'?physical.y:physicalY;

  // Fora das escadas, nenhuma camada antiga pode trocar pavimento.
  if(stair==='none'&&!manual){
    const expected=[EYE_PHYS,LEVEL.social+EYE_PHYS,LEVEL.private+EYE_PHYS][levelState];
    if(Math.abs(c.position.y-expected)>1.05&&c.position.y<expected+.65)c.position.y=expected;
  }

  window.__CASA_NAV_V19__={level:levelState,stair,t:+t.toFixed(3),position:[+c.position.x.toFixed(3),+c.position.y.toFixed(3),+c.position.z.toFixed(3)]};
};

// ------------------------------------------------------------
// 2) QUARTO CASAL: guarda-roupa totalmente dentro do envelope,
// encostado à parede frontal e sem cruzar a cama queen.
// ------------------------------------------------------------
const masterWard=byId('GUARDA-ROUPA-V16');
if(masterWard){
  masterWard.rotation.y=0;
  masterWard.position.set(-2.45,LEVEL.private,-1.72);
  masterWard.updateMatrixWorld(true);
}

// ------------------------------------------------------------
// 3) DETALHE VISUAL LEVE: água e iluminação embutida.
// ------------------------------------------------------------
const detail=new THREE.Group();detail.userData={id:'DETALHE-REALISMO-V19',label:'Detalhes leves de realismo',category:'Acabamento',selectable:true};scene.add(detail);
const rippleMat=new THREE.MeshBasicMaterial({color:0xb8e4e5,transparent:true,opacity:.16,side:THREE.DoubleSide,depthWrite:false});
function ripples(cx,cz,scales){for(const [rx,rz] of scales){const ring=new THREE.Mesh(new THREE.RingGeometry(.82,1,40),rippleMat);ring.rotation.x=-Math.PI/2;ring.scale.set(rx,rz,1);ring.position.set(cx,.065,cz);detail.add(ring);}}
ripples(-2.25,-7.35,[[.42,.56],[.68,.92]]);ripples(1.72,-5.30,[[.28,.40],[.48,.68]]);
const warm=new THREE.MeshBasicMaterial({color:0xffd19a});
for(const y of[LEVEL.social+2.54,LEVEL.private+2.55])for(const x of[-2.45,-.85,.80,2.45])for(const z of[-1.35,.55,2.35]){const d=new THREE.Mesh(new THREE.CylinderGeometry(.055,.055,.018,16),warm);d.rotation.x=Math.PI/2;d.position.set(x,y,z);detail.add(d);}

// ------------------------------------------------------------
// 4) QA ESPACIAL: corredores funcionais e sobreposições críticas.
// ------------------------------------------------------------
const duplicateMap=new Map();scene.traverse(o=>{const id=o.userData?.id;if(id)duplicateMap.set(id,(duplicateMap.get(id)||0)+1);});
const duplicateIds=[...duplicateMap].filter(([,n])=>n>1).map(([id,n])=>`${id}:${n}`);
const overlapPairs=[
 ['ILHA-V15','JANTAR-V15'],['JANTAR-V15','SOFA-V15'],['SOFA-V15','TV-V15'],
 ['CAMA-CASAL-V16','GUARDA-ROUPA-V16'],['TRELICHE-V16','BANCADA-FILHOS-V16'],['TRELICHE-V16','ARMARIO-FILHOS-V16'],['BANCADA-FILHOS-V16','ARMARIO-FILHOS-V16'],
 ['CAMINHO-LATERAL-V15','LAGO-NATURAL-V15'],['CAMINHO-LATERAL-V15','LAGO-PEIXES-V15'],['CAMINHO-LATERAL-V15','CISTERNA-V15']
];
const overlapsFound=[];for(const [a,b] of overlapPairs)if(overlaps(bounds(a),bounds(b),.015))overlapsFound.push(`${a}:${b}`);
const socialCorridor={x0:-.35,x1:.68,z0:-1.95,z1:2.75};
const privateCorridor={x0:.16,x1:1.28,z0:-1.90,z1:3.28};
const socialBlockers=['ILHA-V15','JANTAR-V15','SOFA-V15','BANHEIRO-SOCIAL-V15'].filter(id=>inBox2D(bounds(id),socialCorridor.x0,socialCorridor.x1,socialCorridor.z0,socialCorridor.z1));
const privateBlockers=['CAMA-CASAL-V16','GUARDA-ROUPA-V16','TRELICHE-V16','BANCADA-FILHOS-V16','ARMARIO-FILHOS-V16','GAMER-V15','BANHEIRO-INTIMO-V15'].filter(id=>inBox2D(bounds(id),privateCorridor.x0,privateCorridor.x1,privateCorridor.z0,privateCorridor.z1));
const wardBox=bounds('GUARDA-ROUPA-V16');
const wardrobeInside=!wardBox||(wardBox.min.x>=inner.west-.01&&wardBox.max.x<=inner.east+.01&&wardBox.min.z>=inner.front-.01&&wardBox.max.z<=inner.back+.01);
const audit={
 version:'v1.9-navigation-authority',
 authoritativeRenderer:true,
 legacyRendererWrappersBypassed:true,
 legacySyntheticLevelEventsBlocked:true,
 userReference:{height:1.65,visualEye:EYE_VIS,physicalEye:EYE_PHYS},
 externalStairs:!!byId('ESCADAS-EXTERNAS-V16'),
 socialEntry:!!byId('PORTA-SOCIAL-V18'),privateEntry:!!byId('PORTA-INTIMO-V18'),
 wardrobeInside,duplicateIds,overlapsFound,socialBlockers,privateBlockers,
 pass:wardrobeInside&&duplicateIds.length===0&&overlapsFound.length===0&&socialBlockers.length===0&&privateBlockers.length===0
};
window.__CASA_AUDIT_V19__=audit;
console.info('[Casa Contreras] AUDIT v1.9',audit);
const top=document.getElementById('topbar');if(top)top.innerHTML=`<b>CASA CONTRERAS — v1.9 NAVIGATION AUTHORITY</b><br><span class="muted">1,65 m • controlador único de escadas • wrappers antigos bypassados • eventos sintéticos legados bloqueados • acessos reais • QA de corredores/overlaps • guarda-roupa corrigido<br>7,076 × 6,058 m por pavimento • nenhuma metragem foi alterada</span>`;
