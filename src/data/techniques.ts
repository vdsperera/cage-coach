/**
 * Curated Martial Arts Techniques Knowledge Base for Cagecraft 3D
 * 10 Striking & Defenses + 10 Grappling, Takedowns & Positions
 */

import type { Keyframe, Technique, ContactMark, AnatomicalMarker, Pose, ComboDefinition } from '../types/kinematics';
import { LIE } from '../engine/kinematics';

const M = (...o: Partial<Pose>[]): Partial<Pose> => Object.assign({}, ...o);
const mk = (t0: number, t1: number, who: 'A' | 'B', pt: AnatomicalMarker, label: string, dy?: number): ContactMark => ({
  t0,
  t1,
  who,
  pt,
  label,
  dy,
});

/* ---------------- Pose definitions ---------------- */
export const JAB_IMPACT: Partial<Pose> = {
  lSh: [-94, -26, 0],
  lEl: [-4, 0, 0],
  lWrist: [0, 0, -80],
  spine: [6, -32, 0],
  pos: [0, -0.05, 0.12],
  head: [8, 0, 0],
  rSh: [-78, 28, 0],
  rEl: [-130, 0, 0],
};
export const JAB: Keyframe[] = [{ t: 0 }, { t: 0.32, p: JAB_IMPACT }, { t: 0.45, p: JAB_IMPACT }, { t: 1 }];

export const CROSS_IMPACT: Partial<Pose> = {
  rSh: [-94, 32, 0],
  rEl: [-4, 0, 0],
  rWrist: [0, 0, 80],
  spine: [6, 42, 0],
  root: [0, 14, 0],
  pos: [0, -0.07, 0.08],
  rHip: [20, 38, 0],
  rKnee: [42, 0, 0],
  rAnkle: [35, 0, 0],
  head: [10, 0, 0],
  lSh: [-80, -20, 0],
  lEl: [-125, 0, 0],
};
export const CROSS: Keyframe[] = [{ t: 0 }, { t: 0.38, p: CROSS_IMPACT }, { t: 0.5, p: CROSS_IMPACT }, { t: 1 }];

export const HOOK_IMPACT: Partial<Pose> = {
  lSh: [-100, -12, 0],
  lEl: [0, 0, -95],
  spine: [4, -48, 0],
  pos: [-0.02, -0.06, 0.04],
  lHip: [-22, -35, 0],
  lKnee: [30, 0, 0],
  lAnkle: [25, 0, 0],
  rSh: [-78, 28, 0],
  rEl: [-130, 0, 0],
};
export const HOOK: Keyframe[] = [
  { t: 0 },
  {
    t: 0.28,
    p: { lSh: [-95, 60, 0], lEl: [0, 0, -70], spine: [4, 12, 0], pos: [0.04, -0.08, 0], lKnee: [35, 0, 0], rSh: [-78, 28, 0], rEl: [-130, 0, 0] },
  },
  { t: 0.48, p: HOOK_IMPACT },
  { t: 0.6, p: HOOK_IMPACT },
  { t: 1 },
];

export const UPPER_IMPACT: Partial<Pose> = {
  rSh: [-52, 32, 0],
  rEl: [-116, 0, 0],
  spine: [-4, 40, 0],
  root: [0, 10, 0],
  pos: [0, -0.03, 0.08],
  rHip: [20, 30, 0],
  rKnee: [36, 0, 0],
  rAnkle: [25, 0, 0],
  lSh: [-80, -20, 0],
  lEl: [-125, 0, 0],
};
export const UPPERCUT: Keyframe[] = [
  { t: 0 },
  {
    t: 0.3,
    p: { rSh: [-30, 22, 0], rEl: [-100, 0, 0], spine: [14, 15, 0], pos: [-0.03, -0.14, 0.04], rKnee: [48, 0, 0], lKnee: [35, 0, 0], lSh: [-80, -20, 0], lEl: [-125, 0, 0] },
  },
  { t: 0.5, p: UPPER_IMPACT },
  { t: 0.62, p: UPPER_IMPACT },
  { t: 1 },
];

export const ELBOW_IMPACT: Partial<Pose> = {
  lSh: [-102, -15, 0],
  lEl: [0, 0, -150],
  spine: [4, -52, 0],
  pos: [-0.02, -0.06, 0.12],
  lHip: [-22, -30, 0],
  lAnkle: [20, 0, 0],
  rSh: [-78, 28, 0],
  rEl: [-130, 0, 0],
};
export const ELBOW: Keyframe[] = [
  { t: 0 },
  { t: 0.3, p: { lSh: [-88, 55, 0], lEl: [0, 0, -150], spine: [4, 15, 0], pos: [0.03, -0.07, 0.02], rSh: [-78, 28, 0], rEl: [-130, 0, 0] } },
  { t: 0.5, p: ELBOW_IMPACT },
  { t: 0.62, p: ELBOW_IMPACT },
  { t: 1 },
];

export const KNEE_IMPACT: Partial<Pose> = {
  rHip: [-105, 10, 0],
  rKnee: [135, 0, 0],
  rAnkle: [45, 0, 0],
  spine: [26, 8, 0],
  lSh: [-40, -10, 0],
  lEl: [-110, 0, 0],
  rSh: [-40, 15, 0],
  rEl: [-110, 0, 0],
  pos: [0, 0.0, 0.14],
  lHip: [-10, 0, 0],
  lKnee: [18, 0, 0],
  lAnkle: [30, 0, 0],
  head: [8, 0, 0],
};
export const KNEE: Keyframe[] = [
  { t: 0 },
  { t: 0.3, p: { lSh: [-82, -10, 0], lEl: [-60, 0, 0], rSh: [-82, 15, 0], rEl: [-60, 0, 0], pos: [0, -0.04, 0.06], spine: [8, -5, 0] } },
  { t: 0.55, p: KNEE_IMPACT },
  { t: 0.68, p: KNEE_IMPACT },
  { t: 1 },
];

export const TEEP_CHAMBER: Partial<Pose> = {
  lHip: [-95, 0, 0],
  lKnee: [125, 0, 0],
  lAnkle: [-25, 0, 0],
  spine: [-12, -10, 0],
  pos: [0, 0.0, 0.02],
  rKnee: [26, 0, 0],
  rHip: [6, 0, 0],
  lSh: [-52, -15, 0],
  rSh: [-52, 22, 0],
};
export const TEEP_IMPACT: Partial<Pose> = {
  lHip: [-82, -6, 0],
  lKnee: [4, 0, 0],
  lAnkle: [-30, 0, 0],
  spine: [-24, -10, 0],
  pos: [0, 0.0, 0.1],
  rKnee: [20, 0, 0],
  rHip: [4, 0, 0],
  lSh: [-52, -15, 0],
  rSh: [-52, 22, 0],
};
export const TEEP: Keyframe[] = [
  { t: 0 },
  { t: 0.3, p: TEEP_CHAMBER },
  { t: 0.5, p: TEEP_IMPACT },
  { t: 0.62, p: TEEP_IMPACT },
  { t: 0.75, p: M(TEEP_CHAMBER, { pos: [0, 0, 0.04] }) },
  { t: 1 },
];

export const RH_IMPACT: Partial<Pose> = {
  rHip: [-86, -56, 0],
  rKnee: [8, 0, 0],
  rAnkle: [35, 0, 0],
  spine: [-20, 24, -26],
  root: [0, 56, 0],
  pos: [0.06, 0.0, 0.1],
  lHip: [-16, 36, 0],
  lKnee: [26, 0, 0],
  lAnkle: [20, 0, 0],
  rSh: [-10, 10, 0],
  rEl: [-40, 0, 0],
  lSh: [-80, -15, 0],
  lEl: [-120, 0, 0],
};
export const ROUNDHOUSE: Keyframe[] = [
  { t: 0 },
  { t: 0.2, p: { pos: [0.08, -0.04, 0.08], lHip: [-18, 40, 0], lKnee: [28, 0, 0], root: [0, 8, 0] } },
  {
    t: 0.36,
    p: {
      rHip: [-72, -80, 0],
      rKnee: [112, 0, 0],
      rAnkle: [30, 0, 0],
      spine: [-14, 22, -18],
      root: [0, 26, 0],
      pos: [0.08, -0.01, 0.1],
      lHip: [-16, 55, 0],
      lKnee: [30, 0, 0],
      rSh: [-28, 10, 0],
      rEl: [-55, 0, 0],
      lSh: [-80, -15, 0],
      lEl: [-120, 0, 0],
    },
  },
  { t: 0.5, p: RH_IMPACT },
  { t: 0.6, p: RH_IMPACT },
  { t: 0.74, p: { rHip: [-70, -30, 0], rKnee: [100, 0, 0], spine: [-12, 16, -14], root: [0, 34, 0], pos: [0.06, -0.02, 0.08], lHip: [-16, 45, 0] } },
  { t: 1 },
];

