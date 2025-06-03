import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@lexora/api-client';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import { UserAssessment } from '@lexora/types';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AssessmentPage() {
  const { user } = useAuthStore();
  const { languageId } = useLocalSearchParams<{ languageId: string }>();
  const [userAssessment, setUserAssessment] = useState<UserAssessment>();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!user || !languageId || hasFetchedRef.current) return;

    hasFetchedRef.current = true;

    console.log('[ASSESSMENT: UID]', user.uid);
    console.log('[ASSESSMENT: LANGUAGE_ID]', languageId);

    console.log('[ASSESSMENT]: Fetching assessment');

    api.userAssessment
      .getActiveOrCreate(user.accessToken, languageId)
      .then(setUserAssessment)
      .catch((err) => {
        console.error('[ASSESSMENT]: Failed', err);
        hasFetchedRef.current = false; // optionally allow retry
      });

    console.log('[ASSESSMENT]: Fetched assessment');
  }, [user, languageId]);

  return (
    <View>
      <Text>Assessment id : {userAssessment?.id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.main },
  scrollContent: { paddingHorizontal: Spacing.screenGutter },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.l,
    paddingTop: Spacing.screenGutter,
    paddingHorizontal: Spacing.screenGutter,
  },
  backButton: { paddingRight: Spacing.s },
  progressWrapper: { flex: 1 },
  questionContainer: { flex: 1, justifyContent: 'flex-start' },
  nextButton: {
    backgroundColor: Colors.actionButton,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
  },
  nextButtonText: {
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.h3,
  },
  buttonWrapper: { padding: Spacing.screenGutter },
});
