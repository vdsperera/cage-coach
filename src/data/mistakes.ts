/**
 * Common Biomechanical Mistakes & Form Correction Database for Cage Coach
 * Defines anatomical flaws, tactical consequences, and coaching fixes for striking and grappling.
 */

import type { TechniqueMistake } from '../types/kinematics';

export const TECHNIQUE_MISTAKES: Record<string, TechniqueMistake> = {
  '1': {
    flaw: 'Dropped Rear Guard & Flared Elbow',
    consequence: 'Leaves chin, temple, and liver exposed to an overhand right counter.',
    correction: 'Glue rear fist to your zygomatic cheekbone and tuck your elbow against your floating ribs.',
    errorJoint: 'rWrist',
    errorPose: {
      rSh: [-30, 20, 0],
      rEl: [-40, 0, 0],
      rWrist: [0, -30, 0],
      head: [0, 0, 0],
    },
  },
  '2': {
    flaw: 'Flat Rear Foot (No Hip Drive or Pivot)',
    consequence: 'Eliminates 60% of kinetic energy by arm-punching and leaves you stranded forward.',
    correction: 'Squash the bug: pivot on the ball of the rear foot, push off the floor, and drive the rear hip forward.',
    errorJoint: 'rAnkle',
    errorPose: {
      rAnkle: [0, 0, 0],
      rHip: [0, 5, 0],
      spine: [0, 8, 0],
      root: [0, 0, 0],
    },
  },
  '3': {
    flaw: 'Dropped Elbow Below Fist & No Foot Pivot',
    consequence: 'Slaps with an open palm or wrist, risks wrist sprain, and loses rotational torque.',
    correction: 'Lift lead elbow parallel to the mat (90° bend); pivot lead foot 90° as if extinguishing a cigarette.',
    errorJoint: 'lEl',
    errorPose: {
      lEl: [0, 0, -30],
      lSh: [-60, -10, 0],
      lHip: [0, 0, 0],
      lAnkle: [0, 0, 0],
    },
  },
  '4': {
    flaw: 'Telegraphing with Wind-Up & Dropping Head',
    consequence: 'Opponent sees the strike early and counters down the pipe with a rear uppercut or knee.',
    correction: 'Level change slightly, loop punch tight over opponent’s lead shoulder, and keep eyes on target.',
    errorJoint: 'rSh',
    errorPose: {
      rSh: [-40, 70, 0],
      head: [-20, 0, 0],
      lSh: [-30, 0, 0],
    },
  },
  '5': {
    flaw: 'Dropping Hand to Hip Before Punching',
    consequence: 'Telegraphs the uppercut and drops your primary defense on that side of the face.',
    correction: 'Dip with the knees and rotate from legs/core; do not scoop hand down below chest level.',
    errorJoint: 'lEl',
    errorPose: {
      lSh: [-20, -10, 0],
      lEl: [-40, 0, 0],
      spine: [-10, 0, 0],
    },
  },
  '6': {
    flaw: 'Wide Arm Swing Without Penetrating Step',
    consequence: 'Glances harmlessly off defense, lacks cutting leverage, and leaves the chin vulnerable.',
    correction: 'Step in deep, pivot on lead foot, and slash across horizontally while pulling opposite hand tight.',
    errorJoint: 'lEl',
    errorPose: {
      lEl: [0, 0, -60],
      lSh: [-60, 20, 0],
      pos: [0, 0, 0],
    },
  },
  '7': {
    flaw: 'Upward Trajectory Without Forward Hip Thrust',
    consequence: 'Upward angle lacks forward penetration and dormant toes risk injury against opponent’s hip.',
    correction: 'Point toes downward, drive pelvis forward into target, and lean torso back for counterweight.',
    errorJoint: 'rAnkle',
    errorPose: {
      rAnkle: [-30, 0, 0],
      spine: [0, 0, 0],
      root: [0, 0, 0],
      rHip: [-60, 0, 0],
    },
  },
  '8': {
    flaw: 'Pushing with Flat Heel Without Hip Extension',
    consequence: 'Acts like a push rather than a sharp stopping strike; easily grabbed or swept aside.',
    correction: 'Chamber knee high, snap hips forward, and strike with the ball of the foot (metatarsal pads).',
    errorJoint: 'lAnkle',
    errorPose: {
      lAnkle: [20, 0, 0],
      spine: [0, 0, 0],
      lHip: [-50, 0, 0],
    },
  },
  '9': {
    flaw: 'Flat Base Foot (Zero Pivot on Standing Leg)',
    consequence: 'Torques the standing knee joint instead of the hip, resulting in weak power and severe ACL strain.',
    correction: 'Pivot on the ball of the standing foot at least 90°–135°, open hips completely, and swing arm down.',
    errorJoint: 'lAnkle',
    errorPose: {
      lAnkle: [0, 0, 0],
      lHip: [0, 0, 0],
      root: [0, 10, 0],
      rHip: [-40, -15, 0],
    },
  },
  '0': {
    flaw: 'Bending at the Waist Instead of Knees',
    consequence: 'Head dips down into incoming knees, uppercuts, or guillotine chokes while compromising balance.',
    correction: 'Bend knees with small weight transfer; rotate shoulders slightly while keeping eyes straight ahead.',
    errorJoint: 'spine',
    errorPose: {
      spine: [48, 0, 0],
      head: [-15, 0, 0],
      lKnee: [5, 0, 0],
      rKnee: [5, 0, 0],
    },
  },
  Q: {
    flaw: 'Head Placed on Inside of Opponent’s Hip',
    consequence: 'Places your neck directly into opponent’s guillotine choke and weakens driving leverage.',
    correction: 'Press forehead firmly against opponent’s ribs/chest (outside), posture tall, back straight.',
    errorJoint: 'head',
    errorPose: {
      head: [0, 30, 0],
      spine: [40, 0, 0],
    },
  },
  W: {
    flaw: 'Reaching with Arms Before Penetrating with Hips',
    consequence: 'Opponent sprawling crushes you instantly; leaves hips too far back to finish the takedown.',
    correction: 'Level change low, drive lead knee through opponent’s stance, and keep chest upright before wrapping.',
    errorJoint: 'spine',
    errorPose: {
      spine: [50, 0, 0],
      lKnee: [15, 0, 0],
      rKnee: [15, 0, 0],
      pos: [0, 0, -0.1],
    },
  },
  E: {
    flaw: 'Dropping Knees Directly to the Mat',
    consequence: 'Absorbs opponent’s drive onto your own joints instead of pinning them under your hips.',
    correction: 'Drive hips down onto opponent’s head/neck; kick toes back and keep shoelaces flat on the mat.',
    errorJoint: 'lKnee',
    errorPose: {
      lKnee: [90, 0, 0],
      rKnee: [90, 0, 0],
      root: [0, 0, 0],
    },
  },
};
