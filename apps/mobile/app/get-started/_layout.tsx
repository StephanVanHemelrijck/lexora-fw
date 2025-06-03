import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import { ProgressIndicator } from '@/components/ui/ProgessIndicator';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { Icon } from '@/components/ui/Icon';
import { Colors, FontSizes, Spacing } from '@lexora/styles';

export default function OnboardingLayout() {
  const { step, totalSteps, started, prevStep, setStarted, completed } =
    useOnboardingStore();

  const router = useRouter();

  useEffect(() => {
    if (step === 0) setStarted(false);
    if (step === 1) setStarted(true);
  }, [step, setStarted]);

  const handlePrevious = () => {
    if (step === 0 && !completed) return router.back();
    prevStep();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handlePrevious} style={styles.backButton}>
          <Icon
            name="arrow-back"
            size={FontSizes.h1}
            color={Colors.textLight}
            library="Ionicons"
          />
        </TouchableOpacity>

        {started && <ProgressIndicator current={step} total={totalSteps} />}
      </View>

      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main,
    padding: Spacing.screenGutter,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    paddingRight: Spacing.s,
  },
});
