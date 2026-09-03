import * as THREE from 'three';

const MASTER = Object.freeze({
  lot: [10.000, 25.000],
  house: [7.076, 6.058],
  centralGap: 2.200,
  balcony: [7.076, 1.800],
  driveway: [3.850, 9.970],
  socialY: 3.250,
  privateY: 6.250,
  human: { height: 1.750, eyeHeight: 1.660, fov: 60 },
});

const TOL = 0.012;
const close = (a, b, tol = TOL) => Math.abs(a - b) <= tol;
const r = (v) => Math.round(v * 1000) / 1000;

function byId(scene, id) {
  let hit = null;
  scene.traverse((o) => { if (!hit && o.userData?.id === id) hit = o; });
  return hit;
}
function bounds(o) {
  if (!o) return null;
  const b = new THREE.Box3().setFromObject(o);
  const s = new THREE.Vector3(); b.getSize(s);
  return { b, x: s.x, y: s.y, z: s.z };
}
function check(name, actual, expected, tol = TOL) {
  return { name, actual: r(actual), expected: r(expected), delta: r(actual - expected), pass: close(actual, expected, tol) };
}

function roomDimensions(scene) {
  const halfW = MASTER.house[0] / 2;
  const halfD = MASTER.house[1] / 2;
  const shellT = .12;
  const eastInner = halfW - shellT;
  const westInner = -halfW + shellT;
  const frontInner = .70 - halfD + shellT;
  const backInner = .70 + halfD - shellT;

  const socWest = bounds(byId(scene, 'BAN-SOC-O'));
  const socFront = bounds(byId(scene, 'BAN-SOC-F'));
  const axis = bounds(byId(scene, 'INT-DIV-EIXO'));
  const split = bounds(byId(scene, 'INT-DIV-QUARTOS'));
  const privFront = bounds(byId(scene, 'BAN-INT-F'));
  const privEast = bounds(byId(scene, 'BAN-INT-E-V08'));

  const out = {};
  if (socWest && socFront) out.socialBathroom = [eastInner - socWest.b.max.x, backInner - socFront.b.max.z];
  if (axis && split) {
    const bedroomW = axis.b.min.x - westInner;
    out.children = [bedroomW, backInner - split.b.max.z];
    out.master = [bedroomW, split.b.min.z - frontInner];
  }
  if (axis && privFront && privEast) out.privateBathroom = [privEast.b.min.x - axis.b.max.x, backInner - privFront.b.max.z];
  return out;
}

function addHumanGauge(scene) {
  if (scene.getObjectByName('V08_HUMAN_GAUGE')) return;
  const g = new THREE.Group(); g.name = 'V08_HUMAN_GAUGE'; g.visible = false;
  const mat = new THREE.MeshStandardMaterial({ color: 0xd9c18c, roughness: .75 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1a1f1d, roughness: .5, metalness: .4 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.14, .18, 1.12, 12), dark); body.position.y = .88; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.105, 16, 12), mat); head.position.y = 1.645; g.add(head);
  const gauge = new THREE.Mesh(new THREE.BoxGeometry(.025, 1.75, .025), mat); gauge.position.set(.34, .875, 0); g.add(gauge);
  for (const y of [0, .5, 1, 1.5, 1.75]) {
    const tick = new THREE.Mesh(new THREE.BoxGeometry(.18, .015, .025), mat); tick.position.set(.40, y, 0); g.add(tick);
  }
  g.position.set(-3.82, .01, -3.0); scene.add(g);
  addEventListener('keydown', (e) => { if (e.code === 'KeyH') g.visible = !g.visible; });
}