export const SLIP_POSE: Partial<Pose> = {
  spine: [16, 24, 24],
  head: [6, 0, 10],
  pos: [-0.07, -0.12, 0],
  rKnee: [46, 0, 0],
  lKnee: [32, 0, 0],
  lSh: [-80, -20, 0],
  lEl: [-125, 0, 0],
  rSh: [-82, 30, 0],
  rEl: [-135, 0, 0],
};
export const SLIP: Keyframe[] = [{ t: 0 }, { t: 0.38, p: SLIP_POSE }, { t: 0.55, p: SLIP_POSE }, { t: 1 }];

export const CHECK_POSE: Partial<Pose> = {
  lHip: [-62, 28, 0],
  lKnee: [112, 0, 0],
  lAnkle: [20, 0, 0],
  spine: [-4, -10, -6],
  pos: [0, -0.02, 0],
  rKnee: [22, 0, 0],
  rHip: [6, 0, 0],
  lSh: [-80, -20, 0],
  lEl: [-125, 0, 0],
  rSh: [-80, 28, 0],
  rEl: [-135, 0, 0],
};
export const CHECK: Keyframe[] = [{ t: 0 }, { t: 0.38, p: CHECK_POSE }, { t: 0.56, p: CHECK_POSE }, { t: 1 }];

/* ---------------- Partner reaction generators ---------------- */
export const headSnap = (ti: number): Keyframe[] => [
  { t: 0 },
  { t: ti - 0.05 },
  { t: ti + 0.05, p: { head: [-22, 0, 0], spine: [-8, 0, 0], pos: [0, -0.05, -0.07] } },
  { t: ti + 0.35, p: { head: [10, 0, 0], spine: [0, 0, 0], pos: [0, -0.05, -0.04] } },
  { t: 1 },
];

export const COVER: Partial<Pose> = {
  rSh: [-112, 36, 0],
  rEl: [-142, 0, 0],
  head: [12, 0, 14],
  spine: [0, -12, 10],
  pos: [0, -0.06, -0.03],
};
export const coverRight = (ti: number): Keyframe[] => [
  { t: 0 },
  { t: ti - 0.12 },
  { t: ti, p: COVER },
  { t: ti + 0.25, p: COVER },
  { t: 1 },
];

export const chinUp = (ti: number): Keyframe[] => [
  { t: 0 },
  { t: ti - 0.05 },
  { t: ti + 0.05, p: { head: [-28, 0, 0], spine: [-12, 0, 0], pos: [0, -0.03, -0.04] } },
  { t: ti + 0.4, p: { head: [0, 0, 0], spine: [-4, 0, 0] } },
  { t: 1 },
];

export const HUNCH: Partial<Pose> = {
  spine: [26, 0, 0],
  head: [0, 0, 0],
  lSh: [-45, -15, 0],
  lEl: [-20, 0, 0],
  rSh: [-45, 20, 0],
  rEl: [-20, 0, 0],
  pos: [0, -0.08, -0.08],
};
export const hunch = (ti: number): Keyframe[] => [
  { t: 0 },
  { t: ti - 0.15, p: { lSh: [-70, -10, 0], lEl: [-70, 0, 0], rSh: [-70, 15, 0], rEl: [-70, 0, 0], spine: [10, 0, 0] } },
  { t: ti + 0.03, p: HUNCH },
  { t: ti + 0.3, p: HUNCH },
  { t: 1 },
];

export const pushedBack = (ti: number): Keyframe[] => [
  { t: 0 },
  { t: ti - 0.05 },
  { t: ti + 0.1, p: { pos: [0, -0.06, -0.26], spine: [-10, 0, 0], lSh: [-50, -10, 0], rSh: [-50, 15, 0] } },
  { t: ti + 0.4, p: { pos: [0, -0.06, -0.24], spine: [-4, 0, 0] } },
  { t: 1, p: { pos: [0, -0.05, -0.1] } },
];

export const CHECK_B: Partial<Pose> = {
  lHip: [-62, 28, 0],
  lKnee: [112, 0, 0],
  spine: [-4, -8, -6],
  rKnee: [22, 0, 0],
  rHip: [6, 0, 0],
  lSh: [-82, -20, 0],
  lEl: [-130, 0, 0],
};
export const checkLeft = (ti: number): Keyframe[] => [
  { t: 0 },
  { t: ti - 0.18 },
  { t: ti - 0.02, p: CHECK_B },
  { t: ti + 0.2, p: CHECK_B },
  { t: 1 },
];

/* ---------------- Grappling Poses ---------------- */
export const TIE_GRIP: Partial<Pose> = { pos: [0, -0.05, 0.42], lSh: [-100, -28, 0], lEl: [-25, 0, 0], rSh: [-100, 32, 0], rEl: [-25, 0, 0], spine: [6, -10, 0], head: [6, 0, 0] };
export const TIE_SNAP: Partial<Pose> = { pos: [0, -0.1, 0.4], lSh: [-70, -28, 0], lEl: [-70, 0, 0], rSh: [-70, 32, 0], rEl: [-70, 0, 0], spine: [22, -10, 0], lKnee: [35, 0, 0], rKnee: [40, 0, 0], head: [10, 0, 0] };
export const TIE_A: Keyframe[] = [
  { t: 0 },
  { t: 0.3, p: { pos: [0, -0.05, 0.4], lSh: [-80, -15, 0], lEl: [-70, 0, 0], rSh: [-80, 22, 0], rEl: [-70, 0, 0], spine: [8, -10, 0] } },
  { t: 0.5, p: TIE_GRIP },
  { t: 0.7, p: TIE_SNAP },
  { t: 0.85, p: TIE_SNAP },
  { t: 1 },
];
export const TIE_B_DOWN: Partial<Pose> = { pos: [0, -0.08, 0.33], spine: [35, 0, 0], head: [20, 0, 0], lSh: [-40, -10, 0], lEl: [-60, 0, 0], rSh: [-40, 15, 0], rEl: [-60, 0, 0], lKnee: [35, 0, 0], rKnee: [40, 0, 0] };
export const TIE_B: Keyframe[] = [
  { t: 0 },
  { t: 0.3, p: { pos: [0, -0.05, 0.33], lSh: [-70, -15, 0], rSh: [-70, 22, 0] } },
  { t: 0.5, p: { pos: [0, -0.05, 0.33], lSh: [-75, -10, 0], lEl: [-80, 0, 0], rSh: [-75, 15, 0], rEl: [-80, 0, 0] } },
  { t: 0.7, p: TIE_B_DOWN },
  { t: 0.85, p: TIE_B_DOWN },
  { t: 1 },
];

