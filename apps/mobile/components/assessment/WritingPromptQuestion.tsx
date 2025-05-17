import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { Colors, FontSizes, Spacing } from '@lexora/styles';
import { WritingPromptQuestionData } from '@lexora/types';

interface Props {
  questionData: WritingPromptQuestionData;
  onAnswer: (text: string) => void;
  selected?: string;
}

export default function WritingPromptQuestion({
  questionData,
  onAnswer,
  selected,
}: Props) {
  const [input, setInput] = useState('');

  useEffect(() => {
    setInput(selected || '');
  }, [selected]);

  const handleChange = (text: string) => {
    setInput(text);
    onAnswer(text);
  };

  return (
    <View>
      <Text style={styles.title}>Writing Prompt</Text>
      <Text style={styles.prompt}>{questionData.prompt}</Text>
      <Text style={styles.lengthHint}>
        Expected: {questionData.expected_length}
      </Text>

      <TextInput
        style={styles.input}
        multiline
        placeholder="Write your answer..."
        placeholderTextColor={Colors.textLight}
        onChangeText={handleChange}
        value={input}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    color: Colors.textLight,
    fontSize: FontSizes.h1,
    marginBottom: Spacing.s,
  },
  prompt: {
    color: Colors.accent,
    fontSize: FontSizes.h2,
    marginBottom: Spacing.s,
  },
  lengthHint: {
    color: Colors.textLight,
    fontSize: FontSizes.caption,
    marginBottom: Spacing.m,
  },
  input: {
    minHeight: 120,
    padding: Spacing.m,
    backgroundColor: Colors.surface,
    color: Colors.textLight,
    fontSize: FontSizes.body,
    borderRadius: 10,
    textAlignVertical: 'top',
  },
});
