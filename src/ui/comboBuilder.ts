/**
 * Interactive Custom Combination Builder UI for Cage Coach
 * Enables athletes to chain arbitrary strikes/takedowns into custom combinations.
 */

import type { Technique, ComboDefinition } from '../types/kinematics';

export interface ComboBuilderHandlers {
  onSaveCombo: (combo: ComboDefinition) => void;
  onDeleteCombo?: (key: string) => void;
  onClose: () => void;
}

export class ComboBuilderModal {
  private container: HTMLElement | null = null;
  private steps: string[] = ['1', '2', '3']; // Default starter: Jab, Cross, Hook
  private isVisible = false;

  constructor(
    private readonly availableTechniques: Technique[],
    private readonly handlers: ComboBuilderHandlers
  ) {
    this.createDom();
  }

  public get visible(): boolean {
    return this.isVisible;
  }

  public open(): void {
    if (!this.container) return;
    this.isVisible = true;
    this.container.classList.add('on');
    this.renderStepList();
  }

  public close(): void {
    if (!this.container) return;
    this.isVisible = false;
    this.container.classList.remove('on');
    this.handlers.onClose();
  }

  private createDom(): void {
    let el = document.getElementById('comboBuilderModal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'comboBuilderModal';
      el.className = 'combo-modal';
      document.body.appendChild(el);
    }
    this.container = el;

    this.container.innerHTML = `
      <div class="combo-modal-content panel">
        <div class="combo-modal-header">
          <h3>⚡ Custom Combination Builder</h3>
          <button class="combo-modal-close" id="comboCloseBtn">&times;</button>
        </div>
        <div class="combo-modal-body">
          <label class="combo-label">Combination Name:
            <input type="text" id="comboNameInput" placeholder="e.g. Dutch 4-Count" value="Custom Combo" maxlength="32">
          </label>
          
          <div class="combo-steps-section">
            <span class="combo-label">Strike Sequence (In Order):</span>
            <div id="comboStepsList" class="combo-steps-list"></div>
            
            <div class="combo-add-row">
              <select id="comboStepSelect" class="combo-select"></select>
              <button id="comboAddStepBtn" class="btn">+ Add Strike</button>
            </div>
          </div>
        </div>
        
        <div class="combo-modal-footer">
          <button id="comboCancelBtn" class="btn">Cancel</button>
          <button id="comboSaveBtn" class="btn primary">Compile &amp; Save Combo</button>
        </div>
      </div>
    `;

    // Populate technique dropdown
    const select = this.container.querySelector('#comboStepSelect') as HTMLSelectElement | null;
    if (select) {
      const baseOnly = this.availableTechniques.filter((t) => t.group !== 'combo');
      select.innerHTML = baseOnly
        .map((t) => `<option value="${t.key}">${t.key}: ${t.name} (${t.side})</option>`)
        .join('');
    }

    // Event listeners
    this.container.querySelector('#comboCloseBtn')?.addEventListener('click', () => this.close());
    this.container.querySelector('#comboCancelBtn')?.addEventListener('click', () => this.close());

    this.container.querySelector('#comboAddStepBtn')?.addEventListener('click', () => {
      const sel = this.container?.querySelector('#comboStepSelect') as HTMLSelectElement | null;
      if (sel && sel.value) {
        if (this.steps.length < 8) {
          this.steps.push(sel.value);
          this.renderStepList();
        }
      }
    });

    this.container.querySelector('#comboSaveBtn')?.addEventListener('click', () => {
      this.handleSave();
    });
  }

  private renderStepList(): void {
    const list = this.container?.querySelector('#comboStepsList');
    if (!list) return;

    if (this.steps.length === 0) {
      list.innerHTML = `<p class="combo-empty">No strikes added yet. Select a strike below to add.</p>`;
      return;
    }

    list.innerHTML = this.steps
      .map((key, index) => {
        const tk = this.availableTechniques.find((t) => t.key === key);
        const name = tk ? `${tk.name}` : `Step ${key}`;
        return `
          <div class="combo-step-item" data-index="${index}">
            <span class="step-num">${index + 1}</span>
            <span class="step-name"><kbd>${key}</kbd> ${name}</span>
            <button class="step-remove-btn" data-remove="${index}">&times;</button>
          </div>
        `;
      })
      .join('');

    list.querySelectorAll('.step-remove-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = Number((e.currentTarget as HTMLElement).dataset.remove);
        if (!isNaN(idx)) {
          this.steps.splice(idx, 1);
          this.renderStepList();
        }
      });
    });
  }

  private handleSave(): void {
    const nameInput = this.container?.querySelector('#comboNameInput') as HTMLInputElement | null;
    const name = nameInput?.value.trim() || 'Custom Combo';

    if (this.steps.length < 2) {
      alert('A combination must contain at least 2 techniques.');
      return;
    }

    // Generate unique custom key
    const customKey = `C${Date.now().toString().slice(-3)}`;
    const stepNames = this.steps.map((k) => {
      const t = this.availableTechniques.find((tk) => tk.key === k);
      return t ? t.name : k;
    });

    const comboDef: ComboDefinition = {
      key: customKey,
      name,
      side: 'Custom',
      steps: [...this.steps],
      cues: stepNames.map((s, i) => `${i + 1}. ${s}`),
    };

    this.handlers.onSaveCombo(comboDef);
    this.close();
  }
}
