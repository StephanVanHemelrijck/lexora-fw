import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Colors, FontSizes, MascotSizes, Spacing } from '@lexora/styles';
import { useRouter } from 'expo-router';
import { useNewLanguageStore } from '@/stores/useNewLanguageStore';
import LanguageReasonSelection from '@/components/languages/LanguageReasonSelection';
import { Icon } from '@/components/ui/Icon';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import Mascot from '@/components/ui/Mascot';
import { Button } from '@/components/ui/Button';

const REASONS = [
  { label: 'Connect with people', emoji: '🗣️' },
  { label: 'Travel', emoji: '✈️' },
  { label: 'Work / Career', emoji: '💼' },
  { label: 'Study / School', emoji: '🎓' },
  { label: 'Culture & Media', emoji: '🎭' },
  { label: 'For fun / Hobby', emoji: '🎮' },
  { label: 'Move abroad', emoji: '🏠' },
  { label: 'Language challenge', emoji: '🧠' },
  { label: 'Make new friends', emoji: '🤝' },
  { label: 'Family / Heritage', emoji: '🧬' },
];

export default function SelectReasonPage() {
  const router = useRouter();
  const selectedReasons = useNewLanguageStore((state) => state.selectedReasons);
  const toggleReason = useNewLanguageStore((state) => state.toggleReason);
  const selectedLanguage = useNewLanguageStore(
    (state) => state.selectedLanguage
  );

  const handleToggleReason = (reason: string) => {
    toggleReason(reason);
  };

  const handleNext = () => {
    router.push('/lessons/new-language/select-placement');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon
            library="Ionicons"
            name="arrow-back"
            size={FontSizes.h1}
            color={Colors.textLight}
          />
        </TouchableOpacity>
        <ProgressIndicator current={2} total={4} />
      </View>

      <View style={styles.mascotWrapper}>
        <Mascot
          text={`Why do you want to learn ${
            selectedLanguage?.name || 'a new language'
          }?`}
          direction="right"
          size={MascotSizes.s}
        />
      </View>

      <LanguageReasonSelection
        reasons={REASONS}
        selected={selectedReasons}
        onToggle={handleToggleReason}
      />

      <Button
        text="NEXT"
        onPress={handleNext}
        theme="purple"
        disabled={!selectedReasons.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.screenGutter,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.m,
  },
  mascotWrapper: {
    marginVertical: Spacing.l,
  },
});
