import * as THREE from 'three';

const scene=window.__CASA_SCENE__,camera=window.__CASA_CAMERA__;
if(!scene||!camera) throw new Error('Casa Contreras v1.13: cena indisponível');

const LOT={x0:-5,x1:5,z0:-12.5,z1:12.5};
const HOUSE={w:7.076,d:6.058,centerZ:.700,wall:.120};
const LEVEL={ground:0,social:3.25,private:6.25};
const halfW=HOUSE.w/2,halfD=HOUSE.d/2,front=HOUSE.centerZ-halfD,back=HOUSE.centerZ+halfD;
const inner={west:-halfW+HOUSE.wall,east:halfW-HOUSE.wall,front:front+HOUSE.wall,back:back-HOUSE.wall};

function byId(id){let hit=null;scene.traverse(o=>{if(!hit&&o.userData?.id===id)hit=o;});return hit;}
function bounds(id){const o=byId(id);if(!o)return null;o.updateMatrixWorld(true);return new THREE.Box3().setFromObject(o);}
function overlap(a,b,eps=.015){return !!a&&!!b&&a.min.x<b.max.x-eps&&a.max.x>b.min.x+eps&&a.min.y<b.max.y-eps&&a.max.y>b.min.y+eps&&a.min.z<b.max.z-eps&&a.max.z>b.min.z+eps;}
function gapX(a,b){if(!a||!b)return null;return Math.max(b.min.x-a.max.x,a.min.x-b.max.x,0);}
function gapZ(a,b){if(!a||!b)return null;return Math.max(b.min.z-a.max.z,a.min.z-b.max.z,0);}
function finiteObject(o){return Number.isFinite(o.position.x)&&Number.isFinite(o.position.y)&&Number.isFinite(o.position.z)&&Number.isFinite(o.scale.x)&&Number.isFinite(o.scale.y)&&Number.isFinite(o.scale.z)&&Number.isFinite(o.rotation.x)&&Number.isFinite(o.rotation.y)&&Number.isFinite(o.rotation.z);}
function rectOverlap(b,r){return !!b&&b.min.x<r.x1&&b.max.x>r.x0&&b.min.z<r.z1&&b.max.z>r.z0;}

// IDs duplicados e transforms inválidos.
const idCount=new Map(),invalid=[];
scene.traverse(o=>{const id=o.userData?.id;if(id)idCount.set(id,(idCount.get(id)||0)+1);if(!finiteObject(o))invalid.push(id||o.name||o.type);});
const duplicates=[...idCount].filter(([,n])=>n>1).map(([id,n])=>`${id}×${n}`);

// Overlaps críticos conhecidos.
const pairs=[
 ['ILHA-V15','JANTAR-V15'],['JANTAR-V15','SOFA-V15'],['SOFA-V15','TV-V15'],
 ['CAMA-CASAL-V16','GUARDA-ROUPA-V16'],['CAMA-CASAL-V16','TRELICHE-V16'],
 ['TRELICHE-V16','BANCADA-FILHOS-V16'],['TRELICHE-V16','ARMARIO-FILHOS-V16'],['BANCADA-FILHOS-V16','ARMARIO-FILHOS-V16'],
 ['CAMINHO-LATERAL-V15','LAGO-NATURAL-V15'],['CAMINHO-LATERAL-V15','LAGO-PEIXES-V15'],['CAMINHO-LATERAL-V15','CISTERNA-V15'],
 ['CAMINHO-LATERAL-V15','COBERTURA-GARAGEM-V15'],['LAGO-NATURAL-V15','COBERTURA-GARAGEM-V15'],['LAGO-PEIXES-V15','COBERTURA-GARAGEM-V15']
];
const criticalOverlaps=pairs.filter(([a,b])=>overlap(bounds(a),bounds(b))).map(([a,b])=>`${a} ↔ ${b}`);

// Corredores e acessos.
const socialCorridor={x0:-.35,x1:.68,z0:-1.95,z1:2.75};
const privateCorridor={x0:.16,x1:1.28,z0:-1.90,z1:3.28};
const socialBlockers=['ILHA-V15','JANTAR-V15','SOFA-V15','BANHEIRO-SOCIAL-V15'].filter(id=>rectOverlap(bounds(id),socialCorridor));
const privateBlockers=['CAMA-CASAL-V16','GUARDA-ROUPA-V16','TRELICHE-V16','BANCADA-FILHOS-V16','ARMARIO-FILHOS-V16','GAMER-V15','BANHEIRO-INTIMO-V15'].filter(id=>rectOverlap(bounds(id),privateCorridor));
const socialDoorZone={x0:3.35,x1:3.62,z0:2.52,z1:3.50};
const privateDoorZone={x0:-1.50,x1:-.50,z0:3.55,z1:3.82};
const doorBlockers=[];
for(const id of['ILHA-V15','JANTAR-V15','SOFA-V15','BANHEIRO-SOCIAL-V15','CAMA-CASAL-V16','GUARDA-ROUPA-V16','TRELICHE-V16','BANCADA-FILHOS-V16','ARMARIO-FILHOS-V16','GAMER-V15','BANHEIRO-INTIMO-V15']){
  const b=bounds(id);if(rectOverlap(b,socialDoorZone)||rectOverlap(b,privateDoorZone))doorBlockers.push(id);
}

// Folgas dimensionais úteis.
const bed=bounds('CAMA-CASAL-V16'),ward=bounds('GUARDA-ROUPA-V16'),dining=bounds('JANTAR-V15'),sofa=bounds('SOFA-V15'),island=bounds('ILHA-V15');
const masterClearances=bed&&ward?{
  wardrobeToBed:+(bed.min.x-ward.max.x).toFixed(2),
  bedToRightPartition:+((-0.07)-bed.max.x).toFixed(2),
  footToFrontWall:+(bed.min.z-inner.front).toFixed(2)
}:null;
const socialClearances={
  diningToSofa:dining&&sofa?+gapX(dining,sofa).toFixed(2):null,
  diningToIsland:dining&&island?+gapZ(dining,island).toFixed(2):null
};

