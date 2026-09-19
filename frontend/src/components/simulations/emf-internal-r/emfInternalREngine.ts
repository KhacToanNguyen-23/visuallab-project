/**
 * Physics Engine & Linear Regression for EMF & Internal Resistance Lab
 * (Đo Suất Điện Động & Điện Trở Trong Của Nguồn Điện)
 * SGK GDPT 2018 Vật Lý 11 - Chủ đề Dòng điện không đổi - Bài thực hành đo E và r
 * Formula: I = E / (R + r)
 * Terminal Voltage: U = I * R = E - I * r
 * Linear Regression: U = a * I + b => E_calc = b, r_calc = -a
 */

export interface PowerSourcePreset {
  id: string;
  name: string;
  standardEmfV: number; // E (V)
  standardInternalROhms: number; // r (Ohm)
  icon: string;
  description: string;
}

export const POWER_SOURCE_PRESETS: PowerSourcePreset[] = [
  {
    id: 'battery_1x',
    name: 'Pin Đơn 1.5V (Mới)',
    standardEmfV: 1.50,
    standardInternalROhms: 0.50,
    icon: '🔋',
    description: 'Pin tiểu AA mới tiêu chuẩn (E = 1.50V, r = 0.50Ω)',
  },
  {
    id: 'battery_2x',
    name: 'Bộ 2 Pin Nối Tiếp 3.0V',
    standardEmfV: 3.00,
    standardInternalROhms: 1.00,
    icon: '🔋🔋',
    description: 'Bộ 2 pin AA ghép nối tiếp (E = 3.00V, r = 1.00Ω)',
  },
  {
    id: 'battery_old',
    name: 'Pin Cũ (Chai Nội Trở Cao)',
    standardEmfV: 1.45,
    standardInternalROhms: 2.80,
    icon: '🪫',
    description: 'Pin đã qua sử dụng lâu ngày, nội trở tăng cao (E = 1.45V, r = 2.80Ω)',
  },
];

export interface EmfMission {
  id: number;
  title: string;
  sourceId: string;
  minPoints: number;
  description: string;
  isCompleted: boolean;
}

export const DEFAULT_EMF_MISSIONS: EmfMission[] = [
  {
    id: 1,
    title: 'Nhiệm Vụ 1: Khảo Sát Nguồn Pin Đơn 1.5V',
    sourceId: 'battery_1x',
    minPoints: 5,
    description: 'Chọn Pin Đơn 1.5V, đóng khóa K. Thay đổi biến trở R qua 5 nấc khác nhau (gợi ý: 2Ω, 5Ω, 10Ω, 20Ω, 50Ω) để ghi nhận bảng giá trị (I, U) và vẽ đồ thị ngoại suy tìm E và r.',
    isCompleted: false,
  },
  {
    id: 2,
    title: 'Nhiệm Vụ 2: Khảo Sát Bộ 2 Pin Nối Tiếp (3.0V)',
    sourceId: 'battery_2x',
    minPoints: 5,
    description: 'Đổi sang Bộ 2 Pin Nối Tiếp. Đo 5 lần tại các nấc biến trở để kiểm chứng suất điện động bộ nguồn E_bộ ≈ 2*E_1 và nội trở r_bộ ≈ 2*r_1.',
    isCompleted: false,
  },
  {
    id: 3,
    title: 'Nhiệm Vụ 3: Khảo Sát Nguồn Pin Cũ (Nội Trở Cao)',
    sourceId: 'battery_old',
    minPoints: 5,
    description: 'Chuyển sang Pin Cũ. Đo 5 lần để quan sát hiện tượng sụt thế nghiêm trọng khi có tải do điện trở trong tăng cao theo thời gian.',
    isCompleted: false,
  },
];

export interface EmfMeasurementRecord {
  step: number;
  missionId?: number;
  sourceId: string;
  sourceName: string;
  rheostatROhms: number; // R (Ohm)
  currentIAmps: number; // I (A)
  voltageUVolts: number; // U (V)
}

