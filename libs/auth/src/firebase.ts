import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  Auth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBHZvT9Ep0aBsHtERgqVyS0ylGW1mX3w7U',
  authDomain: 'lexora-be481.firebaseapp.com',
  projectId: 'lexora-be481',
  // Add any additional config properties you need
};

// Initialize Firebase only once
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize auth with persistence
let auth: Auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { app, auth };
