import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Language } from '@lexora/types';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';

interface Props {
  languages: Language[];
  selectedLanguage?: Language;
  onSelect: (language: Language) => void;
}

export default function LanguageSelection({
  languages,
  selectedLanguage,
  onSelect,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Language</Text>
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {languages.map((language) => {
          const isSelected = selectedLanguage?.id === language.id;

          return (
            <TouchableOpacity
              key={language.id}
              style={[styles.rowCard, isSelected && styles.selected]}
              onPress={() => onSelect(language)}
            >
              <View style={styles.rowContent}>
                <Text style={styles.emoji}>{language.flagEmoji}</Text>
                <View style={styles.nameContainer}>
                  <Text
                    style={[styles.name, isSelected && styles.selectedText]}
                  >
                    {language.name}
                  </Text>
                  <Text style={styles.nativeName}>{language.nativeName}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingBottom: Spacing.xl,
    gap: Spacing.s,
  },
  rowCard: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    width: '100%',
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.m,
  },
  emoji: {
    fontSize: FontSizes.h1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.s,
  },
  name: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    color: Colors.textLight,
  },
  nativeName: {
    fontSize: FontSizes.caption,
    color: Colors.disabled,
  },
  selected: {
    borderColor: Colors.accent,
    borderWidth: 2,
    backgroundColor: `${Colors.accent}10`,
  },
  selectedText: {
    color: Colors.accent,
  },
  title: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
    marginBottom: Spacing.l,
  },
});
