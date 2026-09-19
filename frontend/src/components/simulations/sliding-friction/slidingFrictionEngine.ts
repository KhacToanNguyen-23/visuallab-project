/**
 * Physics Engine & Error Processing for Sliding Friction Lab (Lực Ma Sát Trượt)
 * SGK GDPT 2018 Vật Lý 10 - Bài 13, 14: Lực ma sát & Định luật ma sát trượt
 * Formula: F_mst = mu_t * N = mu_t * m_total * g (g = 9.81 m/s^2)
 * mu_calculated = F_mst / N
 * relative_error% = |mu_calculated - mu_standard| / mu_standard * 100%
 */

export interface SurfacePreset {
  id: string;
  name: string;
  mu: number;
  color: string;
  roughness: number;
  metalness: number;
  icon: string;
  description: string;
  microStructure: {
    title: string;
    textureType: string;
    teethCount: number;
    teethHeight: number;
    explanation: string;
  };
}

export const SURFACE_PRESETS: SurfacePreset[] = [
  {
    id: 'wood',
    name: 'Gỗ Tự Nhiên',
    mu: 0.25,
    color: '#854d0e',
    roughness: 0.7,
    metalness: 0.05,
    icon: '🌲',
    description: 'Bề mặt gỗ bào nhẵn tiêu chuẩn SGK (μ = 0.25)',
    microStructure: {
      title: 'Mấp mô sợi xenluloza (Gỗ)',
      textureType: 'wood_grain',
      teethCount: 16,
      teethHeight: 14,
      explanation: 'Các thớ gỗ có nhiều mấp mô nhỏ, khi trượt các đỉnh mấp mô móc vào nhau gây cản trở chuyển động.',
    },
  },
  {
    id: 'glass',
    name: 'Kính Phẳng Mịn',
    mu: 0.15,
    color: '#38bdf8',
    roughness: 0.1,
    metalness: 0.1,
    icon: '🪟',
    description: 'Bề mặt kính quang học siêu trơn (μ = 0.15)',
    microStructure: {
      title: 'Mạng tinh thể phẳng (Kính)',
      textureType: 'smooth_lattice',
      teethCount: 6,
      teethHeight: 4,
      explanation: 'Bề mặt kính vô định hình rất phẳng, ít mấp mô cơ học, lực cản chủ yếu do liên kết phân tử yếu.',
    },
  },
  {
    id: 'aluminum',
    name: 'Hợp Kim Nhôm',
    mu: 0.35,
    color: '#94a3b8',
    roughness: 0.35,
    metalness: 0.8,
    icon: '🛡️',
    description: 'Máng nhôm định hình xước mờ (μ = 0.35)',
    microStructure: {
      title: 'Vệt xước định hình kim loại (Nhôm)',
      textureType: 'metallic_grooves',
      teethCount: 22,
      teethHeight: 18,
      explanation: 'Các rãnh phay kim loại tạo độ nhám vừa phải, sinh lực cản ma sát đáng kể.',
    },
  },
  {
    id: 'rubber',
    name: 'Cao Su / Nhám',
    mu: 0.60,
    color: '#334155',
    roughness: 0.95,
    metalness: 0.0,
    icon: '⬛',
    description: 'Bề mặt phủ lớp đệm cao su ma sát cao (μ = 0.60)',
    microStructure: {
      title: 'Mạng polymer đàn hồi (Cao su)',
      textureType: 'rubber_elastic',
      teethCount: 30,
      teethHeight: 28,
      explanation: 'Chuỗi polymer đàn hồi bám dính sâu vào mặt đáy khối gỗ, tạo lực ma sát trượt và nhiệt lượng rất lớn.',
    },
  },
];

export interface SlidingFrictionMission {
  id: number;
  title: string;
  surfaceId: string;
  minMassKg: number;
  maxMassKg: number;
  description: string;
  isCompleted: boolean;
}

export const DEFAULT_FRICTION_MISSIONS: SlidingFrictionMission[] = [
  {
    id: 1,
    title: 'Nhiệm Vụ 1: Khảo Sát Lực Ma Sát Trên Mặt Gỗ Chuẩn',
    surfaceId: 'wood',
    minMassKg: 0.25,
    maxMassKg: 0.35,
    description: 'Chọn bề mặt Gỗ Tự Nhiên (μ = 0.25) với khối lượng chuẩn m = 300g (0.3 kg, gồm khối gỗ 200g + 1 quả cân 100g). Kéo lực kế chuyển động thẳng đều và ghi nhận lực ma sát trượt F_mst.',
    isCompleted: false,
  },
  {
    id: 2,
    title: 'Nhiệm Vụ 2: Khảo Sát Sự Phụ Thuộc Vào Áp Lực (Tăng Quả Cân)',
    surfaceId: 'wood',
    minMassKg: 0.36,
    maxMassKg: 0.60,
    description: 'Giữ bề mặt Gỗ, tăng khối lượng bằng cách gắn thêm 200g - 300g quả cân (tổng m = 400g - 500g). Kéo lực kế để khảo sát mối liên hệ tỉ lệ thuận giữa F_mst và áp lực N = P.',
    isCompleted: false,
  },
  {
    id: 3,
    title: 'Nhiệm Vụ 3: Khảo Sát Hệ Số Ma Sát Của Bề Mặt Khác Nhau',
    surfaceId: 'any_other', // glass, aluminum, rubber
    minMassKg: 0.2,
    maxMassKg: 0.6,
    description: 'Đổi sang bề mặt Kính (μ = 0.15), Nhôm (μ = 0.35) hoặc Cao su (μ = 0.60). Kéo khối gỗ và ghi nhận lực ma sát để so sánh hệ số ma sát trượt giữa các vật liệu tiếp xúc.',
    isCompleted: false,
  },
];

