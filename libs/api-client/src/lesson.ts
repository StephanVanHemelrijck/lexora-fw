import { Lesson } from '@lexora/types';
import { apiClient } from './api.ts';

export const lesson = {
  getUpcomingLessonForUser: async (token: string) => {
    try {
      const res = await apiClient.get<Lesson[]>(`/lesson/upcoming/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};
