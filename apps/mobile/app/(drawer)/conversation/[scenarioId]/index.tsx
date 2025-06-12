import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router';
import ScreenContainer from '@/components/layouts/ScreenContainer';
import { Scenario } from '@lexora/types';
import { api } from '@lexora/api-client';
import { useAuthStore } from '@/stores/useAuthStore';
import { Colors, FontSizes, FontWeights, Spacing } from '@lexora/styles';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

export default function Page() {
  const { user } = useAuthStore();
  const { scenarioId } = useLocalSearchParams<{ scenarioId: string }>();
  const [scenario, setScenario] = useState<Scenario>();
  const [isFetchingScenario, setIsFetchingScenario] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ title: 'AI Practice' });
    }, [navigation])
  );

  useEffect(() => {
    if (!scenarioId || !user) return;

    if (scenarioId) {
      api.scenario
        .getById(user.accessToken, scenarioId)
        .then(setScenario)
        .catch(console.error)
        .finally(() => setIsFetchingScenario(false));
    }
  }, [scenarioId, user]);

  if (isFetchingScenario)
    return (
      <View style={styles.loadingWrapper}>
        <Text style={styles.loadingText}>Getting scenario...</Text>
        <ActivityIndicator size={'large'} color={Colors.accent} />
      </View>
    );

  return (
    <ScreenContainer>
      {scenario ? (
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

          <View style={styles.actionWrapper}>
            <Button
              text="PRACTICE TEXT"
              onPress={() => {
                router.push(`/(drawer)/conversation/${scenario.id}/text`);
              }}
              theme="purple"
            />
            <Text style={styles.orText}>or ...</Text>
            <Button
              text="PRACTICE VOICE"
              onPress={() => {
                router.push(`/(drawer)/conversation/${scenario.id}/voice`);
              }}
              theme="purple"
            />
          </View>
        </View>
      ) : (
        <></>
      )}
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
