import { create } from 'zustand';

export interface MeasurementTrial {
  trialIndex: number;
  params: Record<string, number>;
  measuredValues: Record<string, number>;
  calculatedValues: Record<string, number>;
  timestamp: number;
}

interface GradingState {
  trials: MeasurementTrial[];
  isCorrectAssembly: boolean;
  operationScore: number;     // max 30
  accuracyScore: number;      // max 40
  quizScore: number;          // max 30
  totalScore: number;         // max 100

  // Actions
  recordTrial: (trial: Omit<MeasurementTrial, 'trialIndex' | 'timestamp'>) => void;
  removeTrial: (index: number) => void;
  setAssemblyCorrect: (correct: boolean) => void;
  setQuizScore: (score: number) => void;
  calculateFinalGrade: (theoreticalValue: number, measuredKey: string) => void;
  resetGrading: () => void;
}

export const useGradingStore = create<GradingState>((set, get) => ({
  trials: [],
  isCorrectAssembly: false,
  operationScore: 0,
  accuracyScore: 0,
  quizScore: 0,
  totalScore: 0,

  recordTrial: (trialData) => {
    set((state) => {
      const nextIndex = state.trials.length + 1;
      const newTrial: MeasurementTrial = {
        ...trialData,
        trialIndex: nextIndex,
        timestamp: Date.now(),
      };
      return { trials: [...state.trials, newTrial] };
    });
  },

  removeTrial: (index) => {
    set((state) => ({
      trials: state.trials.filter((t) => t.trialIndex !== index),
    }));
  },

  setAssemblyCorrect: (correct) => {
    set({ isCorrectAssembly: correct });
  },

  setQuizScore: (score) => {
    set({ quizScore: Math.min(30, Math.max(0, score)) });
  },

  calculateFinalGrade: (theoreticalValue, measuredKey) => {
    const { trials, isCorrectAssembly, quizScore } = get();

    // 1. Điểm Thao Tác (30%): Yêu cầu lắp đúng và đo >= 3 lần
    let opScore = 0;
    if (isCorrectAssembly) opScore += 15;
    if (trials.length >= 3) opScore += 15;
    else if (trials.length > 0) opScore += (trials.length / 3) * 15;

    // 2. Điểm Sai Số & Độ Chính Xác (40%)
    let accScore = 0;
    if (trials.length > 0 && theoreticalValue > 0) {
      const sum = trials.reduce((acc, t) => acc + (t.calculatedValues[measuredKey] ?? t.measuredValues[measuredKey] ?? 0), 0);
      const avgMeasured = sum / trials.length;
      const errorPercent = (Math.abs(avgMeasured - theoreticalValue) / theoreticalValue) * 100;

      if (errorPercent <= 5.0) {
        accScore = 40; // Sai số <= 5%: Điểm tuyệt đối
      } else if (errorPercent <= 20.0) {
        // Tuyến tính từ 40 điểm xuống 10 điểm trong khoảng [5%, 20%]
        accScore = 40 - ((errorPercent - 5.0) / 15.0) * 30;
      } else {
        accScore = Math.max(0, 10 - (errorPercent - 20));
      }
    }

    const total = Math.round(opScore + accScore + quizScore);
    set({
      operationScore: Math.round(opScore),
      accuracyScore: Math.round(accScore),
      totalScore: Math.min(100, total),
    });
  },

  resetGrading: () => {
    set({
      trials: [],
      isCorrectAssembly: false,
      operationScore: 0,
      accuracyScore: 0,
      quizScore: 0,
      totalScore: 0,
    });
  },
}));
