import * as THREE from 'three';

function byId(scene, id) {
  let hit = null;
  scene.traverse((o) => { if (!hit && o.userData?.id === id) hit = o; });
  return hit;
}

function normalize(scene, id, width, depth) {
  const o = byId(scene, id);
  if (!o) return;
  const b = new THREE.Box3().setFromObject(o);
  const s = new THREE.Vector3(); b.getSize(s);
  if (s.x) o.scale.x *= width / s.x;
  if (s.z) o.scale.z *= depth / s.z;
  o.updateMatrixWorld(true);
}

export function installNormalizeV08({ scene } = {}) {
  if (!scene || window.__CASA_NORMALIZE_V08__) return;
  window.__CASA_NORMALIZE_V08__ = true;
  normalize(scene, 'SOCIAL-SACADA', 7.076, 1.800);
  normalize(scene, 'INTIMO-SACADA', 7.076, 1.800);
}
