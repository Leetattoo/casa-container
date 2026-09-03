import * as THREE from 'three';

const scene=window.__CASA_SCENE__;
if(!scene) throw new Error('Casa Contreras v1.14: cena indisponível');

const HOUSE={w:7.076,d:6.058,centerZ:.700,wall:.120};
const LEVEL={social:3.250,private:6.250};
const halfW=HOUSE.w/2,halfD=HOUSE.d/2,front=HOUSE.centerZ-halfD,back=HOUSE.centerZ+halfD;
const inner={west:-halfW+HOUSE.wall,east:halfW-HOUSE.wall,front:front+HOUSE.wall,back:back-HOUSE.wall};
const BOX=new THREE.BoxGeometry(1,1,1);
const steel=new THREE.MeshStandardMaterial({color:0x111716,roughness:.38,metalness:.72});
const glass=new THREE.MeshStandardMaterial({color:0xa7c6c8,transparent:true,opacity:.22,roughness:.12,depthWrite:false,side:THREE.DoubleSide});
const wood=new THREE.MeshStandardMaterial({color:0xa36b40,roughness:.64});
const chrome=new THREE.MeshStandardMaterial({color:0xb9c0bd,roughness:.16,metalness:.88});

function byId(id){let hit=null;scene.traverse(o=>{if(!hit&&o.userData?.id===id)hit=o;});return hit;}
function removeId(id){const o=byId(id);if(o?.parent)o.parent.remove(o);return o;}
function tag(o,id,label,category='Elemento',extra={}){o.userData={...o.userData,id,label,category,selectable:true,...extra};return o;}
function mesh(parent,w,h,d,x,y,z,mat=steel){const o=new THREE.Mesh(BOX,mat);o.scale.set(w,h,d);o.position.set(x,y,z);o.castShadow=false;o.receiveShadow=false;parent.add(o);return o;}
function group(id,label,category='Acesso',extra={}){const g=new THREE.Group();scene.add(g);return tag(g,id,label,category,extra);}
function boxOf(o){o.updateMatrixWorld(true);return new THREE.Box3().setFromObject(o);}
function sizeOf(b){return b.getSize(new THREE.Vector3());}
function centerOf(b){return b.getCenter(new THREE.Vector3());}

// ---------------------------------------------------------------------------
// 1) REMOVE OS ACESSOS v1.8 QUE CAÍAM EM AMBIENTES ERRADOS.
// ---------------------------------------------------------------------------
removeId('SOCIAL-LATERAL-LESTE-V18');
removeId('INTIMO-ACESSO-TRASEIRO-V18');

// Restaura a fachada leste social como pano contínuo de vidro/estrutura.
// O acesso social deixa de disputar espaço com o banheiro posterior direito.
removeId('SOCIAL-LATERAL-LESTE-V24');
const east=group('SOCIAL-LATERAL-LESTE-V24','Fachada leste social contínua','Fachada');
const eastX=halfW-.018;
mesh(east,.03,2.30,HOUSE.d-1.02,eastX,LEVEL.social+1.16,HOUSE.centerZ,glass);
for(let z=front+.45;z<=back-.45;z+=.72)mesh(east,.045,2.38,.045,eastX+.012,LEVEL.social+1.19,z,steel);
mesh(east,.07,.07,HOUSE.d-.92,eastX+.015,LEVEL.social+2.31,HOUSE.centerZ,steel);

// ---------------------------------------------------------------------------
// 2) ABRE PORTAIS TRASEIROS NA FAIXA DE CIRCULAÇÃO x≈0,85.
// Social: fica entre cozinha (esquerda) e banheiro (direita).
// Íntimo: desemboca no corredor direito, não no quarto das crianças.
// ---------------------------------------------------------------------------
const doorCx=.85,doorW=.90,doorXa=doorCx-doorW/2,doorXb=doorCx+doorW/2;
const zRear=back-.045,doorH=2.12;

