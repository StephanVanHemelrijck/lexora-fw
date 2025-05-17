import { Colors, FontSizes, Spacing } from '@lexora/styles';
import { ReadingComprehensionQuestionData } from '@lexora/types';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

interface Props {
  questionData: ReadingComprehensionQuestionData;
  onAnswer: (subIndex: number, selected: string) => void;
  selected?: Record<number, string>;
}

export default function ReadingComprehensionQuestion({
  questionData,
  onAnswer,
  selected = {},
}: Props) {
  const handleSelect = (subIndex: number, option: string) => {
    const alreadySelected = selected[subIndex] === option;
    onAnswer(subIndex, alreadySelected ? '' : option);
  };

  return (
    <View>
      <Text style={styles.title}>Reading Comprehension</Text>
      <Text style={styles.paragraph}>{questionData.paragraph}</Text>

      {questionData.questions.map((q, index) => (
        <View key={index} style={styles.questionBlock}>
          <Text style={styles.question}>{q.question}</Text>

          {q.options.map((option, optIndex) => {
            const isSelected = selected[index] === option;
            return (
              <TouchableOpacity
                key={optIndex}
                onPress={() => handleSelect(index, option)}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedOption,
                ]}
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
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.textLight,
    fontSize: FontSizes.h1,
    marginBottom: Spacing.m,
  },
  paragraph: {
    color: Colors.textLight,
    fontSize: FontSizes.body,
    marginBottom: Spacing.l,
    lineHeight: 22,
  },
  questionBlock: {
    marginBottom: Spacing.l,
  },
  question: {
    color: Colors.accent,
    fontSize: FontSizes.h2,
    marginBottom: Spacing.s,
  },
  optionButton: {
    padding: Spacing.m,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    marginBottom: Spacing.s,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedOption: {
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
