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
  updateProgressForExercise: (exerciseId: string) => void;
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

    updateProgressForExercise: (exerciseId: string) =>
      set((state) => {
        const result = state.results.find((r) => r.exerciseId === exerciseId);
        if (!result?.lessonResultId) return {};

        const lessonId = result.lessonResultId;
        const lessonResults = state.results.filter(
          (r) => r.lessonResultId === lessonId
        );

        const total = lessonResults.length;
        const completed = lessonResults.filter(
          (r) => r.status === 'completed'
        ).length;

        return {
          progress: {
            ...state.progress,
            [lessonId]: { completed, total },
          },
        };
      }),

    getResultById: (exerciseId: string) =>
      get().results.find((r) => r.exerciseId === exerciseId) || null,

    reset: () => set({ results: [], progress: {} }),
  })
);