// Árvores: troncos devem estar perto do perímetro e longe do caminho/escada.
const trees=[];scene.traverse(o=>{if(o.userData?.category==='Árvore frutífera')trees.push(o);});
const treeIssues=[];
for(const t of trees){const p=t.getWorldPosition(new THREE.Vector3()),wallDist=Math.min(4.94-Math.abs(p.x),12.44-Math.abs(p.z));if(wallDist>.55)treeIssues.push(`${t.userData.id||'árvore'} longe do muro (${wallDist.toFixed(2)} m)`);if(p.x<-4.50&&Math.abs(p.x+4.18)<.48)treeIssues.push(`${t.userData.id||'árvore'} próxima demais do caminho`);if(p.x>3.45&&p.z>-2.2&&p.z<3.6)treeIssues.push(`${t.userData.id||'árvore'} na faixa da escada inferior`);}

// Objetos principais fora do lote (com tolerância e exclusões de copa/sacada).
const outside=[];
scene.traverse(o=>{
  if(!o.userData?.id||!o.userData?.selectable||o.parent!==scene)return;
  if(['Árvore frutífera','Sacada','Escada','Fachada'].includes(o.userData.category))return;
  const b=new THREE.Box3().setFromObject(o);if(b.min.x<LOT.x0-.15||b.max.x>LOT.x1+.15||b.min.z<LOT.z0-.15||b.max.z>LOT.z1+.15)outside.push(o.userData.id);
});

const qa={
  version:'v1.13-heavy-qa',
  dimensions:{lot:[10,25],house:[7.076,6.058],clearApprox:[6.836,5.818]},
  humanReference:1.65,
  duplicates,invalid,criticalOverlaps,socialBlockers,privateBlockers,doorBlockers,treeIssues,outside,
  masterClearances,socialClearances,
  nav:window.__CASA_NAV_V20__||null,
  audits:{v20:window.__CASA_AUDIT_V20__||null,v21:window.__CASA_AUDIT_V21__||null,v22:window.__CASA_AUDIT_V22__||null},
  pass:duplicates.length===0&&invalid.length===0&&criticalOverlaps.length===0&&socialBlockers.length===0&&privateBlockers.length===0&&doorBlockers.length===0&&treeIssues.length===0&&outside.length===0
};
window.__CASA_AUDIT_V23__=qa;
console.info('[Casa Contreras] HEAVY QA v1.13',qa);

// Painel oculto: K liga/desliga. Não interfere no pointer-lock.
const panel=document.createElement('div');panel.id='qa-v23';panel.style.cssText='position:fixed;right:12px;top:12px;z-index:18;width:min(430px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;background:rgba(8,13,11,.94);color:#eef5f0;border:1px solid rgba(255,255,255,.15);border-radius:12px;padding:12px;font:12px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace;display:none;pointer-events:none;white-space:pre-wrap;box-shadow:0 14px 40px rgba(0,0,0,.35)';document.body.appendChild(panel);
let visible=false,lastUpdate=0;
function fmtArr(name,a){return `${name}: ${a.length?`FAIL (${a.length})\n  - ${a.join('\n  - ')}`:'OK'}`;}
function updatePanel(now){if(!visible||now-lastUpdate<220)return;lastUpdate=now;const nav=window.__CASA_NAV_V20__||{};panel.textContent=[
`CASA CONTRERAS — QA v1.13`,
`STATUS: ${qa.pass?'PASS ESTÁTICO':'ATENÇÃO'}`,
``,
`NAVEGAÇÃO`,
`nível: ${nav.level??'?'} | escada: ${nav.stair??'none'} | progresso: ${nav.progress??0}`,
`posição: ${(nav.physicalPosition||[camera.position.x,camera.position.y,camera.position.z]).map(v=>Number(v).toFixed(2)).join(', ')}`,
``,
`FOLGAS`,
`master armário↔cama: ${masterClearances?.wardrobeToBed??'?'} m`,
`master lado direito: ${masterClearances?.bedToRightPartition??'?'} m`,
`master pé da cama: ${masterClearances?.footToFrontWall??'?'} m`,
`jantar↔sofá: ${socialClearances.diningToSofa??'?'} m`,
`jantar↔ilha: ${socialClearances.diningToIsland??'?'} m`,
``,
fmtArr('overlaps críticos',criticalOverlaps),
fmtArr('bloqueios social',socialBlockers),
fmtArr('bloqueios íntimo',privateBlockers),
fmtArr('bloqueios de portas',doorBlockers),
fmtArr('árvores',treeIssues),
fmtArr('fora do lote',outside),
fmtArr('IDs duplicados',duplicates),
fmtArr('transforms inválidos',invalid),
``,
`K = ocultar painel`
].join('\n');}
function loop(t){updatePanel(t);requestAnimationFrame(loop);}requestAnimationFrame(loop);
addEventListener('keydown',e=>{if(e.code==='KeyK'){visible=!visible;panel.style.display=visible?'block':'none';if(visible)lastUpdate=0;}});

const top=document.getElementById('topbar');if(top)top.innerHTML=`<b>CASA CONTRERAS — v1.13 HEAVY QA</b><br><span class="muted">v1.12 realismo leve • v1.11 layout funcional • v1.10 navegação contínua • K abre auditoria em tempo real<br>7,076 × 6,058 m • referência humana 1,65 m • QA de overlaps/passagens/perímetro ativo</span>`;
