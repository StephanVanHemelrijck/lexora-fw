import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Audio } from 'expo-av';
import { Scenario, GptRoles, Language } from '@lexora/types';
import { api } from '@lexora/api-client';
import { useAuthStore } from '@/stores/useAuthStore';
import { Colors, FontSizes, Spacing, BorderRadius } from '@lexora/styles';
import { Icon } from '../ui/Icon';

interface Props {
  scenario: Scenario;
  language: Language;
}

interface Message {
  role: GptRoles;
  uri: string;
  duration: number;
  transcript: string;
}

export default function VoiceConversation({ scenario, language }: Props) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const scrollRef = useRef<ScrollView>(null);

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

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    setIsRecording(false);

    if (uri) {
      await handleTranscription(uri);
    }
  };

  const handleTranscription = async (fileUri: string) => {
    if (!user) return;

    try {
      setIsProcessing(true);

      const form = new FormData();
      form.append('file', {
        uri: fileUri,
        name: 'voice.m4a',
        type: 'audio/m4a',
      } as any);

      const res = await api.whisper.transcribeOnly(form, user.accessToken);
      const transcript = res.transcription;

      if (transcript) {
        await handleUserMessage(fileUri, transcript);
      }
    } catch (err) {
      console.error('Transcription error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUserMessage = async (
    userAudioUri: string,
    transcript: string
  ) => {
    const { sound } = await Audio.Sound.createAsync({ uri: userAudioUri });
    const status = await sound.getStatusAsync();
    const duration = (status as any).durationMillis ?? 0;

    const userMessage: Message = {
      role: 'user' as GptRoles,
      uri: userAudioUri,
      duration,
      transcript,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const aiResponse = await api.gpt.sendAiPracticeMessage(
        user!.accessToken,
        scenario.id,
        updatedMessages.map(({ role, transcript }) => ({
          role,
          content: transcript,
        })),
        language
      );

      const ttsUri = await api.tts.synthesizeSpeechToFile(
        aiResponse.content,
        language.code
      );
      const { sound } = await Audio.Sound.createAsync({ uri: ttsUri });
      const info = await sound.getStatusAsync();

      const aiMessage: Message = {
        role: 'assistant' as GptRoles,
        uri: ttsUri,
        duration: (info as any).durationMillis ?? 0,
        transcript: aiResponse.content,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('GPT or TTS error:', err);
    }
  };

  const playAudio = async (uri: string, index: number) => {
    try {
      setPlayingIndex(index);
      const { sound } = await Audio.Sound.createAsync({ uri });
      sound.setOnPlaybackStatusUpdate((status) => {
        if ((status as any).didJustFinish) setPlayingIndex(null);
      });
      await sound.playAsync();
    } catch (err) {
      console.error('Audio playback failed', err);
      setPlayingIndex(null);
    }
  };

  const formatDuration = (ms: number) => {
    const secs = Math.floor(ms / 1000);
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messages}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.audioBubble,
              msg.role === 'user' ? styles.userBubble : styles.aiBubble,
              playingIndex === idx && styles.playing,
            ]}
            onPress={() => playAudio(msg.uri, idx)}
          >
            <Icon
              name={playingIndex === idx ? 'volume-high' : 'play'}
              library="Ionicons"
              color={msg.role === 'user' ? Colors.textDark : Colors.textLight}
              size={20}
            />
            <Text
              style={[
                styles.duration,
                msg.role === 'user'
                  ? { color: Colors.textDark }
                  : { color: Colors.textLight },
              ]}
            >
              {formatDuration(msg.duration)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        style={[
          styles.micButton,
          isRecording && styles.micButtonActive,
          isProcessing && styles.disabled,
        ]}
      >
        {isProcessing ? (
          <ActivityIndicator color={Colors.textDark} />
        ) : (
          <Icon
            name={isRecording ? 'square' : 'mic'}
            library="Ionicons"
            size={30}
            color={Colors.textDark}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.m,
    backgroundColor: Colors.surface,
    justifyContent: 'space-between',
  },
  messages: {
    gap: Spacing.m,
    paddingBottom: Spacing.l,
  },
  audioBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.s,
    borderRadius: BorderRadius.m,
    minWidth: '30%',
    maxWidth: '80%',
    gap: Spacing.s,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.accent,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.main,
  },
  playing: {
    opacity: 0.8,
  },
  duration: {
    color: Colors.textDark,
    fontSize: FontSizes.caption,
  },
  micButton: {
    alignSelf: 'center',
    marginTop: Spacing.m,
    backgroundColor: Colors.accent,
    padding: Spacing.m,
    borderRadius: 50,
  },
  micButtonActive: {
    backgroundColor: Colors.error,
  },
  disabled: {
    opacity: 0.5,
  },
});
