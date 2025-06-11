import { Language } from './language';
import { StartingOptions } from './onboarding';

export interface LanguageJourney {
  id: string;
  uid: string;
  languageId: string;
  language: Language;
  learningReasons: string[];
  startingOption: StartingOptions;
  placementLevel: string | null;
  lastActivity: null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLanguageJourneyDto {
  languageId: string;
  learningReasons: string[];
  startingOption: StartingOptions;
}
