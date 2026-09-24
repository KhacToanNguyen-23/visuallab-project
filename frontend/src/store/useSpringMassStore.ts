import { create } from 'zustand';

export interface SpringMeasurement {
  id: string;
  m: number;        // Khối lượng quả cân (kg)
  p: number;        // Trọng lực P = m * g (N)
  l: number;        // Chiều dài lò xo l (m)
  deltaL: number;   // Độ giãn delta_l = l - l0 (m)
  kCalculated: number; // k = P / delta_l (N/m)
}

interface SpringMassStore {
  weightsCount: number; // Số quả cân đang treo (0 -> 6)
  customWeightMassKg: number; // Khối lượng mỗi quả cân (mặc định 0.05kg = 50g)
  stiffnessK: number;   // Độ cứng k của lò xo (N/m)
  naturalLengthL0: number; // Chiều dài tự nhiên l0 (m)
  measurements: SpringMeasurement[];

  setWeightsCount: (count: number) => void;
  setCustomWeightMassKg: (mass: number) => void;
  setStiffnessK: (k: number) => void;
  recordCurrentState: (currentL: number) => void;
  clearMeasurements: () => void;
}

export const useSpringMassStore = create<SpringMassStore>((set, get) => ({
  weightsCount: 0,
  customWeightMassKg: 0.05, // 50g
  stiffnessK: 40.0,
  naturalLengthL0: 0.2, // 20cm
  measurements: [],

  setWeightsCount: (count) => set({ weightsCount: Math.max(0, Math.min(6, count)) }),
  setCustomWeightMassKg: (customWeightMassKg) => set({ customWeightMassKg: Math.max(0.01, Math.min(0.5, customWeightMassKg)) }),
  setStiffnessK: (stiffnessK) => set({ stiffnessK }),

  recordCurrentState: (currentL: number) => {
    const { weightsCount, customWeightMassKg, naturalLengthL0 } = get();
    const m = weightsCount * customWeightMassKg;
    const p = m * 9.807;
    const deltaL = Math.max(0.0001, currentL - naturalLengthL0);
    const kCalculated = m > 0 ? p / deltaL : 0;

    const newRecord: SpringMeasurement = {
      id: Date.now().toString(),
      m,
      p,
      l: currentL,
      deltaL,
      kCalculated,
    };

    set((state) => ({
      measurements: [...state.measurements, newRecord],
    }));
  },

  clearMeasurements: () => set({ measurements: [] }),
}));
