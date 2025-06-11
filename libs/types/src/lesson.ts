import { Exercise, ExerciseType } from './exercise';
import { LessonPlan } from './lessonPlan';
import { LessonResult } from './lessonResult';

export type Lesson = {
  id: string;
  lessonPlanId: string;
  date: Date;
  isCompleted: boolean;
  estimatedMinutes: number;
  focus: string;
  lessonPlan: LessonPlan;
  exerciseTypes: ExerciseType[];
  exercises: Exercise[];
  lessonResult: LessonResult;
};
