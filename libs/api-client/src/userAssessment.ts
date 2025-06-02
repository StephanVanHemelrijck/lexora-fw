import { UserAssessment } from '@lexora/types';
import { api } from './api.ts';

export const userAssessment = {
  getActiveOrCreate: async (token: string, languageId: string) => {
    try {
      const res = await api.get<UserAssessment>(
        `/user-assessment/active-or-create/${languageId}`,
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
