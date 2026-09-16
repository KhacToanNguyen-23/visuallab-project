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
};

/**
 * Helper to get schema for any lab ID, falling back to speed measurement schema if unknown
 */
export const getWorksheetSchema = (labIdOrType?: string): LabWorksheetSchema => {
  if (!labIdOrType) return LAB_WORKSHEET_REGISTRY['sim-speed-measurement'];
  
  // Direct match by ID
  if (LAB_WORKSHEET_REGISTRY[labIdOrType]) {
    return LAB_WORKSHEET_REGISTRY[labIdOrType];
  }

  // Match by labType or substring
  const found = Object.values(LAB_WORKSHEET_REGISTRY).find(
    s => s.labId === labIdOrType || s.labType === labIdOrType || labIdOrType.includes(s.labId.replace('sim-', ''))
  );

  return found || LAB_WORKSHEET_REGISTRY['sim-speed-measurement'];
};
