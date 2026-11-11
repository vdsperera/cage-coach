/**
 * Zero-Allocation Biomechanical Telemetry Calculation Service for Cagecraft 3D
 * Enforces Invariant AP-001 (Zero Vector Allocations in Hot Path)
 */

import * as THREE from 'three';
import type { TelemetryReadout, AnatomicalMarker } from '../types/kinematics';
import { D } from './kinematics';

// Pre-allocated static scratch vectors (AP-001)
const roV1 = new THREE.Vector3();
const roV2 = new THREE.Vector3();
const roV3 = new THREE.Vector3();
const v1 = new THREE.Vector3();
const v2 = new THREE.Vector3();
const v3 = new THREE.Vector3();

// Reusable telemetry output record to avoid garbage churn
const cachedReadout: TelemetryReadout = {
  leadKneeFlexion: '–',
  rearKneeFlexion: '–',
  leadElbowExtension: '–',
  rearElbowExtension: '–',
  hipRotationYaw: '–',
  torsoLean: '–',
  headHeightMeters: '–',
  leadHandHeightMeters: '–',
};

/**
 * Calculates the interior angle in degrees at vertex `b` between rays `(a - b)` and `(c - b)`.
 * Completely zero-allocation using pre-allocated vectors.
 */
export function angleAt(
  a: THREE.Vector3,
  b: THREE.Vector3,
  c: THREE.Vector3
): number {
  v1.subVectors(a, b);
  v2.subVectors(c, b);
  const dot = v1.dot(v2);
  const denom = v1.length() * v2.length() || 1;
  const cosAngle = Math.min(1, Math.max(-1, dot / denom));
  return Math.acos(cosAngle) / D;
}

export type PointProvider = (
  name: AnatomicalMarker,
  out: THREE.Vector3
) => boolean;

/**
 * Computes real-time biomechanical telemetry angles and elevations for a fighter.
 */
export function calculateTelemetry(
  pointProvider: PointProvider,
  southpaw: boolean
): TelemetryReadout {
  const lead = southpaw ? 'r' : 'l';
  const rear = southpaw ? 'l' : 'r';

  const knee = (side: 'l' | 'r'): string => {
    const hipMarker = `${side}HipJoint` as AnatomicalMarker;
    const kneeMarker = `${side}Knee` as AnatomicalMarker;
    const footMarker = `${side}Foot` as AnatomicalMarker;

    if (
      pointProvider(hipMarker, roV1) &&
      pointProvider(kneeMarker, roV2) &&
      pointProvider(footMarker, roV3)
    ) {
      return `${Math.round(180 - angleAt(roV1, roV2, roV3))}°`;
    }
    return '–';
  };

  const elbow = (side: 'l' | 'r'): string => {
    const shMarker = `${side}Shoulder` as AnatomicalMarker;
    const elMarker = `${side}Elbow` as AnatomicalMarker;
    const gloveMarker = `${side}Glove` as AnatomicalMarker;

    if (
      pointProvider(shMarker, roV1) &&
      pointProvider(elMarker, roV2) &&
      pointProvider(gloveMarker, roV3)
    ) {
      return `${Math.round(angleAt(roV1, roV2, roV3))}°`;
    }
    return '–';
  };

  cachedReadout.leadKneeFlexion = knee(lead);
  cachedReadout.rearKneeFlexion = knee(rear);
  cachedReadout.leadElbowExtension = elbow(lead);
  cachedReadout.rearElbowExtension = elbow(rear);

  // Hip rotation yaw
  if (
    pointProvider('lHipJoint', roV1) &&
    pointProvider('rHipJoint', roV2)
  ) {
    v3.subVectors(roV1, roV2);
    const yawDeg = Math.round(Math.abs(Math.atan2(-v3.z, v3.x) / D));
    cachedReadout.hipRotationYaw = `${yawDeg}°`;
  } else {
    cachedReadout.hipRotationYaw = '–';
  }

  // Torso inclination / lean
  if (pointProvider('hips', roV1) && pointProvider('neck', roV2)) {
    v3.subVectors(roV2, roV1);
    const len = v3.length() || 1;
    const lean = Math.round(Math.acos(Math.min(1, v3.y / len)) / D);
    cachedReadout.torsoLean =
      lean < 4 ? 'upright' : `${lean}° ${v3.z >= 0 ? 'fwd' : 'back'}`;
  } else {
    cachedReadout.torsoLean = '–';
  }

  // Elevations
  cachedReadout.headHeightMeters = pointProvider('head', roV1)
    ? `${roV1.y.toFixed(2)} m`
    : '–';

  const leadGloveMarker = `${lead}Glove` as AnatomicalMarker;
  cachedReadout.leadHandHeightMeters = pointProvider(leadGloveMarker, roV1)
    ? `${roV1.y.toFixed(2)} m`
    : '–';

  return cachedReadout;
}

