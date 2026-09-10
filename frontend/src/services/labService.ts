import axios from 'axios';

const API_URL = 'http://localhost:8080/api/labs';

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
  getFeaturedLabs: async (): Promise<PublicLabItem[]> => {
    try {
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy featured labs:', error);
      return [];
    }
  },

  getAllLabs: async (filters?: any): Promise<PublicLabItem[]> => {
    try {
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách labs:', error);
      return [];
    }
  },
};
