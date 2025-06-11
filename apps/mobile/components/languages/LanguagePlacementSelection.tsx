import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import { Icon } from '@/components/ui/Icon';
import { StartingOptions } from '@lexora/types';

interface Props {
  selected?: StartingOptions | null;
  onSelect: (option: StartingOptions) => void;
}

export default function LanguagePlacementSelection({
  selected,
  onSelect,
}: Props) {
  const isSelected = (option: StartingOptions | null) => selected === option;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your starting point</Text>

      <View style={styles.options}>
        <TouchableOpacity
          style={[
            styles.card,
            isSelected('scratch' as StartingOptions) && styles.cardSelected,
          ]}
          onPress={() => onSelect('scratch' as StartingOptions)}
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
          style={[
            styles.card,
            isSelected('placement' as StartingOptions) && styles.cardSelected,
          ]}
          onPress={() => onSelect('placement' as StartingOptions)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
    marginBottom: Spacing.l,
  },
  options: {
    gap: Spacing.l,
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
