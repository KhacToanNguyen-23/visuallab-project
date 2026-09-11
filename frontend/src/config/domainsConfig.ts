export interface PhysicsDomain {
  id: string;
  name: string;
  code: string;
  description: string;
  colorBadge: string;
}

export const PHYSICS_DOMAINS: PhysicsDomain[] = [
  {
    id: 'EM',
    name: 'Điện & Từ Học',
    code: '[ĐIỆN HỌC]',
    description: 'Mạch điện DC/AC, Định luật Ohm, Cảm ứng điện từ, Suất điện động',
    colorBadge: 'bg-blue-500/10 text-blue-600',
  },
  {
    id: 'MECH',
    name: 'Cơ Học & Năng Lượng',
    code: '[CƠ HỌC]',
    description: 'Gia tốc rơi tự do, Con lắc đơn/lò xo, Chuyển động, Bảo toàn năng lượng',
    colorBadge: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    id: 'WAVE_THERMO',
    name: 'Sóng & Nhiệt Học',
    code: '[SÓNG - NHIỆT]',
    description: 'Dao động điều hòa, Sóng âm, Khí lý tưởng, Nhiệt dung riêng',
    colorBadge: 'bg-amber-500/10 text-amber-600',
  },
  {
    id: 'OPTICS',
    name: 'Quang Học & Hiện Đại',
    code: '[QUANG HỌC]',
    description: 'Khúc xạ ánh sáng, Thấu kính hội tụ, Gương phẳng, Vật lý hạt nhân',
    colorBadge: 'bg-purple-500/10 text-purple-600',
  },
];

export interface LabItemNode {
  id: string;
  title: string;
  description: string;
  engineType: 'DRAG_DROP' | 'PARAMETER_STUDIO';
  route: string;
}

export interface ChapterNode {
  id: string;
  title: string;
  domainId: string;
  domainBadge: string;
  labs: LabItemNode[];
}

export interface GradeNode {
  grade: number;
  label: string;
  badge: string;
  chapters: ChapterNode[];
}

