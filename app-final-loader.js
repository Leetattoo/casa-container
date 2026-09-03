import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

/**
 * CASA CONTRERAS — FINAL LOADER
 * Carrega a cena refinada, aplica o gate final e mantém a publicação estável
 * sem depender de GitHub Actions/CI.
 */

globalThis.__CASA_THREE__ = THREE;
globalThis.__CASA_POINTER_LOCK__ = PointerLockControls;

const SOURCES = [
  './app-v04.js?v=final-20260903',
  'https://raw.githubusercontent.com/Leetattoo/casa-container/main/app-v04.js?final=20260903'
];

async function loadSource() {
  let lastError;
  for (const url of SOURCES) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status} em ${url}`);
      return await response.text();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Nenhuma fonte da cena 3D pôde ser carregada.');
}

async function boot() {
  let source = await loadSource();

  // No Blob final, injetamos as referências já resolvidas pelo importmap.
  source = source
    .replace("import * as THREE from 'three';", 'const THREE = globalThis.__CASA_THREE__;')
    .replace("import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';", 'const PointerLockControls = globalThis.__CASA_POINTER_LOCK__;')
    // Correção crítica encontrada no gate final: propriedade de material do reservatório.
    .replace('mat=M.concrete,id:\'RESERVATORIO\'', 'mat:M.concrete,id:\'RESERVATORIO\'')
    // Identificação da release final no HUD e nos feedbacks.
    .replaceAll('TOUR 3D v0.4', 'TOUR 3D v0.5 FINAL')
    .replaceAll('Versão: v0.4', 'Versão: v0.5-final')
    .replaceAll('**Versão:** v0.4', '**Versão:** v0.5-final');

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
