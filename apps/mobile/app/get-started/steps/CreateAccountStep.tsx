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
  const { nextStep, displayName, email, password, setAccountInfo } =
    useOnboardingStore();

  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    displayName: false,
    email: false,
    password: false,
  });

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;
  const isDisplayNameValid = displayName.trim().length >= 3;

  const canSubmit = isEmailValid && isPasswordValid && isDisplayNameValid;

  const getValidationIcon = (isValid: boolean, show: boolean) => {
    if (!show) return null;
    return (
      <Icon
        library="Ionicons"
        name={isValid ? 'checkmark-circle' : 'close-circle'}
        size={FontSizes.h2}
        color={isValid ? Colors.success : Colors.error}
      />
    );
  };

  const handleCreateAccount = async () => {
    nextStep();
  };

  const passwordStrength = useMemo(() => {
    if (!password) return { label: '', color: '', level: 0 };

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    if (password.length >= 12 && score >= 4) score += 1;

    const labels = ['Weak', 'Medium', 'Strong'];
    const colors = [Colors.error, Colors.warning, Colors.success];

    let level = 0;
    if (score >= 4) level = 3;
    else if (score >= 2) level = 2;
    else level = 1;

    return {
      label: labels[level - 1],
      color: colors[level - 1],
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
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputGroup}>
          <View
            style={[
              styles.inputWrapper,
              touched.displayName &&
                !isDisplayNameValid &&
                displayName !== '' && { borderColor: Colors.error },
            ]}
          >
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
              onChangeText={(value) =>
                setAccountInfo({ displayName: value, email, password })
              }
              onBlur={() =>
                setTouched((prev) => ({ ...prev, displayName: true }))
              }
            />
            {getValidationIcon(
              isDisplayNameValid,
              touched.displayName && displayName !== ''
            )}
          </View>
          <View style={styles.errorWrapper}>
            {touched.displayName &&
              !isDisplayNameValid &&
              displayName !== '' && (
                <Text style={styles.errorText}>
                  Display name must be at least 3 characters.
                </Text>
              )}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View
            style={[
              styles.inputWrapper,
              touched.email &&
                !isEmailValid &&
                email !== '' && {
                  borderColor: Colors.error,
                },
            ]}
          >
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
              onChangeText={(value) =>
                setAccountInfo({ displayName, email: value, password })
              }
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            />
            {getValidationIcon(isEmailValid, touched.email && email !== '')}
          </View>
          <View style={styles.errorWrapper}>
            {touched.email && !isEmailValid && email !== '' && (
              <Text style={styles.errorText}>Please enter a valid email.</Text>
            )}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <View
            style={[
              styles.inputWrapper,
              touched.password &&
                !isPasswordValid &&
                password !== '' && { borderColor: Colors.error },
            ]}
          >
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
              onChangeText={(value) =>
                setAccountInfo({ displayName, email, password: value })
              }
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
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
            {getValidationIcon(
              isPasswordValid,
              touched.password && password !== ''
            )}
          </View>
          <View style={styles.errorWrapper}>
            {touched.password && !isPasswordValid && password !== '' && (
              <Text style={styles.errorText}>
                Password must be at least 6 characters.
              </Text>
            )}
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
                            : `${color}33`,
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
        <Button
          text="CREATE ACCOUNT"
          onPress={handleCreateAccount}
          theme="purple"
          disabled={!canSubmit}
        />
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
  scrollContent: {
    paddingBottom: Spacing.l,
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
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.body,
    color: Colors.textLight,
    marginLeft: Spacing.s,
    maxHeight: 40,
  },
  errorWrapper: {
    // minHeight: 18,
    marginLeft: Spacing.s,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSizes.caption,
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
