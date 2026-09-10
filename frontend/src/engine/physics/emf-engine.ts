export interface EMFConfig {
  emf: number; // E (V), default 6.0 V
  internalR: number; // r (Ohm), default 1.5 Ohm
  rheostatR: number; // R (Ohm), default 20 Ohm
  switchOpen: boolean; // true = OFF, false = ON
}

export interface EMFState {
  currentI: number; // I (A)
  voltageU: number; // U (V)
  powerP: number; // P (W)
}

export class EMFEngine {
  private config: EMFConfig;

  constructor(config: Partial<EMFConfig> = {}) {
    this.config = {
      emf: config.emf ?? 6.0,
      internalR: config.internalR ?? 1.5,
      rheostatR: config.rheostatR ?? 20,
      switchOpen: config.switchOpen ?? false,
    };
  }

  public getConfig(): EMFConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<EMFConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public solve(): EMFState {
    const { emf, internalR, rheostatR, switchOpen } = this.config;

    if (switchOpen) {
      // Circuit is open: I = 0, U = E (no voltage drop across internal resistance)
      return {
        currentI: 0,
        voltageU: emf,
        powerP: 0,
      };
    }

    const totalR = Math.max(0.001, rheostatR + internalR);
    const currentI = emf / totalR;
    const voltageU = emf - currentI * internalR;
    const powerP = voltageU * currentI;

    return {
      currentI,
      voltageU,
      powerP,
    };
  }
}
