import { View, Image, StyleSheet, Text } from 'react-native';
import React from 'react';
import {
  Colors,
  Spacing,
  FontSizes,
  FontWeights,
  BorderRadius,
} from '@lexora/styles';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';

export default function Page() {
  const router = useRouter();

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
  getStarted: {
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
    borderRadius: BorderRadius.l,
    marginBottom: Spacing.m,
    width: '100%',
    alignItems: 'center',
  },
  getStartedText: {
    color: Colors.textDark,
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.bold,
  },
  loginText: {
    color: Colors.accent,
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.bold,
  },
  login: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.l,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.l,
  },
});
