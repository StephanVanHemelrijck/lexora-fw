import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React from 'react';
import DailyChallenge from '@/components/daily/DailyChallenge';
import { Colors, FontSizes, Spacing } from '@lexora/styles';
import LessonCard from '@/components/lessons/LessonCard';
import LanguageCard from '@/components/languages/LanguageCard';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';

export default function MyLessons() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.dailyGoalWrapper}>
        <DailyChallenge />
      </View>

      {/* Upcoming Lessons */}
      <View style={styles.lessonsWrapper}>
        <Text style={styles.upcomingLessonsTitle}>Upcoming Lessons</Text>
        <LessonCard />
      </View>

      {/* Languages Learning */}
      <View style={styles.languagesLearningWrapper}>
        <View style={styles.languagesLearnTextWrapper}>
          <Text style={styles.languagesLearningTitle}>Languages Learning</Text>
          <Text style={styles.languagesLearningText}>
            Here&#39;s an overview of the languages you are currently trying to
            learn
          </Text>
        </View>

        {/* Scrollable list of LanguageCards (horizontal) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.languageCardListHorizontal}
        >
          <LanguageCard onPress={() => router.push('/lessons/language/1')} />
          <LanguageCard />
          <LanguageCard />
          <LanguageCard />
        </ScrollView>
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          text="LEARN A NEW LANGUAGE"
          onPress={() => {
            router.push({
              pathname: '/lessons/language/[languageId]',
              params: { languageId: '1' },
            });
          }}
          theme="purple"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.surface,
    gap: Spacing.xl,
  },
  dailyGoalWrapper: {
    paddingHorizontal: Spacing.screenGutter,
  },
  lessonsWrapper: {
    gap: Spacing.m,
    paddingHorizontal: Spacing.screenGutter,
  },
  upcomingLessonsTitle: {
    fontSize: FontSizes.h2,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  languagesLearningWrapper: {
    gap: Spacing.m,
  },
  languagesLearnTextWrapper: {
    paddingHorizontal: Spacing.screenGutter,
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
    display: 'none',
  },
  languageCardListHorizontal: {
    flexDirection: 'row',
    gap: Spacing.m,
    paddingHorizontal: Spacing.screenGutter,
  },
  buttonWrapper: {
    paddingHorizontal: Spacing.screenGutter,
  },
});
