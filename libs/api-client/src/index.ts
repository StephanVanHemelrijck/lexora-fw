import { exerciseResult } from './exerciseResult.ts';
import { gpt } from './gpt.ts';
import { languages } from './language.ts';
import { languageJourney } from './languageJourney.ts';
import { lesson } from './lesson.ts';
import { lessonPlan } from './lessonPlan.ts';
import { lessonResult } from './lessonResult.ts';
import { onboarding } from './onboarding.ts';
import { scenario } from './scenario.ts';
import { tts } from './tts.ts';
import { user } from './user.ts';
import { userAssessment } from './userAssessment.ts';
import { whisper } from './whisper.ts';

export * from './api.ts';

export const api = {
  languages,
  onboarding,
  user,
  languageJourney,
  userAssessment,
  tts,
  lessonPlan,
  lesson,
  whisper,
  exerciseResult,
  lessonResult,
  scenario,
  gpt,
};