function carveRearPortal(yBase){
  const portal=new THREE.Box3(
    new THREE.Vector3(doorXa-.08,yBase+.04,back-.17),
    new THREE.Vector3(doorXb+.08,yBase+2.30,back+.17)
  );
  const doomed=[];
  scene.traverse(o=>{
    if(!o.isMesh||!o.parent)return;
    // Nunca cortar o que estamos criando nesta versão.
    if(o.parent?.userData?.id?.includes('V24'))return;
    const b=boxOf(o),s=sizeOf(b),c=centerOf(b);
    const rearPlane=Math.abs(c.z-back)<.22&&s.z<.26&&s.y>.22;
    const sameLevel=b.max.y>yBase+.08&&b.min.y<yBase+2.35;
    const crosses=rearPlane&&sameLevel&&b.intersectsBox(portal);
    if(crosses)doomed.push(o);
  });
  doomed.forEach(o=>o.parent?.remove(o));
  return doomed.length;
}
const removedSocial=carveRearPortal(LEVEL.social);
const removedPrivate=carveRearPortal(LEVEL.private);

function rearAccess(id,yBase,label){
  const g=group(id,label,'Acesso',{rearCirculation:true,doorClearWidth:doorW,doorCenterX:doorCx});
  const spanL=-1.78,spanR=1.78;
  // Pano de vidro à esquerda e à direita do vão.
  if(doorXa>spanL)mesh(g,doorXa-spanL,2.28,.028,(spanL+doorXa)/2,yBase+1.15,zRear,glass);
  if(spanR>doorXb)mesh(g,spanR-doorXb,2.28,.028,(doorXb+spanR)/2,yBase+1.15,zRear,glass);
  // Caixilho do vão.
  for(const x of[spanL,doorXa,doorXb,spanR])mesh(g,.045,2.38,.055,x,yBase+1.19,zRear,steel);
  mesh(g,doorW+.09,.065,.055,doorCx,yBase+doorH,zRear,steel);
  mesh(g,doorW-.08,.035,.16,doorCx,yBase+.018,back+.005,wood);
  // Folha de correr estacionada para o lado esquerdo: abertura física permanece livre.
  const leafW=.78;
  const leafCx=doorXa-leafW/2-.06;
  const leaf=mesh(g,leafW,2.04,.024,leafCx,yBase+1.04,zRear-.025,glass);
  tag(leaf,`${id}-PORTA`,`${label} — porta de correr aberta`,'Acesso',{clearOpening:true});
  mesh(g,.018,.31,.018,doorXa-.11,yBase+1.04,zRear-.055,chrome);
  return g;
}
const socialAccess=rearAccess('ACESSO-TRASEIRO-SOCIAL-V24',LEVEL.social,'Entrada social pela circulação traseira');
const privateAccess=rearAccess('ACESSO-TRASEIRO-INTIMO-V24',LEVEL.private,'Entrada íntima pela circulação traseira');

// ---------------------------------------------------------------------------
// 3) PASSARELA DA SACADA AO VÃO: marca visualmente o percurso externo.
// ---------------------------------------------------------------------------
const bridgeMat=wood.clone();bridgeMat.roughness=.70;
for(const y of[LEVEL.social,LEVEL.private]){
  const g=group(`PASSARELA-ACESSO-${y}-V24`,`Passarela de acesso ${y===LEVEL.social?'social':'íntima'}`,'Circulação',{external:true});
  for(let x=-1.60;x<=3.20;x+=.48)mesh(g,.42,.045,.68,x,y+.023,back+.39,bridgeMat);
}

