import { Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Exercise,
  ExerciseJson,
  GrammarMultipleChoice,
  Language,
  ListeningComprehension,
  ReadingComprehension,
  SpeakingRepetition,
  VocabularyMultipleChoice,
} from '@lexora/types';
import MultipleChoiceExercise from './MultipleChoiceExercise';
import SpeakingRepetitionExercise from './SpeakingRepetitionExercise';
import ListeningComprehesionExercise from './ListeningComprehesionExercise';
import ReadingComprehensionExercise from './ReadingComprehensionExercise';
import { api } from '@lexora/api-client';
import { useAuthStore } from '@/stores/useAuthStore';

interface Props {
  exercise: Exercise;
  onNext: () => void;
  lessonResultId?: string;
  languageId: string;
}

export default function ExerciseRenderer({
  exercise,
  onNext,
  lessonResultId,
  languageId,
}: Props) {
  const { user } = useAuthStore();
  const [language, setLanguage] = useState<Language>();

  useEffect(() => {
    if (!languageId || !user) return;

    api.languages
      .getById(user.accessToken, languageId)
      .then(setLanguage)
      .catch(console.error);
  }, [languageId, user]);

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

  const isReadingComprehension = (
    data: ExerciseJson
  ): data is ReadingComprehension => {
    return data.type === 'reading_comprehension';
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
        languageCode={language?.code ?? 'en'}
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

  if (isReadingComprehension(exercise.data)) {
    return (
      <ReadingComprehensionExercise
        onNext={handleOnNext}
        data={exercise.data}
        exerciseId={exercise.id}
        lessonResultId={lessonResultId}
      />
    );
  }

  return <Text>ExerciseRenderer</Text>;
}
