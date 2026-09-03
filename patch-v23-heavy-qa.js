import * as THREE from 'three';

const scene=window.__CASA_SCENE__,camera=window.__CASA_CAMERA__;
if(!scene||!camera) throw new Error('Casa Contreras v1.15: cena indisponível');

const LOT={x0:-5,x1:5,z0:-12.5,z1:12.5};
const HOUSE={w:7.076,d:6.058,centerZ:.700,wall:.120};
const LEVEL={ground:0,social:3.25,private:6.25};
const halfW=HOUSE.w/2,halfD=HOUSE.d/2,front=HOUSE.centerZ-halfD,back=HOUSE.centerZ+halfD;
const inner={west:-halfW+HOUSE.wall,east:halfW-HOUSE.wall,front:front+HOUSE.wall,back:back-HOUSE.wall};
const clearArea=(HOUSE.w-HOUSE.wall*2)*(HOUSE.d-HOUSE.wall*2),referenceArea=32.5;

function byId(id){let hit=null;scene.traverse(o=>{if(!hit&&o.userData?.id===id)hit=o;});return hit;}
function bounds(id){const o=byId(id);if(!o)return null;o.updateMatrixWorld(true);return new THREE.Box3().setFromObject(o);}
function size2D(id){const b=bounds(id);if(!b)return null;const s=b.getSize(new THREE.Vector3());return {x:+s.x.toFixed(2),z:+s.z.toFixed(2),long:+Math.max(s.x,s.z).toFixed(2),short:+Math.min(s.x,s.z).toFixed(2)};}
function overlap(a,b,eps=.015){return !!a&&!!b&&a.min.x<b.max.x-eps&&a.max.x>b.min.x+eps&&a.min.y<b.max.y-eps&&a.max.y>b.min.y+eps&&a.min.z<b.max.z-eps&&a.max.z>b.min.z+eps;}
function gapX(a,b){if(!a||!b)return null;return Math.max(b.min.x-a.max.x,a.min.x-b.max.x,0);}
function gapZ(a,b){if(!a||!b)return null;return Math.max(b.min.z-a.max.z,a.min.z-b.max.z,0);}
function finiteObject(o){return Number.isFinite(o.position.x)&&Number.isFinite(o.position.y)&&Number.isFinite(o.position.z)&&Number.isFinite(o.scale.x)&&Number.isFinite(o.scale.y)&&Number.isFinite(o.scale.z)&&Number.isFinite(o.rotation.x)&&Number.isFinite(o.rotation.y)&&Number.isFinite(o.rotation.z);}
function rectOverlap(b,r){return !!b&&b.min.x<r.x1&&b.max.x>r.x0&&b.min.z<r.z1&&b.max.z>r.z0;}
function horizontalPointBoxDistance(p,b){const dx=p.x<b.min.x?b.min.x-p.x:p.x>b.max.x?p.x-b.max.x:0,dz=p.z<b.min.z?b.min.z-p.z:p.z>b.max.z?p.z-b.max.z:0;return Math.hypot(dx,dz);}

const idCount=new Map(),invalid=[];scene.traverse(o=>{const id=o.userData?.id;if(id)idCount.set(id,(idCount.get(id)||0)+1);if(!finiteObject(o))invalid.push(id||o.name||o.type);});
const duplicates=[...idCount].filter(([,n])=>n>1).map(([id,n])=>`${id}×${n}`);

