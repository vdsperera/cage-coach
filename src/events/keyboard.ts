/**
 * Central Keyboard Command and Event Router for Cagecraft 3D
 * Handles global hotkey bindings with form input isolation and browser default prevention.
 */

export interface AppActionHandlers {
  selectTechniqueByKey: (key: string) => void;
  toggleMode: () => void;
  togglePlay: () => void;
  nextPhase: () => void;
  prevPhase: () => void;
  toggleStance: () => void;
  toggleMocap: () => void;
  toggleOption: (key: 'ghosts' | 'guides' | 'step' | 'split' | 'drill' | 'mistakes') => void;
  toggleTune: () => void;
  cycleSpeed: () => void;
  cycleCamera: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  rotateCamera: (dTheta: number, dPhi: number) => void;
}

export interface HotkeyItem {
  key: string;
  label: string;
  description: string;
}

export const HOTKEY_CATALOG: HotkeyItem[] = [
  { key: 'Space', label: 'Space', description: 'Play / Pause playback' },
  { key: 'Enter', label: 'Enter', description: 'Advance to next phase milestone' },
  { key: 'Backspace', label: 'Backspace', description: 'Step back to previous phase' },
  { key: '[ / ]', label: '[ / ]', description: 'Micro-step animation frames' },
  { key: 'Tab', label: 'Tab', description: 'Toggle Solo / Sparring partner mode' },
  { key: 'A', label: 'A', description: 'Toggle Orthodox / Southpaw stance' },
  { key: 'S', label: 'S', description: 'Cycle speed: 1.0x → 0.5x → 0.25x' },
  { key: 'C', label: 'C', description: 'Cycle Camera angles (0-4)' },
  { key: 'V', label: 'V', description: 'Toggle 4-way Quad-Split Viewports' },
  { key: 'T', label: 'T', description: 'Toggle 3D Pose Calibrator & Visual Angle Tuner' },
  { key: 'D', label: 'D', description: 'Toggle Automated Audio-Visual Drill Coach' },
  { key: 'G', label: 'G', description: 'Toggle Ghost breakdown silhouettes' },
  { key: 'F', label: 'F', description: 'Toggle Focus highlights and guides' },
  { key: 'L', label: 'L', description: 'Toggle Auto-step phase pause' },
  { key: 'M', label: 'M', description: 'Toggle Common Mistakes & Form Correction Ghost' },
  { key: 'Arrows', label: '← → ↑ ↓', description: 'Orbit camera rotation' },
];

/**
 * Attaches the global keyboard listener to the specified window or target.
 * Returns an unbind cleanup function.
 */
export function attachKeyboardRouter(
  handlers: AppActionHandlers,
  target: Window = window
): () => void {
  const handleKeyDown = (e: KeyboardEvent): void => {
    // Isolate form elements and editable nodes
    const targetElement = e.target as HTMLElement | null;
    if (
      targetElement &&
      (targetElement.tagName === 'INPUT' ||
        targetElement.tagName === 'TEXTAREA' ||
        targetElement.isContentEditable)
    ) {
      return;
    }

    const keyUpper = e.key.length === 1 ? e.key.toUpperCase() : e.key;

    // Check if the key matches a technique hotkey (0-9, A-Z)
    // Avoid hijacking dedicated functional hotkeys
    const functionalKeys = new Set([
      'Tab',
      ' ',
      'Enter',
      'Backspace',
      'a',
      'A',
      'm',
      'M',
      'g',
      'G',
      'f',
      'F',
      'l',
      'L',
      'v',
      'V',
      'd',
      'D',
      't',
      'T',
      's',
      'S',
      'c',
      'C',
      '[',
      ']',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
    ]);

    if (!functionalKeys.has(e.key) && e.key.length === 1) {
      handlers.selectTechniqueByKey(keyUpper);
      return;
    }

    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        handlers.toggleMode();
        break;

      case ' ':
        e.preventDefault();
        handlers.togglePlay();
        break;

      case 'Enter':
        e.preventDefault();
        handlers.nextPhase();
        break;

      case 'Backspace':
        e.preventDefault();
        handlers.prevPhase();
        break;

      case 'a':
      case 'A':
        handlers.toggleStance();
        break;

      case 'm':
      case 'M':
        handlers.toggleOption('mistakes');
        break;

      case 'g':
      case 'G':
        handlers.toggleOption('ghosts');
        break;

      case 'f':
      case 'F':
        handlers.toggleOption('guides');
        break;

      case 'l':
      case 'L':
        handlers.toggleOption('step');
        break;

      case 'v':
      case 'V':
        handlers.toggleOption('split');
        break;

      case 'd':
      case 'D':
        handlers.toggleOption('drill');
        break;

      case 't':
      case 'T':
        handlers.toggleTune();
        break;

      case 's':
      case 'S':
        handlers.cycleSpeed();
        break;

      case 'c':
      case 'C':
        handlers.cycleCamera();
        break;

      case ']':
        handlers.stepForward();
        break;

      case '[':
        handlers.stepBackward();
        break;

      case 'ArrowLeft':
        handlers.rotateCamera(-0.12, 0);
        break;

      case 'ArrowRight':
        handlers.rotateCamera(0.12, 0);
        break;

      case 'ArrowUp':
        handlers.rotateCamera(0, -0.08);
        break;

      case 'ArrowDown':
        handlers.rotateCamera(0, 0.08);
        break;
    }
  };

  target.addEventListener('keydown', handleKeyDown);

  return () => {
    target.removeEventListener('keydown', handleKeyDown);
  };
}
