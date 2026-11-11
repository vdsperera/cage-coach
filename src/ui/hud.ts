/**
 * Responsive HUD Panels, Card Inspector, and Mobile Dock for Cagecraft 3D
 * Enforces Invariants AP-004 (Defensive Text Handling) & AP-005 (Responsive Touch Viewports)
 */

import type { Technique, TelemetryReadout, AppState } from '../types/kinematics';
import type { ViewportConfig } from '../engine/camera';

export interface HudEventHandlers {
  onSelectTechnique: (index: number) => void;
  onSetMode: (mode: 'single' | 'spar') => void;
  onSetStance: (southpaw: boolean) => void;
  onSetSpeed: (speed: 1 | 0.5 | 0.25) => void;
  onSetCamera: (cam: 0 | 1 | 2 | 3 | 4) => void;
  onSetSource: (src: 'clay' | 'mocap') => void;
  onToggleOption: (
    key: keyof Pick<AppState, 'ghosts' | 'guides' | 'step' | 'split' | 'drill'>
  ) => void;
  onNextPhase: () => void;
  onPrevPhase: () => void;
  onSaveNote: (content: string) => void;
  onExportNotes: () => void;
  onDrillSetChange: (set: 'strike' | 'grapple' | 'combo' | 'all') => void;
  onDrillGapChange: (gap: number) => void;
  onDrillOptionToggle: (option: 'tick' | 'voice', value: boolean) => void;
}

export class HudController {
  private lastPhaseShown = -1;
  private notesDebounceTimer?: number;

  constructor(
    private readonly handlers: HudEventHandlers,
    private readonly techniques: Technique[]
  ) {
    this.bindDomControls();
  }

  public renderCard(
    tech: Technique,
    isSpar: boolean,
    southpaw: boolean,
    noteText: string,
    mocapNote?: string
  ): void {
    const techNameEl = document.getElementById('techName');
    const techKeyEl = document.getElementById('techKey');
    const techSideEl = document.getElementById('techSide');
    const explainEl = document.getElementById('explain');
    const cuesEl = document.getElementById('cues');
    const notesEl = document.getElementById('notes') as HTMLTextAreaElement | null;
    const partnerEl = document.getElementById('partner');
    const phasesEl = document.getElementById('phases');

    if (techNameEl) techNameEl.textContent = tech.name;
    if (techKeyEl) techKeyEl.textContent = tech.key;
    if (techSideEl) {
      techSideEl.textContent = `${tech.group.toUpperCase()} • ${southpaw ? (tech.side === 'Lead' ? 'Rear' : 'Lead') : tech.side}`;
    }

    if (phasesEl) {
      phasesEl.innerHTML = tech.phases.map(() => `<i><b></b></i>`).join('');
    }

    if (explainEl) {
      explainEl.textContent = tech.phases[0]?.[2] || '';
    }

    if (cuesEl) {
      cuesEl.innerHTML = tech.cues.map((c) => `<li>${c}</li>`).join('');
    }

    if (notesEl) {
      notesEl.value = noteText;
    }

    if (partnerEl) {
      let msg = isSpar
        ? `<span>Sparring Partner</span> active: ${tech.partner}.`
        : tech.needsPartner
          ? `<span>Partner</span> ${tech.partner}. Grappling displays both bodies.`
          : 'Press Tab to add a sparring partner.';
      if (mocapNote) {
        msg += `<br>${mocapNote}`;
      }
      partnerEl.innerHTML = msg;
    }

    this.lastPhaseShown = -1;
  }

  public updatePhase(tech: Technique, t: number, playing: boolean): void {
    const items = document.querySelectorAll('#phases i');
    const phaseNameEl = document.getElementById('phaseName');
    const explainEl = document.getElementById('explain');

    let idx = 0;
    while (idx < tech.phases.length - 1 && tech.phases[idx + 1][0] <= t) {
      idx++;
    }

    let prev = 0;
    tech.phases.forEach(([until], i) => {
      const el = items[i] as HTMLElement | undefined;
      if (!el) return;
      const on = i === idx;
      el.classList.toggle('on', on);
      const b = el.firstElementChild as HTMLElement | null;
      if (b) {
        b.style.display = on ? 'block' : 'none';
        if (on) {
          const span = until - prev;
          const progress = span > 0 ? ((t - prev) / span) * 100 : 100;
          b.style.left = `${Math.min(100, Math.max(0, progress))}%`;
        }
      }
      prev = until;
    });

    const phase = tech.phases[idx];
    if (phase && phaseNameEl) {
      phaseNameEl.textContent = `${idx + 1}. ${phase[1]}${playing ? '' : ' (paused)'}`;
      if (idx !== this.lastPhaseShown && explainEl) {
        explainEl.textContent = phase[2] || '';
        this.lastPhaseShown = idx;
      }
    }
  }

