import * as THREE from 'three';

const scene=window.__CASA_SCENE__,renderer=window.__CASA_RENDERER__;
if(!scene||!renderer) throw new Error('Casa Contreras v1.18 rescue: cena indisponível');

// Substitui TODA a cadeia antiga de Box3.intersectsBox por uma implementação
// direta, sem new Vector3/clone/getSize/getCenter em cada colisão.
// Mantém apenas as duas exceções necessárias: paredão antigo removido e
// paredes legadas do pilotis que não podem bloquear o térreo aberto.
const HOUSE={w:7.076,d:6.058,centerZ:.700};
const halfW=HOUSE.w/2,halfD=HOUSE.d/2,back=HOUSE.centerZ+halfD,front=HOUSE.centerZ-halfD;

function nativeHit(a,b){
  return !(b.max.x<a.min.x||b.min.x>a.max.x||b.max.y<a.min.y||b.min.y>a.max.y||b.max.z<a.min.z||b.min.z>a.max.z);
}

THREE.Box3.prototype.intersectsBox=function(b){
  const a=this;
  const bsx=b.max.x-b.min.x,bsy=b.max.y-b.min.y,bsz=b.max.z-b.min.z;

  // Caixa de colisão do antigo TER-FUNDO, removido visualmente desde v10.
  const oldBackWall=Math.abs(bsx-(HOUSE.w-.24))<.035&&Math.abs(bsy-2.55)<.035&&Math.abs(bsz-.10)<.035&&Math.abs(((b.min.z+b.max.z)*.5)-(back-.07))<.05;
  if(oldBackWall)return false;

  // Só faz a regra especial do pilotis quando 'a' tem dimensões do corpo do jogador.
  const asx=a.max.x-a.min.x,asy=a.max.y-a.min.y,asz=a.max.z-a.min.z;
  const player=asx>.42&&asx<.60&&asz>.42&&asz<.60&&asy>1.45&&asy<1.92;
  if(player){
    const bcx=(b.min.x+b.max.x)*.5,bcy=(b.min.y+b.max.y)*.5,bcz=(b.min.z+b.max.z)*.5;
    const inside=bcx>-halfW&&bcx<halfW&&bcz>front&&bcz<back;
    const oldGroundWall=b.min.y<.15&&b.max.y>1.55&&b.max.y<3.05&&Math.min(bsx,bsz)<.19&&Math.max(bsx,bsz)>.55;
    if(inside&&oldGroundWall)return false;
  }

  return nativeHit(a,b);
};

// Preserva FPS: sem sombras dinâmicas e DPR moderado.
renderer.shadowMap.enabled=false;
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,.78));
scene.traverse(o=>{if(o.isDirectionalLight)o.castShadow=false;if(o.isPointLight)o.visible=false;if(o.isMesh)o.castShadow=false;});

// Remove painéis de QA antigos caso alguma versão cacheada os tenha deixado.
for(const id of['qa-v23','qa-v29'])document.getElementById(id)?.remove();

window.__CASA_PERF_V30__={version:'v1.18-performance-rescue',allocationFreeCollision:true,dpr:.78,dynamicShadows:false,qaLazy:true};
console.info('[Casa Contreras] PERFORMANCE RESCUE v30',window.__CASA_PERF_V30__);
