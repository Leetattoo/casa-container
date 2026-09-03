import * as THREE from 'three';

const MASTER = Object.freeze({
  lot: { width: 10, length: 25 },
  house: { width: 7.076, depth: 6.058, centerZ: 0.70 },
  socialY: 3.25,
  privateY: 6.25,
  drive: { minX: 0.85, maxX: 4.70, minZ: -12.30, maxZ: -2.33 },
});

function seededNoise(seed = 9127) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function canvasTexture(draw, repeatX = 1, repeatY = 1) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  draw(ctx, canvas.width, canvas.height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 8;
  return tex;
}

function makeWoodTexture() {
  const rnd = seededNoise(8841);
  return canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#86532f';
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 7) {
      const n = Math.sin(y * 0.055) * 10 + (rnd() - 0.5) * 8;
      ctx.strokeStyle = `rgba(61,31,14,${0.10 + rnd() * 0.12})`;
      ctx.lineWidth = 1 + rnd() * 2;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 12) {
        const yy = y + Math.sin(x * 0.035 + y * 0.015) * 2.2 + n * 0.08;
        if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    for (let i = 0; i < 22; i++) {
      const x = rnd() * w, y = rnd() * h, r = 2 + rnd() * 7;
      ctx.strokeStyle = 'rgba(45,23,12,.23)';
      ctx.beginPath();
      ctx.ellipse(x, y, r * 2.3, r, rnd() * Math.PI, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, 2.5, 2.5);
}

function makeGrassTexture() {
  const rnd = seededNoise(20260903);
  return canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#547548';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 20000; i++) {
      const g = 60 + Math.floor(rnd() * 70);
      const a = 0.08 + rnd() * 0.18;
      ctx.fillStyle = `rgba(${35 + Math.floor(rnd()*35)},${g},${30 + Math.floor(rnd()*30)},${a})`;
      const x = rnd() * w, y = rnd() * h;
      ctx.fillRect(x, y, 1 + rnd() * 2, 1 + rnd() * 4);
    }
  }, 6, 14);
}

function makeConcreteTexture() {
  const rnd = seededNoise(4402);
  return canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#7e7b72';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 17000; i++) {
      const v = Math.floor(105 + rnd() * 80);
      ctx.fillStyle = `rgba(${v},${v},${v-4},${0.025 + rnd()*0.05})`;
      const x = rnd() * w, y = rnd() * h;
      ctx.fillRect(x, y, 1 + rnd() * 2, 1 + rnd() * 2);
    }
    ctx.strokeStyle = 'rgba(40,40,35,.08)';
    ctx.lineWidth = 2;
    for (let y = 0; y < h; y += 128) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
    for (let x = 0; x < w; x += 128) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  }, 3, 8);
}

function makeSteelTexture() {
  const rnd = seededNoise(7788);
  return canvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#2b3230';
    ctx.fillRect(0,0,w,h);
    for (let y=0;y<h;y+=3) {
      const a=.025+rnd()*.035;
      ctx.strokeStyle=`rgba(210,225,220,${a})`;
      ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();
    }
  }, 1.8, 4.2);
}

function box(scene, w, h, d, x, y, z, material, opts = {}) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material);
  m.position.set(x,y,z);
  m.castShadow = opts.castShadow !== false;
  m.receiveShadow = opts.receiveShadow !== false;
  if (opts.name) m.name = opts.name;
  if (opts.userData) m.userData = { ...m.userData, ...opts.userData };
  scene.add(m);
  return m;
}

function cyl(scene, rt, rb, h, x, y, z, material, segments=20) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,segments), material);
  m.position.set(x,y,z);
  m.castShadow=true;m.receiveShadow=true;scene.add(m);return m;
}

