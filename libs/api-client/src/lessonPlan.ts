import { LessonPlan } from '@lexora/types';
import { apiClient } from './api.ts';

export const lessonPlan = {
  generateLessonPlan: async (
    token: string,
    languageJourneyId: string
  ): Promise<LessonPlan> => {
    try {
      const res = await apiClient.post(
        `/lesson-plan/generate/${languageJourneyId}`,
        {},
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
