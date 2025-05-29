// apps/backend/src/firebase/firebase-admin.config.ts
import * as admin from 'firebase-admin';
import serviceAccount from '../secrets/lexora-be481-firebase-adminsdk-fbsvc-07a70221c8.json';

console.log('serviceAccount', serviceAccount);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export { admin };
