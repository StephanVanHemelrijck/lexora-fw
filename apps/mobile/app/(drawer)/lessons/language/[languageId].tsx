import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import RadarChartComponent from '@/components/charts/RadarChart';
import LessonCard from '@/components/lessons/LessonCard';
import { Button } from '@/components/ui/Button';
import { Colors, FontSizes, FontWeights, Spacing } from '@lexora/styles';
import { useLanguagesStore } from '@/stores/useLanguagesStore';
import { Language } from '@lexora/types';

const dummyData = Array.from({ length: 10 }, (_, i) => ({ id: i }));

export default function Page() {
  const navigation = useNavigation();
  const { languageId } = useLocalSearchParams<{ languageId: string }>();
  const [language, setLanguage] = useState<Language | undefined>(undefined);
  const { languages } = useLanguagesStore();

  useEffect(() => {
    const resolve = async () => {
      const lang = await useLanguagesStore
        .getState()
        .getLanguageById(languageId);
      setLanguage(lang);
    };

    resolve();
  }, [languageId]);

  useEffect(() => {
    navigation.setOptions({
      title: `My Lessons - ${language?.name}`,
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.languageInfo}>
          <Text style={styles.nativeLanguageName}>{language?.nativeName}</Text>
          <Text style={styles.languageTitle}>
            {language?.flagEmoji} {language?.name}
          </Text>
          <Text style={styles.languageLevel}>A2 - Elementary</Text>
        </View>
        <RadarChartComponent size={150} />
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
            {dummyData.slice(0, 6).map((item) => (
              <LessonCard key={item.id} />
            ))}
          </ScrollView>
        </View>
      </View>

      {/* AI Practice */}
      <Button text="PRACTICE WITH AI" onPress={() => {}} theme="purple" />

      {/* Completed Modules */}
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
            {dummyData.slice(0, 8).map((item) => (
              <LessonCard key={`completed-${item.id}`} />
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    maxHeight: 260, // roughly fits 3 LessonCards with spacing
  },
  scrollView: {
    gap: Spacing.m,
  },
});
