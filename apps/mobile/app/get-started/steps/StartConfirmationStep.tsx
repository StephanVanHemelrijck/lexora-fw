import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Mascot from '@/components/ui/Mascot';
import { Button } from '@/components/ui/Button';
import {
  Colors,
  FontSizes,
  FontWeights,
  MascotSizes,
  Spacing,
} from '@lexora/styles';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

export default function StartConfirmationStep() {
  const { startingOption, nextStep } = useOnboardingStore();

  const message =
    startingOption === 'placement'
      ? 'Time to see what you already know. Let’s begin!'
      : 'You’re starting fresh! Let’s build your foundation step-by-step.';

  return (
    <View style={styles.container}>
      <View style={styles.mascotWrapper}>
        <Mascot text={message} direction="bottom" size={MascotSizes.l} />
      </View>
      <Button text="CONTINUE" theme="purple" onPress={nextStep} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mascotWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
