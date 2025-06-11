import { CreateLanguageJourneyDto, LanguageJourney } from '@lexora/types';
import { apiClient } from './api.ts';

export const languageJourney = {
  findByLanguageId: async (token: string, languageId: string) => {
    try {
      console.log('[FROM LANGUAGE-JOURNEY-API] INSIDE findByLanguageId');

      const res = await apiClient.get<LanguageJourney>(
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

  create: async (
    token: string,
    payload: CreateLanguageJourneyDto
  ): Promise<LanguageJourney> => {
    try {
      const res = await apiClient.post('/language-journeys/create', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error('Error creating language journey: ', err);
      throw err;
    }
  },
};
