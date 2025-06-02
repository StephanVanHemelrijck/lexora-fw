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