export interface LinearRegressionResult {
  emfCalculated: number; // E (intercept b)
  internalRCalculated: number; // r (-slope -a)
  rSquared: number; // R^2 correlation
  slope: number;
  intercept: number;
}

export interface EmfGradingResult {
  operationScore: number; // Max 3.0
  accuracyScore: number; // Max 4.0
  quizScore: number; // Max 3.0
  totalScore: number; // Max 10.0
  isPass: boolean;
  trialsCount: number;
  regression?: LinearRegressionResult;
  emfErrorPercent: number;
  internalRErrorPercent: number;
  feedback: string[];
}

/**
 * Solve circuit current and voltage with realistic calibration noise
 */
export const solveCircuit = (
  sourceId: string,
  rheostatROhms: number,
  switchOpen: boolean,
  withNoise = true
): {
  currentIAmps: number;
  voltageUVolts: number;
  emfV: number;
  internalROhms: number;
} => {
  const source = POWER_SOURCE_PRESETS.find(s => s.id === sourceId) || POWER_SOURCE_PRESETS[0];

  if (switchOpen) {
    // Open circuit: I = 0, U = E (ideal voltmeter)
    return {
      currentIAmps: 0,
      voltageUVolts: source.standardEmfV,
      emfV: source.standardEmfV,
      internalROhms: source.standardInternalROhms,
    };
  }

  const totalR = rheostatROhms + source.standardInternalROhms;
  let currentI = totalR > 0 ? source.standardEmfV / totalR : 0;
  let voltageU = currentI * rheostatROhms;

  if (withNoise) {
    const noiseI = 1 + (Math.random() * 0.02 - 0.01); // +/- 1% sensor noise
    const noiseU = 1 + (Math.random() * 0.02 - 0.01);
    currentI *= noiseI;
    voltageU *= noiseU;
  }

  return {
    currentIAmps: parseFloat(currentI.toFixed(3)),
    voltageUVolts: parseFloat(voltageU.toFixed(3)),
    emfV: source.standardEmfV,
    internalROhms: source.standardInternalROhms,
  };
};

/**
 * Compute Ordinary Least Squares (OLS) Linear Regression: U = slope * I + intercept
 * U = E - I * r => slope = -r, intercept = E
 */
export const computeLinearRegression = (
  points: { currentIAmps: number; voltageUVolts: number }[]
): LinearRegressionResult => {
  if (points.length < 2) {
    return {
      emfCalculated: points[0]?.voltageUVolts || 1.5,
      internalRCalculated: 0.5,
      rSquared: 1.0,
      slope: -0.5,
      intercept: 1.5,
    };
  }

  const n = points.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (const p of points) {
    sumX += p.currentIAmps;
    sumY += p.voltageUVolts;
    sumXY += p.currentIAmps * p.voltageUVolts;
    sumX2 += p.currentIAmps * p.currentIAmps;
    sumY2 += p.voltageUVolts * p.voltageUVolts;
  }

  const denom = n * sumX2 - sumX * sumX;
  if (Math.abs(denom) < 1e-7) {
    return {
      emfCalculated: 1.5,
      internalRCalculated: 0.5,
      rSquared: 0.99,
      slope: -0.5,
      intercept: 1.5,
    };
  }

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  // Correlation R^2
  const numR = n * sumXY - sumX * sumY;
  const denR = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const rSquared = denR > 0 ? Math.min(1.0, Math.pow(numR / denR, 2)) : 0.99;

  const emfCalculated = parseFloat(intercept.toFixed(3));
  const internalRCalculated = parseFloat(Math.abs(slope).toFixed(3));

  return {
    emfCalculated,
    internalRCalculated,
    rSquared: parseFloat(rSquared.toFixed(3)),
    slope: parseFloat(slope.toFixed(3)),
    intercept: parseFloat(intercept.toFixed(3)),
  };
};

/**
 * Grade student trials and quiz answers according to SGK GDPT 2018 Physics 11
 */
