const status=[];
const top=()=>document.getElementById('topbar');
function setTop(html){const t=top();if(t)t.innerHTML=html;}
async function load(name,url){
  setTop(`<b>CASA CONTRERAS — carregando ${name}...</b><br><span class="muted">v1.18 recovery</span>`);
  const t0=performance.now();
  try{await import(url);status.push({name,ok:true,ms:Math.round(performance.now()-t0)});return true;}
  catch(e){status.push({name,ok:false,error:String(e?.message||e),ms:Math.round(performance.now()-t0)});console.error('[RECOVERY]',name,e);return false;}
}

if(!await load('motor base','./app-v09.js?v=recovery18a'))throw new Error('motor base falhou');
await load('otimização','./patch-v10.js?v=recovery18a');
const structOk=await load('estrutura container','./patch-v26-structural-container.js?v=recovery18a');

if(structOk){
  const THREE=await import('three');
  const HOUSE={w:7.076,d:6.058,centerZ:.700};
  const halfW=HOUSE.w/2,halfD=HOUSE.d/2,back=HOUSE.centerZ+halfD,front=HOUSE.centerZ-halfD;
  THREE.Box3.prototype.intersectsBox=function(b){
    const a=this,bsx=b.max.x-b.min.x,bsy=b.max.y-b.min.y,bsz=b.max.z-b.min.z;
    const oldBackWall=Math.abs(bsx-(HOUSE.w-.24))<.035&&Math.abs(bsy-2.55)<.035&&Math.abs(bsz-.10)<.035&&Math.abs(((b.min.z+b.max.z)*.5)-(back-.07))<.05;
    if(oldBackWall)return false;
    const asx=a.max.x-a.min.x,asy=a.max.y-a.min.y,asz=a.max.z-a.min.z;
    if(asx>.42&&asx<.60&&asz>.42&&asz<.60&&asy>1.45&&asy<1.92){
      const bcx=(b.min.x+b.max.x)*.5,bcz=(b.min.z+b.max.z)*.5;
      const inside=bcx>-halfW&&bcx<halfW&&bcz>front&&bcz<back;
      const staleGroundWall=b.min.y<.15&&b.max.y>1.55&&b.max.y<3.05&&Math.min(bsx,bsz)<.19&&Math.max(bsx,bsz)>.55;
      if(inside&&staleGroundWall)return false;
    }
    return !(b.max.x<a.min.x||b.min.x>a.max.x||b.max.y<a.min.y||b.min.y>a.max.y||b.max.z<a.min.z||b.min.z>a.max.z);
  };
  const renderer=window.__CASA_RENDERER__;
  if(renderer){renderer.shadowMap.enabled=false;renderer.setPixelRatio(Math.min(devicePixelRatio||1,.62));}
}

await load('limpeza','./patch-v27-legacy-cleanup.js?v=recovery18a');

// Não carrega v20/v29/v28. Nenhum wrapper novo roda por frame nesta build.
window.__CASA_RECOVERY_LOAD__=status;
window.__CASA_AUTO_STAIRS_DISABLED__=true;
setTop(`<b>CASA CONTRERAS — v1.18 RECOVERY STABLE</b><br><span class="muted">estrutura ${structOk?'OK':'FALHOU'} • teleporte automático DESLIGADO • nenhum wrapper extra por frame • colisão sem alocações • DPR 0,62 • use 1/2/3 temporariamente para trocar de pavimento</span>`);
console.info('[Casa Contreras] RECOVERY LOAD',status);
