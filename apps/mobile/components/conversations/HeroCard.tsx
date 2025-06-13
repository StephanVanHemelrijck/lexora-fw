import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Button } from '../ui/Button';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import { useRouter } from 'expo-router';

export default function HeroCard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>
          <Text style={styles.accent}>Converse</Text>,{' '}
          <Text style={styles.accent}>Learn</Text>, and{' '}
          <Text style={styles.accent}>Improve</Text> with AI!
        </Text>
        <Text style={styles.text}>
          Whether you&apos;re ordering coffee or practicing for a big
          presentation, our AI is here to help you speak fluently and
          confidently, wherever, whenever!
        </Text>
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          text="Try it out"
          onPress={() => router.push('/(drawer)/conversation')}
          theme="purple"
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.m,
    backgroundColor: Colors.main,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
  },
  textWrapper: {
    gap: Spacing.s,
  },
  title: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
  text: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  accent: {
    color: Colors.accent,
  },
  buttonWrapper: {
    marginTop: Spacing.s,
    width: '50%',
  },
  button: {
    paddingVertical: Spacing.s,
  },
});
