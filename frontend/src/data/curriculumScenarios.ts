export interface CurriculumScenario {
  id: string;
  title: string;
  grade: number;
  lessonNumber: number;
  textbookPage: number;
  chapter: string;
  objective: string;
  expectedValue?: {
    label: string;
    unit: string;
    value: number;
  };
}

export const CURRICULUM_SCENARIOS: Record<string, CurriculumScenario> = {
  // --- LỚP 10 ---
  'sim-speed-measurement': {
    id: 'sim-speed-measurement',
    title: 'Bài 6: Đo tốc độ của vật chuyển động thẳng',
    grade: 10,
    lessonNumber: 6,
    textbookPage: 28,
    chapter: 'Chương II: Động học',
    objective: 'Đo thời gian bi thép chuyển động trên máng nghiêng qua 2 cổng quang điện để xác định tốc độ trung bình và gia tốc.',
    expectedValue: { label: 'Gia tốc a', unit: 'm/s²', value: 1.68 },
  },
  'sim-free-fall': {
    id: 'sim-free-fall',
    title: 'Bài 14: Thực hành đo gia tốc rơi tự do',
    grade: 10,
    lessonNumber: 14,
    textbookPage: 57,
    chapter: 'Chương III: Động lực học',
    objective: 'Xác định gia tốc rơi tự do g bằng phương pháp đo khoảng cách rơi s và thời gian rơi t qua cổng quang điện.',
    expectedValue: { label: 'Gia tốc g', unit: 'm/s²', value: 9.807 },
  },
  'sim-friction-coefficient': {
    id: 'sim-friction-coefficient',
    title: 'Bài 21: Đo hệ số ma sát trượt',
    grade: 10,
    lessonNumber: 21,
    textbookPage: 83,
    chapter: 'Chương IV: Năng lượng & Ma sát',
    objective: 'Dùng lực kế kéo khối gỗ trượt đều trên mặt bàn để đo hệ số ma sát trượt μ.',
    expectedValue: { label: 'Hệ số ma sát μ', unit: '', value: 0.25 },
  },
  'sim-momentum-collision': {
    id: 'sim-momentum-collision',
    title: 'Bài 30: Khảo sát động lượng & va chạm',
    grade: 10,
    lessonNumber: 30,
    textbookPage: 117,
    chapter: 'Chương V: Động lượng & Va chạm',
    objective: 'Khảo sát sự bảo toàn động lượng của 2 xe trượt trên đệm không khí khi va chạm đàn hồi và mềm.',
    expectedValue: { label: 'Bảo toàn p', unit: 'kg·m/s', value: 0.16 },
  },
  'sim-spring-mass': {
    id: 'sim-spring-mass',
    title: 'Bài 38: Thực hành đo độ cứng của lò xo',
    grade: 10,
    lessonNumber: 38,
    textbookPage: 148,
    chapter: 'Chương VI: Biến dạng & Đàn hồi',
    objective: 'Khảo sát định luật Hooke và xác định độ cứng k của lò xo.',
    expectedValue: { label: 'Độ cứng k', unit: 'N/m', value: 40.0 },
  },

  // --- LỚP 11 ---
  'sim-simple-pendulum': {
    id: 'sim-simple-pendulum',
    title: 'Bài 7: Khảo sát dao động con lắc đơn',
    grade: 11,
    lessonNumber: 7,
    textbookPage: 29,
    chapter: 'Chương I: Dao động',
    objective: 'Khảo sát chu kỳ dao động T = 2π√(l/g) của con lắc đơn và xác định gia tốc trọng trường g.',
    expectedValue: { label: 'Gia tốc g', unit: 'm/s²', value: 9.807 },
  },
  'sim-sound-resonance': {
    id: 'sim-sound-resonance',
    title: 'Bài 5: Đo tốc độ truyền âm (Ống cộng hưởng)',
    grade: 11,
    lessonNumber: 5,
    textbookPage: 22,
    chapter: 'Chương II: Sóng',
    objective: 'Xác định bước sóng âm qua hiện tượng cộng hưởng trong ống thủy tinh và tính tốc độ truyền âm v.',
    expectedValue: { label: 'Tốc độ âm v', unit: 'm/s', value: 340.0 },
  },
  'sim-young-interference': {
    id: 'sim-young-interference',
    title: 'Bài 12: Đo bước sóng ánh sáng (Khe Y-âng)',
    grade: 11,
    lessonNumber: 12,
    textbookPage: 50,
    chapter: 'Chương II: Sóng',
    objective: 'Quan sát hệ vân giao thoa qua khe Y-âng và đo khoảng vân i để tính bước sóng ánh sáng λ.',
    expectedValue: { label: 'Bước sóng λ', unit: 'nm', value: 650.0 },
  },
  'sim-refraction': {
    id: 'sim-refraction',
    title: 'Bài 21: Đo chiết suất của nước & khúc xạ',
    grade: 11,
    lessonNumber: 21,
    textbookPage: 85,
    chapter: 'Chương III: Quang học',
    objective: 'Chiếu tia sáng qua khối bán trụ để kiểm chứng định luật khúc xạ n1 sin i = n2 sin r.',
    expectedValue: { label: 'Chiết suất n', unit: '', value: 1.333 },
  },
  'sim-emf-internal-r': {
    id: 'sim-emf-internal-r',
    title: 'Bài 19: Đo suất điện động E & điện trở trong r',
    grade: 11,
    lessonNumber: 19,
    textbookPage: 76,
    chapter: 'Chương IV: Dòng điện không đổi',
    objective: 'Khảo sát đặc tuyến U-I của nguồn pin để xác định suất điện động E và điện trở trong r.',
    expectedValue: { label: 'Suất điện động E', unit: 'V', value: 1.5 },
  },
  'sim-dc-circuit': {
    id: 'sim-dc-circuit',
    title: 'Mạch điện một chiều & Định luật Ohm',
    grade: 11,
    lessonNumber: 18,
    textbookPage: 72,
    chapter: 'Chương IV: Dòng điện không đổi',
    objective: 'Lắp ráp mạch điện gồm pin, biến trở, ampe kế, vôn kế và kiểm chứng định luật Ohm I = U / R.',
    expectedValue: { label: 'Điện trở R', unit: 'Ω', value: 10.0 },
  },

  // --- LỚP 12 ---
  'sim-specific-heat': {
    id: 'sim-specific-heat',
    title: 'Bài 3: Đo nhiệt dung riêng của nước',
    grade: 12,
    lessonNumber: 3,
    textbookPage: 15,
    chapter: 'Chương I: Vật lý nhiệt',
    objective: 'Dùng nhiệt lượng kế và dây nung điện trở để xác định nhiệt dung riêng c của nước.',
    expectedValue: { label: 'Nhiệt dung riêng c', unit: 'J/(kg·K)', value: 4180.0 },
  },
  'sim-latent-heat': {
    id: 'sim-latent-heat',
    title: 'Bài 4: Đo nhiệt nóng chảy của nước đá',
    grade: 12,
    lessonNumber: 4,
    textbookPage: 19,
    chapter: 'Chương I: Vật lý nhiệt',
    objective: 'Xác định nhiệt nóng chảy riêng L của nước đá bằng phương pháp nhiệt lượng kế.',
    expectedValue: { label: 'Nhiệt nóng chảy L', unit: 'J/kg', value: 334000.0 },
  },
  'sim-boyle-mariotte': {
    id: 'sim-boyle-mariotte',
    title: 'Bài 7: Quá trình đẳng nhiệt (Boyle - Mariotte)',
    grade: 12,
    lessonNumber: 7,
    textbookPage: 30,
    chapter: 'Chương II: Khí lý tưởng',
    objective: 'Nén khí trong xy-lanh kín ở nhiệt độ không đổi và kiểm chứng p·V = const.',
    expectedValue: { label: 'Tích p·V', unit: 'bar·cm³', value: 100.0 },
  },
  'sim-electromagnetic-induction': {
    id: 'sim-electromagnetic-induction',
    title: 'Bài 12: Khảo sát hiện tượng cảm ứng điện từ',
    grade: 12,
    lessonNumber: 12,
    textbookPage: 52,
    chapter: 'Chương III: Từ trường',
    objective: 'Khảo sát dòng điện cảm ứng xuất hiện trong cuộn dây khi di chuyển nam châm vĩnh cửu.',
    expectedValue: { label: 'Từ thông Φ', unit: 'Wb', value: 0.05 },
  },
};

export function getCurriculumScenario(labId: string): CurriculumScenario | null {
  const normalizedId =
    labId === 'grade10-hooke-law' || labId === 'hooke-law' || labId === 'sim-hooke-law'
      ? 'sim-spring-mass'
      : labId === 'sim-friction'
      ? 'sim-friction-coefficient'
      : labId;
  return CURRICULUM_SCENARIOS[normalizedId] || null;
}