function addSky(scene) {
  const skyGeo = new THREE.SphereGeometry(70, 32, 18);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      top: { value: new THREE.Color(0x7fa6bf) },
      horizon: { value: new THREE.Color(0xe9c9a8) },
      ground: { value: new THREE.Color(0x9ca58f) },
    },
    vertexShader: `varying vec3 vWorld; void main(){ vec4 wp=modelMatrix*vec4(position,1.0); vWorld=wp.xyz; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `varying vec3 vWorld; uniform vec3 top; uniform vec3 horizon; uniform vec3 ground; void main(){ float h=normalize(vWorld).y; vec3 c=mix(horizon,top,smoothstep(0.0,.72,h)); c=mix(ground,c,smoothstep(-.28,.04,h)); gl_FragColor=vec4(c,1.0); }`,
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.name='V06_SKY';
  scene.add(sky);
  const sunMat = new THREE.MeshBasicMaterial({ color:0xffe2a8, transparent:true, opacity:.75, depthWrite:false });
  const sun = new THREE.Mesh(new THREE.SphereGeometry(.85,20,14), sunMat);
  sun.position.set(-18,18,-30);scene.add(sun);
}

function improveExistingMaterials(scene, renderer) {
  const wood = makeWoodTexture();
  const grass = makeGrassTexture();
  const concrete = makeConcreteTexture();
  const steel = makeSteelTexture();
  if (renderer) {
    const maxA = renderer.capabilities.getMaxAnisotropy?.() || 8;
    [wood,grass,concrete,steel].forEach(t=>t.anisotropy=Math.min(maxA,8));
  }

  scene.traverse(o => {
    if (!o.isMesh || !o.material) return;
    const id = o.userData?.id || '';
    const cat = o.userData?.category || '';
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach(mat => {
      if (!mat || !('roughness' in mat)) return;
      if (id === 'LOT-10X25') {
        mat.map = grass; mat.roughness = 1; mat.needsUpdate = true;
      }
      if (id === 'DRIVEWAY' || id.startsWith('PED-') || cat === 'Circulação') {
        mat.map = concrete; mat.roughness = .94; mat.needsUpdate = true;
      }
      if (/SACADA|DECK|PASSARELA|PISO-SOCIAL|PISO-INTIMO|MESA|BANCADA|PORTAO/.test(id)) {
        if (mat.metalness < .4) { mat.map = wood; mat.roughness = .66; mat.needsUpdate = true; }
      }
      if (/CORR|FACHADA|PILAR|VIGA|COBERTURA/.test(id) || cat === 'Estrutura' || cat === 'Fachada') {
        mat.map = steel; mat.metalness = Math.max(mat.metalness || 0, .64); mat.roughness = .34; mat.needsUpdate = true;
      }
      if (cat === 'Água') {
        mat.roughness = .045;
        if ('ior' in mat) mat.ior = 1.333;
        if ('clearcoat' in mat) { mat.clearcoat = .35; mat.clearcoatRoughness=.08; }
        mat.needsUpdate = true;
      }
      if (mat.isMeshPhysicalMaterial && /GLASS|VIDRO|ESQUADRIA/.test(id)) {
        mat.transmission = .78; mat.roughness=.035; mat.ior=1.48; mat.thickness=.018; mat.opacity=.37; mat.needsUpdate=true;
      }
    });
  });
}

function addFacadeDetail(scene) {
  const steel = new THREE.MeshStandardMaterial({ color:0x151b19, metalness:.82, roughness:.30 });
  const wood = new THREE.MeshStandardMaterial({ color:0x925b32, metalness:0, roughness:.58 });
  const warm = new THREE.MeshStandardMaterial({ color:0xffd1a0, emissive:0xff9b50, emissiveIntensity:2.15, roughness:.45 });
  const glass = new THREE.MeshPhysicalMaterial({ color:0xc2d7d5, transmission:.76, opacity:.36, transparent:true, roughness:.025, ior:1.48, thickness:.02, side:THREE.DoubleSide });
  const hw=MASTER.house.width/2, hd=MASTER.house.depth/2, front=MASTER.house.centerZ-hd;

  for (const y of [MASTER.socialY, MASTER.privateY]) {
    box(scene, MASTER.house.width+.08,.09,.11,0,y+.13,front-.07,steel,{name:'V06_FRAME_BOTTOM'});
    box(scene, MASTER.house.width+.08,.09,.11,0,y+2.73,front-.07,steel,{name:'V06_FRAME_TOP'});
    for (const x of [-hw,-1.75,0,1.75,hw]) box(scene,.075,2.66,.11,x,y+1.43,front-.07,steel,{name:'V06_FRAME_VERTICAL'});
    for (let i=0;i<11;i++) {
      const x=-.72+i*.145;
      box(scene,.055,2.36,.10,x,y+1.34,front-.135,wood,{name:'V06_WOOD_SLAT'});
    }
    box(scene,MASTER.house.width-.35,.025,.035,0,y+.03,front-1.73,warm,{name:'V06_BALCONY_LED',castShadow:false});
  }

  for (const y of [MASTER.socialY,MASTER.privateY]) {
    for(let i=0;i<28;i++){
      const x=-hw+.13+i*((MASTER.house.width-.26)/27);
      box(scene,.105,.025,1.68,x,y+.015,front-.90,wood,{name:'V06_DECK_BOARD',castShadow:false});
    }
  }

  box(scene,MASTER.house.width+.55,.11,.95,0,9.18,front-.42,steel,{name:'V06_CANOPY'});
  for(const side of [-1,1]) for(let i=0;i<10;i++){
    box(scene,.045,2.45,.38,side*(hw+.39),MASTER.privateY+.13,front+.12+i*.47,wood,{name:'V06_SIDE_BRISE'});
  }

  box(scene,2.08,2.30,.035,0,MASTER.socialY+1.36,front-.12,glass,{name:'V06_CENTRAL_GLASS_SOC'});
  box(scene,2.08,2.30,.035,0,MASTER.privateY+1.36,front-.12,glass,{name:'V06_CENTRAL_GLASS_PRIV'});
}

function sphereLamp(scene,x,y,z,material,r=.12){
  const m=new THREE.Mesh(new THREE.SphereGeometry(r,18,12),material);m.position.set(x,y,z);scene.add(m);return m;
}

function addInteriorDetail(scene) {
  const wood = new THREE.MeshStandardMaterial({color:0x8f5b35,roughness:.62});
  const fabric = new THREE.MeshStandardMaterial({color:0xc5b8a7,roughness:.96});
  const darkFabric = new THREE.MeshStandardMaterial({color:0x414744,roughness:.95});
  const black = new THREE.MeshStandardMaterial({color:0x151817,roughness:.45,metalness:.35});
  const white = new THREE.MeshStandardMaterial({color:0xf0ece4,roughness:.78});
  const warm = new THREE.MeshStandardMaterial({color:0xffc989,emissive:0xff9f4c,emissiveIntensity:2.8,roughness:.4});
  const HZ=MASTER.house.centerZ,sY=MASTER.socialY,pY=MASTER.privateY;

  box(scene,2.45,.018,1.55,1.10,sY+.035,HZ-.55,fabric,{name:'V06_RUG_SOCIAL',castShadow:false});
  box(scene,2.35,.018,1.35,-1.35,sY+.038,HZ-1.22,darkFabric,{name:'V06_RUG_DINING',castShadow:false});
  for (const x of [-2.18,-1.55,-.92]) {
    cyl(scene,.035,.035,.64,x,sY+2.48,HZ+.62,black,12);
    const shade=new THREE.Mesh(new THREE.ConeGeometry(.18,.24,24,1,true),black);shade.position.set(x,sY+2.10,HZ+.62);shade.rotation.x=Math.PI;scene.add(shade);
    const bulb=new THREE.PointLight(0xffb96d,42,3.2,2);bulb.position.set(x,sY+1.94,HZ+.62);scene.add(bulb);
  }
  box(scene,2.78,.62,.34,-2.00,sY+2.34,HZ+2.47,white,{name:'V06_UPPER_CABINET'});
  for(let i=0;i<5;i++) box(scene,.018,.56,.02,-3.04+i*.52,sY+2.34,HZ+2.285,black,{name:'V06_CABINET_GAP',castShadow:false});
  box(scene,2.08,1.58,.12,3.35,sY+1.12,HZ-.46,wood,{name:'V06_TV_WALL'});
  box(scene,1.70,.06,.30,3.12,sY+.42,HZ-.46,black,{name:'V06_TV_CONSOLE'});
  cyl(scene,.025,.025,1.48,2.70,sY+.74,HZ-1.52,black,12);
  sphereLamp(scene,2.70,sY+1.50,HZ-1.52,warm,.14);

  box(scene,1.95,1.05,.12,-2.10,pY+.92,HZ-.36,wood,{name:'V06_MASTER_HEADBOARD'});
  box(scene,1.92,2.28,.58,-2.20,pY+1.16,HZ+2.47,white,{name:'V06_MASTER_WARDROBE'});
  for(let i=0;i<3;i++) box(scene,.018,2.16,.02,-2.80+i*.62,pY+1.16,HZ+2.17,black,{name:'V06_WARDROBE_JOINT',castShadow:false});
  for(let i=0;i<3;i++){
    const x=-2.78+i*1.08;
    box(scene,.88,.46,.24,x,pY+1.72,HZ+2.73,wood,{name:'V06_KIDS_CUBBY'});
    sphereLamp(scene,x,pY+2.08,HZ+2.55,warm,.09);
  }
  box(scene,2.44,.055,.08,2.15,pY+.83,HZ-1.82,warm,{name:'V06_GAMER_LED',castShadow:false});
  box(scene,2.35,.018,1.20,2.15,pY+.03,HZ-1.18,darkFabric,{name:'V06_GAMER_RUG',castShadow:false});

  const warmPositions=[[-2.2,sY+2.25,HZ-.3],[1.5,sY+2.25,HZ-.2],[-2.2,pY+2.20,HZ-.4],[2.1,pY+2.20,HZ-.5]];
  warmPositions.forEach(([x,y,z])=>{const l=new THREE.PointLight(0xffb36a,58,5.2,2);l.position.set(x,y,z);scene.add(l);});
}

function addPondRealism(scene) {
  const bank = new THREE.MeshStandardMaterial({color:0x655946,roughness:1});
  const stone = new THREE.MeshStandardMaterial({color:0x77776f,roughness:.98});
  const reed = new THREE.MeshStandardMaterial({color:0x53763b,roughness:.92,side:THREE.DoubleSide});
  const waterLight = new THREE.MeshBasicMaterial({color:0xb8e3df,transparent:true,opacity:.14,depthWrite:false});
  const ponds=[{x:-2.73,z:-7.10,rx:1.48,rz:2.12},{x:-.55,z:-9.70,rx:.52,rz:1.02}];
  ponds.forEach((p,pi)=>{
    const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.075,10,64),bank);ring.rotation.x=Math.PI/2;ring.scale.set(p.rx*1.055,p.rz*1.055,1);ring.position.set(p.x,.035,p.z);scene.add(ring);
    const gloss=new THREE.Mesh(new THREE.CircleGeometry(1,64),waterLight);gloss.rotation.x=-Math.PI/2;gloss.scale.set(p.rx*.91,p.rz*.91,1);gloss.position.set(p.x,.072,p.z);scene.add(gloss);
    for(let i=0;i<(pi===0?38:18);i++){
      const a=(i/(pi===0?38:18))*Math.PI*2 + (i%3)*.027;
      const x=p.x+Math.cos(a)*p.rx*1.08,z=p.z+Math.sin(a)*p.rz*1.08;
      const s=.09+(i%5)*.014;
      const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),stone);rock.position.set(x,.075,z);rock.scale.set(1.35,.72,1.05);rock.rotation.set(i*.13,i*.31,i*.17);rock.castShadow=true;scene.add(rock);
    }
    const reedCount=pi===0?30:12;
    for(let i=0;i<reedCount;i++){
      const a=.7+i*.17;
      const x=p.x+Math.cos(a)*p.rx*.94,z=p.z+Math.sin(a)*p.rz*.94;
      const h=.28+(i%4)*.06;
      const blade=new THREE.Mesh(new THREE.ConeGeometry(.018,h,5),reed);blade.position.set(x,h/2+.06,z);blade.rotation.z=(i%3-1)*.10;scene.add(blade);
    }
  });
}

function addLandscapeDensity(scene) {
  const rnd=seededNoise(73455);
  const grassMat=new THREE.MeshStandardMaterial({color:0x436d3a,roughness:.96,side:THREE.DoubleSide});
  const bladeGeo=new THREE.ConeGeometry(.024,.28,4);
  const positions=[];
  for(let i=0;i<420;i++){
    let x,z;
    if(i<250){x=-4.55+rnd()*1.35;z=-11.7+rnd()*23.4;}
    else if(i<340){x=-3.9+rnd()*7.7;z=8.9+rnd()*2.8;}
    else {x=-3.9+rnd()*3.7;z=-11.6+rnd()*9.0;}
    if(x>=MASTER.drive.minX&&x<=MASTER.drive.maxX&&z>=MASTER.drive.minZ&&z<=MASTER.drive.maxZ) continue;
    positions.push([x,z,.65+rnd()*.85,rnd()*Math.PI]);
  }
  const inst=new THREE.InstancedMesh(bladeGeo,grassMat,positions.length);
  const dummy=new THREE.Object3D();
  positions.forEach((p,i)=>{dummy.position.set(p[0],.14,p[1]);dummy.scale.set(p[2],p[2],p[2]);dummy.rotation.y=p[3];dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix);});
  inst.castShadow=false;inst.receiveShadow=true;inst.name='V06_GRASS_DENSITY';scene.add(inst);

  const flowerMats=[0xc76d58,0xd9b55d,0xb26884].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.8}));
  const stemMat=new THREE.MeshStandardMaterial({color:0x47733b,roughness:.9});
  for(let i=0;i<42;i++){
    const x=-4.12+rnd()*.55,z=-10.5+rnd()*20.8;
    const stem=cyl(scene,.012,.014,.24,x,.12,z,stemMat,7);
    stem.rotation.z=(rnd()-.5)*.12;
    const flower=new THREE.Mesh(new THREE.SphereGeometry(.045,8,6),flowerMats[i%3]);flower.position.set(x,.27,z);scene.add(flower);
  }
}

function addGroundAndAccessDetail(scene) {
  const paver=new THREE.MeshStandardMaterial({color:0x858178,roughness:.93});
  const dark=new THREE.MeshStandardMaterial({color:0x252a28,roughness:.58,metalness:.62});
  for(let z=-12.05;z<=-2.60;z+=.72) box(scene,3.56,.008,.018,2.775,.045,z,dark,{name:'V06_DRIVE_JOINT',castShadow:false});
  for(const x of [1.02,1.90,2.78,3.66,4.53]) box(scene,.018,.008,9.32,x,.046,-7.32,dark,{name:'V06_DRIVE_LONG_JOINT',castShadow:false});
  box(scene,3.73,.035,.22,2.775,.035,-12.17,paver,{name:'V06_GATE_THRESHOLD',castShadow:false});
}

function addPerimeterLighting(scene) {
  const poleMat=new THREE.MeshStandardMaterial({color:0x1a1f1d,roughness:.42,metalness:.72});
  const glow=new THREE.MeshStandardMaterial({color:0xffd3a0,emissive:0xffa257,emissiveIntensity:2.6,roughness:.35});
  const points=[[-4.25,-11.1],[-4.25,-7.0],[-4.25,-2.8],[-4.25,2.2],[-4.25,7.0],[-4.25,10.8],[4.25,-1.0],[4.25,4.0],[4.25,8.5],[3.4,11.2],[-.2,11.2]];
  points.forEach(([x,z],i)=>{
    cyl(scene,.035,.045,.38,x,.19,z,poleMat,10);
    sphereLamp(scene,x,.43,z,glow,.07);
    if(i%2===0){const l=new THREE.PointLight(0xffb66a,15,2.1,2);l.position.set(x,.47,z);scene.add(l);}
  });
}

function installRuntimeQA(scene) {
  const forbidden=[];
  scene.traverse(o=>{
    const id=o.userData?.id||'';
    if (/LAGO|DECK-LAGO|PASSARELA-LAGO|FILTRO-BIO|POMAR|CANTEIRO|HORTA/.test(id)) forbidden.push(o);
  });
  const driveBox=new THREE.Box3(
    new THREE.Vector3(MASTER.drive.minX,-.5,MASTER.drive.minZ),
    new THREE.Vector3(MASTER.drive.maxX,3.0,MASTER.drive.maxZ),
  );
  const violations=[];
  forbidden.forEach(o=>{const b=new THREE.Box3().setFromObject(o);if(b.intersectsBox(driveBox))violations.push(o.userData?.id||o.name||'sem-id');});
  window.__CASA_QA__={
    version:'v0.6-realism-pass',
    checkedAt:new Date().toISOString(),
    driveEnvelope:{...MASTER.drive},
    violations,
    pass:violations.length===0,
  };
  if(violations.length) console.warn('[Casa Contreras QA] invasões no corredor veicular:',violations);
  else console.info('[Casa Contreras QA] corredor veicular livre.');
}

function updateHUD() {
  const topbar=document.getElementById('topbar');
  if(topbar) topbar.innerHTML=`<b>CASA CONTRERAS — TOUR 3D v0.6 REALISM</b><br><span class="muted">Implantação master preservada • materiais e paisagismo refinados • 10,00 × 25,00 m • casa 7,076 × 6,058 m<br>WASD • mouse • Shift • Espaço • clique feedback • 1/2/3 níveis</span>`;
  const note=document.querySelector('#start .note');
  if(note) note.textContent='Modelo conceitual navegável v0.6. Medidas master preservadas; estrutura, fundações, reforços e instalações ainda exigem validação profissional.';
}

export function installCasaContrerasV06({scene,camera,renderer}={}) {
  if(!scene){console.error('[Casa Contreras v0.6] cena não capturada; enhancements abortados.');return;}
  if(window.__CASA_V06_INSTALLED__) return;
  window.__CASA_V06_INSTALLED__=true;

  if(renderer){
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.04;
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  }
  scene.fog = new THREE.FogExp2(0xc8d2c6,.0075);
  scene.background = new THREE.Color(0xb8c9ca);

  improveExistingMaterials(scene,renderer);
  addSky(scene);
  addFacadeDetail(scene);
  addInteriorDetail(scene);
  addPondRealism(scene);
  addLandscapeDensity(scene);
  addGroundAndAccessDetail(scene);
  addPerimeterLighting(scene);
  installRuntimeQA(scene);
  updateHUD();

  const gloss=[];scene.traverse(o=>{if(o.material?.isMeshBasicMaterial&&o.material.transparent&&o.material.opacity===.14)gloss.push(o);});
  const t0=performance.now();
  function animateEnhancements(now){
    const t=(now-t0)/1000;
    gloss.forEach((g,i)=>{g.material.opacity=.11+.035*(.5+.5*Math.sin(t*.85+i));g.rotation.z=Math.sin(t*.11+i)*.012;});
    requestAnimationFrame(animateEnhancements);
  }
  requestAnimationFrame(animateEnhancements);

  if(camera) window.__CASA_CAMERA_V06__=camera;
  console.info('[Casa Contreras] v0.6 realism pass instalado.',window.__CASA_QA__);
}
