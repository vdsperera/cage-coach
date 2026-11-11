/**
 * Comprehensive Kinematic & Biomechanical Unit Tests for Cagecraft 3D
 * Verifies mathematical correctness, symmetry mirroring, and timeline compilation
 */

import { describe, it, expect } from 'vitest';
import * as THREE from 'three';

import {
  ease,
  poseAt,
  mirrorPose,
  fullPose,
  sideName,
  STANCE,
  JOINTS,
} from '../../src/engine/kinematics';
import { angleAt } from '../../src/engine/telemetry';
import { buildCombo, compileAllTechniques } from '../../src/engine/combos';
import { BASE_TECHNIQUES, COMBO_DEFS } from '../../src/data/techniques';
import type { Pose, Keyframe } from '../../src/types/kinematics';

describe('Biomechanical Angle Calculations (angleAt)', () => {
  it('calculates orthogonal 90-degree right angle accurately', () => {
    const a = new THREE.Vector3(1, 0, 0);
    const b = new THREE.Vector3(0, 0, 0);
    const c = new THREE.Vector3(0, 1, 0);

    const angle = angleAt(a, b, c);
    expect(Math.round(angle)).toBe(90);
  });

  it('calculates straight 180-degree angle accurately', () => {
    const a = new THREE.Vector3(1, 0, 0);
    const b = new THREE.Vector3(0, 0, 0);
    const c = new THREE.Vector3(-1, 0, 0);

    const angle = angleAt(a, b, c);
    expect(Math.round(angle)).toBe(180);
  });

  it('calculates acute 45-degree angle accurately', () => {
    const a = new THREE.Vector3(1, 0, 0);
    const b = new THREE.Vector3(0, 0, 0);
    const c = new THREE.Vector3(1, 1, 0);

    const angle = angleAt(a, b, c);
    expect(Math.round(angle)).toBe(45);
  });

  it('calculates zero-degree collinear vectors without NaN', () => {
    const a = new THREE.Vector3(2, 0, 0);
    const b = new THREE.Vector3(0, 0, 0);
    const c = new THREE.Vector3(5, 0, 0);

    const angle = angleAt(a, b, c);
    expect(Math.round(angle)).toBe(0);
  });

  it('handles zero-length edge case safely without division by zero', () => {
    const a = new THREE.Vector3(0, 0, 0);
    const b = new THREE.Vector3(0, 0, 0);
    const c = new THREE.Vector3(0, 0, 0);

    const angle = angleAt(a, b, c);
    expect(Number.isNaN(angle)).toBe(false);
  });
});

describe('Parametric Easing Function (ease)', () => {
  it('anchors boundaries exactly at 0 and 1', () => {
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
  });

  it('maintains midpoint symmetry at t = 0.5', () => {
    expect(ease(0.5)).toBe(0.5);
  });

  it('is strictly monotonic increasing across [0, 1]', () => {
    let prev = -1;
    for (let t = 0; t <= 1; t += 0.05) {
      const val = ease(t);
      expect(val).toBeGreaterThanOrEqual(prev);
      prev = val;
    }
  });

  it('clamps values outside [0, 1] range', () => {
    expect(ease(-0.5)).toBeLessThanOrEqual(0);
    expect(ease(1.5)).toBeGreaterThanOrEqual(1);
  });
});

describe('Southpaw Bilateral Symmetry Mirroring (mirrorPose)', () => {
  it('inverts position X and preserves Y and Z coordinates', () => {
    const pose: Pose = {
      ...STANCE,
      pos: [0.35, 1.2, -0.4],
    };

    const mirrored = mirrorPose(pose);
    expect(mirrored.pos[0]).toBe(-0.35);
    expect(mirrored.pos[1]).toBe(1.2);
    expect(mirrored.pos[2]).toBe(-0.4);
  });

  it('swaps contralateral limb joint rotations correctly', () => {
    const pose: Pose = {
      ...STANCE,
      lSh: [-70, -20, 15],
      rSh: [-40, 30, -10],
      lEl: [-90, 0, 0],
      rEl: [-120, 0, 0],
    };

    const mirrored = mirrorPose(pose);
    // Left shoulder should receive inverted right shoulder angles: [rSh[0], -rSh[1], -rSh[2]]
    expect(mirrored.lSh).toEqual([-40, -30, 10]);
    // Right shoulder should receive inverted left shoulder angles: [lSh[0], -lSh[1], -lSh[2]]
    expect(mirrored.rSh).toEqual([-70, 20, -15]);
    // Left elbow receives right elbow angles
    expect(mirrored.lEl).toEqual([-120, 0, 0]);
    // Right elbow receives left elbow angles
    expect(mirrored.rEl).toEqual([-90, 0, 0]);
  });

  it('negates Y and Z Euler rotations on axial joints (spine, head, root)', () => {
    const pose: Pose = {
      ...STANCE,
      root: [10, 25, -15],
      spine: [5, -30, 12],
      head: [8, 14, -6],
    };

    const mirrored = mirrorPose(pose);
    expect(mirrored.root).toEqual([10, -25, 15]);
    expect(mirrored.spine).toEqual([5, 30, -12]);
    expect(mirrored.head).toEqual([8, -14, 6]);
  });

  it('is an involution: mirroring twice restores original pose', () => {
    const pose: Pose = {
      pos: [0.12, -0.05, 0.45],
      root: [5, 12, -8],
      spine: [4, -15, 6],
      head: [10, -5, 3],
      lSh: [-65, -15, 10],
      lEl: [-105, 5, -2],
      lWrist: [0, 10, -80],
      rSh: [-60, 22, -15],
      rEl: [-115, -4, 5],
      rWrist: [5, -5, 0],
      lHip: [-22, 10, -5],
      lKnee: [25, -5, 2],
      lAnkle: [0, 0, 0],
      rHip: [18, -12, 6],
      rKnee: [30, 8, -4],
      rAnkle: [0, 0, 0],
    };

    const doubleMirrored = mirrorPose(mirrorPose(pose));
    for (const joint of [...JOINTS, 'pos'] as const) {
      expect(doubleMirrored[joint]).toEqual(pose[joint]);
    }
  });
});

