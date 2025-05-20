import React from 'react';
import Mascot from '@/components/ui/Mascot';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

export default function WelcomeStep() {
  const { nextStep } = useOnboardingStore();

  const text = `Hi, I'm Lex. I'm here to help you get started with Lexora. Just a few questions before we start your first lesson!`;

  return (
    <View style={styles.container}>
      <View style={styles.mascotWrapper}>
        <Mascot text={text} direction="bottom" />
      </View>
      <Button text="CONTINUE" onPress={nextStep} theme="purple" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mascotWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
