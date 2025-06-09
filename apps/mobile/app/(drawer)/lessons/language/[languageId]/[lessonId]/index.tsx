import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { api } from '@lexora/api-client';
import { useAuthStore } from '@/stores/useAuthStore';
import { Lesson } from '@lexora/types';
import { Colors, MascotSizes, Spacing } from '@lexora/styles';
import Mascot from '@/components/ui/Mascot';
import { Button } from '@/components/ui/Button';
import { useNavigationState } from '@react-navigation/native';

export default function Page() {
  const navigation = useNavigation();
  const navState = useNavigationState((s) => s);
  const { languageId, lessonId } = useLocalSearchParams<{
    languageId: string;
    lessonId: string;
  }>();
  const { user } = useAuthStore();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      title: `My Lessons - Spanish - 01`,
    });
  }, [navigation]);

  useEffect(() => {
    if (!user || !lessonId) return;

    const fetchLesson = async () => {
      try {
        const res = await api.lesson.getLessonById(user.accessToken, lessonId);
        console.log('Getting lesson for: ', res);
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
        <Button text="CANCEL" onPress={handleGoBack} theme="outline" />
        <Button text="BEGIN" onPress={() => {}} theme="purple" />
      </View>
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