describe('Pose Interpolation Engine (poseAt)', () => {
  it('returns initial pose at t = 0', () => {
    const frames: Keyframe[] = [
      { t: 0, p: { pos: [0, 0, 0] } },
      { t: 0.5, p: { pos: [0, 0, 0.5] } },
      { t: 1, p: { pos: [0, 0, 1.0] } },
    ];

    const result = poseAt(frames, 0);
    expect(result.pos[2]).toBe(0);
  });

  it('returns final pose at t = 1', () => {
    const frames: Keyframe[] = [
      { t: 0, p: { pos: [0, 0, 0] } },
      { t: 0.5, p: { pos: [0, 0, 0.5] } },
      { t: 1, p: { pos: [0, 0, 1.0] } },
    ];

    const result = poseAt(frames, 1);
    expect(result.pos[2]).toBe(1.0);
  });

  it('interpolates intermediate timestamps smoothly with easing', () => {
    const frames: Keyframe[] = [
      { t: 0, p: { spine: [0, 0, 0] } },
      { t: 1, p: { spine: [10, 20, 30] } },
    ];

    const mid = poseAt(frames, 0.5);
    // At t=0.5, cubic ease(0.5) is exactly 0.5
    expect(mid.spine[0]).toBe(5);
    expect(mid.spine[1]).toBe(10);
    expect(mid.spine[2]).toBe(15);
  });

  it('fills missing partial pose joints with STANCE defaults', () => {
    const frames: Keyframe[] = [
      { t: 0 },
      { t: 1, p: { head: [15, 0, 0] } },
    ];

    const pose = poseAt(frames, 0);
    expect(pose.lSh).toEqual(STANCE.lSh);
    expect(pose.rKnee).toEqual(STANCE.rKnee);
  });
});

describe('Combination Compiler Service (buildCombo & compileAllTechniques)', () => {
  it('successfully compiles all 20 base techniques and 6 combinations', () => {
    const compiled = compileAllTechniques(BASE_TECHNIQUES, COMBO_DEFS);
    expect(compiled.length).toBe(26);
  });

  it('builds a continuous combo sequence from constituent strikes', () => {
    const comboDef = COMBO_DEFS[0]; // 1-2 Combo (Jab + Cross)
    const combo = buildCombo(comboDef, BASE_TECHNIQUES);

    expect(combo.key).toBe('Z');
    expect(combo.group).toBe('combo');
    expect(combo.dur).toBeGreaterThan(0);
    expect(combo.a.length).toBeGreaterThanOrEqual(4);
    expect(combo.b.length).toBeGreaterThanOrEqual(4);
    expect(combo.phases.length).toBeGreaterThanOrEqual(2);
    expect(combo.ranges && combo.ranges.length === 2).toBe(true);
  });

  it('assigns strictly ascending timestamp progression within combo keyframes', () => {
    const combo = buildCombo(COMBO_DEFS[0], BASE_TECHNIQUES);
    let prevT = -1;
    for (const frame of combo.a) {
      expect(frame.t).toBeGreaterThanOrEqual(prevT);
      expect(frame.t).toBeLessThanOrEqual(1.0);
      prevT = frame.t;
    }
  });

  it('includes contact marks from constituent strikes', () => {
    const combo = buildCombo(COMBO_DEFS[0], BASE_TECHNIQUES);
    expect(combo.marks.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Bilateral Joint Identifier Localizer (sideName)', () => {
  it('returns original name when southpaw is false', () => {
    expect(sideName('lShoulder', false)).toBe('lShoulder');
    expect(sideName('rGlove', false)).toBe('rGlove');
    expect(sideName('head', false)).toBe('head');
  });

  it('inverts bilateral prefix when southpaw is true', () => {
    expect(sideName('lShoulder', true)).toBe('rShoulder');
    expect(sideName('rShoulder', true)).toBe('lShoulder');
    expect(sideName('lGlove', true)).toBe('rGlove');
    expect(sideName('rGlove', true)).toBe('lGlove');
  });

  it('preserves neutral medial markers without mutation', () => {
    expect(sideName('head', true)).toBe('head');
    expect(sideName('neck', true)).toBe('neck');
    expect(sideName('chest', true)).toBe('chest');
    expect(sideName('hips', true)).toBe('hips');
  });
});
