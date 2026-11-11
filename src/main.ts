/**
 * Cagecraft 3D — Production Application Entry Point
 * Orchestrates Modular WebGL 3D Scene, Kinematics Engine, Drill Coach, and Responsive HUD
 */

import * as THREE from 'three';
import './style.css';

// Subsystem Modules
export * from './types/kinematics';
export * from './engine/kinematics';
export * from './data/techniques';
export * from './engine/combos';
export * from './drill/coach';
export * from './engine/arena';
export * from './engine/rig';
export * from './engine/camera';
export * from './engine/telemetry';
export * from './engine/guides';
export * from './engine/mocap';
export * from './storage/notes';
export * from './events/keyboard';
export * from './ui/hud';
export * from './ui/calibrator';
export * from './data/mistakes';
export * from './storage/combos';
export * from './ui/comboBuilder';
export * from './drill/timer';
export * from './storage/calibrations';

import type {
  AppState,
  Technique,
  JointIdentifier,
  AnatomicalMarker,
  Pose,
} from './types/kinematics';
import { BASE_TECHNIQUES, COMBO_DEFS } from './data/techniques';
import { TECHNIQUE_MISTAKES } from './data/mistakes';
import { compileAllTechniques, buildCombo } from './engine/combos';
import { CustomComboStorage } from './storage/combos';
import { ComboBuilderModal } from './ui/comboBuilder';
import { RoundTimer } from './drill/timer';
import { PoseCalibrationStorage } from './storage/calibrations';
import { D, poseAt, mirrorPose, sideName } from './engine/kinematics';
import { buildArena } from './engine/arena';
import {
  makeFighter,
  apply,
  setFocus,
  FIGHTER_A_CONFIG,
  FIGHTER_B_CONFIG,
  GHOST_CONFIG,
  type FighterRig,
} from './engine/rig';
import { CameraController } from './engine/camera';
import { calculateTelemetry } from './engine/telemetry';
import {
  makeLabel,
  makeRing,
  disposeGuideGroup,
  StrikeTrail,
  type ActiveMark,
} from './engine/guides';
import { DrillCoach } from './drill/coach';
import { NotesManager } from './storage/notes';
import { MocapManager } from './engine/mocap';
import { attachKeyboardRouter } from './events/keyboard';
import { HudController } from './ui/hud';
import { PoseCalibrator } from './ui/calibrator';

// 1. Compile Techniques Catalog
const customCombos = CustomComboStorage.load();
const initialComboDefs = [...COMBO_DEFS, ...customCombos];

export const ALL_TECHNIQUES: Technique[] = compileAllTechniques(
  BASE_TECHNIQUES,
  initialComboDefs
).map((t) => {
  if (TECHNIQUE_MISTAKES[t.key]) {
    t.mistake = TECHNIQUE_MISTAKES[t.key];
  }
  return t;
});

// 2. Application Reactive State
const state: AppState = {
  tech: 0,
  mode: 'single',
  speed: 1,
  playing: true,
  t: 0,
  cam: 0,
  src: 'clay',
  ghosts: true,
  guides: true,
  step: false,
  stepOnce: false,
  split: false,
  drill: false,
  southpaw: false,
  mistakes: false,
};

// 3. Scratch Vectors for Zero-Allocation Hot Path (AP-001)
const tmpV = new THREE.Vector3();
const tmpD = new THREE.Vector3();
const eyeOffset = new THREE.Vector3();

// 4. Scene, Arena & WebGL Setup
const stage = document.getElementById('stage') || document.body;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x232930);
scene.fog = new THREE.Fog(0x232930, 9, 20);

// Build Octagonal Arena, Cage Fence & Lights Subsystem
buildArena(scene);

// 5. Fighter Rigs Setup
const fighterA: FighterRig = makeFighter(FIGHTER_A_CONFIG);
const fighterB: FighterRig = makeFighter(FIGHTER_B_CONFIG);
fighterB.holder.rotation.y = Math.PI;
fighterB.holder.position.z = 1.45;
scene.add(fighterA.holder, fighterB.holder);

