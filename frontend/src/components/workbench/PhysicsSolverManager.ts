export class PhysicsSolverManager {
  /**
   * Calculate Hooke's Law spring stretch Delta L (cm)
   */
  public static solveSpringStretch(massKg: number, stiffnessN: number, gravity: number = 9.81): number {
    if (stiffnessN <= 0) return 0;
    return ((massKg * gravity) / stiffnessN) * 100; // cm
  }

  /**
   * Calculate DC circuit current I (A) and Bulb state
   */
  public static solveDCCircuit(voltageV: number, totalResistanceR: number): { currentA: number; bulbLit: boolean } {
    if (totalResistanceR <= 0) return { currentA: 0, bulbLit: false };
    const currentA = voltageV / totalResistanceR;
    return {
      currentA: parseFloat(currentA.toFixed(2)),
      bulbLit: currentA > 0.1,
    };
  }

  /**
   * Calculate Snell's Law refraction angle r (degrees)
   */
  public static solveSnellRefraction(incidenceDeg: number, n1: number = 1.0, n2: number = 1.5): { refractionDeg: number; isTotalReflection: boolean } {
    const iRad = (incidenceDeg * Math.PI) / 180;
    const sinR = (n1 * Math.sin(iRad)) / n2;

    if (sinR > 1.0) {
      return { refractionDeg: 90, isTotalReflection: true };
    }

    const rRad = Math.asin(sinR);
    return {
      refractionDeg: parseFloat(((rRad * 180) / Math.PI).toFixed(1)),
      isTotalReflection: false,
    };
  }
}
