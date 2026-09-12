/**
 * Speed Measurement Lab Physics Engine & Auto-Grading Rules
 * Standard: SGK Vật lý 10 GDPT 2018 - Chương II: Động học - Bài 6
 * UI Standard: DRAGGABLE_WORKBENCH (2D Canvas)
 */

export interface PhotogateConfig {
  id: 'E' | 'F';
  positionCm: number; // 0 to 100 cm on the inclined track
  connectedPort: 'A' | 'B' | null;
}

export interface SpeedLabState {
  trackAngleDeg: number; // 5 to 30 degrees
  gateEPosCm: number;    // e.g. 20 cm
  gateFPosCm: number;    // e.g. 70 cm
  ballDiameterCm: number; // Standard 2.00 cm
  isBallReleased: boolean;
  ballPosCm: number;
  ballSpeedMps: number;
  mode: 'AVERAGE_SPEED' | 'INSTANTANEOUS_SPEED';
  timerMode: 'A_B' | 'A'; // A_B for average speed, A for instantaneous speed
  wireEtoPortA: boolean;
  wireFtoPortB: boolean;
  isCorrectAssembly: boolean;
}

export interface MeasurementTrial {
  trialIndex: number;
  distanceCm: number; // s or d
  measuredTimeSec: string; // student entered or raw timer reading
}

export interface AutoGradeResult {
  totalScore: number; // 0 - 10
  operationScore: number; // max 3.0 (30%)
  accuracyScore: number; // max 4.0 (40%)
  quizScore: number; // max 3.0 (30%)
  isPass: boolean;
  calculatedAvgV: number;
  theoreticalAvgV: number;
  errorPercentage: number;
  feedback: string[];
}

export const GRAVITY_G = 9.81; // m/s^2

/**
 * Calculates theoretical acceleration of the rolling steel ball along the incline
 * a = g * sin(alpha) (kinematics level GDPT 2018)
 */
export function calculateTheoreticalAcceleration(angleDeg: number): number {
  const rad = (angleDeg * Math.PI) / 180;
  return GRAVITY_G * Math.sin(rad);
}

/**
 * Calculates theoretical time for ball to travel from gate E to gate F
 * s_E = gateEPos in meters, s_F = gateFPos in meters
 * t = sqrt(2*s_F / a) - sqrt(2*s_E / a)
 */
export function calculateTheoreticalDeltaT(angleDeg: number, sE_meters: number, sF_meters: number): number {
  const a = calculateTheoreticalAcceleration(angleDeg);
  if (a <= 0 || sF_meters <= sE_meters) return 0;
  const tF = Math.sqrt((2 * sF_meters) / a);
  const tE = sE_meters > 0 ? Math.sqrt((2 * sE_meters) / a) : 0;
  return tF - tE;
}

/**
 * Calculates theoretical time duration for ball body (diameter d) to pass through a single gate E
 * v_E = sqrt(2 * a * s_E)
 * delta_t_E = d / v_E
 */
export function calculateTheoreticalInstantaneousDeltaT(angleDeg: number, sE_meters: number, diameter_meters: number): number {
  const a = calculateTheoreticalAcceleration(angleDeg);
  if (a <= 0 || sE_meters <= 0) return 0;
  const vE = Math.sqrt(2 * a * sE_meters);
  return diameter_meters / vE;
}

/**
 * Adds realistic experimental noise / jitter (approx +-0.002s) to simulated time measurement
 */
export function generateSimulatedMeasurement(
  mode: 'AVERAGE_SPEED' | 'INSTANTANEOUS_SPEED',
  angleDeg: number,
  sE_cm: number,
  sF_cm: number,
  diameter_cm: number = 2.0
): number {
  const sEm = sE_cm / 100;
  const sFm = sF_cm / 100;
  const dm = diameter_cm / 100;

  let theoreticalTime = 0;
  if (mode === 'AVERAGE_SPEED') {
    theoreticalTime = calculateTheoreticalDeltaT(angleDeg, sEm, sFm);
  } else {
    theoreticalTime = calculateTheoreticalInstantaneousDeltaT(angleDeg, sEm, dm);
  }

  // Realistic random jitter +- 0.0025s
  const jitter = (Math.random() - 0.5) * 0.004;
  const noisyTime = Math.max(0.001, theoreticalTime + jitter);
  return parseFloat(noisyTime.toFixed(3));
}

