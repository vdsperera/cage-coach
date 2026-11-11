/**
 * Procedural Humanoid Clay Rigging & Emissive Focus System for Cagecraft 3D
 * Enforces Invariant AP-002 (Euler YXZ Conventions for Shoulders & Hips)
 */

import * as THREE from 'three';
import type {
  Pose,
  JointIdentifier,
  AnatomicalMarker,
  JointRotationOrder,
} from '../types/kinematics';
import { D, JOINTS } from './kinematics';

export interface FighterOptions {
  skin: number;
  accent: number;
  ghost?: boolean;
}

export interface FighterRig {
  holder: THREE.Group;
  root: THREE.Group;
  joints: Record<JointIdentifier, THREE.Group>;
  points: Record<AnatomicalMarker, THREE.Group>;
  jointMeshes: Record<JointIdentifier, THREE.Mesh[]>;
  label?: THREE.Object3D | null;
}

export const FIGHTER_A_CONFIG: FighterOptions = {
  skin: 0xb9a898,
  accent: 0xd9442f,
};

export const FIGHTER_B_CONFIG: FighterOptions = {
  skin: 0x9ca5b2,
  accent: 0x3f7fd6,
};

export const GHOST_CONFIG: FighterOptions = {
  skin: 0xe8a090,
  accent: 0xd9442f,
  ghost: true,
};

/**
 * Constructs a procedural humanoid clay mesh rig with 15 articulated joints
 * and anatomical landmark markers.
 */
