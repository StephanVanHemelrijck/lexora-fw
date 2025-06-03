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
  graded: GradedEntry[];
  level: string;
  feedback: string;
}
