const status=[];
const top=()=>document.getElementById('topbar');
function setTop(html){const t=top();if(t)t.innerHTML=html;}
async function load(name,url){
  setTop(`<b>CASA CONTRERAS — carregando ${name}...</b><br><span class="muted">build v1.18 rescue</span>`);
  const t0=performance.now();
  try{await import(url);status.push({name,ok:true,ms:Math.round(performance.now()-t0)});return true;}
  catch(e){status.push({name,ok:false,error:String(e?.message||e),ms:Math.round(performance.now()-t0)});console.error('[RESCUE]',name,e);return false;}
}

if(!await load('base','./app-v09.js?v=rescue18a'))throw new Error('base falhou');
await load('otimização v10','./patch-v10.js?v=rescue18a');

// A estrutura é carregada e a colisão lenta dela é substituída imediatamente,
// antes de qualquer outro await/import e antes do próximo frame de render.
const structOk=await load('estrutura v26','./patch-v26-structural-container.js?v=rescue18a');
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
      const oldGroundWall=b.min.y<.15&&b.max.y>1.55&&b.max.y<3.05&&Math.min(bsx,bsz)<.19&&Math.max(bsx,bsz)>.55;
      if(inside&&oldGroundWall)return false;
    }
    return !(b.max.x<a.min.x||b.min.x>a.max.x||b.max.y<a.min.y||b.min.y>a.max.y||b.max.z<a.min.z||b.min.z>a.max.z);
  };
  const r=window.__CASA_RENDERER__;
  if(r){r.shadowMap.enabled=false;r.setPixelRatio(Math.min(devicePixelRatio||1,.72));}
  window.__CASA_PERF_V30__={allocationFreeCollision:true,dpr:.72};
}

await load('navegação','./patch-v20-navigation-preserve.js?v=rescue18a');
await load('limpeza','./patch-v27-legacy-cleanup.js?v=rescue18a');

window.__CASA_RESCUE_LOAD__=status;
setTop(`<b>CASA CONTRERAS — v1.18 RESCUE</b><br><span class="muted">estrutura ${structOk?'OK':'FALHOU'} • colisão sem alocações • DPR 0,72 • QA e realismo pesado fora do boot • K carrega diagnóstico sob demanda</span>`);

let qaLoading=false;
addEventListener('keydown',async e=>{
  if(e.code!=='KeyK'||qaLoading||window.__CASA_AUDIT_V29__)return;
  qaLoading=true;
  setTop(`<b>CASA CONTRERAS — carregando QA sob demanda...</b>`);
  await load('QA','./patch-v29-heavy-qa.js?v=rescue18a');
  qaLoading=false;
});
console.info('[Casa Contreras] RESCUE LOAD',status);
