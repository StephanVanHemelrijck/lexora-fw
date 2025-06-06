import { User } from '@lexora/types';
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  isReady: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isReady: false,

  setAuth: (user) => set(() => ({ user, isReady: true })),

  clearAuth: () => set(() => ({ user: null, isReady: false })),
}));
