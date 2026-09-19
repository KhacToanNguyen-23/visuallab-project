/**
 * Physics Engine & Error Processing for Specific Heat Capacity Lab (Đo Nhiệt Dung Riêng)
 * SGK GDPT 2018 Vật Lý 12 - Chủ đề 1: Vật Lý Nhiệt - Bài thực hành đo nhiệt dung riêng của nước/chất lỏng
 * Formula: Q = P * t = m * c * (T_final - T_initial)
 * c_calculated = (P * t) / (m * delta_T)
 * relative_error% = |c_calculated - c_standard| / c_standard * 100%
 */

export interface LiquidPreset {
  id: string;
  name: string;
  standardC: number; // J/(kg·K)
  boilingPointC: number; // °C
  color: string;
  opacity: number;
  icon: string;
  description: string;
}

export const LIQUID_PRESETS: LiquidPreset[] = [
  {
    id: 'water',
    name: 'Nước Tinh Khiết',
    standardC: 4180,
    boilingPointC: 100,
    color: '#38bdf8',
    opacity: 0.65,
    icon: '💧',
    description: 'Nước cất tiêu chuẩn SGK Vật lý 12 (c = 4180 J/kg·K, Sôi ở 100°C)',
  },
  {
    id: 'ethanol',
    name: 'Cồn Ethanol (Rượu)',
    standardC: 2440,
    boilingPointC: 78,
    color: '#c084fc',
    opacity: 0.6,
    icon: '🧪',
    description: 'Dung dịch cồn công nghiệp (c = 2440 J/kg·K, Sôi ở 78°C)',
  },
  {
    id: 'oil',
    name: 'Dầu Thực Vật',
    standardC: 2000,
    boilingPointC: 200,
    color: '#facc15',
    opacity: 0.75,
    icon: '🛢️',
    description: 'Dầu thực vật dẫn nhiệt tốt (c = 2000 J/kg·K, Sôi ở 200°C)',
  },
];

export interface SpecificHeatMission {
  id: number;
  title: string;
  liquidId: string;
  minMassKg: number;
  maxMassKg: number;
  minPowerW: number;
  maxPowerW: number;
  minTimeSec: number;
  description: string;
  isCompleted: boolean;
}

export const DEFAULT_SPECIFIC_HEAT_MISSIONS: SpecificHeatMission[] = [
  {
    id: 1,
    title: 'Nhiệm Vụ 1: Đo Nhiệt Dung Riêng Của Nước Chuẩn',
    liquidId: 'water',
    minMassKg: 0.18,
    maxMassKg: 0.22,
    minPowerW: 40,
    maxPowerW: 60,
    minTimeSec: 60,
    description: 'Chọn Nước Tinh Khiết (m = 200g = 0.2 kg), công suất nhiệt P = 50W, bật que khuấy và đun trong ít nhất 60s - 120s. Ghi nhận độ tăng nhiệt độ và tính nhiệt dung riêng của nước (c ≈ 4180 J/kg·K).',
    isCompleted: false,
  },
  {
    id: 2,
    title: 'Nhiệm Vụ 2: Khảo Sát Khi Tăng Công Suất Hoặc Khối Lượng',
    liquidId: 'water',
    minMassKg: 0.28,
    maxMassKg: 0.40,
    minPowerW: 70,
    maxPowerW: 100,
    minTimeSec: 60,
    description: 'Giữ Nước, tăng khối lượng lên 300g hoặc tăng công suất lên 80W - 100W. Khảo sát và chứng minh nhiệt dung riêng c là hằng số đặc trưng của chất lỏng, không đổi theo P hay m.',
    isCompleted: false,
  },
  {
    id: 3,
    title: 'Nhiệm Vụ 3: So Sánh Nhiệt Dung Riêng Của Cồn / Dầu Ăn',
    liquidId: 'any_other', // ethanol or oil
    minMassKg: 0.1,
    maxMassKg: 0.4,
    minPowerW: 30,
    maxPowerW: 100,
    minTimeSec: 45,
    description: 'Đổi sang Cồn Ethanol (c ≈ 2440) hoặc Dầu Ăn (c ≈ 2000). Đun cùng điều kiện và quan sát nhiệt độ tăng nhanh hơn nhiều so với nước do nhiệt dung riêng nhỏ hơn.',
    isCompleted: false,
  },
];

