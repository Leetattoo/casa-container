const stages=[
  ['base','./app-v09.js?v=stable17a',true],
  ['v10','./patch-v10.js?v=stable17a',false],
  ['v15','./patch-v15-reality.js?v=stable17a',true],
  ['v16-bughunt','./patch-v16-bughunt.js?v=stable17a',true],
  ['v16-finalize','./patch-v16-finalize.js?v=stable17a',false],
  ['v26-structure','./patch-v26-structural-container.js?v=stable17a',true],
  ['v20-navigation','./patch-v20-navigation-preserve.js?v=stable17a',true],
  ['v27-cleanup','./patch-v27-legacy-cleanup.js?v=stable17a',false],
  ['v28-realism','./patch-v28-structural-realism.js?v=stable17a',false],
  ['v29-qa','./patch-v29-heavy-qa.js?v=stable17a',false]
];
const status=[];
function top(){return document.getElementById('topbar');}
function showFailure(name,error){const t=top();if(t)t.innerHTML=`<b>CASA CONTRERAS — ERRO DE CARGA: ${name}</b><br><span class="muted">${String(error?.message||error)} • os módulos seguintes continuarão tentando carregar</span>`;}
for(const [name,url,critical] of stages){
  try{
    await import(url);
    status.push({name,ok:true});
    console.info('[Casa Stable Loader] OK',name);
  }catch(error){
    status.push({name,ok:false,error:String(error?.stack||error)});
    console.error('[Casa Stable Loader] FAIL',name,error);
    showFailure(name,error);
    if(name==='base')throw error;
  }
}
window.__CASA_STABLE_LOAD__=status;
const structureOk=status.find(s=>s.name==='v26-structure')?.ok===true;
const navOk=status.find(s=>s.name==='v20-navigation')?.ok===true;
if(structureOk){
  const t=top();
  if(t)t.innerHTML=`<b>CASA CONTRERAS — v1.17 STABLE STRUCTURAL</b><br><span class="muted">pilotis aberto • portas reais • containers legíveis • escada com engate por extremidade ${navOk?'• navegação v20 OK':'• ATENÇÃO: navegação não carregou'} • K abre QA quando disponível</span>`;
}
console.info('[Casa Stable Loader] FINAL',status);
