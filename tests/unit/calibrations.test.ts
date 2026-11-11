import { describe, it, expect, beforeEach } from 'vitest';
import { PoseCalibrationStorage } from '../../src/storage/calibrations';
import type { Pose } from '../../src/types/kinematics';

const mockStorage: Record<string, string> = {};
globalThis.localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, val: string) => {
    mockStorage[key] = String(val);
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    for (const k in mockStorage) delete mockStorage[k];
  },
  length: 0,
  key: () => null,
};

describe('Pose Calibration Persistence Subsystem', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  it('returns empty overrides dictionary when localStorage is empty', () => {
    expect(PoseCalibrationStorage.loadAll()).toEqual({});
    expect(PoseCalibrationStorage.getOverride('1')).toBeNull();
  });

  it('safely saves and retrieves custom joint angle overrides', () => {
    const customJabOverride: Partial<Pose> = {
      rWrist: [0, -10, 15],
      rSh: [-85, 30, 0],
    };

    const saved = PoseCalibrationStorage.saveOverride('1', customJabOverride);
    expect(saved).toBe(true);

    const retrieved = PoseCalibrationStorage.getOverride('1');
    expect(retrieved).toBeDefined();
    expect(retrieved?.rWrist).toEqual([0, -10, 15]);
    expect(retrieved?.rSh).toEqual([-85, 30, 0]);
  });

  it('resets a specific technique override while retaining others', () => {
    PoseCalibrationStorage.saveOverride('1', { rWrist: [0, 0, 0] });
    PoseCalibrationStorage.saveOverride('2', { lWrist: [0, 0, 0] });

    expect(PoseCalibrationStorage.getOverride('1')).toBeDefined();
    expect(PoseCalibrationStorage.getOverride('2')).toBeDefined();

    PoseCalibrationStorage.resetOverride('1');
    expect(PoseCalibrationStorage.getOverride('1')).toBeNull();
    expect(PoseCalibrationStorage.getOverride('2')).toBeDefined();
  });

  it('clears all overrides when resetAll is invoked', () => {
    PoseCalibrationStorage.saveOverride('1', { rWrist: [0, 0, 0] });
    PoseCalibrationStorage.saveOverride('2', { lWrist: [0, 0, 0] });

    PoseCalibrationStorage.resetAll();
    expect(PoseCalibrationStorage.loadAll()).toEqual({});
  });

  it('handles corrupted localStorage payload gracefully without throwing', () => {
    globalThis.localStorage.setItem('cagecraft_calibrated_poses_v1', 'corrupted-json}{');
    expect(PoseCalibrationStorage.loadAll()).toEqual({});
    expect(PoseCalibrationStorage.getOverride('1')).toBeNull();
  });
});
