import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { api } from '@lexora/api-client';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { FontSizes, Colors, Spacing, MascotSizes } from '@lexora/styles';
import Mascot from '@/components/ui/Mascot';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { authService } from '@lexora/auth';

export default function SaveOnboardingStep() {
  const { getOnboardingSummary, resetAll, password, email, setCompleted } =
    useOnboardingStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const hasStarted = useRef(false);
  const isProcessing = useRef(false);

  const saveOnboarding = async () => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    setLoading(true);
    setError(null);

    try {
      console.log('[SAVE] Onboarding started');
      const summary = getOnboardingSummary();
      const res = await api.onboarding.save(summary);
      await authService.login(email, password);

      const latestLanguageJourney = res.user.languageJourneys?.[0];

      if (latestLanguageJourney) {
        setCompleted(true);
        resetAll();
        router.replace({
          pathname: '/lessons/language/[languageId]/assessment',
          params: {
            languageId: latestLanguageJourney.languageId,
          },
        });
      }
    } catch (e: any) {
      console.error('[SAVE] Error during onboarding', e);
      setError(e.response?.data?.message || 'Something went wrong');
      setCompleted(false);
    } finally {
      setLoading(false);
      isProcessing.current = false;
    }
  };

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    saveOnboarding();
  }, []);

  const handleRetry = () => {
    hasStarted.current = false; // allow re-attempt
    saveOnboarding();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Mascot
          text={
            error
              ? 'Oops! We couldn’t save your info.'
              : "Just a moment while we're saving your information..."
          }
          size={MascotSizes.l}
          direction="bottom"
        />

        {loading && (
          <ActivityIndicator
            size="large"
            color={Colors.accent}
            style={styles.spinner}
          />
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {error && (
        <View style={styles.footer}>
          <Button onPress={handleRetry} text="RETRY" theme="purple" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginTop: Spacing.l,
  },
  errorText: {
    fontSize: FontSizes.body,
    color: Colors.error,
    textAlign: 'center',
    marginTop: Spacing.l,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
});
