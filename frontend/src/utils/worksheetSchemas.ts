export interface WorksheetColumn {
  id: string;
  label: string;
  unit: string;
  isMeasured: boolean;
  isCalculated: boolean;
  formulaHint?: string;
  defaultValue?: string | number;
}

export interface LabWorksheetSchema {
  labId: string;
  labType: string;
  title: string;
  grade: string;
  targetFormula: string;
  formulaDescription: string;
  columns: WorksheetColumn[];
  defaultRowsCount: number;
  calculateSummary?: (rows: Record<string, number>[]) => Record<string, number>;
  defaultParamBounds: Record<string, { min: number; max: number; label: string; unit: string }>;
  telemetryFieldMapping: Record<string, string>; // Maps workbench event keys to worksheet columns
}

export const LAB_WORKSHEET_REGISTRY: Record<string, LabWorksheetSchema> = {
  // LỚP 10 - BÀI 6: ĐO TỐC ĐỘ VẬT CHUYỂN ĐỘNG THẲNG
  'sim-speed-measurement': {
    labId: 'sim-speed-measurement',
    labType: 'LAB_SPEED_MEASUREMENT',
    title: '[LỚP 10] Bài 6: Đo Tốc Độ Vật Chuyển Động Thẳng',
    grade: 'Lớp 10',
    targetFormula: 'v = s / t',
    formulaDescription: 'Tốc độ v bằng quãng đường s chia cho thời gian chuyển động t',
    columns: [
      { id: 'distance', label: 'Quãng đường s', unit: 'm', isMeasured: true, isCalculated: false },
      { id: 'time', label: 'Thời gian Δt', unit: 's', isMeasured: true, isCalculated: false },
      { id: 'speed', label: 'Tốc độ v', unit: 'm/s', isMeasured: false, isCalculated: true, formulaHint: 's / Δt' },
    ],
    defaultRowsCount: 3,
    defaultParamBounds: {
      distance: { min: 0.2, max: 0.8, label: 'Quãng đường s', unit: 'm' },
      angle: { min: 5, max: 20, label: 'Góc nghiêng máng θ', unit: '°' },
    },
    telemetryFieldMapping: {
      distance: 'distance',
      time: 'time',
      speed: 'speed',
    },
    calculateSummary: (rows) => {
      if (!rows.length) return { measuredResult: 0 };
      const validSpeeds = rows.map(r => r.speed).filter(v => v && !isNaN(v) && v > 0);
      const avgSpeed = validSpeeds.length ? validSpeeds.reduce((a, b) => a + b, 0) / validSpeeds.length : 0;
      return { measuredResult: Math.round(avgSpeed * 1000) / 1000 };
    },
  },

  // LỚP 10 - BÀI 14: ĐO GIA TỐC RƠI TỰ DO
  'sim-free-fall': {
    labId: 'sim-free-fall',
    labType: 'LAB_FREE_FALL',
    title: '[LỚP 10] Bài 14: Đo Gia Tốc Rơi Tự Do g',
    grade: 'Lớp 10',
    targetFormula: 'g = 2h / t²',
    formulaDescription: 'Gia tốc trọng trường g = 2h / t̄²',
    columns: [
      { id: 'height', label: 'Độ cao rơi h', unit: 'm', isMeasured: true, isCalculated: false },
      { id: 't1', label: 'Thời gian t₁', unit: 's', isMeasured: true, isCalculated: false },
      { id: 't2', label: 'Thời gian t₂', unit: 's', isMeasured: true, isCalculated: false },
      { id: 't3', label: 'Thời gian t₃', unit: 's', isMeasured: true, isCalculated: false },
      { id: 'tAvg', label: 'Thời gian t̄', unit: 's', isMeasured: false, isCalculated: true, formulaHint: '(t₁+t₂+t₃)/3' },
      { id: 'g', label: 'Gia tốc g', unit: 'm/s²', isMeasured: false, isCalculated: true, formulaHint: '2h / (t̄²)' },
    ],
    defaultRowsCount: 3,
    defaultParamBounds: {
      height: { min: 0.4, max: 1.5, label: 'Độ cao h', unit: 'm' },
    },
    telemetryFieldMapping: {
      height: 'height',
      t1: 't1',
      t2: 't2',
      t3: 't3',
      tAvg: 'tAvg',
      g: 'g',
    },
    calculateSummary: (rows) => {
      const validG = rows.map(r => r.g).filter(v => v && !isNaN(v) && v > 0);
      const avgG = validG.length ? validG.reduce((a, b) => a + b, 0) / validG.length : 0;
      return { measuredResult: Math.round(avgG * 100) / 100 };
    },
  },

  // LỚP 10 - BÀI 21: ĐO HỆ SỐ MA SÁT TRƯỢT
  'sim-friction-coefficient': {
    labId: 'sim-friction-coefficient',
    labType: 'LAB_SLIDING_FRICTION',
    title: '[LỚP 10] Bài 21: Đo Hệ Số Ma Sát Trượt',
    grade: 'Lớp 10',
    targetFormula: 'μ = F_ms / P',
    formulaDescription: 'Hệ số ma sát trượt μ = F_ms / (m · g)',
    columns: [
      { id: 'mass', label: 'Khối lượng m', unit: 'kg', isMeasured: true, isCalculated: false },
      { id: 'normalForce', label: 'Trọng lượng P', unit: 'N', isMeasured: false, isCalculated: true, formulaHint: 'm · 9.8' },
      { id: 'f1', label: 'Lực kế F₁', unit: 'N', isMeasured: true, isCalculated: false },
      { id: 'f2', label: 'Lực kế F₂', unit: 'N', isMeasured: true, isCalculated: false },
      { id: 'fAvg', label: 'Lực ma sát F̄_ms', unit: 'N', isMeasured: false, isCalculated: true, formulaHint: '(F₁+F₂)/2' },
      { id: 'mu', label: 'Hệ số ma sát μ', unit: '', isMeasured: false, isCalculated: true, formulaHint: 'F̄_ms / P' },
    ],
    defaultRowsCount: 3,
    defaultParamBounds: {
      mass: { min: 0.1, max: 0.5, label: 'Khối lượng khối gỗ m', unit: 'kg' },
    },
    telemetryFieldMapping: {
      mass: 'mass',
      normalForce: 'normalForce',
      f1: 'f1',
      f2: 'f2',
      fAvg: 'fAvg',
      mu: 'mu',
    },
    calculateSummary: (rows) => {
      const validMu = rows.map(r => r.mu).filter(v => v && !isNaN(v) && v > 0);
      const avgMu = validMu.length ? validMu.reduce((a, b) => a + b, 0) / validMu.length : 0;
      return { measuredResult: Math.round(avgMu * 1000) / 1000 };
    },
  },

  // LỚP 10 - BÀI 38: ĐỘ GIÃN LÒ XO (ĐỊNH LUẬT HOOKE)
  'sim-hooke-law': {
    labId: 'sim-hooke-law',
    labType: 'LAB_SPRING_HOOKE',
    title: '[LỚP 10] Bài 38: Độ Giãn Lò Xo (Định Luật Hooke)',
    grade: 'Lớp 10',
    targetFormula: 'k = F / Δl',
    formulaDescription: 'Độ cứng lò xo k = (m · g) / Δl',
    columns: [
      { id: 'mass', label: 'Khối lượng quả cân m', unit: 'kg', isMeasured: true, isCalculated: false },
      { id: 'force', label: 'Trọng lượng P', unit: 'N', isMeasured: false, isCalculated: true, formulaHint: 'm · 9.8' },
      { id: 'l0', label: 'Chiều dài ban đầu l₀', unit: 'cm', isMeasured: true, isCalculated: false },
      { id: 'l', label: 'Chiều dài sau khi giãn l', unit: 'cm', isMeasured: true, isCalculated: false },
      { id: 'deltaL', label: 'Độ giãn Δl', unit: 'cm', isMeasured: false, isCalculated: true, formulaHint: 'l - l₀' },
      { id: 'k', label: 'Độ cứng k', unit: 'N/m', isMeasured: false, isCalculated: true, formulaHint: 'P / (Δl / 100)' },
    ],
    defaultRowsCount: 4,
    defaultParamBounds: {
      kDefault: { min: 20, max: 100, label: 'Độ cứng lò xo chuẩn k', unit: 'N/m' },
    },
    telemetryFieldMapping: {
      mass: 'mass',
      force: 'force',
      l0: 'l0',
      l: 'l',
      deltaL: 'deltaL',
      k: 'k',
    },
    calculateSummary: (rows) => {
      const validK = rows.map(r => r.k).filter(v => v && !isNaN(v) && v > 0);
      const avgK = validK.length ? validK.reduce((a, b) => a + b, 0) / validK.length : 0;
      return { measuredResult: Math.round(avgK * 10) / 10 };
    },
  },

  // LỚP 11 - BÀI 5: ĐO TỐC ĐỘ TRUYỀN ÂM (ỐNG CỘNG HƯỞNG)
  'sim-sound-resonance': {
    labId: 'sim-sound-resonance',
    labType: 'LAB_SOUND_RESONANCE',
    title: '[LỚP 11] Bài 5: Đo Tốc Độ Truyền Âm (Ống Cộng Hưởng)',
    grade: 'Lớp 11',
    targetFormula: 'v = λ · f',
    formulaDescription: 'Tốc độ truyền âm v = 2 · (L₂ - L₁) · f',
    columns: [
      { id: 'frequency', label: 'Tần số âm f', unit: 'Hz', isMeasured: true, isCalculated: false },
      { id: 'l1', label: 'Vị trí cộng hưởng 1 (L₁)', unit: 'm', isMeasured: true, isCalculated: false },
      { id: 'l2', label: 'Vị trí cộng hưởng 2 (L₂)', unit: 'm', isMeasured: true, isCalculated: false },
      { id: 'lambda', label: 'Bước sóng λ', unit: 'm', isMeasured: false, isCalculated: true, formulaHint: '2 · (L₂ - L₁)' },
      { id: 'speed', label: 'Tốc độ âm v', unit: 'm/s', isMeasured: false, isCalculated: true, formulaHint: 'λ · f' },
    ],
    defaultRowsCount: 3,
    defaultParamBounds: {
      frequency: { min: 400, max: 1000, label: 'Tần số nguồn âm f', unit: 'Hz' },
    },
    telemetryFieldMapping: {
      frequency: 'frequency',
      l1: 'l1',
      l2: 'l2',
      lambda: 'lambda',
      speed: 'speed',
    },
    calculateSummary: (rows) => {
      const validV = rows.map(r => r.speed).filter(v => v && !isNaN(v) && v > 0);
      const avgV = validV.length ? validV.reduce((a, b) => a + b, 0) / validV.length : 0;
      return { measuredResult: Math.round(avgV * 10) / 10 };
    },
  },

  // LỚP 11 - BÀI 7: KHẢO SÁT DAO ĐỘNG CON LẮC ĐƠN
  'sim-simple-pendulum': {
    labId: 'sim-simple-pendulum',
    labType: 'LAB_SIMPLE_PENDULUM',
    title: '[LỚP 11] Bài 7: Khảo Sát Dao Động Con Lắc Đơn',
    grade: 'Lớp 11',
    targetFormula: 'T = 2π√(l / g)',
    formulaDescription: 'Chu kỳ dao động con lắc đơn T = t₁₀ / 10 hoặc g = 4π²l / T²',
    columns: [
      { id: 'length', label: 'Chiều dài dây l', unit: 'm', isMeasured: true, isCalculated: false },
      { id: 't10', label: 'Thời gian 10 dao động t₁₀', unit: 's', isMeasured: true, isCalculated: false },
      { id: 'period', label: 'Chu kỳ T', unit: 's', isMeasured: false, isCalculated: true, formulaHint: 't₁₀ / 10' },
      { id: 'g', label: 'Gia tốc g', unit: 'm/s²', isMeasured: false, isCalculated: true, formulaHint: '4π² · l / T²' },
    ],
    defaultRowsCount: 3,
    defaultParamBounds: {
      length: { min: 0.5, max: 1.8, label: 'Chiều dài dây l', unit: 'm' },
      angle: { min: 5, max: 15, label: 'Góc lệch ban đầu α₀', unit: '°' },
    },
    telemetryFieldMapping: {
      length: 'length',
      t10: 't10',
      period: 'period',
      g: 'g',
    },
    calculateSummary: (rows) => {
      const validT = rows.map(r => r.period).filter(v => v && !isNaN(v) && v > 0);
      const avgT = validT.length ? validT.reduce((a, b) => a + b, 0) / validT.length : 0;
      return { measuredResult: Math.round(avgT * 1000) / 1000 };
    },
  },

  // LỚP 12 - BÀI 7: ĐỊNH LUẬT BOYLE - MARIOTTE (QUÁ TRÌNH ĐẲNG NHIỆT)
  'sim-boyle-mariotte': {
    labId: 'sim-boyle-mariotte',
    labType: 'LAB_BOYLE_MARIOTTE',
    title: '[LỚP 12] Bài 7: Định Luật Boyle - Quá Trình Đẳng Nhiệt',
    grade: 'Lớp 12',
    targetFormula: 'p · V = const',
    formulaDescription: 'Áp suất tỉ lệ nghịch với thể tích ở nhiệt độ không đổi: p · V = C',
    columns: [
      { id: 'volume', label: 'Thể tích V', unit: 'cm³', isMeasured: true, isCalculated: false },
      { id: 'pressure', label: 'Áp suất p', unit: 'bar', isMeasured: true, isCalculated: false },
      { id: 'pV', label: 'Tích p·V', unit: 'bar·cm³', isMeasured: false, isCalculated: true, formulaHint: 'p · V' },
      { id: 'invV', label: 'Nghịch đảo 1/V', unit: 'cm⁻³', isMeasured: false, isCalculated: true, formulaHint: '1 / V' },
    ],
    defaultRowsCount: 4,
    defaultParamBounds: {
      volume: { min: 10, max: 50, label: 'Thể tích khí V', unit: 'cm³' },
      temperature: { min: 25, max: 25, label: 'Nhiệt độ T (không đổi)', unit: '°C' },
    },
    telemetryFieldMapping: {
      volume: 'volume',
      pressure: 'pressure',
      pV: 'pV',
      invV: 'invV',
    },
    calculateSummary: (rows) => {
      const validPV = rows.map(r => r.pV).filter(v => v && !isNaN(v) && v > 0);
      const avgPV = validPV.length ? validPV.reduce((a, b) => a + b, 0) / validPV.length : 0;
      return { measuredResult: Math.round(avgPV * 10) / 10 };
    },
  },

  // LỚP 12 - BÀI 5: ĐO NHIỆT NÓNG CHẢY RIÊNG CỦA NƯỚC ĐÁ
  'sim-latent-heat': {
    labId: 'sim-latent-heat',
    labType: 'LAB_LATENT_HEAT',
    title: '[LỚP 12] Bài 5: Đo Nhiệt Nóng Chảy Riêng Của Nước Đá',
    grade: 'Lớp 12',
    targetFormula: 'λ = (Q_tỏa - Q_thu_đá) / m_đá',
    formulaDescription: 'Nhiệt nóng chảy riêng của nước đá: λ = (m_n·c_n·(t₁ - t_cb) - m_đá·c_n·t_cb) / m_đá',
    columns: [
      { id: 'waterMass', label: 'Khối lượng nước m_n', unit: 'kg', isMeasured: true, isCalculated: false },
      { id: 'iceMass', label: 'Khối lượng đá m_đá', unit: 'kg', isMeasured: true, isCalculated: false },
      { id: 't1', label: 'Nhiệt độ ban đầu t₁', unit: '°C', isMeasured: true, isCalculated: false },
      { id: 'tCb', label: 'Nhiệt độ cân bằng t_cb', unit: '°C', isMeasured: true, isCalculated: false },
      { id: 'lambda', label: 'Nhiệt nóng chảy λ', unit: 'J/kg', isMeasured: false, isCalculated: true, formulaHint: '(Q_tỏa - Q_đá) / m_đá' },
    ],
    defaultRowsCount: 3,
    defaultParamBounds: {
      waterMass: { min: 0.2, max: 0.3, label: 'Khối lượng nước ấm', unit: 'kg' },
      iceMass: { min: 0.015, max: 0.06, label: 'Khối lượng nước đá', unit: 'kg' },
      initialTemp: { min: 35, max: 50, label: 'Nhiệt độ nước ban đầu', unit: '°C' },
    },
    telemetryFieldMapping: {
      waterMass: 'waterMass',
      iceMass: 'iceMass',
      t1: 't1',
      tCb: 'tCb',
      lambda: 'lambda',
    },
    calculateSummary: (rows) => {
      const validL = rows.map(r => r.lambda).filter(v => v && !isNaN(v) && v > 0);
      const avgL = validL.length ? validL.reduce((a, b) => a + b, 0) / validL.length : 0;
      return { measuredResult: Math.round(avgL) };
    },
  },

  // LỚP 12 - BÀI CẢM ỨNG ĐIỆN TỪ & ĐỊNH LUẬT FARADAY - LENZ
  'sim-induction': {
    labId: 'sim-induction',
    labType: 'LAB_INDUCTION',
    title: '[LỚP 12] Bài Thực Hành: Khảo Sát Hiện Tượng Cảm Ứng Điện Từ',
    grade: 'Lớp 12',
    targetFormula: 'e_c = -N · (ΔΦ / Δt)',
    formulaDescription: 'Suất điện động cảm ứng tỉ lệ với tốc độ biến thiên từ thông và số vòng dây',
    columns: [
      { id: 'pole', label: 'Mặt cực', unit: '', isMeasured: true, isCalculated: false },
      { id: 'direction', label: 'Chiều chuyển động', unit: '', isMeasured: true, isCalculated: false },
      { id: 'speedMps', label: 'Vận tốc v', unit: 'm/s', isMeasured: true, isCalculated: false },
      { id: 'turnCountN', label: 'Số vòng N', unit: 'vòng', isMeasured: true, isCalculated: false },
      { id: 'peakEmfMv', label: 'Suất điện động e_c', unit: 'mV', isMeasured: false, isCalculated: true, formulaHint: '-N · (ΔΦ/Δt)' },
      { id: 'peakCurrentMa', label: 'Dòng điện I_c', unit: 'mA', isMeasured: false, isCalculated: true, formulaHint: 'e_c / R' },
    ],
    defaultRowsCount: 3,
    defaultParamBounds: {
      turnCountN: { min: 100, max: 400, label: 'Số vòng dây cuộn Solenoid', unit: 'vòng' },
      speedMps: { min: 0.2, max: 2.5, label: 'Vận tốc nam châm', unit: 'm/s' },
    },
    telemetryFieldMapping: {
      pole: 'pole',
      direction: 'direction',
      speedMps: 'speedMps',
      turnCountN: 'turnCountN',
      peakEmfMv: 'peakEmfMv',
      peakCurrentMa: 'peakCurrentMa',
    },
    calculateSummary: (rows) => {
      const validEmf = rows.map(r => r.peakEmfMv).filter(v => v !== undefined && !isNaN(v));
      const maxEmf = validEmf.length ? Math.max(...validEmf.map(Math.abs)) : 0;
      return { measuredResult: Math.round(maxEmf * 10) / 10 };
    },
  },
};

