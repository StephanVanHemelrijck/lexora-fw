import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { authService, useAuth } from '@lexora/auth';
import { useRouter } from 'expo-router';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
  };

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
