import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { api } from '@lexora/api-client';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router';
import { Exercise, Language, LessonResult } from '@lexora/types';
import { Colors, FontSizes, FontWeights, Spacing } from '@lexora/styles';
import { format } from 'date-fns';

export default function Results() {
  const { user } = useAuthStore();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const nav = useNavigation();
  const [result, setResult] = useState<LessonResult>();
  const [isFetchingResult, setIsFetchingResult] = useState(false);
  const [language, setLanguage] = useState<Language>();
  const [originalExercises, setOriginalExercises] = useState<Exercise[]>([]);
  const [score, setScore] = useState(0);

  useFocusEffect(
    useCallback(() => {
      nav.getParent()?.setOptions({ title: `Results` });
    }, [nav])
  );

  useEffect(() => {
    if (!result) return;
    const total = result.lesson.exercises.length;
    const correct = result.exercises.filter((e) => e.isCorrect).length;
    setScore((correct / total) * 100);
  }, [result]);

  useEffect(() => {
    if (!user || !lessonId) return;

    setIsFetchingResult(true);

    api.lessonResult
      .getByLessonId(user.accessToken, lessonId)
      .then((res) => {
        setResult(res);
        setLanguage(res.lesson.lessonPlan.languageJourney.language);
        setOriginalExercises(res.lesson.exercises);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsFetchingResult(false));
  }, [user, lessonId]);

  const findExercise = (exerciseId: string) => {
    const exercise = originalExercises.find((e) => e.id === exerciseId);
    if (!exercise) return null;

    const parsedData =
      typeof exercise.data === 'string'
        ? JSON.parse(exercise.data)
        : exercise.data;

    return {
      ...exercise,
      parsedData,
    };
  };

  const formatAnswer = (answer: string) => {
    if (!answer) return 'No answer';
    if (answer.startsWith('file://')) return '[Voice Answer]';
    return answer;
  };

  if (isFetchingResult)
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Getting your result...</Text>
        <ActivityIndicator color={Colors.accent} size="large" />
      </View>
    );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {language && result && (
        <View style={styles.summary}>
          <Text style={styles.title}>Summary</Text>
          <Text style={styles.subTitle}>
            {language.flagEmoji} {language.name}{' '}
            <Text style={styles.subTitleNative}>({language.nativeName})</Text>
          </Text>
          <Text style={styles.lessonFocus}>Focus: {result.lesson.focus}</Text>

          <View style={styles.dateContainer}>
            <Text style={styles.completedAt}>
              Started: {format(new Date(result.startedAt ?? ''), 'PPpp')}
            </Text>
            <Text style={styles.completedAt}>
              Completed: {format(new Date(result.completedAt ?? ''), 'PPpp')}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.divider} />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Your Answers</Text>
        <Text
          style={[
            styles.score,
            score > 50 ? styles.positiveScore : styles.negativeScore,
          ]}
        >
          {score}%
        </Text>
      </View>
      <View style={styles.exercisesContainer}>
        {result?.exercises.map((exercise, index) => {
          const fullExercise = findExercise(exercise.exerciseId);
          const parsed = fullExercise?.parsedData;

          const questionText = parsed?.question || parsed?.prompt;

          return (
            <View key={exercise.exerciseId} style={styles.exerciseItem}>
              <Text style={styles.question}>
                {index + 1}. {questionText ?? 'No prompt available'}
              </Text>

              <Text style={styles.answerText}>
                Your Answer: {formatAnswer(exercise.selectedAnswer ?? '')}
              </Text>

              {!exercise.isCorrect && parsed?.correct_answer && (
                <Text style={styles.correctAnswerText}>
                  Correct Answer: {parsed.correct_answer}
                </Text>
              )}

              <Text
                style={[
                  styles.answerStatus,
                  exercise.isCorrect ? styles.correct : styles.incorrect,
                ]}
              >
                {exercise.isCorrect ? '✅ Correct' : '❌ Incorrect'}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    gap: Spacing.l,
  },
  loadingText: {
    color: Colors.textLight,
  },
  container: {
    padding: Spacing.screenGutter,
    backgroundColor: Colors.surface,
    gap: Spacing.l,
  },
  exercisesContainer: {
    gap: Spacing.m,
  },
  summary: {
    gap: Spacing.m,
  },
  title: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.accent,
  },
  subTitle: {
    fontSize: FontSizes.h3,
    color: Colors.textLight,
    paddingBottom: Spacing.s,
    fontWeight: FontWeights.bold,
  },
  subTitleNative: {
    fontSize: FontSizes.caption,
    color: Colors.textLight,
  },
  lessonFocus: {
    fontSize: FontSizes.h3,
    color: Colors.textLight,
    fontWeight: FontWeights.bold,
  },
  completedAt: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  dateContainer: {
    gap: Spacing.s,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.m,
  },
  sectionHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  sectionHeaderText: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.accent,
  },
  score: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.accent,
  },
  positiveScore: {
    color: Colors.success,
  },
  negativeScore: {
    color: Colors.error,
  },
  exerciseItem: {
    padding: Spacing.m,
    backgroundColor: Colors.inputBackground,
    borderRadius: Spacing.s,
    borderColor: Colors.border,
    borderWidth: 1,
    gap: Spacing.s,
  },
  question: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    color: Colors.textLight,
  },
  answerText: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  correctAnswerText: {
    fontSize: FontSizes.body,
    color: Colors.success,
  },
  answerStatus: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
  correct: {
    color: Colors.success,
  },
  incorrect: {
    color: Colors.error,
  },
});
