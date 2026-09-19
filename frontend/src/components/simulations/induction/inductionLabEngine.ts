/**
 * Physics Engine & Error Processing for Electromagnetic Induction Lab (Cảm Ứng Điện Từ)
 * SGK GDPT 2018 Vật Lý 12 - Chủ đề Từ trường & Hiện tượng cảm ứng điện từ
 * Faraday's Law: e_c = -N * (dPhi_1 / dt) = -N * (dPhi_1 / dx) * v
 * Lenz's Law: Induced current creates magnetic field opposing the change in magnetic flux
 */

export interface InductionMission {
  id: number;
  title: string;
  pole: 'N-S' | 'S-N'; // N facing coil or S facing coil
  action: 'MOVE_IN_SLOW' | 'MOVE_IN_FAST' | 'MOVE_OUT' | 'CUSTOM';
  targetSpeed: number; // m/s (e.g. 0.5, 1.5, -0.8)
  turnCountN: number; // e.g. 200 turns
  description: string;
  isCompleted: boolean;
}

export const DEFAULT_INDUCTION_MISSIONS: InductionMission[] = [
  {
    id: 1,
    title: 'Nhiệm Vụ 1: Đưa Cực Bắc (N) Vào Chậm',
    pole: 'N-S',
    action: 'MOVE_IN_SLOW',
    targetSpeed: 0.5,
    turnCountN: 200,
    description: 'Giữ cực Bắc (N - Đỏ) hướng về cuộn dây (N=200 vòng), đưa nam châm lại gần với tốc độ chậm (v ≈ 0.5 m/s) và quan sát chiều lệch của kim điện kế.',
    isCompleted: false,
  },
  {
    id: 2,
    title: 'Nhiệm Vụ 2: Đưa Cực Bắc (N) Vào Nhanh',
    pole: 'N-S',
    action: 'MOVE_IN_FAST',
    targetSpeed: 1.5,
    turnCountN: 200,
    description: 'Giữ cực Bắc (N), tăng tốc độ đưa nam châm vào nhanh (v ≈ 1.5 m/s). Quan sát độ lệch kim điện kế và suất điện động cảm ứng tăng lên theo định luật Faraday.',
    isCompleted: false,
  },
  {
    id: 3,
    title: 'Nhiệm Vụ 3: Đổi Cực Nam (S) Hoặc Rút Nam Châm Ra',
    pole: 'S-N',
    action: 'MOVE_OUT',
    targetSpeed: 1.0,
    turnCountN: 200,
    description: 'Bấm Đảo cực sang Nam (S - Xanh) đưa vào hoặc rút nam châm ra xa cuộn dây. Quan sát kim điện kế đổi chiều lệch ngược lại theo định luật Lenz.',
    isCompleted: false,
  },
];

export interface InductionTrial {
  trial: number;
  missionId?: number;
  pole: 'N-S' | 'S-N';
  direction: 'IN' | 'OUT';
  speedMps: number; // m/s
  turnCountN: number; // turns
  peakEmfMv: number; // mV (Suất điện động cực đại)
  peakCurrentMa: number; // mA (Cường độ dòng điện cực đại)
  deflectionSign: '+' | '-';
  isLenzVerified: boolean;
}

export interface InductionGradingResult {
  operationScore: number; // Max 3.0
  accuracyScore: number; // Max 4.0
  quizScore: number; // Max 3.0
  totalScore: number; // Max 10.0
  isPass: boolean;
  trialsCount: number;
  isFaradayVerified: boolean;
  isLenzVerified: boolean;
  feedback: string[];
}

export const COIL_RESISTANCE_OHMS = 10.0; // Resistance of coil + galvanometer (Ohms)

/**
 * Compute instantaneous induced EMF (mV) and current (mA) based on magnet position, velocity, pole, and coil turns.
 * @param magnetX relative distance to coil center (-3.0 to 3.0 meters/units)
 * @param velocityMps velocity along x-axis (m/s, >0 moving right towards coil, <0 moving left)
 * @param pole 'N-S' (North entering first) or 'S-N' (South entering first)
 * @param turnCountN number of turns (e.g. 100, 200, 400)
 */
export const computeInductionEmf = (
  magnetX: number,
  velocityMps: number,
  pole: 'N-S' | 'S-N',
  turnCountN: number,
  withNoise = true
): { emfMv: number; currentMa: number } => {
  if (Math.abs(velocityMps) < 0.01) {
    return { emfMv: 0, currentMa: 0 };
  }

  // Model dPhi/dx: bell-shaped derivative profile
  // dPhi_1/dx = C * x / (x^2 + a^2)^(5/2)
  const a = 0.8;
  const poleSign = pole === 'N-S' ? 1.0 : -1.0;
  
  // Spatial gradient of magnetic field from bar magnet
  const gradient = (magnetX * 2.5) / Math.pow(magnetX * magnetX + a * a, 2.0);

  // Faraday's law: e_c = -N * (dPhi/dt) = -N * (dPhi/dx) * (dx/dt)
  const baseEmf = -1.0 * (turnCountN / 200.0) * poleSign * gradient * velocityMps * 45.0; // in mV

  let finalEmf = baseEmf;
  if (withNoise && Math.abs(finalEmf) > 0.1) {
    const noise = 1 + (Math.random() * 0.04 - 0.02);
    finalEmf *= noise;
  }

  // Clamped realistic range for meters (-80 mV to +80 mV)
  const clampedEmf = Math.max(-80, Math.min(80, finalEmf));
  const currentMa = clampedEmf / COIL_RESISTANCE_OHMS; // mA

  return {
    emfMv: parseFloat(clampedEmf.toFixed(1)),
    currentMa: parseFloat(currentMa.toFixed(2)),
  };
};

