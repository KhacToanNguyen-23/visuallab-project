export interface PublicLabItem {
  id: string;
  title: string;
  subject: string; // E.g. 'Lớp 10', 'Lớp 11', 'Lớp 12'
  chapter: string; // E.g. 'Chương II: Động học'
  description: string;
  tags: string[];
  thumbnail?: string;
  route: string;
  tools?: string[];
  pageRef?: string;
}

export const DAC_TA_LABS: PublicLabItem[] = [
  // LỚP 10
  {
    id: '10-b6',
    title: 'Bài 6 (Trang 28 SGK): Đo tốc độ vật chuyển động thẳng',
    subject: 'Lớp 10',
    chapter: 'Chương II: Động học',
    description: 'Bố trí máng nghiêng, cổng quang điện PHOTOGATE_SENSOR đo thời gian t viên bi trượt để tính tốc độ v = s / t.',
    tags: ['Động học', 'Cổng quang điện', 'Tốc độ'],
    route: '/srs-lab',
    tools: ['INCLINED_TRACK', 'PHOTOGATE_SENSOR', 'DIGITAL_TIMER', 'STEEL_BALL'],
    pageRef: 'Trang 28 SGK 10',
  },
  {
    id: '10-b14',
    title: 'Bài 14 (Trang 57 SGK): Đo gia tốc rơi tự do',
    subject: 'Lớp 10',
    chapter: 'Chương III: Động lực học',
    description: 'Nam châm điện ngắt dòng thả rơi bi thép qua cổng quang điện đo thời gian rơi t và tính gia tốc g = 2h / t².',
    tags: ['Động lực học', 'Rơi tự do', 'Gia tốc g'],
    route: '/srs-lab',
    tools: ['VERTICAL_STAND', 'ELECTROMAGNET', 'PHOTOGATE_SENSOR', 'DIGITAL_TIMER', 'STEEL_BALL'],
    pageRef: 'Trang 57 SGK 10',
  },
  {
    id: '10-b21',
    title: 'Bài 21 (Trang 83 SGK): Đo hệ số ma sát trượt',
    subject: 'Lớp 10',
    chapter: 'Chương IV: Năng lượng & Ma sát',
    description: 'Kéo khối gỗ trượt đều nằm ngang bằng lực kế lò xo, thay đổi khối lượng quả cân để xác định hệ số ma sát μ = F_ms / N.',
    tags: ['Ma sát trượt', 'Lực kế', 'Hệ số μ'],
    route: '/simulation',
    tools: ['SPRING_BALANCE', 'WOODEN_BLOCK', 'MASS_WEIGHT_SET'],
    pageRef: 'Trang 83 SGK 10',
  },
  {
    id: '10-b30',
    title: 'Bài 30 (Trang 117 SGK): Khảo sát va chạm & bảo toàn động lượng',
    subject: 'Lớp 10',
    chapter: 'Chương V: Động lượng & Va chạm',
    description: 'Máng đệm khí và cổng quang điện khảo sát va chạm đàn hồi và mềm giữa hai xe trượt.',
    tags: ['Động lượng', 'Va chạm', 'Đệm khí'],
    route: '/simulation',
    tools: ['AIR_TRACK_BASE', 'GLIDER_CAR', 'PHOTOGATE_SENSOR', 'DIGITAL_TIMER'],
    pageRef: 'Trang 117 SGK 10',
  },
  {
    id: '10-b38',
    title: 'Bài 38 (Trang 148 SGK): Khảo sát định luật Hooke (Độ giãn lò xo)',
    subject: 'Lớp 10',
    chapter: 'Chương VI: Định luật Hooke',
    description: 'Treo lò xo xoắn vào giá đỡ, móc các quả cân 50g/100g khảo sát mối quan hệ tuyến tính giữa lực đàn hồi và độ giãn Δl.',
    tags: ['Định luật Hooke', 'Lò xo', 'Độ cứng k'],
    route: '/test-spring',
    tools: ['VERTICAL_STAND', 'HELICAL_SPRING', 'MASS_WEIGHT_SET'],
    pageRef: 'Trang 148 SGK 10',
  },

  // LỚP 11
  {
    id: '11-b7',
    title: 'Bài 7 (Trang 29 SGK): Khảo sát dao động con lắc lò xo',
    subject: 'Lớp 11',
    chapter: 'Chương I: Dao động',
    description: 'Đo chu kỳ T của con lắc lò xo dao động điều hòa theo m và k, hiển thị đồ thị li độ x-t và bảo toàn cơ năng.',
    tags: ['Dao động cơ', 'Con lắc lò xo', 'Chu kỳ T'],
    route: '/test-spring',
    tools: ['VERTICAL_STAND', 'HELICAL_SPRING', 'MASS_WEIGHT_SET', 'DIGITAL_TIMER'],
    pageRef: 'Trang 29 SGK 11',
  },
  {
    id: '11-b5',
    title: 'Bài 5 (Trang 22 SGK): Đo tần số sóng âm & tốc độ truyền âm',
    subject: 'Lớp 11',
    chapter: 'Chương II: Sóng',
    description: 'Máy phát tần số âm và ống cộng hưởng thủy tinh điều chỉnh mực nước xác định tốc độ truyền âm v ≈ 340m/s.',
    tags: ['Sóng âm', 'Cộng hưởng', 'Tốc độ v'],
    route: '/simulation',
    tools: ['RESONANCE_TUBE', 'AUDIO_GENERATOR'],
    pageRef: 'Trang 22 SGK 11',
  },
  {
    id: '11-b12',
    title: 'Bài 12 (Trang 50 SGK): Đo bước sóng ánh sáng (Khe Y-âng)',
    subject: 'Lớp 11',
    chapter: 'Chương II: Sóng',
    description: 'Chiếu nguồn Laser qua khe kép Y-âng lên màn hứng vân, dùng thước kẹp đo khoảng vân i và tính bước sóng λ.',
    tags: ['Quang học', 'Giao thoa', 'Bước sóng λ'],
    route: '/simulation',
    tools: ['LASER_SOURCE_RGB', 'YOUNG_DOUBLE_SLIT', 'FRINGE_SCREEN', 'CALIPER_CROSSHAIR'],
    pageRef: 'Trang 50 SGK 11',
  },
  {
    id: '11-b21',
    title: 'Bài 21 (Trang 85 SGK): Đo chiết suất của nước',
    subject: 'Lớp 11',
    chapter: 'Chương III: Quang học',
    description: 'Tia Laser chiếu qua bán trụ thủy tinh trên đĩa chia độ 360°, đo góc tới i và góc khúc xạ r để tính chiết suất n.',
    tags: ['Khúc xạ', 'Chiết suất n', 'Bán trụ'],
    route: '/simulation',
    tools: ['GLASS_HALF_CYLINDER', 'LASER_SOURCE_RGB'],
    pageRef: 'Trang 85 SGK 11',
  },
  {
    id: '11-b19',
    title: 'Bài 19 (Trang 76 SGK): Đo suất điện động E & điện trở trong r của Pin',
    subject: 'Lớp 11',
    chapter: 'Chương IV: Dòng điện không đổi',
    description: 'Mạch điện gồm nguồn Pin DC, Ampe kế, Vôn kế, biến trở con chạy. Thay đổi R đo cặp (I, U) dựng đồ thị tuyến tính U = E - Ir.',
    tags: ['Dòng điện', 'Pin DC', 'Đồ thị U(I)'],
    route: '/test-emf',
    tools: ['DC_POWER_SUPPLY', 'AMMETER_DC', 'VOLTMETER_DC', 'RHEOSTAT_VARIABLE', 'CIRCUIT_SWITCH'],
    pageRef: 'Trang 76 SGK 11',
  },

  // LỚP 12
  {
    id: '12-b3',
    title: 'Bài 3 (Trang 15 SGK): Đo nhiệt dung riêng của nước',
    subject: 'Lớp 12',
    chapter: 'Chương I: Vật lý nhiệt',
    description: 'Dây điện trở đun nước trong bình nhiệt lượng kế, đo công suất P, thời gian τ và độ tăng nhiệt độ để tính nhiệt dung c.',
    tags: ['Vật lý nhiệt', 'Nhiệt dung riêng', 'Nhiệt lượng'],
    route: '/simulation',
    tools: ['CALORIMETER_CUP', 'HEATING_COIL', 'DIGITAL_THERMOMETER', 'DIGITAL_TIMER'],
    pageRef: 'Trang 15 SGK 12',
  },
  {
    id: '12-b4',
    title: 'Bài 4 (Trang 19 SGK): Đo nhiệt nóng chảy riêng của nước đá',
    subject: 'Lớp 12',
    chapter: 'Chương I: Vật lý nhiệt',
    description: 'Khảo sát quá trình chuyển thể từ nước đá sang nước lỏng trong bình cách nhiệt để xác định nhiệt nóng chảy riêng λ.',
    tags: ['Vật lý nhiệt', 'Nóng chảy', 'Nhiệt lượng'],
    route: '/simulation',
    tools: ['CALORIMETER_CUP', 'DIGITAL_THERMOMETER'],
    pageRef: 'Trang 19 SGK 12',
  },
  {
    id: '12-b7',
    title: 'Bài 7 (Trang 30 SGK): Khảo sát quá trình đẳng nhiệt (Định luật Boyle)',
    subject: 'Lớp 12',
    chapter: 'Chương II: Khí lý tưởng',
    description: 'Nén pít-tông xy-lanh khí từ từ, đọc áp suất P trên áp kế và thể tích V trên thân xy-lanh kiểm chứng P·V = const.',
    tags: ['Khí lý tưởng', 'Đẳng nhiệt', 'Định luật Boyle'],
    route: '/simulation',
    tools: ['GAS_CYLINDER_PISTON', 'PRESSURE_GAUGE'],
    pageRef: 'Trang 30 SGK 12',
  },
  {
    id: '12-b12',
    title: 'Bài 12 (Trang 52 SGK): Khảo sát hiện tượng cảm ứng điện từ',
    subject: 'Lớp 12',
    chapter: 'Chương III: Từ trường & Cảm ứng điện từ',
    description: 'Di chuyển thanh nam châm vĩnh cửu đâm qua cuộn dây nối điện kế G, quan sát sự lệch kim biểu diễn dòng điện cảm ứng.',
    tags: ['Từ trường', 'Cảm ứng điện từ', 'Điện kế G'],
    route: '/test-emf',
    tools: ['BAR_MAGNET', 'INDUCTION_COIL', 'GALVANOMETER_G'],
    pageRef: 'Trang 52 SGK 12',
  },
];

