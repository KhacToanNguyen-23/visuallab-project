/**
 * Pure Physics Model for Simple Pendulum Simulation (SI Units)
 * Units: length (m), mass (kg), time (s), angle (rad), force (N), energy (J)
 */

export interface PendulumParams {
  length: number; // l (m)
  mass: number; // m (kg)
  gravity: number; // g (m/s^2)
  damping: number; // b (air resistance damping coefficient)
  initialAngle: number; // rad
}

export interface PendulumState {
  theta: number; // angle from vertical (rad)
  omega: number; // angular velocity (rad/s)
  alpha: number; // angular acceleration (rad/s^2)
  time: number; // elapsed time (s)
  
  // Cartesian position relative to pivot (m)
  x: number;
  y: number;

  // Linear Kinematics
  vTan: number; // tangential velocity (m/s)
  aTan: number; // tangential acceleration (m/s^2)
  aRad: number; // radial (centripetal) acceleration (m/s^2)

  // Energy Components (J)
  potentialEnergy: number; // Ep = m * g * h
  kineticEnergy: number; // Ek = 0.5 * m * v^2
  totalEnergy: number; // E = Ep + Ek

  // Force Vectors (N)
  weightForce: number; // Fg = m * g
  tensionForce: number; // T = m * g * cos(theta) + m * v^2 / l
  netForce: number; // Fnet
}

export class PendulumEngine {
  public params: PendulumParams;
  public state: PendulumState;

  constructor(params: Partial<PendulumParams> = {}) {
    this.params = {
      length: params.length ?? 1.0,
      mass: params.mass ?? 0.5,
      gravity: params.gravity ?? 9.81,
      damping: params.damping ?? 0.0,
      initialAngle: params.initialAngle ?? (15 * Math.PI) / 180,
    };

    this.state = this.createInitialState(this.params.initialAngle);
  }

  public reset(newAngleRad?: number): void {
    const angleToUse = newAngleRad ?? this.params.initialAngle;
    this.state = this.createInitialState(angleToUse);
  }

  public setParams(newParams: Partial<PendulumParams>): void {
    this.params = { ...this.params, ...newParams };
    // Recalculate derived kinematic & energy state
    this.updateStateDerivedValues();
  }

  /**
   * Semi-Implicit Euler Numerical Integration Step (Fixed dt for FPS independence)
   */
  public step(dt: number): void {
    const { length, mass, gravity, damping } = this.params;

    // Nonlinear pendulum equation: alpha = -(g/L)*sin(theta) - (b / (m*L))*omega
    const alpha = -(gravity / length) * Math.sin(this.state.theta) - (damping / (mass * length)) * this.state.omega;

    // Update angular velocity & angle
    const newOmega = this.state.omega + alpha * dt;
    const newTheta = this.state.theta + newOmega * dt;

    this.state.omega = newOmega;
    this.state.theta = newTheta;
    this.state.alpha = alpha;
    this.state.time += dt;

    this.updateStateDerivedValues();
  }

  private createInitialState(initialAngleRad: number): PendulumState {
    const { length, mass, gravity } = this.params;

    const x = length * Math.sin(initialAngleRad);
    const y = length * Math.cos(initialAngleRad);
    const h = length * (1 - Math.cos(initialAngleRad));

    const potentialEnergy = mass * gravity * h;
    const kineticEnergy = 0;
    const totalEnergy = potentialEnergy + kineticEnergy;

    const weightForce = mass * gravity;
    const tensionForce = mass * gravity * Math.cos(initialAngleRad);
    const netForce = mass * gravity * Math.sin(initialAngleRad);

    return {
      theta: initialAngleRad,
      omega: 0,
      alpha: -(gravity / length) * Math.sin(initialAngleRad),
      time: 0,
      x,
      y,
      vTan: 0,
      aTan: -(gravity) * Math.sin(initialAngleRad),
      aRad: 0,
      potentialEnergy,
      kineticEnergy,
      totalEnergy,
      weightForce,
      tensionForce,
      netForce,
    };
  }

  private updateStateDerivedValues(): void {
    const { length, mass, gravity } = this.params;
    const { theta, omega } = this.state;

    // Cartesian coords (downwards is +y)
    this.state.x = length * Math.sin(theta);
    this.state.y = length * Math.cos(theta);

    // Tangential & Radial Velocity / Accel
    this.state.vTan = length * omega;
    this.state.aTan = -gravity * Math.sin(theta);
    this.state.aRad = length * omega * omega;

    // Height above lowest point
    const h = length * (1 - Math.cos(theta));

    // Energy calculations (J)
    this.state.potentialEnergy = Math.max(0, mass * gravity * h);
    this.state.kineticEnergy = 0.5 * mass * Math.pow(this.state.vTan, 2);
    this.state.totalEnergy = this.state.potentialEnergy + this.state.kineticEnergy;

    // Force magnitudes (N)
    this.state.weightForce = mass * gravity;
    this.state.tensionForce = mass * gravity * Math.cos(theta) + mass * Math.pow(this.state.vTan, 2) / length;
    this.state.netForce = mass * Math.sqrt(Math.pow(this.state.aTan, 2) + Math.pow(this.state.aRad, 2));
  }
}
