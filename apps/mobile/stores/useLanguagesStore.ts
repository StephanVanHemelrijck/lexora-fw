import { api } from '@lexora/api-client';
import { Language } from '@lexora/types';
import { create } from 'zustand';

interface LanguagesState {
  languages: Language[];
  isLoaded: boolean;
  fetchLanguages: () => Promise<void>;
  getLanguageById: (id: string) => Promise<Language | undefined>;
}

export const useLanguagesStore = create<LanguagesState>((set, get) => ({
  languages: [],
  isLoaded: false,

  fetchLanguages: async () => {
    if (get().isLoaded) return;

    const res = await api.languages.getSupportedLanguages(); // your backend fetch call
    set({ languages: res, isLoaded: true });
  },

  getLanguageById: async (id: string) => {
    if (!get().isLoaded) {
      await get().fetchLanguages();
    }

    return get().languages.find((lang) => lang.id === id);
  },
}));