export function makeFighter({ skin, accent, ghost = false }: FighterOptions): FighterRig {
  const opts: THREE.MeshStandardMaterialParameters = ghost
    ? { transparent: true, opacity: 0.22, depthWrite: false }
    : {};

  const skinMat = new THREE.MeshStandardMaterial({
    color: skin,
    roughness: 0.85,
    ...opts,
  });

  const accMat = new THREE.MeshStandardMaterial({
    color: accent,
    roughness: 0.55,
    ...opts,
  });

  const joints = {} as Record<JointIdentifier, THREE.Group>;
  const points = {} as Record<AnatomicalMarker, THREE.Group>;
  const jointMeshes = {} as Record<JointIdentifier, THREE.Mesh[]>;

  const createMesh = (geometry: THREE.BufferGeometry, material: THREE.Material): THREE.Mesh => {
    const obj = new THREE.Mesh(geometry, material);
    if (!ghost) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
    return obj;
  };

  const createLimb = (
    parent: THREE.Group,
    len: number,
    r0: number,
    r1: number,
    mat: THREE.Material
  ): void => {
    const seg = createMesh(new THREE.CylinderGeometry(r1, r0, len, 14), mat);
    seg.position.y = -len / 2;
    parent.add(seg);

    const cap = createMesh(new THREE.SphereGeometry(r1 * 1.02, 14, 10), mat);
    parent.add(cap);
  };

  const createJoint = (
    parent: THREE.Group,
    name: JointIdentifier,
    x: number,
    y: number,
    z: number,
    order?: JointRotationOrder
  ): THREE.Group => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    if (order) {
      g.rotation.order = order;
    }
    parent.add(g);
    joints[name] = g;
    return g;
  };

  const createMarker = (
    parent: THREE.Group,
    name: AnatomicalMarker,
    y: number,
    z: number = 0
  ): THREE.Group => {
    const g = new THREE.Group();
    g.position.set(0, y, z);
    parent.add(g);
    points[name] = g;
    return g;
  };

  const holder = new THREE.Group();
  const root = new THREE.Group();
  root.position.y = 0.97;
  holder.add(root);
  joints.root = root;

  // Pelvis
  const pelvis = createMesh(new THREE.CylinderGeometry(0.17, 0.19, 0.22, 18), accMat);
  pelvis.position.y = -0.04;
  root.add(pelvis);
  createMarker(root, 'hips', 0);

  // Spine & Torso
  const spine = createJoint(root, 'spine', 0, 0.08, 0, 'XYZ');
  const chest = createMesh(new THREE.CylinderGeometry(0.21, 0.165, 0.46, 18), skinMat);
  chest.position.y = 0.25;
  spine.add(chest);

  const traps = createMesh(new THREE.SphereGeometry(0.2, 18, 12), skinMat);
  traps.scale.set(1.25, 0.5, 0.8);
  traps.position.y = 0.46;
  spine.add(traps);

  const neck = createMesh(new THREE.CylinderGeometry(0.06, 0.07, 0.12, 12), skinMat);
  neck.position.y = 0.53;
  spine.add(neck);

  createMarker(spine, 'chest', 0.3);
  createMarker(spine, 'neck', 0.52);

  // Head & Face
  const head = createJoint(spine, 'head', 0, 0.56, 0, 'XYZ');
  const skull = createMesh(new THREE.SphereGeometry(0.125, 20, 16), skinMat);
  skull.scale.set(0.92, 1.08, 1);
  skull.position.y = 0.12;
  head.add(skull);

  const nose = createMesh(new THREE.ConeGeometry(0.02, 0.05, 8), skinMat);
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 0.1, 0.125);
  head.add(nose);

  createMarker(head, 'head', 0.12);
  createMarker(head, 'eyes', 0.14, 0.08);

  // Arms: Multiaxial YXZ Shoulder + Planar XYZ Elbow/Wrist
  const buildArm = (side: 'l' | 'r', sign: number) => {
    const shName = `${side}Sh` as JointIdentifier;
    const elName = `${side}El` as JointIdentifier;
    const wrName = `${side}Wrist` as JointIdentifier;
    const shMarker = `${side}Shoulder` as AnatomicalMarker;
    const elMarker = `${side}Elbow` as AnatomicalMarker;
    const gloveMarker = `${side}Glove` as AnatomicalMarker;

    // Shoulder with YXZ rotation order to prevent gimbal lock
    const sh = createJoint(spine, shName, sign * 0.245, 0.43, 0, 'YXZ');
    createLimb(sh, 0.3, 0.07, 0.06, skinMat);
    createMarker(sh, shMarker, 0);

    // Elbow
    const el = createJoint(sh, elName, 0, -0.3, 0, 'XYZ');
    createLimb(el, 0.27, 0.06, 0.05, skinMat);
    createMarker(el, elMarker, 0);

    // Wrist & Glove
    const wr = createJoint(el, wrName, 0, -0.27, 0, 'XYZ');
    const fist = createMesh(new THREE.BoxGeometry(0.13, 0.1, 0.16), accMat);
    fist.position.set(0, -0.05, 0.02);
    wr.add(fist);

    const thumb = createMesh(new THREE.SphereGeometry(0.035, 10, 8), accMat);
    thumb.position.set(-sign * 0.06, -0.03, 0.06);
    wr.add(thumb);

    createMarker(wr, gloveMarker, -0.06, 0.02);
  };

  buildArm('l', 1);
  buildArm('r', -1);

  // Legs: Multiaxial YXZ Hip + Planar XYZ Knee/Ankle
  const buildLeg = (side: 'l' | 'r', sign: number) => {
    const hipName = `${side}Hip` as JointIdentifier;
    const kneeName = `${side}Knee` as JointIdentifier;
    const ankleName = `${side}Ankle` as JointIdentifier;
    const hipMarker = `${side}HipJoint` as AnatomicalMarker;
    const kneeMarker = `${side}Knee` as AnatomicalMarker;
    const footMarker = `${side}Foot` as AnatomicalMarker;

    // Hip with YXZ rotation order
    const hip = createJoint(root, hipName, sign * 0.12, -0.08, 0, 'YXZ');
    createMarker(hip, hipMarker, 0);

    const shorts = createMesh(new THREE.CylinderGeometry(0.105, 0.09, 0.2, 14), accMat);
    shorts.position.y = -0.09;
    hip.add(shorts);

    createLimb(hip, 0.44, 0.1, 0.075, skinMat);

    // Knee
    const knee = createJoint(hip, kneeName, 0, -0.44, 0, 'XYZ');
    createLimb(knee, 0.44, 0.075, 0.055, skinMat);
    createMarker(knee, kneeMarker, 0);

    // Ankle & Foot
    const an = createJoint(knee, ankleName, 0, -0.42, 0, 'XYZ');
    const foot = createMesh(new THREE.BoxGeometry(0.1, 0.06, 0.24), skinMat);
    foot.position.set(0, -0.03, 0.05);
    an.add(foot);

    createMarker(an, footMarker, -0.03, 0.05);
  };

  buildLeg('l', 1);
  buildLeg('r', -1);

  // Clone materials on each joint mesh for independent highlighting
  if (!ghost) {
    for (const j of JOINTS) {
      const g = j === 'root' ? root : joints[j];
      if (g) {
        const meshes = g.children.filter((c): c is THREE.Mesh => (c as THREE.Mesh).isMesh);
        meshes.forEach((m) => {
          if (Array.isArray(m.material)) {
            m.material = m.material.map((mat) => mat.clone());
          } else {
            m.material = m.material.clone();
          }
        });
        jointMeshes[j] = meshes;
      }
    }
  }

  return {
    holder,
    root,
    joints,
    points,
    jointMeshes,
  };
}

const FOCUS_EXTEND: Partial<Record<JointIdentifier, JointIdentifier>> = {
  lEl: 'lWrist',
  rEl: 'rWrist',
  lKnee: 'lAnkle',
  rKnee: 'rAnkle',
};

/**
 * Highlights active kinematic focus areas with an emissive pulse color.
 */
export function setFocus(f: FighterRig, names?: JointIdentifier[] | null): void {
  const set = new Set<JointIdentifier>(names || []);
  for (const n of Array.from(set)) {
    const ext = FOCUS_EXTEND[n];
    if (ext) set.add(ext);
  }

  for (const j of JOINTS) {
    const meshes = f.jointMeshes[j] || [];
    const on = set.has(j);
    for (const m of meshes) {
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat && mat.emissive) {
        mat.emissive.setHex(on ? 0xa63a26 : 0x000000);
        mat.emissiveIntensity = on ? 0.9 : 1;
      }
    }
  }
}

/**
 * Applies angular orientation vectors and world position coordinates to a fighter rig.
 */
export function apply(f: FighterRig, p: Pose): void {
  for (const j of JOINTS) {
    const g = j === 'root' ? f.root : f.joints[j];
    if (g && p[j]) {
      g.rotation.set(p[j][0] * D, p[j][1] * D, p[j][2] * D);
    }
  }
  if (p.pos) {
    f.root.position.set(p.pos[0], 0.97 + p.pos[1], p.pos[2]);
  }
}

