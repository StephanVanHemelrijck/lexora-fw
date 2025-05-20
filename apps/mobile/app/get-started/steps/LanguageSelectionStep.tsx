import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Mascot from '@/components/ui/Mascot';
import {
  Colors,
  FontSizes,
  FontWeights,
  MascotSizes,
  Spacing,
} from '@lexora/styles';

export default function LanguageSelectionStep() {
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
    color: Colors.textLight,
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.l,
  },
});
