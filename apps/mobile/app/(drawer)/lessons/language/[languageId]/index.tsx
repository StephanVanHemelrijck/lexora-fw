import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import LessonCard from '@/components/lessons/LessonCard';
import { Button } from '@/components/ui/Button';
import { Colors, FontSizes, FontWeights, Spacing } from '@lexora/styles';
import { useLanguagesStore } from '@/stores/useLanguagesStore';
import { Language, LanguageJourney, Lesson, LessonPlan } from '@lexora/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@lexora/api-client';
import { useFocusEffect } from '@react-navigation/native';
import { getCefrLevelLabel } from '@/utils/levels';

export default function Page() {
  const navigation = useNavigation();
  const { languageId } = useLocalSearchParams<{ languageId: string }>();
  const [language, setLanguage] = useState<Language | undefined>();
  const [languageJourney, setLanguageJourney] = useState<LanguageJourney>();
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const router = useRouter();
  const [levelLabel, setLevelLabel] = useState<string>('');
  const [lessonPlan, setLessonPlan] = useState<LessonPlan>();
  const [isFetchingLessonPlan, setIsFetchingLessonPlan] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Lesson[]>([]);

  useFocusEffect(
    useCallback(() => {
      const checkAndRedirect = async () => {
        if (!user?.accessToken || !languageId) return;

        const journey = await api.languageJourney.findByLanguageId(
          user.accessToken,
          languageId
        );

        setLanguageJourney(journey);

        if (
          journey?.startingOption === 'placement' &&
          !journey?.placementLevel
        ) {
          router.push({
            pathname: '/lessons/language/[languageId]/assessment',
            params: { languageId },
          });
        } else {
          setIsLoading(false);
        }
      };

      checkAndRedirect();
    }, [languageId, user, router])
  );

  // Fetch language metadata
  useEffect(() => {
    if (!languageId) return;

    const resolve = async () => {
      const lang = await useLanguagesStore
        .getState()
        .getLanguageById(languageId);

      setLanguage(lang);
    };

    resolve();
  }, [languageId]);

  useEffect(() => {
    if (!languageJourney || !user || !user.accessToken) return;
    // enrich label
    if (languageJourney?.placementLevel) {
      const l = getCefrLevelLabel(languageJourney?.placementLevel);

      setLevelLabel(l);
    }

    setIsFetchingLessonPlan(true);

    // fetch lesson plan
    api.lessonPlan
      .generateLessonPlan(user.accessToken, languageJourney.id)
      .then((res) => {
        console.log(res);
        setLessonPlan(res);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsFetchingLessonPlan(false);
      });
  }, [languageJourney, user]);

  // Set drawer title
  useEffect(() => {
    if (!language?.name) return;

    navigation.setOptions({
      title: `My Lessons - ${language.name}`,
    });
  }, [navigation, language]);

  // Loading screen during redirect
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.nativeLanguageName}>{language?.nativeName}</Text>
          <Text style={styles.languageTitle}>
            {language?.flagEmoji} {language?.name}
          </Text>
          {languageJourney?.startingOption && (
            <Text style={styles.languageLevel}>
              {languageJourney?.placementLevel ?? 'N/A'} - {levelLabel}
            </Text>
          )}
        </View>
        {/* <RadarChartComponent size={150} /> */}
      </View>

      <View style={styles.divider} />

      {/* Current Focus */}
      <View style={styles.currentFocus}>
        <View style={styles.currentFocusText}>
          <Text style={styles.sectionTitle}>Current Focus</Text>
          <Text style={styles.sectionDescription}>
            Based on your results, your weakness lies in grammar. We’ve selected
            exercises to help you progress.
          </Text>
        </View>
        <View style={styles.scrollableCardList}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerStyle={styles.scrollView}
          >
            {isFetchingLessonPlan ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.accent} />
              </View>
            ) : (
              lessonPlan &&
              lessonPlan.lessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))
            )}
          </ScrollView>
        </View>
      </View>

      <Button text="PRACTICE WITH AI" onPress={() => {}} theme="purple" />

      {/* Completed Modules */}
      {completedLessons.length > 0 && (
        <View style={styles.completedModules}>
          <View style={styles.completedModulesText}>
            <Text style={styles.sectionTitle}>Completed Modules</Text>
            <Text style={styles.sectionDescription}>
              Browse completed modules and tap to review your performance.
            </Text>
          </View>
          <View style={styles.scrollableCardList}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={styles.scrollView}
            >
              {completedLessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: Spacing.screenGutter,
    backgroundColor: Colors.surface,
    gap: Spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageTitle: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
    marginBottom: Spacing.s,
  },
  nativeLanguageName: {
    fontSize: FontSizes.caption,
    color: Colors.textLight,
  },
  languageLevel: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.textLight,
  },
  currentFocus: {
    gap: Spacing.l,
  },
  currentFocusText: {
    gap: Spacing.s,
  },
  completedModules: {
    gap: Spacing.l,
  },
  completedModulesText: {
    gap: Spacing.s,
  },
  sectionTitle: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.accent,
  },
  sectionDescription: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  scrollableCardList: {
    height: 260,
  },
  scrollView: {
    gap: Spacing.m,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
