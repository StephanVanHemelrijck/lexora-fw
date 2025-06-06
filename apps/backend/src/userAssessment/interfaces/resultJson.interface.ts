export interface GradedEntry {
  index: number;
  type:
    | 'vocabulary_multiple_choice'
    | 'grammar_multiple_choice'
    | 'fill_in_the_blank'
    | 'reading_comprehension'
    | 'writing_prompt';
  correct: boolean;
}

export interface AssessmentResult {
  graded: {
    index: number;
    type: string;
    correct?: boolean;
    difficulty?: string;
  }[];
  level: string;
  skills?: Record<
    'grammar' | 'vocabulary' | 'reading' | 'listening' | 'speaking',
    number
  >;
  feedback?: Record<string, string>;
}
