import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import {
  ExerciseStatus,
  GrammarMultipleChoice,
  VocabularyMultipleChoice,
} from '@lexora/types';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../ui/Button';
import { useLessonProgressStore } from '@/stores/useLessonProgressStore';
import { api } from '@lexora/api-client';
import { useAuthStore } from '@/stores/useAuthStore';

interface Props {
  data: GrammarMultipleChoice | VocabularyMultipleChoice;
  exerciseId: string;
  onNext(): void;
  lessonResultId?: string;
}

export default function MultipleChoiceExercise({
  data,
  exerciseId,
  onNext,
  lessonResultId,
}: Props) {
  const { user } = useAuthStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const addResult = useLessonProgressStore((state) => state.addResult);
  const updateProgress = useLessonProgressStore(
    (state) => state.updateProgressForExercise
  );
  const storedResult = useLessonProgressStore((state) =>
    state.getResultById(exerciseId)
  );

  const prevExerciseIdRef = useRef<string | null>(null);

  // Eager state reset when exerciseId changes
  if (exerciseId !== prevExerciseIdRef.current) {
    prevExerciseIdRef.current = exerciseId;

    if (!storedResult) {
      setSelectedOption(null);
      setHasSubmitted(false);
    }
  }

  useEffect(() => {
    if (storedResult) {
      setSelectedOption(storedResult.selectedAnswer ?? null);
      setHasSubmitted(storedResult.status === 'completed');
    }
  }, [exerciseId, storedResult]);

  const handleOptionSelect = (option: string) => {
    if (hasSubmitted) return;
    setSelectedOption((prev) => (prev === option ? null : option));
  };

  const handleCheckAnswer = () => {
    const isCorrect = selectedOption === data.correct_answer;

    addResult({
      exerciseId,
      selectedAnswer: selectedOption,
      isCorrect,
      status: selectedOption
        ? ('completed' as ExerciseStatus)
        : ('skipped' as ExerciseStatus),
      lessonResultId,
    });

    setHasSubmitted(true);
  };

  const handleNextAnswer = () => {
    if (!user) return;

    const isCorrect = selectedOption === data.correct_answer;

    const result = {
      exerciseId,
      selectedAnswer: selectedOption,
      isCorrect,
      status: selectedOption
        ? ('completed' as ExerciseStatus)
        : ('skipped' as ExerciseStatus),
      lessonResultId,
    };

    addResult(result);
    updateProgress(exerciseId);
    api.exerciseResult.save(user.accessToken, result);

    setHasSubmitted(true);
    onNext();
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Select the correct answer</Text>
        <Text style={styles.question}>{data.question}</Text>

        <View style={styles.optionContainer}>
          {data.options.map((option, index) => {
            const isSelected = option === selectedOption;
            const isCorrect = option === data.correct_answer;

            const optionStyle = StyleSheet.flatten([
              styles.optionButton,
              hasSubmitted && isCorrect && styles.correctOption,
              hasSubmitted &&
                isSelected &&
                !isCorrect &&
                styles.incorrectOption,
              !hasSubmitted && isSelected && styles.selectedOptionButton,
            ]);

            const textStyle = StyleSheet.flatten([
              styles.optionText,
              hasSubmitted && isCorrect && styles.correctText,
              hasSubmitted && isSelected && !isCorrect && styles.incorrectText,
              !hasSubmitted && isSelected && styles.selectedOptionText,
            ]);

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleOptionSelect(option)}
                style={optionStyle}
                activeOpacity={0.8}
                disabled={hasSubmitted}
              >
                <Text style={textStyle}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          text="CHECK"
          onPress={handleCheckAnswer}
          theme="outline"
          disabled={hasSubmitted}
        />
        <Button text="NEXT" onPress={handleNextAnswer} theme="purple" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.screenGutter,
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.textLight,
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.m,
  },
  question: {
    color: Colors.textLight,
    fontSize: FontSizes.h3,
    marginBottom: Spacing.m,
  },
  optionContainer: {
    gap: Spacing.s,
  },
  optionButton: {
    padding: Spacing.m,
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.m,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedOptionButton: {
    backgroundColor: `${Colors.accent}10`,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  correctOption: {
    backgroundColor: `${Colors.success}10`,
    borderColor: Colors.success,
    borderWidth: 2,
  },
  correctText: {
    color: Colors.success,
  },
  incorrectOption: {
    backgroundColor: `${Colors.error}10`,
    borderColor: Colors.error,
    borderWidth: 2,
  },
  incorrectText: {
    color: Colors.error,
  },
  optionText: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  selectedOptionText: {
    color: Colors.accent,
  },
  buttonWrapper: {
    gap: Spacing.m,
  },
});
