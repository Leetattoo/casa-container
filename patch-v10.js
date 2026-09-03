import * as THREE from 'three';

const scene = window.__CASA_SCENE__;
const camera = window.__CASA_CAMERA__;
const renderer = window.__CASA_RENDERER__;
if (!scene || !camera || !renderer) throw new Error('Casa Contreras v1.0: cena base indisponivel');

const HOUSE = Object.freeze({ w:7.076, d:6.058, centerZ:0.700, wall:0.120 });
const LEVEL = Object.freeze({ social:3.250, private:6.250 });
const halfW=HOUSE.w/2, halfD=HOUSE.d/2;
const front=HOUSE.centerZ-halfD, back=HOUSE.centerZ+halfD;
const inner=Object.freeze({ west:-halfW+HOUSE.wall, east:halfW-HOUSE.wall, front:front+HOUSE.wall, back:back-HOUSE.wall });
const clearW=inner.east-inner.west, clearD=inner.back-inner.front;
const grossArea=HOUSE.w*HOUSE.d, clearArea=clearW*clearD;

function byId(id){let hit=null;scene.traverse(o=>{if(!hit&&o.userData?.id===id)hit=o;});return hit;}
function removeId(id){const o=byId(id);if(o?.parent)o.parent.remove(o);return o;}
function tag(o,id,label,category,extra={}){o.userData={...o.userData,id,label,category,selectable:true,...extra};return o;}
const GBOX=new THREE.BoxGeometry(1,1,1);
const M={
 wood:new THREE.MeshStandardMaterial({color:0x8f5a32,roughness:.72}),
 woodLight:new THREE.MeshStandardMaterial({color:0xb27c49,roughness:.70}),
 white:new THREE.MeshStandardMaterial({color:0xf0ece4,roughness:.88}),
 dark:new THREE.MeshStandardMaterial({color:0x171c1a,roughness:.48,metalness:.45}),
 fabric:new THREE.MeshStandardMaterial({color:0x505b55,roughness:1}),
 pad:new THREE.MeshStandardMaterial({color:0x77766f,roughness:.98}),
 line:new THREE.LineBasicMaterial({color:0xd8be82,transparent:true,opacity:.55,depthWrite:false}),
};
function box({w,h,d,x=0,y=h/2,z=0,mat=M.wood,id,label,category,parent=scene}){const m=new THREE.Mesh(GBOX,mat);m.scale.set(w,h,d);m.position.set(x,y,z);m.castShadow=false;m.receiveShadow=false;parent.add(m);if(id)tag(m,id,label||id,category||'Elemento');return m;}

// 1) TERREO: remove o paredao transversal/fundo. As divisorias menores de servico permanecem.
removeId('TER-FUNDO');

// O motor antigo guardou a caixa de colisao do paredao no momento da criacao.
// Ignoramos somente a caixa que corresponde exatamente a esse elemento removido.
if(!window.__CASA_V10_BOX_PATCH__){
  window.__CASA_V10_BOX_PATCH__=true;
  const original=THREE.Box3.prototype.intersectsBox;
  THREE.Box3.prototype.intersectsBox=function(b){
    const sx=b.max.x-b.min.x, sy=b.max.y-b.min.y, sz=b.max.z-b.min.z;
    const removedGroundWall=Math.abs(sx-(HOUSE.w-.24))<.03&&Math.abs(sy-2.55)<.03&&Math.abs(sz-.10)<.03&&Math.abs((b.min.z+b.max.z)/2-(back-.07))<.04;
    if(removedGroundWall)return false;
    return original.call(this,b);
  };
}

// 2) VAGA: nao existe mais piso continuo do portao ate a casa.
removeId('DRIVEWAY');
const parking=box({w:2.80,h:.028,d:5.60,x:2.70,y:.014,z:-9.48,mat:M.pad,id:'VAGA-FRENTE-V10',label:'Vaga frontal compacta 2,80 x 5,60 m',category:'Garagem'});
parking.userData.largeCarOnly=true;
const car=byId('CARRO-REF');
if(car){car.position.set(2.70,0,-9.50);car.scale.set(1.071,1,1.145);car.userData.label='SUV grande de referencia ~1,95 x 4,90 m';car.updateMatrixWorld(true);}