const pairs=[['ILHA-V15','JANTAR-V15'],['JANTAR-V15','SOFA-V15'],['SOFA-V15','TV-V15'],['CAMA-CASAL-V16','GUARDA-ROUPA-V16'],['CAMA-CASAL-V16','TRELICHE-V16'],['TRELICHE-V16','BANCADA-FILHOS-V16'],['TRELICHE-V16','ARMARIO-FILHOS-V16'],['BANCADA-FILHOS-V16','ARMARIO-FILHOS-V16'],['CAMINHO-LATERAL-V15','LAGO-NATURAL-V15'],['CAMINHO-LATERAL-V15','LAGO-PEIXES-V15'],['CAMINHO-LATERAL-V15','CISTERNA-V15'],['CAMINHO-LATERAL-V15','COBERTURA-GARAGEM-V15'],['LAGO-NATURAL-V15','COBERTURA-GARAGEM-V15'],['LAGO-PEIXES-V15','COBERTURA-GARAGEM-V15']];
const criticalOverlaps=pairs.filter(([a,b])=>overlap(bounds(a),bounds(b))).map(([a,b])=>`${a} ↔ ${b}`);

const socialCorridor={x0:-.35,x1:.68,z0:-1.95,z1:2.75},privateCorridor={x0:.16,x1:1.28,z0:-1.90,z1:3.28};
const socialBlockers=['ILHA-V15','JANTAR-V15','SOFA-V15','BANHEIRO-SOCIAL-V15'].filter(id=>rectOverlap(bounds(id),socialCorridor));
const privateBlockers=['CAMA-CASAL-V16','GUARDA-ROUPA-V16','TRELICHE-V16','BANCADA-FILHOS-V16','ARMARIO-FILHOS-V16','GAMER-V15','BANHEIRO-INTIMO-V15'].filter(id=>rectOverlap(bounds(id),privateCorridor));

const rearDoorZone={x0:.36,x1:1.34,z0:back-.44,z1:back+.32};
const socialDoorBlockers=['ILHA-V15','JANTAR-V15','SOFA-V15','BANHEIRO-SOCIAL-V15','COZINHA-V15'].filter(id=>rectOverlap(bounds(id),rearDoorZone));
const privateDoorBlockers=['CAMA-CASAL-V16','GUARDA-ROUPA-V16','TRELICHE-V16','BANCADA-FILHOS-V16','ARMARIO-FILHOS-V16','GAMER-V15','BANHEIRO-INTIMO-V15'].filter(id=>rectOverlap(bounds(id),rearDoorZone));
const doorBlockers=[...socialDoorBlockers.map(id=>`social:${id}`),...privateDoorBlockers.map(id=>`íntimo:${id}`)];

const bed=bounds('CAMA-CASAL-V16'),ward=bounds('GUARDA-ROUPA-V16'),dining=bounds('JANTAR-V15'),sofa=bounds('SOFA-V15'),island=bounds('ILHA-V15');
const masterClearances=bed&&ward?{wardrobeToBed:+Math.max(ward.min.x-bed.max.x,bed.min.x-ward.max.x,ward.min.z-bed.max.z,bed.min.z-ward.max.z,0).toFixed(2),bedToRightPartition:+((-0.07)-bed.max.x).toFixed(2),footToFrontWall:+(bed.min.z-inner.front).toFixed(2)}:null;
const socialClearances={diningToSofa:dining&&sofa?+gapX(dining,sofa).toFixed(2):null,diningToIsland:dining&&island?+gapZ(dining,island).toFixed(2):null};

const furnitureObserved={sofa:size2D('SOFA-V15'),islandWithStools:size2D('ILHA-V15'),diningWithChairs:size2D('JANTAR-V15'),queen:size2D('CAMA-CASAL-V16'),bunk:size2D('TRELICHE-V16'),gamer:size2D('GAMER-V15')};
const furnitureScaleIssues=[];
if(furnitureObserved.sofa&&(furnitureObserved.sofa.long>2.08||furnitureObserved.sofa.short>1.00))furnitureScaleIssues.push(`sofá ${furnitureObserved.sofa.long}×${furnitureObserved.sofa.short} m`);
if(furnitureObserved.queen&&(furnitureObserved.queen.long>2.12||furnitureObserved.queen.short>1.68))furnitureScaleIssues.push(`queen ${furnitureObserved.queen.long}×${furnitureObserved.queen.short} m`);
if(furnitureObserved.bunk&&(furnitureObserved.bunk.long>2.12||furnitureObserved.bunk.short>1.02))furnitureScaleIssues.push(`treliche ${furnitureObserved.bunk.long}×${furnitureObserved.bunk.short} m`);
if(furnitureObserved.gamer&&furnitureObserved.gamer.long>2.10)furnitureScaleIssues.push(`gamer ${furnitureObserved.gamer.long} m`);

