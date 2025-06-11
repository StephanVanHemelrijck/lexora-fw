import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Colors, FontSizes, MascotSizes, Spacing } from '@lexora/styles';
import { useRouter } from 'expo-router';
import { useNewLanguageStore } from '@/stores/useNewLanguageStore';
import { StartingOptions } from '@lexora/types';
import LanguagePlacementSelection from '@/components/languages/LanguagePlacementSelection';
import { Icon } from '@/components/ui/Icon';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import Mascot from '@/components/ui/Mascot';
import { Button } from '@/components/ui/Button';

export default function SelectPlacementPage() {
  const router = useRouter();
  const selectedOption = useNewLanguageStore((state) => state.startingOption);
  const setOption = useNewLanguageStore((state) => state.setStartingOption);

  const handleSelect = (option: StartingOptions) => {
    if (option === selectedOption) {
      setOption(null as any); // or safely allow null in store type
    } else {
      setOption(option);
    }
  };

  const handleNext = () => {
    console.log('Submit onboarding', {
      language: useNewLanguageStore.getState().selectedLanguage,
      reasons: useNewLanguageStore.getState().selectedReasons,
      start: useNewLanguageStore.getState().startingOption,
    });
    // Example: Submit data or navigate somewhere
  };

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

      <LanguagePlacementSelection
        selected={selectedOption}
        onSelect={handleSelect}
      />

      <Button
        text="FINISH"
        onPress={handleNext}
        theme="purple"
        disabled={!selectedOption}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
