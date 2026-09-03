const stages=[
  ['base','./app-v09.js?v=safe17a',true],
  ['v10','./patch-v10.js?v=safe17a',false],
  ['v26-structure','./patch-v26-structural-container.js?v=safe17a',true],
  ['v20-navigation','./patch-v20-navigation-preserve.js?v=safe17a',true],
  ['v27-cleanup','./patch-v27-legacy-cleanup.js?v=safe17a',false],
  ['v29-qa','./patch-v29-heavy-qa.js?v=safe17a',false]
];

const status=[];
const top=()=>document.getElementById('topbar');
const waitFrame=()=>new Promise(resolve=>requestAnimationFrame(()=>resolve()));
function stageLabel(name){const t=top();if(t)t.innerHTML=`<b>CASA CONTRERAS — carregando ${name}</b><br><span class="muted">build SAFE v1.17 • sem v15/v16 intermediários • sem realismo pesado durante diagnóstico</span>`;}
function fail(name,error){const t=top();if(t)t.innerHTML=`<b>CASA CONTRERAS — ERRO: ${name}</b><br><span class="muted">${String(error?.message||error)}</span>`;}

for(const [name,url,critical] of stages){
  stageLabel(name);
  await waitFrame();
  try{
    await import(url);
    status.push({name,ok:true});
    console.info('[Casa SAFE] OK',name);
  }catch(error){
    status.push({name,ok:false,error:String(error?.stack||error)});
    console.error('[Casa SAFE] FAIL',name,error);
    fail(name,error);
    if(critical)break;
  }
  await waitFrame();
}

window.__CASA_SAFE_LOAD__=status;
const baseOk=status.find(s=>s.name==='base')?.ok===true;
const structureOk=status.find(s=>s.name==='v26-structure')?.ok===true;
const navOk=status.find(s=>s.name==='v20-navigation')?.ok===true;
if(baseOk&&structureOk){
  const t=top();if(t)t.innerHTML=`<b>CASA CONTRERAS — v1.17 SAFE STRUCTURAL</b><br><span class="muted">pilotis aberto • portas v26 • containers v26 • ${navOk?'navegação v20 ativa':'navegação em atenção'} • K abre QA • realismo pesado temporariamente desligado</span>`;
}
console.info('[Casa SAFE] FINAL',status);