export const GRAVITY_G = 9.81; // m/s^2

export interface SlidingFrictionTrial {
  trial: number;
  missionId?: number;
  surfaceId: string;
  surfaceName: string;
  totalMassKg: number;
  normalForceN: number; // N = m * g
  frictionForceN: number; // Measured F_mst (N)
  muStandard: number;
  muCalculated: number; // F_mst / N
  relativeErrorPercent: number;
}

export interface SlidingFrictionGradingResult {
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
 * Compute friction physics with realistic sensor calibration noise
 */
export const computeFrictionPhysics = (
  surfaceId: string,
  totalMassKg: number,
  withNoise = true
): {
  normalForceN: number;
  frictionForceN: number;
  muStandard: number;
} => {
  const surface = SURFACE_PRESETS.find(s => s.id === surfaceId) || SURFACE_PRESETS[0];
  const normalForce = totalMassKg * GRAVITY_G;
  let force = normalForce * surface.mu;

  if (withNoise) {
    const noise = 1 + (Math.random() * 0.04 - 0.02); // +/- 2% experimental sensor noise
    force *= noise;
  }

  return {
    normalForceN: parseFloat(normalForce.toFixed(3)),
    frictionForceN: parseFloat(force.toFixed(3)),
    muStandard: surface.mu,
  };
};

/**
 * Grade student trials and quiz answers according to SGK GDPT 2018 Physics 10
 */
export const evaluateSlidingFrictionReport = (
  trials: {
    surfaceId: string;
    totalMassKg: number;
    frictionForceN: number;
    missionId?: number;
  }[],
  quizAnswers: { q1: string; q2: string; q3: string }
): { result: SlidingFrictionGradingResult; processedTrials: SlidingFrictionTrial[] } => {
  const processedTrials: SlidingFrictionTrial[] = trials.map((t, index) => {
    const surface = SURFACE_PRESETS.find(s => s.id === t.surfaceId) || SURFACE_PRESETS[0];
    const normalForceN = parseFloat((t.totalMassKg * GRAVITY_G).toFixed(3));
    const muCalculated = normalForceN > 0 ? parseFloat((t.frictionForceN / normalForceN).toFixed(3)) : 0;
    const err = surface.mu > 0 ? Math.abs((muCalculated - surface.mu) / surface.mu) * 100 : 0;

    return {
      trial: index + 1,
      missionId: t.missionId,
      surfaceId: t.surfaceId,
      surfaceName: surface.name,
      totalMassKg: t.totalMassKg,
      normalForceN,
      frictionForceN: parseFloat(t.frictionForceN.toFixed(3)),
      muStandard: surface.mu,
      muCalculated,
      relativeErrorPercent: parseFloat(err.toFixed(2)),
    };
  });

  const feedback: string[] = [];

  // 1. Operation Score (Max 3.0 pts)
  let operationScore = 0;
  const hasM1 = processedTrials.some(t => t.missionId === 1 || (t.surfaceId === 'wood' && t.totalMassKg <= 0.35));
  const hasM2 = processedTrials.some(t => t.missionId === 2 || (t.surfaceId === 'wood' && t.totalMassKg > 0.35));
  const hasM3 = processedTrials.some(t => t.missionId === 3 || t.surfaceId !== 'wood');

  if (hasM1) operationScore += 1.0;
  if (hasM2) operationScore += 1.0;
  if (hasM3) operationScore += 1.0;

  if (operationScore === 3.0) {
    feedback.push('✓ Xuất sắc! Em đã hoàn thành đầy đủ cả 3 nhiệm vụ khảo sát ma sát theo yêu cầu SGK.');
  } else {
    feedback.push(`⚠️ Em mới hoàn thành ${Math.round(operationScore)}/3 nhiệm vụ. Hãy thử thêm các bề mặt và thay đổi tải trọng.`);
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

    feedback.push(`✓ Độ chuẩn xác số liệu: Sai số tương đối trung bình δμ = ${meanError.toFixed(2)}% (${accuracyScore}/4.0 điểm).`);
  } else {
    feedback.push('⚠️ Chưa có số liệu đo nào được ghi nhận.');
  }

  // 3. Quiz Score (Max 3.0 pts - 1.0 pt per question)
  let quizScore = 0;
  if (quizAnswers.q1 === 'B') quizScore += 1.0; // F_mst tỉ lệ thuận với áp lực N
  if (quizAnswers.q2 === 'C') quizScore += 1.0; // Hệ số ma sát phụ thuộc bản chất & tình trạng bề mặt
  if (quizAnswers.q3 === 'D') quizScore += 1.0; // F_mst không phụ thuộc diện tích tiếp xúc và vận tốc trượt

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