  public renderKeys(activeIndex: number): void {
    const keysContainer = document.getElementById('keys');
    if (!keysContainer) return;

    const groups: { id: Technique['group']; label: string }[] = [
      { id: 'strike', label: 'Striking' },
      { id: 'grapple', label: 'Grappling' },
      { id: 'combo', label: 'Combos' },
    ];

    keysContainer.innerHTML = groups
      .map(({ id, label }) => {
        const matches = this.techniques
          .map((tk, idx) => ({ tk, idx }))
          .filter(({ tk }) => tk.group === id);

        const buttons = matches
          .map(
            ({ tk, idx }) => `
          <button class="key ${idx === activeIndex ? 'on' : ''}" data-idx="${idx}">
            <kbd>${tk.key}</kbd>
            <span>${tk.name}<em>${tk.side}</em></span>
          </button>`
          )
          .join('');

        return `
        <div class="row">
          <label>${label}</label>
          ${buttons}
        </div>`;
      })
      .join('');

    keysContainer.querySelectorAll('.key').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = (e.currentTarget as HTMLElement).dataset.idx;
        if (target !== undefined) {
          this.handlers.onSelectTechnique(parseInt(target, 10));
        }
      });
    });
  }

  public updateReadouts(ro: TelemetryReadout): void {
    const ids: Record<keyof TelemetryReadout, string> = {
      leadKneeFlexion: 'r-lk',
      rearKneeFlexion: 'r-rk',
      leadElbowExtension: 'r-le',
      rearElbowExtension: 'r-re',
      hipRotationYaw: 'r-hip',
      torsoLean: 'r-lean',
      headHeightMeters: 'r-head',
      leadHandHeightMeters: 'r-hand',
    };

    for (const [key, id] of Object.entries(ids) as [keyof TelemetryReadout, string][]) {
      const el = document.getElementById(id);
      if (el) el.textContent = ro[key];
    }
  }

  public showDrillCallout(big: string, sub: string, visible: boolean): void {
    const callout = document.getElementById('callout');
    if (!callout) return;
    callout.classList.toggle('on', visible);
    const bigEl = callout.querySelector('.big');
    const subEl = callout.querySelector('.sub');
    if (bigEl) bigEl.textContent = big;
    if (subEl) subEl.innerHTML = sub;
  }

  public updateVLabels(vps: ViewportConfig[], isSplit: boolean): void {
    document.body.classList.toggle('split', isSplit);
    if (!isSplit) return;

    vps.forEach((v, i) => {
      const label = document.getElementById(`vl${i}`);
      if (label) {
        label.style.left = `${v.x + 10}px`;
        label.style.top = `${window.innerHeight - v.y - v.h + 10}px`;
      }
    });
  }

  public updateButtons(state: AppState): void {
    document.querySelectorAll('#modeSeg button').forEach((b) => {
      const btn = b as HTMLElement;
      btn.setAttribute('aria-pressed', String(btn.dataset.mode === state.mode));
    });

    document.querySelectorAll('#stanceSeg button').forEach((b) => {
      const btn = b as HTMLElement;
      btn.setAttribute(
        'aria-pressed',
        String((btn.dataset.stance === 'southpaw') === state.southpaw)
      );
    });

    document.querySelectorAll('#speedSeg button').forEach((b) => {
      const btn = b as HTMLElement;
      btn.setAttribute('aria-pressed', String(Number(btn.dataset.speed) === state.speed));
    });

    document.querySelectorAll('#camSeg button').forEach((b) => {
      const btn = b as HTMLElement;
      btn.setAttribute('aria-pressed', String(Number(btn.dataset.cam) === state.cam));
    });

    document.querySelectorAll('#srcSeg button').forEach((b) => {
      const btn = b as HTMLElement;
      btn.setAttribute('aria-pressed', String(btn.dataset.src === state.src));
    });

    document.querySelectorAll('#viewSeg button').forEach((b) => {
      const btn = b as HTMLElement;
      const opt = btn.dataset.opt as keyof AppState | undefined;
      if (opt && typeof state[opt] === 'boolean') {
        btn.setAttribute('aria-pressed', String(state[opt]));
      }
    });

    const drillPanel = document.getElementById('drill');
    if (drillPanel) {
      drillPanel.classList.toggle('on', state.drill);
    }
  }

  private bindDomControls(): void {
    // Mode Segment
    document.querySelectorAll('#modeSeg button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = (btn as HTMLElement).dataset.mode as 'single' | 'spar';
        if (mode) this.handlers.onSetMode(mode);
      });
    });

    // Stance Segment
    document.querySelectorAll('#stanceSeg button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const stance = (btn as HTMLElement).dataset.stance;
        this.handlers.onSetStance(stance === 'southpaw');
      });
    });

    // Speed Segment
    document.querySelectorAll('#speedSeg button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const spd = Number((btn as HTMLElement).dataset.speed) as 1 | 0.5 | 0.25;
        this.handlers.onSetSpeed(spd);
      });
    });

    // Camera Segment
    document.querySelectorAll('#camSeg button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cam = Number((btn as HTMLElement).dataset.cam) as 0 | 1 | 2 | 3 | 4;
        this.handlers.onSetCamera(cam);
      });
    });

    // Source Segment
    document.querySelectorAll('#srcSeg button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const src = (btn as HTMLElement).dataset.src as 'clay' | 'mocap';
        if (src) this.handlers.onSetSource(src);
      });
    });

    // View Options Segment
    document.querySelectorAll('#viewSeg button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const opt = (btn as HTMLElement).dataset.opt as keyof Pick<
          AppState,
          'ghosts' | 'guides' | 'step' | 'split' | 'drill'
        >;
        if (opt) this.handlers.onToggleOption(opt);
      });
    });

    // Step Buttons
    document.getElementById('nextPh')?.addEventListener('click', () => {
      this.handlers.onNextPhase();
    });

    document.getElementById('prevPh')?.addEventListener('click', () => {
      this.handlers.onPrevPhase();
    });

    // Notes textarea input with debounced persistence
    const notesEl = document.getElementById('notes') as HTMLTextAreaElement | null;
    const notesStatusEl = document.getElementById('notesStatus');
    if (notesEl) {
      notesEl.addEventListener('input', () => {
        window.clearTimeout(this.notesDebounceTimer);
        this.notesDebounceTimer = window.setTimeout(() => {
          this.handlers.onSaveNote(notesEl.value);
          if (notesStatusEl) notesStatusEl.textContent = 'Saved';
        }, 400);
      });
      notesEl.addEventListener('keydown', (e) => e.stopPropagation());
    }

    // Export Notes Button
    document.getElementById('exportNotes')?.addEventListener('click', () => {
      this.handlers.onExportNotes();
    });

    // Drill Controls
    document.querySelectorAll('#drillSet button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const set = (btn as HTMLElement).dataset.set as 'strike' | 'grapple' | 'combo' | 'all';
        if (set) {
          document
            .querySelectorAll('#drillSet button')
            .forEach((b) => b.setAttribute('aria-pressed', 'false'));
          btn.setAttribute('aria-pressed', 'true');
          this.handlers.onDrillSetChange(set);
        }
      });
    });

    document.querySelectorAll('#drillGap button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const gap = Number((btn as HTMLElement).dataset.gap);
        if (gap) {
          document
            .querySelectorAll('#drillGap button')
            .forEach((b) => b.setAttribute('aria-pressed', 'false'));
          btn.setAttribute('aria-pressed', 'true');
          this.handlers.onDrillGapChange(gap);
        }
      });
    });

    const drillTick = document.getElementById('drillTick') as HTMLInputElement | null;
    drillTick?.addEventListener('change', () => {
      this.handlers.onDrillOptionToggle('tick', drillTick.checked);
    });

    const drillVoice = document.getElementById('drillVoice') as HTMLInputElement | null;
    drillVoice?.addEventListener('change', () => {
      this.handlers.onDrillOptionToggle('voice', drillVoice.checked);
    });
  }
}
