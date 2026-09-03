import * as THREE from 'three';

const M = Object.freeze({
  houseW: 7.076,
  houseD: 6.058,
  centerZ: 0.700,
  shellT: 0.120,
  partitionT: 0.100,
});

function byId(scene, id) {
  let hit = null;
  scene.traverse((o) => { if (!hit && o.userData?.id === id) hit = o; });
  return hit;
}

function sizeOf(o) {
  const b = new THREE.Box3().setFromObject(o);
  const s = new THREE.Vector3();
  b.getSize(s);
  return s;
}

function resizeWorld(o, target = {}) {
  if (!o) return;
  const s = sizeOf(o);
  if (target.x && s.x) o.scale.x *= target.x / s.x;
  if (target.y && s.y) o.scale.y *= target.y / s.y;
  if (target.z && s.z) o.scale.z *= target.z / s.z;
  o.updateMatrixWorld(true);
}

function move(o, x, y, z) {
  if (!o) return;
  if (Number.isFinite(x)) o.position.x = x;
  if (Number.isFinite(y)) o.position.y = y;
  if (Number.isFinite(z)) o.position.z = z;
  o.updateMatrixWorld(true);
}

function cloneWall(scene, source, { id, label, x, y, z, w, h, d }) {
  if (!source?.material) return null;
  const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), source.material);
  wall.position.set(x, y, z);
  wall.castShadow = true;
  wall.receiveShadow = true;
  wall.userData = { id, label, category: 'Parede', dimensionReconciled: true };
  scene.add(wall);
  return wall;
}

