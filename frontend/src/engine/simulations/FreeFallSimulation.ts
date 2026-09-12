export interface FreeFallData {
  heightS: number; // Distance in meters (0.2m to 0.8m)
  gravityG: number; // True gravity (9.807 m/s^2)
  timeMeasuredT: number; // Measured time t (seconds)
}

export function calculateFreeFallTime(s: number, g = 9.807): number {
  // s = 1/2 * g * t^2 => t = sqrt(2s / g)
  const idealT = Math.sqrt((2 * s) / g);
  // Add realistic experimental noise (+- 0.8%)
  const randomNoise = 1 + (Math.random() - 0.5) * 0.016;
  return parseFloat((idealT * randomNoise).toFixed(4));
}

export function calculateExperimentalG(s: number, t: number): number {
  if (t <= 0) return 0;
  // g = 2s / t^2
  return parseFloat(((2 * s) / Math.pow(t, 2)).toFixed(2));
}