export const LEVEL: Partial<Pose> = {
  pos: [0, -0.3, 0.15],
  spine: [30, -5, 0],
  lHip: [-60, 0, 0],
  lKnee: [70, 0, 0],
  rHip: [10, 0, 0],
  rKnee: [60, 0, 0],
  lSh: [-60, -15, 0],
  lEl: [-60, 0, 0],
  rSh: [-60, 20, 0],
  rEl: [-60, 0, 0],
  head: [-10, 0, 0],
};
export const PENETRATE: Partial<Pose> = {
  pos: [0, -0.45, 0.62],
  spine: [40, -5, 0],
  lHip: [-80, 0, 0],
  lKnee: [100, 0, 0],
  rHip: [30, 0, 0],
  rKnee: [40, 0, 0],
  lSh: [-70, -30, 0],
  lEl: [-70, 0, 0],
  rSh: [-70, 35, 0],
  rEl: [-70, 0, 0],
  head: [-25, 0, 0],
};
export const DRIVE: Partial<Pose> = {
  pos: [0, -0.28, 0.85],
  spine: [15, -5, 0],
  lHip: [-50, 0, 0],
  lKnee: [60, 0, 0],
  rHip: [20, 0, 0],
  rKnee: [30, 0, 0],
  lSh: [-60, -30, 0],
  lEl: [-80, 0, 0],
  rSh: [-60, 35, 0],
  rEl: [-80, 0, 0],
  head: [-20, 0, 0],
};
export const DOUBLE_A: Keyframe[] = [{ t: 0 }, { t: 0.25, p: LEVEL }, { t: 0.45, p: PENETRATE }, { t: 0.65, p: DRIVE }, { t: 0.8, p: DRIVE }, { t: 1 }];
export const LIFTED: Partial<Pose> = {
  pos: [0, 0.12, 0.35],
  root: [-35, 0, 0],
  lHip: [-30, 0, 0],
  lKnee: [70, 0, 0],
  rHip: [-20, 0, 0],
  rKnee: [70, 0, 0],
  spine: [-10, 0, 0],
  lSh: [-40, -10, 0],
  lEl: [-20, 0, 0],
  rSh: [-40, 15, 0],
  rEl: [-20, 0, 0],
};
export const DOUBLE_B: Keyframe[] = [
  { t: 0 },
  { t: 0.4, p: { lSh: [-40, -10, 0], lEl: [-40, 0, 0], rSh: [-40, 15, 0], rEl: [-40, 0, 0], spine: [10, 0, 0] } },
  { t: 0.65, p: LIFTED },
  { t: 0.8, p: LIFTED },
  { t: 1 },
];

export const STUFFED: Partial<Pose> = {
  pos: [0, -0.58, 0.5],
  spine: [45, -5, 0],
  lHip: [-60, 0, 0],
  lKnee: [110, 0, 0],
  rHip: [-40, 0, 0],
  rKnee: [110, 0, 0],
  lSh: [-70, -30, 0],
  lEl: [-70, 0, 0],
  rSh: [-70, 35, 0],
  rEl: [-70, 0, 0],
  head: [-20, 0, 0],
};
export const SHOT_STUFFED: Keyframe[] = [{ t: 0 }, { t: 0.25, p: LEVEL }, { t: 0.45, p: PENETRATE }, { t: 0.6, p: STUFFED }, { t: 0.8, p: STUFFED }, { t: 1 }];

export const SINGLE_CATCH: Partial<Pose> = {
  pos: [-0.1, -0.42, 0.55],
  spine: [35, -25, 0],
  root: [0, -20, 0],
  lHip: [-80, 0, 0],
  lKnee: [100, 0, 0],
  rHip: [30, 0, 0],
  rKnee: [40, 0, 0],
  lSh: [-80, -50, 0],
  lEl: [-70, 0, 0],
  rSh: [-80, 10, 0],
  rEl: [-70, 0, 0],
  head: [-25, 0, 0],
};
export const SINGLE_LIFT: Partial<Pose> = {
  pos: [-0.05, -0.2, 0.6],
  spine: [10, -20, 0],
  root: [0, -20, 0],
  lHip: [-40, 0, 0],
  lKnee: [50, 0, 0],
  rHip: [15, 0, 0],
  rKnee: [30, 0, 0],
  lSh: [-70, -45, 0],
  lEl: [-100, 0, 0],
  rSh: [-70, 5, 0],
  rEl: [-100, 0, 0],
  head: [-15, 0, 0],
};
export const SINGLE_A: Keyframe[] = [{ t: 0 }, { t: 0.25, p: LEVEL }, { t: 0.45, p: SINGLE_CATCH }, { t: 0.65, p: SINGLE_LIFT }, { t: 0.8, p: SINGLE_LIFT }, { t: 1 }];
export const HOPPING: Partial<Pose> = {
  lHip: [-75, 10, 0],
  lKnee: [70, 0, 0],
  rHip: [5, 0, 0],
  rKnee: [25, 0, 0],
  spine: [-15, 0, 0],
  pos: [0, -0.02, -0.15],
  lSh: [-70, -10, 0],
  lEl: [-40, 0, 0],
  rSh: [-70, 15, 0],
  rEl: [-40, 0, 0],
};
export const SINGLE_B: Keyframe[] = [
  { t: 0 },
  { t: 0.4, p: { lSh: [-40, -10, 0], rSh: [-40, 15, 0], spine: [10, 0, 0] } },
  { t: 0.65, p: HOPPING },
  { t: 0.8, p: HOPPING },
  { t: 1 },
];

export const TOSS_LOAD: Partial<Pose> = {
  root: [0, 180, 0],
  pos: [0, -0.3, 0.9],
  lHip: [-40, 0, 0],
  rHip: [-40, 0, 0],
  lKnee: [70, 0, 0],
  rKnee: [70, 0, 0],
  spine: [20, 0, 0],
  lSh: [-80, -30, 0],
  lEl: [-70, 0, 0],
  rSh: [45, -50, 0],
  rEl: [-60, 0, 0],
  head: [0, 0, 0],
};
export const TOSS_THROW: Partial<Pose> = {
  root: [0, 180, 0],
  pos: [0, -0.2, 0.9],
  lHip: [-20, 0, 0],
  rHip: [-20, 0, 0],
  lKnee: [30, 0, 0],
  rKnee: [30, 0, 0],
  spine: [60, 0, 0],
  lSh: [-130, -20, 0],
  lEl: [-30, 0, 0],
  rSh: [-10, -40, 0],
  rEl: [-40, 0, 0],
  head: [-30, 0, 0],
};
export const TOSS_END: Partial<Pose> = M(TOSS_THROW, { spine: [50, 0, 0], lSh: [-110, -20, 0], rSh: [-20, -40, 0], pos: [0, -0.22, 0.9] });
export const TOSS_A: Keyframe[] = [
  { t: 0 },
  { t: 0.2, p: { pos: [0, -0.05, 0.45], lSh: [-80, -20, 0], lEl: [-70, 0, 0], rSh: [-80, 25, 0], rEl: [-70, 0, 0] } },
  { t: 0.4, p: TOSS_LOAD },
  { t: 0.6, p: TOSS_THROW },
  { t: 0.78, p: TOSS_END },
  { t: 1, p: TOSS_END },
];
export const TOSS_B_AIR: Partial<Pose> = {
  pos: [0, 0.13, 0.7],
  root: [135, 0, 0],
  lHip: [-30, 0, 0],
  rHip: [-30, 0, 0],
  lKnee: [30, 0, 0],
  rKnee: [30, 0, 0],
  spine: [0, 0, 0],
  lSh: [-120, -20, 0],
  lEl: [-20, 0, 0],
  rSh: [-120, 20, 0],
  rEl: [-20, 0, 0],
  head: [0, 0, 0],
};
export const TOSS_B_LAND: Partial<Pose> = {
  pos: [0, -0.78, 1.15],
  root: [270, 0, 0],
  lHip: [-30, 0, 10],
  rHip: [-30, 0, -10],
  lKnee: [60, 0, 0],
  rKnee: [60, 0, 0],
  spine: [0, 0, 0],
  lSh: [-100, -20, 0],
  lEl: [-20, 0, 0],
  rSh: [-100, 20, 0],
  rEl: [-20, 0, 0],
  head: [0, 0, 0],
};
export const TOSS_B: Keyframe[] = [
  { t: 0 },
  { t: 0.2, p: { pos: [0, -0.05, 0.3], lSh: [-70, -15, 0], lEl: [-70, 0, 0], rSh: [-70, 20, 0], rEl: [-70, 0, 0] } },
  { t: 0.4, p: { pos: [0, 0.0, 0.4], spine: [15, 0, 0], lSh: [-80, -15, 0], lEl: [-60, 0, 0], rSh: [-80, 20, 0], rEl: [-60, 0, 0] } },
  { t: 0.6, p: TOSS_B_AIR },
  { t: 0.78, p: TOSS_B_LAND },
  { t: 1, p: TOSS_B_LAND },
];

