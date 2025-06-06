import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import { Audio } from 'expo-av';
import { Icon } from '../ui/Icon'; // Optional: assuming you're using an Icon component

interface Props {
  question: string;
  options: string[];
  text_prompt: string;
  onAnswer: (selected: string | null) => void;
  languageCode?: string;
  selected: string | null;
}

export default function ListeningComprehensionQuestion({
  question,
  text_prompt,
  options,
  onAnswer,
  languageCode = 'es-ES',
  selected,
}: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectedOption(selected);
  }, [selected]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (selectedOption === option) {
      setSelectedOption(null);
    }
    onAnswer(option);
  };

  const playPrompt = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://192.168.0.129:3000/api/tts?text=${encodeURIComponent(
          text_prompt
        )}&lang=${languageCode}`
      );
      const { audioUrl } = await res.json();

      const { sound } = await Audio.Sound.createAsync({
        uri: `http://192.168.0.129:3000/api${audioUrl}`,
      });

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
      <Text style={styles.title}>
        Listen to the following passage and choose the correct answer.
      </Text>

      <TouchableOpacity
        onPress={playPrompt}
        style={[styles.playButton, isPlaying && styles.playing]}
        disabled={isPlaying || isLoading}
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

      <Text style={styles.question}>{question}</Text>

      <View style={styles.optionContainer}>
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isSelected && styles.selectedOptionButton,
              ]}
              onPress={() => handleOptionSelect(option)}
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
  container: {
    flex: 1,
  },
  title: {
    fontSize: FontSizes.h2,
    color: Colors.textLight,
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
    fontSize: FontSizes.h2,
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
