import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';

export default function PlacementStep() {
  const { nextStep, startingOption, setStartingOption } = useOnboardingStore();

  const handleSelect = (option: 'placement' | 'scratch') => {
    setStartingOption(startingOption === option ? null : option);
  };

  const isSelected = (option: 'placement' | 'scratch') =>
    startingOption === option;

  return (
    <View style={styles.container}>
      <View style={styles.mascotWrapper}>
        <Mascot
          text="Let's find the best place to start!"
          direction="right"
          size={MascotSizes.s}
        />
      </View>

      <Text style={styles.title}>Choose your starting point</Text>

      <View style={styles.options}>
        <TouchableOpacity
          style={[styles.card, isSelected('scratch') && styles.cardSelected]}
          onPress={() => handleSelect('scratch')}
        >
          <View style={styles.row}>
            <Icon
              library="Ionicons"
              name="refresh-outline"
              size={48}
              color={Colors.accent}
            />
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Start from Scratch</Text>
              <View style={styles.pill}>
                <Text style={styles.pillText}>RECOMMENDED</Text>
              </View>
              <Text style={styles.cardDescription}>
                Begin at the very basics and work your way up step-by-step.
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, isSelected('placement') && styles.cardSelected]}
          onPress={() => handleSelect('placement')}
        >
          <View style={styles.row}>
            <Icon
              library="Ionicons"
              name="analytics"
              size={48}
              color={Colors.accent}
            />
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Placement Test</Text>
              <Text style={styles.cardDescription}>
                A short test to determine your level and get the most relevant
                exercises.
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <Button
        onPress={nextStep}
        text="CONTINUE"
        theme="purple"
        disabled={!startingOption}
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
  options: {
    gap: Spacing.l,
    flex: 1,
  },
  card: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  cardSelected: {
    borderColor: Colors.accent,
    backgroundColor: `${Colors.accent}10`,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.m,
  },
  textContainer: {
    flex: 1,
    gap: Spacing.s,
  },
  cardTitle: {
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
  cardDescription: {
    fontSize: FontSizes.body,
    color: Colors.disabled,
  },
  pill: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.s,
    paddingVertical: 2,
    borderRadius: BorderRadius.l,
    position: 'absolute',
    top: -Spacing.l,
    right: -Spacing.m * 2,
  },
  pillText: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.bold,
    color: Colors.textDark,
  },
});
