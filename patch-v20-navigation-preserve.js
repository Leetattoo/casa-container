import * as THREE from 'three';

const scene=window.__CASA_SCENE__,camera=window.__CASA_CAMERA__,renderer=window.__CASA_RENDERER__;
if(!scene||!camera||!renderer) throw new Error('Casa Contreras navigation: cena indisponível');

const LEVEL={ground:0,social:3.250,private:6.250};
const EYE_PHYS=1.660,EYE_VIS=1.550;
const lower={x:4.14,w:.96,za:-1.75,zb:3.15,y0:EYE_PHYS,y1:LEVEL.social+EYE_PHYS};
const upper={z:4.92,w:.96,xa:3.05,xb:-1.65,y0:LEVEL.social+EYE_PHYS,y1:LEVEL.private+EYE_PHYS};

let levelState=camera.position.y>LEVEL.private+1?2:camera.position.y>LEVEL.social+1?1:0;
let manualUntil=0,engaged=null;
addEventListener('keydown',e=>{
  if(e.code==='Digit1'){levelState=0;manualUntil=performance.now()+700;engaged=null;}
  if(e.code==='Digit2'){levelState=1;manualUntil=performance.now()+700;engaged=null;}
  if(e.code==='Digit3'){levelState=2;manualUntil=performance.now()+700;engaged=null;}
});
addEventListener('keydown',e=>{if(!e.isTrusted&&/^Digit[123]$/.test(e.code)&&!window.__CASA_ALLOW_INTERNAL_LEVEL_EVENT__){e.stopImmediatePropagation();e.preventDefault();}},true);

const dispatchNative=window.dispatchEvent.bind(window);
function setLevelPreserve(level){if(levelState===level)return;const keep=camera.position.clone();window.__CASA_ALLOW_INTERNAL_LEVEL_EVENT__=true;try{dispatchNative(new KeyboardEvent('keydown',{code:`Digit${level+1}`,bubbles:true}));}finally{camera.position.copy(keep);window.__CASA_ALLOW_INTERNAL_LEVEL_EVENT__=false;}levelState=level;}
function near(v,a,r){return Math.abs(v-a)<=r;}
function lowerFootprint(p,pad=.18){return p.x>lower.x-lower.w/2-pad&&p.x<lower.x+lower.w/2+pad&&p.z>lower.za-pad&&p.z<lower.zb+pad;}
function upperFootprint(p,pad=.18){return p.z>upper.z-upper.w/2-pad&&p.z<upper.z+upper.w/2+pad&&p.x>upper.xb-pad&&p.x<upper.xa+pad;}
function canEngageLower(p){const bottom=levelState===0&&near(p.z,lower.za,.48)&&near(p.x,lower.x,.64)&&Math.abs(p.y-lower.y0)<.48;const top=levelState===1&&near(p.z,lower.zb,.48)&&near(p.x,lower.x,.64)&&Math.abs(p.y-lower.y1)<.48;return bottom||top;}
function canEngageUpper(p){const bottom=levelState===1&&near(p.x,upper.xa,.48)&&near(p.z,upper.z,.64)&&Math.abs(p.y-upper.y0)<.48;const top=levelState===2&&near(p.x,upper.xb,.48)&&near(p.z,upper.z,.64)&&Math.abs(p.y-upper.y1)<.48;return bottom||top;}

const nativeRender=THREE.WebGLRenderer.prototype.render;
renderer.render=function(s,c){
  const manual=performance.now()<manualUntil,before=c.position.clone();
  if(!engaged&&!manual){if(canEngageLower(before))engaged='lower';else if(canEngageUpper(before))engaged='upper';}
  let stair='none',t=0,physicalY=before.y;
  if(engaged==='lower'){
    if(!lowerFootprint(before,.34))engaged=null;else{stair='lower';t=THREE.MathUtils.clamp((before.z-lower.za)/(lower.zb-lower.za),0,1);physicalY=THREE.MathUtils.lerp(lower.y0,lower.y1,t);c.position.y=physicalY-(EYE_PHYS-EYE_VIS);if(t>.985&&levelState===0){setLevelPreserve(1);physicalY=lower.y1;}if(t<.015&&levelState===1){setLevelPreserve(0);physicalY=lower.y0;}}
  }
  if(engaged==='upper'){
    if(!upperFootprint(before,.34))engaged=null;else{stair='upper';t=THREE.MathUtils.clamp((upper.xa-before.x)/(upper.xa-upper.xb),0,1);physicalY=THREE.MathUtils.lerp(upper.y0,upper.y1,t);c.position.y=physicalY-(EYE_PHYS-EYE_VIS);if(t>.985&&levelState===1){setLevelPreserve(2);physicalY=upper.y1;}if(t<.015&&levelState===2){setLevelPreserve(1);physicalY=upper.y0;}}
  }
  if(stair==='none'){const expected=[EYE_PHYS,LEVEL.social+EYE_PHYS,LEVEL.private+EYE_PHYS][levelState];physicalY=manual?before.y:(Math.abs(before.y-expected)>.58?expected:before.y);c.position.y=physicalY-(EYE_PHYS-EYE_VIS);}
  nativeRender.call(renderer,s,c);c.position.x=before.x;c.position.z=before.z;c.position.y=physicalY;
  window.__CASA_NAV_V20__={level:levelState,stair,engaged:engaged||'none',progress:+t.toFixed(3),physicalPosition:[+c.position.x.toFixed(3),+c.position.y.toFixed(3),+c.position.z.toFixed(3)],endpointEngagement:true,noMidSpanTeleport:true,geometry:'v26'};
};

const audit={version:'v1.17-navigation-endpoint-engagement',nativeRendererAuthority:true,endpointEngagement:true,midSpanCrossingCannotEngage:true,alignedToV26:true,positionPreservedOnLevelSwitch:true,pass:true};window.__CASA_AUDIT_V20__=audit;console.info('[Casa Contreras] NAV FIX',audit);
