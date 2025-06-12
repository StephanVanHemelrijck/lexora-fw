import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import ScreenContainer from '@/components/layouts/ScreenContainer';
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router';
import { Icon } from '@/components/ui/Icon';
import { Colors, FontSizes, FontWeights, Spacing } from '@lexora/styles';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@lexora/api-client';
import { LanguageJourney, Scenario } from '@lexora/types';
import VoiceConversation from '@/components/conversations/VoiceConversation';

export default function Page() {
  const { scenarioId, languageId } = useLocalSearchParams<{
    scenarioId: string;
    languageId: string;
  }>();
  const { user } = useAuthStore();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const router = useRouter();
  const navigation = useNavigation();
  const [languageJourney, setLanguageJourney] = useState<LanguageJourney>();

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ title: 'AI Practice - Voice' });
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
      .then(setLanguageJourney)
      .catch(console.error);
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
          <VoiceConversation
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
    backgroundColor: Colors.surface,
    gap: Spacing.xl,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  loadingText: {
    color: Colors.textLight,
    marginBottom: Spacing.l,
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
  actionWrapper: {
    gap: Spacing.l,
    paddingHorizontal: Spacing.screenGutter,
    justifyContent: 'center',
    flex: 1,
  },
  orText: {
    textAlign: 'center',
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
});
