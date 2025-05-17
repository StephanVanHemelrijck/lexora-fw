import { AuthProvider } from '@lexora/auth';
import { Stack } from 'expo-router';
import AuthGuard from './guards/AuthGuard';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthGuard>
    </AuthProvider>
  );
}
