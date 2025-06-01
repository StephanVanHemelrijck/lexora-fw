// apps/backend/src/firebase/firebase-admin.config.ts
import * as admin from 'firebase-admin';
import * as fs from 'fs';

const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!path) {
  throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS in env');
}

const serviceAccount = JSON.parse(fs.readFileSync(path, 'utf-8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export { admin };
