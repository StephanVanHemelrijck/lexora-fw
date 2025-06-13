export type AssessmentQuestion =
  | {
      type: 'grammar_multiple_choice' | 'vocabulary_multiple_choice';
      question: string;
      options: string[];
      correct_answer: string;
    }
  | {
      type: 'reading_comprehension';
      paragraph: string;
      question: string;
      options: string[];
      correct_answer: string;
    }
  | {
      type: 'listening_comprehension';
      text_prompt: string;
      question: string;
      options: string[];
      correct_answer: string;
    }
  | {
      type: 'speaking_repetition';
      prompt: string;
    };

export type AssessmentJson = AssessmentQuestion[];
