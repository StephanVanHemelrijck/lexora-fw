import { Stack } from 'expo-router';

export default function ConversationRootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
