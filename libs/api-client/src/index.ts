import { languages } from './language.ts';
import { languageJourney } from './languageJourney.ts';
import { lessonPlan } from './lessonPlan.ts';
import { onboarding } from './onboarding.ts';
import { tts } from './tts.ts';
import { user } from './user.ts';
import { userAssessment } from './userAssessment.ts';

export * from './api.ts';

export const api = {
  languages,
  onboarding,
  user,
  languageJourney,
  userAssessment,
  tts,
  lessonPlan,
};
