/**
 * Core Kinematic & Biomechanical Type Definitions for Cagecraft 3D
 */

export type JointRotationOrder = 'YXZ' | 'XYZ';

export type JointIdentifier =
  | 'root'
  | 'spine'
  | 'head'
  | 'lSh'
  | 'lEl'
  | 'lWrist'
  | 'rSh'
  | 'rEl'
  | 'rWrist'
  | 'lHip'
  | 'lKnee'
  | 'lAnkle'
  | 'rHip'
  | 'rKnee'
  | 'rAnkle';

export type AnatomicalMarker =
  | 'hips'
  | 'chest'
  | 'neck'
  | 'head'
  | 'eyes'
  | 'lShoulder'
  | 'rShoulder'
  | 'lElbow'
  | 'rElbow'
  | 'lGlove'
  | 'rGlove'
  | 'lHipJoint'
  | 'rHipJoint'
  | 'lKnee'
  | 'rKnee'
  | 'lFoot'
  | 'rFoot';

export type Vector3Tuple = [number, number, number];

export interface Pose {
  pos: Vector3Tuple;
  root: Vector3Tuple;
  spine: Vector3Tuple;
  head: Vector3Tuple;
  lSh: Vector3Tuple;
  lEl: Vector3Tuple;
  lWrist: Vector3Tuple;
  rSh: Vector3Tuple;
  rEl: Vector3Tuple;
  rWrist: Vector3Tuple;
  lHip: Vector3Tuple;
  lKnee: Vector3Tuple;
  lAnkle: Vector3Tuple;
  rHip: Vector3Tuple;
  rKnee: Vector3Tuple;
  rAnkle: Vector3Tuple;
}

export interface Keyframe {
  t: number;
  p?: Partial<Pose>;
}

export interface ContactMark {
  t0: number;
  t1: number;
  who: 'A' | 'B';
  pt: AnatomicalMarker;
  label: string;
  dy?: number;
}

export type PhaseMilestone = [number, string, string];

export interface ComboSliceRange {
  tk: Technique;
  t0: number;
  t1: number;
}

export interface Technique {
  key: string;
  group: 'strike' | 'grapple' | 'combo';
  name: string;
  side: string;
  dur: number;
  a: Keyframe[];
  b: Keyframe[];
  trace?: AnatomicalMarker | null;
  peak: number;
  focus: JointIdentifier[];
  phases: PhaseMilestone[];
  marks: ContactMark[];
  cues: string[];
  partner: string;
  needsPartner?: boolean;
  cam?: Vector3Tuple;
  ranges?: ComboSliceRange[];
}

export interface ComboDefinition {
  key: string;
  name: string;
  side: string;
  steps: string[];
  cues: string[];
}

export interface TelemetryReadout {
  leadKneeFlexion: string;
  rearKneeFlexion: string;
  leadElbowExtension: string;
  rearElbowExtension: string;
  hipRotationYaw: string;
  torsoLean: string;
  headHeightMeters: string;
  leadHandHeightMeters: string;
}

export interface AppState {
  tech: number;
  mode: 'single' | 'spar';
  speed: 1 | 0.5 | 0.25;
  playing: boolean;
  t: number;
  cam: 0 | 1 | 2 | 3 | 4;
  src: 'clay' | 'mocap';
  ghosts: boolean;
  guides: boolean;
  step: boolean;
  stepOnce: boolean;
  split: boolean;
  drill: boolean;
  southpaw: boolean;
}

export interface DrillState {
  set: 'strike' | 'grapple' | 'combo' | 'all';
  gap: number;
  phase: 'idle' | 'wait' | 'perform' | 'show';
  at: number;
  last: number;
  pick?: number;
}

