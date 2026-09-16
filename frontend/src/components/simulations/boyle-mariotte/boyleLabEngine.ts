/**
 * Physics Engine & Error Processing for Boyle - Mariotte Law (Isothermal Gas Law)
 * SGK GDPT 2018 Vật Lý 12 - Khí Lý Tưởng
 * Formula: p * V = const (or p = C / V)
 */

export interface BoyleMission {
  id: number;
  title: string;
  targetV: number; // Target volume in cm³
  toleranceV: number; // e.g. 1 cm³
  description: string;
  isCompleted: boolean;
}

export const DEFAULT_BOYLE_MISSIONS: BoyleMission[] = [
  {
    id: 1,
    title: 'Nhiệm Vụ 1: Nén Nhẹ Pít-tông',
    targetV: 35,
    toleranceV: 1,
    description: 'Điều chỉnh pít-tông về thể tích V₁ = 35 cm³, quan sát áp kế và bấm Ghi số liệu.',
    isCompleted: false,
  },
  {
    id: 2,
    title: 'Nhiệm Vụ 2: Nén Trung Bình',
    targetV: 25,
    toleranceV: 1,
    description: 'Nén tiếp pít-tông về thể tích V₂ = 25 cm³, quan sát áp suất tăng lên và bấm Ghi số liệu.',
    isCompleted: false,
  },
  {
    id: 3,
    title: 'Nhiệm Vụ 3: Nén Sâu',
    targetV: 15,
    toleranceV: 1,
    description: 'Nén sâu pít-tông về thể tích V₃ = 15 cm³, quan sát áp suất đạt cực đại và bấm Ghi số liệu.',
    isCompleted: false,
  },
];

export interface BoyleTrial {
  trial: number;
  missionId?: number;
  volume: number; // cm³
  pressure: number; // bar
  pVProduct: number; // bar·cm³
  invV: number; // 1/cm³
  diffFromAvg: number; // |pV - avg(pV)|
  relativeError: number; // %
}

export interface BoyleGradingResult {
  operationScore: number; // Max 3.0
  accuracyScore: number; // Max 4.0
  quizScore: number; // Max 3.0
  totalScore: number; // Max 10.0
  isPass: boolean;
  trialsCount: number;
  avgPV: number;
  meanAbsoluteError: number;
  meanRelativeError: number;
  feedback: string[];
}

export interface GasParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
}

const BASE_V0 = 40; // cm³
const BASE_P0 = 1.0; // bar

/**
 * Compute theoretical pressure with realistic experimental sensor noise (+- 0.8%)
 */
export const computeBoylePressure = (
  volume: number,
  baseV0 = BASE_V0,
  baseP0 = BASE_P0,
  withNoise = true
): number => {
  if (volume <= 0) return 0;
  const theoreticalP = (baseP0 * baseV0) / volume;
  if (!withNoise) return parseFloat(theoreticalP.toFixed(2));
  
  // Realistic noise between -0.8% and +0.8%
  const noiseFactor = 1 + (Math.random() * 0.016 - 0.008);
  const measuredP = theoreticalP * noiseFactor;
  return parseFloat(measuredP.toFixed(2));
};

/**
 * Calculate statistical errors and 3-tier grading scores for Boyle trials (3 Tasks / Missions)
 */
