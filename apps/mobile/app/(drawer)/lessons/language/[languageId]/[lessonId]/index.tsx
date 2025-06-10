import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { api } from '@lexora/api-client';
import { useAuthStore } from '@/stores/useAuthStore';
import { Lesson, LessonResult } from '@lexora/types';
import { Colors, FontSizes, MascotSizes, Spacing } from '@lexora/styles';
import Mascot from '@/components/ui/Mascot';
import { Button } from '@/components/ui/Button';
import ExerciseRenderer from '@/components/exercises/ExerciseRenderer';
import { Icon } from '@/components/ui/Icon';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';

export default function Page() {
  const { languageId, lessonId } = useLocalSearchParams<{
    languageId: string;
    lessonId: string;
  }>();
  const { user } = useAuthStore();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [hasStarted, setHasStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [lessonResult, setLessonResult] = useState<LessonResult | null>(null);

  useEffect(() => {
    if (!user || !lessonId) return;

    const fetchLesson = async () => {
      try {
        const res = await api.lesson.getLessonById(user.accessToken, lessonId);
        setLesson(res);

        const CEI = res.exercises.findIndex((e) => e.status !== 'completed');

        setCurrentExerciseIndex(CEI >= 0 ? CEI : 0);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [languageId, lessonId, user]);

  useEffect(() => {});

  const handleOnNext = () => {
    setCurrentExerciseIndex(currentExerciseIndex + 1);
  };

  const handleBegin = async () => {
    if (!user) return;

    api.lessonResult
      .ensureCreated(user.accessToken, lessonId)
      .then((res) => {
        setLessonResult(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setHasStarted(true));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: Colors.textLight }}>Lesson not found</Text>
      </View>
    );
  }

  if (!hasStarted) {
    return (
      <View style={styles.hasStartedContainer}>
        <View style={styles.mascotWrapper}>
          <Mascot
            parts={[
              "In this lesson we'll be learning ",
              { text: lesson.focus, accent: true },
              '. We have prepared ',
              { text: `${lesson.exercises.length}`, accent: true },
              ' exercises for you. Good luck!',
            ]}
            direction="bottom"
            size={MascotSizes.m}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            text="CANCEL"
            onPress={() => {
              router.back();
            }}
            theme="outline"
          />
          <Button
            text="BEGIN"
            onPress={() => {
              handleBegin();
            }}
            theme="purple"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            if (currentExerciseIndex > 0)
              setCurrentExerciseIndex(currentExerciseIndex - 1);
            else setHasStarted(false);
          }}
          style={styles.backButton}
        >
          <Icon
            name={currentExerciseIndex > 0 ? 'arrow-back' : 'close'}
            size={FontSizes.h1}
            color={Colors.textLight}
            library="Ionicons"
          />
        </TouchableOpacity>

        <View style={styles.progressWrapper}>
          <ProgressIndicator
            current={currentExerciseIndex + 1}
            total={lesson.exercises.length}
          />
        </View>
      </View>
      <ExerciseRenderer
        exercise={lesson.exercises[currentExerciseIndex]}
        onNext={handleOnNext}
        lessonResultId={lessonResult?.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  hasStartedContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: Spacing.screenGutter,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  mascotWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.screenGutter,
    paddingHorizontal: Spacing.screenGutter,
  },
  buttonWrapper: {
    gap: Spacing.m,
  },
  backButton: { paddingRight: Spacing.s },
  progressWrapper: { flex: 1 },
});
