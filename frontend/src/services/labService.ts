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
  {
    id: 'sim-dc-circuit',
    title: 'Mạch Điện Đơn Giản & Định Luật Ohm',
    subject: 'Vật lý',
    domain: 'Điện & Từ Học',
    grade: 'Lớp 11',
    difficulty: 'EASY',
    chapter: 'Chương 2: Dòng Điện Không Đổi',
    description: 'Mô phỏng lắp mạch Pin, Điện trở, Ampe kế, Vôn kế. Ghi nhận dòng điện & hiệu điện thế.',
    tags: ['GDPT 2018', 'Canvas', 'Điện học'],
    thumbnail: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=500&auto=format&fit=crop&q=60',
    route: '/lab/dc-circuit',
  },
  {
    id: 'sim-emf-internal-r',
    title: 'Đo Suất Điện Động E & Điện Trở Trong r',
    subject: 'Vật lý',
    domain: 'Điện & Từ Học',
    grade: 'Lớp 11',
    difficulty: 'MEDIUM',
    chapter: 'Chương 2: Dòng Điện Không Đổi',
    description: 'Khảo sát đồ thị U-I của nguồn pin bằng biến trở con chạy.',
    tags: ['GDPT 2018', 'Nguồn pin', 'Biến trở'],
    thumbnail: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=500&auto=format&fit=crop&q=60',
    route: '/lab/emf-internal-r',
  },
  {
    id: 'sim-speed-measurement',
    title: 'Đo Tốc Độ Của Vật Chuyển Động (3D)',
    subject: 'Vật lý',
    domain: 'Cơ Học & Động Học',
    grade: 'Lớp 10',
    difficulty: 'EASY',
    chapter: 'Chương 2: Động Học',
    description: 'Mô phỏng 3D máng nghiêng và 2 cổng quang điện đo tốc độ trung bình và tốc độ tức thời theo SGK GDPT 2018.',
    tags: ['GDPT 2018', '3D WebGL', 'Three.js', 'Máng nghiêng', 'Cổng quang'],
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60',
    route: '/lab/speed-measurement',
  },
  {
    id: 'sim-free-fall',
    title: 'Đo Gia Tốc Rơi Tự Do g',
    subject: 'Vật lý',
    domain: 'Cơ Học & Năng Lượng',
    grade: 'Lớp 10',
    difficulty: 'MEDIUM',
    chapter: 'Chương 1: Động Học Cát Thể',
    description: 'Bi sắt rơi qua cổng quang điện, đo thời gian t và tự động tính gia tốc g.',
    tags: ['GDPT 2018', 'Cổng quang điện', 'PDF Report'],
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60',
    route: '/lab/free-fall',
  },
  {
    id: 'sim-simple-pendulum',
    title: 'Con Lắc Đơn & Dao Động Điều Hòa',
    subject: 'Vật lý',
    domain: 'Cơ Học & Năng Lượng',
    grade: 'Lớp 11',
    difficulty: 'EASY',
    chapter: 'Chương 1: Dao Động',
    description: 'Khảo sát chu kỳ dao động T = 2pi*sqrt(l/g) của con lắc đơn.',
    tags: ['GDPT 2018', 'Con lắc đơn', 'PhET'],
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60',
    route: '/lab/simple-pendulum',
  },
  {
    id: 'sim-spring-mass',
    title: 'Khảo Sát Con Lắc Lò Xo',
    subject: 'Vật lý',
    domain: 'Cơ Học & Năng Lượng',
    grade: 'Lớp 12',
    difficulty: 'MEDIUM',
    chapter: 'Chương 1: Dao Động Cơ',
    description: 'Khảo sát định luật Hooke và dao động điều hòa của con lắc lò xo.',
    tags: ['GDPT 2018', 'Lò xo', 'Hooke'],
    thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=500&auto=format&fit=crop&q=60',
    route: '/lab/spring-mass',
  },
  {
    id: 'sim-refraction',
    title: 'Khúc Xạ Ánh Sáng & Thấu Kính Hội Tụ',
    subject: 'Vật lý',
    domain: 'Quang Học',
    grade: 'Lớp 11',
    difficulty: 'HARD',
    chapter: 'Chương 3: Quang Học',
    description: 'Chiếu laser qua môi trường chiết suất n1, n2 và xác định góc khúc xạ.',
    tags: ['GDPT 2018', 'Laser', 'Thấu kính'],
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60',
    route: '/lab/refraction',
  },
  {
    id: 'sim-sound-resonance',
    title: 'Đo Tốc Độ Truyền Âm (Cộng Hưởng Âm Thanh)',
    subject: 'Vật lý',
    domain: 'Sóng & Âm Học',
    grade: 'Lớp 11',
    difficulty: 'MEDIUM',
    chapter: 'Chương 2: Sóng Âm',
    description: 'Mô phỏng 3D ống thủy tinh cộng hưởng âm thanh, điều chỉnh cột nước và loa tần số Tone.js để đo tốc độ truyền âm v.',
    tags: ['GDPT 2018', 'Three.js', 'Tone.js', 'Âm học'],
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60',
    route: '/lab/sound-resonance',
  },
  {
    id: 'workbench-universal',
    title: 'Bàn Thí Nghiệm Tự Do (Universal Physics Sandbox)',
    subject: 'Vật lý',
    domain: 'Cơ Học',
    grade: 'Lớp 12',
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

          const apiLabIds = new Set(apiLabs.map((l: any) => l.id));
          const missingDefaults = DEFAULT_PUBLIC_LABS.filter(d => !apiLabIds.has(d.id));
          return [...apiLabs, ...missingDefaults];
        }
      }
      return DEFAULT_PUBLIC_LABS;
    } catch (error) {
      console.warn('Backend API unavailable, using default public labs:', error);
      return DEFAULT_PUBLIC_LABS;
    }
  },
};
