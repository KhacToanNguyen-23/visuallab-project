import { getLabRoute } from '../utils/labRoutes';
import { API_BASE_URL } from '../config/api';

const API_URL = API_BASE_URL;

export interface PublicLabItem {
  id: string;
  title: string;
  subject: string;
  domain?: string;
  grade?: string;
  difficulty?: string;
  chapter?: string;
  description: string;
  tags: string[];
  thumbnail?: string;
  route: string;
}

export const DEFAULT_PUBLIC_LABS: PublicLabItem[] = [
  // LỚP 10
  {
    id: 'sim-speed-measurement',
    title: 'Bài 6: Đo Tốc Độ Vật Chuyển Động Thẳng',
    subject: 'Vật lý',
    domain: 'Cơ Học & Năng Lượng',
    grade: 'Lớp 10',
    difficulty: 'EASY',
    chapter: 'Chương 2: Động Học',
    description: 'Trang 28 SGK. Đo thời gian bi thép qua 2 cổng quang điện trên máng nghiêng để tính tốc độ v.',
    tags: ['GDPT 2018', 'SGK T28', 'Kéo thả', 'Cổng quang điện'],
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60',
    route: '/lab/speed-measurement',
  },
  {
    id: 'sim-free-fall',
    title: 'Bài 14: Đo Gia Tốc Rơi Tự Do g',
    subject: 'Vật lý',
    domain: 'Cơ Học & Năng Lượng',
    grade: 'Lớp 10',
    difficulty: 'MEDIUM',
    chapter: 'Chương 3: Động Lực Học',
    description: 'Trang 57 SGK. Nam châm điện ngắt điện thả bi thép rơi qua cổng quang điện, tự động tính gia tốc g.',
    tags: ['GDPT 2018', 'SGK T57', 'Kéo thả', 'Rơi tự do'],
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60',
    route: '/lab/free-fall',
  },
  {
    id: 'sim-friction-coefficient',
    title: 'Bài 21: Đo Hệ Số Ma Sát Trượt',
    subject: 'Vật lý',
    domain: 'Cơ Học & Năng Lượng',
    grade: 'Lớp 10',
    difficulty: 'MEDIUM',
    chapter: 'Chương 4: Năng Lượng & Ma Sát',
    description: 'Trang 83 SGK. Dùng lực kế kéo khối gỗ gắn quả cân trượt đều trên mặt bàn để đo hệ số ma sát mu.',
    tags: ['GDPT 2018', 'SGK T83', 'Kéo thả', 'Lực kế'],
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60',
    route: '/lab/sliding-friction',
  },
  {
    id: 'sim-momentum-collision',
    title: 'Bài 30: Khảo Sát Động Lượng & Va Chạm',
    subject: 'Vật lý',
    domain: 'Cơ Học & Năng Lượng',
    grade: 'Lớp 10',
    difficulty: 'HARD',
    chapter: 'Chương 5: Động Lượng & Va Chạm',
    description: 'Trang 117 SGK. Mô phỏng va chạm 2 xe trượt trên đệm không khí, kiểm chứng định luật bảo toàn động lượng.',
    tags: ['GDPT 2018', 'SGK T117', 'Tham số', 'Va chạm'],
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60',
    route: '/lab/momentum-collision',
  },
  {
    id: 'sim-hooke-law',
    title: 'Bài 38: Độ Giãn Lò Xo (Định Luật Hooke)',
    subject: 'Vật lý',
    domain: 'Cơ Học & Năng Lượng',
    grade: 'Lớp 10',
    difficulty: 'EASY',
    chapter: 'Chương 6: Biến Dạng Lò Xo',
    description: 'Trang 148 SGK. Treo quả cân lên lò xo xoắn, đo độ giãn delta L và tính độ cứng k.',
    tags: ['GDPT 2018', 'SGK T148', 'Kéo thả', 'Hooke'],
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=500&auto=format&fit=crop&q=60',
    route: '/lab/spring-mass',
  },

  // LỚP 11
  {
    id: 'sim-sound-resonance',
    title: 'Bài 5: Đo Tốc Độ Truyền Âm (Ống Cộng Hưởng)',
    subject: 'Vật lý',
    domain: 'Sóng & Âm Học',
    grade: 'Lớp 11',
    difficulty: 'MEDIUM',
    chapter: 'Chương 2: Sóng Âm',
    description: 'Trang 22 SGK. Mô phỏng 3D ống thủy tinh cộng hưởng âm thanh, nâng hạ cột nước & loa Tone.js để đo v.',
    tags: ['GDPT 2018', 'SGK T22', 'Three.js', 'Tone.js'],
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60',
    route: '/lab/sound-resonance',
  },
  {
    id: 'sim-simple-pendulum',
    title: 'Bài 7: Khảo Sát Dao Động Con Lắc Đơn',
    subject: 'Vật lý',
    domain: 'Cơ Học & Năng Lượng',
    grade: 'Lớp 11',
    difficulty: 'EASY',
    chapter: 'Chương 1: Dao Động Cơ',
    description: 'Trang 29 SGK. Khảo sát chu kỳ T = 2pi*sqrt(l/g) của con lắc đơn theo chiều dài l.',
    tags: ['GDPT 2018', 'SGK T29', 'Tham số', 'PhET'],
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60',
    route: '/lab/simple-pendulum',
  },
  {
    id: 'sim-young-interference',
    title: 'Bài 12: Đo Bước Sóng Ánh Sáng (Khe Y-âng)',
    subject: 'Vật lý',
    domain: 'Quang Học',
    grade: 'Lớp 11',
    difficulty: 'HARD',
    chapter: 'Chương 3: Quang Học Sóng',
    description: 'Trang 50 SGK. Chiếu laser qua khe kép Y-âng, dùng thước kẹp đo khoảng vân i để tính bước sóng lambda.',
    tags: ['GDPT 2018', 'SGK T50', 'Kéo thả', 'Giao thoa'],
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60',
    route: '/lab/wave-interference',
  },
  {
    id: 'sim-emf-internal-r',
    title: 'Bài 19: Đo Suất Điện Động E & Điện Trở Trong r',
    subject: 'Vật lý',
    domain: 'Điện & Từ Học',
    grade: 'Lớp 11',
    difficulty: 'MEDIUM',
    chapter: 'Chương 2: Dòng Điện Không Đổi',
    description: 'Trang 76 SGK. Khảo sát đồ thị U-I của nguồn Pin DC bằng biến trở con chạy và công tắc.',
    tags: ['GDPT 2018', 'SGK T76', 'Kéo thả', 'Nguồn pin'],
    thumbnail: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=500&auto=format&fit=crop&q=60',
    route: '/lab/emf-internal-r',
  },
  {
    id: 'sim-refraction',
    title: 'Bài 21: Đo Chiết Suất Của Nước & Khúc Xạ',
    subject: 'Vật lý',
    domain: 'Quang Học',
    grade: 'Lớp 11',
    difficulty: 'MEDIUM',
    chapter: 'Chương 3: Quang Học',
    description: 'Trang 85 SGK. Chiếu tia laser qua bán trụ thủy tinh / nước để xác định góc khúc xạ r và chiết suất n.',
    tags: ['GDPT 2018', 'SGK T85', 'Tham số', 'Khúc xạ'],
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60',
    route: '/lab/refraction',
  },
  {
    id: 'sim-specific-heat',
    title: 'Bài 3: Đo Nhiệt Dung Riêng Của Nước',
    subject: 'Vật lý',
    domain: 'Nhiệt Học',
    grade: 'Lớp 12',
    difficulty: 'MEDIUM',
    chapter: 'Chương 1: Vật Lý Nhiệt',
    description: 'Trang 15 SGK. Dùng dây điện trở đun nước trong bình nhiệt lượng kế, đo công suất P và nhiệt độ T.',
    tags: ['GDPT 2018', 'SGK T15', 'Tham số', 'Nhiệt học'],
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=500&auto=format&fit=crop&q=60',
    route: '/lab/specific-heat',
  },
  {
    id: 'sim-latent-heat',
    title: 'Bài 4: Đo Nhiệt Nóng Chảy Nước Đá',
    subject: 'Vật lý',
    domain: 'Nhiệt Học',
    grade: 'Lớp 12',
    difficulty: 'MEDIUM',
    chapter: 'Chương 1: Vật Lý Nhiệt',
    description: 'Trang 19 SGK. Khảo sát quá trình nóng chảy của nước đá bằng bình nhiệt lượng kế và nhiệt kế điện tử.',
    tags: ['GDPT 2018', 'SGK T19', 'Tham số', 'Nước đá'],
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=500&auto=format&fit=crop&q=60',
    route: '/lab/latent-heat',
  },
  {
    id: 'sim-boyle-mariotte',
    title: 'Bài 7: Quá Trình Đẳng Nhiệt (Boyle - Mariotte)',
    subject: 'Vật lý',
    domain: 'Nhiệt Học',
    grade: 'Lớp 12',
    difficulty: 'HARD',
    chapter: 'Chương 2: Khí Lý Tưởng',
    description: 'Trang 30 SGK. Nén piston trong xy-lanh nén khí và đọc áp kế để kiểm chứng p*V = const.',
    tags: ['GDPT 2018', 'SGK T30', 'Tham số', 'Đẳng nhiệt'],
    thumbnail: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=500&auto=format&fit=crop&q=60',
    route: '/lab/boyle-mariotte',
  },
  {
    id: 'sim-electromagnetic-induction',
    title: 'Bài 12: Khảo Sát Cảm Ứng Điện Từ',
    subject: 'Vật lý',
    domain: 'Điện & Từ Học',
    grade: 'Lớp 12',
    difficulty: 'MEDIUM',
    chapter: 'Chương 3: Từ Trường',
    description: 'Trang 52 SGK. Di chuyển nam châm vĩnh cửu qua cuộn dây cảm ứng để quan sát kim điện kế G lệch.',
    tags: ['GDPT 2018', 'SGK T52', 'Kéo thả', 'Cảm ứng từ'],
    thumbnail: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=500&auto=format&fit=crop&q=60',
    route: '/lab/induction',
  },
  {
    id: 'workbench-universal',
    title: 'Bàn Thí Nghiệm Tự Do (Universal Physics Sandbox)',
    subject: 'Vật lý',
    domain: 'Cơ - Điện - Quang',
    grade: 'Lớp 10 - 12',
    difficulty: 'HARD',
    chapter: 'Sandbox Sáng Tạo',
    description: 'Tự do chọn và ghép nối các linh kiện PhET SceneryStack thuộc 3 môn Cơ - Điện - Quang.',
    tags: ['Sandbox', 'PhET', 'Sáng tạo'],
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60',
    route: '/workbench/universal',
  },
];

