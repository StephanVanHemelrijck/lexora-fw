import { Dimensions, StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenContainer from '@/components/layouts/ScreenContainer';
import { useAuthStore } from '@/stores/useAuthStore';
import DailyChallengeCard from '@/components/daily-challenge/DailyChallengeCard';
import { Colors, FontSizes, Spacing } from '@lexora/styles';
import { LanguageJourney } from '@lexora/types';
import { api } from '@lexora/api-client';
import LanguageJourneyCard from '@/components/languages/LanguageJourneyCard';
import HeroCard from '@/components/conversations/HeroCard';
import Quote from '@/components/ui/Quote';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const { user } = useAuthStore();
  const [languageJourneys, setLanguageJourneys] = useState<LanguageJourney[]>();
  const [isFetchingLanguageJourneys, setIsFetchingLanguageJourneys] =
    useState(false);

  const screenWidth = Dimensions.get('window').width;
  const gutter = Spacing.screenGutter;
  const cardWidth = screenWidth - gutter * 2;

  useEffect(() => {
    if (!user) return;

    api.languageJourney
      .findAll(user.accessToken)
      .then(setLanguageJourneys)
      .catch((err) => console.error(err))
      .finally(() => setIsFetchingLanguageJourneys(false));
  }, [user]);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Daily Challenge */}
        <View style={styles.section}>
          <DailyChallengeCard />
        </View>

        {/* Welcome Message */}
        <View style={styles.section}>
          <View style={styles.welcomeWrapper}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.nameText}>{user?.displayName}</Text>
          </View>
        </View>

        {/* Language Journeys */}
        {languageJourneys && languageJourneys?.length > 0 && (
          <View style={styles.section}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ljWrapper}
            >
              {languageJourneys &&
                languageJourneys.map((lj, idx) => (
                  <View
                    key={lj.id}
                    style={{
                      marginRight:
                        idx !== languageJourneys.length - 1 ? Spacing.m : 0,
                    }}
                  >
                    <LanguageJourneyCard lj={lj} width={cardWidth} />
                  </View>
                ))}
            </ScrollView>
          </View>
        )}

        {/* Quote */}
        <View style={styles.section}>
          <Quote
            title="Quote Of The Day"
            quote='"A different language is a different vision of life. - Federico Fellini"'
          />
        </View>

        {/* Hero for AI Conversations */}
        <View style={styles.section}>
          <HeroCard />
        </View>

        <View style={styles.section}>
          <Quote
            title="Language Fun Fact"
            quote="Did you know? Spanish is the seccond most spoken language in the world."
          />
        </View>

        <View style={[styles.section, styles.buttonWrapper]}>
          <Button text="Lessons" theme="purple" style={styles.button} />
          <Button text="AI Practice" theme="purple" style={styles.button} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: Spacing.l,
    gap: Spacing.xl,
  },
  section: {
    paddingHorizontal: Spacing.screenGutter,
    // marginBottom: Spacing.l,
  },
  welcomeWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: FontSizes.h1,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  nameText: {
    fontSize: FontSizes.h2,
    color: Colors.accent,
  },
  ljWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  buttonWrapper: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'center',
    gap: Spacing.m,
  },
  button: {
    width: 'auto',
    flexGrow: 1,
  },
});
