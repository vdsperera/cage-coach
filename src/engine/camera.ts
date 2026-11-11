/**
 * Multi-Camera Orbit Controller and Quad-Split Scissor Viewports for Cagecraft 3D
 * Enforces Invariants AP-001 (Zero GC Hotpath) & AP-005 (Mobile Touch-Action)
 */

import * as THREE from 'three';

export type CameraPresetIndex = 0 | 1 | 2 | 3 | 4;

export interface CameraOrbitParameters {
  theta: number;
  phi: number;
  r: number;
}

export interface ViewportConfig {
  x: number;
  y: number;
  w: number;
  h: number;
  cam: THREE.PerspectiveCamera;
  label?: string;
}

export const CAMERA_PRESETS: CameraOrbitParameters[] = [
  { theta: 0.62, phi: 1.22, r: 4.6 }, // 0: Front / Default Orbit
  { theta: 1.57, phi: 1.3, r: 4.4 }, // 1: Side View
  { theta: 0.4, phi: 0.55, r: 5.2 }, // 2: Above / Bird's Eye
  { theta: 3.05, phi: 1.25, r: 4.2 }, // 3: Behind View
];

export interface FixedViewParameters {
  theta: number;
  phi: number;
}

export const FIXED_VIEWS: FixedViewParameters[] = [
  { theta: Math.PI / 2, phi: 1.3 }, // 0: Side view
  { theta: 0.001, phi: 0.06 }, // 1: Top down
  { theta: Math.PI, phi: 1.25 }, // 2: Rear view
];

const DEFAULT_TARGET = new THREE.Vector3(0, 1.0, 0);
const DEFAULT_PARTNER_EYE = new THREE.Vector3(0, 1.62, 1.45);
const scratchLook = new THREE.Vector3();

function placeCamera(
  c: THREE.PerspectiveCamera,
  theta: number,
  phi: number,
  r: number,
  target: THREE.Vector3
): void {
  const sinPhi = Math.sin(phi);
  c.position.set(
    target.x + r * sinPhi * Math.sin(theta),
    target.y + r * Math.cos(phi),
    target.z + r * sinPhi * Math.cos(theta)
  );
  c.lookAt(target);
}

export class CameraController {
  public readonly mainCamera: THREE.PerspectiveCamera;
  public readonly fixedCameras: [
    THREE.PerspectiveCamera,
    THREE.PerspectiveCamera,
    THREE.PerspectiveCamera,
  ];

  public readonly cam: CameraOrbitParameters & { target: THREE.Vector3 };
  public readonly camGoal: CameraOrbitParameters;
  public readonly camTargetGoal: THREE.Vector3;

  private readonly singleViewport: [ViewportConfig];
  private readonly splitViewports: [ViewportConfig, ViewportConfig, ViewportConfig, ViewportConfig];

  private lastWidth = 0;
  private lastHeight = 0;
  private lastSplit = false;

  constructor() {
    this.mainCamera = new THREE.PerspectiveCamera(38, 1, 0.05, 100);
    this.fixedCameras = [
      new THREE.PerspectiveCamera(38, 1, 0.1, 100),
      new THREE.PerspectiveCamera(38, 1, 0.1, 100),
      new THREE.PerspectiveCamera(38, 1, 0.1, 100),
    ];

    this.cam = {
      ...CAMERA_PRESETS[0],
      target: DEFAULT_TARGET.clone(),
    };
    this.camGoal = { ...CAMERA_PRESETS[0] };
    this.camTargetGoal = DEFAULT_TARGET.clone();

    this.singleViewport = [{ x: 0, y: 0, w: 1, h: 1, cam: this.mainCamera, label: 'Main' }];

    this.splitViewports = [
      { x: 0, y: 0, w: 1, h: 1, cam: this.mainCamera, label: 'Orbit' },
      { x: 0, y: 0, w: 1, h: 1, cam: this.fixedCameras[0], label: 'Side' },
      { x: 0, y: 0, w: 1, h: 1, cam: this.fixedCameras[1], label: 'Top' },
      { x: 0, y: 0, w: 1, h: 1, cam: this.fixedCameras[2], label: 'Rear' },
    ];
  }

  public setPreset(index: CameraPresetIndex): void {
    if (index >= 0 && index < CAMERA_PRESETS.length) {
      const preset = CAMERA_PRESETS[index];
      this.camGoal.theta = preset.theta;
      this.camGoal.phi = preset.phi;
      this.camGoal.r = preset.r;
    }
  }

  public setTarget(x: number, y: number, z: number): void {
    this.camTargetGoal.set(x, y, z);
  }

