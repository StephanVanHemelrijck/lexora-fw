import { Language } from '@lexora/types';
import { apiClient } from './api.ts';

export const whisper = {
  transcribe: async (form: any, token: string) => {
    try {
      const res = await apiClient.post('/whisper/transcribe', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // let Axios infer the boundary
        },
      });
      return res.data;
    } catch (err) {
      console.error('[API] Transcribe audio failed:', err);
      throw err;
    }
  },

  transcribeOnly: async (form: any, token: string) => {
    try {
      const res = await apiClient.post<{ transcription: string }>(
        '/whisper/transcribe-only',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // let Axios infer the boundary
          },
        }
      );
      return res.data;
    } catch (err) {
      console.error('[API] Transcribe audio failed:', err);
      throw err;
    }
  },
};
