import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import ScreenContainer from '@/components/layouts/ScreenContainer';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

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
