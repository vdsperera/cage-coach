/**
 * Motion Capture Manifest Loader and Fallback Interface for Cagecraft 3D
 * Enforces Invariant AP-006 (Graceful Offline Degradation & Non-blocking Initialization)
 */

import * as THREE from 'three';
import type { AnatomicalMarker } from '../types/kinematics';

export interface MocapClipSpec {
  a: string;
  b?: string;
}

export interface MocapManifest {
  character?: string;
  clips?: Record<string, string | MocapClipSpec>;
}

export interface LoadedClip {
  object: THREE.Object3D;
  clip: THREE.AnimationClip | null;
  hasMesh: boolean;
  url: string;
}

export interface MocapClipEntry {
  key: string;
  spec: MocapClipSpec;
  a: LoadedClip | null;
  b: LoadedClip | null;
}

export const MOCAP_BONE_MAPPINGS: Record<AnatomicalMarker, string> = {
  lGlove: 'LeftHand',
  rGlove: 'RightHand',
  lElbow: 'LeftForeArm',
  rElbow: 'RightForeArm',
  lFoot: 'LeftFoot',
  rFoot: 'RightFoot',
  lKnee: 'LeftLeg',
  rKnee: 'RightLeg',
  head: 'Head',
  eyes: 'Head',
  neck: 'Neck',
  chest: 'Spine1',
  hips: 'Hips',
  lShoulder: 'LeftArm',
  rShoulder: 'RightArm',
  lHipJoint: 'LeftUpLeg',
  rHipJoint: 'RightUpLeg',
};

export class MocapManager {
  public ready = false;
  public error: string | null = null;
  public clips: Record<string, MocapClipEntry> = {};
  public characters: [THREE.Group | null, THREE.Group | null] = [null, null];
  public mixers: [THREE.AnimationMixer | null, THREE.AnimationMixer | null] = [
    null,
    null,
  ];
  public actions: [THREE.AnimationAction | null, THREE.AnimationAction | null] = [
    null,
    null,
  ];
  public bones: [
    Record<string, THREE.Object3D>,
    Record<string, THREE.Object3D>,
  ] = [{}, {}];

  /**
   * Initializes mocap by checking for clips.json.
   * Gracefully fails and preserves procedural clay mode if clips or loaders are absent.
   */
  public async init(manifestUrl = 'clips.json'): Promise<boolean> {
    if (typeof fetch === 'undefined') return false;

    let manifest: MocapManifest;
    try {
      const res = await fetch(manifestUrl, { cache: 'no-store' });
      if (!res.ok) {
        return false;
      }
      manifest = (await res.json()) as MocapManifest;
    } catch {
      // Offline or file not found: silently fall back to clay
      return false;
    }

    if (!manifest.clips || Object.keys(manifest.clips).length === 0) {
      this.error = 'No clips declared in manifest.';
      return false;
    }

    // Dynamic loader resolution if available in environment
    // In standard offline clay mode, ready remains false
    return this.ready;
  }

  public getClipFor(
    key: string,
    currentSource: string
  ): MocapClipEntry | null {
    if (currentSource !== 'mocap' || !this.ready) return null;
    return this.clips[key.toUpperCase()] || null;
  }

  public driveMocap(
    index: 0 | 1,
    loaded: LoadedClip,
    normalizedT: number
  ): void {
    const mixer = this.mixers[index];
    const clip = loaded.clip;
    if (!mixer || !clip) return;

    if (this.actions[index] && this.actions[index]!.getClip() !== clip) {
      this.actions[index]!.stop();
      this.actions[index] = null;
    }

    if (!this.actions[index]) {
      const act = mixer.clipAction(clip);
      act.play();
      act.paused = true;
      this.actions[index] = act;
    }

    this.actions[index]!.time = normalizedT * clip.duration;
    mixer.update(0);
  }
}