// Invisible Shadow Rig for footprint & guide orientation computations
const shadowRig: FighterRig = makeFighter({ skin: 0x000000, accent: 0x000000 });
shadowRig.holder.visible = false;
scene.add(shadowRig.holder);

// Ghost rigs for phase progression breakdown
const GHOST_COUNT = 8;
const ghostRigs: FighterRig[] = Array.from({ length: GHOST_COUNT }, () => {
  const g = makeFighter(GHOST_CONFIG);
  g.holder.visible = false;
  scene.add(g.holder);
  return g;
});

// Mistake Ghost rig (amber warning silhouette) for visual form correction
const mistakeRig: FighterRig = makeFighter({ skin: 0xf59e0b, accent: 0xd97706, ghost: true });
mistakeRig.holder.visible = false;
scene.add(mistakeRig.holder);

// 6. Camera & Viewport Controller
const cameraController = new CameraController();
cameraController.attachPointerEvents(renderer.domElement, () => state.cam !== 4);

// 7. Visual Guidance & Annotations
const markGroup = new THREE.Group();
const guideGroup = new THREE.Group();
scene.add(markGroup, guideGroup);
let activeMarks: ActiveMark[] = [];
const strikeTrail = new StrikeTrail();
scene.add(strikeTrail.line);

// 8. Managers
const notesManager = new NotesManager();
const mocapManager = new MocapManager();
const drillCoach = new DrillCoach(ALL_TECHNIQUES, {
  onCallout: (tk) => {
    hud.showDrillCallout(
      tk.name,
      `<kbd>${tk.key}</kbd> ${tk.side} • ${tk.group.toUpperCase()}`,
      true
    );
  },
  onClearCallout: () => {
    hud.showDrillCallout('', '', false);
  },
  onSelectTechnique: (index) => {
    setTechnique(index);
  },
  onPlayTechnique: () => {
    state.playing = true;
    state.t = 0;
  },
  onStopTechnique: () => {
    state.playing = false;
  },
});

const roundTimer = new RoundTimer(
  { roundDurationSec: 180, restDurationSec: 60, totalRounds: 3 },
  {
    onTick: (remaining, round, phase) => {
      hud.updateTimer(remaining, round, phase, roundTimer.isRunning);
    },
    onPhaseChange: (phase, round) => {
      hud.updateTimer(roundTimer.remaining, round, phase, roundTimer.isRunning);
      if (phase === 'rest') {
        if (state.drill) drillCoach.stop();
      } else if (phase === 'round') {
        if (state.drill) drillCoach.start(performance.now());
      }
    },
  }
);

let tunedPose: Pose | null = null;

const poseCalibrator = new PoseCalibrator({
  onPoseChanged: (p) => {
    tunedPose = p;
    apply(fighterA, p);
  },
  onSaveCalibration: (p) => {
    const tk = getActiveTechnique();
    PoseCalibrationStorage.saveOverride(tk.key, p);
    buildGuides();
  },
  onResetCalibration: () => {
    const tk = getActiveTechnique();
    PoseCalibrationStorage.resetOverride(tk.key);
    tunedPose = null;
    setTechnique(state.tech);
  },
  onClose: () => {
    tunedPose = null;
    hud.updateButtons(state, false);
  },
});

const comboBuilderModal = new ComboBuilderModal(BASE_TECHNIQUES, {
  onSaveCombo: (comboDef) => {
    CustomComboStorage.add(comboDef);
    const compiled = buildCombo(comboDef, BASE_TECHNIQUES);
    if (TECHNIQUE_MISTAKES[compiled.key]) {
      compiled.mistake = TECHNIQUE_MISTAKES[compiled.key];
    }
    ALL_TECHNIQUES.push(compiled);
    hud.renderKeys(ALL_TECHNIQUES.length - 1);
    setTechnique(ALL_TECHNIQUES.length - 1);
  },
  onClose: () => {
    // closed
  },
});

// 9. Pure Helpers
const getActiveTechnique = (): Technique => ALL_TECHNIQUES[state.tech];

const isPartnerShown = (): boolean => state.mode === 'spar' || !!getActiveTechnique().needsPartner;

