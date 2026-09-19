/**
 * Physics Engine & Snell-Descartes Solver for Refraction & Total Internal Reflection Lab
 * (Khúc Xạ Ánh Sáng & Phản Xạ Toàn Phần)
 * SGK GDPT 2018 Vật Lý 11 - Bài 21: Hiện tượng khúc xạ ánh sáng - Bài 22: Hiện tượng phản xạ toàn phần
 * Formulas:
 *   - Snell's Law: n1 * sin(i) = n2 * sin(r) => r = arcsin((n1 * sin(i)) / n2)
 *   - Critical Angle: i_gh = arcsin(n2 / n1) when n1 > n2
 *   - Total Internal Reflection (TIR): when n1 > n2 and i >= i_gh
 *   - Linear Regression: sin(i) = n_21 * sin(r)
 */

export interface OpticalMedium {
  id: string;
  name: string;
  refractiveIndex: number; // n
  colorTint: string;
  opacity: number;
  description: string;
}

export const OPTICAL_MEDIA_PRESETS: OpticalMedium[] = [
  {
    id: 'air',
    name: 'Không Khí (Chân Không)',
    refractiveIndex: 1.000,
    colorTint: '#0ea5e9',
    opacity: 0.05,
    description: 'Chiết suất tuyệt đối xấp xỉ 1.000',
  },
  {
    id: 'water',
    name: 'Nước Tinh Khiết',
    refractiveIndex: 1.333,
    colorTint: '#38bdf8',
    opacity: 0.35,
    description: 'Nước lỏng nguyên chất (n ≈ 1.333, góc i_gh ≈ 48.6°)',
  },
  {
    id: 'crown_glass',
    name: 'Thủy Tinh Crown',
    refractiveIndex: 1.520,
    colorTint: '#a78bfa',
    opacity: 0.45,
    description: 'Thủy tinh quang học tiêu chuẩn (n ≈ 1.520, góc i_gh ≈ 41.1°)',
  },
  {
    id: 'flint_glass',
    name: 'Thủy Tinh Flint (Nặng)',
    refractiveIndex: 1.660,
    colorTint: '#818cf8',
    opacity: 0.55,
    description: 'Thủy tinh chiết suất cao (n ≈ 1.660, góc i_gh ≈ 37.0°)',
  },
  {
    id: 'diamond',
    name: 'Kim Cương Tự Nhiên',
    refractiveIndex: 2.417,
    colorTint: '#34d399',
    opacity: 0.70,
    description: 'Khoáng vật chiết suất cực cao (n ≈ 2.417, góc i_gh ≈ 24.4°)',
  },
  {
    id: 'mystery_x',
    name: 'Khối Vật Liệu Bí Ẩn (X)',
    refractiveIndex: 1.586, // Polycarbonate
    colorTint: '#f59e0b',
    opacity: 0.5,
    description: 'Khối quang học chưa biết rõ danh tính, cần đo tỉ số sin(i)/sin(r) để tìm n_x',
  },
];

export interface RefractionRayState {
  incidentAngleDeg: number; // i (0 - 90 deg)
  refractionAngleDeg: number; // r (0 - 90 deg)
  criticalAngleDeg: number | null; // i_gh
  isTotalInternalReflection: boolean;
  n1: number;
  n2: number;
  n21: number; // n2 / n1
  reflectance: number; // Fresnel R (0 - 1)
  transmittance: number; // Fresnel T (0 - 1)
}

export interface RefractionMeasurementRecord {
  step: number;
  missionId?: number;
  medium1Id: string;
  medium1Name: string;
  medium2Id: string;
  medium2Name: string;
  incidentAngleDeg: number; // i (deg)
  refractionAngleDeg: number; // r (deg)
  sinI: number;
  sinR: number;
  ratioSinISinR: number; // sin(i) / sin(r)
  isTIR: boolean;
}

export interface RefractionMission {
  id: number;
  title: string;
  minPoints: number;
  description: string;
  isCompleted: boolean;
}

