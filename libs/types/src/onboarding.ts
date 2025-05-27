import { Language } from './language';

export interface OnboardingSummary {
  displayName: string;
  email: string;
  password: string;
  selectedLanguage: Language | null;
  learningReasons: string[];
  routineMinutes: number;
  startingOption: 'scratch' | 'placement' | null;
}

export interface SaveOnboardingPayload {
  displayName: string;
  email: string;
  password: string;
  selectedLanguageId: string;
  learningReasons: string[];
  routineMinutes: number;
  startingOption: 'scratch' | 'placement' | null;
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
