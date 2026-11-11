/**
 * Local-First Pose Calibration Storage Manager for Cage Coach
 * Safely persists custom joint calibration overrides in browser localStorage.
 */

import type { Pose } from '../types/kinematics';

const STORAGE_KEY = 'cagecraft_calibrated_poses_v1';

export class PoseCalibrationStorage {
  public static loadAll(): Record<string, Partial<Pose>> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        return {};
      }
      return parsed;
    } catch {
      return {};
    }
  }

  public static getOverride(techKey: string): Partial<Pose> | null {
    const all = this.loadAll();
    return all[techKey] || null;
  }

  public static saveOverride(techKey: string, pose: Partial<Pose>): boolean {
    try {
      const all = this.loadAll();
      all[techKey] = pose;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return true;
    } catch {
      return false;
    }
  }

  public static resetOverride(techKey: string): boolean {
    try {
      const all = this.loadAll();
      if (techKey in all) {
        delete all[techKey];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      }
      return true;
    } catch {
      return false;
    }
  }

  public static resetAll(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  }
}
