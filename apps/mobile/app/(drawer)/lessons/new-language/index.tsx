import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback } from 'react';
import { Colors, MascotSizes, Spacing } from '@lexora/styles';
import Mascot from '@/components/ui/Mascot';
import { Button } from '@/components/ui/Button';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';

export default function Page() {
  const nav = useNavigation();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      nav.getParent()?.setOptions({ title: 'Learn New Language' });
    }, [nav])
  );

  return (
    <View style={styles.container}>
      <View style={styles.mascotWrapper}>
        <Mascot
          text="You're about to pick up another language, Let's walk through a few quick steps to set things up."
          direction="bottom"
          size={MascotSizes.l}
        />
      </View>

      <View style={styles.buttonWrapper}>
        <Button text="NOT NOW" onPress={() => router.back()} theme="outline" />
        <Button
          text="START"
          onPress={() => router.push('/lessons/new-language/select-language')}
          theme="purple"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.screenGutter,
  },
  mascotWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '100%',
    gap: Spacing.m,
  },
});
