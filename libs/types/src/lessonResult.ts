import { ExerciseResult } from './exercise';
import { Lesson } from './lesson';

export interface LessonResult {
  id: string;
  userId: string;
  lessonId: string;
  lesson: Lesson;
  startedAt: string; // ISO string
  completedAt?: string | null;
  exercises: ExerciseResult[];
}
