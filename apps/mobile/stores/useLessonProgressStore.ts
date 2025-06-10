import { ExerciseResult } from '@lexora/types';
import { create } from 'zustand';

interface LessonProgressState {
  results: ExerciseResult[];
  addResult: (result: ExerciseResult) => void;
  reset: () => void;
  getResultById: (exerciseId: string) => ExerciseResult | null;
}

export const useLessonProgressStore = create<LessonProgressState>(
  (set, get) => ({
    results: [],
    addResult: (result) =>
      set((state) => ({
        results: [...state.results, result],
      })),
    reset: () => set({ results: [] }),
    getResultById: (exerciseId: string) =>
      get().results.find((r: ExerciseResult) => r.exerciseId === exerciseId) ||
      null,
  })
);
