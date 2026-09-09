export interface FreeFallData {
  heightS: number; // Distance in meters (0.2m to 0.8m)
  gravityG: number; // True gravity (9.80 m/s^2)
  timeMeasuredT: number; // Measured time t (seconds)
}

export function calculateFreeFallTime(s: number, g = 9.80): number {
  // s = 1/2 * g * t^2 => t = sqrt(2s / g)
  const idealT = Math.sqrt((2 * s) / g);
  // Add random error within +-1.5% as specified in SRS SIM-03
  const randomNoise = 1 + (Math.random() - 0.5) * 0.03;
  return parseFloat((idealT * randomNoise).toFixed(4));
}
