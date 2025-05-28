// apps/backend/src/firebase/firebase-admin.config.ts
import * as admin from 'firebase-admin';

const base64Key = process.env.FIREBASE_ADMIN_KEY_BASE64;
if (!base64Key) {
  throw new Error(
    'Missing FIREBASE_ADMIN_KEY_BASE64 in environment variables.'
  );
}

const serviceAccount = JSON.parse(
  Buffer.from(base64Key, 'base64').toString('utf-8')
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export { admin };