export const labService = {
  // Lấy danh sách lab nổi bật cho Landing Page
  getFeaturedLabs: async (): Promise<PublicLabItem[]> => {
    try {
      const response = await fetch(`${API_URL}/labs`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((item: any) => ({
            id: item.id,
            title: item.title,
            subject: item.subject || 'Vật lý',
            domain: item.domain,
            grade: item.grade,
            difficulty: item.difficulty,
            chapter: item.chapter || 'Vật Lý GDPT 2018',
            description: item.description,
            tags: item.tags ? (typeof item.tags === 'string' ? item.tags.split(',') : item.tags) : [],
            thumbnail: item.thumbnailUrl || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60',
            route: getLabRoute(item.id, item.title, item.route),
          }));
        }
      }
      return DEFAULT_PUBLIC_LABS.slice(0, 3);
    } catch (error) {
      console.warn('Backend API unavailable, using default lab data:', error);
      return DEFAULT_PUBLIC_LABS.slice(0, 3);
    }
  },

  // Lấy toàn bộ lab cho trang Thư Viện (Catalog)
  getAllLabs: async (_filters?: any): Promise<PublicLabItem[]> => {
    try {
      const response = await fetch(`${API_URL}/labs`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const apiLabs = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            subject: item.subject || 'Vật lý',
            domain: item.domain,
            grade: item.grade,
            difficulty: item.difficulty,
            chapter: item.chapter || 'Vật Lý GDPT 2018',
            description: item.description,
            tags: item.tags ? (typeof item.tags === 'string' ? item.tags.split(',') : item.tags) : [],
            thumbnail: item.thumbnailUrl || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60',
            route: getLabRoute(item.id, item.title, item.route),
          }));

          // If backend DB returns fewer items than DEFAULT_PUBLIC_LABS, merge missing ones
          if (apiLabs.length < DEFAULT_PUBLIC_LABS.length) {
            const apiIds = new Set(apiLabs.map(l => l.id));
            const missing = DEFAULT_PUBLIC_LABS.filter(l => !apiIds.has(l.id));
            return [...apiLabs, ...missing];
          }

          return apiLabs;
        }
      }
      return DEFAULT_PUBLIC_LABS;
    } catch (error) {
      console.warn('Backend API unavailable, using default public labs:', error);
      return DEFAULT_PUBLIC_LABS;
    }
  },
};
