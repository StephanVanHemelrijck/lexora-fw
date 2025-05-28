import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { authService, useAuth } from '@lexora/auth';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@lexora/api-client';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const { uid, languageJourney, displayName, idToken } = useAuthStore();

  const handleLogout = async () => {
    await authService.logout();
  };

  useEffect(() => {
    console.log(uid);
    console.log(displayName);
    console.log(idToken);
  }, [uid, languageJourney, displayName, idToken]);

  useEffect(() => {
    api.test.me(idToken).then((res) => console.log(res));
  }, [idToken]);

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Page, {user?.email}</Text>
      <TouchableOpacity
        onPress={() => {
          router.push('/assessment');
        }}
      >
        <Text>Take Assessment</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
