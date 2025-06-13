import { apiClient } from './api.ts';
import { Language } from '@lexora/types';

export const languages = {
  getSupportedLanguages: async () => {
    try {
      console.log('[FROM LANGUAGE-API] INSIDE getSupportedLanguages');

      const res = await apiClient.get<Language[]>('/languages/supported');
      return res.data;
    } catch (err) {
      console.error('Error fetching languages: ', err);
      throw err;
    }
  },
  getById: async (token: string, id: string) => {
    try {
      const res = await apiClient.get<Language>(`/languages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error('Error fetching languages: ', err);
      throw err;
    }
  },
};
