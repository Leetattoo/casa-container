import * as THREE from 'three';
const HOUSE={d:6.058};
if(!window.__CASA_V14_SIDE_COLLISION__){
  window.__CASA_V14_SIDE_COLLISION__=true;
  const prev=THREE.Box3.prototype.intersectsBox;
  THREE.Box3.prototype.intersectsBox=function(b){
    const sx=b.max.x-b.min.x,sy=b.max.y-b.min.y,sz=b.max.z-b.min.z;
    const legacySideWall=Math.abs(sx-.12)<.03&&Math.abs(sy-2.82)<.05&&Math.abs(sz-HOUSE.d)<.06;
    if(legacySideWall)return false;
    return prev.call(this,b);
  };
}
