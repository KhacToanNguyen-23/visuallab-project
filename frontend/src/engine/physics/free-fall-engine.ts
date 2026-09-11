export interface FreeFallState {
  y: number; // current drop distance (m)
  v: number; // velocity (m/s)
  t: number; // time elapsed (s)
  isDropping: boolean;
}

export interface FreeFallConfig {
  gravity: number; // g (m/s^2), default 9.81 m/s^2
  dropHeight: number; // H (m), default 1.0 m
}

export class FreeFallEngine {
  private config: FreeFallConfig;
  private state: FreeFallState;

  constructor(config: Partial<FreeFallConfig> = {}) {
    this.config = {
      gravity: config.gravity ?? 9.81,
      dropHeight: config.dropHeight ?? 1.0,
    };
    this.state = this.getInitialState();
  }

  private getInitialState(): FreeFallState {
    return { y: 0, v: 0, t: 0, isDropping: false };
  }

  public update(dt: number) {
    if (!this.state.isDropping) return;

    this.state.t += dt;
    // s = 1/2 * g * t^2
    this.state.y = 0.5 * this.config.gravity * this.state.t * this.state.t;
    this.state.v = this.config.gravity * this.state.t;

    // Stop if it hits the ground
    if (this.state.y >= this.config.dropHeight) {
      this.state.y = this.config.dropHeight;
      this.state.isDropping = false;
    }
  }

  public start() {
    this.state.isDropping = true;
  }

  public reset() {
    this.state = this.getInitialState();
  }

  public getState(): FreeFallState {
    return { ...this.state };
  }

  public setGravity(g: number) {
    this.config.gravity = g;
  }
}
