import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { api } from '@lexora/api-client';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLocalSearchParams } from 'expo-router';

export default function Results() {
  const { user } = useAuthStore();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  useEffect(() => {
    if (!user || !lessonId) return;

    api.lessonResult
      .getByLessonId(user.accessToken, lessonId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [user, lessonId]);

  return (
    <View>
      <Text>Results</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
