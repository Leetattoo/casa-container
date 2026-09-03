export function installShadowBudgetV08({ scene, renderer } = {}) {
  if (!scene || !renderer || window.__CASA_SHADOW_BUDGET_V08__) return;
  window.__CASA_SHADOW_BUDGET_V08__ = true;

  let kept = 0;
  let disabled = 0;
  scene.traverse((o) => {
    if (!o.isMesh) return;
    const id = o.userData?.id || '';
    const cat = o.userData?.category || '';
    const keep =
      cat === 'Estrutura' ||
      cat === 'Fachada' ||
      /^(SOCIAL|INTIMO)-(O|L|F|B)/.test(id) ||
      /PISO-|COBERTURA|PILAR|SACADA|PORTAO|CARRO-REF|MURO-/.test(id);

    if (keep) {
      o.castShadow = true;
      kept++;
    } else if (o.castShadow) {
      o.castShadow = false;
      disabled++;
    }
  });

  // DPR 1.0 é o ponto de partida. O monitor adaptativo do módulo principal
  // sobe até 1.2 se houver folga real de FPS.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.0));
  window.__CASA_SHADOW_BUDGET__ = { kept, disabled, initialDpr: Math.min(window.devicePixelRatio || 1, 1.0) };
  console.info('[Casa Contreras] shadow budget v0.8', window.__CASA_SHADOW_BUDGET__);
}
