/**
 * Custom Combination Local-First Storage Manager for Cage Coach
 * Safely persists user-defined fight combinations in browser localStorage.
 */

import type { ComboDefinition } from '../types/kinematics';

const STORAGE_KEY = 'cagecraft_custom_combos_v1';
const MAX_CUSTOM_COMBOS = 50;

export class CustomComboStorage {
  public static load(): ComboDefinition[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed.filter((item): item is ComboDefinition => {
        return (
          typeof item === 'object' &&
          item !== null &&
          typeof item.key === 'string' &&
          typeof item.name === 'string' &&
          typeof item.side === 'string' &&
          Array.isArray(item.steps) &&
          item.steps.length >= 2 &&
          item.steps.every((s: unknown) => typeof s === 'string')
        );
      });
    } catch {
      return [];
    }
  }

  public static save(combos: ComboDefinition[]): boolean {
    try {
      const sanitized = combos.slice(0, MAX_CUSTOM_COMBOS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      return true;
    } catch {
      return false;
    }
  }

  public static add(combo: ComboDefinition): boolean {
    const existing = this.load();
    const filtered = existing.filter((c) => c.key !== combo.key);
    filtered.push(combo);
    return this.save(filtered);
  }

  public static remove(key: string): boolean {
    const existing = this.load();
    const filtered = existing.filter((c) => c.key !== key);
    return this.save(filtered);
  }
}

