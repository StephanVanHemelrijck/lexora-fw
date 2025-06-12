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
