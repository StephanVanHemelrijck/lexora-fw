export interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  isEnabled: boolean;
  sortOrder: number;
  flagEmoji: string;
  rtl: boolean;
}

export interface LanguageJourney {
  languageId: string;
  learningReasons: string[];
  startingOption: string;
}
