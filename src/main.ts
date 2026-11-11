import * as THREE from 'three';
export * from './types/kinematics';
export * from './engine/kinematics';
export * from './data/techniques';
export * from './engine/combos';
export * from './drill/coach';
export * from './engine/arena';
export * from './engine/rig';

import { BASE_TECHNIQUES, COMBO_DEFS } from './data/techniques';
import { compileAllTechniques } from './engine/combos';

export const ALL_TECHNIQUES = compileAllTechniques(BASE_TECHNIQUES, COMBO_DEFS);
export const version = THREE.REVISION;

console.log(`Cagecraft 3D initialized: Three.js v${version}, ${ALL_TECHNIQUES.length} techniques loaded.`);
