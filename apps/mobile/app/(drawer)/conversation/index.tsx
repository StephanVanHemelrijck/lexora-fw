import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenContainer from '@/components/layouts/ScreenContainer';
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from '@lexora/styles';
import { LanguageJourney, Scenario } from '@lexora/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@lexora/api-client';
import LanguageJourneyDropdown from '@/components/languages/LanguageJourneyDropdown';
import { Icon } from '@/components/ui/Icon';
import { useRouter } from 'expo-router';

const REASONS = [
  { label: 'Connect with people', emoji: '🗣️' },
  { label: 'Travel', emoji: '✈️' },
  { label: 'Work / Career', emoji: '💼' },
  { label: 'Study / School', emoji: '🎓' },
  { label: 'Culture & Media', emoji: '🎭' },
  { label: 'For fun / Hobby', emoji: '🎮' },
  { label: 'Move abroad', emoji: '🏠' },
  { label: 'Language challenge', emoji: '🧠' },
  { label: 'Make new friends', emoji: '🤝' },
  { label: 'Family / Heritage', emoji: '🧬' },
];

export default function Page() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [ljs, setLjs] = useState<LanguageJourney[]>();
  const [isFetchingLjs, setIsFetchingLjs] = useState(false);
  const [selectedLj, setSelectedLj] = useState<LanguageJourney>();
  const [recommendedScenarios, setRecommendedScenarios] =
    useState<Scenario[]>();
  const [allScenarios, setAllScenarios] = useState<Scenario[]>();
  const [isFetchingScenarios, setIsFetchingScenarios] = useState(false);

  const handleRedirect = (scenarioId: string) => {
    if (!scenarioId || !selectedLj) return;

    router.push(
      `/(drawer)/conversation/${scenarioId}/${selectedLj.languageId}`
    );
  };

  useEffect(() => {
    if (!allScenarios || !selectedLj) return;

    setIsFetchingScenarios(true);

    const reasons = selectedLj.learningReasons.map((r) => r.trim());

    const result: Scenario[] = [];

    for (const reason of reasons) {
      const matching = allScenarios.filter((scenario) =>
        scenario.categories.some((cat) => cat.trim() === reason)
      );

      result.push(...matching.slice(3, 5).reverse());
    }

    setIsFetchingScenarios(false);
    setRecommendedScenarios(result);
  }, [allScenarios, selectedLj]);

  useEffect(() => {
    if (!user) return;

    setIsFetchingLjs(true);
    api.languageJourney
      .findAll(user.accessToken)
      .then((res) => {
        setLjs(res);
        if (res.length > 0) setSelectedLj(res[0]);
      })
      .finally(() => setIsFetchingLjs(false));
  }, [user]);

  useEffect(() => {
    if (!user || !selectedLj) return;
    api.scenario.getAll(user.accessToken).then(setAllScenarios);
  }, [user, selectedLj]);

  if (isFetchingLjs && isFetchingScenarios)
    return (
      <ScreenContainer>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Getting Scenarios...</Text>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      </ScreenContainer>
    );

  return (
    <ScreenContainer>
      {/* Dropdown */}
      {ljs && (
        <View style={styles.dropdownContainer}>
          <LanguageJourneyDropdown
            ljs={ljs}
            onChange={setSelectedLj}
            selectedLj={selectedLj}
          />
        </View>
      )}

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wrapper}>
          <Text style={styles.title}>Select Scenario</Text>
          <Text style={styles.text}>
            Select a scenario you want to improve on. AI will help you practice
            this scenario. You can practice both voice and text.
          </Text>
        </View>

        {/* Recommended Scenarios */}
        <View style={styles.wrapper}>
          <Text style={styles.sectionTitle}>Recommended Scenarios</Text>
          <ScrollView
            style={styles.recommendedScroll}
            contentContainerStyle={{ gap: Spacing.m }}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {recommendedScenarios?.map((scenario) => (
              <TouchableOpacity
                key={scenario.id}
                style={styles.recommendCard}
                onPress={() => handleRedirect(scenario.id)}
              >
                <View style={styles.recommendCardInner}>
                  <Icon
                    library="MaterialIcons"
                    name="chat"
                    size={20}
                    color={Colors.textLight}
                  />
                  <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                </View>
                <Text style={styles.scenarioSubtext}>
                  Difficulty: {scenario.difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Scenarios */}
        <View style={styles.wrapper}>
          <View style={styles.popularHeader}>
            <Text style={styles.sectionTitle}>Popular Categories</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.grid}>
            {REASONS.map((cat) => {
              const matching = allScenarios?.filter((s) =>
                s.categories.includes(cat.label)
              );

              if (!matching) return null;

              const randomScenario =
                matching?.length > 0
                  ? matching[Math.floor(Math.random() * matching.length)]
                  : null;

              return (
                <TouchableOpacity
                  key={cat.label}
                  style={styles.gridItem}
                  disabled={!randomScenario}
                  onPress={() =>
                    randomScenario && handleRedirect(randomScenario.id)
                  }
                >
                  <Text style={styles.emoji}>{cat.emoji}</Text>
                  <Text style={styles.gridText}>{cat.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textLight,
    marginBottom: Spacing.l,
  },

  dropdownContainer: {
    paddingHorizontal: Spacing.screenGutter,
    marginBottom: Spacing.l,
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  wrapper: {
    gap: Spacing.m,
    paddingHorizontal: Spacing.screenGutter,
    marginBottom: Spacing.l,
  },
  title: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
  text: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  sectionTitle: {
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
  recommendCard: {
    backgroundColor: Colors.main,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
  },
  recommendCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
  },
  scenarioTitle: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
  scenarioSubtext: {
    fontSize: FontSizes.caption,
    color: Colors.textLight,
    marginTop: Spacing.s,
  },
  recommendedScroll: {
    maxHeight: 300,
    marginTop: Spacing.s,
  },
  popularHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkText: {
    fontSize: FontSizes.caption,
    color: Colors.accent,
    fontWeight: FontWeights.medium,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.m,
    marginTop: Spacing.m,
  },
  gridItem: {
    width: '47%',
    height: 128,
    backgroundColor: Colors.main,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridText: {
    fontSize: FontSizes.body,
    textAlign: 'center',
    color: Colors.textLight,
  },
  emoji: {
    fontSize: 32,
    marginBottom: Spacing.s,
  },
});
