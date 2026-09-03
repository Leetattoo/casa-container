const scene=window.__CASA_SCENE__;
if(!scene) throw new Error('Casa Contreras v1.6 finalize: cena indisponível');
function byId(id){let h=null;scene.traverse(o=>{if(!h&&o.userData?.id===id)h=o;});return h;}
const deck=byId('DECK-LAGO-V15');if(deck)deck.position.set(0,0,0);
const lounge=byId('LOUNGE-LAGO-V16');if(lounge)lounge.position.x=.16;
window.__CASA_V16_FINALIZE__={deckReset:!!deck,loungeDryZone:!!lounge};
console.info('[Casa Contreras] v1.6 finalize',window.__CASA_V16_FINALIZE__);
