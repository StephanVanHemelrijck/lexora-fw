interface QuestionResultBase {
  index: number;
  type: string;
  isCorrect: boolean | null;
  userAnswer: any;
}

interface MultipleChoiceResult extends QuestionResultBase {
  type: 'vocabulary_multiple_choice' | 'grammar_multiple_choice';
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string;
}

interface FillInTheBlankResult extends QuestionResultBase {
  type: 'fill_in_the_blank';
  sentence: string;
  correctAnswers: string[];
  userAnswer: string;
  hint?: string;
  expectedTranslation?: string;
}

interface ReadingComprehensionResult extends QuestionResultBase {
  type: 'reading_comprehension';
  paragraph: string;
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string;
}

interface WritingPromptResult extends QuestionResultBase {
  type: 'writing_prompt';
  prompt: string;
  expectedLength: string;
  userAnswer: string;
}

export type QuestionResult =
  | MultipleChoiceResult
  | FillInTheBlankResult
  | ReadingComprehensionResult
  | WritingPromptResult;

export interface AssessmentResult {
  score: number;
  total: number;
  level?: string;
  summary: QuestionResult[];
}