export const SPRAWLED: Partial<Pose> = {
  pos: [0, -0.5, -0.05],
  root: [60, 0, 0],
  spine: [10, 0, 0],
  head: [-40, 0, 0],
  lHip: [30, 0, 15],
  rHip: [30, 0, -15],
  lKnee: [10, 0, 0],
  rKnee: [10, 0, 0],
  lSh: [-80, -15, 0],
  lEl: [-40, 0, 0],
  rSh: [-80, 20, 0],
  rEl: [-40, 0, 0],
};
export const SPRAWL_A: Keyframe[] = [
  { t: 0 },
  { t: 0.28, p: { lSh: [-70, -15, 0], lEl: [-50, 0, 0], rSh: [-70, 20, 0], rEl: [-50, 0, 0], spine: [15, 0, 0] } },
  { t: 0.5, p: SPRAWLED },
  { t: 0.75, p: SPRAWLED },
  { t: 1 },
];

export const MOUNT_TOP: Partial<Pose> = {
  pos: [0, -0.55, 1.45],
  root: [0, 0, 0],
  spine: [25, 0, 0],
  head: [0, 0, 0],
  lHip: [-60, 0, 35],
  rHip: [-60, 0, -35],
  lKnee: [120, 0, 0],
  rKnee: [120, 0, 0],
  lSh: [-95, -15, 0],
  lEl: [-15, 0, 0],
  rSh: [-95, 20, 0],
  rEl: [-15, 0, 0],
};
export const MOUNT_UP: Partial<Pose> = M(MOUNT_TOP, { spine: [0, 0, 0], lSh: [-60, -10, 0], lEl: [-110, 0, 0], rSh: [-60, 15, 0], rEl: [-110, 0, 0], head: [8, 0, 0] });
export const MOUNT_A: Keyframe[] = [{ t: 0, p: MOUNT_TOP }, { t: 0.45, p: MOUNT_TOP }, { t: 0.65, p: MOUNT_UP }, { t: 0.85, p: MOUNT_UP }, { t: 1, p: MOUNT_TOP }];
export const MOUNT_B_FRAME: Partial<Pose> = M(LIE, { lSh: [-80, -15, 0], lEl: [-60, 0, 0], rSh: [-80, 15, 0], rEl: [-60, 0, 0] });
export const MOUNT_B_BRIDGE: Partial<Pose> = M(MOUNT_B_FRAME, { pos: [0, -0.64, 0], lHip: [-45, 0, 10], rHip: [-45, 0, -10], lKnee: [95, 0, 0], rKnee: [95, 0, 0] });
export const MOUNT_B: Keyframe[] = [{ t: 0, p: MOUNT_B_FRAME }, { t: 0.45, p: MOUNT_B_FRAME }, { t: 0.65, p: MOUNT_B_BRIDGE }, { t: 0.85, p: MOUNT_B_BRIDGE }, { t: 1, p: MOUNT_B_FRAME }];

export const GUARD_TOP: Partial<Pose> = {
  pos: [0, -0.45, 1.05],
  root: [0, 0, 0],
  spine: [10, 0, 0],
  head: [5, 0, 0],
  lHip: [0, 0, 15],
  rHip: [0, 0, -15],
  lKnee: [90, 0, 0],
  rKnee: [90, 0, 0],
  lSh: [-55, -15, 0],
  lEl: [-10, 0, 0],
  rSh: [-55, 20, 0],
  rEl: [-10, 0, 0],
};
export const GUARD_UP: Partial<Pose> = M(GUARD_TOP, { spine: [-5, 0, 0], lSh: [-60, -15, 0], lEl: [-95, 0, 0], rSh: [-60, 20, 0], rEl: [-95, 0, 0] });
export const GUARD_A: Keyframe[] = [{ t: 0, p: GUARD_TOP }, { t: 0.4, p: GUARD_TOP }, { t: 0.6, p: GUARD_UP }, { t: 0.85, p: GUARD_UP }, { t: 1, p: GUARD_TOP }];
export const GUARD_BOT: Partial<Pose> = M(LIE, {
  pos: [0, -0.68, 0.35],
  lHip: [-70, 0, 35],
  rHip: [-70, 0, -35],
  lKnee: [100, 0, 0],
  rKnee: [100, 0, 0],
  lSh: [-60, -15, 0],
  lEl: [-60, 0, 0],
  rSh: [-60, 15, 0],
  rEl: [-60, 0, 0],
});
export const GUARD_PULL: Partial<Pose> = M(GUARD_BOT, { lSh: [-90, -20, 0], lEl: [-40, 0, 0], rSh: [-90, 20, 0], rEl: [-40, 0, 0], head: [20, 0, 0] });
export const GUARD_B: Keyframe[] = [{ t: 0, p: GUARD_BOT }, { t: 0.4, p: GUARD_BOT }, { t: 0.6, p: GUARD_PULL }, { t: 0.85, p: GUARD_PULL }, { t: 1, p: GUARD_BOT }];

export const SIDE_TOP: Partial<Pose> = {
  pos: [-0.55, -0.57, 1.55],
  root: [60, 0, -65],
  spine: [10, 0, 0],
  head: [-35, 0, 0],
  lHip: [-10, 0, 25],
  rHip: [-10, 0, -25],
  lKnee: [60, 0, 0],
  rKnee: [60, 0, 0],
  lSh: [-90, -25, 0],
  lEl: [-70, 0, 0],
  rSh: [-90, 25, 0],
  rEl: [-70, 0, 0],
};
export const SIDE_PRESS: Partial<Pose> = M(SIDE_TOP, { spine: [20, 0, 0], pos: [-0.5, -0.6, 1.55] });
export const SIDE_A: Keyframe[] = [{ t: 0, p: SIDE_TOP }, { t: 0.45, p: SIDE_TOP }, { t: 0.65, p: SIDE_PRESS }, { t: 0.85, p: SIDE_PRESS }, { t: 1, p: SIDE_TOP }];
export const SIDE_BOT: Partial<Pose> = M(LIE, { lSh: [-80, -10, 0], lEl: [-90, 0, 0], rSh: [-80, 20, 0], rEl: [-90, 0, 0], lHip: [-50, 0, 10], lKnee: [90, 0, 0] });
export const SIDE_B: Keyframe[] = [
  { t: 0, p: SIDE_BOT },
  { t: 0.45, p: SIDE_BOT },
  { t: 0.65, p: M(SIDE_BOT, { spine: [0, 0, 15], head: [0, 0, 10] }) },
  { t: 0.85, p: M(SIDE_BOT, { spine: [0, 0, 15] }) },
  { t: 1, p: SIDE_BOT },
];

