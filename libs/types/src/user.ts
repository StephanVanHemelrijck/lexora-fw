import { LanguageJourney } from './languageJourney';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  accessToken: string;
  dailyMinutes: number;
  languageJourneys?: LanguageJourney[];
}