const path=byId('CAMINHO-LATERAL-V15'),pathStones=[];
if(path){path.updateMatrixWorld(true);path.traverse(o=>{if(o.isMesh){o.updateMatrixWorld(true);pathStones.push(new THREE.Box3().setFromObject(o));}});}
const trees=[];scene.traverse(o=>{if(o.userData?.category==='Árvore frutífera')trees.push(o);});
const treeIssues=[];
for(const t of trees){const p=t.getWorldPosition(new THREE.Vector3()),wallDist=Math.min(4.94-Math.abs(p.x),12.44-Math.abs(p.z));if(wallDist>.55)treeIssues.push(`${t.userData.id||'árvore'} longe do muro (${wallDist.toFixed(2)} m)`);if(pathStones.length){const d=Math.min(...pathStones.map(b=>horizontalPointBoxDistance(p,b)));if(d<.20)treeIssues.push(`${t.userData.id||'árvore'} a ${d.toFixed(2)} m da borda do caminho`);}if(p.x>3.45&&p.z>-2.2&&p.z<3.6)treeIssues.push(`${t.userData.id||'árvore'} na faixa da escada inferior`);}

const outside=[];scene.traverse(o=>{if(!o.userData?.id||!o.userData?.selectable||o.parent!==scene)return;if(['Árvore frutífera','Sacada','Escada','Fachada'].includes(o.userData.category))return;const b=new THREE.Box3().setFromObject(o);if(b.min.x<LOT.x0-.15||b.max.x>LOT.x1+.15||b.min.z<LOT.z0-.15||b.max.z>LOT.z1+.15)outside.push(o.userData.id);});

const qa={version:'v1.15-heavy-qa',dimensions:{lot:[10,25],house:[7.076,6.058],clearApprox:[6.836,5.818],clearArea:+clearArea.toFixed(2),referenceArea,areaDeltaPercent:+((clearArea/referenceArea-1)*100).toFixed(1)},humanReference:1.65,duplicates,invalid,criticalOverlaps,socialBlockers,privateBlockers,doorBlockers,treeIssues,outside,furnitureObserved,furnitureScaleIssues,masterClearances,socialClearances,pathStoneCount:pathStones.length,access:{social:!!byId('ACESSO-TRASEIRO-SOCIAL-V24'),private:!!byId('ACESSO-TRASEIRO-INTIMO-V24'),audit:window.__CASA_AUDIT_V24__||null},nav:window.__CASA_NAV_V20__||null,audits:{v20:window.__CASA_AUDIT_V20__||null,v21:window.__CASA_AUDIT_V21__||null,v22:window.__CASA_AUDIT_V22__||null,v24:window.__CASA_AUDIT_V24__||null},pass:duplicates.length===0&&invalid.length===0&&criticalOverlaps.length===0&&socialBlockers.length===0&&privateBlockers.length===0&&doorBlockers.length===0&&treeIssues.length===0&&outside.length===0&&furnitureScaleIssues.length===0&&!!byId('ACESSO-TRASEIRO-SOCIAL-V24')&&!!byId('ACESSO-TRASEIRO-INTIMO-V24')};
window.__CASA_AUDIT_V23__=qa;console.info('[Casa Contreras] HEAVY QA v1.15',qa);