export const BACK_HOOKS: Partial<Pose> = {
  pos: [0, -0.68, 1.75],
  root: [0, 180, 0],
  spine: [10, 0, 0],
  head: [10, 0, 0],
  lHip: [-70, 0, 25],
  rHip: [-70, 0, -25],
  lKnee: [80, 0, 0],
  rKnee: [80, 0, 0],
  lSh: [-80, -20, 0],
  lEl: [-60, 0, 0],
  rSh: [-80, 20, 0],
  rEl: [-60, 0, 0],
};
export const BACK_SEATBELT: Partial<Pose> = M(BACK_HOOKS, { rSh: [-100, 25, 0], rEl: [0, 0, 70], lSh: [-70, -30, 0], lEl: [-80, 0, 0] });
export const BACK_CHOKE: Partial<Pose> = M(BACK_HOOKS, { rSh: [-105, 25, 0], rEl: [0, 0, 110], lSh: [-125, -40, 0], lEl: [-115, 0, 0], spine: [-5, 0, 0], head: [15, 0, 0] });
export const BACK_A: Keyframe[] = [{ t: 0, p: BACK_HOOKS }, { t: 0.35, p: BACK_SEATBELT }, { t: 0.6, p: BACK_CHOKE }, { t: 0.85, p: BACK_CHOKE }, { t: 1, p: BACK_HOOKS }];
export const KNEEL: Partial<Pose> = {
  pos: [0, -0.6, 0],
  root: [0, 0, 0],
  spine: [5, 0, 0],
  head: [5, 0, 0],
  lHip: [-70, 0, 10],
  rHip: [-70, 0, -10],
  lKnee: [140, 0, 0],
  rKnee: [140, 0, 0],
  lSh: [-60, -15, 0],
  lEl: [-90, 0, 0],
  rSh: [-60, 20, 0],
  rEl: [-90, 0, 0],
};
export const KNEEL_DEFEND: Partial<Pose> = M(KNEEL, { lSh: [-120, -20, 0], lEl: [-130, 0, 0], rSh: [-120, 20, 0], rEl: [-130, 0, 0], head: [18, 0, 0] });
export const KNEEL_TAP: Partial<Pose> = M(KNEEL_DEFEND, { rSh: [-40, 60, 0], rEl: [-30, 0, 0] });
export const BACK_B: Keyframe[] = [{ t: 0, p: KNEEL }, { t: 0.35, p: KNEEL_DEFEND }, { t: 0.6, p: KNEEL_DEFEND }, { t: 0.85, p: KNEEL_TAP }, { t: 1, p: KNEEL }];

export const ARMBAR_SPIN: Partial<Pose> = {
  pos: [-0.2, -0.45, 1.7],
  root: [0, -50, 0],
  spine: [30, 0, 0],
  head: [0, 0, 0],
  lHip: [-70, 0, 30],
  lKnee: [100, 0, 0],
  rHip: [-90, 0, -40],
  rKnee: [60, 0, 0],
  lSh: [-110, -20, 0],
  lEl: [-40, 0, 0],
  rSh: [-110, 30, 0],
  rEl: [-40, 0, 0],
};
export const ARMBAR_FIN: Partial<Pose> = {
  pos: [-0.3, -0.75, 1.9],
  root: [-90, 0, 90],
  spine: [15, 0, 0],
  head: [30, 0, 0],
  lHip: [-30, 0, 20],
  lKnee: [60, 0, 0],
  rHip: [-30, 0, -20],
  rKnee: [60, 0, 0],
  lSh: [-90, -20, 0],
  lEl: [-60, 0, 0],
  rSh: [-90, 20, 0],
  rEl: [-60, 0, 0],
};
export const ARMBAR_A: Keyframe[] = [
  { t: 0, p: MOUNT_TOP },
  { t: 0.15, p: MOUNT_TOP },
  { t: 0.4, p: ARMBAR_SPIN },
  { t: 0.65, p: ARMBAR_FIN },
  { t: 0.85, p: ARMBAR_FIN },
  { t: 1, p: ARMBAR_FIN },
];
export const ARMBAR_B_EXT: Partial<Pose> = M(LIE, { lSh: [-80, 0, 30], lEl: [0, 0, 0], rSh: [-60, 10, 0], rEl: [-90, 0, 0], head: [-10, 0, 0] });
export const ARMBAR_B_TAP: Partial<Pose> = M(ARMBAR_B_EXT, { rSh: [-40, 40, 0], rEl: [-40, 0, 0] });
export const ARMBAR_B: Keyframe[] = [
  { t: 0, p: MOUNT_B_FRAME },
  { t: 0.15, p: MOUNT_B_FRAME },
  { t: 0.4, p: M(LIE, { lSh: [-85, -10, 10], lEl: [-20, 0, 0] }) },
  { t: 0.65, p: ARMBAR_B_EXT },
  { t: 0.85, p: ARMBAR_B_TAP },
  { t: 1, p: ARMBAR_B_TAP },
];

export const GROUND_CAM: [number, number, number] = [-0.1, 0.45, 1.6];

