/**
 * Combat Round Timer & Procedural Audio Synthesizer for Cage Coach
 * Provides round intervals (3m/5m), 10s wooden clappers, and round bells using the Web Audio API.
 */

export type RoundPhase = 'idle' | 'round' | 'warning' | 'rest';

export interface RoundTimerConfig {
  roundDurationSec: number; // 180s (3m) or 300s (5m)
  restDurationSec: number; // 60s
  totalRounds: number; // e.g. 3 or 5 rounds
}

export interface RoundTimerCallbacks {
  onTick: (remainingSec: number, currentRound: number, phase: RoundPhase) => void;
  onPhaseChange: (phase: RoundPhase, round: number) => void;
}

export class RoundTimer {
  private audioCtx: AudioContext | null = null;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private currentRound = 1;
  private remainingSec = 180;
  private phase: RoundPhase = 'idle';
  private config: RoundTimerConfig = {
    roundDurationSec: 180,
    restDurationSec: 60,
    totalRounds: 3,
  };

  constructor(
    config?: Partial<RoundTimerConfig>,
    private readonly callbacks?: RoundTimerCallbacks
  ) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.remainingSec = this.config.roundDurationSec;
  }

  public get currentPhase(): RoundPhase {
    return this.phase;
  }

  public get round(): number {
    return this.currentRound;
  }

  public get remaining(): number {
    return this.remainingSec;
  }

  public get isRunning(): boolean {
    return this.phase === 'round' || this.phase === 'warning' || this.phase === 'rest';
  }

  public setRoundDuration(sec: number): void {
    this.config.roundDurationSec = sec;
    if (this.phase === 'idle') {
      this.remainingSec = sec;
      this.callbacks?.onTick(this.remainingSec, this.currentRound, this.phase);
    }
  }

  public start(): void {
    this.initAudio();
    if (this.phase === 'idle') {
      this.currentRound = 1;
      this.phase = 'round';
      this.remainingSec = this.config.roundDurationSec;
      this.playRoundBell();
      this.callbacks?.onPhaseChange(this.phase, this.currentRound);
    }

    if (this.timerId !== null) return;

    this.timerId = setInterval(() => {
      this.tick();
    }, 1000);

    this.callbacks?.onTick(this.remainingSec, this.currentRound, this.phase);
  }

  public pause(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public reset(): void {
    this.pause();
    this.phase = 'idle';
    this.currentRound = 1;
    this.remainingSec = this.config.roundDurationSec;
    this.callbacks?.onPhaseChange(this.phase, this.currentRound);
    this.callbacks?.onTick(this.remainingSec, this.currentRound, this.phase);
  }

  public tick(): void {
    if (this.remainingSec > 0) {
      this.remainingSec--;

      // 10-Second Warning Clapper
      if (this.phase === 'round' && this.remainingSec === 10) {
        this.phase = 'warning';
        this.playWoodenClapper();
        this.callbacks?.onPhaseChange(this.phase, this.currentRound);
      }
    } else {
      // Phase Transitions
      if (this.phase === 'round' || this.phase === 'warning') {
        // Round ended -> enter rest
        this.playRoundBell();
        if (this.currentRound >= this.config.totalRounds) {
          // Fight workout completed
          this.reset();
          return;
        } else {
          this.phase = 'rest';
          this.remainingSec = this.config.restDurationSec;
          this.callbacks?.onPhaseChange(this.phase, this.currentRound);
        }
      } else if (this.phase === 'rest') {
        // Rest ended -> next round
        this.currentRound++;
        this.phase = 'round';
        this.remainingSec = this.config.roundDurationSec;
        this.playRoundBell();
        this.callbacks?.onPhaseChange(this.phase, this.currentRound);
      }
    }

    this.callbacks?.onTick(this.remainingSec, this.currentRound, this.phase);
  }

  /* ---------------- Procedural Audio Synthesizers ---------------- */

  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Synthesizes a resonant dual-frequency combat round bell.
   */
  public playRoundBell(): void {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    const freqs = [587.33, 880.0, 1174.66]; // D5, A5, D6 harmonic chime
    freqs.forEach((freq, idx) => {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const amp = 0.35 / (idx + 1);
      gain.gain.setValueAtTime(amp, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
    });
  }

  /**
   * Synthesizes the sharp 10-second wooden warning clapper (`click-clack-clack`).
   */
  public playWoodenClapper(): void {
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    // 3 rhythmic wooden taps at 0s, 0.18s, 0.36s
    [0, 0.18, 0.36].forEach((delay) => {
      if (!this.audioCtx) return;
      const t = now + delay;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(280, t + 0.04);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.05);
    });
  }
}
