import { LanguageJourney } from './language';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  accessToken: string;
  languageJourney?: LanguageJourney;
}