export const DEFAULT_REFRACTION_MISSIONS: RefractionMission[] = [
  {
    id: 1,
    title: 'Nhiệm Vụ 1: Khảo Sát Định Luật Khúc Xạ (Không Khí → Thủy Tinh)',
    minPoints: 5,
    description: 'Chiếu chùm sáng từ Không khí vào Khối Thủy Tinh Crown (n1 < n2). Đo ít nhất 5 góc tới i khác nhau (15°, 30°, 45°, 60°, 75°) để tính các tỉ số sin(i)/sin(r) và chứng minh n21 là hằng số.',
    isCompleted: false,
  },
  {
    id: 2,
    title: 'Nhiệm Vụ 2: Khảo Sát Phản Xạ Toàn Phần (Thủy Tinh → Không Khí)',
    minPoints: 5,
    description: 'Đảo chiều chùm sáng: chiếu từ trong Khối Thủy Tinh ra Không khí (n1 > n2). Tìm góc tới giới hạn i_gh và quan sát hiện tượng tia khúc xạ biến mất, tia phản xạ rực sáng khi i ≥ i_gh.',
    isCompleted: false,
  },
  {
    id: 3,
    title: 'Nhiệm Vụ 3: Xác Định Chiết Suất Khối Bí Ẩn (X)',
    minPoints: 5,
    description: 'Chọn Khối Vật Liệu Bí Ẩn (X). Đo 5 cặp (i, r), lập đồ thị quan hệ sin(i) theo sin(r) để ngoại suy hệ số góc (chiết suất n_x) và xác định tên chất liệu.',
    isCompleted: false,
  },
];

export interface RefractionLinearRegression {
  slope: number; // estimated n21
  rSquared: number;
  pointsCount: number;
}

export interface RefractionGradingResult {
  operationScore: number; // Max 3.0
  accuracyScore: number; // Max 4.0
  quizScore: number; // Max 3.0
  totalScore: number; // Max 10.0
  isPass: boolean;
  trialsCount: number;
  regression?: RefractionLinearRegression;
  refractiveIndexErrorPercent: number;
  feedback: string[];
}

/**
 * Solve Ray Refraction according to Snell's law and Fresnel equations
 */
export function solveRayRefraction(
  n1: number,
  n2: number,
  incidentAngleDeg: number,
  withNoise = true
): RefractionRayState {
  const iClamped = Math.max(0, Math.min(89.5, incidentAngleDeg));
  const iRad = (iClamped * Math.PI) / 180;
  const sinI = Math.sin(iRad);
  const n21 = n2 / n1;

  // Critical angle when n1 > n2
  const criticalAngleDeg = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null;

  // Total internal reflection condition
  const sinR = (n1 * sinI) / n2;

  if (sinR > 1.0) {
    return {
      incidentAngleDeg: iClamped,
      refractionAngleDeg: 90,
      criticalAngleDeg,
      isTotalInternalReflection: true,
      n1,
      n2,
      n21,
      reflectance: 1.0,
      transmittance: 0.0,
    };
  }

  let rRad = Math.asin(sinR);
  let rDeg = (rRad * 180) / Math.PI;

  // Add realistic micro calibration jitter (+- 0.05 deg)
  if (withNoise && iClamped > 0.5) {
    const jitter = (Math.random() - 0.5) * 0.08;
    rDeg = Math.max(0, Math.min(89.9, rDeg + jitter));
    rRad = (rDeg * Math.PI) / 180;
  }

  // Fresnel Reflectance
  const cosI = Math.cos(iRad);
  const cosR = Math.cos(rRad);

  const rs = Math.pow((n1 * cosI - n2 * cosR) / (n1 * cosI + n2 * cosR + 1e-9), 2);
  const rp = Math.pow((n1 * cosR - n2 * cosI) / (n1 * cosR + n2 * cosI + 1e-9), 2);
  const reflectance = Math.min(1.0, Math.max(0.04, (rs + rp) / 2));
  const transmittance = Math.max(0.0, 1.0 - reflectance);

  return {
    incidentAngleDeg: iClamped,
    refractionAngleDeg: parseFloat(rDeg.toFixed(2)),
    criticalAngleDeg: criticalAngleDeg ? parseFloat(criticalAngleDeg.toFixed(2)) : null,
    isTotalInternalReflection: false,
    n1,
    n2,
    n21: parseFloat(n21.toFixed(3)),
    reflectance: parseFloat(reflectance.toFixed(3)),
    transmittance: parseFloat(transmittance.toFixed(3)),
  };
}

