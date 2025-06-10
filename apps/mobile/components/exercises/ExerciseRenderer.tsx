import { StyleSheet, Text } from 'react-native';
import React from 'react';
import {
  Exercise,
  ExerciseJson,
  GrammarMultipleChoice,
  VocabularyMultipleChoice,
} from '@lexora/types';
import MultipleChoiceExercise from './MultipleChoiceExercise';

interface Props {
  exercise: Exercise;
  onNext: () => void;
}

export default function ExerciseRenderer({ exercise, onNext }: Props) {
  const isMultipleChoice = (
    data: ExerciseJson
  ): data is GrammarMultipleChoice | VocabularyMultipleChoice => {
    return (
      data.type === 'grammar_multiple_choice' ||
      data.type === 'vocabulary_multiple_choice'
    );
  };

  const handleOnNext = () => {
    onNext();
  };

  if (isMultipleChoice(exercise.data)) {
    return (
      <MultipleChoiceExercise
        data={exercise.data}
        exerciseId={exercise.id}
        onNext={handleOnNext}
      />
    );
  }

  return <Text>ExerciseRenderer</Text>;
}

const styles = StyleSheet.create({});
