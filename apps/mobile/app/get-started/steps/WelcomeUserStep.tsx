import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import Mascot from '@/components/ui/Mascot';
import { Button } from '@/components/ui/Button';

export default function WelcomeUserStep() {
  const { displayName, nextStep } = useOnboardingStore();

  return (
    <View style={styles.container}>
      <View style={styles.mascotWrapper}>
        <Mascot
          text={`Hi ${displayName}, nice to meet you! Let's finish setting things up!`}
          direction="bottom"
        />
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
