import * as THREE from 'three';

// Captura referencias internas do app e aplica calibracoes de escala humana
// antes da cena principal ser criada.
if (!window.__CASA_PATCHED__) {
  window.__CASA_PATCHED__ = true;

  const HUMAN = Object.freeze({
    height: 1.75,
    eyeHeight: 1.66,
    shoulderRadius: 0.27,
    architecturalFov: 60,
  });
  window.__CASA_HUMAN_SCALE__ = HUMAN;

  const addOriginal = THREE.Object3D.prototype.add;
  THREE.Object3D.prototype.add = function (...objects) {
    if (this?.isScene && !window.__CASA_SCENE__) window.__CASA_SCENE__ = this;
    return addOriginal.apply(this, objects);
  };

  const updateProjectionOriginal = THREE.PerspectiveCamera.prototype.updateProjectionMatrix;
  THREE.PerspectiveCamera.prototype.updateProjectionMatrix = function (...args) {
    if (!window.__CASA_CAMERA__) window.__CASA_CAMERA__ = this;
    // 70 graus verticais distorcia a percepcao arquitetonica em monitor 16:9.
    // 60 graus mantem um campo amplo, mas com escala espacial mais natural.
    if (this.isPerspectiveCamera && this.fov > HUMAN.architecturalFov) {
      this.fov = HUMAN.architecturalFov;
    }
    return updateProjectionOriginal.apply(this, args);
  };

  const setSizeOriginal = THREE.WebGLRenderer.prototype.setSize;
  THREE.WebGLRenderer.prototype.setSize = function (...args) {
    if (!window.__CASA_RENDERER__) window.__CASA_RENDERER__ = this;
    return setSizeOriginal.apply(this, args);
  };

  // O app legado cria um proxy de colisao com 0,54 x 1,80 x 0,54 m,
  // deslocado 11 cm acima do piso. Corrigimos apenas esse proxy para um
  // adulto de 1,75 m, com olhos a 1,66 m, sem afetar outras Box3 da cena.
  const intersectsOriginal = THREE.Box3.prototype.intersectsBox;
  THREE.Box3.prototype.intersectsBox = function (box) {
    const sx = this.max.x - this.min.x;
    const sy = this.max.y - this.min.y;
    const sz = this.max.z - this.min.z;
    const isPlayerProxy = Math.abs(sx - 0.54) < 0.015 && Math.abs(sz - 0.54) < 0.015 && Math.abs(sy - 1.80) < 0.02;
    if (!isPlayerProxy) return intersectsOriginal.call(this, box);

    const minY = this.min.y - 0.11;
    const maxY = this.max.y - 0.16;
    return !(
      box.max.x < this.min.x || box.min.x > this.max.x ||
      box.max.y < minY || box.min.y > maxY ||
      box.max.z < this.min.z || box.min.z > this.max.z
    );
  };
}
