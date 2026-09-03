import * as THREE from 'three';

function byId(scene, id) {
  let hit = null;
  scene.traverse((o) => { if (!hit && o.userData?.id === id) hit = o; });
  return hit;
}
function byName(scene, name) { return scene.getObjectByName(name) || null; }
function move(o, x, z) {
  if (!o) return;
  if (Number.isFinite(x)) o.position.x = x;
  if (Number.isFinite(z)) o.position.z = z;
  o.updateMatrixWorld(true);
}

export function installInteriorFitV08({ scene, camera } = {}) {
  if (!scene || window.__CASA_INTERIOR_FIT_V08__) return;
  window.__CASA_INTERIOR_FIT_V08__ = true;

  // Térreo reconciliado: oficina / depósito / lavanderia.
  for (let i = 1; i <= 3; i++) move(byId(scene, `PRAT-DEP-${i}`), 0.55, 2.65);
  move(byId(scene, 'LAVADORA'), 1.98, 2.62);
  move(byId(scene, 'SECADORA'), 2.78, 2.62);
  move(byId(scene, 'BANCADA-LAV'), 2.46, 3.18);

  // Quarto dos três filhos: estudo fica todo do lado correto da nova divisória.
  move(byId(scene, 'BANCADA-FILHOS'), -1.72, 1.08);
  for (let i = 1; i <= 3; i++) move(byId(scene, `CAD-FILHO-${i}`), -2.72 + (i - 1) * 0.90, 1.55);

  // Guarda-roupa do casal estava no quadrante dos filhos no passe de realismo.
  const wardrobe = byName(scene, 'V06_MASTER_WARDROBE');
  if (wardrobe) {
    wardrobe.rotation.y = Math.PI / 2;
    wardrobe.scale.z *= 0.50 / 0.58;
    wardrobe.position.x = -3.14;
    wardrobe.position.z = -0.72;
    wardrobe.updateMatrixWorld(true);
  }

  // Parede leste nova do banheiro íntimo foi criada depois do sistema legado
  // de colisões. Este guard adiciona colisão somente para ela.
  const bathEast = byId(scene, 'BAN-INT-E-V08');
  if (bathEast && camera) {
    let lastSafe = camera.position.clone();
    const collider = new THREE.Box3();
    const body = new THREE.Box3();
    const r = 0.27;
    function guard() {
      collider.setFromObject(bathEast);
      body.min.set(camera.position.x - r, camera.position.y - 1.66, camera.position.z - r);
      body.max.set(camera.position.x + r, camera.position.y + 0.09, camera.position.z + r);
      const onPrivate = camera.position.y > 7.45 && camera.position.y < 8.40;
      if (onPrivate && body.intersectsBox(collider)) {
        camera.position.x = lastSafe.x;
        camera.position.z = lastSafe.z;
      } else {
        lastSafe.copy(camera.position);
      }
      requestAnimationFrame(guard);
    }
    requestAnimationFrame(guard);
  }

  window.__CASA_INTERIOR_FIT__ = { version: 'v0.8', furnitureRefit: true, privateBathCustomCollision: Boolean(bathEast) };
}