export interface SpecificHeatTrial {
  trial: number;
  missionId?: number;
  liquidId: string;
  liquidName: string;
  massKg: number;
  powerW: number;
  timeSec: number;
  tempInitialC: number;
  tempFinalC: number;
  deltaTempC: number;
  heatEnergyJoules: number;
  standardC: number;
  calculatedC: number;
  relativeErrorPercent: number;
}

export interface SpecificHeatGradingResult {
  operationScore: number; // Max 3.0
  accuracyScore: number; // Max 4.0
  quizScore: number; // Max 3.0
  totalScore: number; // Max 10.0
  isPass: boolean;
  trialsCount: number;
  meanErrorPercent: number;
  feedback: string[];
}

/**
 * Compute real-time temperature evolution with stirrer efficiency and realistic sensor noise
 */
export const computeHeatingTemperature = (
  liquidId: string,
  massKg: number,
  powerW: number,
  elapsedSec: number,
  initialTempC = 25.0,
  hasStirrer = true
): {
  currentTempC: number;
  deltaTempC: number;
  isBoiling: boolean;
  heatJoules: number;
} => {
  const liquid = LIQUID_PRESETS.find(l => l.id === liquidId) || LIQUID_PRESETS[0];
  const heatJoules = powerW * elapsedSec;

  // Heat loss factor to environment (calorimeter efficiency: 97% with stirrer, 93% without)
  const efficiency = hasStirrer ? 0.97 : 0.92;
  const theoreticalDeltaT = (heatJoules * efficiency) / (massKg * liquid.standardC);

  // Tiny thermal sensor noise (+/- 0.15 °C)
  const sensorNoise = elapsedSec > 0 ? (Math.sin(elapsedSec * 1.5) * 0.08) : 0;
  let finalTemp = initialTempC + theoreticalDeltaT + sensorNoise;

  let isBoiling = false;
  if (finalTemp >= liquid.boilingPointC) {
    finalTemp = liquid.boilingPointC;
    isBoiling = true;
  }

  return {
    currentTempC: parseFloat(finalTemp.toFixed(1)),
    deltaTempC: parseFloat((finalTemp - initialTempC).toFixed(1)),
    isBoiling,
    heatJoules: Math.round(heatJoules),
  };
};

/**
 * Grade report according to SGK GDPT 2018 Physics 12 standards
 */
