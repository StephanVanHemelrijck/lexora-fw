import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { GptRoles, Language, Scenario } from '@lexora/types';
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from '@lexora/styles';
import { api } from '@lexora/api-client';
import { Icon } from '../ui/Icon';
import { useAuthStore } from '@/stores/useAuthStore';

interface Props {
  scenario: Scenario;
  language: Language;
}

interface Message {
  role: GptRoles;
  content: string;
}

export default function TextConversation({ scenario, language }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const userMessage: Message = { role: 'user' as GptRoles, content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await api.gpt.sendAiPracticeMessage(
        user.accessToken,
        scenario.id,
        updatedMessages,
        language
      );

      console.log('[BACKEND] AI response: ', aiResponse);

      const aiMessage: Message = {
        role: aiResponse.role as GptRoles,
        content: aiResponse.content,
      };
      setMessages([...updatedMessages, aiMessage]);
    } catch (err) {
      console.error('AI Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.message,
              msg.role === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.role === 'user'
                  ? styles.userMessageText
                  : styles.aiMessageText,
              ]}
            >
              {msg.content}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholderTextColor={Colors.textLight}
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={isLoading}
          style={styles.sendButton}
        >
          <Icon
            name="arrow-up"
            size={FontSizes.h1}
            color={Colors.textDark}
            library="Ionicons"
          />
        </TouchableOpacity>
      </View>
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
    gap: Spacing.s,
    paddingBottom: Spacing.l,
  },
  message: {
    padding: Spacing.s,
    borderRadius: BorderRadius.m,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.accent,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.main,
  },
  messageText: {
    color: Colors.textLight,
    fontSize: FontSizes.body,
  },
  userMessageText: {
    color: Colors.textDark,
  },
  aiMessageText: {
    color: Colors.textLight,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: Spacing.s,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.main,
    padding: Spacing.s,
    borderRadius: BorderRadius.m,
    color: Colors.textLight,
    height: 48,
  },
  sendButton: {
    height: 48,
    width: 48,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.s,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
  },
});
