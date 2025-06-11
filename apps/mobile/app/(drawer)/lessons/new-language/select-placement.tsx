import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { Colors, FontSizes, MascotSizes, Spacing } from '@lexora/styles';
import { useRouter } from 'expo-router';
import { useNewLanguageStore } from '@/stores/useNewLanguageStore';
import { StartingOptions } from '@lexora/types';
import LanguagePlacementSelection from '@/components/languages/LanguagePlacementSelection';
import { Icon } from '@/components/ui/Icon';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import Mascot from '@/components/ui/Mascot';
import { Button } from '@/components/ui/Button';
import { api } from '@lexora/api-client';
import { useAuthStore } from '@/stores/useAuthStore';

export default function SelectPlacementPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const selectedOption = useNewLanguageStore((state) => state.startingOption);
  const setOption = useNewLanguageStore((state) => state.setStartingOption);
  const selectedLanguage = useNewLanguageStore(
    (state) => state.selectedLanguage
  );
  const selectedReasons = useNewLanguageStore((state) => state.selectedReasons);

  const [isSaving, setIsSaving] = useState(false);

  const toggleOption = (option: StartingOptions) => {
    if (selectedOption === option) {
      setOption(null);
    } else {
      setOption(option);
    }
  };

  const handleNext = async () => {
    if (
      !user ||
      !selectedLanguage ||
      !selectedReasons.length ||
      !selectedOption ||
      isSaving
    )
      return;

    const formattedPayload = {
      languageId: selectedLanguage.id,
      learningReasons: selectedReasons,
      startingOption: selectedOption,
    };

    try {
      setIsSaving(true);
      api.languageJourney
        .create(user.accessToken, formattedPayload)
        .then((res) => {
          // Reset store
          useNewLanguageStore.getState().reset();

          if (res.startingOption === 'scratch') {
            router.replace({
              pathname: '/(drawer)/lessons/language/[languageId]',
              params: { languageId: res.languageId },
            });
          } else {
            router.replace({
              pathname: '/(drawer)/lessons/language/[languageId]/assessment',
              params: { languageId: res.languageId },
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaving)
    return (
      <View style={styles.savingContainer}>
        <Text style={styles.savingText}>
          Saving your choises, please wait...
        </Text>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon
            library="Ionicons"
            name="arrow-back"
            size={FontSizes.h1}
            color={Colors.textLight}
          />
        </TouchableOpacity>
        <ProgressIndicator current={3} total={4} />
      </View>

      <View style={styles.mascotWrapper}>
        <Mascot
          text="Let's find the best place to start!"
          direction="right"
          size={MascotSizes.s}
        />
      </View>

      <View style={styles.selectionWrapper}>
        <LanguagePlacementSelection
          selected={selectedOption}
          onSelect={toggleOption}
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          text="FINISH"
          onPress={handleNext}
          theme="purple"
          disabled={!selectedOption || isSaving}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  savingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  savingText: {
    color: Colors.textLight,
    marginBottom: Spacing.l,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.screenGutter,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.m,
  },
  mascotWrapper: {
    marginVertical: Spacing.l,
  },
  selectionWrapper: {
    flex: 1,
    marginBottom: Spacing.l,
  },
  buttonWrapper: {
    marginBottom: Spacing.m,
  },
});
