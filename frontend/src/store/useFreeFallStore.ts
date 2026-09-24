import { create } from 'zustand';

export interface Measurement {
  id: string;
  gate1Height: number;
  gate2Height: number;
  distance: number; // s = gate2Height - gate1Height
  t1: number;
  t2: number;
  deltaTime: number; // t = t2 - t1
  gCalculated: number; // g = 2s / t^2
}

interface FreeFallStore {
  measurements: Measurement[];
  addMeasurement: (gate1Height: number, gate2Height: number, t1: number, t2: number) => void;
  clearMeasurements: () => void;
}

export const useFreeFallStore = create<FreeFallStore>((set) => ({
  measurements: [],
  addMeasurement: (gate1Height, gate2Height, t1, t2) => set((state) => {
    const s = gate2Height - gate1Height;
    const t = t2 - t1;
    
    // Khi Cổng 1 bị dời đi (v1 != 0), công thức g = 2s / t^2 bị sai.
    // Phương trình gốc: y1 = 0.5*g*t1^2, y2 = 0.5*g*t2^2
    // Suy ra: s = y2 - y1 = 0.5*g*(t2^2 - t1^2) => g = 2s / (t2^2 - t1^2)
    const gCalculated = (t2 > t1) ? (2 * s) / (t2 * t2 - t1 * t1) : 0;
    
    const newMeasurement: Measurement = {
      id: Date.now().toString(),
      gate1Height,
      gate2Height,
      distance: s,
      t1,
      t2,
      deltaTime: t,
      gCalculated: Number(gCalculated.toFixed(3))
    };
    
    return { measurements: [...state.measurements, newMeasurement] };
  }),
  clearMeasurements: () => set({ measurements: [] })
}));
