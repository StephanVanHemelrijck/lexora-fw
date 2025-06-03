import { StartingOptions } from './onboarding';

export interface LanguageJourney {
  id: string;
  uid: string;
  languageId: string;
  learningReasons: string[];
  startingOption: StartingOptions;
  placementLevel: string | null;
  lastActivity: null;
  createdAt: Date;
  updatedAt: Date;
}
