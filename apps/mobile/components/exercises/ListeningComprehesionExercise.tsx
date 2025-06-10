import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import { ExerciseStatus, ListeningComprehension } from '@lexora/types';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useLessonProgressStore } from '@/stores/useLessonProgressStore';
import { api } from '@lexora/api-client';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '../ui/Button';
import { Audio } from 'expo-av';
import { Icon } from '../ui/Icon';

interface Props {
  onNext: () => void;
  data: ListeningComprehension;
  exerciseId: string;
  lessonResultId?: string;
  languageCode: string;
}

export default function ListeningComprehensionExercise({
  data,
  onNext,
  exerciseId,
  lessonResultId,
  languageCode,
}: Props) {
  const { user } = useAuthStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = useLessonProgressStore((state) => state.addResult);
  const updateProgress = useLessonProgressStore(
    (state) => state.updateProgressForExercise
  );
  const storedResult = useLessonProgressStore((state) =>
    state.getResultById(exerciseId)
  );

  const prevExerciseIdRef = useRef<string | null>(null);

  if (prevExerciseIdRef.current !== exerciseId) {
    prevExerciseIdRef.current = exerciseId;

    // Eager reset before render
    if (!storedResult) {
      setSelectedOption(null);
      setHasSubmitted(false);
    }
  }

  useEffect(() => {
    if (storedResult) {
      setSelectedOption(storedResult.selectedAnswer ?? null);
      setHasSubmitted(storedResult.status === 'completed');
    } else {
      setSelectedOption(null);
      setHasSubmitted(false);
    }
  }, [exerciseId, storedResult]);

  const handleOptionSelect = (option: string) => {
    if (hasSubmitted) return;
    setSelectedOption((prev) => (prev === option ? null : option));
  };

  const handleCheckAnswer = () => {
    const isCorrect = selectedOption === data.correct_answer;

    addResult({
      exerciseId,
      selectedAnswer: selectedOption,
      isCorrect,
      status: selectedOption
        ? ('completed' as ExerciseStatus)
        : ('skipped' as ExerciseStatus),
      lessonResultId,
    });

    setHasSubmitted(true);
  };

  const handleNext = () => {
    if (!user) return;

    const isCorrect = selectedOption === data.correct_answer;

    const result = {
      exerciseId,
      selectedAnswer: selectedOption,
      isCorrect,
      status: selectedOption
        ? ('completed' as ExerciseStatus)
        : ('skipped' as ExerciseStatus),
      lessonResultId,
    };

    addResult(result);
    updateProgress(exerciseId);
    api.exerciseResult.save(user.accessToken, result);

    setHasSubmitted(true);
    onNext();
  };

  const playPrompt = async () => {
    setIsLoading(true);
    try {
      const audioUrl = await api.tts.synthesizeSpeechToFile(
        data.text_prompt,
        languageCode
      );

      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });

      setIsPlaying(true);
      sound.setOnPlaybackStatusUpdate((status) => {
        if ((status as any).didJustFinish) {
          setIsPlaying(false);
        }
      });

      await sound.playAsync();
    } catch (err) {
      console.error('Failed to play audio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Listen and choose the correct answer</Text>

        <TouchableOpacity
          onPress={playPrompt}
          style={[styles.playButton, isPlaying && styles.playing]}
          disabled={isPlaying || isLoading}
          activeOpacity={0.8}
        >
          {isLoading || isPlaying ? (
            <ActivityIndicator color={Colors.textDark} />
          ) : (
            <Icon
              library="Ionicons"
              name="volume-high"
              size={FontSizes.h1}
              color={Colors.textDark}
            />
          )}
        </TouchableOpacity>

        <Text style={styles.question}>{data.question}</Text>

        <View style={styles.optionContainer}>
          {data.options.map((option, index) => {
            const isSelected = option === selectedOption;
            const isCorrect = option === data.correct_answer;

            const optionStyle = StyleSheet.flatten([
              styles.optionButton,
              hasSubmitted && isCorrect && styles.correctOption,
              hasSubmitted &&
                isSelected &&
                !isCorrect &&
                styles.incorrectOption,
              !hasSubmitted && isSelected && styles.selectedOptionButton,
            ]);

            const textStyle = StyleSheet.flatten([
              styles.optionText,
              hasSubmitted && isCorrect && styles.correctText,
              hasSubmitted && isSelected && !isCorrect && styles.incorrectText,
              !hasSubmitted && isSelected && styles.selectedOptionText,
            ]);

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleOptionSelect(option)}
                style={optionStyle}
                activeOpacity={0.8}
                disabled={hasSubmitted}
              >
                <Text style={textStyle}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.buttonWrapper}>
        <Button
          text="CHECK"
          onPress={handleCheckAnswer}
          theme="outline"
          disabled={hasSubmitted}
        />
        <Button text="NEXT" onPress={handleNext} theme="purple" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.screenGutter,
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.textLight,
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.m,
  },
  playButton: {
    minHeight: FontSizes.h1 + Spacing.s * 2,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.s,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.m,
    marginBottom: Spacing.m,
  },
  playing: {
    backgroundColor: Colors.highlight,
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
  correctOption: {
    backgroundColor: `${Colors.success}10`,
    borderColor: Colors.success,
    borderWidth: 2,
  },
  correctText: {
    color: Colors.success,
  },
  incorrectOption: {
    backgroundColor: `${Colors.error}10`,
    borderColor: Colors.error,
    borderWidth: 2,
  },
  incorrectText: {
    color: Colors.error,
  },
  optionText: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  selectedOptionText: {
    color: Colors.accent,
  },
  buttonWrapper: {
    gap: Spacing.m,
  },
});
