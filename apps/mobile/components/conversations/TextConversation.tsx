import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Scenario } from '@lexora/types';
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from '@lexora/styles';
import { api } from '@lexora/api-client';
import { Icon } from '../ui/Icon';

interface Props {
  scenario: Scenario;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function TextConversation({ scenario }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // try {
    //   const aiResponse = await api.gpt.sendAiPracticeMessage({
    //     scenarioId: scenario.id,
    //     messages: updatedMessages,
    //   });

    //   const aiMessage: Message = { role: 'ai', content: aiResponse.reply };
    //   setMessages([...updatedMessages, aiMessage]);
    // } catch (err) {
    //   console.error('AI Error:', err);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.messages}>
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.message,
              msg.role === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text style={styles.messageText}>{msg.content}</Text>
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
            color={Colors.textLight}
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
  },
  sendButton: {
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.m,
  },
  sendButtonText: {
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
  },
});
