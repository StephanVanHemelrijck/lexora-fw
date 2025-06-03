import { SubmitAssessmentDto, UserAssessment } from '@lexora/types';
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
  submit: async (token: string, data: SubmitAssessmentDto) => {
    try {
      const res = await api.post<UserAssessment>(
        `/user-assessment/submit`,
        data,
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
