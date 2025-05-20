import { StyleSheet, View } from 'react-native';
import { Colors, BorderRadius } from '@lexora/styles';

interface Props {
  current: number;
  total: number;
}

export function ProgressIndicator({ current, total }: Props) {
  const progress = Math.min(current / total, 1); // prevent overflow
  const progressPercentage = Math.round(progress * 100);

  return (
    <View style={styles.barBackground}>
      <View style={[styles.barFill, { width: `${progressPercentage}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  barBackground: {
    flexGrow: 1,
    maxHeight: 16,
    height: 16,
    borderRadius: BorderRadius.m,
    backgroundColor: Colors.textDark,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.m,
  },
});
