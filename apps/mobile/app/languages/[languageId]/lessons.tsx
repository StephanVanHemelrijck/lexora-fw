import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function LessonsScreen() {
  const { languageId } = useLocalSearchParams();
  const { email, displayName, idToken, uid, languageJourney } = useAuthStore();
  const user = useAuthStore((s) => s);

  useEffect(() => {
    console.log(email);
    console.log(displayName);
  }, [email, displayName, idToken, uid, languageJourney]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Lessons for: {displayName}</Text>
    </View>
  );
}
