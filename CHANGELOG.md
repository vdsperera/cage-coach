# Changelog

All notable changes to the **Cagecraft 3D** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-11

### Added
- **Modular TypeScript Architecture:** Complete decomposition of monolithic `mma.html` into 19 modular TypeScript subsystems under `src/`.
- **Octagonal Arena & Lighting Subsystem (`src/engine/arena.ts`):** 4.6m radius competition canvas, 8 steel corner posts, vinyl safety pads, and procedural chain-link fence with soft directional shadows.
- **Procedural Clay Rigging Engine (`src/engine/rig.ts`):** 15 anatomical joints, 17 spatial landmark markers, and multiaxial Euler rotation conventions (`YXZ` for shoulders/hips to prevent gimbal lock).
- **Emissive Focus & Guidance System (`src/engine/guides.ts`):** Real-time joint highlight glow, dynamic Catmull-Rom strike trails, and cached billboard canvas labels for zero texture churn.
- **Multi-Camera Orbital Controller (`src/engine/camera.ts`):** Orbit perspective controller, presets (Front, Side, Above, Behind, Partner's Eyes POV), and synchronized quad-split scissor viewports.
- **Zero-Allocation Biomechanical Telemetry (`src/engine/telemetry.ts`):** Pre-allocated scratch vector mathematics for knee flexion, elbow extension, hip rotation yaw, torso lean, and elevations with 0 heap allocations per tick.
- **Bilateral Southpaw Mirroring (`src/engine/kinematics.ts`):** Parametric keyframe interpolation (`poseAt`, `ease`) and coordinate space symmetry inversion (`mirrorPose`, `sideName`).
- **Sequential Combination Compiler (`src/engine/combos.ts`):** Chained multi-strike keyframe sequence compiler for 6 combinations (26 total techniques).
- **Interactive Audio-Visual Drill Coach (`src/drill/coach.ts`):** State machine trainer cycling randomized technique callouts with Web Audio tone synthesizers (880Hz / 440Hz) and SpeechSynthesis prompts.
- **Defensive Local Notes Persistence (`src/storage/notes.ts`):** 10,000-character bounding per technique, defensive error wrapping, and structured JSON export blob generator.
- **Central Keyboard & Touch Command Bus (`src/events/keyboard.ts`):** Global hotkey routing with form input element isolation and mobile touch gesture protection (`touch-action: none`).
- **Responsive HUD & Card Inspector (`src/ui/hud.ts`):** Adaptive overlay with technique cards, phase progress bars, cues list, notes textarea, and mobile dock.
- **Automated Verification Suite:** 24 unit tests covering kinematics math, easing boundaries, and southpaw involution in `tests/unit/kinematics.test.ts`.
- **Render & Telemetry Benchmark Suite:** Performance verification in `tests/unit/benchmark.test.ts` verifying <0.05ms/tick execution.
- **Static Analysis & Toolchain:** ESLint 9 flat configuration, Prettier formatting rules, and strict TypeScript compiler settings.
- **SDLC Pipeline Documentation:** Comprehensive reverse-engineered architecture, requirements, user stories with Gherkin scenarios, design specs, anti-pattern rules, and task roadmap in `docs/`.

### Fixed
- **RF-06 (GC Churn):** Converted telemetry updates in `mma.html` and `src/engine/telemetry.ts` to use pre-allocated scratch vectors (`roV1`, `roV2`, `roV3`), eliminating 60fps Vector3 heap allocations.
- **RF-05 (Texture Memory Leaks):** Implemented deterministic billboard texture caching (`labelTexCache`, `sharedRingTex`) to avoid canvas re-creation on technique selection.
- **RF-08 (Unbounded Storage Risk):** Enforced 10,000-character cap and defensive JSON shape parsing for user technique notes.
- **RF-07 (Mobile Canvas Gesture Hijacking):** Added `touch-action: none` to 3D render canvas to prevent mobile browser gesture conflicts.

