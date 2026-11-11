/**
 * 3D Pose Calibrator & Visual Angle Tuning Tool for Cagecraft 3D
 * Enables live biomechanical inspection and precision tuning of joint rotations in 3D.
 */

import type { JointIdentifier, Pose, Vector3Tuple } from '../types/kinematics';
import { JOINTS } from '../engine/kinematics';

export const JOINT_DISPLAY_NAMES: Record<JointIdentifier, string> = {
  root: 'Pelvis / Root',
  spine: 'Spine / Torso',
  head: 'Head & Chin',
  lSh: 'Lead Shoulder',
  lEl: 'Lead Elbow',
  lWrist: 'Lead Wrist & Fist',
  rSh: 'Rear Shoulder',
  rEl: 'Rear Elbow',
  rWrist: 'Rear Wrist & Fist',
  lHip: 'Lead Hip',
  lKnee: 'Lead Knee',
  lAnkle: 'Lead Foot / Ankle',
  rHip: 'Rear Hip',
  rKnee: 'Rear Knee',
  rAnkle: 'Rear Foot / Ankle',
};

export interface PoseCalibratorCallbacks {
  onPoseChanged: (pose: Pose) => void;
  onSaveCalibration?: (pose: Pose) => void;
  onResetCalibration?: () => void;
  onClose: () => void;
}

export class PoseCalibrator {
  private panel: HTMLElement | null = null;
  private currentPose: Pose | null = null;
  private selectedJoint: JointIdentifier = 'lSh';
  private isOpen = false;

  constructor(private readonly callbacks: PoseCalibratorCallbacks) {
    this.createPanel();
  }

  public get visible(): boolean {
    return this.isOpen;
  }

  public open(initialPose: Pose): void {
    this.isOpen = true;
    this.currentPose = JSON.parse(JSON.stringify(initialPose));
    if (this.panel) {
      this.panel.style.display = 'block';
      this.syncUiToJoint();
    }
  }

  public close(): void {
    this.isOpen = false;
    if (this.panel) {
      this.panel.style.display = 'none';
    }
    this.callbacks.onClose();
  }