const poseOf = (frames: Technique['a'], t: number) => {
  const base = poseAt(frames, t);
  const tk = getActiveTechnique();
  const override = PoseCalibrationStorage.getOverride(tk?.key || '');

  let effective = base;
  if (override && Math.abs(t - tk.peak) < 0.12) {
    effective = {
      ...base,
      ...override,
      root: override.root ? [...override.root] : [...base.root],
      spine: override.spine ? [...override.spine] : [...base.spine],
      head: override.head ? [...override.head] : [...base.head],
    };
  }

  return state.southpaw ? mirrorPose(effective) : effective;
};

const getPointFor = (who: 'A' | 'B', name: AnatomicalMarker, out: THREE.Vector3): boolean => {
  const localized = sideName(name, state.southpaw) as AnatomicalMarker;
  const rig = who === 'A' ? fighterA : fighterB;
  if (who === 'B' && !fighterB.holder.visible) return false;
  const pt = rig.points[localized];
  if (!pt) return false;
  pt.getWorldPosition(out);
  return true;
};

// 10. Visual Guides & Contact Marks Builders
function buildContactMarks(): void {
  disposeGuideGroup(markGroup);
  const tk = getActiveTechnique();
  activeMarks = (tk.marks || []).map((m) => {
    const ring = makeRing();
    const label = makeLabel(m.label, '#FFC53D');
    markGroup.add(ring, label);
    return { mark: m, ring, label };
  });
}

function updateContactMarks(now: number): void {
  const pulse = 1 + 0.12 * Math.sin(now / 160);
  for (const { mark: m, ring, label } of activeMarks) {
    const on = state.t >= m.t0 && state.t <= m.t1;
    ring.visible = label.visible = on;
    if (on) {
      if (getPointFor(m.who, m.pt, tmpV)) {
        ring.position.copy(tmpV);
        ring.scale.set(0.22 * pulse, 0.22 * pulse, 1);
        label.position.set(tmpV.x, tmpV.y + 0.22 + (m.dy || 0), tmpV.z);
      }
    }
  }
}

function buildGhosts(): void {
  const tk = getActiveTechnique();
  ghostRigs.forEach((g) => {
    g.holder.visible = false;
    g.label = null;
  });
  if (!state.ghosts) return;

  const ph = tk.phases;
  const count = Math.min(GHOST_COUNT, ph.length - 1);
  for (let i = 0; i < count; i++) {
    const g = ghostRigs[i];
    const t = ph[i][0] - 0.0005;
    apply(g, poseOf(tk.a, t));
    g.holder.visible = true;
    g.holder.updateMatrixWorld(true);
    g.label = makeLabel(`${i + 1}. ${ph[i][1]}`, '#F2B5AB', true);
    if (g.points.head) {
      g.points.head.getWorldPosition(tmpV);
      g.label.position.copy(tmpV).add(new THREE.Vector3(0, 0.42, 0));
      guideGroup.add(g.label);
    }
  }
}

function buildMistakeGhost(): void {
  mistakeRig.holder.visible = false;
  mistakeRig.label = null;
  if (!state.mistakes) return;

  const tk = getActiveTechnique();
  if (!tk.mistake) return;

  const rawBasePose = poseOf(tk.a, tk.peak);
  const rawErrorPose: Pose = {
    ...rawBasePose,
    ...tk.mistake.errorPose,
    root: tk.mistake.errorPose.root ? [...tk.mistake.errorPose.root] : [...rawBasePose.root],
    spine: tk.mistake.errorPose.spine ? [...tk.mistake.errorPose.spine] : [...rawBasePose.spine],
    head: tk.mistake.errorPose.head ? [...tk.mistake.errorPose.head] : [...rawBasePose.head],
  };

  const finalPose = state.southpaw ? mirrorPose(rawErrorPose) : rawErrorPose;
  apply(mistakeRig, finalPose);
  mistakeRig.holder.position.set(state.southpaw ? -0.95 : 0.95, 0, 0);
  mistakeRig.holder.visible = true;
  mistakeRig.holder.updateMatrixWorld(true);

  const label = makeLabel(`❌ Flaw: ${tk.mistake.flaw}`, '#F87171', true);
  mistakeRig.label = label;
  if (mistakeRig.points.head) {
    mistakeRig.points.head.getWorldPosition(tmpV);
    label.position.copy(tmpV).add(new THREE.Vector3(0, 0.45, 0));
    guideGroup.add(label);
  }
}

