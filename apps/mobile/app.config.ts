import { ExpoConfig, ConfigContext } from '@expo/config';
import { Colors } from '@lexora/styles';
import 'dotenv/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Lexora',
  slug: 'lexora-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/lex-icon-1.png',
  scheme: 'mobile',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.anonymous.mobile',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/lex-icon-1.png',
      backgroundColor: '#242933',
    },
    package: 'com.anonymous.mobile',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/lex-icon-1.png',
        resizeMode: 'cover',
        backgroundColor: '#242933',
      },
    ],
  ],
  extra: {
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  },
  experiments: {
    typedRoutes: true,
  },
});
