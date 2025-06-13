import {
  mapOnboardingSummary,
  OnboardingSummary,
  SaveOnboardingResponse,
} from '@lexora/types';
import { apiClient } from './api.ts';
import { AxiosError } from 'axios';

export const onboarding = {
  save: async (payload: OnboardingSummary): Promise<SaveOnboardingResponse> => {
    try {
      const data = mapOnboardingSummary(payload);
      const res = await apiClient.post('/auth/onboarding', data);
      return res.data;
    } catch (e) {
      const err = e as AxiosError;
      console.log('❌ Axios Error:', err.response?.data || err.message);
      throw err;
    }
  },
};