function buildGuides(): void {
  disposeGuideGroup(guideGroup);
  ghostRigs.forEach((g) => (g.label = null));
  mistakeRig.label = null;
  buildGhosts();
  buildMistakeGhost();
  if (!state.guides) return;

  const tk = getActiveTechnique();

  // Footprints at stance and peak
  [
    [0, 0x9aa3ae, 0.5, 0.011],
    [tk.peak, 0xd9442f, 0.75, 0.015],
  ].forEach(([t, col, op, y]) => {
    apply(shadowRig, poseOf(tk.a, t as number));
    shadowRig.holder.updateMatrixWorld(true);
    for (const side of ['l', 'r']) {
      const markerName = `${side}Foot` as AnatomicalMarker;
      const m = shadowRig.points[markerName];
      if (!m) continue;
      m.getWorldPosition(tmpV);
      if (tmpV.y > 0.14) continue;
      m.getWorldDirection(tmpD);
      const yaw = Math.atan2(tmpD.x, tmpD.z);
      const fp = new THREE.Mesh(
        new THREE.CircleGeometry(0.14, 24),
        new THREE.MeshBasicMaterial({
          color: col as number,
          transparent: true,
          opacity: op as number,
          depthWrite: false,
        })
      );
      fp.rotation.order = 'YXZ';
      fp.rotation.set(-Math.PI / 2, yaw + Math.PI, 0);
      fp.scale.set(0.45, 1, 1);
      fp.position.set(tmpV.x, y as number, tmpV.z);
      guideGroup.add(fp);
    }
  });

  // Pelvis / Shoulder Rotation Arc
  const p0 = poseOf(tk.a, 0);
  const p1 = poseOf(tk.a, tk.peak);
  const yaw0 = (p0.root[1] + p0.spine[1]) * D;
  const yaw1 = (p1.root[1] + p1.spine[1]) * D;

  apply(shadowRig, p0);
  shadowRig.holder.updateMatrixWorld(true);
  if (shadowRig.points.hips) {
    shadowRig.points.hips.getWorldPosition(tmpV);
    const centre = tmpV.clone();
    if (Math.abs(yaw1 - yaw0) > 12 * D && Math.abs(p1.root[0]) < 45) {
      const pts: THREE.Vector3[] = [];
      const n = 20;
      const r = 0.42;
      for (let i = 0; i <= n; i++) {
        const a = yaw0 + ((yaw1 - yaw0) * i) / n;
        pts.push(
          new THREE.Vector3(centre.x + r * Math.sin(a), centre.y + 0.05, centre.z + r * Math.cos(a))
        );
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const amber = new THREE.MeshBasicMaterial({
        color: 0xffc53d,
        depthTest: false,
        transparent: true,
        opacity: 0.95,
      });
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.012, 8, false), amber);
      tube.renderOrder = 18;
      guideGroup.add(tube);

      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.11, 10), amber);
      cone.renderOrder = 18;
      const end = pts[n];
      const tan = curve.getTangent(1).normalize();
      cone.position.copy(end);
      cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
      guideGroup.add(cone);

      const lab = makeLabel(`Hips turn ${Math.round(Math.abs(yaw1 - yaw0) / D)}°`, '#FFC53D', true);
      lab.position.set(centre.x, centre.y + 0.32, centre.z);
      guideGroup.add(lab);
    }
  }
}

// 11. Technique Selection & UI Sync
function setTechnique(index: number): void {
  const notesEl = document.getElementById('notes') as HTMLTextAreaElement | null;
  if (notesEl) {
    notesManager.saveNote(getActiveTechnique().key, notesEl.value);
  }

  state.tech = Math.max(0, Math.min(ALL_TECHNIQUES.length - 1, index));
  state.t = 0;
  state.playing = true;
  strikeTrail.reset();

  const tk = getActiveTechnique();
  hud.renderCard(tk, state.mode === 'spar', state.southpaw, notesManager.getNote(tk.key));
  hud.renderKeys(state.tech);
  buildContactMarks();
  buildGuides();
}

