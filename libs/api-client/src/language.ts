import { api } from './api.ts';
import { Language } from '@lexora/types';

export const languages = {
  getSupportedLanguages: async () => {
    const res = await api.get<Language[]>('/languages/supported');
    return res.data;
  },
};