/* ---------------- 20 Base Techniques Catalog ---------------- */
export const BASE_TECHNIQUES: Technique[] = [
  {
    key: '1',
    group: 'strike',
    name: 'Jab',
    side: 'Lead hand',
    dur: 1.1,
    a: JAB,
    b: headSnap(0.33),
    trace: 'lGlove',
    peak: 0.4,
    focus: ['lSh', 'lEl'],
    phases: [
      [0.32, 'Extend', 'Lead hand shoots straight from the chin while the lead foot slides in. Rear hand stays on the cheek.'],
      [0.45, 'Impact', 'Arm fully straight, shoulder rolled up to cover the chin, fist turned palm down.'],
      [1, 'Retract', 'Hand returns on the same straight line to the guard, elbow stays in.'],
    ],
    marks: [mk(0.28, 0.5, 'A', 'lGlove', 'Contact: chin'), mk(0.28, 0.5, 'A', 'rGlove', 'Rear hand stays home', 0.14)],
    cues: ['Straight line from guard to target, no wind-up', 'Rotate the fist and shoulder at full extension', 'Hand returns on the same line to guard'],
    partner: 'Head snaps back on contact',
  },
  {
    key: '2',
    group: 'strike',
    name: 'Cross',
    side: 'Rear hand',
    dur: 1.3,
    a: CROSS,
    b: headSnap(0.4),
    trace: 'rGlove',
    peak: 0.45,
    focus: ['rSh', 'rEl', 'rHip', 'spine'],
    phases: [
      [0.38, 'Drive', 'Rear heel lifts and the foot pivots in. Hip and shoulder turn toward the target before the hand moves.'],
      [0.5, 'Impact', 'Arm straight down the centre, chin tucked behind the lead shoulder, weight on the lead leg.'],
      [1, 'Recover', 'Hand comes straight back, hips turn back square, weight settles between the feet.'],
    ],
    marks: [mk(0.34, 0.55, 'A', 'rGlove', 'Contact: chin'), mk(0.2, 0.55, 'A', 'rFoot', 'Heel up, foot pivots in')],
    cues: ['Pivot the rear foot, then the hip, then the shoulder', 'Chin stays behind the lead shoulder', 'Rear hand fires straight down the centre line'],
    partner: 'Head snaps back on contact',
  },
  {
    key: '3',
    group: 'strike',
    name: 'Lead hook',
    side: 'Lead hand',
    dur: 1.3,
    a: HOOK,
    b: coverRight(0.48),
    trace: 'lGlove',
    peak: 0.55,
    focus: ['lSh', 'lEl', 'lHip', 'spine'],
    phases: [
      [0.28, 'Load', 'Weight shifts onto the lead foot and the lead shoulder drops back slightly to load the punch.'],
      [0.48, 'Swing', 'Lead foot pivots in. Hip and shoulder turn together, the arm stays bent at 90 degrees.'],
      [0.6, 'Impact', 'Elbow at fist height, forearm horizontal, fist lands on the side of the jaw.'],
      [1, 'Recover', 'Hand returns to the cheek, hips turn back, weight resettles.'],
    ],
    marks: [mk(0.44, 0.65, 'A', 'lGlove', 'Contact: side of jaw'), mk(0.44, 0.65, 'A', 'lElbow', 'Elbow at fist height', 0.14), mk(0.3, 0.65, 'A', 'lFoot', 'Lead foot pivots in')],
    cues: ['Elbow stays at the height of the fist, arm at 90 degrees', 'Power comes from the lead foot pivot and the hip turn', 'Rear hand glued to the cheek the whole way'],
    partner: 'Covers with the far-side forearm',
  },
  {
    key: '4',
    group: 'strike',
    name: 'Rear uppercut',
    side: 'Rear hand',
    dur: 1.3,
    a: UPPERCUT,
    b: chinUp(0.5),
    trace: 'rGlove',
    peak: 0.56,
    focus: ['rSh', 'rEl', 'rKnee', 'spine'],
    phases: [
      [0.3, 'Dip', 'Knees bend and the rear shoulder dips. The hand stays up, only the body drops.'],
      [0.5, 'Lift', 'Legs and hips drive upward. The arm follows with the palm turned toward you.'],
      [0.62, 'Impact', 'Fist lands under the chin, elbow still bent, head stays behind the lead shoulder.'],
      [1, 'Recover', 'Hand returns to the chin, knees stay soft.'],
    ],
    marks: [mk(0.46, 0.67, 'A', 'rGlove', 'Contact: under the chin'), mk(0.25, 0.5, 'A', 'rKnee', 'Legs drive up')],
    cues: ['Dip the rear shoulder and bend the knees, do not drop the hand', 'Drive up with the legs and hips, arm follows', 'Fist travels up the centre, palm facing you'],
    partner: 'Chin lifts, weight goes to the heels',
  },
  {
    key: '5',
    group: 'strike',
    name: 'Lead elbow',
    side: 'Lead arm',
    dur: 1.2,
    a: ELBOW,
    b: coverRight(0.5),
    trace: 'lElbow',
    peak: 0.56,
    focus: ['lSh', 'lEl', 'spine'],
    phases: [
      [0.3, 'Load', 'Step into clinch range. Lead hand rises to the ear with the forearm folded tight.'],
      [0.5, 'Swing', 'Hip and shoulder turn. The elbow point travels horizontally across.'],
      [0.62, 'Impact', 'The point of the elbow lands across the jaw or temple, rear hand covering.'],
      [1, 'Recover', 'Arm unfolds back to guard, hips turn back.'],
    ],
    marks: [mk(0.46, 0.67, 'A', 'lElbow', 'Contact: point of the elbow'), mk(0.25, 0.67, 'A', 'lGlove', 'Hand stays by own ear', 0.14)],
    cues: ['Hand stays by your own ear, forearm folded tight', 'Strike with the point of the elbow, horizontal across the face', 'Step in: elbows need clinch range'],
    partner: 'Covers with the far-side forearm',
  },
  {
    key: '6',
    group: 'strike',
    name: 'Rear knee',
    side: 'Rear leg',
    dur: 1.3,
    a: KNEE,
    b: hunch(0.55),
    trace: 'rKnee',
    peak: 0.62,
    focus: ['rHip', 'rKnee', 'lSh', 'rSh', 'lEl', 'rEl'],
    phases: [
      [0.3, 'Grip', 'Hands reach for the back of the head and neck, elbows tight together.'],
      [0.55, 'Drive', 'Hands pull down as the rear knee drives up. Hips push forward, torso leans back.'],
      [0.68, 'Impact', 'Knee spears into the body with toes pointed down. Standing leg on the ball of the foot.'],
      [1, 'Recover', 'Foot returns behind, hands come back to guard.'],
    ],
    marks: [mk(0.5, 0.72, 'A', 'rKnee', 'Contact: body'), mk(0.28, 0.72, 'A', 'lGlove', 'Pull the head down'), mk(0.5, 0.72, 'A', 'rFoot', 'Toes point down', 0.12)],
    cues: ['Hands pull down and in as the knee drives up', 'Hips push forward, torso leans back slightly', 'Point the toes down to spear with the knee'],
    partner: 'Hunches and drops the elbows to cover the body',
  },
  {
    key: '7',
    group: 'strike',
    name: 'Teep',
    side: 'Lead leg, push kick',
    dur: 1.3,
    a: TEEP,
    b: pushedBack(0.5),
    trace: 'lFoot',
    peak: 0.56,
    focus: ['lHip', 'lKnee'],
    phases: [
      [0.3, 'Chamber', 'Lead knee lifts high toward the chest. Standing leg bends slightly, hands stay up.'],
      [0.5, 'Extend', 'Hip pushes through as the leg straightens. Torso leans back to balance.'],
      [0.62, 'Impact', 'Ball of the foot lands on the belly or hip and pushes the partner away.'],
      [0.75, 'Re-chamber', 'Knee pulls back before the foot comes down.'],
      [1, 'Set down', 'Foot returns to stance.'],
    ],
    marks: [mk(0.46, 0.67, 'A', 'lFoot', 'Contact: ball of foot on belly'), mk(0.2, 0.42, 'A', 'lKnee', 'Chamber: knee to chest')],
    cues: ['Knee up first, then push the hip through', 'Lean back a little to stay balanced and keep the head away', 'Contact with the ball of the foot, then re-chamber before setting down'],
    partner: 'Pushed back a full step',
  },
  {
    key: '8',
    group: 'strike',
    name: 'Rear roundhouse',
    side: 'Rear leg',
    dur: 1.6,
    a: ROUNDHOUSE,
    b: checkLeft(0.5),
    trace: 'rFoot',
    peak: 0.55,
    focus: ['rHip', 'rKnee', 'lHip', 'spine'],
    phases: [
      [0.2, 'Step', 'Lead foot steps out at an angle, heel turning toward the target.'],
      [0.36, 'Chamber', 'Rear knee swings up and across. Standing foot pivots, torso leans away.'],
      [0.5, 'Swing', 'Hip turns over the standing leg. The shin whips across.'],
      [0.6, 'Impact', 'Shin lands on the thigh or ribs. Rear arm swings down for balance, lead hand up.'],
      [0.74, 'Re-chamber', 'Knee folds back before the leg comes down.'],
      [1, 'Reset', 'Foot returns behind into stance.'],
    ],
    marks: [mk(0.46, 0.65, 'A', 'rKnee', 'Contact: shin on thigh or ribs'), mk(0.15, 0.65, 'A', 'lFoot', 'Standing foot pivots'), mk(0.46, 0.65, 'A', 'rGlove', 'Rear arm swings for balance', 0.12)],
    cues: ['Small step out with the lead foot, heel turns toward the target', 'Hip turns over, torso leans away from the kick', 'Shin lands on the thigh or ribs, rear arm swings for balance'],
    partner: 'Checks with the near-side shin',
  },
  {
    key: '9',
    group: 'strike',
    name: 'Outside slip',
    side: 'Defence vs jab',
    dur: 1.2,
    a: SLIP,
    b: JAB,
    trace: null,
    peak: 0.45,
    focus: ['spine', 'head'],
    phases: [
      [0.38, 'Slip', 'Knees bend and the torso rotates. The head moves outside the jab, eyes on the partner.'],
      [0.55, 'Hold', 'Hands stay up. The body is loaded to counter with the cross.'],
      [1, 'Return', 'Return to guard on the centre line.'],
    ],
    marks: [mk(0.3, 0.6, 'A', 'head', 'Head moves off the line'), mk(0.3, 0.5, 'B', 'lGlove', 'Jab passes the ear')],
    cues: ['Bend at the knees and waist, move the head off the centre line', 'Eyes stay on the partner, do not look down', 'Return to guard ready to counter with the cross'],
    partner: 'Throws the jab you slip',
  },
  {
    key: '0',
    group: 'strike',
    name: 'Leg check',
    side: 'Defence vs roundhouse',
    dur: 1.6,
    a: CHECK,
    b: ROUNDHOUSE,
    trace: null,
    peak: 0.5,
    focus: ['lHip', 'lKnee'],
    phases: [
      [0.38, 'Lift', 'Lead knee lifts and the shin turns outward to meet the kick. Weight stays on the standing leg.'],
      [0.56, 'Absorb', 'Kick lands on the shin. Hands stay high.'],
      [1, 'Set down', 'Foot returns straight back down into stance.'],
    ],
    marks: [mk(0.34, 0.62, 'A', 'lKnee', 'Shin meets the kick'), mk(0.44, 0.62, 'B', 'rKnee', 'Partner\u2019s shin', 0.12)],
    cues: ['Lift the knee and turn the shin out to meet the kick', 'Keep your weight on the standing leg, hands high', 'Set the foot straight back down into stance'],
    partner: 'Throws the roundhouse you check',
  },
  {
    key: 'Q',
    group: 'grapple',
    name: 'Collar tie',
    side: 'Clinch entry',
    dur: 1.8,
    a: TIE_A,
    b: TIE_B,
    trace: null,
    needsPartner: true,
    peak: 0.7,
    focus: ['lSh', 'rSh', 'lEl', 'rEl'],
    phases: [
      [0.3, 'Step in', 'Close the distance behind a strike. Hands come forward, palms in.'],
      [0.5, 'Grip', 'Both hands cup the back of the head and neck. Elbows pinch together so the head cannot slip out.'],
      [0.7, 'Snap down', 'Weight drops and the elbows pull down and in. The partner\u2019s posture breaks.'],
      [0.85, 'Control', 'Keep the head below yours. Knees and elbows are available from here.'],
      [1, 'Reset', ''],
    ],
    marks: [mk(0.45, 0.9, 'A', 'lGlove', 'Grip: back of the head'), mk(0.45, 0.9, 'A', 'rGlove', 'Grip: back of the neck', 0.14), mk(0.45, 0.9, 'A', 'lElbow', 'Elbows pinch in', 0.12), mk(0.65, 0.9, 'B', 'head', 'Posture broken', 0.22)],
    cues: ['Step in behind the jab, hands go to the back of the head and neck', 'Elbows squeeze together so the head cannot slide out', 'Snap the head down with the body, not the arms, to set up knees'],
    partner: 'Posture breaks, head pulled down',
  },
  {
    key: 'W',
    group: 'grapple',
    name: 'Double leg',
    side: 'Takedown',
    dur: 1.8,
    a: DOUBLE_A,
    b: DOUBLE_B,
    trace: null,
    needsPartner: true,
    peak: 0.6,
    focus: ['lSh', 'rSh', 'lEl', 'rEl', 'lHip', 'lKnee', 'head'],
    phases: [
      [0.25, 'Level change', 'Knees bend to drop the hips. Back straight, head up, hands in front.'],
      [0.45, 'Penetrate', 'Lead knee lands between the partner\u2019s feet. Head goes outside their hip, arms wrap behind the knees.'],
      [0.65, 'Drive', 'Legs drive forward and up. Hands pull the knees in toward you.'],
      [0.8, 'Lift', 'Partner\u2019s weight is tipped back onto the heels.'],
      [1, 'Reset', ''],
    ],
    marks: [mk(0.4, 0.85, 'A', 'lGlove', 'Grip: behind the knee'), mk(0.4, 0.85, 'A', 'rGlove', 'Grip: behind the knee', 0.14), mk(0.4, 0.85, 'A', 'head', 'Head outside the hip'), mk(0.4, 0.62, 'A', 'lKnee', 'Lead knee between the feet')],
    cues: ['Change level with the knees, back stays straight, head up', 'Lead knee lands between the feet, head to the outside of the hip', 'Arms wrap behind the knees, drive forward and up with the legs'],
    partner: 'Lifted, weight tipped onto the heels',
  },
  {
    key: 'E',
    group: 'grapple',
    name: 'Single leg',
    side: 'Takedown',
    dur: 1.8,
    a: SINGLE_A,
    b: SINGLE_B,
    trace: null,
    needsPartner: true,
    peak: 0.65,
    focus: ['lSh', 'rSh', 'lEl', 'rEl', 'head'],
    phases: [
      [0.25, 'Level change', 'Knees bend to drop the hips. Back straight, head up.'],
      [0.45, 'Catch', 'Both arms wrap the lead leg above the knee. Head tight to the inside of the chest.'],
      [0.65, 'Lift', 'Leg lifted to your hip. The partner is on one foot.'],
      [0.8, 'Run the pipe', 'Turn and drive to take the partner down.'],
      [1, 'Reset', ''],
    ],
    marks: [mk(0.4, 0.85, 'A', 'lGlove', 'Grip: above the knee'), mk(0.4, 0.85, 'A', 'rGlove', 'Hands locked', 0.14), mk(0.4, 0.85, 'A', 'head', 'Head tight to the chest'), mk(0.6, 0.85, 'B', 'lFoot', 'Leg lifted to hip', 0.12)],
    cues: ['Level change, then catch the lead leg with both arms above the knee', 'Head stays tight to the inside of the chest', 'Lift the leg to your hip, then turn and drive to finish'],
    partner: 'Left hopping on one leg',
  },
  {
    key: 'R',
    group: 'grapple',
    name: 'Hip toss',
    side: 'Throw, o-goshi',
    dur: 2.0,
    a: TOSS_A,
    b: TOSS_B,
    trace: null,
    needsPartner: true,
    peak: 0.6,
    focus: ['lSh', 'rSh', 'lEl', 'rEl', 'root', 'lHip', 'rHip'],
    phases: [
      [0.2, 'Grip', 'Collar and sleeve grip, feet close to the partner.'],
      [0.4, 'Turn in', 'Step across and turn so your back is to the partner. Knees bent, hips below their hips, arm around the waist.'],
      [0.6, 'Load and throw', 'Legs straighten and the torso bends forward. The partner rolls over your hip.'],
      [0.78, 'Finish', 'Partner lands on the back at your feet. Keep the sleeve grip.'],
      [1, 'Hold', ''],
    ],
    marks: [mk(0.35, 0.65, 'A', 'hips', 'Hips under the partner'), mk(0.35, 0.65, 'A', 'rGlove', 'Arm around the waist', 0.14), mk(0.35, 0.8, 'A', 'lGlove', 'Sleeve pull'), mk(0.5, 0.66, 'B', 'hips', 'Loaded on the hip', 0.18)],
    cues: ['Step across and turn so your back is to the partner, knees bent, hips lower than theirs', 'Arm around the waist, pull the sleeve arm across your chest', 'Straighten the legs and bend forward: the partner rolls over your hip'],
    partner: 'Loaded on the hip, lands on the back at your feet',
  },
  {
    key: 'T',
    group: 'grapple',
    name: 'Sprawl',
    side: 'Defence vs double leg',
    dur: 1.8,
    a: SPRAWL_A,
    b: SHOT_STUFFED,
    trace: null,
    needsPartner: true,
    peak: 0.55,
    focus: ['lHip', 'rHip', 'lKnee', 'rKnee', 'spine'],
    phases: [
      [0.28, 'Read the shot', 'Hands drop to meet the shoulders as the partner changes level.'],
      [0.5, 'Sprawl', 'Legs shoot back and hips drop. Chest lands on the upper back, head up.'],
      [0.75, 'Pressure', 'Weight stays heavy. Hands on the shoulders or an overhook, ready to circle behind.'],
      [1, 'Reset', ''],
    ],
    marks: [mk(0.45, 0.8, 'A', 'chest', 'Chest heavy on the back'), mk(0.45, 0.8, 'A', 'hips', 'Hips down and back', 0.14), mk(0.45, 0.8, 'B', 'head', 'Shot stuffed', 0.2)],
    cues: ['Throw the legs back and hips down the moment the level changes', 'Chest lands heavy on the partner\u2019s upper back, head up', 'Hands on the shoulders or an overhook, then circle behind'],
    partner: 'Shot stuffed, flattened under your hips',
  },
  {
    key: 'Y',
    group: 'grapple',
    name: 'Mount',
    side: 'Top position',
    dur: 2.0,
    a: MOUNT_A,
    b: MOUNT_B,
    trace: null,
    needsPartner: true,
    cam: GROUND_CAM,
    peak: 0.45,
    focus: ['lHip', 'rHip', 'lKnee', 'rKnee', 'root'],
    phases: [
      [0.45, 'Base', 'Knees squeeze the ribs. Hips sit heavy on the belly, hands post wide.'],
      [0.65, 'Posture up', 'Sit up to strike only once the partner stops bridging.'],
      [0.85, 'Hold', 'Stay heavy. If the partner bridges, post a hand and drop the chest.'],
      [1, 'Settle', ''],
    ],
    marks: [mk(0, 1, 'A', 'lKnee', 'Knees tight to the ribs'), mk(0, 1, 'A', 'rKnee', 'Knees tight to the ribs', 0.14), mk(0, 1, 'A', 'hips', 'Hips heavy on the belly', 0.2), mk(0.6, 0.9, 'B', 'hips', 'Partner bridges', -0.1)],
    cues: ['Knees tight against the ribs, hips heavy over the belly', 'Hands posted wide when the partner bridges, chest low', 'Posture up only to strike, then sink back down'],
    partner: 'Frames and bridges to unbalance you',
  },
  {
    key: 'U',
    group: 'grapple',
    name: 'Closed guard',
    side: 'Inside the guard',
    dur: 2.0,
    a: GUARD_A,
    b: GUARD_B,
    trace: null,
    needsPartner: true,
    cam: GROUND_CAM,
    peak: 0.4,
    focus: ['spine', 'head', 'lSh', 'rSh'],
    phases: [
      [0.4, 'Posture', 'Knees wide, hips under you, back straight. Hands on the hips or chest.'],
      [0.6, 'Grip fight', 'The partner pulls the head. Posture back up and strip the grips.'],
      [0.85, 'Hold', 'Stay upright. Break the ankles open before trying to pass.'],
      [1, 'Settle', ''],
    ],
    marks: [mk(0, 1, 'B', 'lFoot', 'Ankles locked behind your back'), mk(0, 1, 'A', 'lGlove', 'Hands on hips or chest', 0.14), mk(0, 1, 'A', 'head', 'Head up, back straight', 0.22), mk(0.55, 0.9, 'B', 'rGlove', 'Partner pulls the head', 0.1)],
    cues: ['Knees wide, hips under you, back straight: never bend forward into the guard', 'Hands on the hips or chest to stop the partner sitting up', 'Break the ankles open before trying to pass'],
    partner: 'Pulls your head down to break posture',
  },
  {
    key: 'I',
    group: 'grapple',
    name: 'Side control',
    side: 'Top position',
    dur: 2.0,
    a: SIDE_A,
    b: SIDE_B,
    trace: null,
    needsPartner: true,
    cam: GROUND_CAM,
    peak: 0.45,
    focus: ['lSh', 'lEl', 'rSh', 'rEl', 'spine'],
    phases: [
      [0.45, 'Pin', 'Chest to chest, hips low, legs sprawled back. Crossface arm under the head.'],
      [0.65, 'Shoulder pressure', 'Drive the shoulder into the jaw when the partner frames.'],
      [0.85, 'Hold', 'Stay chest to chest. Follow the hips if the partner turns.'],
      [1, 'Settle', ''],
    ],
    marks: [mk(0, 1, 'A', 'chest', 'Chest to chest'), mk(0, 1, 'A', 'lGlove', 'Crossface: arm under the head', 0.14), mk(0, 1, 'A', 'rGlove', 'Control the near hip', 0.14), mk(0.6, 0.9, 'A', 'lShoulder', 'Shoulder into the jaw', 0.22)],
    cues: ['Chest to chest, hips low, legs sprawled back for base', 'Crossface arm under the head, other arm controls the near hip', 'Drive the shoulder into the jaw when the partner frames'],
    partner: 'Frames on your neck and hip to make space',
  },
  {
    key: 'O',
    group: 'grapple',
    name: 'Rear naked choke',
    side: 'Back control',
    dur: 2.0,
    a: BACK_A,
    b: BACK_B,
    trace: null,
    needsPartner: true,
    cam: [0, 0.7, 1.5],
    peak: 0.85,
    focus: ['lHip', 'rHip', 'lKnee', 'rKnee', 'rSh', 'rEl', 'lSh', 'lEl'],
    phases: [
      [0.35, 'Hooks in', 'Both feet hook inside the thighs. Chest glued to the back.'],
      [0.6, 'Seatbelt', 'One arm over the shoulder, one under the arm, hands joined on the chest.'],
      [0.85, 'Choke', 'Choking arm slides under the chin, hand to your own bicep. Other hand behind the head. Squeeze the elbows together.'],
      [1, 'Release', ''],
    ],
    marks: [mk(0, 1, 'A', 'lFoot', 'Hook inside the thigh'), mk(0, 1, 'A', 'rFoot', 'Hook inside the thigh', 0.14), mk(0.55, 0.95, 'A', 'rGlove', 'Hand on own bicep', 0.14), mk(0.55, 0.95, 'A', 'lGlove', 'Hand behind the head'), mk(0.55, 0.95, 'B', 'head', 'Forearm under the chin', -0.08)],
    cues: ['Both hooks in, chest glued to the partner\u2019s back', 'Choking arm slides under the chin, hand to your own bicep', 'Other hand behind the head, squeeze with the elbows and expand the chest'],
    partner: 'Defends the hands, then taps',
  },
  {
    key: 'P',
    group: 'grapple',
    name: 'Armbar',
    side: 'From mount',
    dur: 2.2,
    a: ARMBAR_A,
    b: ARMBAR_B,
    trace: null,
    needsPartner: true,
    cam: GROUND_CAM,
    peak: 0.8,
    focus: ['lHip', 'rHip', 'lKnee', 'rKnee', 'lSh', 'rSh', 'lEl', 'rEl'],
    phases: [
      [0.15, 'Mount', 'Start heavy in mount with one arm isolated.'],
      [0.4, 'Spin', 'Hug the arm to your chest, post the far hand, swing a leg across the face and spin around the shoulder.'],
      [0.65, 'Fall back', 'Sit close to the shoulder and fall back. Knees pinch the arm.'],
      [0.85, 'Extend', 'Hips lift, thumb points to the ceiling. The elbow bends the wrong way.'],
      [1, 'Hold', ''],
    ],
    marks: [mk(0.6, 1, 'A', 'hips', 'Hips tight to the shoulder'), mk(0.6, 1, 'A', 'lKnee', 'Knees pinch the arm', 0.14), mk(0.75, 1, 'B', 'lElbow', 'Elbow hyperextends', 0.12), mk(0.75, 1, 'A', 'lGlove', 'Wrist to chest, thumb up', 0.22)],
    cues: ['Isolate one arm, hug it to your chest, post the far hand', 'Spin around the shoulder, leg across the face, knees pinch tight', 'Fall back, hips up, thumb pointing to the ceiling'],
    partner: 'Arm trapped and extended, taps',
  },
];