function nextPhase(): void {
  const tk = getActiveTechnique();
  let idx = 0;
  while (idx < tk.phases.length - 1 && tk.phases[idx + 1][0] <= state.t + 0.001) {
    idx++;
  }
  const nextIdx = (idx + 1) % tk.phases.length;
  state.t = nextIdx === 0 ? 0 : tk.phases[nextIdx][0] - 0.0005;
  state.playing = false;
}

function prevPhase(): void {
  const tk = getActiveTechnique();
  let idx = 0;
  while (idx < tk.phases.length - 1 && tk.phases[idx + 1][0] <= state.t + 0.001) {
    idx++;
  }
  const prevIdx = (idx - 1 + tk.phases.length) % tk.phases.length;
  state.t = prevIdx === 0 ? 0 : tk.phases[prevIdx][0] - 0.0005;
  state.playing = false;
}

// 12. Instantiate HUD Controller
const hud = new HudController(
  {
    onSelectTechnique: (idx) => {
      if (state.drill) {
        state.drill = false;
        hud.updateButtons(state);
      }
      setTechnique(idx);
    },
    onSetMode: (mode) => {
      state.mode = mode;
      state.t = 0;
      strikeTrail.reset();
      hud.updateButtons(state);
      hud.renderCard(
        getActiveTechnique(),
        state.mode === 'spar',
        state.southpaw,
        notesManager.getNote(getActiveTechnique().key)
      );
    },
    onSetStance: (southpaw) => {
      state.southpaw = southpaw;
      state.t = 0;
      strikeTrail.reset();
      hud.updateButtons(state);
      hud.renderCard(
        getActiveTechnique(),
        state.mode === 'spar',
        state.southpaw,
        notesManager.getNote(getActiveTechnique().key)
      );
      buildGuides();
    },
    onSetSpeed: (spd) => {
      state.speed = spd;
      hud.updateButtons(state);
    },
    onSetCamera: (cam) => {
      state.cam = cam;
      cameraController.setPreset(cam);
      hud.updateButtons(state);
    },
    onSetSource: (src) => {
      if (src === 'mocap' && !mocapManager.ready) return;
      state.src = src;
      state.t = 0;
      strikeTrail.reset();
      hud.updateButtons(state);
    },
    onToggleOption: (opt) => {
      state[opt] = !state[opt];
      hud.updateButtons(state);
      if (opt === 'ghosts' || opt === 'guides' || opt === 'mistakes') buildGuides();
      if (opt === 'drill') {
        if (state.drill) {
          drillCoach.start(performance.now());
        } else {
          drillCoach.stop();
        }
      }
    },
    onToggleTune: () => {
      if (poseCalibrator.visible) {
        poseCalibrator.close();
        tunedPose = null;
        hud.updateButtons(state, false);
      } else {
        state.playing = false;
        const currentP = poseOf(getActiveTechnique().a, state.t);
        poseCalibrator.open(currentP);
        hud.updateButtons(state, true);
      }
    },
    onToggleComboBuilder: () => {
      if (comboBuilderModal.visible) {
        comboBuilderModal.close();
      } else {
        state.playing = false;
        comboBuilderModal.open();
      }
    },
    onTimerToggle: () => {
      if (roundTimer.isRunning) {
        roundTimer.pause();
      } else {
        roundTimer.start();
      }
      hud.updateTimer(
        roundTimer.remaining,
        roundTimer.round,
        roundTimer.currentPhase,
        roundTimer.isRunning
      );
    },
    onTimerReset: () => {
      roundTimer.reset();
      hud.updateTimer(
        roundTimer.remaining,
        roundTimer.round,
        roundTimer.currentPhase,
        roundTimer.isRunning
      );
    },
    onTimerDurationChange: (sec) => {
      roundTimer.setRoundDuration(sec);
      hud.updateTimer(
        roundTimer.remaining,
        roundTimer.round,
        roundTimer.currentPhase,
        roundTimer.isRunning
      );
    },
    onNextPhase: () => {
      if (state.playing) state.playing = false;
      else nextPhase();
    },
    onPrevPhase: () => prevPhase(),
    onSaveNote: (content) => {
      notesManager.saveNote(getActiveTechnique().key, content);
    },
    onExportNotes: () => {
      const nameMap: Record<string, string> = {};
      ALL_TECHNIQUES.forEach((t) => (nameMap[t.key] = t.name));
      notesManager.downloadExport(nameMap);
    },
    onDrillSetChange: (set) => {
      drillCoach.state.set = set;
    },
    onDrillGapChange: (gap) => {
      drillCoach.state.gap = gap;
    },
    onDrillOptionToggle: (opt, val) => {
      if (opt === 'tick') drillCoach.tickEnabled = val;
      if (opt === 'voice') drillCoach.voiceEnabled = val;
    },
  },
  ALL_TECHNIQUES
);

