import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import RadarChartComponent from '../charts/RadarChart';
import { Language } from '@lexora/types';
import { useLanguagesStore } from '@/stores/useLanguagesStore';

export interface LanguageCardProps {
  onPress?: () => void;
  languageId: string;
}

export default function LanguageCard({
  onPress,
  languageId,
}: LanguageCardProps) {
  const [language, setLanguage] = useState<Language>();

  const { getLanguageById } = useLanguagesStore();

  useEffect(() => {
    const resolve = async () => {
      try {
        const lang = await getLanguageById(languageId);
        setLanguage(lang);
      } catch (err) {
        console.error(err);
        throw err;
      }
    };

    resolve();
  }, [languageId, getLanguageById]);

  const handleOnPress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity onPress={handleOnPress}>
      <View style={styles.card}>
        <View style={styles.contentRow}>
          {/* Chart (Left Column) */}
          <View style={styles.chartWrapper}>
            <RadarChartComponent size={100} />
          </View>

          {/* Text + Buttons (Right Column) */}
          <View style={styles.rightColumn}>
            <Text style={styles.cardTitle}>
              {language?.flagEmoji} {language?.name}
            </Text>
            <Text style={styles.cardText}>A2 - Elementary</Text>
            <Text style={styles.cardText}>11% Complete</Text>
          </View>
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
  chartWrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'center',
    height: 100,
  },

  cardTitle: {
    fontSize: FontSizes.h3,
    fontWeight: 'bold',
    marginBottom: Spacing.s,
    color: Colors.textLight,
  },
  cardText: {
    fontSize: FontSizes.body,
    marginBottom: Spacing.s,
    color: Colors.textLight,
  },
});
