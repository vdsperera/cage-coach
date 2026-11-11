import { describe, it, expect, vi } from 'vitest';
import { RoundTimer } from '../../src/drill/timer';

describe('Combat Round Timer Subsystem', () => {
  it('initializes with default 3-minute round in idle phase', () => {
    const timer = new RoundTimer();
    expect(timer.currentPhase).toBe('idle');
    expect(timer.round).toBe(1);
    expect(timer.remaining).toBe(180);
    expect(timer.isRunning).toBe(false);
  });

  it('updates duration when idle', () => {
    const timer = new RoundTimer();
    timer.setRoundDuration(300);
    expect(timer.remaining).toBe(300);
  });

  it('counts down correctly per tick', () => {
    const onTick = vi.fn();
    const timer = new RoundTimer(
      { roundDurationSec: 180 },
      { onTick, onPhaseChange: vi.fn() }
    );

    timer.start();
    expect(timer.isRunning).toBe(true);
    expect(timer.currentPhase).toBe('round');

    timer.tick();
    expect(timer.remaining).toBe(179);
    expect(onTick).toHaveBeenCalled();
  });

  it('transitions to warning phase at 10 seconds remaining', () => {
    const onPhaseChange = vi.fn();
    const timer = new RoundTimer(
      { roundDurationSec: 12 },
      { onTick: vi.fn(), onPhaseChange }
    );

    timer.start();
    timer.tick(); // 11s
    expect(timer.currentPhase).toBe('round');

    timer.tick(); // 10s -> warning
    expect(timer.remaining).toBe(10);
    expect(timer.currentPhase).toBe('warning');
    expect(onPhaseChange).toHaveBeenCalledWith('warning', 1);
  });

  it('transitions to rest interval when round ends', () => {
    const onPhaseChange = vi.fn();
    const timer = new RoundTimer(
      { roundDurationSec: 2, restDurationSec: 10, totalRounds: 3 },
      { onTick: vi.fn(), onPhaseChange }
    );

    timer.start();
    timer.tick(); // 1s
    timer.tick(); // 0s
    timer.tick(); // transitions to rest

    expect(timer.currentPhase).toBe('rest');
    expect(timer.remaining).toBe(10);
    expect(onPhaseChange).toHaveBeenCalledWith('rest', 1);
  });

  it('advances to next round after rest interval concludes', () => {
    const onPhaseChange = vi.fn();
    const timer = new RoundTimer(
      { roundDurationSec: 2, restDurationSec: 1, totalRounds: 3 },
      { onTick: vi.fn(), onPhaseChange }
    );

    timer.start();
    timer.tick(); // 1s
    timer.tick(); // 0s
    timer.tick(); // rest starts (1s)
    expect(timer.currentPhase).toBe('rest');

    timer.tick(); // rest 0s
    timer.tick(); // round 2 starts!
    expect(timer.currentPhase).toBe('round');
    expect(timer.round).toBe(2);
    expect(timer.remaining).toBe(2);
  });

  it('resets to idle after final round concludes', () => {
    const timer = new RoundTimer(
      { roundDurationSec: 1, restDurationSec: 1, totalRounds: 1 }
    );

    timer.start();
    timer.tick(); // 0s
    timer.tick(); // round ended and max rounds reached -> reset to idle

    expect(timer.currentPhase).toBe('idle');
    expect(timer.round).toBe(1);
    expect(timer.isRunning).toBe(false);
  });
});

