export function installShadowBudgetV08({ scene } = {}) {
  if (!scene || window.__CASA_SHADOW_BUDGET_V08__) return;
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

  window.__CASA_SHADOW_BUDGET__ = { kept, disabled };
  console.info('[Casa Contreras] shadow budget v0.8', window.__CASA_SHADOW_BUDGET__);
}
