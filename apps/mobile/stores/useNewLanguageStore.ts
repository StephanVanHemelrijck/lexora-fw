import { create } from 'zustand';
import { Language, StartingOptions } from '@lexora/types';

interface NewLanguageState {
  selectedLanguage?: Language;
  selectedReasons: string[];
  startingOption?: StartingOptions | null;

  setLanguage: (language: Language) => void;
  toggleReason: (reason: string) => void;
  setStartingOption: (option: StartingOptions | null) => void;
  reset: () => void;
}

export const useNewLanguageStore = create<NewLanguageState>((set) => ({
  selectedLanguage: undefined,
  selectedReasons: [],
  startingOption: undefined,

  setLanguage: (language) => set({ selectedLanguage: language }),

  toggleReason: (reason) =>
    set((state) => ({
      selectedReasons: state.selectedReasons.includes(reason)
        ? state.selectedReasons.filter((r) => r !== reason)
        : [...state.selectedReasons, reason],
    })),

  setStartingOption: (option) => set({ startingOption: option }),

  reset: () =>
    set({
      selectedLanguage: undefined,
      selectedReasons: [],
      startingOption: undefined,
    }),
}));
