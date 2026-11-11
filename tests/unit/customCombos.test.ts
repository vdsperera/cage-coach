import { describe, it, expect, beforeEach } from 'vitest';
import { CustomComboStorage } from '../../src/storage/combos';
import { buildCombo } from '../../src/engine/combos';
import { BASE_TECHNIQUES } from '../../src/data/techniques';
import type { ComboDefinition } from '../../src/types/kinematics';

// Mock localStorage for headless test environment
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

describe('Custom Combination Builder & Persistence Subsystem', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  describe('CustomComboStorage', () => {
    it('returns an empty array when localStorage is empty', () => {
      expect(CustomComboStorage.load()).toEqual([]);
    });

    it('safely persists and retrieves user-authored combo definitions', () => {
      const def: ComboDefinition = {
        key: 'C99',
        name: 'Dutch 4-Count',
        side: 'Custom',
        steps: ['1', '2', '3', '9'],
        cues: ['1. Jab', '2. Cross', '3. Hook', '4. Low Kick'],
      };

      const saved = CustomComboStorage.add(def);
      expect(saved).toBe(true);

      const loaded = CustomComboStorage.load();
      expect(loaded).toHaveLength(1);
      expect(loaded[0].name).toBe('Dutch 4-Count');
      expect(loaded[0].steps).toEqual(['1', '2', '3', '9']);
    });

    it('removes a custom combo by key', () => {
      const def: ComboDefinition = {
        key: 'C01',
        name: 'Test Combo',
        side: 'Custom',
        steps: ['1', '2'],
        cues: ['1. Jab', '2. Cross'],
      };

      CustomComboStorage.add(def);
      expect(CustomComboStorage.load()).toHaveLength(1);

      CustomComboStorage.remove('C01');
      expect(CustomComboStorage.load()).toHaveLength(0);
    });

    it('handles corrupted localStorage payload gracefully without throwing', () => {
      globalThis.localStorage.setItem('cagecraft_custom_combos_v1', '{invalid-json');
      expect(CustomComboStorage.load()).toEqual([]);
    });
  });

  describe('Dynamic Combo Keyframe Compilation', () => {
    it('compiles a multi-strike sequence into a continuous single keyframe animation', () => {
      const def: ComboDefinition = {
        key: 'C4X',
        name: 'Jab-Cross-Hook-Kick',
        side: 'Custom',
        steps: ['1', '2', '3', '9'],
        cues: ['1. Jab', '2. Cross', '3. Hook', '4. Low Kick'],
      };

      const comboTech = buildCombo(def, BASE_TECHNIQUES);

      expect(comboTech).toBeDefined();
      expect(comboTech.key).toBe('C4X');
      expect(comboTech.group).toBe('combo');
      expect(comboTech.dur).toBeGreaterThan(1.5);
      expect(comboTech.ranges).toBeDefined();
      expect(comboTech.ranges).toHaveLength(4);

      // Verify continuous monotonic normalized timeline [0, 1]
      expect(comboTech.a[0].t).toBe(0);
      expect(comboTech.a[comboTech.a.length - 1].t).toBe(1);

      for (let i = 1; i < comboTech.a.length; i++) {
        expect(comboTech.a[i].t).toBeGreaterThanOrEqual(comboTech.a[i - 1].t);
      }
    });

    it('properly generates combo contact marks with normalized timestamps', () => {
      const def: ComboDefinition = {
        key: 'C12',
        name: '1-2 Quick',
        side: 'Custom',
        steps: ['1', '2'],
        cues: ['1. Jab', '2. Cross'],
      };

      const comboTech = buildCombo(def, BASE_TECHNIQUES);
      expect(comboTech.marks.length).toBeGreaterThan(0);

      for (const m of comboTech.marks) {
        expect(m.t0).toBeGreaterThanOrEqual(0);
        expect(m.t1).toBeLessThanOrEqual(1);
        expect(m.t1).toBeGreaterThanOrEqual(m.t0);
      }
    });
  });
});

