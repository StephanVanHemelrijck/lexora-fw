import { Language } from './language';
import { User } from './user';

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
  startingOption: StartingOptions | null;
}

export interface SaveOnboardingPayload {
  displayName: string;
  email: string;
  password: string;
  selectedLanguageId: string;
  learningReasons: string[];
  routineMinutes: number;
  startingOption: StartingOptions | null;
}

export interface SaveOnboardingResponse {
  message: string;
  user: User;
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
