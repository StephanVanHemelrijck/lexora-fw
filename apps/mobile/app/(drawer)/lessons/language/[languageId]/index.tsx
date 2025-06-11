// pages/lessons/language/[languageId]/index.tsx
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import LessonCard from '@/components/lessons/LessonCard';
import { Button } from '@/components/ui/Button';
import { Colors, FontSizes, FontWeights, Spacing } from '@lexora/styles';
import { Language, LanguageJourney, Lesson, LessonPlan } from '@lexora/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@lexora/api-client';
import { useFocusEffect } from '@react-navigation/native';
import { getCefrLevelLabel } from '@/utils/levels';
import { useLessonProgressStore } from '@/stores/useLessonProgressStore';

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
  const updateFromLessons = useLessonProgressStore(
    (state) => state.updateFromLessons
  );
  const [completedLessons, setCompletedLessons] = useState<Lesson[]>([]);
  const [incompletedLessons, setIncompletedLessons] = useState<Lesson[]>([]);

  const handleRedirect = (lesson: Lesson) => {
    const isCompleted = lesson.isCompleted;

    if (isCompleted)
      router.push(
        `/(drawer)/lessons/language/${languageId}/${lesson.id}/results`
      );
    else router.push(`/(drawer)/lessons/language/${languageId}/${lesson.id}`);
  };

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
    if (!languageId || !user) return;

    api.languages
      .getById(user.accessToken, languageId)
      .then(setLanguage)
      .catch(console.error);
  }, [languageId, user]);

  useEffect(() => {
    if (!languageJourney || !user?.accessToken) return;

    if (languageJourney.placementLevel) {
      setLevelLabel(getCefrLevelLabel(languageJourney.placementLevel));
    }

    setIsFetchingLessonPlan(true);

    api.lessonPlan
      .generateLessonPlan(user.accessToken, languageJourney.id)
      .then((res) => {
        setLessonPlan(res);
        updateFromLessons(res.lessons);

        const completed = res.lessons
          .filter((l) => l.isCompleted && l.lessonResult?.completedAt)
          .sort((l1, l2) => {
            const d1 = new Date(l1.lessonResult!.completedAt!).getTime();
            const d2 = new Date(l2.lessonResult!.completedAt!).getTime();
            return d2 - d1; // descending = most recent first
          });

        const incompleted = res.lessons.filter((l) => !l.isCompleted);

        setCompletedLessons(completed);
        setIncompletedLessons(incompleted);
      })
      .catch(console.error)
      .finally(() => setIsFetchingLessonPlan(false));
  }, [languageJourney, user, updateFromLessons]);

  // Set drawer title
  useLayoutEffect(() => {
    if (!language?.name) return;
    navigation.getParent()?.setOptions({
      title: `My Lessons - ${language.name}`,
    });
  }, [navigation, language]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.nativeLanguageName}>{language?.nativeName}</Text>
          <Text style={styles.languageTitle}>
            {language?.flagEmoji} {language?.name}
          </Text>
          <Text style={styles.languageLevel}>{levelLabel}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.currentFocus}>
        <View style={styles.currentFocusText}>
          <Text style={styles.sectionTitle}>
            Current Focus ({incompletedLessons.length})
          </Text>
          <Text style={styles.sectionDescription}>
            A custom plan based on your level — complete these lessons to keep
            improving.
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
                <Text style={styles.loadingText}>
                  Generating your week plan...
                </Text>
                <ActivityIndicator size="large" color={Colors.accent} />
              </View>
            ) : (
              incompletedLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onPress={() => handleRedirect(lesson)}
                />
              ))
            )}
          </ScrollView>
        </View>
      </View>

      <Button text="PRACTICE WITH AI" onPress={() => {}} theme="purple" />

      {completedLessons.length > 0 && (
        <View style={styles.completedLessons}>
          <View style={styles.completedLessonsText}>
            <Text style={styles.sectionTitle}>
              Completed Lessons ({completedLessons.length})
            </Text>
            <Text style={styles.sectionDescription}>
              Scroll through the lessons you&#39;ve completed and tap on them to
              review how you handled them.
            </Text>
          </View>
          <View style={styles.scrollableCardList}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={styles.scrollView}
            >
              {completedLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onPress={() => handleRedirect(lesson)}
                />
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
  completedLessons: {
    gap: Spacing.l,
  },
  completedLessonsText: {
    gap: Spacing.s,
  },
  scrollableCardList: {
    height: 280,
  },
  scrollView: {
    gap: Spacing.m,
    flexGrow: 1,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
    marginBottom: Spacing.m,
  },
});