  public update(
    presetIndex: CameraPresetIndex,
    partnerEye?: THREE.Vector3 | null,
    partnerTarget?: THREE.Vector3 | null
  ): void {
    // Smooth lerp of camera target and spherical parameters
    this.cam.target.lerp(this.camTargetGoal, 0.08);
    this.cam.theta += (this.camGoal.theta - this.cam.theta) * 0.12;
    this.cam.phi += (this.camGoal.phi - this.cam.phi) * 0.12;
    this.cam.r += (this.camGoal.r - this.cam.r) * 0.12;

    if (presetIndex === 4) {
      // First-person partner POV
      if (partnerEye) {
        this.mainCamera.position.lerp(partnerEye, 0.3);
      } else {
        this.mainCamera.position.lerp(DEFAULT_PARTNER_EYE, 0.3);
      }
      const target = partnerTarget || this.cam.target;
      scratchLook.set(target.x, target.y + 0.25, target.z);
      this.mainCamera.lookAt(scratchLook);
    } else {
      placeCamera(this.mainCamera, this.cam.theta, this.cam.phi, this.cam.r, this.cam.target);
    }

    // Update fixed cameras for quad-split mode
    for (let i = 0; i < FIXED_VIEWS.length; i++) {
      placeCamera(
        this.fixedCameras[i],
        FIXED_VIEWS[i].theta,
        FIXED_VIEWS[i].phi,
        this.cam.r,
        this.cam.target
      );
    }
  }

  public getViewports(width: number, height: number, isSplit: boolean): ViewportConfig[] {
    const sizeChanged =
      width !== this.lastWidth || height !== this.lastHeight || isSplit !== this.lastSplit;

    if (!isSplit) {
      const v0 = this.singleViewport[0];
      v0.x = 0;
      v0.y = 0;
      v0.w = width;
      v0.h = height;
      if (sizeChanged) {
        v0.cam.aspect = width / Math.max(1, height);
        v0.cam.updateProjectionMatrix();
      }
      this.lastWidth = width;
      this.lastHeight = height;
      this.lastSplit = isSplit;
      return this.singleViewport;
    }

    const mainW = Math.round(width * 0.62);
    const subW = width - mainW;
    const subH = Math.floor(height / 3);

    const v0 = this.splitViewports[0];
    v0.x = 0;
    v0.y = 0;
    v0.w = mainW;
    v0.h = height;

    const v1 = this.splitViewports[1];
    v1.x = mainW;
    v1.y = height - subH;
    v1.w = subW;
    v1.h = subH;

    const v2 = this.splitViewports[2];
    v2.x = mainW;
    v2.y = height - 2 * subH;
    v2.w = subW;
    v2.h = subH;

    const v3 = this.splitViewports[3];
    v3.x = mainW;
    v3.y = 0;
    v3.w = subW;
    v3.h = height - 2 * subH;

    if (sizeChanged) {
      for (let i = 0; i < this.splitViewports.length; i++) {
        const v = this.splitViewports[i];
        v.cam.aspect = v.w / Math.max(1, v.h);
        v.cam.updateProjectionMatrix();
      }
    }

    this.lastWidth = width;
    this.lastHeight = height;
    this.lastSplit = isSplit;
    return this.splitViewports;
  }

  public render(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    width: number,
    height: number,
    isSplit: boolean
  ): void {
    const vps = this.getViewports(width, height, isSplit);
    renderer.setScissorTest(vps.length > 1);
    for (let i = 0; i < vps.length; i++) {
      const v = vps[i];
      renderer.setViewport(v.x, v.y, v.w, v.h);
      renderer.setScissor(v.x, v.y, v.w, v.h);
      renderer.render(scene, v.cam);
    }
  }

  public attachPointerEvents(
    element: HTMLElement,
    canOrbit: () => boolean = () => true
  ): () => void {
    // Invariant AP-005: Prevent mobile gesture interference
    element.style.touchAction = 'none';

    let drag: { x: number; y: number } | null = null;

    const onPointerDown = (e: PointerEvent): void => {
      drag = { x: e.clientX, y: e.clientY };
      element.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent): void => {
      if (!drag || !canOrbit()) return;
      this.camGoal.theta -= (e.clientX - drag.x) * 0.006;
      this.camGoal.phi = Math.min(
        1.5,
        Math.max(0.25, this.camGoal.phi - (e.clientY - drag.y) * 0.005)
      );
      this.cam.theta = this.camGoal.theta;
      this.cam.phi = this.camGoal.phi;
      drag = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent): void => {
      drag = null;
      try {
        element.releasePointerCapture(e.pointerId);
      } catch {
        // Ignored if pointer was released already
      }
    };

    const onWheel = (e: WheelEvent): void => {
      this.camGoal.r = Math.min(9, Math.max(2.2, this.camGoal.r + e.deltaY * 0.004));
    };

    element.addEventListener('pointerdown', onPointerDown);
    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerup', onPointerUp);
    element.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      element.removeEventListener('pointerdown', onPointerDown);
      element.removeEventListener('pointermove', onPointerMove);
      element.removeEventListener('pointerup', onPointerUp);
      element.removeEventListener('wheel', onWheel);
    };
  }
}
