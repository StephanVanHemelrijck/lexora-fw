import React from 'react';
import { View } from 'react-native';
import { RadarChart } from '@salmonco/react-native-radar-chart';
import { Colors, FontSizes } from '@lexora/styles';

export default function RadarChartComponent({ size = 100 }: { size?: number }) {
  const skills = [
    { label: 'Grammar', value: 70 },
    { label: 'Vocab', value: 60 },
    { label: 'Speaking', value: 50 },
    { label: 'Listening', value: 90 },
    { label: 'Reading', value: 65 },
  ];

  return (
    <View style={styles.radar}>
      <RadarChart
        data={skills}
        maxValue={100}
        gradientColor={{
          startColor: '#ffffff00',
          endColor: '#ffffff00',
          count: 1,
        }}
        stroke={Array(5).fill('#ffffff00')}
        strokeWidth={Array(5).fill(1)}
        strokeOpacity={Array(5).fill(0)}
        labelColor={size < 120 ? '#ffffff00' : Colors.textLight}
        labelSize={size < 120 ? 0 : FontSizes.caption} // ✅ Safe fallback
        labelDistance={1.05}
        dataFillColor={Colors.accent}
        dataFillOpacity={0.6}
        // divisionStrokeOpacity={0}
        dataStroke={Colors.accent}
        dataStrokeWidth={2}
        isCircle
        size={size}
      />
    </View>
  );
}

const styles = {
  radar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
};
