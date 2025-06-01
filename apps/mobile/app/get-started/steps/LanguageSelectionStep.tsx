import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Mascot from '@/components/ui/Mascot';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  MascotSizes,
  Spacing,
} from '@lexora/styles';
import { api } from '@lexora/api-client';
import { useLanguagesStore } from '@/stores/useLanguagesStore';
import { Button } from '@/components/ui/Button';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { Language } from '@lexora/types';

export default function LanguageSelectionStep() {
  const { getLanguages } = useLanguagesStore();
  const { nextStep, setLanguage, selectedLanguage } = useOnboardingStore();
  const [languages, setLangauges] = useState<Language[]>([]);

  const handleNextStep = () => {
    if (!selectedLanguage) return;
    nextStep();
  };

  useEffect(() => {
    const resolve = async () => {
      try {
        console.log('getLanguages');

        const langs = await api.languages.getSupportedLanguages();

        setLangauges(langs);
      } catch (err) {
        console.error(err);
        throw err;
      }
    };

    resolve();
  }, [getLanguages]);

  return (
    <View style={styles.container}>
      <View style={styles.mascotWrapper}>
        <Mascot
          text="Pick the language you want to master!"
          direction="right"
          size={MascotSizes.s}
        />
      </View>

      <Text style={styles.title}>Language Selection</Text>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {languages?.map((language) => {
          const isSelected = language.id === selectedLanguage?.id;
          return (
            <TouchableOpacity
              key={language.id}
              onPress={() => setLanguage(language)}
              style={[styles.rowCard, isSelected && styles.selected]}
            >
              <View style={styles.rowContent}>
                <Text style={styles.emoji}>{language.flagEmoji}</Text>
                <View style={styles.nameContainer}>
                  <Text
                    style={[styles.name, isSelected && styles.selectedText]}
                  >
                    {language.name}
                  </Text>
                  <Text style={styles.nativeName}>{language.nativeName}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Button
        text="CONTINUE"
        onPress={handleNextStep}
        theme="purple"
        disabled={!selectedLanguage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mascotWrapper: {
    marginVertical: Spacing.l,
  },
  title: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
    marginBottom: Spacing.l,
  },
  list: {
    gap: Spacing.s,
    paddingBottom: Spacing.xl,
  },
  rowCard: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    width: '100%',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.m,
  },
  emoji: {
    fontSize: FontSizes.h1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.s,
  },
  name: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    color: Colors.textLight,
  },
  nativeName: {
    fontSize: FontSizes.caption,
    color: Colors.disabled,
  },
  selected: {
    borderColor: Colors.accent,
    borderWidth: 2,
    backgroundColor: `${Colors.accent}10`,
  },
  selectedText: {
    color: Colors.accent,
  },
});
