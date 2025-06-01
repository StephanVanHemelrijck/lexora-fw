import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { api } from '@lexora/api-client';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { FontSizes, Colors, Spacing, MascotSizes } from '@lexora/styles';
import Mascot from '@/components/ui/Mascot';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { authService } from '@lexora/auth';

export default function SaveOnboardingStep() {
  const { getOnboardingSummary, resetAll, password, email } =
    useOnboardingStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const saveOnboarding = useCallback(async () => {
    setLoading(true);
    setError(null);
    const summary = getOnboardingSummary();

    try {
      const res = await api.onboarding.save(summary);

      console.log('res user', res.user);

      resetAll(); // reset onboarding store
      const credential = await authService.login(email, password);

      const accessToken = await credential.user.getIdToken();
      setAuth({
        accessToken: res.user.accessToken ?? accessToken,
        dailyMinutes: res.user.dailyMinutes,
        languageJourneys: res.user.languageJourneys,
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
      });

      const latestLanguageJourney = res.user.languageJourneys?.[0];

      if (latestLanguageJourney) {
        router.push({
          pathname: '/lessons/language/[languageId]',
          params: {
            languageId: latestLanguageJourney.languageId,
          },
        });
      }
    } catch (e: any) {
      setError(e.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [getOnboardingSummary, router, password, email, resetAll, setAuth]);

  useEffect(() => {
    saveOnboarding();
  }, [saveOnboarding]);

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
          <Button onPress={saveOnboarding} text="RETRY" theme="purple" />
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
