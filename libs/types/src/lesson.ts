import { ExerciseType } from './exercise';
import { LessonPlan } from './lessonPlan';

export type Lesson = {
  id: string;
  lessonPlanId: string;
  date: Date;
  isCompleted: boolean;
  estimatedMinutes: number;
  focus: string;
  lessonPlan: LessonPlan;
  exerciseTypes: ExerciseType[];
};
