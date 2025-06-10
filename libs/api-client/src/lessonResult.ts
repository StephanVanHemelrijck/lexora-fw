import { LessonResult } from '@lexora/types';
import { apiClient } from './api.ts';

export const lessonResult = {
  ensureCreated: async (
    token: string,
    lessonId: string
  ): Promise<LessonResult> => {
    try {
      const res = await apiClient.post(
        '/lesson-result/ensure-created',
        {
          lessonId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  markAsComplete: async (token: string, lessonId: string) => {
    try {
      const res = await apiClient.post(
        '/lesson-result/mark-as-complete',
        {
          lessonId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  getByLessonId: async (token: string, lessonId: string) => {
    try {
      const res = await apiClient.get<LessonResult>(
        `/lesson-result/get-by-lesson-id/${lessonId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};
