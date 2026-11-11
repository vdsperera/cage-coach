/**
 * Notes Persistence Manager for Cagecraft 3D
 * Enforces Invariant AP-004 (Defensive Bounded LocalStorage I/O)
 */

export const NOTES_STORAGE_KEY = 'cagecraft3d-notes';
export const MAX_NOTE_LENGTH = 10000;

export interface SaveNoteResult {
  persisted: boolean;
  content: string;
}

export class NotesManager {
  private inMemoryNotes: Record<string, string> = {};

  constructor() {
    this.reloadFromStorage();
  }

  /**
   * Defensive load from localStorage. Gracefully falls back to empty memory on failure.
   */
  public reloadFromStorage(): boolean {
    try {
      if (typeof localStorage === 'undefined') return false;
      const raw = localStorage.getItem(NOTES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          this.inMemoryNotes = parsed as Record<string, string>;
          return true;
        }
      }
    } catch (err) {
      console.warn('Could not read notes from localStorage', err);
    }
    return false;
  }

  /**
   * Persists the current in-memory notes object into browser localStorage.
   */
  private commitToStorage(): boolean {
    try {
      if (typeof localStorage === 'undefined') return false;
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(this.inMemoryNotes));
      return true;
    } catch (err) {
      console.warn('Could not save notes to localStorage', err);
      return false;
    }
  }

  public getNote(techniqueKey: string): string {
    return this.inMemoryNotes[techniqueKey] || '';
  }

  public getAllNotes(): Record<string, string> {
    return { ...this.inMemoryNotes };
  }

  /**
   * Sets or deletes a note for a given technique key.
   * Enforces the MAX_NOTE_LENGTH character limit (AP-004).
   */
  public saveNote(techniqueKey: string, noteContent: string): SaveNoteResult {
    const trimmed = noteContent.trim();
    if (!trimmed) {
      delete this.inMemoryNotes[techniqueKey];
      const persisted = this.commitToStorage();
      return { persisted, content: '' };
    }

    const bounded = trimmed.slice(0, MAX_NOTE_LENGTH);
    this.inMemoryNotes[techniqueKey] = bounded;
    const persisted = this.commitToStorage();
    return { persisted, content: bounded };
  }

  public deleteNote(techniqueKey: string): boolean {
    delete this.inMemoryNotes[techniqueKey];
    return this.commitToStorage();
  }

  /**
   * Formats notes with technique display names and returns a JSON Blob.
   */
  public createExportBlob(techniqueNameMap: Record<string, string>): Blob {
    const formatted: Record<string, string> = {};
    for (const [key, content] of Object.entries(this.inMemoryNotes)) {
      const name = techniqueNameMap[key] || '';
      const label = name ? `${key} ${name}` : key;
      formatted[label] = content;
    }

    return new Blob([JSON.stringify(formatted, null, 2)], {
      type: 'application/json',
    });
  }

  /**
   * Initiates browser download of the notes backup file.
   */
  public downloadExport(
    techniqueNameMap: Record<string, string>,
    filename = 'cagecraft-notes.json'
  ): void {
    if (typeof document === 'undefined') return;
    const blob = this.createExportBlob(techniqueNameMap);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
