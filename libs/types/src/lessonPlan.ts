import { Lesson } from './lesson';

export type LessonPlan = {
  id: string;
  languageJourneyId: string;
  startDate: Date;
  endDate: Date;
  cefrLevel: string;
  isCompleted: boolean;
  lessons: Lesson[];
};
