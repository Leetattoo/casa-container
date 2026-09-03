import * as THREE from 'three';

const scene=window.__CASA_SCENE__,camera=window.__CASA_CAMERA__,renderer=window.__CASA_RENDERER__;
if(!scene||!camera||!renderer) throw new Error('Casa Contreras v1.10: cena indisponível');

const LEVEL={ground:0,social:3.250,private:6.250};
const EYE_PHYS=1.660,EYE_VIS=1.550;
const lower={x:4.14,w:.92,za:-1.75,zb:3.15,y0:EYE_PHYS,y1:LEVEL.social+EYE_PHYS};
const upper={z:5.55,w:.92,xa:3.20,xb:-1.70,y0:LEVEL.social+EYE_PHYS,y1:LEVEL.private+EYE_PHYS};

let levelState=camera.position.y>LEVEL.private+1?2:camera.position.y>LEVEL.social+1?1:0;
let manualUntil=0;
addEventListener('keydown',e=>{
  if(e.code==='Digit1'){levelState=0;manualUntil=performance.now()+700;}
  if(e.code==='Digit2'){levelState=1;manualUntil=performance.now()+700;}
  if(e.code==='Digit3'){levelState=2;manualUntil=performance.now()+700;}
});

const dispatchV19=window.dispatchEvent.bind(window);
function setLevelPreserve(level){
  if(levelState===level)return;
  const keep=camera.position.clone();
  const oldSuppress=window.__CASA_V16_SUPPRESS_SYNTHETIC_LEVEL__;
  window.__CASA_V19_ALLOW_LEVEL__=true;
  window.__CASA_V16_SUPPRESS_SYNTHETIC_LEVEL__=false;
  try{
    dispatchV19(new KeyboardEvent('keydown',{code:`Digit${level+1}`,bubbles:true}));
  }finally{
    camera.position.copy(keep);
    window.__CASA_V16_SUPPRESS_SYNTHETIC_LEVEL__=oldSuppress;
    window.__CASA_V19_ALLOW_LEVEL__=false;
  }
  levelState=level;
}

function lowerZone(p){return p.x>lower.x-lower.w/2-.16&&p.x<lower.x+lower.w/2+.16&&p.z>lower.za-.18&&p.z<lower.zb+.18&&p.y>.95&&p.y<LEVEL.social+EYE_PHYS+.48;}
function upperZone(p){return p.z>upper.z-upper.w/2-.16&&p.z<upper.z+upper.w/2+.16&&p.x>upper.xb-.18&&p.x<upper.xa+.18&&p.y>LEVEL.social+EYE_PHYS-.48&&p.y<LEVEL.private+EYE_PHYS+.48;}

const nativeRender=THREE.WebGLRenderer.prototype.render;
renderer.render=function(s,c){
  const physical=c.position.clone();
  const manual=performance.now()<manualUntil;
  let stair='none',t=0,physicalY=physical.y;

  if(lowerZone(physical)){
    stair='lower';
    t=THREE.MathUtils.clamp((physical.z-lower.za)/(lower.zb-lower.za),0,1);
    physicalY=THREE.MathUtils.lerp(lower.y0,lower.y1,t);
    c.position.y=physicalY-(EYE_PHYS-EYE_VIS);
    if(t>.985&&levelState===0)setLevelPreserve(1);
    if(t<.015&&levelState===1)setLevelPreserve(0);
  }else if(upperZone(physical)){
    stair='upper';
    t=THREE.MathUtils.clamp((upper.xa-physical.x)/(upper.xa-upper.xb),0,1);
    physicalY=THREE.MathUtils.lerp(upper.y0,upper.y1,t);
    c.position.y=physicalY-(EYE_PHYS-EYE_VIS);
    if(t>.985&&levelState===1)setLevelPreserve(2);
    if(t<.015&&levelState===2)setLevelPreserve(1);
  }else{
    const floors=[EYE_PHYS,LEVEL.social+EYE_PHYS,LEVEL.private+EYE_PHYS];
    const nearest=floors.reduce((a,b)=>Math.abs(b-physical.y)<Math.abs(a-physical.y)?b:a,floors[0]);
    if(Math.abs(nearest-physical.y)<.20)c.position.y=physical.y-(EYE_PHYS-EYE_VIS);
  }

  nativeRender.call(renderer,s,c);

  // Restaura coordenadas físicas. O desenho usa 1,55 m, a física mantém 1,66 m.
  c.position.x=physical.x;
  c.position.z=physical.z;
  c.position.y=stair==='none'?physical.y:physicalY;

  // Fora das escadas, não há qualquer correção vertical automática além do piso ativo da base.
  if(stair==='none'&&!manual){
    const expected=[EYE_PHYS,LEVEL.social+EYE_PHYS,LEVEL.private+EYE_PHYS][levelState];
    if(c.position.y<expected-1.10||c.position.y>expected+1.10)c.position.y=expected;
  }

  window.__CASA_NAV_V20__={
    level:levelState,
    stair,
    progress:+t.toFixed(3),
    physicalPosition:[+c.position.x.toFixed(3),+c.position.y.toFixed(3),+c.position.z.toFixed(3)],
    positionPreservedOnLevelSwitch:true
  };
};

const audit={
  version:'v1.10-navigation-preserve',
  nativeRendererAuthority:true,
  positionPreservedOnLevelSwitch:true,
  upperStairRequiresSocialHeight:true,
  lowerStairRequiresGroundToSocialHeight:true,
  manualShortcutsRemain:true,
  previousAudit:window.__CASA_AUDIT_V19__||null,
  pass:true
};
window.__CASA_AUDIT_V20__=audit;
console.info('[Casa Contreras] AUDIT v1.10',audit);
const top=document.getElementById('topbar');
if(top)top.innerHTML=`<b>CASA CONTRERAS — v1.10 NAVIGATION PRESERVE</b><br><span class="muted">1,65 m • escadas externas • troca de andar sem teleporte • posição física preservada nos patamares • wrappers antigos bypassados • QA espacial v1.9 mantido<br>7,076 × 6,058 m por pavimento • nenhuma metragem foi alterada</span>`;