export const evaluateBoyleTrials = (
  trials: { volume: number; pressure: number; missionId?: number }[],
  quizAnswers: { q1?: string; q2?: string; q3?: string } = {}
): BoyleGradingResult => {
  const count = trials.length;
  if (count === 0) {
    return {
      operationScore: 0,
      accuracyScore: 0,
      quizScore: 0,
      totalScore: 0,
      isPass: false,
      trialsCount: 0,
      avgPV: 0,
      meanAbsoluteError: 0,
      meanRelativeError: 0,
      feedback: ['Chưa có số liệu đo thực nghiệm.'],
    };
  }

  // Calculate p*V products
  const pVList = trials.map(t => t.volume * t.pressure);
  const avgPV = pVList.reduce((a, b) => a + b, 0) / count;

  // Calculate errors
  const diffs = pVList.map(pv => Math.abs(pv - avgPV));
  const meanAbsoluteError = diffs.reduce((a, b) => a + b, 0) / count;
  const meanRelativeError = avgPV > 0 ? (meanAbsoluteError / avgPV) * 100 : 0;

  // 1. Operation Score (Max 3.0đ - 3 missions, 1.0đ per mission completed correctly)
  let operationScore = 0;
  const feedback: string[] = [];

  const matchedMission1 = trials.some(t => Math.abs(t.volume - 35) <= 1.5);
  const matchedMission2 = trials.some(t => Math.abs(t.volume - 25) <= 1.5);
  const matchedMission3 = trials.some(t => Math.abs(t.volume - 15) <= 1.5);

  let completedMissions = 0;
  if (matchedMission1) completedMissions++;
  if (matchedMission2) completedMissions++;
  if (matchedMission3) completedMissions++;

  operationScore = parseFloat((completedMissions * 1.0).toFixed(1));
  if (completedMissions === 3) {
    feedback.push('✓ Hoàn thành chính xác 3/3 nhiệm vụ đề bài yêu cầu (V = 35, 25, 15 cm³).');
  } else {
    feedback.push(`! Đã hoàn thành ${completedMissions}/3 nhiệm vụ đề bài (cần làm đủ 3 đề bài khác nhau).`);
  }

  // 2. Accuracy & Error Score (Max 4.0)
  let accuracyScore = 0;
  if (count >= 3) {
    if (meanRelativeError <= 3.0) {
      accuracyScore += 2.0;
      feedback.push(`✓ Sai số tương đối cực nhỏ (${meanRelativeError.toFixed(1)}% <= 3.0%).`);
    } else if (meanRelativeError <= 6.0) {
      accuracyScore += 1.5;
      feedback.push(`✓ Sai số tương đối đạt chuẩn (${meanRelativeError.toFixed(1)}% <= 6.0%).`);
    } else if (meanRelativeError <= 10.0) {
      accuracyScore += 1.0;
      feedback.push(`! Sai số tương đối hơi cao (${meanRelativeError.toFixed(1)}%).`);
    } else {
      accuracyScore += 0.5;
      feedback.push(`! Sai số vượt ngưỡng 10% (${meanRelativeError.toFixed(1)}%).`);
    }

    // Theoretical pV baseline is 40.0
    const baselineDiff = Math.abs(avgPV - BASE_V0 * BASE_P0);
    if (baselineDiff <= 1.5) {
      accuracyScore += 2.0;
      feedback.push(`✓ Hằng số C = p·V xấp xỉ lý thuyết 40.0 bar·cm³ (đo được: ${avgPV.toFixed(1)}).`);
    } else if (baselineDiff <= 3.0) {
      accuracyScore += 1.5;
    } else {
      accuracyScore += 1.0;
    }
  } else {
    feedback.push(`! Cần tối thiểu 3 lần ghi chép để tính sai số và kiểm chứng định luật.`);
  }

  // 3. Quiz Score (Max 3.0)
  // Correct answers: Q1: B, Q2: B, Q3: B
  let quizScore = 0;
  if (quizAnswers.q1 === 'B') quizScore += 1.0;
  if (quizAnswers.q2 === 'B') quizScore += 1.0;
  if (quizAnswers.q3 === 'B') quizScore += 1.0;

  if (quizScore === 3.0) {
    feedback.push('✓ Trả lời chính xác 3/3 câu hỏi trắc nghiệm GDPT 2018.');
  } else {
    feedback.push(`! Trả lời đúng ${quizScore}/3 câu hỏi trắc nghiệm.`);
  }

  const totalScore = Math.min(10.0, parseFloat((operationScore + accuracyScore + quizScore).toFixed(1)));
  const isPass = totalScore >= 5.0;

  return {
    operationScore: parseFloat(operationScore.toFixed(1)),
    accuracyScore: parseFloat(accuracyScore.toFixed(1)),
    quizScore: parseFloat(quizScore.toFixed(1)),
    totalScore,
    isPass,
    trialsCount: count,
    avgPV: parseFloat(avgPV.toFixed(2)),
    meanAbsoluteError: parseFloat(meanAbsoluteError.toFixed(2)),
    meanRelativeError: parseFloat(meanRelativeError.toFixed(2)),
    feedback,
  };
};

/**
 * Initialize 3D Gas Particles for Three.js
 */
export const initGasParticles = (
  count = 70,
  minX = -1.8,
  maxX = 1.8,
  cylinderRadius = 0.8
): GasParticle[] => {
  const particles: GasParticle[] = [];
  const colors = ['#38bdf8', '#60a5fa', '#818cf8', '#34d399'];

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * (cylinderRadius - 0.1);
    const speed = 0.015 + Math.random() * 0.02;
    const vAngle = Math.random() * Math.PI * 2;

    particles.push({
      x: minX + Math.random() * (maxX - minX),
      y: Math.sin(angle) * r,
      z: Math.cos(angle) * r,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: Math.sin(vAngle) * speed,
      vz: Math.cos(vAngle) * speed,
      radius: 0.04 + Math.random() * 0.02,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  return particles;
};
