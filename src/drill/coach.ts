/**
 * Interactive Drill Coach Service for Cagecraft 3D
 * Audio-visual random callout trainer for form and reaction time
 */

import type { Technique, DrillState } from '../types/kinematics';

export interface DrillCallbacks {
  onCallout: (technique: Technique) => void;
  onClearCallout: () => void;
  onSelectTechnique: (index: number) => void;
  onPlayTechnique: () => void;
  onStopTechnique: () => void;
}

export class DrillCoach {
  public state: DrillState = {
    set: 'strike',
    gap: 5,
    phase: 'idle',
    at: 0,
    last: -1,
  };

  public voiceEnabled = true;
  public tickEnabled = true;

  private audioCtx: AudioContext | null = null;
  private techniques: Technique[];
  private callbacks: DrillCallbacks;

  constructor(techniques: Technique[], callbacks: DrillCallbacks) {
    this.techniques = techniques;
    this.callbacks = callbacks;
  }

  public getPool(): number[] {
    return this.techniques
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => this.state.set === 'all' || t.group === this.state.set)
      .map(({ i }) => i);
  }

  public playTone(frequency: number, duration: number): void {
    if (!this.tickEnabled || typeof window === 'undefined') return;
    try {
      if (!this.audioCtx) {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = frequency;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone could not be played', e);
    }
  }

  public speak(text: string): void {
    if (!this.voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis could not speak', e);
    }
  }

  public start(now: number): void {
    this.state.phase = 'wait';
    this.state.at = now + 800;
  }

  public stop(): void {
    this.state.phase = 'idle';
    this.callbacks.onClearCallout();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }

  public update(now: number, currentSpeed: number): void {
    if (this.state.phase === 'idle' || now < this.state.at) return;

    if (this.state.phase === 'wait') {
      const pool = this.getPool();
      if (!pool.length) {
        this.stop();
        return;
      }
      let pick = pool[Math.floor(Math.random() * pool.length)];
      if (pool.length > 1) {
        while (pick === this.state.last) {
          pick = pool[Math.floor(Math.random() * pool.length)];
        }
      }
      this.state.last = pick;
      this.state.pick = pick;

      const tk = this.techniques[pick];
      this.callbacks.onCallout(tk);
      this.speak(tk.name);
      this.playTone(880, 0.08);

      this.callbacks.onStopTechnique();
      this.state.phase = 'perform';
      this.state.at = now + this.state.gap * 1000 * 0.55;
    } else if (this.state.phase === 'perform') {
      this.callbacks.onClearCallout();
      if (this.state.pick !== undefined) {
        this.callbacks.onSelectTechnique(this.state.pick);
        this.playTone(440, 0.08);
        this.callbacks.onPlayTechnique();
        const duration = this.techniques[this.state.pick].dur;
        this.state.phase = 'show';
        this.state.at = now + (duration / currentSpeed) * 1000 + 300;
      }
    } else if (this.state.phase === 'show') {
      this.callbacks.onStopTechnique();
      this.state.phase = 'wait';
      this.state.at = now + Math.max(600, this.state.gap * 1000 * 0.45);
    }
  }
}