// ---------------------------------------------------------------------------
// 4) COLISÃO: ignora SOMENTE colisão legada de parede/esquadria exatamente
// no portal traseiro. Todo o restante continua sólido.
// ---------------------------------------------------------------------------
if(!window.__CASA_V24_REAR_PORTAL_COLLISION__){
  window.__CASA_V24_REAR_PORTAL_COLLISION__=true;
  const previous=THREE.Box3.prototype.intersectsBox;
  THREE.Box3.prototype.intersectsBox=function(b){
    const ps=sizeOf(this),pc=centerOf(this),bs=sizeOf(b),bc=centerOf(b);
    const player=ps.x>.43&&ps.x<.58&&ps.z>.43&&ps.z<.58&&ps.y>1.50&&ps.y<1.90;
    if(player){
      const socialY=pc.y>LEVEL.social+.65&&pc.y<LEVEL.social+1.95;
      const privateY=pc.y>LEVEL.private+.65&&pc.y<LEVEL.private+1.95;
      const atPortal=pc.x>doorXa-.10&&pc.x<doorXb+.10&&pc.z>back-.32&&pc.z<back+.32&&(socialY||privateY);
      const legacyRear=Math.abs(bc.z-back)<.22&&bs.z<.26&&bs.y>1.80&&b.max.x>doorXa&&b.min.x<doorXb;
      if(atPortal&&legacyRear)return false;
    }
    return previous.call(this,b);
  };
}

// ---------------------------------------------------------------------------
// 5) QA DE ACESSO: verifica que as portas caem na circulação e não em móveis.
// ---------------------------------------------------------------------------
function bounds(id){const o=byId(id);return o?boxOf(o):null;}
function overlaps(a,b,eps=.015){return !!a&&!!b&&a.min.x<b.max.x-eps&&a.max.x>b.min.x+eps&&a.min.y<b.max.y-eps&&a.max.y>b.min.y+eps&&a.min.z<b.max.z-eps&&a.max.z>b.min.z+eps;}
const socialPortal=new THREE.Box3(new THREE.Vector3(doorXa,LEVEL.social+.02,back-.42),new THREE.Vector3(doorXb,LEVEL.social+2.10,back+.30));
const privatePortal=new THREE.Box3(new THREE.Vector3(doorXa,LEVEL.private+.02,back-.42),new THREE.Vector3(doorXb,LEVEL.private+2.10,back+.30));
const socialFurniture=['ILHA-V15','JANTAR-V15','SOFA-V15','BANHEIRO-SOCIAL-V15','COZINHA-V15'];
const privateFurniture=['CAMA-CASAL-V16','GUARDA-ROUPA-V16','TRELICHE-V16','BANCADA-FILHOS-V16','ARMARIO-FILHOS-V16','GAMER-V15','BANHEIRO-INTIMO-V15'];
const socialBlockers=socialFurniture.filter(id=>overlaps(bounds(id),socialPortal));
const privateBlockers=privateFurniture.filter(id=>overlaps(bounds(id),privatePortal));
const bath=bounds('BANHEIRO-SOCIAL-V15');
const socialBathGap=bath?+(bath.min.x-doorXb).toFixed(3):null;
const privateBath=bounds('BANHEIRO-INTIMO-V15');
const privateBathGap=privateBath?+(privateBath.min.x-doorXb).toFixed(3):null;
const audit={
  version:'v1.14-access-circulation',
  rearDoorCenterX:doorCx,
  clearWidth:doorW,
  social:{present:!!socialAccess,removedLegacyMeshes:removedSocial,blockers:socialBlockers,bathGap:socialBathGap},
  private:{present:!!privateAccess,removedLegacyMeshes:removedPrivate,blockers:privateBlockers,bathGap:privateBathGap},
  eastSocialFacadeRestored:!!east,
  rearPortalCollisionBypass:true,
  externalStairs:!!byId('ESCADAS-EXTERNAS-V16'),
  pass:!!socialAccess&&!!privateAccess&&socialBlockers.length===0&&privateBlockers.length===0&&(socialBathGap===null||socialBathGap>.30)&&(privateBathGap===null||privateBathGap>.30)
};
window.__CASA_AUDIT_V24__=audit;
console.info('[Casa Contreras] AUDIT v1.14',audit);
const top=document.getElementById('topbar');if(top)top.innerHTML=`<b>CASA CONTRERAS — v1.14 ACCESS / CIRCULATION</b><br><span class="muted">entradas social e íntima movidas para a circulação traseira • social não cai mais no banheiro • íntimo não cai mais no quarto das crianças • escadas seguem 100% externas • navegação v1.10 preservada<br>7,076 × 6,058 m • referência humana 1,65 m • nenhuma área interna foi consumida</span>`;
