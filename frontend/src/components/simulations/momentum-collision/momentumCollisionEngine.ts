/**
 * Physics Engine & Error Processing for Momentum & Collisions Lab (Va Chạm & Bảo Toàn Động Lượng)
 * SGK GDPT 2018 Vật Lý 10 - Bài 18, 19: Động lượng và Định luật bảo toàn động lượng
 * Flag width d = 0.02 m (2 cm)
 * p_before = m1 * v1 + m2 * v2 (v2 = 0)
 * Elastic: v1' = (m1 - m2)/(m1 + m2) * v1, v2' = 2*m1/(m1 + m2) * v1
 * Inelastic: v' = (m1 * v1)/(m1 + m2)
 * delta_p% = |p_after - p_before| / p_before * 100%
 */

export interface MomentumMission {
  id: number;
  title: string;
  collisionType: 'elastic' | 'inelastic';
  m1G: number; // in grams (e.g. 200g, 300g)
  m2G: number; // in grams (e.g. 200g, 150g)
  targetSpeedMps: number; // m/s (e.g. 1.2 m/s)
  description: string;
  isCompleted: boolean;
}

export const DEFAULT_MOMENTUM_MISSIONS: MomentumMission[] = [
  {
    id: 1,
    title: 'Nhiệm Vụ 1: Va Chạm Đàn Hồi Bằng Khối Lượng',
    collisionType: 'elastic',
    m1G: 200,
    m2G: 200,
    targetSpeedMps: 1.2,
    description: 'Chọn 2 xe cùng khối lượng m1 = m2 = 200g (0.2 kg), gắn đầu lò xo đàn hồi. Phóng xe 1 va chạm xe 2 đang đứng yên. Quan sát xe 1 dừng lại và truyền toàn bộ động lượng cho xe 2.',
    isCompleted: false,
  },
  {
    id: 2,
    title: 'Nhiệm Vụ 2: Va Chạm Đàn Hồi Khác Khối Lượng',
    collisionType: 'elastic',
    m1G: 300,
    m2G: 150,
    targetSpeedMps: 1.2,
    description: 'Gắn thêm quả cân cho xe 1 (m1 = 300g = 0.3 kg) và xe 2 (m2 = 150g = 0.15 kg). Phóng xe 1 va chạm xe 2 đứng yên. Quan sát cả 2 xe cùng tiến về phía trước sau va chạm.',
    isCompleted: false,
  },
  {
    id: 3,
    title: 'Nhiệm Vụ 3: Va Chạm Mềm (Dính Liền Nhau)',
    collisionType: 'inelastic',
    m1G: 200,
    m2G: 200,
    targetSpeedMps: 1.2,
    description: 'Chuyển sang chế độ Va chạm mềm (gắn đầu dính). Phóng xe 1 (m1 = 200g) va chạm xe 2 (m2 = 200g). Quan sát sau va chạm 2 xe dính vào nhau di chuyển cùng vận tốc v\' = v1/2.',
    isCompleted: false,
  },
];

export const FLAG_WIDTH_M = 0.02; // 2 cm flag on each glider

export interface MomentumTrial {
  trial: number;
  missionId?: number;
  collisionType: 'elastic' | 'inelastic';
  m1Kg: number;
  m2Kg: number;
  v1Mps: number;
  v2Mps: number;
  v1PrimeMps: number;
  v2PrimeMps: number;
  dt1Sec: number;
  dt2Sec: number;
  pBeforeKgmS: number;
  pAfterKgmS: number;
  relativeErrorPercent: number;
}

