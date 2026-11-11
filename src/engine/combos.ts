/**
 * Combination Compiler Service for Cagecraft 3D
 * Sequences multiple techniques into continuous keyframe timelines
 */

import type {
  Technique,
  ComboDefinition,
  Keyframe,
  PhaseMilestone,
  ContactMark,
  ComboSliceRange,
} from '../types/kinematics';
import { fullPose, poseAt } from './kinematics';

export function buildCombo(def: ComboDefinition, byKey: Record<string, Technique>): Technique {
  const steps = def.steps.map((k) => byKey[k]);
  const trims = steps.map((tk) => (tk.phases.length > 1 ? tk.phases[tk.phases.length - 2][0] : 1));
  const shares = steps.map((tk, i) => tk.dur * trims[i]);
  const total = shares.reduce((a, b) => a + b, 0);
  const GAP = 0.08;
  const a: Keyframe[] = [];
  const b: Keyframe[] = [];
  const phases: PhaseMilestone[] = [];
  const marks: ContactMark[] = [];
  const ranges: ComboSliceRange[] = [];
  let t0 = 0;

  steps.forEach((tk, i) => {
    const span = shares[i] / total;
    const trim = trims[i];
    const inner = span * (1 - GAP);
    const map = (t: number) => t0 + (t / trim) * inner;
    const sample = (frames: Keyframe[], out: Keyframe[]) => {
      const ts = [
        ...new Set(
          frames
            .map((f) => f.t)
            .filter((t) => t <= trim + 1e-6)
            .concat([trim])
        ),
      ].sort((x, y) => x - y);
      ts.forEach((t) => out.push({ t: map(t), p: fullPose(poseAt(frames, t)) }));
    };
    sample(tk.a, a);
    sample(tk.b, b);
    tk.phases.forEach(([u, n, e]) => {
      if (u <= trim + 1e-6) phases.push([map(u), `${tk.name}: ${n}`, e]);
    });
    (tk.marks || []).forEach((m) =>
      marks.push({
        ...m,
        t0: map(Math.min(m.t0, trim)),
        t1: map(Math.min(m.t1, trim)),
      })
    );
    ranges.push({ tk, t0, t1: t0 + span });
    t0 += span;
  });

  const lastA = steps[steps.length - 1].a;
  const lastB = steps[steps.length - 1].b;
  a.push({ t: 1, p: fullPose(lastA[lastA.length - 1].p) });
  b.push({ t: 1, p: fullPose(lastB[lastB.length - 1].p) });
  phases.push([1, 'Reset', '']);

  const peak =
    ranges[0].t0 + (steps[0].peak * (ranges[0].t1 - ranges[0].t0) * (1 - GAP)) / trims[0];

  return {
    key: def.key,
    group: 'combo',
    name: def.name,
    side: def.side,
    dur: total + 0.3 * steps.length,
    a,
    b,
    phases,
    marks,
    ranges,
    needsPartner: steps.some((s) => s.needsPartner),
    peak,
    focus: steps[0]?.focus || [],
    cues: def.cues,
    partner: steps.map((s) => s.partner).join('. ') + '.',
  };
}

export function compileAllTechniques(
  baseTechniques: Technique[],
  comboDefs: ComboDefinition[]
): Technique[] {
  const byKey: Record<string, Technique> = Object.fromEntries(
    baseTechniques.map((t) => [t.key, t])
  );
  const fullCatalog = [...baseTechniques];
  comboDefs.forEach((def) => {
    const combo = buildCombo(def, byKey);
    fullCatalog.push(combo);
    byKey[combo.key] = combo;
  });
  return fullCatalog;
}
