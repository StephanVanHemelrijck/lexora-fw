import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import ScreenContainer from '@/components/layouts/ScreenContainer';
import { useAuthStore } from '@/stores/useAuthStore';

export default function Home() {
  // const { user } = useAuth();
  const { user } = useAuthStore();

  useEffect(() => {
    console.log('[HOME]', user?.accessToken);
  }, [user?.accessToken]);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text>Welcome to the Home Page, {user?.email}</Text>
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