export const labService = {
  // Lấy danh sách lab nổi bật cho Landing Page
  getFeaturedLabs: async (): Promise<PublicLabItem[]> => {
    try {
      const response = await fetch('http://localhost:8080/api/curriculum/topics');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((item: any, idx: number) => ({
            id: item.id || `lab-${idx}`,
            title: item.title || `Bài thí nghiệm ${idx + 1}`,
            subject: item.gradeLevel || 'Lớp 12',
            chapter: item.subjectArea || 'Chương trình GDPT 2018',
            description: item.description || 'Mô phỏng thí nghiệm học thuật trực quan.',
            tags: [item.subjectArea || 'GDPT 2018', 'Thực hành'],
            route: idx % 3 === 0 ? '/test-spring' : idx % 3 === 1 ? '/test-emf' : '/srs-lab',
          }));
        }
      }
      return DAC_TA_LABS.slice(0, 4);
    } catch (error) {
      console.warn('Backend API offline, using DacTa catalog labs:', error);
      return DAC_TA_LABS.slice(0, 4);
    }
  },

  // Lấy toàn bộ lab cho trang Thư Viện (kết nối API và gộp metadata DacTa.md)
  getAllLabs: async (): Promise<PublicLabItem[]> => {
    try {
      const response = await fetch('http://localhost:8080/api/curriculum/topics');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          // Merge API topics with DacTa metadata
          const apiLabs: PublicLabItem[] = data.map((item: any, idx: number) => {
            const matchingDacTa = DAC_TA_LABS.find(
              d => d.title.toLowerCase().includes((item.title || '').toLowerCase()) ||
                   d.id === item.id
            );
            return {
              id: item.id || `api-lab-${idx}`,
              title: item.title || matchingDacTa?.title || `Bài thí nghiệm ${idx + 1}`,
              subject: item.gradeLevel || matchingDacTa?.subject || 'Lớp 12',
              chapter: item.subjectArea || matchingDacTa?.chapter || 'Chương trình GDPT 2018',
              description: item.description || matchingDacTa?.description || 'Mô phỏng thí nghiệm học thuật trực quan.',
              tags: [item.subjectArea || 'GDPT 2018', 'Mô phỏng 2D'],
              route: matchingDacTa?.route || (idx % 2 === 0 ? '/test-spring' : '/test-emf'),
              tools: matchingDacTa?.tools,
              pageRef: matchingDacTa?.pageRef,
            };
          });
          
          // Combine API labs with any DacTa labs not already covered
          const existingTitles = new Set(apiLabs.map(l => l.title.toLowerCase()));
          const extraDacTa = DAC_TA_LABS.filter(d => !existingTitles.has(d.title.toLowerCase()));
          return [...apiLabs, ...extraDacTa];
        }
      }
      return DAC_TA_LABS;
    } catch (error) {
      console.warn('Backend API offline, using full DacTa catalog:', error);
      return DAC_TA_LABS;
    }
  },
};
