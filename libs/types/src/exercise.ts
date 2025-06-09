export enum ExerciseType {
  grammar_multiple_choice = 'grammar_multiple_choice',
  vocabulary_multiple_choice = 'vocabulary_multiple_choice',
  reading_comprehension = 'reading_comprehension',
  listening_comprehension = 'listening_comprehension',
  speaking_repetition = 'speaking_repetition',
  text_ai_conversation = 'text_ai_conversation',
  voice_ai_conversation = 'voice_ai_conversation',
}

export type GrammarMultipleChoice = {
  type: 'grammar_multiple_choice';
  question: string;
  options: string[];
  correct_answer: string;
};

export type VocabularyMultipleChoice = {
  type: 'vocabulary_multiple_choice';
  question: string;
  options: string[];
  correct_answer: string;
};

export type ReadingComprehension = {
  type: 'reading_comprehension';
  paragraph: string;
  question: string;
  options: string[];
  correct_answer: string;
};

export type ListeningComprehension = {
  type: 'listening_comprehension';
  text_prompt: string;
  question: string;
  options: string[];
  correct_answer: string;
};

export type SpeakingRepetition = {
  type: 'speaking_repetition';
  prompt: string;
};

export type TextAiConversation = {
  type: 'text_ai_conversation';
  context: string;
  initial_prompt: string;
  aiPersona: string;
  goal: string;
};

export type VoiceAiConversation = {
  type: 'voice_ai_conversation';
  context: string;
  initial_prompt: string;
  aiPersona: string;
  goal: string;
};

export type ExerciseJson =
  | GrammarMultipleChoice
  | VocabularyMultipleChoice
  | ReadingComprehension
  | ListeningComprehension
  | SpeakingRepetition
  | TextAiConversation
  | VoiceAiConversation;

export type Exercise = {
  id: string;
  lessonId: string;
  type: ExerciseType;
  data: ExerciseJson;
  status: 'pending' | 'completed' | 'skipped'; // match your ExerciseStatus enum
  cefrLevel?: string;
  createdAt: string;
  updatedAt: string;
};
