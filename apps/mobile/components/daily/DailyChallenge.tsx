import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ProgressIndicator } from '../ui/ProgessIndicator';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';

interface DailyChallengeProps {
  current: number;
  goal: number;
}

export default function DailyChallenge({
  current = 0,
  goal,
}: DailyChallengeProps) {
  return (
    <View style={styles.container}>
      <ProgressIndicator current={current} total={goal} height="thin" />
      <View style={styles.body}>
        <View style={styles.bodyLeft}>
          <Text style={styles.title}>Daily Goal</Text>
          <Text style={styles.caption}>
            Just {goal - current} minutes left to hit your daily goal!
          </Text>
        </View>
        <View style={styles.bodyRight}>
          <Text style={styles.goalCurrent}>{current}</Text>
          <Text style={styles.goalDivider}>/</Text>
          <View style={styles.goalTotalRow}>
            <Text style={styles.goalTotal}>{goal}</Text>
            <Text style={styles.goalUnit}>min</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.m,
    backgroundColor: Colors.main,
    borderRadius: BorderRadius.m,
  },
  body: {
    marginTop: Spacing.s,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bodyLeft: {
    flexDirection: 'column',
    gap: Spacing.s,
    width: '70%',
  },
  title: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
  caption: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  bodyRight: {
    flexDirection: 'row',
    position: 'relative',
    flex: 1,
    height: '100%',
  },
  goalCurrent: {
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.regular,
    position: 'absolute',
    left: 0,
    top: 5,
    color: Colors.textLight,
  },
  goalDivider: {
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.bold,
    position: 'absolute',
    left: 31,
    top: 19,
    color: Colors.textLight,
  },
  goalTotalRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'absolute',
    right: 0,
    bottom: 5,
  },
  goalTotal: {
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.regular,
    color: Colors.textLight,
  },
  goalUnit: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.regular,
    marginLeft: 2,
    marginBottom: 2,
    color: Colors.textLight,
  },
});
