import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Colors, FontSizes, Spacing } from '@lexora/styles';
import LanguageCard from '@/components/languages/LanguageCard';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@lexora/api-client';
import { Lesson } from '@lexora/types';
import LessonCard from '@/components/lessons/LessonCard';
import { useLessonProgressStore } from '@/stores/useLessonProgressStore';
import DailyGoalCard from '@/components/daily/DailyGoal';
import { getTodayProgress } from '@/app/hooks/useDailyTimeTracker';

export default function MyLessons() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [upcomingLessons, setUpcomingLessons] = useState<Lesson[]>([]);
  const [isFetchingUpcomingLessons, setIsFetchingUpcomingLessons] =
    useState(true);
  const navigation = useNavigation();
  const updateFromLessons = useLessonProgressStore(
    (state) => state.updateFromLessons
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = async () => {
      const value = await getTodayProgress();
      setProgress(value);
    };

    update(); // Initial load
    const interval = setInterval(update, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ title: 'My Lessons' });
    }, [navigation])
  );

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ title: 'My Lessons' });

      if (!user) return;

      setIsFetchingUpcomingLessons(true); // Reset loader on focus

      api.lesson
        .getUpcomingLessonForUser(user.accessToken)
        .then((res) => {
          setUpcomingLessons(res);
          updateFromLessons(res);
        })
        .catch(console.error)
        .finally(() => setIsFetchingUpcomingLessons(false));
    }, [user, navigation, updateFromLessons])
  );

  const handleRedirect = (lesson: Lesson) => {
    const languageId = lesson.lessonPlan.languageJourney.languageId;

    router.push(`/(drawer)/lessons/language/${languageId}/${lesson.id}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.dailyGoalWrapper}>
        <DailyGoalCard current={progress} goal={user?.dailyMinutes ?? 0} />
      </View>

      {/* Upcoming Lessons */}
      <View style={styles.lessonsWrapper}>
        <Text style={styles.upcomingLessonsTitle}>Upcoming Lesson</Text>
        {isFetchingUpcomingLessons ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color={Colors.accent} />
          </View>
        ) : upcomingLessons.length > 0 ? (
          <LessonCard
            lesson={upcomingLessons[0]}
            onPress={() => handleRedirect(upcomingLessons[0])}
          />
        ) : (
          <Text style={styles.noLessonsText}>No upcoming lesson</Text>
        )}
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
          {user?.languageJourneys?.map((languageJourney) => (
            <LanguageCard
              key={languageJourney.languageId}
              languageJourney={languageJourney}
              onPress={() => {
                router.push({
                  pathname: '/lessons/language/[languageId]',
                  params: { languageId: languageJourney.languageId },
                });
              }}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          text="LEARN A NEW LANGUAGE"
          onPress={() => {
            router.push('/(drawer)/new-language');
          }}
          theme="purple"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Spacing.screenGutter,
    backgroundColor: Colors.surface,
    gap: Spacing.xl,
  },
  dailyGoalWrapper: {
    paddingHorizontal: Spacing.screenGutter,
  },
  lessonsWrapper: {
    minHeight: 130,
    gap: Spacing.m,
    paddingHorizontal: Spacing.screenGutter,
  },
  upcomingLessonsTitle: {
    fontSize: FontSizes.h2,
    fontWeight: 'bold',
    color: Colors.accent,
  },
  noLessonsText: {
    color: Colors.textLight,
    fontSize: FontSizes.body,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
