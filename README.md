# Cagecraft 3D — MMA Technique Engine & Biomechanical Visualizer

**Cagecraft 3D** is an interactive, browser-based 3D martial arts biomechanics viewer, combination compiler, and automated reaction drill coach.

Designed with a dual purpose:
1. **For MMA Athletes & Coaches:** Instant, zero-installation technique breakdown on the mats, at ringside, or on mobile devices.
2. **For Software Engineers:** A high-performance WebGL domain engine built with TypeScript, Three.js, Vite, strict static analysis, and automated verification suites.

---

## 🥋 Dual Usage Modes

### 1. Instant Mat Training Mode (Zero-Install Standalone)
Open [`mma.html`](file:///c:/Activities/Projects/cage-coach/mma.html) directly in any modern desktop or mobile browser.
- **No Node.js, build step, or web server required.**
- Features all 26 techniques, southpaw mirroring, 4-angle quad-split viewports, and audio-visual drill coach.
- Hardened with zero-allocation telemetry math and texture caching.

### 2. Modern Modular Development Mode
Run the modular TypeScript application with hot module reloading:

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run unit tests & performance benchmarks
npm test

# Run ESLint static analysis
npm run lint

# Check Prettier code formatting
npm run format

# Compile production bundle
npm run build
```

---

## ⌨️ Controls & Hotkeys Quick Reference

| Action | Hotkey | Description |
| :--- | :--- | :--- |
| **Play / Pause** | <kbd>Space</kbd> | Toggle continuous 3D technique animation |
| **Advance Phase** | <kbd>Enter</kbd> | Jump to next milestone phase (Setup, Drive, Impact, Recovery) |
| **Previous Phase** | <kbd>Backspace</kbd> | Step back to previous milestone phase |
| **Micro-Step** | <kbd>[</kbd> / <kbd>]</kbd> | Step backward or forward by micro-frames |
| **Southpaw Stance** | <kbd>A</kbd> | Mirror bilateral limb kinematics for southpaw fighters |
| **Sparring Partner** | <kbd>Tab</kbd> | Toggle solo drill vs sparring opponent body |
| **Drill Coach** | <kbd>D</kbd> | Toggle automated audio-visual reaction drill timer |
| **Quad-Split Screen**| <kbd>V</kbd> | Synchronous 4-way scissor viewports (Orbit, Side, Top, Rear) |
| **Camera Preset** | <kbd>C</kbd> | Cycle: Front (0) → Side (1) → Above (2) → Behind (3) → Partner POV (4) |
| **Playback Speed** | <kbd>S</kbd> | Cycle: 1.0× → 0.5× → 0.25× speed |
| **Ghost Breakdown** | <kbd>G</kbd> | Toggle milestone ghost breakdown silhouettes |
| **Guides & Focus** | <kbd>F</kbd> | Toggle rotation arcs, footsteps, and emissive joint highlights |
| **Strikes / Grapple**| `1`–`0`, `Q`–`P` | Direct technique selection |
| **Combos** | `Z`, `X`, `N`, `H`, `J`, `K` | Chained combination sequences |

---

## 📐 Architecture & Modular Subsystems

The modular codebase under [`src/`](file:///c:/Activities/Projects/cage-coach/src/) follows a strict 6-layer decoupled design:

```
src/
├── types/
│   └── kinematics.ts        # Poses, Keyframes, Landmarks, Techniques & State interfaces
├── data/
│   └── techniques.ts        # 20 base striking & grappling techniques
├── engine/
│   ├── arena.ts             # Octagonal competition arena, steel posts, vinyl pads, fence
│   ├── rig.ts               # Procedural clay humanoid mesh rig (Euler YXZ conventions)
│   ├── kinematics.ts        # Pose interpolation, ease curves, southpaw bilateral mirroring
│   ├── combos.ts            # Sequential combination compiler service
│   ├── telemetry.ts         # Zero-allocation joint angle & elevation calculator (AP-001)
│   ├── guides.ts            # Dynamic strike trails, rotation arcs & cached billboard labels
│   ├── camera.ts            # Orbit camera controller & quad-split scissor viewports
│   └── mocap.ts             # Optional mocap manifest loader & graceful offline fallback
├── drill/
│   └── coach.ts             # Audio-visual drill coach state machine (Web Audio + Speech)
├── storage/
│   └── notes.ts             # Bounded local-first technique notes persistence (10k cap)
├── events/
│   └── keyboard.ts          # Central keyboard router & touch event bus
├── ui/
│   └── hud.ts               # Responsive HUD overlay, card inspector, mobile dock
├── style.css                # CSS custom properties, responsive layout, dark/light themes
└── main.ts                  # Application entry point & 60fps WebGL animation loop
```

---

## 🛡️ Architectural Invariants Enforced

All code in this repository strictly adheres to the engineering rules codified in [`docs/anti-patterns.md`](file:///c:/Activities/Projects/cage-coach/docs/anti-patterns.md):

- **AP-001 (Zero GC in Hot Path):** All vector math in the 60fps render and telemetry loop operates on pre-allocated static module scratch vectors.
- **AP-002 (Euler YXZ Rotation Order):** Shoulder and hip multiaxial joints strictly preserve `'YXZ'` order to prevent gimbal lock during kicks and rotational strikes.
- **AP-003 (Texture Caching):** Canvas billboard textures are cached deterministically (`labelTexCache`, `sharedRingTex`) to eliminate GPU texture re-uploads.
- **AP-004 (Defensive Bounded Storage):** User notes are strictly bounded to 10,000 characters and wrapped in defensive error handling.
- **AP-005 (Mobile Touch-Action):** The WebGL canvas element strictly maintains `touch-action: none`.
- **AP-006 (Graceful Offline Fallback):** External mocap asset fetching degrades gracefully without breaking procedural clay mode.

---

## 🧪 Verification & Testing

Cagecraft 3D includes 27 automated tests passing with 100% green status:

```bash
# Run test suite
npm test
```

- **`tests/unit/kinematics.test.ts` (24 tests):** Validates orthogonal/acute/straight angles, cubic easing bounds, southpaw stance involution (`mirror(mirror(pose)) == pose`), and combo timeline generation.
- **`tests/unit/benchmark.test.ts` (3 tests):** Benchmarks 1,000 continuous telemetry ticks (<0.05ms/tick, <16.6ms frame budget) and verifies numerical stability across 10,000 interpolated poses.

---

## 📜 License

MIT License. Built for martial artists and engineers passionate about biomechanics and combat sports.