export interface MomentumGradingResult {
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
 * Compute collision velocities and photogate transit times with realistic experimental sensor noise
 */
export const computeCollisionPhysics = (
  m1Kg: number,
  m2Kg: number,
  v1InitialMps: number,
  collisionType: 'elastic' | 'inelastic',
  withNoise = true
): {
  v1Mps: number;
  v2Mps: number;
  v1PrimeMps: number;
  v2PrimeMps: number;
  dt1Sec: number;
  dt2Sec: number;
  pBeforeKgmS: number;
  pAfterKgmS: number;
  relativeErrorPercent: number;
} => {
  const v1 = v1InitialMps;
  const v2 = 0; // Car 2 is initially at rest
  const pBefore = m1Kg * v1 + m2Kg * v2;

  let v1Prime: number;
  let v2Prime: number;

  if (collisionType === 'elastic') {
    v1Prime = ((m1Kg - m2Kg) / (m1Kg + m2Kg)) * v1;
    v2Prime = ((2 * m1Kg) / (m1Kg + m2Kg)) * v1;
  } else {
    // Inelastic: two cars stick together
    v1Prime = (m1Kg / (m1Kg + m2Kg)) * v1;
    v2Prime = v1Prime;
  }

  // Realistic experimental sensor noise (+- 1.5%)
  let finalV1Prime = v1Prime;
  let finalV2Prime = v2Prime;
  if (withNoise) {
    const noise1 = 1 + (Math.random() * 0.03 - 0.015);
    const noise2 = 1 + (Math.random() * 0.03 - 0.015);
    if (Math.abs(finalV1Prime) > 0.01) finalV1Prime *= noise1;
    if (Math.abs(finalV2Prime) > 0.01) finalV2Prime *= noise2;
  }

  const pAfter = m1Kg * finalV1Prime + m2Kg * finalV2Prime;
  const errorPercent = pBefore > 0 ? (Math.abs(pAfter - pBefore) / pBefore) * 100 : 0;

  // Transit times through photogate
  const dt1 = v1 > 0 ? FLAG_WIDTH_M / v1 : 0;
  const dt2 = Math.abs(finalV2Prime) > 0.001 ? FLAG_WIDTH_M / Math.abs(finalV2Prime) : 0;

  return {
    v1Mps: parseFloat(v1.toFixed(3)),
    v2Mps: 0,
    v1PrimeMps: parseFloat(finalV1Prime.toFixed(3)),
    v2PrimeMps: parseFloat(finalV2Prime.toFixed(3)),
    dt1Sec: parseFloat(dt1.toFixed(4)),
    dt2Sec: parseFloat(dt2.toFixed(4)),
    pBeforeKgmS: parseFloat(pBefore.toFixed(4)),
    pAfterKgmS: parseFloat(pAfter.toFixed(4)),
    relativeErrorPercent: parseFloat(errorPercent.toFixed(2)),
  };
};

/**
 * 3-Tier Auto-Grading algorithm for Momentum & Collisions Lab
 * 30% Operation + 40% Law Accuracy + 30% Quiz -> 10.0 Scale
 */
export const evaluateMomentumTrials = (
  trials: Array<{
    collisionType: 'elastic' | 'inelastic';
    m1Kg: number;
    m2Kg: number;
    v1Mps: number;
    v2Mps: number;
    v1PrimeMps: number;
    v2PrimeMps: number;
    dt1Sec: number;
    dt2Sec: number;
    pBeforeKgmS: number;
    pAfterKgmS: number;
    relativeErrorPercent: number;
    missionId?: number;
  }>,
  quizAnswers: { q1: string; q2: string; q3: string }
): { result: MomentumGradingResult; processedTrials: MomentumTrial[] } => {
  const feedback: string[] = [];

  // 1. Process Trials
  const processedTrials: MomentumTrial[] = trials.map((t, idx) => ({
    trial: idx + 1,
    missionId: t.missionId,
    collisionType: t.collisionType,
    m1Kg: t.m1Kg,
    m2Kg: t.m2Kg,
    v1Mps: t.v1Mps,
    v2Mps: t.v2Mps,
    v1PrimeMps: t.v1PrimeMps,
    v2PrimeMps: t.v2PrimeMps,
    dt1Sec: t.dt1Sec,
    dt2Sec: t.dt2Sec,
    pBeforeKgmS: t.pBeforeKgmS,
    pAfterKgmS: t.pAfterKgmS,
    relativeErrorPercent: t.relativeErrorPercent,
  }));

  // 2. Operation Score (Max 3.0)
  let opScore = 0;
  const mission1 = trials.find(t => t.missionId === 1 || (t.collisionType === 'elastic' && Math.abs(t.m1Kg - t.m2Kg) < 0.02));
  const mission2 = trials.find(t => t.missionId === 2 || (t.collisionType === 'elastic' && t.m1Kg > t.m2Kg + 0.05));
  const mission3 = trials.find(t => t.missionId === 3 || t.collisionType === 'inelastic');

  if (trials.length >= 1) opScore += 1.0;
  if (trials.length >= 2) opScore += 1.0;
  if (trials.length >= 3 && (mission1 || mission2 || mission3)) opScore += 1.0;

  if (opScore >= 3.0) {
    feedback.push('✓ Thao tác đo đạc: Hoàn thành đầy đủ 3 nhiệm vụ va chạm theo đề bài.');
  } else {
    feedback.push(`⚠️ Thao tác đo đạc: Mới hoàn thành ${trials.length}/3 lần đo theo nhiệm vụ.`);
  }

  // 3. Accuracy & Conservation Law Score (Max 4.0)
  let accScore = 0;
  const meanError =
    trials.length > 0
      ? trials.reduce((sum, t) => sum + t.relativeErrorPercent, 0) / trials.length
      : 100;

  if (trials.length > 0) {
    if (meanError <= 3.0) {
      accScore = 4.0;
      feedback.push(`✓ Độ chính xác định luật: Sai số bảo toàn động lượng trung bình rất nhỏ (δp = ${meanError.toFixed(1)}% ≤ 3%), bảo toàn động lượng hoàn hảo.`);
    } else if (meanError <= 6.0) {
      accScore = 3.2;
      feedback.push(`✓ Độ chính xác định luật: Sai số bảo toàn động lượng trung bình đạt chuẩn thực nghiệm (δp = ${meanError.toFixed(1)}% ≤ 6%).`);
    } else if (meanError <= 12.0) {
      accScore = 2.0;
      feedback.push(`⚠️ Độ chính xác định luật: Sai số bảo toàn động lượng hơi cao (δp = ${meanError.toFixed(1)}%).`);
    } else {
      accScore = 1.0;
      feedback.push(`⚠️ Độ chính xác định luật: Sai số bảo toàn động lượng lớn (δp = ${meanError.toFixed(1)}%).`);
    }
  } else {
    feedback.push('⚠️ Chưa có dữ liệu thực nghiệm để đánh giá độ chính xác bảo toàn động lượng.');
  }

  // 4. Quiz Score (Max 3.0)
  // Correct answers: Q1: C (p = m*v), Q2: B (Hệ kín), Q3: A (Va chạm mềm dính nhau)
  let quizScore = 0;
  if (quizAnswers.q1 === 'C') quizScore += 1.0;
  if (quizAnswers.q2 === 'B') quizScore += 1.0;
  if (quizAnswers.q3 === 'A') quizScore += 1.0;

  if (quizScore === 3.0) {
    feedback.push('✓ Trắc nghiệm củng cố: Trả lời chính xác 3/3 câu hỏi lý thuyết SGK.');
  } else {
    feedback.push(`⚠️ Trắc nghiệm củng cố: Trả lời đúng ${(quizScore).toFixed(0)}/3 câu hỏi.`);
  }

  const totalScore = parseFloat(Math.min(10.0, opScore + accScore + quizScore).toFixed(1));
  const isPass = totalScore >= 5.0;

  return {
    result: {
      operationScore: parseFloat(opScore.toFixed(1)),
      accuracyScore: parseFloat(accScore.toFixed(1)),
      quizScore: parseFloat(quizScore.toFixed(1)),
      totalScore,
      isPass,
      trialsCount: trials.length,
      meanErrorPercent: parseFloat(meanError.toFixed(1)),
      feedback,
    },
    processedTrials,
  };
};
