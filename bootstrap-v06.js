import './prelude-v06.js';
await import('./app-final.js?v=20260903-final');
const { installCasaContrerasV06 } = await import('./enhancements-v06.js?v=20260903-v06');
installCasaContrerasV06({
  scene: window.__CASA_SCENE__,
  camera: window.__CASA_CAMERA__,
  renderer: window.__CASA_RENDERER__,
});
