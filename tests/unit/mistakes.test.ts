import { describe, it, expect } from 'vitest';
import { TECHNIQUE_MISTAKES } from '../../src/data/mistakes';
import { BASE_TECHNIQUES, COMBO_DEFS } from '../../src/data/techniques';
import { compileAllTechniques } from '../../src/engine/combos';
import { mirrorPose, JOINTS } from '../../src/engine/kinematics';
import type { Pose } from '../../src/types/kinematics';

const allTechniques = compileAllTechniques(BASE_TECHNIQUES, COMBO_DEFS).map((t) => {
  if (TECHNIQUE_MISTAKES[t.key]) {
    t.mistake = TECHNIQUE_MISTAKES[t.key];
  }
  return t;
});

describe('Technique Mistakes & Form Correction Subsystem', () => {
  it('defines comprehensive mistakes for striking and grappling foundations', () => {
    const coreKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'W', 'E'];
    for (const key of coreKeys) {
      const mistake = TECHNIQUE_MISTAKES[key];
      expect(mistake).toBeDefined();
      expect(mistake.flaw.length).toBeGreaterThan(5);
      expect(mistake.consequence.length).toBeGreaterThan(10);
      expect(mistake.correction.length).toBeGreaterThan(10);
      expect(mistake.errorPose).toBeDefined();
    }
  });

  it('guarantees all error pose joint rotations are valid numbers within [-180, 180]', () => {
    for (const [key, mistake] of Object.entries(TECHNIQUE_MISTAKES)) {
      for (const joint of JOINTS) {
        const angles = mistake.errorPose[joint];
        if (angles) {
          expect(angles).toHaveLength(3);
          for (const angle of angles) {
            expect(Number.isFinite(angle)).toBe(true);
            expect(angle).toBeGreaterThanOrEqual(-180);
            expect(angle).toBeLessThanOrEqual(180);
          }
        }
      }
    }
  });

  it('enriches techniques in allTechniques with mistake definitions', () => {
    const jab = allTechniques.find((t) => t.key === '1');
    expect(jab).toBeDefined();
    expect(jab?.mistake).toBeDefined();
    expect(jab?.mistake?.flaw).toContain('Rear Guard');

    const cross = allTechniques.find((t) => t.key === '2');
    expect(cross?.mistake?.flaw).toContain('Flat Rear Foot');

    const roundhouse = allTechniques.find((t) => t.key === '9');
    expect(roundhouse?.mistake?.flaw).toContain('Flat Base Foot');
  });

  it('verifies error poses can be mirrored for Southpaw stance without NaN or corruption', () => {
    for (const mistake of Object.values(TECHNIQUE_MISTAKES)) {
      const dummyFullPose: Pose = {
        pos: [0, 0, 0],
        root: [0, 0, 0],
        spine: [0, 0, 0],
        head: [0, 0, 0],
        lSh: [0, 0, 0],
        lEl: [0, 0, 0],
        lWrist: [0, 0, 0],
        rSh: [0, 0, 0],
        rEl: [0, 0, 0],
        rWrist: [0, 0, 0],
        lHip: [0, 0, 0],
        lKnee: [0, 0, 0],
        lAnkle: [0, 0, 0],
        rHip: [0, 0, 0],
        rKnee: [0, 0, 0],
        rAnkle: [0, 0, 0],
        ...mistake.errorPose,
      };

      const mirrored = mirrorPose(dummyFullPose);
      expect(mirrored).toBeDefined();
      for (const joint of JOINTS) {
        for (const coord of mirrored[joint]) {
          expect(Number.isFinite(coord)).toBe(true);
          expect(Number.isNaN(coord)).toBe(false);
        }
      }
    }
  });
});
