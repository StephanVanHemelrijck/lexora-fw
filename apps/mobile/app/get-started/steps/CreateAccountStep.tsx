import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useMemo } from 'react';
import Mascot from '@/components/ui/Mascot';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  MascotSizes,
  Spacing,
} from '@lexora/styles';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

export default function CreateAccountStep() {
  const { nextStep } = useOnboardingStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = useMemo(() => {
    return email.length > 0 && password.length > 0 && displayName.length > 0;
  }, [email, password, displayName]);

  const handleCreateAccount = async () => {
    nextStep();
  };

  // Determine password strength
  const passwordStrength = useMemo(() => {
    if (!password) return { label: '', color: '', level: 0 };

    let level = 0;
    if (password.length >= 6) level++;
    if (/[A-Z]/.test(password)) level++;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) level++;

    const labels = ['Weak', 'Medium', 'Strong'];
    const colors = [Colors.error, Colors.warning, Colors.success];

    return {
      label: labels[Math.min(level - 1, 2)],
      color: colors[Math.min(level - 1, 2)],
      level,
    };
  }, [password]);

  return (
    <View style={styles.container}>
      <View style={styles.mascotWrapper}>
        <Mascot
          size={MascotSizes.s}
          text="In order to save your progress, please create an account"
          direction="right"
        />
      </View>

      <Text style={styles.title}>Let&apos;s set up your account</Text>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, gap: Spacing.s }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputGroup}>
          {/* <Text style={styles.label}>Display Name</Text> */}
          <View style={styles.inputWrapper}>
            <Icon
              name="person"
              size={FontSizes.h2}
              color={Colors.disabled}
              library="MaterialIcons"
            />
            <TextInput
              style={styles.input}
              placeholder="Display name"
              placeholderTextColor={Colors.disabled}
              keyboardType="default"
              autoCapitalize="none"
              value={displayName}
              onChangeText={setDisplayName}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          {/* <Text style={styles.label}>Email</Text> */}
          <View style={styles.inputWrapper}>
            <Icon
              name="mail"
              size={FontSizes.h2}
              color={Colors.disabled}
              library="MaterialIcons"
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={Colors.disabled}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          {/* <Text style={styles.label}>Password</Text>/ */}
          <View style={styles.inputWrapper}>
            <Icon
              library="MaterialIcons"
              name="lock"
              size={FontSizes.h2}
              color={Colors.disabled}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.disabled}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                library="Ionicons"
                name={showPassword ? 'eye-off' : 'eye'}
                size={FontSizes.h2}
                color={Colors.disabled}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.strengthSection}>
            <View style={styles.strengthBarContainer}>
              {[Colors.error, Colors.warning, Colors.success].map(
                (color, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.strengthSegment,
                      {
                        backgroundColor:
                          passwordStrength.level === idx + 1
                            ? color
                            : `${color}33`, // Only the matching segment is solid
                      },
                    ]}
                  />
                )
              )}
            </View>

            <View style={styles.strengthLabels}>
              {['Weak', 'Medium', 'Strong'].map((label, idx) => (
                <Text
                  key={label}
                  style={[
                    styles.strengthLabel,
                    passwordStrength.level === idx + 1 && password
                      ? styles.activeLabel
                      : styles.inactiveLabel,
                  ]}
                >
                  {label}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View>
        <View style={styles.termsWrapper}>
          <Text style={styles.termsText}>
            By registering for Lexora, you agree to our{' '}
            <Text style={styles.link}>Terms</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>.
          </Text>
        </View>
        {canSubmit ? (
          <Button
            text="CREATE ACCOUNT"
            onPress={handleCreateAccount}
            theme="purple"
          />
        ) : (
          <Button text="CREATE ACCOUNT" disabled />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mascotWrapper: {
    marginVertical: Spacing.l,
  },
  title: {
    color: Colors.textLight,
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    marginBottom: Spacing.l,
  },
  label: {
    color: Colors.accent,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.s,
    marginLeft: Spacing.s,
  },
  inputGroup: {
    marginBottom: Spacing.m,
    gap: Spacing.s,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.m,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.body,
    color: Colors.textLight,
    marginLeft: Spacing.s,
    maxHeight: 40,
  },
  strengthSection: {
    marginTop: Spacing.s,
    marginBottom: Spacing.m,
  },

  strengthBarContainer: {
    flexDirection: 'row',
    height: 6,
    width: '100%',
    borderRadius: BorderRadius.s,
    overflow: 'hidden',
  },

  strengthSegment: {
    flex: 1,
    marginHorizontal: 1,
    borderRadius: BorderRadius.s,
  },

  strengthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.s,
  },

  strengthLabel: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.medium,
  },

  activeLabel: {
    color: Colors.accent,
  },

  inactiveLabel: {
    color: Colors.disabled,
  },

  termsWrapper: {
    marginBottom: Spacing.s,
  },

  termsText: {
    fontSize: FontSizes.caption,
    color: Colors.disabled,
    textAlign: 'center',
    lineHeight: 18,
  },

  link: {
    fontWeight: FontWeights.bold,
  },
});