export const COMBO_DEFS: ComboDefinition[] = [
  {
    key: 'Z',
    name: 'Jab, cross',
    side: 'The one-two',
    steps: ['1', '2'],
    cues: [
      'The jab measures distance and blinds, the cross follows before the jab hand is home',
      'Hips turn back as the jab retracts so the cross has a full turn to load',
      'Both hands return to the chin',
    ],
  },
  {
    key: 'X',
    name: 'Jab, cross, hook',
    side: 'The one-two-three',
    steps: ['1', '2', '3'],
    cues: [
      'The cross turns the hips one way, the hook turns them straight back',
      'Weight shifts rear to lead on the cross, then the lead foot pivots for the hook',
      'Keep the head moving off line between punches',
    ],
  },
  {
    key: 'N',
    name: 'Teep, cross',
    side: 'Kick to punch',
    steps: ['7', '2'],
    cues: [
      'The teep pushes the partner into range for the cross',
      'Set the kicking foot down forward so the cross steps through',
      'Hands stay up during the kick',
    ],
  },
  {
    key: 'H',
    name: 'Collar tie, knee',
    side: 'Clinch to strike',
    steps: ['Q', '6'],
    cues: [
      'Break posture first, then knee',
      'Pull the head toward the knee, do not swing the knee at the head',
      'Elbows stay tight the whole time',
    ],
  },
  {
    key: 'J',
    name: 'Double leg, mount',
    side: 'Takedown to top',
    steps: ['W', 'Y'],
    cues: [
      'Finish the drive before you try to pass; a half-finished takedown gets reversed',
      'Land in side control or step straight over the hips to mount',
      'Settle heavy before posturing up',
    ],
  },
  {
    key: 'K',
    name: 'Cross, hook, knee',
    side: 'Long to short range',
    steps: ['2', '3', '6'],
    cues: [
      'Each strike closes distance: punch range, hook range, clinch range',
      'The hook turns the hips to load the rear knee',
      'Hands switch from punching to pulling the head',
    ],
  },
];