export function installDimensionAuditV08({ scene, camera } = {}) {
  if (!scene || window.__CASA_DIM_V08__) return;
  window.__CASA_DIM_V08__ = true;
  addHumanGauge(scene);

  const lot = bounds(byId(scene, 'LOT-10X25'));
  const social = bounds(byId(scene, 'PISO-SOCIAL'));
  const priv = bounds(byId(scene, 'PISO-INTIMO'));
  const gapS = bounds(byId(scene, 'VAO-CENTRAL-SOCIAL'));
  const gapP = bounds(byId(scene, 'VAO-CENTRAL-INTIMO'));
  const balS = bounds(byId(scene, 'SOCIAL-SACADA'));
  const balP = bounds(byId(scene, 'INTIMO-SACADA'));
  const drive = bounds(byId(scene, 'DRIVEWAY'));
  const rooms = roomDimensions(scene);

  const checks = [];
  if (lot) checks.push(check('terreno largura', lot.x, 10), check('terreno comprimento', lot.z, 25));
  if (social) checks.push(check('2º pavimento largura', social.x, 7.076), check('2º pavimento profundidade', social.z, 6.058), check('2º pavimento cota', social.b.max.y, 3.25));
  if (priv) checks.push(check('3º pavimento largura', priv.x, 7.076), check('3º pavimento profundidade', priv.z, 6.058), check('3º pavimento cota', priv.b.max.y, 6.25));
  if (social && priv) checks.push(check('2º=3º largura', social.x, priv.x), check('2º=3º profundidade', social.z, priv.z));
  if (gapS) checks.push(check('vão central social', gapS.x, 2.20));
  if (gapP) checks.push(check('vão central íntimo', gapP.x, 2.20));
  if (balS) checks.push(check('sacada social largura', balS.x, 7.076), check('sacada social profundidade', balS.z, 1.80));
  if (balP) checks.push(check('sacada íntima largura', balP.x, 7.076), check('sacada íntima profundidade', balP.z, 1.80));
  if (drive) checks.push(check('corredor largura', drive.x, 3.85), check('corredor comprimento', drive.z, 9.97));
  if (camera) checks.push(check('FOV', camera.fov, 60, .05));

  const roomChecks = [];
  if (rooms.socialBathroom) roomChecks.push(check('banheiro social largura', rooms.socialBathroom[0], 1.60, .02), check('banheiro social profundidade', rooms.socialBathroom[1], 2.20, .02));
  if (rooms.privateBathroom) roomChecks.push(check('banheiro íntimo largura', rooms.privateBathroom[0], 1.60, .02), check('banheiro íntimo profundidade', rooms.privateBathroom[1], 2.20, .02));
  if (rooms.children) roomChecks.push(check('quarto 3 filhos largura', rooms.children[0], 3.40, .02), check('quarto 3 filhos profundidade reconciliada', rooms.children[1], 2.859, .02));
  if (rooms.master) roomChecks.push(check('quarto casal largura', rooms.master[0], 3.40, .02), check('quarto casal profundidade reconciliada', rooms.master[1], 2.859, .02));

  const hardPass = checks.every((c) => c.pass);
  const roomsPass = roomChecks.every((c) => c.pass);
  const report = {
    version: 'v0.8-dimensional-reconciliation',
    unit: '1 unidade Three.js = 1 metro',
    master: MASTER,
    checks,
    roomChecks,
    layout: window.__CASA_LAYOUT_RECONCILED__ || null,
    hardGeometryPass: hardPass,
    reconciledRoomsPass: roomsPass,
    overallPass: hardPass && roomsPass,
    note: 'Cotas impossíveis da prancha ilustrativa foram reconciliadas sem alterar o envelope 7,076 x 6,058 m. Os quartos empilhados ficam 3,40 x 2,859 m, preservando a posição visual da referência.',
  };
  window.__CASA_DIMENSION_QA__ = report;
  console.table(checks);
  console.table(roomChecks);
  console.info('[Casa Contreras] QA dimensional v0.8', report);

  const top = document.getElementById('topbar');
  if (top) top.innerHTML = `<b>CASA CONTRERAS — v0.8 OTIMIZADA + COTAS RECONCILIADAS</b><br><span class="muted">1 unidade = 1 m • pessoa 1,75 m • olhos 1,66 m • FOV 60° • 2º e 3º: 7,076 × 6,058 m<br>H escala humana • P qualidade • WASD • mouse • clique feedback</span>`;
}
