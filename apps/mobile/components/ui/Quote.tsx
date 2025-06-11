import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Colors, FontSizes, FontStyles, Spacing } from '@lexora/styles';

interface Props {
  title: string;
  quote: string;
}

export default function Quote({ title, quote }: Props) {
  return (
    <View style={styles.quoteSection}>
      <Text style={styles.quoteTitle}>{title}</Text>
      <Text style={styles.quote}>{quote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  quoteSection: {
    alignItems: 'center',
  },
  quoteTitle: {
    fontSize: FontSizes.h2,
    fontWeight: 'bold',
    color: Colors.accent,
    marginBottom: Spacing.s,
  },
  quote: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
    fontStyle: FontStyles.italic,
    textAlign: 'center',
  },
});
