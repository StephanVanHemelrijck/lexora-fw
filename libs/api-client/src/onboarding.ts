import { mapOnboardingSummary, OnboardingSummary } from '@lexora/types';
import { api } from './api.ts';
import { AxiosError } from 'axios';

export const onboarding = {
  save: async (payload: OnboardingSummary): Promise<string | undefined> => {
    try {
      const data = mapOnboardingSummary(payload);
      const res = await api.post('/auth/onboarding', data);
      console.log('res:', res.data);
      return 'saving';
    } catch (e) {
      const err = e as AxiosError;
      console.log('❌ Axios Error:', err.response?.data || err.message);
      throw err;
    }
  },
};
