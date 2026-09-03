import * as THREE from 'three';

// Captura referências internas do app legado sem alterar sua API pública.
if (!window.__CASA_PATCHED__) {
  window.__CASA_PATCHED__ = true;

  const addOriginal = THREE.Object3D.prototype.add;
  THREE.Object3D.prototype.add = function (...objects) {
    if (this?.isScene && !window.__CASA_SCENE__) window.__CASA_SCENE__ = this;
    return addOriginal.apply(this, objects);
  };

  const updateProjectionOriginal = THREE.PerspectiveCamera.prototype.updateProjectionMatrix;
  THREE.PerspectiveCamera.prototype.updateProjectionMatrix = function (...args) {
    if (!window.__CASA_CAMERA__) window.__CASA_CAMERA__ = this;
    return updateProjectionOriginal.apply(this, args);
  };

  const setSizeOriginal = THREE.WebGLRenderer.prototype.setSize;
  THREE.WebGLRenderer.prototype.setSize = function (...args) {
    if (!window.__CASA_RENDERER__) window.__CASA_RENDERER__ = this;
    return setSizeOriginal.apply(this, args);
  };
}