/**
 * 3-Tier Auto-Grading algorithm for Electromagnetic Induction Lab
 * 30% Operation + 40% Accuracy/Laws Verification + 30% Quiz -> 10.0 Scale
 */
export const evaluateInductionTrials = (
  trials: Array<{
    pole: 'N-S' | 'S-N';
    direction: 'IN' | 'OUT';
    speedMps: number;
    turnCountN: number;
    peakEmfMv: number;
    missionId?: number;
  }>,
  quizAnswers: { q1: string; q2: string; q3: string }
): { result: InductionGradingResult; processedTrials: InductionTrial[] } => {
  const feedback: string[] = [];

  // 1. Process Trials
  const processedTrials: InductionTrial[] = trials.map((t, idx) => {
    const peakCurrentMa = parseFloat((t.peakEmfMv / COIL_RESISTANCE_OHMS).toFixed(2));
    const deflectionSign = t.peakEmfMv >= 0 ? '+' : '-';
    // Lenz verification: moving N in gives opposing sign to moving S in or N out
    const isLenzVerified =
      (t.pole === 'N-S' && t.direction === 'IN' && t.peakEmfMv < 0) ||
      (t.pole === 'N-S' && t.direction === 'OUT' && t.peakEmfMv > 0) ||
      (t.pole === 'S-N' && t.direction === 'IN' && t.peakEmfMv > 0) ||
      (t.pole === 'S-N' && t.direction === 'OUT' && t.peakEmfMv < 0);

    return {
      trial: idx + 1,
      missionId: t.missionId,
      pole: t.pole,
      direction: t.direction,
      speedMps: t.speedMps,
      turnCountN: t.turnCountN,
      peakEmfMv: t.peakEmfMv,
      peakCurrentMa,
      deflectionSign,
      isLenzVerified,
    };
  });

  // 2. Operation Score (Max 3.0)
  let opScore = 0;
  const mission1 = trials.find(t => t.missionId === 1 || (t.pole === 'N-S' && t.direction === 'IN' && t.speedMps <= 0.8));
  const mission2 = trials.find(t => t.missionId === 2 || (t.pole === 'N-S' && t.direction === 'IN' && t.speedMps > 0.8));
  const mission3 = trials.find(t => t.missionId === 3 || t.pole === 'S-N' || t.direction === 'OUT');

  if (trials.length >= 1) opScore += 1.0;
  if (trials.length >= 2) opScore += 1.0;
  if (trials.length >= 3 && (mission1 || mission2 || mission3)) opScore += 1.0;

  if (opScore >= 3.0) {
    feedback.push('✓ Thao tác đo đạc: Hoàn thành xuất sắc 3 nhiệm vụ đề bài theo đúng yêu cầu.');
  } else {
    feedback.push(`Thao tác đo đạc: Mới hoàn thành ${trials.length}/3 lần đo theo nhiệm vụ đề bài.`);
  }

  // 3. Accuracy & Law Verification Score (Max 4.0)
  let accScore = 0;
  let isFaradayVerified = false;
  let isLenzVerified = false;

  // Verify Faraday (e_c increases with speed)
  if (mission1 && mission2) {
    if (Math.abs(mission2.peakEmfMv) > Math.abs(mission1.peakEmfMv) * 1.2) {
      isFaradayVerified = true;
      accScore += 2.0;
      feedback.push('✓ Định luật Faraday: Đã kiểm chứng chính xác suất điện động cảm ứng tỉ lệ với tốc độ biến thiên từ thông (|e_c2| > |e_c1|).');
    } else {
      accScore += 1.0;
      feedback.push('Định luật Faraday: Suất điện động khi di chuyển nhanh chưa thể hiện rõ sự tăng vượt trội so với di chuyển chậm.');
    }
  } else {
    feedback.push('Chưa đủ dữ liệu 2 mức tốc độ để kiểm chứng định luật Faraday.');
  }

  // Verify Lenz (opposite signs when reversing pole or direction)
  if (mission1 && mission3) {
    const sign1 = Math.sign(mission1.peakEmfMv);
    const sign3 = Math.sign(mission3.peakEmfMv);
    if (sign1 !== 0 && sign3 !== 0 && sign1 !== sign3) {
      isLenzVerified = true;
      accScore += 2.0;
      feedback.push('✓ Định luật Lenz: Đã kiểm chứng chính xác chiều dòng điện cảm ứng đổi chiều khi đảo cực hoặc đảo chiều chuyển động.');
    } else {
      accScore += 1.0;
      feedback.push('Định luật Lenz: Chiều dòng điện giữa các lần đo đảo cực/đảo chiều chưa thể hiện sự đổi dấu rõ rệt.');
    }
  } else {
    feedback.push('Chưa đủ dữ liệu đảo cực/chiều chuyển động để kiểm chứng định luật Lenz.');
  }

  // 4. Quiz Score (Max 3.0)
  // Correct answers: Q1: B, Q2: A, Q3: C
  let quizScore = 0;
  if (quizAnswers.q1 === 'B') quizScore += 1.0;
  if (quizAnswers.q2 === 'A') quizScore += 1.0;
  if (quizAnswers.q3 === 'C') quizScore += 1.0;

  if (quizScore === 3.0) {
    feedback.push('✓ Trắc nghiệm củng cố: Trả lời chính xác 3/3 câu hỏi lý thuyết SGK.');
  } else {
    feedback.push(`Trắc nghiệm củng cố: Trả lời đúng ${(quizScore).toFixed(0)}/3 câu hỏi.`);
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
      isFaradayVerified,
      isLenzVerified,
      feedback,
    },
    processedTrials,
  };
};
