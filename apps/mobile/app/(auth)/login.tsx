import { authService } from '@lexora/auth';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from '@/components/ui/Icon';
import {
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
  BorderRadius,
} from '@lexora/styles';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/providers/AuthProvider';
import { api } from '@lexora/api-client';
import { useAuthStore } from '@/stores/useAuthStore';

export default function Login() {
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canSignIn, setCanSignIn] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const credential = await authService.login(email, password);

      const accessToken = await credential.user.getIdToken();
      const user = await api.user.getMe(accessToken);

      setAuth({ ...user, accessToken });
    } catch (e) {
      console.error(e);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email.length > 0 && password.length > 0) {
      setCanSignIn(true);
    }
  }, [email, password]);

  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [user, router]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon
            name="close"
            size={FontSizes.h1}
            color={Colors.disabled}
            library="Ionicons"
          />
        </TouchableOpacity>
        <Text style={styles.title}>Enter your details</Text>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Icon
            name="mail"
            size={FontSizes.h2}
            color={Colors.disabled}
            library="MaterialIcons"
          ></Icon>
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

        <View style={styles.inputWrapper}>
          <Icon
            library="MaterialIcons"
            name="lock"
            size={FontSizes.h2}
            color={Colors.disabled}
          ></Icon>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.disabled}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <Button onPress={() => {}} text="LOGGING IN..." disabled={true} />
      ) : (
        <Button onPress={handleLogin} text="LOG IN" disabled={!canSignIn} />
      )}
      <Text style={styles.forgotPasswordText}>FORGOT PASSWORD?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main,
    paddingHorizontal: Spacing.screenGutter,
    paddingTop: Spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  title: {
    flex: 1,
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    color: Colors.disabled,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'column',
    gap: Spacing.m,
    marginBottom: Spacing.l,
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
  },
  button: {
    width: '100%',
    backgroundColor: Colors.actionButton,
    paddingVertical: Spacing.m,
    borderRadius: BorderRadius.l,
    alignItems: 'center',
    marginTop: Spacing.l,
  },
  buttonText: {
    fontSize: FontSizes.h3,
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
  },
  errorText: {
    color: 'red',
    fontSize: FontSizes.body,
    textAlign: 'center',
    marginTop: Spacing.m,
  },
  forgotPasswordText: {
    marginTop: Spacing.xl,
    textAlign: 'center',
    color: Colors.accent,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
});
