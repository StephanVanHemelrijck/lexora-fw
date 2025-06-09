import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { api } from '@lexora/api-client';
import { useAuthStore } from '@/stores/useAuthStore';
import { Lesson } from '@lexora/types';
import { Colors, MascotSizes, Spacing } from '@lexora/styles';
import Mascot from '@/components/ui/Mascot';
import { Button } from '@/components/ui/Button';

export default function Page() {
  const navigation = useNavigation();
  const { languageId, lessonId } = useLocalSearchParams<{
    languageId: string;
    lessonId: string;
  }>();
  const { user } = useAuthStore();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [hasStarted, setHasStarted] = useState(false);

  useLayoutEffect(() => {
    if (!lesson) return;
    const language = lesson.lessonPlan.languageJourney.language;

    const parent = navigation.getParent();

    if (!parent) return;

    parent.setOptions({
      title: `My Lessons - ${language.name}`,
    });
  }, [navigation, lesson]);

  useEffect(() => {
    if (!user || !lessonId) return;

    const fetchLesson = async () => {
      try {
        const res = await api.lesson.getLessonById(user.accessToken, lessonId);
        setLesson(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [languageId, lessonId, user]);

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
      <View style={styles.container}>
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
            onPress={() => setHasStarted(true)}
            theme="purple"
          />
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text>Lol</Text>
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
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.screenGutter,
    justifyContent: 'space-between',
  },
  mascotWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonWrapper: {
    gap: Spacing.m,
  },
});
