import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import DailyChallenge from '@/components/daily/DailyChallenge';
import { Colors, FontSizes, Spacing } from '@lexora/styles';
import LessonCard from '@/components/lessons/LessonCard';
import LanguageCard from '@/components/languages/LanguageCard';
import { useRouter } from 'expo-router';

export default function MyLessons() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <DailyChallenge />
      <View style={styles.lessonsWrapper}>
        <Text style={styles.upcomingLessonsTitle}>Upcoming Lessons</Text>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/lessons/language/[languageId]',
              params: { languageId: '1' },
            });
          }}
        >
          <LessonCard />
        </TouchableOpacity>
      </View>
      <View style={styles.languagesLearningWrapper}>
        <View style={styles.languagesLearnTextWrapper}>
          <Text style={styles.languagesLearningTitle}>Languages Learning</Text>
          <Text style={styles.languagesLearningText}>
            Here&#39;s an overview of the languages you are currently trying to
            learn
          </Text>
        </View>
        <LanguageCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.screenGutter,
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.surface,
    gap: Spacing.xl,
  },
  upcomingLessonsTitle: {
    fontSize: FontSizes.h2,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  lessonsWrapper: {
    gap: Spacing.l,
  },
  languagesLearningWrapper: {
    gap: Spacing.l,
  },
  languagesLearnTextWrapper: {
    gap: Spacing.s,
  },
  languagesLearningTitle: {
    fontSize: FontSizes.h2,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  languagesLearningText: {
    color: Colors.textLight,
    fontSize: FontSizes.body,
  },
});
