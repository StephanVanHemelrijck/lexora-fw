import { create } from 'zustand';

interface OnboardingState {
  step: number;
  setStep: (step: number) => void;
  started: boolean;
  setStarted: (started: boolean) => void;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  step: 0,
  setStep: (step) => set({ step }),
  started: false,
  setStarted: (started: boolean) => set({ started }),
  totalSteps: 6,
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  reset: () => set({ step: 0 }),
}));
