import { Colors, FontSizes, Spacing } from '@lexora/styles';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MultipleChoiceQuestionData } from '@lexora/types';

interface Props {
  questionData: MultipleChoiceQuestionData;
  onAnswer: (selected: string, isCorrect: boolean) => void;
  selected?: string;
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
      onAnswer('', false);
      return;
    }

    const isCorrect =
      option ===
      questionData.options[questionData.correct_answer.charCodeAt(0) - 65];
    onAnswer(option, isCorrect);
  };

  return (
    <View>
      <Text style={styles.title}>Select the correct answer</Text>
      <Text style={styles.question}>{questionData.question}</Text>

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
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.textLight,
    fontSize: FontSizes.h1,
    marginBottom: Spacing.l,
  },
  question: {
    color: Colors.accent,
    fontSize: FontSizes.h2,
    marginBottom: Spacing.m,
  },
  optionButton: {
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    marginBottom: Spacing.s,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedOptionButton: {
    backgroundColor: Colors.highlight,
    borderColor: Colors.highlightDark,
  },
  optionText: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: Colors.textDark,
  },
});
