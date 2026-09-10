export interface PublicLabItem {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  description: string;
  tags: string[];
  thumbnail?: string;
  route: string;
}

export const labService = {
  // Lấy danh sách lab nổi bật cho Landing Page
  getFeaturedLabs: async (): Promise<PublicLabItem[]> => {
    try {
      // Tạm thời chờ backend API
      // const response = await fetch(`${API_URL}/featured`);
      // return await response.json();
      return []; // Trả về mảng rỗng để không dùng mock data
    } catch (error) {
      console.error('Lỗi khi lấy featured labs:', error);
      return [];
    }
  },

  // Lấy toàn bộ lab cho trang Thư Viện (Catalog)
  getAllLabs: async (_filters?: any): Promise<PublicLabItem[]> => {
    try {
      // Tạm thời chờ backend API
      return []; // Trả về mảng rỗng để không dùng mock data
    } catch (error) {
      console.error('Lỗi khi lấy danh sách labs:', error);
      return [];
    }
  },
};
