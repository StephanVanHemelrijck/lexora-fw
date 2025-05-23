import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
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
  { label: 'Casual', emoji: '🚶', minutes: 5 },
  { label: 'Regular', emoji: '🏃', minutes: 15 },
  { label: 'Intensive', emoji: '🏋️', minutes: 30 },
  { label: 'Hardcore', emoji: '🔥', minutes: 60 },
  { label: 'Custom', emoji: '🛠️', minutes: -1 },
];

export default function RoutineStep() {
  const { nextStep, routineMinutes, setRoutineMinutes } = useOnboardingStore();
  const [customMinutes, setCustomMinutes] = useState(10);

  const selectedMinutes = useMemo(() => {
    const match = ROUTINE_OPTIONS.find((opt) => opt.minutes === routineMinutes);
    return match ? routineMinutes : -1;
  }, [routineMinutes]);

  const isCustomSelected = selectedMinutes === -1;
  const effectiveMinutes = isCustomSelected ? customMinutes : routineMinutes;

  const handleSelect = (minutes: number) => {
    if (minutes === -1) {
      setRoutineMinutes(-1); // triggers custom slider
    } else {
      setRoutineMinutes(minutes);
    }
  };

  const handleNextStep = () => {
    if (!effectiveMinutes) return;
    setRoutineMinutes(effectiveMinutes);
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
            onPress={() => handleSelect(minutes)}
            style={[
              styles.card,
              selectedMinutes === minutes && styles.cardSelected,
            ]}
          >
            <Text
              style={[
                styles.cardText,
                selectedMinutes === minutes && styles.cardTextSelected,
              ]}
            >
              {emoji} {label}
              {minutes > 0 && ` – ${minutes} min`}
            </Text>
          </TouchableOpacity>
        ))}

        {isCustomSelected && (
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>{customMinutes} min</Text>
            <Slider
              minimumValue={5}
              maximumValue={120}
              step={5}
              value={customMinutes}
              onValueChange={setCustomMinutes}
              minimumTrackTintColor={Colors.accent}
              maximumTrackTintColor={Colors.disabled}
              thumbTintColor={Colors.accent}
            />
          </View>
        )}
      </View>

      <Button
        onPress={handleNextStep}
        text="CONTINUE"
        theme="purple"
        disabled={!effectiveMinutes}
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
  sliderContainer: {
    marginTop: Spacing.m,
    paddingHorizontal: Spacing.s,
  },
  sliderLabel: {
    fontSize: FontSizes.caption,
    color: Colors.accent,
    textAlign: 'center',
    marginBottom: Spacing.s,
  },
});
