import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';

interface Props {
  reasons: { label: string; emoji: string }[];
  selected: string[];
  onToggle: (label: string) => void;
}

export default function LanguageReasonSelection({
  reasons,
  selected,
  onToggle,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose one or more:</Text>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {reasons.map(({ label, emoji }) => {
          const isSelected = selected.includes(label);

          return (
            <TouchableOpacity
              key={label}
              onPress={() => onToggle(label)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {emoji} {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
