import { ConversationReply, Language } from '@lexora/types';
import { apiClient } from './index.ts';

export const gpt = {
  sendAiPracticeMessage: async (
    token: string,
    scenarioId: string,
    messages: { role: string; content: string }[],
    language: Language
  ) => {
    console.log(language);

    try {
      const res = await apiClient.post<ConversationReply>(
        '/ai-scenario/practice',
        { scenarioId, messages, language },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data;
    } catch (err) {
      console.error('AI Conversation Error:', err);
      throw err;
    }
  },
};
