export type ScenarioDifficulty = 'easy' | 'medium' | 'hard';

export type Scenario = {
  id: string;
  title: string;
  description: string;
  difficulty: ScenarioDifficulty;
  categories: string[];
  prompt: string;
  createdAt: string;
  updatedAt: string;
};

export type ConversationReply = {
  role: GptRoles;
  content: string;
};

export enum GptRoles {
  user = 'user',
  assistant = 'assistant',
  system = 'system',
}
