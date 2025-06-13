import { apiClient } from './api.ts';

export const tts = {
  synthesizeSpeechToFile: async (
    text: string,
    langCode: string
  ): Promise<string> => {
    try {
      const res = await apiClient.get<{ audioUrl: string }>('/tts', {
        params: {
          text,
          lang: langCode,
        },
      });

      return res.data.audioUrl;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};
