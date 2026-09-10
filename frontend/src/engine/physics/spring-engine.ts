export interface SpringState {
  displacement: number; // x (m), from equilibrium (positive downwards)
  velocity: number; // v (m/s)
  acceleration: number; // a (m/s^2)
}

export interface SpringConfig {
  stiffness: number; // k (N/m), default 50 N/m
  mass: number; // m (kg), default 0.2 kg
  gravity: number; // g (m/s^2), default 9.81 m/s^2
  damping: number; // c (air resistance), default 0.05
  naturalLength: number; // L0 (m), default 0.5 m
}

export class SpringEngine {
  private config: SpringConfig;
  private state: SpringState;

  constructor(config: Partial<SpringConfig> = {}) {
    this.config = {
      stiffness: config.stiffness ?? 50,
      mass: config.mass ?? 0.2,
      gravity: config.gravity ?? 9.81,
      damping: config.damping ?? 0.05,
      naturalLength: config.naturalLength ?? 0.5,
    };

    this.state = {
      displacement: 0,
      velocity: 0,
      acceleration: 0,
    };
  }

  public getConfig(): SpringConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<SpringConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getState(): SpringState {
    return { ...this.state };
  }

  public setDisplacement(x: number): void {
    this.state.displacement = x;
    this.state.velocity = 0;
    this.state.acceleration = 0;
  }

  public reset(): void {
    this.state = {
      displacement: 0,
      velocity: 0,
      acceleration: 0,
    };
  }

  // Calculate theoretical period T = 2 * PI * sqrt(m / k)
  public getTheoreticalPeriod(): number {
    if (this.config.stiffness <= 0 || this.config.mass <= 0) return 0;
    return 2 * Math.PI * Math.sqrt(this.config.mass / this.config.stiffness);
  }

  // Calculate equilibrium stretch Delta L_eq = (m * g) / k
  public getEquilibriumStretch(): number {
    if (this.config.stiffness <= 0) return 0;
    return (this.config.mass * this.config.gravity) / this.config.stiffness;
  }

  // Euler-Cromer / RK2 integration step
  public step(dt: number): SpringState {
    const { stiffness, mass, damping } = this.config;
    if (mass <= 0) return this.state;

    // F_spring = -k * x
    // F_damping = -c * v
    // F_total = -k * x - c * v
    // a = (-k * x - c * v) / m
    const springForce = -stiffness * this.state.displacement;
    const dampingForce = -damping * this.state.velocity;
    const totalForce = springForce + dampingForce;

    const acceleration = totalForce / mass;
    const nextVelocity = this.state.velocity + acceleration * dt;
    const nextDisplacement = this.state.displacement + nextVelocity * dt;

    this.state = {
      displacement: nextDisplacement,
      velocity: nextVelocity,
      acceleration,
    };

    return { ...this.state };
  }
}