// 13. Central Keyboard Event Router (TASK-006)
attachKeyboardRouter({
  selectTechniqueByKey: (key) => {
    const idx = ALL_TECHNIQUES.findIndex((t) => t.key === key);
    if (idx >= 0) {
      if (state.drill) {
        state.drill = false;
        hud.updateButtons(state);
      }
      setTechnique(idx);
    }
  },
  toggleMode: () => {
    state.mode = state.mode === 'spar' ? 'single' : 'spar';
    state.t = 0;
    strikeTrail.reset();
    hud.updateButtons(state);
    hud.renderCard(
      getActiveTechnique(),
      state.mode === 'spar',
      state.southpaw,
      notesManager.getNote(getActiveTechnique().key)
    );
  },
  togglePlay: () => {
    state.playing = !state.playing;
    state.stepOnce = false;
  },
  nextPhase: () => {
    if (state.playing) state.playing = false;
    else nextPhase();
  },
  prevPhase: () => prevPhase(),
  toggleStance: () => {
    state.southpaw = !state.southpaw;
    state.t = 0;
    strikeTrail.reset();
    hud.updateButtons(state);
    hud.renderCard(
      getActiveTechnique(),
      state.mode === 'spar',
      state.southpaw,
      notesManager.getNote(getActiveTechnique().key)
    );
    buildGuides();
  },
  toggleMocap: () => {
    if (mocapManager.ready) {
      state.src = state.src === 'mocap' ? 'clay' : 'mocap';
      hud.updateButtons(state);
    }
  },
  toggleOption: (opt) => {
    state[opt] = !state[opt];
    hud.updateButtons(state);
    if (opt === 'ghosts' || opt === 'guides' || opt === 'mistakes') buildGuides();
  },
  toggleTune: () => {
    if (poseCalibrator.visible) {
      poseCalibrator.close();
      tunedPose = null;
      hud.updateButtons(state, false);
    } else {
      state.playing = false;
      const currentP = poseOf(getActiveTechnique().a, state.t);
      poseCalibrator.open(currentP);
      hud.updateButtons(state, true);
    }
  },
  toggleComboBuilder: () => {
    if (comboBuilderModal.visible) {
      comboBuilderModal.close();
    } else {
      state.playing = false;
      comboBuilderModal.open();
    }
  },
  cycleSpeed: () => {
    state.speed = state.speed === 1 ? 0.5 : state.speed === 0.5 ? 0.25 : 1;
    hud.updateButtons(state);
  },
  cycleCamera: () => {
    state.cam = ((state.cam + 1) % 5) as 0 | 1 | 2 | 3 | 4;
    cameraController.setPreset(state.cam);
    hud.updateButtons(state);
  },
  stepForward: () => {
    state.playing = false;
    state.t = (state.t + 0.015) % 1;
  },
  stepBackward: () => {
    state.playing = false;
    state.t = (state.t - 0.015 + 1) % 1;
    if (state.t > 0.985) strikeTrail.reset();
  },
  rotateCamera: (dTheta, dPhi) => {
    cameraController.camGoal.theta += dTheta;
    cameraController.camGoal.phi = Math.min(
      1.5,
      Math.max(0.25, cameraController.camGoal.phi + dPhi)
    );
  },
});

// 14. Window Resize Handler
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  const vps = cameraController.getViewports(window.innerWidth, window.innerHeight, state.split);
  hud.updateVLabels(vps, state.split);
});