// 3) QUARTO DOS FILHOS: tres camas separadas saem; entra UMA treliche de tres niveis.
for(let i=1;i<=3;i++){removeId(`CAMA-FILHO-${i}`);removeId(`COLCHAO-FILHO-${i}`);removeId(`CAD-FILHO-${i}`);}removeId('BANCADA-FILHOS');
const bunk=new THREE.Group();bunk.position.set(-2.83,LEVEL.private,1.98);scene.add(bunk);tag(bunk,'TRELICHE-3','Treliche com 3 camas sobrepostas','Quarto 3 filhos',{footprint:[.94,2.02],levels:3});
// postes
for(const x of [-.44,.44])for(const z of [-.96,.96])box({w:.055,h:2.38,d:.055,x,y:1.19,z,mat:M.dark,parent:bunk});
const mattressY=[.35,1.12,1.89];
for(let i=0;i<3;i++){
  box({w:.94,h:.08,d:2.02,y:mattressY[i]-.08,z:0,mat:M.woodLight,parent:bunk});
  box({w:.86,h:.14,d:1.92,y:mattressY[i],z:0,mat:M.white,parent:bunk});
  box({w:.045,h:.26,d:1.86,x:.46,y:mattressY[i]+.24,z:0,mat:M.dark,parent:bunk});
}
// escada vertical compacta
for(let y=.38;y<=2.10;y+=.34)box({w:.42,h:.035,d:.05,x:.48,y,z:-.80,mat:M.dark,parent:bunk});
box({w:.045,h:1.95,d:.05,x:.29,y:1.22,z:-.80,mat:M.dark,parent:bunk});
box({w:.045,h:1.95,d:.05,x:.67,y:1.22,z:-.80,mat:M.dark,parent:bunk});
// bancada de estudo no fundo, liberando o centro do quarto
box({w:1.92,h:.08,d:.46,x:-1.43,y:LEVEL.private+.74,z:inner.back-.28,mat:M.wood,id:'BANCADA-FILHOS-V10',label:'Bancada de estudo dos 3 filhos',category:'Quarto 3 filhos'});
for(const x of [-2.05,-1.43,-.81])box({w:.32,h:.44,d:.34,x,y:LEVEL.private+.22,z:inner.back-.76,mat:M.fabric,id:`CADEIRA-FILHOS-V10-${x}`,label:'Cadeira de estudo',category:'Quarto 3 filhos'});

// 4) ESCALA: grade metrada real, alternada pela tecla G.
function makeGrid(y){
  const pts=[];
  const x0=-HOUSE.w/2,x1=HOUSE.w/2,z0=front,z1=back;
  for(let x=Math.ceil(x0);x<=Math.floor(x1);x+=1)pts.push(x,y,z0,x,y,z1);
  for(let z=Math.ceil(z0);z<=Math.floor(z1);z+=1)pts.push(x0,y,z,x1,y,z);
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
  const lines=new THREE.LineSegments(geo,M.line);lines.visible=false;lines.renderOrder=5;scene.add(lines);return lines;
}
const grids=[makeGrid(LEVEL.social+.018),makeGrid(LEVEL.private+.018)];
addEventListener('keydown',e=>{if(e.code==='KeyG'){const on=!grids[0].visible;grids.forEach(g=>g.visible=on);}});

// 5) PERFORMANCE: o gargalo principal restante era raycast em TODA a cena + sombras dinamicas.
renderer.shadowMap.enabled=false;
renderer.setPixelRatio(Math.min(devicePixelRatio||1,.90));
scene.traverse(o=>{if(o.isDirectionalLight)o.castShadow=false;if(o.isPointLight)o.visible=false;if(o.isMesh)o.castShadow=false;});
camera.fov=55;camera.updateProjectionMatrix();

if(!window.__CASA_V10_RAY_PATCH__){
  window.__CASA_V10_RAY_PATCH__=true;
  const original=THREE.Raycaster.prototype.intersectObjects;
  THREE.Raycaster.prototype.intersectObjects=function(objects,recursive=true,optionalTarget=[]){
    if(objects===scene.children){
      const targets=objects.filter(o=>o.userData?.selectable===true);
      return original.call(this,targets,true,optionalTarget);
    }
    return original.call(this,objects,recursive,optionalTarget);
  };
}

// HUD + QA: mostra comparacao objetiva de metragem.
const top=document.getElementById('topbar');
if(top)top.innerHTML=`<b>CASA CONTRERAS — v1.0 ESCALA/ESPACO</b><br><span class="muted">casa 7,076 x 6,058 m = ${grossArea.toFixed(2)} m² brutos • interior aprox. ${clearW.toFixed(3)} x ${clearD.toFixed(3)} = ${clearArea.toFixed(2)} m² antes das divisorias<br>G grade de 1 m • H pessoa 1,75 m • Q qualidade • F feedbacks locais</span>`;
const note=document.querySelector('#start .note');if(note)note.textContent=`Comparacao: o pavimento tem ~${clearArea.toFixed(2)} m² internos antes das divisorias. Sacadas continuam 100% externas. A vaga agora ocupa apenas 2,80 x 5,60 m perto do portao.`;
const localCount=Object.keys(localStorage).filter(k=>k.startsWith('casa-feedback')).length;
if(localCount){const t=document.getElementById('toast');if(t){setTimeout(()=>{t.textContent=`${localCount} feedback(s) local(is) encontrados. Aperte F para copiar/exportar.`;t.style.opacity='1';t.style.transform='translateY(0)';},900);}}
window.__CASA_V10__={version:'v1.0-scale-space',grossArea:+grossArea.toFixed(3),clearArea:+clearArea.toFixed(3),clearSize:[+clearW.toFixed(3),+clearD.toFixed(3)],balconyExternal:true,parking:[2.8,5.6],bunkBeds:3,groundBackWallRemoved:true,shadows:false,raycastFiltered:true};
console.info('[Casa Contreras] patch v1.0 aplicado',window.__CASA_V10__);
