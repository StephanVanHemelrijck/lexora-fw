import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Answer, MultipleChoiceQuestionData } from '@lexora/types';

interface Props {
  questionData: MultipleChoiceQuestionData;
  onAnswer: (selected: string | null) => void;
  selected: string | null;
}

export function MultipleChoiceQuestion({
  questionData,
  onAnswer,
  selected,
}: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    setSelectedOption(selected ?? null);
  }, [selected]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (selectedOption === option) {
      setSelectedOption(null);
      onAnswer(null);

      return;
    }

    onAnswer(option);
  };

  return (
    <View>
      <Text style={styles.title}>Select the correct answer</Text>
      <Text style={styles.question}>{questionData.question}</Text>

      <View style={styles.optionContainer}>
        {questionData.options.map((option, index) => {
          const isSelected = option === selectedOption;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleOptionSelect(option)}
              style={[
                styles.optionButton,
                isSelected && styles.selectedOptionButton,
              ]}
              activeOpacity={0.8}
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
    marginBottom: Spacing.m,
  },
  question: {
    color: Colors.textLight,
    fontSize: FontSizes.h3,
    marginBottom: Spacing.m,
  },
  optionContainer: {
    gap: Spacing.s,
  },
  optionButton: {
    padding: Spacing.m,
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.m,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedOptionButton: {
    backgroundColor: `${Colors.accent}10`,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  optionText: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  selectedOptionText: {
    color: Colors.accent,
  },
});
