import * as THREE from 'three';

export function installPerformanceV08({ scene, renderer } = {}) {
  if (!scene || !renderer || window.__CASA_PERF_V08__) return;
  window.__CASA_PERF_V08__ = true;

  const state = {
    mode: 'balanced',
    dpr: Math.min(window.devicePixelRatio || 1, 1.20),
    maxPointLights: 6,
    fps: 0,
    samples: [],
  };

  renderer.setPixelRatio(state.dpr);
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const pointLights = [];
  const directionals = [];
  scene.traverse((o) => {
    if (o.isPointLight) pointLights.push(o);
    if (o.isDirectionalLight) directionals.push(o);

    if (!o.isMesh || !o.material) return;
    const id = o.userData?.id || '';
    const category = o.userData?.category || '';
    const name = o.name || '';

    // MeshPhysical com transmission força passes caros. Para o walkthrough,
    // vidro e água continuam transparentes, mas sem múltiplas refrações por frame.
    const materials = Array.isArray(o.material) ? o.material : [o.material];
    materials.forEach((m) => {
      if (!m) return;
      if (m.isMeshPhysicalMaterial && (m.transmission || 0) > 0) {
        if (category === 'Água') {
          m.transmission = 0.04;
          m.opacity = Math.max(m.opacity ?? 0.8, 0.78);
          m.roughness = Math.max(m.roughness ?? 0.08, 0.08);
        } else {
          m.transmission = 0;
          m.transparent = true;
          m.opacity = Math.min(m.opacity ?? 0.42, 0.42);
          m.depthWrite = false;
          m.roughness = Math.max(m.roughness ?? 0.05, 0.09);
        }
        m.needsUpdate = true;
      }
    });

    const decorative = name.startsWith('V06_') || /CORR-|FERR-|CAD-|BANCO-|MONITOR-|PED-/.test(id);
    const vegetationChild = o.parent?.userData?.category === 'Pomar/Agrofloresta';
    if (decorative || vegetationChild) o.castShadow = false;
  });

  directionals.forEach((l) => {
    if (l.shadow) {
      l.shadow.mapSize.set(1024, 1024);
      l.shadow.bias = Math.min(l.shadow.bias || 0, -0.00015);
      if (l.shadow.map) l.shadow.map.dispose();
      l.shadow.map = null;
    }
  });

  pointLights.sort((a, b) => (b.intensity || 0) - (a.intensity || 0));
  pointLights.forEach((l, i) => {
    l.castShadow = false;
    l.visible = i < state.maxPointLights;
  });

  function applyMode(mode) {
    state.mode = mode;
    if (mode === 'high') {
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.45);
      state.maxPointLights = 9;
    } else {
      state.dpr = Math.min(window.devicePixelRatio || 1, 1.20);
      state.maxPointLights = 6;
    }
    renderer.setPixelRatio(state.dpr);
    pointLights.forEach((l, i) => { l.visible = i < state.maxPointLights; });
    window.__CASA_PERF__ = { ...state, pointLightsTotal: pointLights.length };
  }

  addEventListener('keydown', (e) => {
    if (e.code === 'KeyP') applyMode(state.mode === 'balanced' ? 'high' : 'balanced');
  });

  let last = performance.now();
  let frames = 0;
  function monitor(now) {
    frames++;
    const elapsed = now - last;
    if (elapsed >= 2000) {
      const fps = frames * 1000 / elapsed;
      state.fps = Math.round(fps);
      state.samples.push(state.fps);
      if (state.samples.length > 6) state.samples.shift();

      if (state.mode === 'balanced') {
        if (fps < 48 && state.dpr > 0.90) {
          state.dpr = Math.max(0.90, state.dpr - 0.10);
          renderer.setPixelRatio(state.dpr);
        } else if (fps > 58 && state.dpr < Math.min(window.devicePixelRatio || 1, 1.20)) {
          state.dpr = Math.min(Math.min(window.devicePixelRatio || 1, 1.20), state.dpr + 0.05);
          renderer.setPixelRatio(state.dpr);
        }
      }

      window.__CASA_PERF__ = {
        mode: state.mode,
        fps: state.fps,
        dpr: Math.round(state.dpr * 100) / 100,
        pointLightsVisible: pointLights.filter((l) => l.visible).length,
        pointLightsTotal: pointLights.length,
        shadowMap: 1024,
      };
      frames = 0;
      last = now;
    }
    requestAnimationFrame(monitor);
  }
  requestAnimationFrame(monitor);

  applyMode('balanced');
  console.info('[Casa Contreras] performance v0.8 instalada', window.__CASA_PERF__);
}
