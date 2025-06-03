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
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const saveOnboarding = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('saving onboarding');
        const summary = getOnboardingSummary();
        const res = await api.onboarding.save(summary);
        await authService.login(email, password);

        const latestLanguageJourney = res.user.languageJourneys?.[0];

        if (latestLanguageJourney) {
          setCompleted(true);
          resetAll();
          router.push({
            pathname: '/lessons/language/[languageId]/assessment',
            params: {
              languageId: latestLanguageJourney.languageId,
            },
          });
        }
      } catch (e: any) {
        setError(e.response?.data?.message || 'Something went wrong');
        setCompleted(false);
      } finally {
        setLoading(false);
      }
    };

    saveOnboarding();
  }, [getOnboardingSummary, email, password, resetAll, router, setCompleted]);

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
          <Button
            onPress={() => {
              setError(null);
              setLoading(true);
              // retry the effect
              // This will re-run because the component is re-rendered
            }}
            text="RETRY"
            theme="purple"
          />
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
