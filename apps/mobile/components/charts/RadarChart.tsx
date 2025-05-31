import React from 'react';
import { View } from 'react-native';
import { RadarChart } from '@salmonco/react-native-radar-chart';
import { Colors, FontSizes } from '@lexora/styles';

export default function RadarChartComponent({ size = 100 }: { size?: number }) {
  // ✅ Ensure the size is finite and positive
  const safeSize = Number.isFinite(size) && size > 0 ? size : 100;
  const isCompact = safeSize < 120;

  const skills = [
    { label: 'Grammar', value: 70 },
    { label: 'Vocab', value: 60 },
    { label: 'Speaking', value: 50 },
    { label: 'Listening', value: 90 },
    { label: 'Reading', value: 65 },
  ];

  return (
    <View style={{ width: safeSize, height: safeSize }}>
      <RadarChart
        data={skills}
        maxValue={100}
        gradientColor={{
          startColor: 'rgba(255, 255, 255, 0)',
          endColor: 'rgba(255, 255, 255, 0)',
          count: 1,
        }}
        stroke={Array(skills.length).fill('rgba(255, 255, 255, 0)')}
        strokeWidth={Array(skills.length).fill(1)}
        strokeOpacity={Array(skills.length).fill(0)}
        labelColor={isCompact ? 'rgba(255, 255, 255, 0)' : Colors.textLight}
        labelSize={isCompact ? 0 : FontSizes.caption}
        labelDistance={1}
        dataFillColor={Colors.accent}
        dataFillOpacity={0.6}
        dataStroke={Colors.accent}
        dataStrokeWidth={2}
        isCircle
        size={safeSize}
      />
    </View>
  );
}