export const evaluateSpecificHeatReport = (
  trials: {
    liquidId: string;
    massKg: number;
    powerW: number;
    timeSec: number;
    tempInitialC: number;
    tempFinalC: number;
    missionId?: number;
  }[],
  quizAnswers: { q1: string; q2: string; q3: string }
): { result: SpecificHeatGradingResult; processedTrials: SpecificHeatTrial[] } => {
  const processedTrials: SpecificHeatTrial[] = trials.map((t, index) => {
    const liquid = LIQUID_PRESETS.find(l => l.id === t.liquidId) || LIQUID_PRESETS[0];
    const deltaTempC = parseFloat((t.tempFinalC - t.tempInitialC).toFixed(1));
    const heatEnergyJoules = Math.round(t.powerW * t.timeSec);
    
    // c = Q / (m * deltaT)
    let calculatedC = 0;
    if (t.massKg > 0 && deltaTempC > 0) {
      calculatedC = Math.round(heatEnergyJoules / (t.massKg * deltaTempC));
    }

    const err = liquid.standardC > 0 && calculatedC > 0
      ? Math.abs((calculatedC - liquid.standardC) / liquid.standardC) * 100
      : 0;

    return {
      trial: index + 1,
      missionId: t.missionId,
      liquidId: t.liquidId,
      liquidName: liquid.name,
      massKg: t.massKg,
      powerW: t.powerW,
      timeSec: t.timeSec,
      tempInitialC: t.tempInitialC,
      tempFinalC: t.tempFinalC,
      deltaTempC,
      heatEnergyJoules,
      standardC: liquid.standardC,
      calculatedC,
      relativeErrorPercent: parseFloat(err.toFixed(2)),
    };
  });

  const feedback: string[] = [];

  // 1. Operation Score (Max 3.0 pts)
  let operationScore = 0;
  const hasM1 = processedTrials.some(t => t.missionId === 1 || (t.liquidId === 'water' && t.massKg <= 0.25 && t.powerW <= 65));
  const hasM2 = processedTrials.some(t => t.missionId === 2 || (t.liquidId === 'water' && (t.massKg > 0.25 || t.powerW > 65)));
  const hasM3 = processedTrials.some(t => t.missionId === 3 || t.liquidId !== 'water');

  if (hasM1) operationScore += 1.0;
  if (hasM2) operationScore += 1.0;
  if (hasM3) operationScore += 1.0;

  if (operationScore === 3.0) {
    feedback.push('✓ Xuất sắc! Em đã hoàn thành đầy đủ cả 3 nhiệm vụ đo nhiệt dung riêng theo chuẩn SGK Vật lý 12.');
  } else {
    feedback.push(`⚠️ Em đã hoàn thành ${Math.round(operationScore)}/3 nhiệm vụ. Hãy thử thay đổi công suất/khối lượng và đo các chất lỏng khác.`);
  }

  // 2. Accuracy Score (Max 4.0 pts)
  let accuracyScore = 0;
  let meanError = 0;
  if (processedTrials.length > 0) {
    const sumError = processedTrials.reduce((sum, t) => sum + t.relativeErrorPercent, 0);
    meanError = sumError / processedTrials.length;

    if (meanError < 6.0) accuracyScore = 4.0;
    else if (meanError < 12.0) accuracyScore = 3.0;
    else if (meanError < 20.0) accuracyScore = 2.0;
    else accuracyScore = 1.0;

    feedback.push(`✓ Độ chuẩn xác số liệu: Sai số tương đối trung bình δc = ${meanError.toFixed(2)}% (${accuracyScore}/4.0 điểm).`);
  } else {
    feedback.push('⚠️ Chưa có lần đo hợp lệ nào được lưu.');
  }

  // 3. Quiz Score (Max 3.0 pts - 1.0 pt per question)
  let quizScore = 0;
  if (quizAnswers.q1 === 'A') quizScore += 1.0; // Định nghĩa nhiệt dung riêng c = Q / (m * deltaT)
  if (quizAnswers.q2 === 'C') quizScore += 1.0; // Nhiệt dung riêng lớn giúp nước điều hòa khí hậu tốt
  if (quizAnswers.q3 === 'B') quizScore += 1.0; // Que khuấy giúp nhiệt lượng truyền đều trong bình

  feedback.push(`✓ Trắc nghiệm GDPT 2018: Đúng ${Math.round(quizScore)}/3 câu (${quizScore.toFixed(1)}/3.0 điểm).`);

  const totalScore = parseFloat(Math.min(10.0, operationScore + accuracyScore + quizScore).toFixed(1));
  const isPass = totalScore >= 5.0 && processedTrials.length >= 2;

  return {
    result: {
      operationScore: parseFloat(operationScore.toFixed(1)),
      accuracyScore: parseFloat(accuracyScore.toFixed(1)),
      quizScore: parseFloat(quizScore.toFixed(1)),
      totalScore,
      isPass,
      trialsCount: processedTrials.length,
      meanErrorPercent: parseFloat(meanError.toFixed(2)),
      feedback,
    },
    processedTrials,
  };
};
