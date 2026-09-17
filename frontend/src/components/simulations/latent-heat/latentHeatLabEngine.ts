/**
 * Physics Engine & Error Processing for Specific Latent Heat of Fusion of Ice (Nhiệt Nóng Chảy Riêng)
 * SGK GDPT 2018 Vật Lý 12 - Bài 5: Thực hành đo nhiệt nóng chảy riêng của nước đá
 * Formula: lambda = (m_n * c_n * (t1 - t_cb) - m_ice * c_n * t_cb) / m_ice
 */

export interface LatentHeatMission {
  id: number;
  title: string;
  targetIceMassG: number; // in grams (e.g. 20g, 35g, 50g)
  toleranceG: number; // e.g. 2g
  description: string;
  isCompleted: boolean;
}

export const DEFAULT_LATENT_HEAT_MISSIONS: LatentHeatMission[] = [
  {
    id: 1,
    title: 'Nhiệm Vụ 1: Hòa Tan Lượng Đá Nhỏ',
    targetIceMassG: 20,
    toleranceG: 2,
    description: 'Cân khối lượng nước đá m_đá = 20g (0.02 kg) ở 0°C, thả vào bình nhiệt lượng kế và bấm Bắt đầu hòa tan.',
    isCompleted: false,
  },
  {
    id: 2,
    title: 'Nhiệm Vụ 2: Hòa Tan Lượng Đá Vừa',
    targetIceMassG: 35,
    toleranceG: 2,
    description: 'Cân khối lượng nước đá m_đá = 35g (0.035 kg) ở 0°C, quan sát nhiệt độ hạ sâu hơn và ghi lại số liệu.',
    isCompleted: false,
  },
  {
    id: 3,
    title: 'Nhiệm Vụ 3: Hòa Tan Lượng Đá Lớn',
    targetIceMassG: 50,
    toleranceG: 2,
    description: 'Cân khối lượng nước đá m_đá = 50g (0.05 kg) ở 0°C, quan sát nhiệt độ cân bằng hạ thấp nhất và ghi lại số liệu.',
    isCompleted: false,
  },
];

export interface LatentHeatTrial {
  trial: number;
  missionId?: number;
  waterMassKg: number; // e.g. 0.25 kg
  iceMassKg: number; // e.g. 0.02 kg
  initialWaterTemp: number; // °C (e.g. 40°C)
  equilibriumTemp: number; // °C
  calculatedLambda: number; // J/kg
  diffFromAvg: number; // |lambda - avg(lambda)|
  relativeError: number; // %
}

export interface LatentHeatGradingResult {
  operationScore: number; // Max 3.0
  accuracyScore: number; // Max 4.0
  quizScore: number; // Max 3.0
  totalScore: number; // Max 10.0
  isPass: boolean;
  trialsCount: number;
  avgLambda: number;
  meanAbsoluteError: number;
  meanRelativeError: number;
  feedback: string[];
}

export const C_WATER = 4180; // J/(kg·K)
export const THEORETICAL_LAMBDA = 3.34e5; // 334,000 J/kg

/**
 * Compute equilibrium temperature for warm water + ice at 0°C with realistic experimental sensor noise
 */
export const computeEquilibriumTemp = (
  waterMassKg: number,
  iceMassKg: number,
  initialWaterTemp = 40.0,
  withNoise = true
): number => {
  if (waterMassKg <= 0 || iceMassKg <= 0) return initialWaterTemp;

  // Q_toa = Q_thu
  // m_n * c_n * (t1 - t_cb) = m_ice * lambda + m_ice * c_n * t_cb
  // t_cb = (m_n * c_n * t1 - m_ice * lambda) / ((m_n + m_ice) * c_n)
  let lambda = THEORETICAL_LAMBDA;
  if (withNoise) {
    // +- 1.5% realistic experimental heat exchange noise
    const noise = 1 + (Math.random() * 0.03 - 0.015);
    lambda *= noise;
  }

  const numerator = waterMassKg * C_WATER * initialWaterTemp - iceMassKg * lambda;
  const denominator = (waterMassKg + iceMassKg) * C_WATER;
  const tCb = numerator / denominator;

  return Math.max(0.5, parseFloat(tCb.toFixed(1)));
};

/**
 * Compute specific latent heat lambda from measured temperatures
 */
export const computeLatentHeatLambda = (
  waterMassKg: number,
  iceMassKg: number,
  initialWaterTemp: number,
  equilibriumTemp: number
): number => {
  if (iceMassKg <= 0) return 0;
  const heatFromWater = waterMassKg * C_WATER * (initialWaterTemp - equilibriumTemp);
  const heatToWarmMeltedIce = iceMassKg * C_WATER * equilibriumTemp;
  const lambda = (heatFromWater - heatToWarmMeltedIce) / iceMassKg;
  return Math.round(lambda);
};

/**
 * Evaluate 3-tier grading scores for Latent Heat lab
 */
