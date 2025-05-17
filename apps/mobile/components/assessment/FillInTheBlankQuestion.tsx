import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors, FontSizes, Spacing } from '@lexora/styles';
import { FillInTheBlankQuestionData } from '@lexora/types';

interface Props {
  questionData: FillInTheBlankQuestionData;
  onAnswer: (answer: string) => void;
  selected?: string;
}

export function FillInTheBlankQuestion({
  questionData,
  onAnswer,
  selected,
}: Props) {
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const handleInputChange = (text: string) => {
    setInput(text);
    onAnswer(text);
  };

  useEffect(() => {
    setInput(selected ?? '');
  }, [selected]);

  return (
    <View>
      <Text style={styles.title}>Fill in the blank</Text>
      <Text style={styles.question}>{questionData.sentence}</Text>

      <TextInput
        style={styles.input}
        placeholder="Type your answer"
        placeholderTextColor={Colors.textLight}
        value={input}
        onChangeText={handleInputChange}
      />

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowHint((prev) => !prev)}
      >
        <Text style={styles.toggleText}>
          {showHint ? 'Hide hint' : 'Show hint'}
        </Text>
      </TouchableOpacity>

      {showHint && questionData.hint && (
        <Text style={styles.metaText}>Hint: {questionData.hint}</Text>
      )}

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowTranslation((prev) => !prev)}
      >
        <Text style={styles.toggleText}>
          {showTranslation ? 'Hide translation' : 'Show translation'}
        </Text>
      </TouchableOpacity>

      {showTranslation && questionData.expected_translation && (
        <Text style={styles.metaText}>
          Translation: {questionData.expected_translation}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: Colors.textLight,
    fontSize: FontSizes.h1,
    marginBottom: Spacing.m,
  },
  question: {
    color: Colors.accent,
    fontSize: FontSizes.h2,
    marginBottom: Spacing.m,
  },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.textLight,
    padding: Spacing.m,
    borderRadius: 10,
    fontSize: FontSizes.body,
    marginBottom: Spacing.s,
  },
  toggleButton: {
    marginVertical: 4,
  },
  toggleText: {
    color: Colors.actionButton,
    fontSize: FontSizes.body,
  },
  metaText: {
    color: Colors.textLight,
    fontSize: FontSizes.caption,
    marginBottom: Spacing.s,
  },
});
