import { LanguageJourney } from './languageJourney';
import { Lesson } from './lesson';

export type LessonPlan = {
  id: string;
  languageJourneyId: string;
  languageJourney: LanguageJourney;
  startDate: Date;
  endDate: Date;
  cefrLevel: string;
  isCompleted: boolean;
  lessons: Lesson[];
};
