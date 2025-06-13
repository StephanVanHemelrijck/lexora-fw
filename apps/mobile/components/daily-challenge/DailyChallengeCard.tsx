import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import { Icon } from '../ui/Icon';
import { useRouter } from 'expo-router';

export default function DailyChallengeCard() {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push('/(drawer)/daily-challenge')}
      style={styles.container}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title}>Daily Challenge</Text>
        <Text style={styles.text}>
          Learn <Text style={styles.accent}>5</Text> new words today and earn up
          to <Text style={styles.accent}>50 XP</Text>!
        </Text>
      </View>

      <Icon
        library="Ionicons"
        name="chevron-forward"
        size={FontSizes.h1}
        color={Colors.textLight}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.main,
    padding: Spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.m,
    borderRadius: BorderRadius.m,
  },
  textContainer: {
    flex: 1, // ✅ Ensures it takes all available space beside icon
  },
  title: {
    color: Colors.textLight,
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.m,
  },
  text: {
    color: Colors.textLight,
    flexWrap: 'wrap',
  },
  accent: {
    color: Colors.accent,
    fontWeight: FontWeights.bold,
  },
});