/**
 * Linear regression solver for sin(i) = n21 * sin(r)
 */
export function calculateRefractionRegression(
  records: RefractionMeasurementRecord[]
): RefractionLinearRegression {
  const validRecords = records.filter(r => !r.isTIR && r.sinR > 0.01 && r.sinI > 0.01);
  if (validRecords.length < 2) {
    return { slope: 0, rSquared: 0, pointsCount: validRecords.length };
  }

  let sumX = 0; // sin(r)
  let sumY = 0; // sin(i)
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;
  const N = validRecords.length;

  for (const rec of validRecords) {
    const x = rec.sinR;
    const y = rec.sinI;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
    sumYY += y * y;
  }

  // Force regression through origin: y = m * x => m = sum(x*y) / sum(x^2)
  const slope = sumXY / (sumXX + 1e-9);

  // R^2 calculation
  const meanY = sumY / N;
  let ssTot = 0;
  let ssRes = 0;
  for (const rec of validRecords) {
    const yPred = slope * rec.sinR;
    ssTot += Math.pow(rec.sinI - meanY, 2);
    ssRes += Math.pow(rec.sinI - yPred, 2);
  }
  const rSquared = ssTot > 1e-6 ? Math.max(0, Math.min(1, 1 - ssRes / ssTot)) : 1;

  return {
    slope: parseFloat(slope.toFixed(3)),
    rSquared: parseFloat(rSquared.toFixed(4)),
    pointsCount: N,
  };
}

export interface RefractionQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const REFRACTION_QUIZ_BANK: RefractionQuizQuestion[] = [
  {
    id: 1,
    question: 'Theo định luật khúc xạ ánh sáng Snell-Descartes, khi tia sáng truyền từ môi trường chiết quang kém (n1) sang môi trường chiết quang hơn (n2 > n1) thì:',
    options: [
      'Góc khúc xạ r luôn lớn hơn góc tới i (r > i)',
      'Góc khúc xạ r luôn nhỏ hơn góc tới i (r < i), tia khúc xạ lệch lại gần pháp tuyến',
      'Luôn luôn xảy ra hiện tượng phản xạ toàn phần',
      'Tia khúc xạ truyền thẳng không đổi hướng',
    ],
    correctIndex: 1,
    explanation: 'Vì n1*sin(i) = n2*sin(r) và n2 > n1 nên sin(r) < sin(i) => r < i, tia khúc xạ lệch lại gần pháp tuyến.',
  },
  {
    id: 2,
    question: 'Điều kiện cần và đủ để xảy ra hiện tượng phản xạ toàn phần là:',
    options: [
      'Ánh sáng truyền từ môi trường chiết quang hơn sang môi trường chiết quang kém (n1 > n2) và góc tới i ≥ i_gh',
      'Ánh sáng truyền từ không khí vào nước với góc tới i bất kỳ',
      'Ánh sáng truyền từ môi trường chiết quang kém sang môi trường chiết quang hơn với góc tới i ≥ 45°',
      'Chỉ cần góc tới i = 90°',
    ],
    correctIndex: 0,
    explanation: 'Phản xạ toàn phần chỉ xảy ra khi: (1) Ánh sáng truyền từ môi trường chiết quang hơn sang kém hơn (n1 > n2); và (2) Góc tới i lớn hơn hoặc bằng góc giới hạn i_gh (sin(i_gh) = n2/n1).',
  },
  {
    id: 3,
    question: 'Khi đo khúc xạ bằng khối bán trụ, tia sáng chiếu vào mặt cong hướng về tâm O thì:',
    options: [
      'Bị khúc xạ mạnh ngay tại mặt cong',
      'Truyền thẳng qua mặt cong không bị đổi hướng vì tia sáng vuông góc với mặt cầu tại điểm tới',
      'Bị phản xạ toàn phần 100% tại mặt cong',
      'Bị tán sắc thành 7 màu cầu vồng',
    ],
    correctIndex: 1,
    explanation: 'Vì tia sáng đi qua tâm O của mặt cong bán nguyệt nên góc tới mặt cong bằng 0° (vuông góc với tiếp tuyến mặt cong), do đó tia sáng truyền thẳng tới tâm O.',
  },
];

