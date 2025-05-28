import { Language } from './language';

export enum StartingOptions {
  scratch = 'scratch',
  placement = 'placement',
}

export interface OnboardingSummary {
  displayName: string;
  email: string;
  password: string;
  selectedLanguage: Language | null;
  learningReasons: string[];
  routineMinutes: number;
  startingOption: StartingOptions;
}

export interface SaveOnboardingPayload {
  displayName: string;
  email: string;
  password: string;
  selectedLanguageId: string;
  learningReasons: string[];
  routineMinutes: number;
  startingOption: StartingOptions;
}

export interface SaveOnboardingResponse {
  message: string;
  token: string;
  user: {
    uid: string;
    nativeLanguageId: string;
  };
  languageJourney: {
    languageId: string;
    learningReasons: string[];
    routineMinutes: number;
    startingOption: StartingOptions;
  };
}

// map function
export function mapOnboardingSummary(
  summary: OnboardingSummary
): SaveOnboardingPayload {
  return {
    displayName: summary.displayName,
    email: summary.email,
    password: summary.password,
    selectedLanguageId: summary.selectedLanguage
      ? summary.selectedLanguage.id
      : '',
    learningReasons: summary.learningReasons,
    routineMinutes: summary.routineMinutes,
    startingOption: summary.startingOption,
  };
}
