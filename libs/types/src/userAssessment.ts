import { Assessment } from './assessment';

export interface UserAssessment {
  id: string;
  userId: string;
  assessmentId: string;
  score: number;
  level: string;
  status: string;
  completedAt: Date | null;
  createdAt: Date;
  assessment: Assessment;
}

export interface SubmitAssessmentDto {
  uid: string;
  assessmentId: string;
  answers: AnswerItem[];
}

export type AnswerItem = SimpleAnswer | ReadingAnswer;

export interface SimpleAnswer {
  originalIndex: number;
  answer: string;
}

export interface ReadingAnswer {
  originalIndex: number;
  answers: Record<number, string>;
}