  public toggle(currentPose: Pose): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open(currentPose);
    }
  }

  public getCurrentPose(): Pose | null {
    return this.currentPose;
  }

  private createPanel(): void {
    if (typeof document === 'undefined') return;

    const panel = document.createElement('div');
    panel.id = 'calibratorPanel';
    panel.className = 'ui panel';
    panel.style.display = 'none';

    panel.innerHTML = `
      <div class="cal-header">
        <h3>📐 Pose Calibrator</h3>
        <button id="calCloseBtn" class="cal-icon-btn">✕</button>
      </div>
      <p class="cal-hint">Tweak angles live to verify guard, hip turn, and strike trajectory.</p>

      <div class="cal-group">
        <label for="calJointSelect">Joint to Adjust</label>
        <select id="calJointSelect" class="cal-select">
          ${JOINTS.map((j) => `<option value="${j}">${JOINT_DISPLAY_NAMES[j] || j}</option>`).join('')}
        </select>
      </div>

      <div class="cal-slider-group">
        <div class="cal-slider-row">
          <label>X (Pitch / Forward-Back): <span id="calValX">0°</span></label>
          <input type="range" id="calSliderX" min="-180" max="180" step="1" value="0">
        </div>
        <div class="cal-slider-row">
          <label>Y (Yaw / Horizontal Twist): <span id="calValY">0°</span></label>
          <input type="range" id="calSliderY" min="-180" max="180" step="1" value="0">
        </div>
        <div class="cal-slider-row">
          <label>Z (Roll / Lateral Tilt): <span id="calValZ">0°</span></label>
          <input type="range" id="calSliderZ" min="-180" max="180" step="1" value="0">
        </div>
      </div>

      <div id="calPosGroup" class="cal-slider-group" style="display: none; border-top: 1px solid var(--line); margin-top: 8px; padding-top: 8px;">
        <label style="font-weight: 600; color: var(--ink);">Root Position Offsets (meters)</label>
        <div class="cal-slider-row">
          <label>Pos X (Lateral): <span id="calValPosX">0.00 m</span></label>
          <input type="range" id="calSliderPosX" min="-2.0" max="2.0" step="0.02" value="0">
        </div>
        <div class="cal-slider-row">
          <label>Pos Y (Elevation): <span id="calValPosY">0.00 m</span></label>
          <input type="range" id="calSliderPosY" min="-1.0" max="1.0" step="0.02" value="0">
        </div>
        <div class="cal-slider-row">
          <label>Pos Z (Forward/Back): <span id="calValPosZ">0.00 m</span></label>
          <input type="range" id="calSliderPosZ" min="-2.0" max="2.0" step="0.02" value="0">
        </div>
      </div>

      <div class="cal-actions">
        <button id="calSaveBtn" class="btn primary">💾 Save to Browser</button>
        <button id="calResetOverrideBtn" class="btn">↺ Reset Default</button>
      </div>
      <div class="cal-actions" style="margin-top: 6px;">
        <button id="calCopyBtn" class="btn">📋 Copy Pose JSON</button>
        <button id="calResetJointBtn" class="btn">↺ Reset Joint</button>
      </div>
      <div id="calToast" class="cal-toast"></div>
    `;

    document.body.appendChild(panel);
    this.panel = panel;
    this.bindEvents();
  }

  private bindEvents(): void {
    if (!this.panel) return;

    const jointSelect = this.panel.querySelector('#calJointSelect') as HTMLSelectElement | null;
    const sliderX = this.panel.querySelector('#calSliderX') as HTMLInputElement | null;
    const sliderY = this.panel.querySelector('#calSliderY') as HTMLInputElement | null;
    const sliderZ = this.panel.querySelector('#calSliderZ') as HTMLInputElement | null;
    const sliderPosX = this.panel.querySelector('#calSliderPosX') as HTMLInputElement | null;
    const sliderPosY = this.panel.querySelector('#calSliderPosY') as HTMLInputElement | null;
    const sliderPosZ = this.panel.querySelector('#calSliderPosZ') as HTMLInputElement | null;
    const closeBtn = this.panel.querySelector('#calCloseBtn');
    const saveBtn = this.panel.querySelector('#calSaveBtn');
    const resetOverrideBtn = this.panel.querySelector('#calResetOverrideBtn');
    const copyBtn = this.panel.querySelector('#calCopyBtn');
    const resetJointBtn = this.panel.querySelector('#calResetJointBtn');

    saveBtn?.addEventListener('click', () => {
      if (this.currentPose) {
        this.callbacks.onSaveCalibration?.(this.currentPose);
        this.showToast('✅ Calibration saved to browser storage!');
      }
    });

    resetOverrideBtn?.addEventListener('click', () => {
      this.callbacks.onResetCalibration?.();
      this.showToast('↺ Reverted to default technique keyframe!');
    });

    jointSelect?.addEventListener('change', () => {
      this.selectedJoint = jointSelect.value as JointIdentifier;
      this.syncUiToJoint();
    });

    const onAngleSliderChange = () => {
      if (!this.currentPose) return;
      const x = Number(sliderX?.value || 0);
      const y = Number(sliderY?.value || 0);
      const z = Number(sliderZ?.value || 0);

      this.currentPose[this.selectedJoint] = [x, y, z];
      this.updateSliderLabels(x, y, z);
      this.callbacks.onPoseChanged(this.currentPose);
    };

    sliderX?.addEventListener('input', onAngleSliderChange);
    sliderY?.addEventListener('input', onAngleSliderChange);
    sliderZ?.addEventListener('input', onAngleSliderChange);

    const onPosSliderChange = () => {
      if (!this.currentPose) return;
      const px = Number(sliderPosX?.value || 0);
      const py = Number(sliderPosY?.value || 0);
      const pz = Number(sliderPosZ?.value || 0);

      this.currentPose.pos = [px, py, pz];
      this.updatePosLabels(px, py, pz);
      this.callbacks.onPoseChanged(this.currentPose);
    };

    sliderPosX?.addEventListener('input', onPosSliderChange);
    sliderPosY?.addEventListener('input', onPosSliderChange);
    sliderPosZ?.addEventListener('input', onPosSliderChange);

    closeBtn?.addEventListener('click', () => this.close());

    copyBtn?.addEventListener('click', () => {
      if (!this.currentPose) return;
      const json = JSON.stringify(this.currentPose, null, 2);
      navigator.clipboard
        ?.writeText(json)
        .then(() => {
          this.showToast('✓ Pose JSON copied to clipboard!');
        })
        .catch(() => {
          this.showToast('Copied to memory.');
        });
    });

    resetJointBtn?.addEventListener('click', () => {
      if (!this.currentPose) return;
      this.currentPose[this.selectedJoint] = [0, 0, 0];
      this.syncUiToJoint();
      this.callbacks.onPoseChanged(this.currentPose);
    });
  }

  private syncUiToJoint(): void {
    if (!this.panel || !this.currentPose) return;

    const sliderX = this.panel.querySelector('#calSliderX') as HTMLInputElement | null;
    const sliderY = this.panel.querySelector('#calSliderY') as HTMLInputElement | null;
    const sliderZ = this.panel.querySelector('#calSliderZ') as HTMLInputElement | null;
    const posGroup = this.panel.querySelector('#calPosGroup') as HTMLElement | null;

    const angles: Vector3Tuple = this.currentPose[this.selectedJoint] || [0, 0, 0];
    if (sliderX) sliderX.value = String(angles[0]);
    if (sliderY) sliderY.value = String(angles[1]);
    if (sliderZ) sliderZ.value = String(angles[2]);
    this.updateSliderLabels(angles[0], angles[1], angles[2]);

    // Position controls shown only for root pelvis joint
    if (posGroup) {
      const isRoot = this.selectedJoint === 'root';
      posGroup.style.display = isRoot ? 'block' : 'none';
      if (isRoot) {
        const pos = this.currentPose.pos || [0, 0, 0];
        const sliderPosX = this.panel.querySelector('#calSliderPosX') as HTMLInputElement | null;
        const sliderPosY = this.panel.querySelector('#calSliderPosY') as HTMLInputElement | null;
        const sliderPosZ = this.panel.querySelector('#calSliderPosZ') as HTMLInputElement | null;
        if (sliderPosX) sliderPosX.value = String(pos[0]);
        if (sliderPosY) sliderPosY.value = String(pos[1]);
        if (sliderPosZ) sliderPosZ.value = String(pos[2]);
        this.updatePosLabels(pos[0], pos[1], pos[2]);
      }
    }
  }

  private updateSliderLabels(x: number, y: number, z: number): void {
    if (!this.panel) return;
    const valX = this.panel.querySelector('#calValX');
    const valY = this.panel.querySelector('#calValY');
    const valZ = this.panel.querySelector('#calValZ');
    if (valX) valX.textContent = `${Math.round(x)}°`;
    if (valY) valY.textContent = `${Math.round(y)}°`;
    if (valZ) valZ.textContent = `${Math.round(z)}°`;
  }

  private updatePosLabels(px: number, py: number, pz: number): void {
    if (!this.panel) return;
    const valPosX = this.panel.querySelector('#calValPosX');
    const valPosY = this.panel.querySelector('#calValPosY');
    const valPosZ = this.panel.querySelector('#calValPosZ');
    if (valPosX) valPosX.textContent = `${px.toFixed(2)} m`;
    if (valPosY) valPosY.textContent = `${py.toFixed(2)} m`;
    if (valPosZ) valPosZ.textContent = `${pz.toFixed(2)} m`;
  }

  private showToast(message: string): void {
    if (!this.panel) return;
    const toast = this.panel.querySelector('#calToast') as HTMLElement | null;
    if (toast) {
      toast.textContent = message;
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 2500);
    }
  }
}
