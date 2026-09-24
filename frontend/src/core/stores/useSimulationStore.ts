import { create } from 'zustand';

interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  timeScale: number;          // 0.25x, 0.5x, 1x, 2x
  elapsedTime: number;        // Tổng thời gian vật lý đã trôi qua (giây)
  liveReadings: Record<string, number>; // Đo đạc thời gian thực từ các sensor

  setRunning: (running: boolean) => void;
  setPaused: (paused: boolean) => void;
  setTimeScale: (scale: number) => void;
  stepSimulation: (dt: number) => void;
  updateLiveReading: (key: string, value: number) => void;
  resetSimulation: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  isRunning: false,
  isPaused: false,
  timeScale: 1.0,
  elapsedTime: 0,
  liveReadings: {},

  setRunning: (running) => set({ isRunning: running, isPaused: false }),
  setPaused: (paused) => set({ isPaused: paused }),
  setTimeScale: (scale) => set({ timeScale: scale }),
  
  stepSimulation: (dt) =>
    set((state) => ({
      elapsedTime: state.elapsedTime + dt * state.timeScale,
    })),

  updateLiveReading: (key, value) =>
    set((state) => ({
      liveReadings: {
        ...state.liveReadings,
        [key]: value,
      },
    })),

  resetSimulation: () =>
    set({
      isRunning: false,
      isPaused: false,
      elapsedTime: 0,
      liveReadings: {},
    }),
}));
