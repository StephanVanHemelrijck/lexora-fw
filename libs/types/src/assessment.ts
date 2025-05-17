export interface Assessment {
  id: string;
  language: string;
  questions: QuestionItem[];
}

export interface TestJson {
  test: {
    vocabulary_multiple_choice: MultipleChoiceQuestionData[];
    grammar_multiple_choice: MultipleChoiceQuestionData[];
    fill_in_the_blank: FillInTheBlankQuestionData[];
    writing_prompt: WritingPromptQuestionData;
    reading_comprehension: ReadingComprehensionQuestionData;
  };
}

export interface MultipleChoiceQuestionData {
  question: string;
  options: string[];
  correct_answer: string;
}

export interface WritingPromptQuestionData {
  prompt: string;
  expected_length: string;
}

export interface FillInTheBlankQuestionData {
  sentence: string;
  correct_answers: string[];
  hint?: string;
  expected_translation?: string;
}

export interface ReadingComprehensionQuestionData {
  paragraph: string;
  questions: MultipleChoiceQuestionData[];
}

export type QuestionItem =
  | {
      type: 'vocabulary_multiple_choice';
      data: MultipleChoiceQuestionData;
      originalIndex: number;
    }
  | {
      type: 'grammar_multiple_choice';
      data: MultipleChoiceQuestionData;
      originalIndex: number;
    }
  | {
      type: 'fill_in_the_blank';
      data: FillInTheBlankQuestionData;
      originalIndex: number;
    }
  | {
      type: 'writing_prompt';
      data: WritingPromptQuestionData;
      originalIndex: number;
    }
  | {
      type: 'reading_comprehension';
      data: ReadingComprehensionQuestionData;
      originalIndex: number;
    };
