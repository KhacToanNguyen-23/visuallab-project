export interface FreeFallState {
  y: number; // current drop distance (m)
  v: number; // velocity (m/s)
  a: number; // acceleration (m/s^2)
  t: number; // real physics time elapsed (s)
  dragForce: number; // Drag force magnitude (N)
  isDropping: boolean;
}

export interface FreeFallConfig {
  gravity: number; // g (m/s^2), default 9.81
  dropHeight: number; // H (m), default 1.0
  mass: number; // m (kg), default 0.05
  airResistance: boolean; // Has air resistance?
  dragCoefficient: number; // Cd (e.g. 0.47 for sphere, 1.2 for feather)
  area: number; // Cross-sectional area (m^2)
  timeScale: number; // 1.0 (normal), 0.25 (slow-mo), 0.1 (super slow-mo)
}

export class FreeFallEngine {
  private config: FreeFallConfig;
  private state: FreeFallState;

  constructor(config: Partial<FreeFallConfig> = {}) {
    this.config = {
      gravity: config.gravity ?? 9.81,
      dropHeight: config.dropHeight ?? 1.0,
      mass: config.mass ?? 0.05,
      airResistance: config.airResistance ?? false,
      dragCoefficient: config.dragCoefficient ?? 0.47,
      area: config.area ?? 0.002,
      timeScale: config.timeScale ?? 1.0,
    };
    this.state = this.getInitialState();
  }

  private getInitialState(): FreeFallState {
    return { y: 0, v: 0, a: this.config.gravity, t: 0, dragForce: 0, isDropping: false };
  }

  public update(rawDt: number) {
    if (!this.state.isDropping) return;

    // Apply timeScale (slow motion factor)
    const dt = Math.min(rawDt, 0.033) * this.config.timeScale;
    this.state.t += dt;

    // Calculate forces: F_gravity = m * g (downwards)
    const fGravity = this.config.mass * this.config.gravity;
    
    // F_drag = 0.5 * rho * v^2 * Cd * A (upwards)
    const rhoAir = 1.225; // kg/m^3 air density
    const fDrag = this.config.airResistance
      ? 0.5 * rhoAir * this.state.v * this.state.v * this.config.dragCoefficient * this.config.area
      : 0;

    this.state.dragForce = fDrag;

    // F_net = F_gravity - F_drag
    const fNet = fGravity - fDrag;
    this.state.a = fNet / this.config.mass;

    // Euler integration
    this.state.v += this.state.a * dt;
    this.state.y += this.state.v * dt;

    // Stop if it reaches the ground
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

  public setConfig(newConfig: Partial<FreeFallConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}
