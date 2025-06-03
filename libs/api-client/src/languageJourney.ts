import { LanguageJourney } from '@lexora/types';
import { api } from './api.ts';

export const languageJourney = {
  findByLanguageId: async (token: string, languageId: string) => {
    try {
      const res = await api.get<LanguageJourney>(
        `/language-journeys/language/${languageId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      console.error('Error fetching language journeys: ', err);
      throw err;
    }
  },
};
