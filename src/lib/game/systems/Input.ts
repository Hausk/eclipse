// lib/game/systems/Input.ts
export class InputManager {
  private keys: Record<string, boolean> = {};
  private handleKeyDown: (e: KeyboardEvent) => void;
  private handleKeyUp: (e: KeyboardEvent) => void;

  constructor() {
    this.handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      this.keys[key] = true;
    };

    this.handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      this.keys[key] = false;
    };

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  public isKeyPressed(key: string): boolean {
    return this.keys[key.toLowerCase()] || false;
  }

  public dispose(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.keys = {};
  }
}