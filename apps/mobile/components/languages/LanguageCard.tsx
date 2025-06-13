import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import { Language, LanguageJourney } from '@lexora/types';
import { getCefrLevelLabel } from '@/utils/levels';

export interface LanguageCardProps {
  onPress?: () => void;
  languageJourney: LanguageJourney;
}

export default function LanguageCard({
  onPress,
  languageJourney,
}: LanguageCardProps) {
  const [language, setLanguage] = useState<Language>();
  const [levelLabel, setLevelLabel] = useState<string>('');

  useEffect(() => {
    setLanguage(languageJourney.language);
    setLevelLabel(getCefrLevelLabel(languageJourney.placementLevel || ''));
  }, [languageJourney]);

  const handleOnPress = () => {
    if (onPress) {
      onPress();
    }
  };

  // Limit visible reasons to fit within ~300px width
  const MAX_VISIBLE_REASON_WIDTH = 300;
  let visibleReasons: string[] = [];
  let totalWidth = 0;

  for (const reason of languageJourney.learningReasons) {
    const estimatedWidth = reason.length * 7 + 32; // rough estimate
    if (totalWidth + estimatedWidth <= MAX_VISIBLE_REASON_WIDTH) {
      visibleReasons.push(reason);
      totalWidth += estimatedWidth;
    } else {
      break;
    }
  }

  const remainingCount =
    languageJourney.learningReasons.length - visibleReasons.length;

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <View style={styles.card}>
        <View style={styles.contentRow}>
          <View style={styles.rightColumn}>
            <Text style={styles.cardTitle}>
              {language?.flagEmoji} {language?.name}{' '}
              <Text style={styles.cardNativeTitle}>{language?.nativeName}</Text>
            </Text>
            <Text style={styles.cardText}>{levelLabel}</Text>
          </View>
        </View>

        <View style={styles.reasonsWrapper}>
          {visibleReasons.map((reason) => (
            <View key={reason} style={styles.reasonBubble}>
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}
          {remainingCount > 0 && (
            <View style={styles.reasonBubble}>
              <Text style={styles.reasonText}>+{remainingCount} more</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.main,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    minWidth: 335,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.m,
  },
  rightColumn: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.s,
    color: Colors.textLight,
  },
  cardNativeTitle: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
    fontWeight: FontWeights.regular,
  },
  cardText: {
    fontSize: FontSizes.body,
    marginBottom: Spacing.s,
    color: Colors.textLight,
  },
  reasonsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s,
    marginTop: Spacing.s,
  },
  reasonBubble: {
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: Spacing.s,
    paddingVertical: Spacing.s / 1.5,
    borderRadius: BorderRadius.m,
  },
  reasonText: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
});
