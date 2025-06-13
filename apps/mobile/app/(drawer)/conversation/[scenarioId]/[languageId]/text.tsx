import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { api } from '@lexora/api-client';
import ScreenContainer from '@/components/layouts/ScreenContainer';
import { LanguageJourney, Scenario } from '@lexora/types';
import TextConversation from '@/components/conversations/TextConversation';
import { useAuthStore } from '@/stores/useAuthStore';
import { Colors, FontSizes, FontWeights, Spacing } from '@lexora/styles';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '@/components/ui/Icon';

export default function TextScenarioPage() {
  const { scenarioId, languageId } = useLocalSearchParams<{
    scenarioId: string;
    languageId: string;
  }>();
  const { user } = useAuthStore();
  const [scenario, setScenario] = useState<Scenario>();
  const [languageJourney, setLanguageJourney] = useState<LanguageJourney>();
  const router = useRouter();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ title: 'AI Practice - Text' });
    }, [navigation])
  );

  useEffect(() => {
    if (!scenarioId || !user) return;

    api.scenario
      .getById(user.accessToken, scenarioId)
      .then(setScenario)
      .catch(console.error);

    api.languageJourney
      .findByLanguageId(user.accessToken, languageId)
      .then(setLanguageJourney);
  }, [scenarioId, user, languageId]);

  if (!scenario) return null;

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View>
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => router.back()}>
              <Icon
                library="Ionicons"
                name="arrow-back"
                size={FontSizes.h1}
                color={Colors.textLight}
              />
            </TouchableOpacity>
            <Text style={styles.scenarioTitle}>{scenario.title}</Text>
          </View>
          <View style={styles.scenarioDescriptionWrapper}>
            <Text style={styles.scenarioDescriptionText}>
              {scenario.prompt}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />

        {languageJourney && (
          <TextConversation
            scenario={scenario}
            language={languageJourney.language}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.l,
    gap: Spacing.s,
    paddingHorizontal: Spacing.screenGutter,
  },
  scenarioTitle: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
    textAlign: 'center',
    flex: 1,
  },
  scenarioDescriptionWrapper: {
    paddingHorizontal: Spacing.screenGutter,
  },
  scenarioDescriptionText: {
    textAlign: 'center',
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.textLight,
    marginHorizontal: Spacing.screenGutter,
  },
});
