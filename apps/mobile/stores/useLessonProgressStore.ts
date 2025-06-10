import { ExerciseResult, Lesson } from '@lexora/types';
import { create } from 'zustand';

interface LessonProgress {
  [lessonId: string]: {
    completed: number;
    total: number;
  };
}

interface LessonProgressState {
  results: ExerciseResult[];
  progress: LessonProgress;
  addResult: (result: ExerciseResult) => void;
  updateFromLessons: (lessons: Lesson[]) => void;
  setProgress: (
    lessonId: string,
    progress: { completed: number; total: number }
  ) => void;
  getResultById: (exerciseId: string) => ExerciseResult | null;
  reset: () => void;
}

export const useLessonProgressStore = create<LessonProgressState>(
  (set, get) => ({
    results: [],
    progress: {},

    addResult: (result) =>
      set((state) => ({
        results: [...state.results, result],
      })),

    updateFromLessons: (lessons: Lesson[]) =>
      set((state) => {
        const updatedProgress: LessonProgress = { ...state.progress };

        lessons.forEach((lesson) => {
          const total = lesson.exercises?.length ?? 0;
          const completed =
            lesson.exercises?.filter((e) => e.status === 'completed').length ??
            0;

          updatedProgress[lesson.id] = { completed, total };
        });

        return { progress: updatedProgress };
      }),

    setProgress: (lessonId, progress) =>
      set((state) => ({
        progress: {
          ...state.progress,
          [lessonId]: progress,
        },
      })),

    getResultById: (exerciseId: string) =>
      get().results.find((r: ExerciseResult) => r.exerciseId === exerciseId) ||
      null,

    reset: () => set({ results: [], progress: {} }),
  })
);
