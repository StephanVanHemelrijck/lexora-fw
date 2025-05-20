import { AuthProvider } from '@lexora/auth';
import { Stack } from 'expo-router';
import AuthGuard from './guards/AuthGuard';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Colors } from '@lexora/styles';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard>
        <SafeAreaView style={styles.safe}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
          >
            <StatusBar barStyle="dark-content" backgroundColor={Colors.main} />
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </AuthGuard>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.main,
  },
  container: {
    flex: 1,
  },
});
