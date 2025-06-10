import { AxiosError } from 'axios';
import { apiClient } from './api.ts';
import { ExerciseResult } from '@lexora/types';

export const exerciseResult = {
  save: async (token: string, payload: ExerciseResult): Promise<any> => {
    try {
      const res = await apiClient.post('/exercise-result/save', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (e) {
      const err = e as AxiosError;
      console.log('❌ Axios Error:', err.response?.data || err.message);
      throw err;
    }
  },
};
