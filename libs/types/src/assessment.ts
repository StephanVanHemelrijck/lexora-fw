export interface Assessment {
  id: string;
  language: string;
  questions: QuestionItem[];
}

export interface MultipleChoiceQuestionData {
  question: string;
  options: string[];
  correct_answer: string;
}

export interface ReadingComprehensionQuestionData {
  paragraph: string;
  question: string;
  options: string[];
  correct_answer: string;
}

export interface ListeningComprehensionQuestionData {
  text_prompt: string;
  question: string;
  options: string[];
  correct_answer: string;
}

export interface SpeakingRepetitionQuestionData {
  prompt: string;
}

export type QuestionItem =
  | {
      type: 'grammar_multiple_choice' | 'vocabulary_multiple_choice';
      question: string;
      options: string[];
      correct_answer: string;
      originalIndex: number;
    }
  | {
      type: 'reading_comprehension';
      paragraph: string;
      question: string;
      options: string[];
      correct_answer: string;
      originalIndex: number;
    }
  | {
      type: 'listening_comprehension';
      text_prompt: string;
      question: string;
      options: string[];
      correct_answer: string;
      originalIndex: number;
    }
  | {
      type: 'speaking_repetition';
      prompt: string;
      originalIndex: number;
    };
