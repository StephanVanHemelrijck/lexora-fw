import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';

interface DailyGoalProps {
  current: number;
  goal: number;
}

export default function DailyGoalCard({ current = 0, goal }: DailyGoalProps) {
  const [hasExceeded, setHasExceeded] = React.useState(false);

  React.useEffect(() => {
    if (current > goal) {
      setHasExceeded(true);
    }
  }, [current, goal]);

  return (
    <View style={styles.container}>
      <ProgressIndicator current={current} total={goal} height="thin" />
      <View style={styles.body}>
        <View style={styles.bodyLeft}>
          <Text style={styles.title}>Daily Goal</Text>
          <Text style={styles.caption}>
            {hasExceeded
              ? 'You have exceeded your daily goal'
              : `Just ${goal - current} minutes left to hit your daily goal!`}
          </Text>
        </View>
        <View style={styles.bodyRight}>
          <View style={styles.goalTotalRow}>
            <Text style={styles.goalCurrent}>
              {hasExceeded ? goal : current}
            </Text>
            <Text style={styles.goalUnit}>min</Text>
          </View>
          <View style={styles.dividerLine} />
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.s,
  },
  goalCurrent: {
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.regular,
    color: Colors.textLight,
  },
  dividerLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.textLight,
  },
  goalTotalRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
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