/**
 * Helper to get schema for any lab ID or title, matching properly across lab types
 */
export const getWorksheetSchema = (labIdOrType?: string): LabWorksheetSchema => {
  if (!labIdOrType) return LAB_WORKSHEET_REGISTRY['sim-speed-measurement'];
  
  // Direct match by ID
  if (LAB_WORKSHEET_REGISTRY[labIdOrType]) {
    return LAB_WORKSHEET_REGISTRY[labIdOrType];
  }

  const norm = labIdOrType.toUpperCase();

  if (norm.includes('INDUCTION') || norm.includes('CẢM ỨNG') || norm.includes('FARADAY') || norm.includes('LENZ')) {
    return LAB_WORKSHEET_REGISTRY['sim-induction'];
  }
  if (norm.includes('LATENT') || norm.includes('NÓNG CHẢY') || norm.includes('NƯỚC ĐÁ') || norm.includes('BÀI 5')) {
    return LAB_WORKSHEET_REGISTRY['sim-latent-heat'];
  }
  if (norm.includes('BOYLE') || norm.includes('MARIOTTE') || norm.includes('KHÍ LÝ TƯỞNG') || norm.includes('ĐẲNG NHIỆT')) {
    return LAB_WORKSHEET_REGISTRY['sim-boyle-mariotte'];
  }
  if (norm.includes('SPRING') || norm.includes('HOOK') || norm.includes('LÒ XO')) {
    return LAB_WORKSHEET_REGISTRY['sim-hooke-law'];
  }
  if (norm.includes('FREE_FALL') || norm.includes('FALL') || norm.includes('RƠI TỰ DO')) {
    return LAB_WORKSHEET_REGISTRY['sim-free-fall'];
  }
  if (norm.includes('FRICTION') || norm.includes('MA SÁT')) {
    return LAB_WORKSHEET_REGISTRY['sim-friction-coefficient'];
  }
  if (norm.includes('SOUND') || norm.includes('RESONANCE') || norm.includes('CỘNG HƯỞNG') || norm.includes('ÂM')) {
    return LAB_WORKSHEET_REGISTRY['sim-sound-resonance'];
  }
  if (norm.includes('PENDULUM') || norm.includes('CON LẮC ĐƠN')) {
    return LAB_WORKSHEET_REGISTRY['sim-simple-pendulum'];
  }
  if (norm.includes('SPEED') || norm.includes('TỐC ĐỘ') || norm.includes('BÀI 6')) {
    return LAB_WORKSHEET_REGISTRY['sim-speed-measurement'];
  }

  // Match by labType or substring
  const found = Object.values(LAB_WORKSHEET_REGISTRY).find(
    s => s.labId === labIdOrType || s.labType === labIdOrType || norm.includes(s.labId.replace('sim-', '').toUpperCase())
  );

  return found || LAB_WORKSHEET_REGISTRY['sim-speed-measurement'];
};
