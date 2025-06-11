import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors, FontSizes, MascotSizes, Spacing } from '@lexora/styles';
import { Language } from '@lexora/types';
import { api } from '@lexora/api-client';
import LanguageSelection from '@/components/languages/LanguageSelection';
import { Icon } from '@/components/ui/Icon';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import Mascot from '@/components/ui/Mascot';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { useNewLanguageStore } from '@/stores/useNewLanguageStore';

export default function SelectLanguagePage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const selectedLanguage = useNewLanguageStore(
    (state) => state.selectedLanguage
  );
  const setLanguage = useNewLanguageStore((state) => state.setLanguage);

  const router = useRouter();

  useEffect(() => {
    api.languages
      .getSupportedLanguages()
      .then(setLanguages)
      .catch(console.error);
  }, []);

  const handleNext = () => {
    if (selectedLanguage) {
      router.push('/(drawer)/new-language/select-reasons');
    }
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
        <ProgressIndicator current={1} total={4} />
      </View>

      <View style={styles.mascotWrapper}>
        <Mascot
          text="Select the language you want to start learning."
          direction="right"
          size={MascotSizes.s}
        />
      </View>

      <LanguageSelection
        languages={languages}
        onSelect={setLanguage}
        key={'select-language'}
        selectedLanguage={selectedLanguage}
      />

      <Button
        text="NEXT"
        onPress={handleNext}
        theme="purple"
        disabled={!selectedLanguage}
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
