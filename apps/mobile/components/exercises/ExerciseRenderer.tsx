import { Text } from 'react-native';
import React, { useEffect } from 'react';
import {
  Exercise,
  ExerciseJson,
  GrammarMultipleChoice,
  ListeningComprehension,
  SpeakingRepetition,
  VocabularyMultipleChoice,
} from '@lexora/types';
import MultipleChoiceExercise from './MultipleChoiceExercise';
import SpeakingRepetitionExercise from './SpeakingRepetitionExercise';
import ListeningComprehesionExercise from './ListeningComprehesionExercise';

interface Props {
  exercise: Exercise;
  onNext: () => void;
  lessonResultId?: string;
}

export default function ExerciseRenderer({
  exercise,
  onNext,
  lessonResultId,
}: Props) {
  const isMultipleChoice = (
    data: ExerciseJson
  ): data is GrammarMultipleChoice | VocabularyMultipleChoice => {
    return (
      data.type === 'grammar_multiple_choice' ||
      data.type === 'vocabulary_multiple_choice'
    );
  };

  const isSpeakingRepetition = (
    data: ExerciseJson
  ): data is SpeakingRepetition => {
    return data.type === 'speaking_repetition';
  };

  const isListeningComprehension = (
    data: ExerciseJson
  ): data is ListeningComprehension => {
    return data.type === 'listening_comprehension';
  };

  useEffect(() => {
    console.log('ExerciseRenderer', exercise);
  }, [exercise]);

  const handleOnNext = () => {
    onNext();
  };

  if (isMultipleChoice(exercise.data)) {
    return (
      <MultipleChoiceExercise
        data={exercise.data}
        exerciseId={exercise.id}
        onNext={handleOnNext}
        lessonResultId={lessonResultId}
      />
    );
  }

  if (isSpeakingRepetition(exercise.data)) {
    return (
      <SpeakingRepetitionExercise
        prompt={exercise.data.prompt}
        languageCode={'es'}
        exerciseId={exercise.id}
        onNext={handleOnNext}
        lessonResultId={lessonResultId}
      />
    );
  }

  if (isListeningComprehension(exercise.data)) {
    return (
      <ListeningComprehesionExercise
        onNext={handleOnNext}
        data={exercise.data}
        exerciseId={exercise.id}
        lessonResultId={lessonResultId}
        languageCode={'es'}
      />
    );
  }

  return <Text>ExerciseRenderer</Text>;
}
