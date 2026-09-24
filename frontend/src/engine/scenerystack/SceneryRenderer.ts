import { Display, Node } from 'scenerystack/scenery';

export class SceneryRenderer {
  private display: any;
  private rootNode: any;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private onUpdateCallbacks: Array<(dt: number) => void> = [];

  constructor(container: HTMLElement) {
    this.rootNode = new Node();
    this.display = new Display(this.rootNode, {
      container: container,
      backgroundColor: '#f8fafc',
      allowSceneOverflow: false,
      passiveEvents: true, // KHẮC PHỤC TRIỆT ĐỂ: Dùng passive events để không bao giờ block các sự kiện UI React bên ngoài
    });

    this.display.initializeEvents();
  }

  public getRootNode(): any {
    return this.rootNode;
  }

  public getDisplay(): any {
    return this.display;
  }

  public addUpdateListener(callback: (dt: number) => void) {
    this.onUpdateCallbacks.push(callback);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    let lastTime = performance.now();

    const loop = (time: number) => {
      if (!this.isRunning) return;
      
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Execute physics / logic updates
      for (const callback of this.onUpdateCallbacks) {
        callback(dt);
      }

      // Update Scenery display
      this.display.updateDisplay();

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  public stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public dispose() {
    this.stop();
    this.display.dispose();
  }
}
