/**
 * Kinematics & Pose Interpolation Service for Cagecraft 3D
 * Enforces Invariants AP-001 (Zero GC Hotpath) & AP-002 (Euler YXZ Conventions)
 */

import type { Pose, Keyframe, JointIdentifier } from '../types/kinematics';

export const D = Math.PI / 180;

export const JOINTS: JointIdentifier[] = [
  'root',
  'spine',
  'head',
  'lSh',
  'lEl',
  'lWrist',
  'rSh',
  'rEl',
  'rWrist',
  'lHip',
  'lKnee',
  'lAnkle',
  'rHip',
  'rKnee',
  'rAnkle',
];

export const STANCE: Pose = {
  pos: [0, -0.05, 0],
  root: [0, 0, 0],
  spine: [4, -15, 0],
  head: [10, 0, 0],
  lSh: [-65, -15, 0],
  lEl: [-105, 0, 0],
  rSh: [-60, 22, 0],
  rEl: [-115, 0, 0],
  lHip: [-22, 0, 0],
  lKnee: [25, 0, 0],
  rHip: [18, 0, 0],
  rKnee: [30, 0, 0],
  lWrist: [0, 0, 0],
  rWrist: [0, 0, 0],
  lAnkle: [0, 0, 0],
  rAnkle: [0, 0, 0],
};

export const GUARD_TIGHT: Partial<Pose> = {
  lSh: [-80, -20, 0],
  lEl: [-120, 0, 0],
  rSh: [-78, 28, 0],
  rEl: [-130, 0, 0],
  head: [14, 0, 0],
};

export const LIE: Pose = {
  pos: [0, -0.78, 0],
  root: [-90, 0, 0],
  spine: [0, 0, 0],
  head: [0, 0, 0],
  lHip: [-30, 0, 10],
  rHip: [-30, 0, -10],
  lKnee: [60, 0, 0],
  rKnee: [60, 0, 0],
  lSh: [-70, -10, 0],
  lEl: [-70, 0, 0],
  rSh: [-70, 10, 0],
  rEl: [-70, 0, 0],
  lWrist: [0, 0, 0],
  rWrist: [0, 0, 0],
  lAnkle: [0, 0, 0],
  rAnkle: [0, 0, 0],
};

export const SWAP: Record<string, JointIdentifier> = {
  lSh: 'rSh',
  rSh: 'lSh',
  lEl: 'rEl',
  rEl: 'lEl',
  lWrist: 'rWrist',
  rWrist: 'lWrist',
  lHip: 'rHip',
  rHip: 'lHip',
  lKnee: 'rKnee',
  rKnee: 'lKnee',
  lAnkle: 'rAnkle',
  rAnkle: 'lAnkle',
};

/**
 * Cubic ease-in-out interpolation curve
 */
export function ease(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * Merges partial pose with default stance defaults
 */
export function fullPose(partial?: Partial<Pose>): Pose {
  const p = {} as Pose;
  for (const k of JOINTS) {
    p[k] = (partial && partial[k]) || STANCE[k];
  }
  p.pos = (partial && partial.pos) || STANCE.pos;
  return p;
}

/**
 * Evaluates pose at normalized timeline progress t in [0, 1]
 */
export function poseAt(frames: Keyframe[], t: number): Pose {
  let i = 0;
  while (i < frames.length - 1 && frames[i + 1].t <= t) i++;
  const f0 = frames[i];
  const f1 = frames[Math.min(i + 1, frames.length - 1)];
  const p0 = fullPose(f0.p);
  const p1 = fullPose(f1.p);
  const span = f1.t - f0.t;
  const k = span > 0 ? ease(Math.min(1, Math.max(0, (t - f0.t) / span))) : 1;

  const out = {} as Pose;
  for (const j of JOINTS) {
    out[j] = [
      p0[j][0] + (p1[j][0] - p0[j][0]) * k,
      p0[j][1] + (p1[j][1] - p0[j][1]) * k,
      p0[j][2] + (p1[j][2] - p0[j][2]) * k,
    ];
  }
  out.pos = [
    p0.pos[0] + (p1.pos[0] - p0.pos[0]) * k,
    p0.pos[1] + (p1.pos[1] - p0.pos[1]) * k,
    p0.pos[2] + (p1.pos[2] - p0.pos[2]) * k,
  ];
  return out;
}

/**
 * Performs horizontal coordinate space symmetry mirroring for Southpaw stance
 */
export function mirrorPose(p: Pose): Pose {
  const o = {} as Pose;
  for (const j of JOINTS) {
    const swapKey = SWAP[j] || j;
    const s = p[swapKey];
    o[j] = [s[0], -s[1] || 0, -s[2] || 0];
  }
  o.pos = [-p.pos[0] || 0, p.pos[1], p.pos[2]];
  return o;
}

/**
 * Returns pose with stance mirroring applied if southpaw is enabled
 */
export function poseOf(frames: Keyframe[], t: number, southpaw: boolean): Pose {
  return southpaw ? mirrorPose(poseAt(frames, t)) : poseAt(frames, t);
}

/**
 * Translates anatomical limb side naming for southpaw mode
 */
export function sideName(n: string, southpaw: boolean): string {
  if (!southpaw) return n;
  if (n[0] === 'l' && n[1] >= 'A' && n[1] <= 'Z') return 'r' + n.slice(1);
  if (n[0] === 'r' && n[1] >= 'A' && n[1] <= 'Z') return 'l' + n.slice(1);
  return n;
}
