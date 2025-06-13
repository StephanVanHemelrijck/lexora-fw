import {
  ActivityIndicator,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { LanguageJourney, Lesson } from '@lexora/types';
import { getCefrLevelLabel } from '@/utils/levels';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@lexora/api-client';
import { lesson } from '../../../../libs/api-client/src/lesson';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import LessonCard from '../lessons/LessonCard';
import { useRouter } from 'expo-router';

interface Props {
  lj: LanguageJourney;
  width: number;
}

export default function LanguageJourneyCard({ lj, width }: Props) {
  const [upcomingLesson, setUpcomingLesson] = useState<Lesson>();
  const { user } = useAuthStore();
  const [isFetchingUpcomingLesson, setIsFetchingUpcomingLesson] =
    useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!lj || !user) return;

    api.lesson
      .getUpcomingLessonForJourney(user.accessToken, lj.id)
      .then((lesson) => setUpcomingLesson(lesson))
      .catch(console.error)
      .finally(() => setIsFetchingUpcomingLesson(false));
  }, [lj, user]);

  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.wrapper}>
        <Text style={styles.title}>
          {lj.language.flagEmoji} {lj.language.name}{' '}
          <Text style={styles.nativeName}>{lj.language.nativeName}</Text>
        </Text>
        {lj.placementLevel && (
          <Text style={styles.label}>
            {getCefrLevelLabel(lj.placementLevel)}
          </Text>
        )}
      </View>

      {isFetchingUpcomingLesson ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.accent} />
          <Text>Getting Upcoming Lesson...</Text>
        </View>
      ) : (
        upcomingLesson && (
          <View style={styles.wrapper}>
            <Text style={styles.title}>Upcoming Lesson</Text>

            <LessonCard
              lesson={upcomingLesson}
              theme="light"
              onPress={() => {
                console.log('push');
                router.push(
                  `/(drawer)/lessons/language/${lj.language.id}/${upcomingLesson.id}`
                );
              }}
            />
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    gap: Spacing.l,
  },
  loadingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.s,
  },
  wrapper: {
    gap: Spacing.s,
  },
  title: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
  nativeName: {
    fontWeight: FontWeights.regular,
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  label: {
    fontWeight: FontWeights.regular,
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
});
