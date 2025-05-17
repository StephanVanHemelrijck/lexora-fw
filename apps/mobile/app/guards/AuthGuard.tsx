import React, { useEffect, useState } from 'react';
import { useAuth } from '@lexora/auth';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true); // Mark component as mounted
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (loading) return;
    if (!user) {
      router.replace('/login');
    }
  }, [user, loading, router, mounted]);

  // If user is not logged in, redirect to login page
  if (loading || !mounted) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  // If user is logged in, render children
  return <>{children}</>;
};

export default AuthGuard;
