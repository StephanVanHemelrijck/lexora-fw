import { Colors, FontSizes, FontWeights, Spacing } from '@lexora/styles';
import { ReadingComprehensionQuestionData } from '@lexora/types';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';

interface Props {
  questionData: ReadingComprehensionQuestionData;
  onAnswer: (selected: string) => void;
  selected?: string;
}

export default function ReadingComprehensionQuestion({
  questionData,
  onAnswer,
  selected = '',
}: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    setSelectedOption(selected);
  }, [selected]);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onAnswer(option);
  };

  return (
    <View>
      <Text style={styles.title}>Reading Comprehension</Text>
      <Text style={styles.paragraph}>{questionData.paragraph}</Text>
      <Text style={styles.question}>{questionData.question}</Text>

      <View>
        {questionData.options.map((option, index) => {
          const isSelected = selectedOption === option;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.optionButton, isSelected && styles.selectedOption]}
              onPress={() => handleSelect(option)}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.textLight,
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.s,
  },
  paragraph: {
    color: Colors.textLight,
    fontSize: FontSizes.body,
    marginBottom: Spacing.m,
    lineHeight: 22,
  },
  question: {
    color: Colors.textLight,
    fontSize: FontSizes.h3,
    marginBottom: Spacing.m,
  },
  optionButton: {
    padding: Spacing.m,
    backgroundColor: Colors.inputBackground,
    borderRadius: 10,
    marginBottom: Spacing.s,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedOption: {
    backgroundColor: `${Colors.accent}10`,
    borderColor: Colors.accent,
  },
  optionText: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: Colors.accent,
  },
});
