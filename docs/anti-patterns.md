# Project Lessons Learned & Anti-Patterns — Cagecraft 3D

This document records architectural anti-patterns, incorrect assumptions, and recurring AI mistakes identified in this codebase. **All agents must read this document before implementing changes or debugging issues.**

---

### AP-001: Allocating Vectors and Objects Inside the 60fps Animation Loop
- **Mistake:** Instantiating new Three.js math objects (such as `new THREE.Vector3()`, `new THREE.Euler()`, or invoking `.clone()`) inside high-frequency functions like `updateReadouts()` or `frame()`.
- **Correction:** Statically allocate persistent scratch vectors (e.g., `roV1`, `roV2`, `tmpV`, `v1`) at the module level and perform vector mathematics in-place using methods like `.subVectors(a, b)` and `.getWorldPosition(out)`.
- **Rule:** Never allocate objects, arrays, or canvas instances inside `frame()` or any function invoked during the animation loop.

---

### AP-002: Inverting or Overwriting Joint Rotation Orders
- **Mistake:** Assuming all Three.js 3D joints follow standard Euler `XYZ` order. In Cagecraft 3D, shoulders and hips have complex 3D spherical ranges of motion where standard `XYZ` produces severe gimbal lock during kicks and hooks.
- **Correction:** Preserve the project's explicit rotation conventions:
  - Shoulders (`lSh`, `rSh`) and Hips (`lHip`, `rHip`) strictly use Euler order `'YXZ'`.
  - Planar hinge joints (`lEl`, `rEl`, `lKnee`, `rKnee`, `lWrist`, `rWrist`, `lAnkle`, `rAnkle`) use order `'XYZ'`.
- **Rule:** Always preserve the `'YXZ'` rotation order for shoulders and hips; never change joint rotation orders without comprehensive visual regression testing across all 24 techniques.

---

### AP-003: Re-Instantiating CanvasTextures on State or Technique Changes
- **Mistake:** Creating a new 2D canvas and allocating a new `THREE.CanvasTexture` every time contact marks or ghost labels are generated. This causes GPU texture memory leaks and garbage collection hitches during technique switching.
- **Correction:** Cache generated billboard textures in memory (`labelTexCache` and `sharedRingTex`) using deterministic composite keys (`${text}|${color}|${small}`). Only dispose meshes and materials, while protecting shared textures from disposal.
- **Rule:** Never allocate dynamic canvas textures without checking or storing them in the texture cache.

---

### AP-004: Breaking LocalStorage Resilience with Unbounded Writes
- **Mistake:** Writing unfiltered user input directly to `localStorage` without size limits or type verification, leading to unhandled `QuotaExceededError` or application crashes on corrupted storage values.
- **Correction:** Enforce a strict character cap (`MAX_NOTE_LENGTH = 10000`), validate parsed JSON shapes before assigning to memory, and wrap all storage read/write calls in defensive `try/catch` handlers that gracefully fall back to in-memory session persistence.
- **Rule:** All browser storage I/O must be type-validated, size-bounded, and wrapped in error handling.

---

### AP-005: Neglecting Mobile Touch Interactions on 3D Canvases
- **Mistake:** Leaving the Three.js canvas without `touch-action: none`, causing mobile browser default gesture handling (pinch-to-zoom, page scroll) to hijack touch events and break 3D orbital camera navigation.
- **Correction:** Explicitly define `touch-action: none` on the WebGL canvas element and handle touch events via pointer abstractions (`pointerdown`, `pointermove`, `pointerup` with `setPointerCapture`).
- **Rule:** The 3D render canvas must always have `touch-action: none` configured in CSS.

---

### AP-006: Hardcoding Third-Party CDN Scripts Without Offline Fallbacks
- **Mistake:** Relying on unpinned, external CDN URLs (`cdnjs`, `unpkg`) without error handling or local fallbacks, causing the application to fail completely in offline or restricted intranet environments.
- **Correction:** Bundle runtime dependencies locally or provide graceful UI warning banners when external scripts fail to load.
- **Rule:** Production builds must bundle all critical libraries locally; third-party script loading must handle network errors without unhandled exceptions.

