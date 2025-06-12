import { apiClient } from './index.ts';

// api-client/src/scenario.ts
export const scenario = {
  getAll: async (token: string) => {
    try {
      const res = await apiClient.get('/ai-scenario', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error('Error fetching scenarios: ', err);
      throw err;
    }
  },

  getRecommended: async (token: string, reasons: string[]) => {
    try {
      const res = await apiClient.post('/ai-scenario/recommended', reasons, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (err) {
      console.error('Error fetching recommended scenarios: ', err);
      throw err;
    }
  },
};
