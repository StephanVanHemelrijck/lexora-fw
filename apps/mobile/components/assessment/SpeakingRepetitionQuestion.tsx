import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import { Icon } from '../ui/Icon';

interface Props {
  prompt: string;
  onAnswer: (uri: string) => void;
  languageCode?: string;
  selected: string | null;
}

export default function SpeakingRepetitionQuestion({
  prompt,
  onAnswer,
  languageCode = 'es-ES',
  selected,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const [volume, setVolume] = useState(0);

  const volumeIntervalRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    if (selected) setRecordedUri(selected);
  }, [selected]);

  useEffect(() => {
    return () => {
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
    };
  }, []);

  const playPrompt = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://192.168.0.129:3000/api/tts?text=${encodeURIComponent(
          prompt
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
          setHasPlayed(true);
        }
      });
      await sound.playAsync();
    } catch (err) {
      console.error('Play failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const playRecording = async () => {
    if (!recordedUri) return;
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      setIsReplaying(true);
      sound.setOnPlaybackStatusUpdate((status) => {
        if ((status as any).didJustFinish) {
          setIsReplaying(false);
        }
      });
      await sound.playAsync();
    } catch (err) {
      console.error('Playback failed:', err);
    }
  };

  const startRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await rec.startAsync();
      setRecording(rec);
      setIsRecording(true);

      volumeIntervalRef.current = setInterval(async () => {
        const status = await rec.getStatusAsync();
        if (status.metering != null) {
          setVolume(status.metering);
        }
      }, 100);
    } catch (err) {
      console.error('Start recording failed:', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        setRecordedUri(uri);
        onAnswer(uri);
      }
    } catch (err) {
      console.error('Stop recording failed:', err);
    } finally {
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current);
      setRecording(null);
      setIsRecording(false);
      setVolume(0);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const renderWaveform = () => {
    const normalized = Math.max(0, (volume + 160) / 160); // Normalize from dBFS
    const maxHeight = 60;
    return (
      <View style={styles.waveform}>
        {[...Array(20)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              {
                height: Math.max(4, normalized * maxHeight * Math.random()),
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repeat the following sentence</Text>

      <View style={styles.promptBox}>
        <Text style={styles.promptText}>{prompt}</Text>
      </View>

      <View style={styles.body}>
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

          {isRecording && renderWaveform()}

          <Text style={styles.micText}>
            {isRecording
              ? 'Recording... Tap to stop'
              : recordedUri
              ? '✅ Answer recorded'
              : 'Tap the microphone to answer'}
          </Text>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.smallButton, isPlaying && styles.disabled]}
            onPress={playPrompt}
            disabled={isPlaying || isLoading}
          >
            {isPlaying || isLoading ? (
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
              (!recordedUri || isReplaying) && styles.disabled,
            ]}
            onPress={playRecording}
            disabled={!recordedUri || isReplaying}
          >
            {isReplaying ? (
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    color: Colors.textLight,
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.m,
  },
  promptBox: {
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.l,
    marginBottom: Spacing.m,
  },
  promptText: {
    fontSize: FontSizes.h3,
    color: Colors.textLight,
  },
  body: {
    flex: 1,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallButton: {
    padding: Spacing.m,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  micWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.s,
    marginTop: Spacing.l,
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
  waveform: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'flex-end',
    marginVertical: Spacing.m,
    gap: 2,
  },
  bar: {
    width: 4,
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
