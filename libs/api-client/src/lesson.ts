import { Lesson } from '@lexora/types';
import { apiClient } from './api.ts';

export const lesson = {
  getLessonById: async (token: string, lessonId: string) => {
    try {
      const res = await apiClient.get<Lesson>(`/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
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
  getUpcomingLessonForJourney: async (
    token: string,
    languageJourneyId: string
  ) => {
    try {
      const res = await apiClient.get<Lesson>(
        `/lesson/upcoming/journey/${languageJourneyId}`,
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
