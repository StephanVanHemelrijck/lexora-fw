import { api } from '@lexora/api-client';
import { Language } from '@lexora/types';
import { create } from 'zustand';

interface LanguagesState {
  languages: Language[];
  isLoaded: boolean;
  fetchLanguages: () => Promise<void>;
  getLanguageById: (id: string) => Promise<Language | undefined>;
  getLanguages: () => Promise<Language[]>;
}

export const useLanguagesStore = create<LanguagesState>((set, get) => ({
  languages: [],
  isLoaded: false,

  fetchLanguages: async () => {
    if (get().isLoaded) return;

    try {
      const res = await api.languages.getSupportedLanguages();
      set({ languages: res, isLoaded: true });
    } catch (err) {
      console.error('[LanguagesStore] Failed to fetch languages', err);
      set({ languages: [], isLoaded: false });
    }
  },

  getLanguageById: async (id: string) => {
    if (!get().isLoaded) {
      await get().fetchLanguages();
    }

    return get().languages.find((lang) => lang.id === id);
  },

  getLanguages: async () => {
    if (!get().isLoaded) {
      try {
        await get().fetchLanguages();
      } catch (err) {
        console.error(
          '[LanguagesStore] fetchLanguages failed inside getLanguages',
          err
        );
        return []; // fallback so your UI doesn't crash
      }
    }

    return get().languages;
  },
}));