/**
 * Auto-Grading Engine conforming to VisualLab 3-Tier standard:
 * Total (10) = Operation (3.0) + Accuracy (4.0) + Quiz (3.0)
 */
export function evaluateStudentSubmission(
  mode: 'AVERAGE_SPEED' | 'INSTANTANEOUS_SPEED',
  angleDeg: number,
  sE_cm: number,
  sF_cm: number,
  _ballDiameterCm: number,
  isCorrectAssembly: boolean,
  recordedTrials: { distanceCm: number; timeSec: number }[],
  studentAvgV: number,
  quizAnswers: { q1: string; q2: string; q3: string }
): AutoGradeResult {
  const feedback: string[] = [];
  let operationScore = 0;
  let accuracyScore = 0;
  let quizScore = 0;

  // 1. Operation Score (3.0 points max)
  if (isCorrectAssembly) {
    operationScore += 1.5;
  } else {
    feedback.push('Chưa đấu nối dây đúng từ cổng quang vào đồng hồ hiện số.');
  }

  if (recordedTrials.length >= 3) {
    operationScore += 1.5;
  } else {
    feedback.push(`Cần thực hiện tối thiểu 3 lần đo (hiện tại: ${recordedTrials.length} lần).`);
  }

  // 2. Accuracy & Error Score (4.0 points max)
  let theoreticalV = 0;
  if (mode === 'AVERAGE_SPEED') {
    const sEm = sE_cm / 100;
    const sFm = sF_cm / 100;
    const distM = sFm - sEm;
    const theoDt = calculateTheoreticalDeltaT(angleDeg, sEm, sFm);
    theoreticalV = theoDt > 0 ? distM / theoDt : 0;
  } else {
    const sEm = sE_cm / 100;
    const a = calculateTheoreticalAcceleration(angleDeg);
    theoreticalV = Math.sqrt(2 * a * sEm);
  }

  let errorPercentage = 100;
  if (theoreticalV > 0 && studentAvgV > 0) {
    errorPercentage = (Math.abs(studentAvgV - theoreticalV) / theoreticalV) * 100;
  }

  if (errorPercentage <= 5.0) {
    accuracyScore = 4.0;
  } else if (errorPercentage <= 10.0) {
    accuracyScore = 3.2;
    feedback.push('Kết quả tính toán có sai số nhỏ (5% - 10%). Cần kiểm tra lại phép tính trung bình.');
  } else if (errorPercentage <= 20.0) {
    accuracyScore = 2.0;
    feedback.push('Sai số tính toán tương đối cao (10% - 20%).');
  } else {
    accuracyScore = 0.5;
    feedback.push('Sai số tính toán vượt quá 20%. Vui lòng kiểm tra lại đơn vị đo (m/s vs cm/s).');
  }

  // 3. Quiz Score (3.0 points max: 1.0 point each)
  const answerKey = {
    q1: 'B',
    q2: 'A',
    q3: 'C',
  };

  if (quizAnswers.q1 === answerKey.q1) quizScore += 1.0;
  else feedback.push('Câu 1 chưa chính xác: Đo nhiều lần giúp giảm sai số ngẫu nhiên.');

  if (quizAnswers.q2 === answerKey.q2) quizScore += 1.0;
  else feedback.push('Câu 2 chưa chính xác: Tốc độ trung bình bằng quãng đường chia khoảng thời gian.');

  if (quizAnswers.q3 === answerKey.q3) quizScore += 1.0;
  else feedback.push('Câu 3 chưa chính xác: Tốc độ tức thời xấp xỉ tỉ số giữa độ dịch chuyển rất nhỏ d và thời gian qua cổng.');

  const totalScore = parseFloat((operationScore + accuracyScore + quizScore).toFixed(1));
  const isPass = totalScore >= 7.0;

  if (isPass) {
    feedback.unshift('Chúc mừng! Bạn đã hoàn thành xuất sắc bài thực hành đo tốc độ.');
  }

  return {
    totalScore,
    operationScore: parseFloat(operationScore.toFixed(1)),
    accuracyScore: parseFloat(accuracyScore.toFixed(1)),
    quizScore: parseFloat(quizScore.toFixed(1)),
    isPass,
    calculatedAvgV: parseFloat(studentAvgV.toFixed(3)),
    theoreticalAvgV: parseFloat(theoreticalV.toFixed(3)),
    errorPercentage: parseFloat(errorPercentage.toFixed(2)),
    feedback,
  };
}
