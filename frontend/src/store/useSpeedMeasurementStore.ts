import { create } from 'zustand';

export interface SpeedMeasurement {
  id: string;
  gate1Pos: number; // s1 (m)
  gate2Pos: number; // s2 (m)
  s: number;        // delta s = s2 - s1 (m)
  t1: number;       // thời gian chạm cổng 1 (s)
  t2: number;       // thời gian chạm cổng 2 (s)
  t: number;        // delta t = t2 - t1 (s)
  vAvg: number;     // v_tb = s / delta t (m/s)
  aCalculated: number; // a = 2*s / t^2 (hoặc 2(s - v1*t)/t^2)
}

interface SpeedMeasurementStore {
  measurements: SpeedMeasurement[];
  angleDeg: number;
  frictionCoeff: number;
  setAngleDeg: (angle: number) => void;
  setFrictionCoeff: (mu: number) => void;
  addMeasurement: (gate1Pos: number, gate2Pos: number, t1: number, t2: number) => void;
  clearMeasurements: () => void;
}

export const useSpeedMeasurementStore = create<SpeedMeasurementStore>((set) => ({
  measurements: [],
  angleDeg: 15,
  frictionCoeff: 0.02,

  setAngleDeg: (angleDeg) => set({ angleDeg }),
  setFrictionCoeff: (frictionCoeff) => set({ frictionCoeff }),

  addMeasurement: (gate1Pos, gate2Pos, t1, t2) => set((state) => {
    const s = gate2Pos - gate1Pos;
    const t = t2 - t1;
    const vAvg = t > 0 ? s / t : 0;
    
    // Gia tốc đo được từ 2 mốc thời gian t1, t2:
    // s1 = 0.5 * a * t1^2, s2 = 0.5 * a * t2^2 => s = 0.5 * a * (t2^2 - t1^2)
    const aCalculated = (t2 > t1) ? (2 * s) / (t2 * t2 - t1 * t1) : 0;

    const newMeasurement: SpeedMeasurement = {
      id: Date.now().toString(),
      gate1Pos,
      gate2Pos,
      s,
      t1,
      t2,
      t,
      vAvg,
      aCalculated,
    };

    return {
      measurements: [...state.measurements, newMeasurement]
    };
  }),

  clearMeasurements: () => set({ measurements: [] }),
}));
