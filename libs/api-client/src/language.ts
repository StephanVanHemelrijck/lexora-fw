import { api } from './api.ts';
import { Language } from '@lexora/types';

export const languages = {
  getSupportedLanguages: async () => {
    try {
      const res = await api.get<Language[]>('/languages/supported');
      return res.data;
    } catch (err) {
      console.error('Error fetching languages: ', err);
      throw err;
    }
  },
};