export const GDPT2018_CURRICULUM_TREE: GradeNode[] = [
  {
    grade: 10,
    label: 'Khối Lớp 10',
    badge: '[LỚP 10]',
    chapters: [
      {
        id: 'g10-c1',
        title: 'Chương 1: Mở đầu & An toàn phòng thí nghiệm',
        domainId: 'MECH',
        domainBadge: '[CƠ HỌC]',
        labs: [
          { id: 'sim-caliper-micrometer', title: 'Đo Kích Thước Bằng Thước Kẹp & Panme', description: 'Đo đường kính bi sắt và độ dày tấm kim loại, tính sai số dụng cụ.', engineType: 'DRAG_DROP', route: '/lab/dc-circuit' }
        ]
      },
      {
        id: 'g10-c2',
        title: 'Chương 2: Động học (Chuyển động)',
        domainId: 'MECH',
        domainBadge: '[CƠ HỌC]',
        labs: [
          { id: 'sim-free-fall', title: 'Đo Gia Tốc Rơi Tự Do g Bằng Cổng Quang Điện', description: 'Bi sắt rơi qua 2 cổng quang điện kết hợp đồng hồ hiện số.', engineType: 'DRAG_DROP', route: '/lab/free-fall' }
        ]
      },
      {
        id: 'g10-c3',
        title: 'Chương 3: Động lực học (Các Lực & Newton)',
        domainId: 'MECH',
        domainBadge: '[CƠ HỌC]',
        labs: [
          { id: 'sim-newton-second-law', title: 'Khảo Sát Định Luật II Newton F = m*a', description: 'Xe con chạy trên máng đệm khí với lực kéo biến đổi.', engineType: 'DRAG_DROP', route: '/lab/dc-circuit' }
        ]
      },
      {
        id: 'g10-c4',
        title: 'Chương 4: Năng lượng & Động lượng',
        domainId: 'MECH',
        domainBadge: '[CƠ HỌC]',
        labs: [
          { id: 'sim-collisions', title: 'Thí Nghiệm Va Chạm Đàn Hồi & Va Chạm Mềm', description: 'Đo vận tốc trước và sau va chạm của 2 xe trượt.', engineType: 'PARAMETER_STUDIO', route: '/lab/dc-circuit' }
        ]
      },
      {
        id: 'g10-c5',
        title: 'Chương 5: Biến dạng cơ học & Định luật Hooke',
        domainId: 'MECH',
        domainBadge: '[CƠ HỌC]',
        labs: [
          { id: 'sim-hooke-law', title: 'Khảo Sát Lực Đàn Hồi Lò Xo - Định Luật Hooke', description: 'Móc quả cân vào lò xo, đo độ giãn delta L và vẽ đồ thị F-delta L.', engineType: 'DRAG_DROP', route: '/lab/spring-mass' }
        ]
      }
    ]
  },
  {
    grade: 11,
    label: 'Khối Lớp 11',
    badge: '[LỚP 11]',
    chapters: [
      {
        id: 'g11-c1',
        title: 'Chương 1: Dao động điều hòa',
        domainId: 'MECH',
        domainBadge: '[CƠ HỌC]',
        labs: [
          { id: 'sim-simple-pendulum', title: 'Con Lắc Đơn & Dao Động Điều Hòa', description: 'Khảo sát chu kỳ T = 2π√(l/g) của con lắc đơn.', engineType: 'PARAMETER_STUDIO', route: '/lab/simple-pendulum' },
          { id: 'sim-spring-pendulum', title: 'Con Lắc Lò Xo Nằm Ngang & Thẳng Đứng', description: 'Khảo sát tần số góc omega = sqrt(k/m) và bảo toàn cơ năng.', engineType: 'DRAG_DROP', route: '/lab/spring-mass' }
        ]
      },
      {
        id: 'g11-c2',
        title: 'Chương 2: Sóng & Giao thoa ánh sáng',
        domainId: 'WAVE_THERMO',
        domainBadge: '[SÓNG - NHIỆT]',
        labs: [
          { id: 'sim-sound-speed', title: 'Đo Tốc Độ Truyền Âm Trong Không Khí', description: 'Sử dụng ống cộng hưởng âm và âm thoa/máy phát tần số.', engineType: 'PARAMETER_STUDIO', route: '/lab/wave-interference' },
          { id: 'sim-young-interference', title: 'Đo Bước Sóng Ánh Sáng Giao Thoa Khe Young', description: 'Chiếu laser qua 2 khe hẹp, đo khoảng vân i để tính bước sóng lambda.', engineType: 'PARAMETER_STUDIO', route: '/lab/wave-interference' }
        ]
      },
      {
        id: 'g11-c3',
        title: 'Chương 3: Điện trường & Dòng điện DC',
        domainId: 'EM',
        domainBadge: '[ĐIỆN HỌC]',
        labs: [
          { id: 'sim-dc-circuit', title: 'Mạch Điện Đơn Giản & Định Luật Ohm', description: 'Lắp mạch Pin, Điện trở, Ampe kế, Vôn kế đo I và U.', engineType: 'DRAG_DROP', route: '/lab/dc-circuit' },
          { id: 'sim-emf-internal-r', title: 'Đo Suất Điện Động E & Điện Trở Trong r', description: 'Khảo sát đồ thị U-I của nguồn pin bằng biến trở con chạy.', engineType: 'DRAG_DROP', route: '/lab/emf-internal-r' }
        ]
      },
      {
        id: 'g11-c4',
        title: 'Chương 4: Khúc xạ ánh sáng & Thấu kính',
        domainId: 'OPTICS',
        domainBadge: '[QUANG HỌC]',
        labs: [
          { id: 'sim-refraction', title: 'Khúc Xạ Ánh Sáng & Thấu Kính Hội Tụ', description: 'Chiếu tia sáng qua khối bán trụ, xác định góc khúc xạ và chiết suất n.', engineType: 'PARAMETER_STUDIO', route: '/lab/refraction' }
        ]
      }
    ]
  },
  {
    grade: 12,
    label: 'Khối Lớp 12',
    badge: '[LỚP 12]',
    chapters: [
      {
        id: 'g12-c1',
        title: 'Chương 1: Vật lý nhiệt',
        domainId: 'WAVE_THERMO',
        domainBadge: '[SÓNG - NHIỆT]',
        labs: [
          { id: 'sim-specific-heat', title: 'Đo Nhiệt Dung Riêng c Của Nước', description: 'Đo công suất Q = P*t và độ tăng nhiệt độ delta T để xác định c.', engineType: 'PARAMETER_STUDIO', route: '/lab/wave-interference' },
          { id: 'sim-latent-heat', title: 'Đo Nhiệt Hóa Hơi Riêng Của Nước', description: 'Đo lượng nước hóa hơi m theo thời gian đun sôi t.', engineType: 'PARAMETER_STUDIO', route: '/lab/wave-interference' }
        ]
      },
      {
        id: 'g12-c2',
        title: 'Chương 2: Khí lý tưởng',
        domainId: 'WAVE_THERMO',
        domainBadge: '[SÓNG - NHIỆT]',
        labs: [
          { id: 'sim-boyle-law', title: 'Khảo Sát Định Luật Boyle (P*V = const)', description: 'Nén xilanh khí, đo áp suất P và thể tích V ở nhiệt độ không đổi.', engineType: 'PARAMETER_STUDIO', route: '/lab/wave-interference' }
        ]
      },
      {
        id: 'g12-c3',
        title: 'Chương 3: Từ trường & Dòng điện xoay chiều AC',
        domainId: 'EM',
        domainBadge: '[ĐIỆN HỌC]',
        labs: [
          { id: 'sim-magnetic-force', title: 'Khảo Sát Lực Từ Tác Dụng Lên Đoạn Dây Dẫn', description: 'Đo lực F tác dụng lên dây dẫn trong từ trường của nam châm U.', engineType: 'DRAG_DROP', route: '/lab/emf-internal-r' }
        ]
      },
      {
        id: 'g12-c4',
        title: 'Chương 4: Vật lý hạt nhân & Bức xạ',
        domainId: 'OPTICS',
        domainBadge: '[QUANG HỌC]',
        labs: [
          { id: 'sim-photoelectric', title: 'Mô Phỏng Hiện Tượng Quang Điện Ngoài', description: 'Chiếu bức xạ đơn sắc vào tế bào quang điện, đo hiệu điện thế hãm Uh.', engineType: 'PARAMETER_STUDIO', route: '/lab/refraction' },
          { id: 'sim-radioactive-decay', title: 'Khảo Sát Đồ Thị Phân Rã Hạt Nhân', description: 'Khảo sát số hạt nhân N(t) giảm theo thời gian bán rã T.', engineType: 'PARAMETER_STUDIO', route: '/lab/refraction' }
        ]
      }
    ]
  }
];
