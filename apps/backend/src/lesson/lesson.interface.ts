export type ExerciseJson =
  | GrammarMultipleChoice
  | VocabularyMultipleChoice
  | ReadingComprehension
  | ListeningComprehension
  | SpeakingRepetition
  | TextAiConversation
  | VoiceAiConversation;

type GrammarMultipleChoice = {
  type: 'grammar_multiple_choice';
  question: string;
  options: string[];
  correct_answer: string;
};

type VocabularyMultipleChoice = {
  type: 'vocabulary_multiple_choice';
  question: string;
  options: string[];
  correct_answer: string;
};

type ReadingComprehension = {
  type: 'reading_comprehension';
  paragraph: string;
  question: string;
  options: string[];
  correct_answer: string;
};

type ListeningComprehension = {
  type: 'listening_comprehension';
  text_prompt: string;
  question: string;
  options: string[];
  correct_answer: string;
};

type SpeakingRepetition = {
  type: 'speaking_repetition';
  prompt: string;
};

type TextAiConversation = {
  type: 'text_ai_conversation';
  context: string;
  initial_prompt: string;
  aiPersona: string;
  goal: string;
};

type VoiceAiConversation = {
  type: 'voice_ai_conversation';
  context: string;
  initial_prompt: string;
  aiPersona: string;
  goal: string;
};
