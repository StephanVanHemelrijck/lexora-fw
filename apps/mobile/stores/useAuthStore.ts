import { create } from 'zustand';

interface LanguageJourney {
  languageId: string;
  learningReasons: string[];
  routineMinutes: number;
  startingOption: string;
}

interface AuthState {
  uid: string;
  email: string | null;
  displayName: string | null;
  idToken: string;
  languageJourney?: LanguageJourney;
  setAuth: (user: Omit<AuthState, 'setAuth' | 'clearAuth'>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  uid: '',
  email: null,
  displayName: null,
  idToken: '',
  languageJourney: undefined,

  setAuth: (user) =>
    set(() => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      idToken: user.idToken,
      languageJourney: user.languageJourney,
    })),

  clearAuth: () =>
    set(() => ({
      uid: '',
      email: null,
      displayName: null,
      idToken: '',
      languageJourney: undefined,
    })),
}));
