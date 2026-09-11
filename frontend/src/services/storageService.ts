const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export interface StudentLabSnapshotItem {
  id: string;
  studentId: string;
  labId: string;
  labTitle: string;
  screenshotUrl: string;
  cloudinaryPublicId?: string;
  caption?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | string;
  score?: number;
  createdAt: string;
}

export interface UploadSnapshotPayload {
  studentId?: string;
  labId: string;
  labTitle: string;
  imageBase64: string;
  caption?: string;
  difficulty?: string;
  score?: number;
}

export const storageService = {
  uploadSnapshot: async (payload: UploadSnapshotPayload): Promise<StudentLabSnapshotItem> => {
    const response = await fetch(`${API_URL}/storage/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Không thể tải ảnh màn hình lên kho lưu trữ');
    }

    return await response.json();
  },

  getMySnapshots: async (studentId: string = 'u-student'): Promise<StudentLabSnapshotItem[]> => {
    const response = await fetch(`${API_URL}/storage/my-snapshots?studentId=${encodeURIComponent(studentId)}`);
    if (!response.ok) {
      return [];
    }
    return await response.json();
  },

  deleteSnapshot: async (id: string): Promise<boolean> => {
    const response = await fetch(`${API_URL}/storage/snapshots/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  },
};