/**
 * 3-Tier Auto-Grading (3.0 Operation, 4.0 Accuracy, 3.0 Quiz)
 */
export function evaluateRefractionReport(
  records: RefractionMeasurementRecord[],
  quizAnswers: Record<number, number>
): { result: RefractionGradingResult; regression: RefractionLinearRegression } {
  const feedback: string[] = [];

  // 1. Operation Score (Max 3.0)
  const m1Points = records.filter(r => r.missionId === 1).length;
  const m2Points = records.filter(r => r.missionId === 2).length;
  const m3Points = records.filter(r => r.missionId === 3).length;

  let opScore = 0;
  if (m1Points >= 4) opScore += 1.0;
  else if (m1Points >= 2) opScore += 0.5;

  if (m2Points >= 4) opScore += 1.0;
  else if (m2Points >= 2) opScore += 0.5;

  if (m3Points >= 4) opScore += 1.0;
  else if (m3Points >= 2) opScore += 0.5;

  if (opScore === 3.0) {
    feedback.push('✓ Thao tác thí nghiệm hoàn hảo: Thu thập đầy đủ số liệu cho cả 3 nhiệm vụ quang học.');
  } else {
    feedback.push(`⚠️ Thao tác đạt ${opScore.toFixed(1)}/3.0đ: Cần đo đủ ít nhất 4-5 lần đo cho mỗi nhiệm vụ.`);
  }

  // 2. Accuracy Score (Max 4.0)
  const regression = calculateRefractionRegression(records);
  let accuracyScore = 0;
  let errorPercent = 0;

  if (regression.pointsCount >= 3 && regression.slope > 0) {
    // Check against standard Crown Glass n = 1.520 or active ratio
    const standardN = 1.520;
    errorPercent = Math.abs(regression.slope - standardN) / standardN * 100;

    if (errorPercent <= 3.0) accuracyScore = 4.0;
    else if (errorPercent <= 6.0) accuracyScore = 3.2;
    else if (errorPercent <= 10.0) accuracyScore = 2.4;
    else accuracyScore = 1.2;

    feedback.push(
      `✓ Đồ thị sin(i) - sin(r) cho chiết suất n ≈ ${regression.slope.toFixed(3)} (Hệ số tin cậy R² = ${(regression.rSquared * 100).toFixed(1)}%, sai số ${errorPercent.toFixed(1)}%).`
    );
  } else {
    feedback.push('⚠️ Chưa đủ số liệu hợp lệ để khớp đường hồi quy tuyến tính sin(i) - sin(r).');
  }

  // 3. Quiz Score (Max 3.0)
  let quizScore = 0;
  REFRACTION_QUIZ_BANK.forEach(q => {
    if (quizAnswers[q.id] === q.correctIndex) {
      quizScore += 1.0;
    }
  });

  if (quizScore === 3.0) {
    feedback.push('✓ Trả lời chính xác 3/3 câu hỏi trắc nghiệm lý thuyết GDPT 2018.');
  } else {
    feedback.push(`⚠️ Phần trắc nghiệm đạt ${quizScore.toFixed(1)}/3.0đ.`);
  }

  const totalScore = parseFloat((opScore + accuracyScore + quizScore).toFixed(1));
  const isPass = totalScore >= 5.0;

  return {
    result: {
      operationScore: parseFloat(opScore.toFixed(1)),
      accuracyScore: parseFloat(accuracyScore.toFixed(1)),
      quizScore: parseFloat(quizScore.toFixed(1)),
      totalScore,
      isPass,
      trialsCount: records.length,
      regression,
      refractiveIndexErrorPercent: parseFloat(errorPercent.toFixed(1)),
      feedback,
    },
    regression,
  };
}
