# Developer Handoff — TASK-020: Common Biomechanical Mistakes & Form Correction Ghost Overlay

> **Task ID:** TASK-020  
> **Components:** `src/data/mistakes.ts`, `src/types/kinematics.ts`, `src/main.ts`, `src/ui/hud.ts`, `src/events/keyboard.ts`, `src/style.css`, `index.html`, `tests/unit/mistakes.test.ts`  
> **Status:** Completed (`[x]`)  
> **Date:** 2026-11-11  

---

## 1. Problem Statement & Athletic Motivation

In combat sports (Boxing, Muay Thai, MMA, BJJ, Wrestling), mastering technique accuracy requires seeing not only what right looks like, but understanding and recognizing fatal technical flaws.

Previously, Cage Coach only displayed the ideal execution. Athletes and coaches could not visually compare proper mechanics against common beginner and intermediate breakdowns (e.g., dropping the rear hand when throwing a jab or lead hook, punching with a flat rear foot instead of driving the hips, failing to pivot the lead foot on a roundhouse, or bending at the waist during a takedown shot).

---

## 2. Implemented Architecture & Subsystems

### 2.1 Biomechanical Mistake Database (`src/data/mistakes.ts`)
- Covers foundational striking and grappling techniques (`1`–`0`, `Q`, `W`, `E`):
  - **Jab (`1`)**: Dropped rear guard & flared elbow → Counter overhand vulnerability → Glue rear fist to cheekbone.
  - **Cross (`2`)**: Flat rear foot (no hip drive) → 60% kinetic loss & arm punching → Squash the bug and pivot ball of foot.
  - **Lead Hook (`3`)**: Dropped elbow below fist & zero pivot → Wrist sprain risk & lack of rotational torque → Lift elbow parallel to mat (90° bend) and pivot lead foot 90°.
  - **Overhand (`4`)**: Wild wind-up & head drop → Counter uppercut/knee vulnerability → Level change and loop punch tight over shoulder.
  - **Uppercut (`5`)**: Dropping hand to hip before punch → Telegraphing → Dip with knees and rotate core.
  - **Lead Elbow (`6`)**: Wide swing without step → Lack of cutting leverage → Step in deep and slash horizontally.
  - **Rear Knee (`7`)**: Upward trajectory without forward hip thrust → Lost penetration & jammed toes → Point toes down and drive pelvis into target.
  - **Teep (`8`)**: Pushing with flat heel → Weak push easily caught → Chamber knee high and strike with metatarsal ball of foot.
  - **Roundhouse Kick (`9`)**: Flat base foot (zero pivot) → ACL/meniscus torque injury → Pivot 90°–135° on ball of foot with turned-over hips.
  - **Head Slip (`0`)**: Bending at waist instead of knees → Dipping head into knees/uppercuts → Dip knees with small weight transfer.
  - **Single Leg (`Q`)**: Head inside hip → Guillotine choke vulnerability → Forehead glued to outside ribs with tall posture.
  - **Double Leg (`W`)**: Reaching with arms before hip penetration → Crushed by sprawl → Level change low and penetrate lead knee.
  - **Sprawl (`E`)**: Dropping knees to mat → Absorbing shot onto joints → Drive hips down with shoelaces flat.

### 2.2 3D Amber Mistake Ghost & 3D Billboards (`src/main.ts`)
- **Visual Contrast**: Dedicated amber/translucent red procedural rig (`skin: 0xf59e0b, accent: 0xd97706, ghost: true`).
- **Spatial Positioning**: Positioned side-by-side with Fighter A (+0.95m offset, or -0.95m in Southpaw).
- **3D Flaw Billboard**: Dynamically places `makeLabel("❌ Flaw: ...", "#F87171", true)` attached to the faulty joint.
- **Southpaw Bilateral Symmetry**: Full support for `mirrorPose` so mistake poses mirror accurately in Southpaw stance without coordinate corruption.

### 2.3 Responsive HUD & Keyboard Controls
- **Toolbar Button**: Added `Mistakes [M]` button to `#viewSeg` in `index.html`.
- **Keyboard Shortcut**: Bound key <kbd>M</kbd> to `toggleOption('mistakes')`.
- **Inspector Callout Box**: Dynamically renders `#mistakeBox` inside the technique card with flaw, consequence, and corrective coaching fix.

---

## 3. Verification & Metrics

- **Unit Tests (`tests/unit/mistakes.test.ts`)**: 4 comprehensive tests verifying technique coverage, finite angle bounds `[-180, 180]`, technique enrichment, and southpaw mirroring (all 31/31 tests passing).
- **Static Analysis**: `npm run lint` passes across all 21 modules with zero errors.
- **Production Build**: `npm run build` compiles in 2.81s into clean production assets in `dist/`.
