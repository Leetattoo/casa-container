import './prelude-v06.js?v=20260903-scale-v07';
await import('./app-final.js?v=20260903-final');

const scene = window.__CASA_SCENE__;
const camera = window.__CASA_CAMERA__;
const renderer = window.__CASA_RENDERER__;

const { installCasaContrerasV06 } = await import('./enhancements-v06.js?v=20260903-v06');
installCasaContrerasV06({ scene, camera, renderer });

const { installLayoutV08 } = await import('./layout-v08.js?v=20260903-v08');
installLayoutV08({ scene });

const { installNormalizeV08 } = await import('./normalize-v08.js?v=20260903-v08');
installNormalizeV08({ scene });

const { installPerformanceV08 } = await import('./performance-v08.js?v=20260903-v08');
installPerformanceV08({ scene, renderer });

const { installShadowBudgetV08 } = await import('./shadow-budget-v08.js?v=20260903-v08');
installShadowBudgetV08({ scene, renderer });

const { installDimensionAuditV08 } = await import('./dimension-audit-v08.js?v=20260903-v08');
installDimensionAuditV08({ scene, camera });

const { installFeedbackV08 } = await import('./feedback-v08.js?v=20260903-v08');
installFeedbackV08();
