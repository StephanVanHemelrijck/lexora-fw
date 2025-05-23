import { Language } from '@lexora/types';
import { create } from 'zustand';

interface LanguagesState {
  languages: Language[];
  setLanguages: (languages: Language[]) => void;
}

export const useLanguagesStore = create<LanguagesState>((set) => ({
  languages: [],
  setLanguages: (languages) => set({ languages }),
}));
