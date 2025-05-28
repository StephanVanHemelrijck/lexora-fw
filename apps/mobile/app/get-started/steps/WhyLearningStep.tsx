import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Mascot from '@/components/ui/Mascot';
import {
  Colors,
  FontSizes,
  FontWeights,
  MascotSizes,
  Spacing,
  BorderRadius,
} from '@lexora/styles';
import { Button } from '@/components/ui/Button';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

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

export default function WhyLearningStep() {
  const { nextStep, learningReasons, toggleLearningReason, selectedLanguage } =
    useOnboardingStore();

  const handleToggle = (reason: string) => {
    if (learningReasons.includes(reason)) {
      toggleLearningReason(learningReasons.filter((r) => r !== reason));
    } else {
      toggleLearningReason([...learningReasons, reason]);
    }
  };

  const handleNextStep = () => {
    if (learningReasons.length) nextStep();
  };

  return (
    <View style={styles.container}>
      <View style={styles.mascotWrapper}>
        <Mascot
          text={`Why do you want to learn ${
            selectedLanguage?.name || 'a language'
          }?`}
          direction="right"
          size={MascotSizes.s}
        />
      </View>

      <Text style={styles.heading}>Choose one or more:</Text>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {REASONS.map(({ label, emoji }) => (
          <TouchableOpacity
            key={label}
            onPress={() => handleToggle(label)}
            style={[
              styles.option,
              learningReasons.includes(label) && styles.optionSelected,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                learningReasons.includes(label) && styles.optionTextSelected,
              ]}
            >
              {emoji} {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Button
        text="CONTINUE"
        onPress={handleNextStep}
        theme="purple"
        disabled={!learningReasons.length}
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
  heading: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
    marginBottom: Spacing.l,
  },
  list: {
    gap: Spacing.s,
    paddingBottom: Spacing.xl,
  },
  option: {
    backgroundColor: Colors.inputBackground,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: Colors.accent,
    backgroundColor: `${Colors.accent}10`,
  },
  optionText: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  optionTextSelected: {
    color: Colors.accent,
    fontWeight: FontWeights.bold,
  },
});