// 15. Animation Hot Loop (60 FPS, AP-001 Compliant)
let lastTime = performance.now();
let telemetryTick = 0;

function frame(now: number): void {
  const dt = Math.min(0.1, (now - lastTime) / 1000);
  lastTime = now;

  const tk = getActiveTechnique();
  const showPartner = isPartnerShown();

  // Automated Drill Coach Tick
  if (state.drill) {
    drillCoach.update(now, state.speed);
  }

  // Animation timeline advancement
  if (state.playing) {
    const prevT = state.t;
    let nextT = state.t + (dt * state.speed) / tk.dur;

    // Step-by-phase pause handling
    if (state.step || state.stepOnce) {
      for (const [phaseUntil] of tk.phases) {
        if (prevT < phaseUntil && nextT >= phaseUntil) {
          nextT = phaseUntil - 0.0005;
          state.playing = false;
          state.stepOnce = false;
          break;
        }
      }
    }

    if (nextT >= 1) {
      nextT -= 1;
      strikeTrail.reset();
    }
    state.t = nextT;
  }

  // Articulate 3D Fighters
  fighterA.holder.visible = true;
  fighterB.holder.visible = showPartner;
  if (poseCalibrator.visible && tunedPose) {
    apply(fighterA, tunedPose);
  } else {
    apply(fighterA, poseOf(tk.a, state.t));
  }
  if (showPartner) {
    apply(fighterB, poseOf(tk.b, state.t));
  }

  // Hide opponent head in Partner POV mode
  if (fighterB.joints.head) {
    fighterB.joints.head.visible = !(state.cam === 4 && showPartner);
  }

  // Update Dynamic Strike Trail
  const traceMarker = tk.trace ? (sideName(tk.trace, state.southpaw) as AnatomicalMarker) : null;
  const tracePoint = traceMarker ? fighterA.points[traceMarker] || null : null;
  strikeTrail.update(tracePoint, state.t, state.playing);

  // Update Emissive Focus Highlights
  const activeFocus: JointIdentifier[] = (tk.focus || []).map(
    (j) => sideName(j, state.southpaw) as JointIdentifier
  );
  setFocus(fighterA, state.guides ? activeFocus : null);

  // Update Contact Marks
  updateContactMarks(now);

  // Biomechanical Telemetry Calculation (Throttled to every 3rd frame, AP-001)
  if (telemetryTick++ % 3 === 0) {
    const telemetry = calculateTelemetry((marker, out) => {
      return getPointFor('A', marker, out);
    }, state.southpaw);
    hud.updateReadouts(telemetry);
  }

  // Update Orbit Camera and Viewports
  if (tk.cam) {
    cameraController.setTarget(tk.cam[0], tk.cam[1], tk.cam[2]);
  } else {
    cameraController.setTarget(0, 1.0, showPartner ? 0.7 : 0.0);
  }

  let partnerEye: THREE.Vector3 | null = null;
  let partnerChest: THREE.Vector3 | null = null;
  if (state.cam === 4 && showPartner) {
    if (getPointFor('B', 'eyes', eyeOffset)) partnerEye = eyeOffset;
    if (getPointFor('A', 'chest', tmpD)) partnerChest = tmpD;
  }

  cameraController.update(state.cam, partnerEye, partnerChest);
  hud.updatePhase(tk, state.t, state.playing);

  // Scissor Viewport Rendering
  cameraController.render(renderer, scene, window.innerWidth, window.innerHeight, state.split);

  requestAnimationFrame(frame);
}

// 16. Initialize Application
setTechnique(0);
hud.updateButtons(state);
const initialVps = cameraController.getViewports(
  window.innerWidth,
  window.innerHeight,
  state.split
);
hud.updateVLabels(initialVps, state.split);

requestAnimationFrame(frame);
mocapManager.init().then(() => {
  if (mocapManager.ready) {
    const btn = document.querySelector(
      '#srcSeg button[data-src="mocap"]'
    ) as HTMLButtonElement | null;
    if (btn) {
      btn.disabled = false;
      btn.title = `${Object.keys(mocapManager.clips).length} mocap clip(s) loaded`;
    }
  }
});