let panel=document.getElementById('qa-v23');if(panel)panel.remove();panel=document.createElement('div');panel.id='qa-v23';panel.style.cssText='position:fixed;right:12px;top:12px;z-index:18;width:min(460px,calc(100vw - 24px));max-height:calc(100vh - 24px);overflow:auto;background:rgba(8,13,11,.94);color:#eef5f0;border:1px solid rgba(255,255,255,.15);border-radius:12px;padding:12px;font:12px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace;display:none;pointer-events:none;white-space:pre-wrap;box-shadow:0 14px 40px rgba(0,0,0,.35)';document.body.appendChild(panel);
let visible=false,lastUpdate=0;function fmtArr(name,a){return `${name}: ${a.length?`FAIL (${a.length})\n  - ${a.join('\n  - ')}`:'OK'}`;}function dim(v){return v?`${v.x} × ${v.z} m`:'?';}
function updatePanel(now){if(!visible||now-lastUpdate<220)return;lastUpdate=now;const nav=window.__CASA_NAV_V20__||{},access=window.__CASA_AUDIT_V24__||{};panel.textContent=[`CASA CONTRERAS — QA v1.15`,`STATUS: ${qa.pass?'PASS ESTÁTICO':'ATENÇÃO'}`,``,`ÁREA / ESCALA`,`pavimento interno aprox.: ${clearArea.toFixed(2)} m²`,`referência comparada: ${referenceArea.toFixed(1)} m² (+${((clearArea/referenceArea-1)*100).toFixed(1)}%)`,`pessoa: 1,65 m`,``,`MÓVEIS OBSERVADOS`,`sofá: ${dim(furnitureObserved.sofa)}`,`ilha + banquetas: ${dim(furnitureObserved.islandWithStools)}`,`jantar + cadeiras: ${dim(furnitureObserved.diningWithChairs)}`,`queen: ${dim(furnitureObserved.queen)}`,`treliche: ${dim(furnitureObserved.bunk)}`,`gamer: ${dim(furnitureObserved.gamer)}`,fmtArr('escala de móveis',furnitureScaleIssues),``,`NAVEGAÇÃO`,`nível: ${nav.level??'?'} | escada: ${nav.stair??'none'} | progresso: ${nav.progress??0}`,`posição: ${(nav.physicalPosition||[camera.position.x,camera.position.y,camera.position.z]).map(v=>Number(v).toFixed(2)).join(', ')}`,``,`ACESSOS TRASEIROS`,`social: ${byId('ACESSO-TRASEIRO-SOCIAL-V24')?'OK':'FALTA'} | íntimo: ${byId('ACESSO-TRASEIRO-INTIMO-V24')?'OK':'FALTA'}`,`v1.14 pass: ${access.pass===true?'SIM':access.pass===false?'NÃO':'?'}`,``,`FOLGAS`,`master armário↔cama: ${masterClearances?.wardrobeToBed??'?'} m`,`master lado direito: ${masterClearances?.bedToRightPartition??'?'} m`,`master pé da cama: ${masterClearances?.footToFrontWall??'?'} m`,`jantar↔sofá: ${socialClearances.diningToSofa??'?'} m`,`jantar↔ilha: ${socialClearances.diningToIsland??'?'} m`,``,fmtArr('overlaps críticos',criticalOverlaps),fmtArr('bloqueios social',socialBlockers),fmtArr('bloqueios íntimo',privateBlockers),fmtArr('bloqueios de portas',doorBlockers),fmtArr('árvores',treeIssues),fmtArr('fora do lote',outside),fmtArr('IDs duplicados',duplicates),fmtArr('transforms inválidos',invalid),``,`K = ocultar painel`].join('\n');}
function loop(t){updatePanel(t);requestAnimationFrame(loop);}requestAnimationFrame(loop);addEventListener('keydown',e=>{if(e.code==='KeyK'){visible=!visible;panel.style.display=visible?'block':'none';if(visible)lastUpdate=0;}});
const top=document.getElementById('topbar');if(top)top.innerHTML=`<b>CASA CONTRERAS — v1.15 HEAVY QA / ACCESS</b><br><span class="muted">acessos traseiros corretos • navegação contínua • layout funcional • realismo leve • K mostra área, dimensões reais, overlaps e passagens<br>7,076 × 6,058 m • referência humana 1,65 m • QA dimensional ativo</span>`;
