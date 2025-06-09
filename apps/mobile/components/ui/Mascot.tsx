import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  MascotSizes,
  Spacing,
} from '@lexora/styles';

type Direction = 'top' | 'bottom' | 'left' | 'right';

interface Props {
  text?: string;
  parts?: (string | { text: string; accent?: boolean })[];
  size?: number;
  direction?: Direction;
}

export default function Mascot({
  text,
  size = MascotSizes.l,
  parts,
  direction = 'top',
}: Props) {
  const bubble = (text || parts) && (
    <View style={styles.bubble}>
      <Text style={styles.text}>
        {parts
          ? parts.map((part, i) =>
              typeof part === 'string' ? (
                part
              ) : (
                <Text key={i} style={part.accent ? styles.accent : styles.text}>
                  {part.text}
                </Text>
              )
            )
          : text}
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        direction === 'left' || direction === 'right'
          ? styles.horizontal
          : styles.vertical,
      ]}
    >
      {(direction === 'top' || direction === 'left') && bubble}

      <Image
        source={require('../../assets/images/lex_cropped.png')}
        style={[{ width: size, height: size }]}
        resizeMode="contain"
      />

      {(direction === 'bottom' || direction === 'right') && bubble}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  vertical: {
    flexDirection: 'column',
    gap: Spacing.s,
  },
  horizontal: {
    flexDirection: 'row',
    gap: Spacing.m,
    alignItems: 'center',
    maxWidth: '100%',
  },
  bubble: {
    backgroundColor: Colors.main,
    borderRadius: BorderRadius.m,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderColor: Colors.border,
    borderWidth: 1,
    shadowColor: Colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: '90%',
    flexShrink: 1,
  },
  text: {
    color: Colors.textLight,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    textAlign: 'left',
  },
  accent: {
    color: Colors.accent,
    fontWeight: FontWeights.bold,
  },
});
