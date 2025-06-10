import { ExerciseResult } from './exercise';

export interface LessonResult {
  id: string;
  userId: string;
  lessonId: string;
  startedAt: string; // ISO string
  completedAt?: string | null;
  exercises: ExerciseResult[];
}