export function installLayoutV08({ scene } = {}) {
  if (!scene || window.__CASA_LAYOUT_V08__) return;
  window.__CASA_LAYOUT_V08__ = true;

  const halfW = M.houseW / 2;
  const halfD = M.houseD / 2;
  const westInner = -halfW + M.shellT;
  const eastInner = halfW - M.shellT;
  const frontInner = M.centerZ - halfD + M.shellT;
  const backInner = M.centerZ + halfD - M.shellT;

  // TÉRREO — a prancha nominal soma 7,20 m numa largura externa de 7,076 m.
  // Mantemos a proporção 3,20:2,00:2,00 e reconciliamos para o vão interno real.
  const available = (eastInner - westInner) - 2 * M.partitionT;
  const factor = available / 7.20;
  const groundWidths = {
    workshop: 3.20 * factor,
    storage: 2.00 * factor,
    laundry: 2.00 * factor,
    depth: 2.60,
  };
  const div1Left = westInner + groundWidths.workshop;
  const div1Center = div1Left + M.partitionT / 2;
  const div2Left = div1Left + M.partitionT + groundWidths.storage;
  const div2Center = div2Left + M.partitionT / 2;
  const serviceFront = backInner - groundWidths.depth;
  const serviceCenterZ = (serviceFront + backInner) / 2;

  const ter1 = byId(scene, 'TER-DIV-1');
  const ter2 = byId(scene, 'TER-DIV-2');
  resizeWorld(ter1, { x: M.partitionT, z: groundWidths.depth });
  resizeWorld(ter2, { x: M.partitionT, z: groundWidths.depth });
  move(ter1, div1Center, undefined, serviceCenterZ);
  move(ter2, div2Center, undefined, serviceCenterZ);

  // SOCIAL — banheiro passa a ter 1,60 x 2,20 m livres de verdade.
  const socialBathW = 1.60;
  const socialBathD = 2.20;
  const socialWestInnerFace = eastInner - socialBathW;
  const socialWestWallX = socialWestInnerFace - M.partitionT / 2;
  const socialFrontInnerFace = backInner - socialBathD;
  const socialFrontWallZ = socialFrontInnerFace - M.partitionT / 2;
  const socialWallDepth = socialBathD + M.partitionT;
  const socialWallWidth = socialBathW + M.partitionT;

  const banSocO = byId(scene, 'BAN-SOC-O');
  const banSocF = byId(scene, 'BAN-SOC-F');
  resizeWorld(banSocO, { x: M.partitionT, z: socialWallDepth });
  move(banSocO, socialWestWallX, undefined, (socialFrontWallZ + backInner + M.partitionT / 2) / 2);
  resizeWorld(banSocF, { x: socialWallWidth, z: M.partitionT });
  move(banSocF, (socialWestWallX + eastInner) / 2, undefined, socialFrontWallZ);

  move(byId(scene, 'BAN-SOC-VASO'), 2.18, undefined, 3.05);
  move(byId(scene, 'BAN-SOC-PIA'), 2.92, undefined, 3.10);
  move(byId(scene, 'BAN-SOC-BOX'), 2.95, undefined, 1.72);

  // ÍNTIMO — os quartos continuam empilhados à esquerda como na prancha.
  // A largura fica 3,40 m exatos; a profundidade possível é 2,859 m cada,
  // pois 3,40 + 3,40 de profundidade não cabe dentro de 6,058 m externos.
  const axis = byId(scene, 'INT-DIV-EIXO');
  const roomSplit = byId(scene, 'INT-DIV-QUARTOS');
  const axisX = westInner + 3.40 + M.partitionT / 2;
  resizeWorld(axis, { x: M.partitionT, z: backInner - frontInner });
  move(axis, axisX, undefined, M.centerZ);
  resizeWorld(roomSplit, { x: 3.40 + M.partitionT, z: M.partitionT });
  move(roomSplit, westInner + (3.40 + M.partitionT) / 2, undefined, M.centerZ);

  const axisRightFace = axisX + M.partitionT / 2;
  const privateBathW = 1.60;
  const privateBathD = 2.20;
  const privateEastWallLeftFace = axisRightFace + privateBathW;
  const privateEastWallX = privateEastWallLeftFace + M.partitionT / 2;
  const privateFrontInnerFace = backInner - privateBathD;
  const privateFrontWallZ = privateFrontInnerFace - M.partitionT / 2;

  const banIntF = byId(scene, 'BAN-INT-F');
  resizeWorld(banIntF, { x: privateBathW + M.partitionT, z: M.partitionT });
  move(banIntF, axisRightFace + privateBathW / 2, undefined, privateFrontWallZ);

  let banIntE = byId(scene, 'BAN-INT-E-V08');
  if (!banIntE) {
    banIntE = cloneWall(scene, banIntF, {
      id: 'BAN-INT-E-V08',
      label: 'Banheiro superior parede leste reconciliada',
      x: privateEastWallX,
      y: 6.25 + 1.34,
      z: (privateFrontWallZ + backInner + M.partitionT / 2) / 2,
      w: M.partitionT,
      h: 2.68,
      d: privateBathD + M.partitionT,
    });
  }

  move(byId(scene, 'BAN-INT-VASO'), 0.48, undefined, 3.05);
  move(byId(scene, 'BAN-INT-PIA'), 0.52, undefined, 1.72);
  const tub = byId(scene, 'BANHEIRA');
  resizeWorld(tub, { x: 0.72, z: 1.30 });
  move(tub, 1.28, undefined, 2.38);

  // Gamer: a zona útil alvo permanece 2,20 x 2,40 m no quadrante inferior direito.
  const gamerDesk = byId(scene, 'MESA-GAMER');
  resizeWorld(gamerDesk, { x: 2.00, z: 0.62 });
  move(gamerDesk, 2.18, undefined, -0.78);

  const innerDepth = backInner - frontInner;
  const bedroomDepth = (innerDepth - M.partitionT) / 2;
  const gourmetDepth = serviceFront - frontInner;

  window.__CASA_LAYOUT_RECONCILED__ = {
    version: 'v0.8-layout-reconciled',
    envelope: { width: M.houseW, depth: M.houseD },
    ground: {
      workshop: [groundWidths.workshop, 2.60],
      storage: [groundWidths.storage, 2.60],
      laundry: [groundWidths.laundry, 2.60],
      gourmetClearApprox: [eastInner - westInner, gourmetDepth],
      sourceNote: 'larguras 3,20/2,00/2,00 foram reduzidas proporcionalmente porque somavam 7,20 m dentro de envelope externo 7,076 m',
    },
    social: { bathroom: [1.60, 2.20], openPlan: true },
    private: {
      children: [3.40, bedroomDepth],
      master: [3.40, bedroomDepth],
      bathroom: [1.60, 2.20],
      gamerTarget: [2.20, 2.40],
    },
  };
  console.info('[Casa Contreras] layout v0.8 reconciliado', window.__CASA_LAYOUT_RECONCILED__);
}
