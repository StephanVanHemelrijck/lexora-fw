import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onIdTokenChanged } from 'firebase/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { auth } from '@lexora/auth';
import { api } from '@lexora/api-client';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  // Setup token refresh every 55 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const refreshedToken = await currentUser.getIdToken(true);
          console.log('[AuthProvider] Refreshed token', refreshedToken);

          const currentStoreUser = useAuthStore.getState().user;
          if (currentStoreUser) {
            useAuthStore.getState().setAuth({
              ...currentStoreUser,
              accessToken: refreshedToken,
            });
          }
        } catch (err) {
          console.error('[AuthProvider] Token refresh failed:', err);
          clearAuth();
        }
      }
    }, 55 * 60 * 1000); // 55 minutes

    return () => clearInterval(interval);
  }, [clearAuth]);

  // Initial auth state listener
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        try {
          const accessToken = await firebaseUser.getIdToken();

          if (!accessToken) {
            clearAuth();
            return;
          }

          const enrichedUser = await api.user.getMe(accessToken);

          setAuth({
            ...enrichedUser,
            accessToken,
          });
        } catch (err) {
          console.error('[AuthProvider] Initial token fetch failed:', err);
          clearAuth();
        }
      } else {
        clearAuth();
      }
    });

    return () => unsubscribe();
  }, [setAuth, clearAuth]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