export const evaluateLatentHeatTrials = (
  trials: {
    waterMassKg: number;
    iceMassKg: number;
    initialWaterTemp: number;
    equilibriumTemp: number;
    missionId?: number;
  }[],
  quizAnswers: { q1?: string; q2?: string; q3?: string } = {}
): LatentHeatGradingResult => {
  const count = trials.length;
  if (count === 0) {
    return {
      operationScore: 0,
      accuracyScore: 0,
      quizScore: 0,
      totalScore: 0,
      isPass: false,
      trialsCount: 0,
      avgLambda: 0,
      meanAbsoluteError: 0,
      meanRelativeError: 0,
      feedback: ['Chưa có số liệu đo thực nghiệm.'],
    };
  }

  // Calculate lambdas
  const lambdas = trials.map(t =>
    computeLatentHeatLambda(t.waterMassKg, t.iceMassKg, t.initialWaterTemp, t.equilibriumTemp)
  );
  const avgLambda = Math.round(lambdas.reduce((a, b) => a + b, 0) / count);

  // Calculate errors
  const diffs = lambdas.map(l => Math.abs(l - avgLambda));
  const meanAbsoluteError = Math.round(diffs.reduce((a, b) => a + b, 0) / count);
  const meanRelativeError = avgLambda > 0 ? parseFloat(((meanAbsoluteError / avgLambda) * 100).toFixed(1)) : 0;

  // 1. Operation Score (Max 3.0đ - 3 missions)
  let operationScore = 0;
  const feedback: string[] = [];

  const matchedMission1 = trials.some(t => Math.abs(t.iceMassKg * 1000 - 20) <= 3);
  const matchedMission2 = trials.some(t => Math.abs(t.iceMassKg * 1000 - 35) <= 3);
  const matchedMission3 = trials.some(t => Math.abs(t.iceMassKg * 1000 - 50) <= 3);

  let completedMissions = 0;
  if (matchedMission1) completedMissions++;
  if (matchedMission2) completedMissions++;
  if (matchedMission3) completedMissions++;

  operationScore = parseFloat((completedMissions * 1.0).toFixed(1));
  if (completedMissions === 3) {
    feedback.push('✓ Hoàn thành chính xác 3/3 nhiệm vụ khối lượng đá (20g, 35g, 50g).');
  } else {
    feedback.push(`! Đã hoàn thành ${completedMissions}/3 nhiệm vụ đề bài yêu cầu.`);
  }

  // 2. Accuracy Score (Max 4.0đ)
  let accuracyScore = 0;
  if (count >= 3) {
    if (meanRelativeError <= 4.0) {
      accuracyScore += 2.0;
      feedback.push(`✓ Sai số tương đối giữa các lần đo rất nhỏ (${meanRelativeError}% <= 4.0%).`);
    } else if (meanRelativeError <= 8.0) {
      accuracyScore += 1.5;
      feedback.push(`✓ Sai số tương đối đạt chuẩn (${meanRelativeError}% <= 8.0%).`);
    } else {
      accuracyScore += 1.0;
      feedback.push(`! Sai số tương đối hơi cao (${meanRelativeError}%).`);
    }

    // Compare with theoretical 3.34e5 J/kg
    const theoreticalDiffPercent = Math.abs(avgLambda - THEORETICAL_LAMBDA) / THEORETICAL_LAMBDA * 100;
    if (theoreticalDiffPercent <= 5.0) {
      accuracyScore += 2.0;
      feedback.push(`✓ Nhiệt nóng chảy riêng trung bình λ = ${avgLambda.toLocaleString()} J/kg sát lý thuyết 3.34×10⁵ J/kg (lệch ${theoreticalDiffPercent.toFixed(1)}%).`);
    } else if (theoreticalDiffPercent <= 10.0) {
      accuracyScore += 1.5;
      feedback.push(`✓ Kết quả λ = ${avgLambda.toLocaleString()} J/kg đạt biên độ cho phép (lệch ${theoreticalDiffPercent.toFixed(1)}%).`);
    } else {
      accuracyScore += 1.0;
    }
  } else {
    feedback.push(`! Cần tối thiểu 3 lần ghi chép để tính sai số và kiểm chứng định luật.`);
  }

  // 3. Quiz Score (Max 3.0đ)
  // Correct answers: Q1: B, Q2: B, Q3: B
  let quizScore = 0;
  if (quizAnswers.q1 === 'B') quizScore += 1.0;
  if (quizAnswers.q2 === 'B') quizScore += 1.0;
  if (quizAnswers.q3 === 'B') quizScore += 1.0;

  if (quizScore === 3.0) {
    feedback.push('✓ Trả lời đúng 3/3 câu hỏi trắc nghiệm SGK Vật lý 12.');
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
    avgLambda,
    meanAbsoluteError,
    meanRelativeError,
    feedback,
  };
};
