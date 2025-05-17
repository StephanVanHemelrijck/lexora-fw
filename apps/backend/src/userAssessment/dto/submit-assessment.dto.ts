export interface AnswerItem {
  originalIndex: number;
  answer: Answer;
}

export interface Answer {
  answer: string | Record<number, string>;
}

export class SubmitAssessmentDto {
  assessmentId: string;
  uid: string;
  answers: AnswerItem[];
}
