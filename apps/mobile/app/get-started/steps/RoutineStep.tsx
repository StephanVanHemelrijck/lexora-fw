import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

const ROUTINE_OPTIONS = [
  { label: 'Very Light', emoji: '🧘', minutes: 5 },
  { label: 'Casual', emoji: '🚶', minutes: 10 },
  { label: 'Regular', emoji: '🏃', minutes: 15 },
  { label: 'Focused', emoji: '💪', minutes: 30 },
  { label: 'Intense', emoji: '🔥', minutes: 45 },
  { label: 'Hardcore', emoji: '⚡', minutes: 60 },
];

export default function RoutineStep() {
  const { nextStep, routineMinutes, setRoutineMinutes } = useOnboardingStore();

  const handleNextStep = () => {
    if (!routineMinutes) return;
    nextStep();
  };

  return (
    <View style={styles.container}>
      <View style={styles.mascotWrapper}>
        <Mascot
          text="How much time do you want to spend learning each day?"
          direction="right"
          size={MascotSizes.s}
        />
      </View>

      <Text style={styles.heading}>Select your daily routine</Text>

      <View style={styles.options}>
        {ROUTINE_OPTIONS.map(({ label, emoji, minutes }) => (
          <TouchableOpacity
            key={label}
            onPress={() => setRoutineMinutes(minutes)}
            style={[
              styles.card,
              routineMinutes === minutes && styles.cardSelected,
            ]}
          >
            <Text
              style={[
                styles.cardText,
                routineMinutes === minutes && styles.cardTextSelected,
              ]}
            >
              {emoji} {label} – {minutes} min
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        onPress={handleNextStep}
        text="CONTINUE"
        theme="purple"
        disabled={!routineMinutes}
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
  options: {
    flex: 1,
    gap: Spacing.s,
    paddingBottom: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: Colors.accent,
    backgroundColor: `${Colors.accent}10`,
  },
  cardText: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  cardTextSelected: {
    color: Colors.accent,
    fontWeight: FontWeights.bold,
  },
});
