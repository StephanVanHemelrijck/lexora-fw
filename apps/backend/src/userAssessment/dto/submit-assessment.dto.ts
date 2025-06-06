export type SimpleAnswer = {
  originalIndex: number;
  answer: string;
};

export type ReadingAnswer = {
  originalIndex: number;
  answers: Record<number, string>;
};

export type Answer = SimpleAnswer | ReadingAnswer;

export interface SubmitAssessmentDto {
  assessmentId: string;
  answers: Answer[];
}
