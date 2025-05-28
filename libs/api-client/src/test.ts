import { api } from './api.ts';
import { AxiosError } from 'axios';

export const test = {
  me: async (token: string) => {
    try {
      const res = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      const err = e as AxiosError;
      console.log('❌ Axios Error:', err.response?.data || err.message);
      throw err;
    }
  },
};
