import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { api } from '@lexora/api-client';
import { useAuthStore } from '@/stores/useAuthStore';
import { Lesson } from '@lexora/types';
import { Colors } from '@lexora/styles';

export default function Page() {
  const { languageId, lessonId } = useLocalSearchParams<{
    languageId: string;
    lessonId: string;
  }>();
  const { user } = useAuthStore();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <Text>Focus: {lesson.focus}</Text>
      <Text>Estimated minutes: {lesson.estimatedMinutes}</Text>
      <Text>Types: {lesson.exerciseTypes.join(', ')}</Text>
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
    padding: 16,
  },
});
