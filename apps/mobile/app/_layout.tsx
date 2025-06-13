import { Stack } from 'expo-router';
import AuthGuard from '../guards/AuthGuard';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Colors } from '@lexora/styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthProvider from '@/providers/AuthProvider';
import { useDailyTimeTracker } from './hooks/useDailyTimeTracker';

export default function RootLayout() {
  useDailyTimeTracker();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AuthGuard>
          <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.container}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
              <StatusBar
                barStyle="dark-content"
                backgroundColor={Colors.main}
              />
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(drawer)" />
              </Stack>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </AuthGuard>
      </AuthProvider>
    </GestureHandlerRootView>
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
