import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, BorderRadius } from '@lexora/styles';

interface Props {
  current: number;
  total: number;
  height?: 'thin' | 'thick';
  type?: 'line' | 'circle';
  size?: number;
}

export function ProgressIndicator({
  current,
  total,
  height = 'thick',
  type = 'line',
  size = 48,
}: Props) {
  const progress = Math.min(current / total, 1);
  const progressPercentage = Math.round(progress * 100);

  if (type === 'circle') {
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - progress * circumference;

    return (
      <View style={[styles.circleWrapper, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            stroke={Colors.textDarker}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke={Colors.accent}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
      </View>
    );
  }

  // line variant
  const lineHeight = height === 'thin' ? 8 : 16;

  return (
    <View style={[styles.barBackground, { height: lineHeight }]}>
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
    backgroundColor: Colors.textDarker,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.m,
  },
  circleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
