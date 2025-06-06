import { SubmitAssessmentDto, UserAssessment } from '@lexora/types';
import { apiClient } from './api.ts';

export const userAssessment = {
  getActiveOrCreate: async (token: string, languageId: string) => {
    try {
      const res = await apiClient.get<UserAssessment>(
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
  submit: async (token: string, formData: any) => {
    try {
      const res = await apiClient.post<UserAssessment>(
        `/user-assessment/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // let Axios infer the boundary
          },
        }
      );
      return res.data;
    } catch (err) {
      console.error('[API] Submit assessment failed:', err);
      throw err;
    }
  },
};
