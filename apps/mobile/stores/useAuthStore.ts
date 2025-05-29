import { User } from '@lexora/types';
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  setAuth: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  setAuth: (user) => set(() => ({ user })),

  clearAuth: () => set(() => ({ user: null })),
}));
