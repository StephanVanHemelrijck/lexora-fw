import { View, Image, StyleSheet, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
} from '@lexora/styles';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/useAuthStore';

export default function Page() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  useEffect(() => {
    if (user !== undefined) {
      if (user) {
        router.replace('/(drawer)/home');
      }
      setIsCheckingUser(true);
    }
  }, [user, router]);

  if (isCheckingUser) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image
          source={require('../assets/images/logo-light.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.caption}>
          Where{' '}
          <Text style={{ color: Colors.accent, fontWeight: FontWeights.bold }}>
            curiosity
          </Text>{' '}
          meets{' '}
          <Text style={{ color: Colors.accent, fontWeight: FontWeights.bold }}>
            conversation
          </Text>
          !
        </Text>
      </View>

      <View style={styles.buttons}>
        <Button
          onPress={() => router.push('/get-started')}
          text="GET STARTED"
          theme="purple"
        />
        <Button
          onPress={() => router.push('/login')}
          text="I ALREADY HAVE AN ACCOUNT"
          theme="outline"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.screenGutter,
    backgroundColor: Colors.main,
    justifyContent: 'space-between',
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: Colors.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.m,
  },
  logo: {
    width: 240,
  },
  caption: {
    color: Colors.textLight,
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.medium,
    textAlign: 'center',
  },
  buttons: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.l,
  },
});
