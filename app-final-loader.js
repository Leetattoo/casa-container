import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

/**
 * CASA CONTRERAS — FINAL LOADER
 * Carrega a cena refinada v0.4/v0.5, aplica a correção crítica identificada
 * na revisão final e mantém a build publicada estável sem depender de CI.
 */

globalThis.__CASA_THREE__ = THREE;
globalThis.__CASA_POINTER_LOCK__ = PointerLockControls;

async function boot() {
  const response = await fetch('./app-v04.js?v=final-20260903', { cache: 'no-store' });
  if (!response.ok) throw new Error(`Falha ao carregar cena 3D: HTTP ${response.status}`);

  let source = await response.text();

  // O módulo original importa Three diretamente. No Blob final, injetamos as
  // referências já resolvidas pelo importmap do documento para máxima robustez.
  source = source
    .replace("import * as THREE from 'three';", 'const THREE = globalThis.__CASA_THREE__;')
    .replace("import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';", 'const PointerLockControls = globalThis.__CASA_POINTER_LOCK__;')
    // Correção crítica encontrada no gate final: propriedade de material do reservatório.
    .replace('mat=M.concrete,id:\'RESERVATORIO\'', 'mat:M.concrete,id:\'RESERVATORIO\'')
    // Identificação da release final no HUD e nos feedbacks.
    .replaceAll('TOUR 3D v0.4', 'TOUR 3D v0.5 FINAL')
    .replaceAll('Versão: v0.4', 'Versão: v0.5-final')
    .replaceAll('**Versão:** v0.4', '**Versão:** v0.5-final');

  // Falha explícita se a correção esperada não tiver sido aplicada.
  if (source.includes("mat=M.concrete,id:'RESERVATORIO'")) {
    throw new Error('Gate final falhou: correção do reservatório não aplicada.');
  }

  const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
  try {
    await import(url);
    globalThis.__CASA_BUILD__ = 'v0.5-final';
  } finally {
    URL.revokeObjectURL(url);
  }
}

boot().catch((error) => {
  console.error('[Casa Contreras] Falha na inicialização final:', error);
  const start = document.getElementById('start');
  const card = start?.querySelector('.card');
  if (card) {
    card.innerHTML = `
      <p class="eyebrow">CASA CONTRERAS • ERRO DE INICIALIZAÇÃO</p>
      <h1>O modelo 3D não iniciou.</h1>
      <p>Recarregue a página. Se persistir, registre este erro no projeto:</p>
      <div class="meta">${String(error?.message || error)}</div>
    `;
  }
});
