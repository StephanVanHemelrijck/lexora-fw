import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { useLessonProgressStore } from '@/stores/useLessonProgressStore';
import { ExerciseStatus } from '@lexora/types';
import { api } from '@lexora/api-client';

interface Props {
  prompt: string;
  exerciseId: string;
  languageCode?: string;
  onNext(): void;
}

export default function SpeakingRepetitionExerciseWithCheck({
  prompt,
  exerciseId,
  languageCode = 'es-ES',
  onNext,
}: Props) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<
    'correct' | 'incorrect' | null
  >(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const addResult = useLessonProgressStore((state) => state.addResult);
  const storedResult = useLessonProgressStore((state) =>
    state.getResultById(exerciseId)
  );

  const soundRef = useRef<Audio.Sound | null>(null);

  const startRecording = async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await rec.startAsync();
    setRecording(rec);
    setIsRecording(true);
  };

  const stopRecording = async () => {
    if (!recording) return;
    await new Promise((res) => setTimeout(res, 300));
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    if (uri) setRecordedUri(uri);
    setRecording(null);
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const playPrompt = async () => {
    try {
      setIsPlaying(true);
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const audioUrl = await api.tts.synthesizeSpeechToFile(
        prompt,
        languageCode
      );
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });

      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if ((status as any).didJustFinish) {
          setIsPlaying(false);
        }
      });

      await sound.playAsync();
    } catch (err) {
      console.error('Play prompt failed', err);
      setIsPlaying(false);
    }
  };

  const playRecording = async () => {
    if (!recordedUri) return;
    try {
      setIsPlaying(true);
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      sound.setOnPlaybackStatusUpdate((status) => {
        if ((status as any).didJustFinish) {
          setIsPlaying(false);
        }
      });
      await sound.playAsync();
    } catch (err) {
      console.error('Playback failed:', err);
      setIsPlaying(false);
    }
  };

  const handleCheck = async () => {
    if (!recordedUri) return;

    try {
      setIsChecking(true);

      const form = new FormData();
      form.append('expected', prompt);
      form.append('languageCode', languageCode);

      const fileInfo = await FileSystem.getInfoAsync(recordedUri);
      const fileUri = fileInfo.uri;

      form.append('file', {
        uri: fileUri,
        name: 'speech.m4a',
        type: 'audio/m4a',
      } as any);

      const res = await fetch(
        'http://192.168.0.129:3000/api/whisper/transcribe',
        {
          method: 'POST',
          body: form,
        }
      );

      const result = await res.json();
      const isCorrect = result.isCorrect ?? false;
      setCheckResult(isCorrect ? 'correct' : 'incorrect');

      addResult({
        exerciseId,
        selectedAnswer: recordedUri,
        isCorrect,
        status: 'completed' as ExerciseStatus,
      });
    } catch (err) {
      console.error('Check failed', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleNext = () => {
    if (!storedResult) {
      addResult({
        exerciseId,
        selectedAnswer: null,
        isCorrect: false,
        status: 'skipped' as ExerciseStatus,
      });
    }
    onNext();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repeat the following sentence</Text>
      <View style={styles.promptBox}>
        <Text style={styles.promptText}>{prompt}</Text>
      </View>

      <View style={styles.micWrapper}>
        <TouchableOpacity
          onPress={toggleRecording}
          style={[styles.micButton, isRecording && styles.micButtonActive]}
        >
          <Icon
            library="Ionicons"
            name={isRecording ? 'square' : 'mic'}
            size={40}
            color={Colors.textDarker}
          />
        </TouchableOpacity>

        <Text style={styles.micText}>
          {isRecording ? 'Recording...' : 'Tap the mic to start'}
        </Text>

        {checkResult && (
          <Text
            style={[
              styles.feedback,
              checkResult === 'correct' ? styles.correct : styles.incorrect,
            ]}
          >
            {checkResult === 'correct'
              ? '✅ Looks good!'
              : '❌ Not quite, try again!'}
          </Text>
        )}
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[styles.smallButton, isPlaying && styles.disabled]}
          onPress={playPrompt}
          disabled={isPlaying}
        >
          {isPlaying ? (
            <ActivityIndicator color={Colors.textDark} />
          ) : (
            <Icon
              library="Ionicons"
              name="play"
              size={24}
              color={Colors.textDark}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.smallButton,
            (!recordedUri || isPlaying) && styles.disabled,
          ]}
          onPress={playRecording}
          disabled={!recordedUri || isPlaying}
        >
          {isPlaying ? (
            <ActivityIndicator color={Colors.textDark} />
          ) : (
            <Icon
              library="Ionicons"
              name="headset"
              size={24}
              color={recordedUri ? Colors.textDark : Colors.disabled}
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button
          text={isChecking ? 'CHECKING...' : 'CHECK'}
          onPress={handleCheck}
          disabled={!recordedUri || isChecking}
          theme="outline"
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
    backgroundColor: Colors.surface,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
  },
  promptBox: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.m,
    padding: Spacing.l,
    marginBottom: Spacing.m,
    borderColor: Colors.border,
    borderWidth: 1,
  },
  promptText: {
    fontSize: FontSizes.h3,
    color: Colors.textLight,
  },
  micWrapper: {
    alignItems: 'center',
    marginVertical: Spacing.l,
    gap: Spacing.s,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonActive: {
    backgroundColor: Colors.error,
  },
  micText: {
    fontSize: FontSizes.body,
    color: Colors.textLight,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: Spacing.m,
  },
  smallButton: {
    padding: Spacing.m,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  disabled: {
    opacity: 0.5,
  },
  feedback: {
    fontSize: FontSizes.body,
    textAlign: 'center',
    paddingTop: Spacing.s,
  },
  correct: {
    color: Colors.success,
  },
  incorrect: {
    color: Colors.error,
  },
  footer: {
    gap: Spacing.m,
  },
});
