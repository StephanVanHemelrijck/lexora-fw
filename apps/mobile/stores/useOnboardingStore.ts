import { create } from 'zustand';
import { Language, OnboardingSummary, StartingOptions } from '@lexora/types'; // or wherever you define your language model

interface OnboardingState {
  // Step tracking
  step: number;
  totalSteps: number;
  started: boolean;
  completed: boolean;

  setStep: (step: number) => void;
  setStarted: (started: boolean) => void;
  setTotalSteps: (steps: number) => void;
  setCompleted: (completed: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetSteps: () => void;

  // Account info
  displayName: string;
  email: string;
  password: string;
  setAccountInfo: (info: {
    displayName: string;
    email: string;
    password: string;
  }) => void;

  // Language selection
  selectedLanguage: Language | null;
  setLanguage: (language: Language) => void;

  // Learning reasons
  learningReasons: string[];
  toggleLearningReason: (reasons: string[]) => void;

  // Routine
  routineMinutes: number;
  setRoutineMinutes: (minutes: number) => void;

  // Starting point
  startingOption: StartingOptions | null;
  setStartingOption: (option: StartingOptions | null) => void;

  // Reset all
  resetAll: () => void;

  getOnboardingSummary: () => OnboardingSummary;
}

export const useOnboardingStore = create<OnboardingState>()((set, get) => ({
  // Navigation
  step: 0,
  totalSteps: 0,
  started: false,
  completed: false,
  setStep: (step) => set({ step }),
  setStarted: (started) => set({ started }),
  setTotalSteps: (steps) => set({ totalSteps: steps }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(0, state.step - 1) })),
  resetSteps: () => set({ step: 0 }),

  // Account
  displayName: '',
  email: '',
  password: '',
  setAccountInfo: ({ displayName, email, password }) =>
    set({ displayName, email, password }),

  // Language
  selectedLanguage: null,
  setLanguage: (language) => set({ selectedLanguage: language }),

  // Completed
  setCompleted: (completed) => set({ completed }),

  // Reasons
  learningReasons: [],
  toggleLearningReason: (reasons) => set({ learningReasons: reasons }),

  // Routine
  routineMinutes: 0,
  setRoutineMinutes: (minutes) => set({ routineMinutes: minutes }),

  // Placement
  startingOption: null,
  setStartingOption: (option) => set({ startingOption: option }),

  // Reset all onboarding state
  resetAll: () =>
    set({
      step: 0,
      started: false,
      displayName: '',
      email: '',
      password: '',
      selectedLanguage: null,
      learningReasons: [],
      routineMinutes: 0,
      startingOption: null,
    }),

  getOnboardingSummary: () => {
    const {
      displayName,
      email,
      password,
      selectedLanguage,
      learningReasons,
      routineMinutes,
      startingOption,
    } = get();

    return {
      displayName,
      email,
      password,
      selectedLanguage,
      learningReasons,
      routineMinutes,
      startingOption,
    };
  },
}));
