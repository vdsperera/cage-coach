/**
 * 3D Visual Guidance Overlays with Cached Billboard Textures for Cagecraft 3D
 * Enforces Invariants AP-001 (Zero Allocations in Loop) & AP-003 (Texture Caching)
 */

import * as THREE from 'three';
import type { ContactMark } from '../types/kinematics';

const labelTexCache = new Map<string, THREE.CanvasTexture>();
let sharedRingTex: THREE.CanvasTexture | null = null;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function getRingTexture(): THREE.CanvasTexture {
  if (!sharedRingTex && typeof document !== 'undefined') {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const g = c.getContext('2d');
    if (g) {
      g.strokeStyle = '#FFC53D';
      g.lineWidth = 10;
      g.beginPath();
      g.arc(64, 64, 50, 0, Math.PI * 2);
      g.stroke();

      g.fillStyle = '#FFC53D';
      g.beginPath();
      g.arc(64, 64, 14, 0, Math.PI * 2);
      g.fill();
    }
    sharedRingTex = new THREE.CanvasTexture(c);
  }
  return sharedRingTex!;
}

export function getLabelTexture(text: string, color: string, small = false): THREE.CanvasTexture {
  const key = `${text}|${color}|${small}`;
  let tex = labelTexCache.get(key);
  if (!tex && typeof document !== 'undefined') {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 128;
    const g = c.getContext('2d');
    if (g) {
      g.font = `600 ${small ? 40 : 46}px Barlow, system-ui, sans-serif`;
      const w = Math.min(1000, g.measureText(text).width + 56);
      g.fillStyle = 'rgba(18,22,28,0.88)';
      roundRect(g, (1024 - w) / 2, 20, w, 88, 18);
      g.fill();

      g.fillStyle = color;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(text, 512, 64);
    }
    tex = new THREE.CanvasTexture(c);
    labelTexCache.set(key, tex);
  }
  return tex!;
}

export function makeLabel(text: string, color: string, small = false): THREE.Sprite {
  const mat = new THREE.SpriteMaterial({
    map: getLabelTexture(text, color, small),
    depthTest: false,
    transparent: true,
  });
  const s = new THREE.Sprite(mat);
  s.scale.set(small ? 1.3 : 1.6, small ? 0.16 : 0.2, 1);
  s.renderOrder = 20;
  return s;
}

export function makeRing(): THREE.Sprite {
  const mat = new THREE.SpriteMaterial({
    map: getRingTexture(),
    depthTest: false,
    transparent: true,
  });
  const s = new THREE.Sprite(mat);
  s.scale.set(0.22, 0.22, 1);
  s.renderOrder = 19;
  return s;
}

export function isSharedTexture(tex: THREE.Texture): boolean {
  if (tex === sharedRingTex) return true;
  for (const cached of labelTexCache.values()) {
    if (tex === cached) return true;
  }
  return false;
}

interface MaterialWithMap extends THREE.Material {
  map?: THREE.Texture | null;
}

function disposeMaterial(mat: THREE.Material): void {
  const withMap = mat as MaterialWithMap;
  if (withMap.map && !isSharedTexture(withMap.map)) {
    withMap.map.dispose();
  }
  mat.dispose();
}

/**
 * Cleanly disposes objects and materials in a group while preserving cached textures (AP-003).
 */
export function disposeGuideGroup(group: THREE.Group): void {
  while (group.children.length > 0) {
    const obj = group.children.pop()!;
    obj.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(disposeMaterial);
        } else {
          disposeMaterial(mesh.material);
        }
      }
    });
  }
}

export interface ActiveMark {
  mark: ContactMark;
  ring: THREE.Sprite;
  label: THREE.Sprite;
}

export const TRAIL_CAPACITY = 300;

export class StrikeTrail {
  public readonly line: THREE.Line;
  public readonly geometry: THREE.BufferGeometry;
  public count = 0;
  private lastT = 0;
  private lastPoint: THREE.Object3D | null = null;
  private readonly scratchPos = new THREE.Vector3();

  constructor() {
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(TRAIL_CAPACITY * 3), 3)
    );
    const material = new THREE.LineBasicMaterial({
      color: 0xf2b5ab,
      transparent: true,
      opacity: 0.9,
    });
    this.line = new THREE.Line(this.geometry, material);
    this.line.frustumCulled = false;
  }

  public reset(): void {
    this.count = 0;
    this.lastT = 0;
    this.lastPoint = null;
    this.geometry.setDrawRange(0, 0);
  }

  public update(tracePoint: THREE.Object3D | null, t: number, playing: boolean): void {
    if (tracePoint !== this.lastPoint) {
      this.count = 0;
      this.lastPoint = tracePoint;
    }

    this.line.visible = !!tracePoint;
    if (!tracePoint) return;

    if (playing && (t - this.lastT > 0.004 || t < this.lastT) && this.count < TRAIL_CAPACITY) {
      tracePoint.getWorldPosition(this.scratchPos);
      const arr = this.geometry.attributes.position.array as Float32Array;
      arr[this.count * 3] = this.scratchPos.x;
      arr[this.count * 3 + 1] = this.scratchPos.y;
      arr[this.count * 3 + 2] = this.scratchPos.z;
      this.count++;
      this.lastT = t;
      this.geometry.attributes.position.needsUpdate = true;
    }

    this.geometry.setDrawRange(0, this.count);
  }
}
