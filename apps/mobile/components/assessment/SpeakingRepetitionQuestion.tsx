import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';

interface SpeakingRepetitionQuestionProps {
  prompt: string;
  onAnswer: (answer: string) => void;
}

export default function SpeakingRepetitionQuestion({
  prompt,
  onAnswer,
}: SpeakingRepetitionQuestionProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    Audio.requestPermissionsAsync();
  }, []);

  const playPrompt = () => {
    Speech.speak(prompt, { language: 'es' }); // Change language as needed
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        alert('Permission to use microphone is required!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordedUri(uri || null);
      setRecording(null);
      setIsRecording(false);
      if (uri) onAnswer(uri);
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  };

  const playRecording = async () => {
    if (!recordedUri) return;

    try {
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      setIsPlaying(true);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if ('isPlaying' in status && !status.isPlaying) {
          setIsPlaying(false);
        }
      });
    } catch (err) {
      console.error('Playback error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repeat the following sentence</Text>
      <View style={styles.promptBox}>
        <Text style={styles.promptText}>{prompt}</Text>
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={playPrompt} style={styles.button}>
          <Text style={styles.buttonText}>🔊 Play Prompt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          style={[styles.button, isRecording && styles.recordingButton]}
        >
          <Text style={styles.buttonText}>
            {isRecording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={playRecording}
          style={[styles.button, !recordedUri && styles.disabledButton]}
          disabled={!recordedUri}
        >
          {isPlaying ? (
            <ActivityIndicator color={Colors.accent} />
          ) : (
            <Text style={styles.buttonText}>▶️ Play My Recording</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const recordingOptions: Audio.RecordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.DEFAULT,
    audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
  isMeteringEnabled: false,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.l,
  },
  title: {
    color: Colors.textLight,
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.m,
  },
  promptBox: {
    padding: Spacing.l,
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.m,
  },
  promptText: {
    fontSize: FontSizes.h3,
    color: Colors.textLight,
  },
  buttonGroup: {
    gap: Spacing.s,
  },
  button: {
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  recordingButton: {
    backgroundColor: '#e53935',
  },
  disabledButton: {
    backgroundColor: Colors.disabled,
  },
  buttonText: {
    color: Colors.textDark,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
});
