import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import ScreenContainer from '@/components/layouts/ScreenContainer';
import { useAuthStore } from '@/stores/useAuthStore';

export default function Home() {
  // const { user } = useAuth();
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    console.log(user);
  }, [user]);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text>Welcome to the Home Page, {user?.email}</Text>
        <TouchableOpacity
          onPress={() => {
            router.push('/assessment');
          }}
        >
          <Text>Take Assessment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push('/languages/[languageId]/lessons');
          }}
        >
          <Text>Language</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