export const evaluateEmfInternalRReport = (
  records: EmfMeasurementRecord[],
  quizAnswers: { q1: string; q2: string; q3: string }
): { result: EmfGradingResult; regression: LinearRegressionResult } => {
  const regression = computeLinearRegression(records);

  const feedback: string[] = [];

  // 1. Operation Score (Max 3.0 pts)
  let operationScore = 0;
  const hasM1 = records.filter(r => r.sourceId === 'battery_1x' || r.missionId === 1).length >= 2;
  const hasM2 = records.filter(r => r.sourceId === 'battery_2x' || r.missionId === 2).length >= 2;
  const hasM3 = records.filter(r => r.sourceId === 'battery_old' || r.missionId === 3).length >= 2;

  if (hasM1) operationScore += 1.0;
  if (hasM2) operationScore += 1.0;
  if (hasM3) operationScore += 1.0;

  if (operationScore === 3.0) {
    feedback.push('✓ Xuất sắc! Em đã hoàn thành đầy đủ các phép đo với cả 3 cấu hình nguồn điện.');
  } else {
    feedback.push(`⚠️ Em mới ghi nhận ${Math.round(operationScore)}/3 cấu hình nguồn. Hãy đo thêm các nguồn pin khác nhau.`);
  }

  // 2. Accuracy Score (Max 4.0 pts)
  let accuracyScore = 0;
  let emfErr = 0;
  let rErr = 0;

  if (records.length >= 3) {
    // Reference against primary recorded source
    const primarySourceId = records[0].sourceId;
    const refSource = POWER_SOURCE_PRESETS.find(s => s.id === primarySourceId) || POWER_SOURCE_PRESETS[0];

    emfErr = Math.abs((regression.emfCalculated - refSource.standardEmfV) / refSource.standardEmfV) * 100;
    rErr = Math.abs((regression.internalRCalculated - refSource.standardInternalROhms) / refSource.standardInternalROhms) * 100;

    const meanErr = (emfErr + rErr) / 2;

    if (meanErr < 6.0) accuracyScore = 4.0;
    else if (meanErr < 12.0) accuracyScore = 3.0;
    else if (meanErr < 20.0) accuracyScore = 2.0;
    else accuracyScore = 1.0;

    feedback.push(
      `✓ Kết quả đồ thị ngoại suy U = ${regression.emfCalculated} - ${regression.internalRCalculated}•I (R² = ${regression.rSquared}). Sai số E: ${emfErr.toFixed(1)}%, r: ${rErr.toFixed(1)}% (${accuracyScore}/4.0 điểm).`
    );
  } else {
    feedback.push('⚠️ Cần đo ít nhất 3 điểm số liệu khác nhau để vẽ đồ thị ngoại suy hồi quy tuyến tính.');
  }

  // 3. Quiz Score (Max 3.0 pts - 1.0 pt per question)
  let quizScore = 0;
  if (quizAnswers.q1 === 'C') quizScore += 1.0; // U = E - I * r
  if (quizAnswers.q2 === 'A') quizScore += 1.0; // Điểm cắt trục tung (I=0) cho biết suất điện động E
  if (quizAnswers.q3 === 'D') quizScore += 1.0; // Độ dốc đường thẳng cho biết điện trở trong r

  feedback.push(`✓ Trắc nghiệm GDPT 2018: Đúng ${Math.round(quizScore)}/3 câu (${quizScore.toFixed(1)}/3.0 điểm).`);

  const totalScore = parseFloat(Math.min(10.0, operationScore + accuracyScore + quizScore).toFixed(1));
  const isPass = totalScore >= 5.0 && records.length >= 3;

  return {
    result: {
      operationScore: parseFloat(operationScore.toFixed(1)),
      accuracyScore: parseFloat(accuracyScore.toFixed(1)),
      quizScore: parseFloat(quizScore.toFixed(1)),
      totalScore,
      isPass,
      trialsCount: records.length,
      regression,
      emfErrorPercent: parseFloat(emfErr.toFixed(1)),
      internalRErrorPercent: parseFloat(rErr.toFixed(1)),
      feedback,
    },
    regression,
  };
};
