import { ExerciseStatus } from '@prisma/client';

export interface SaveExerciseResultDto {
  exerciseId: string;
  selectedAnswer?: string;
  isCorrect: boolean;
  status: ExerciseStatus;
  lessonResultId?: string;
}
