import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  public auth!: admin.auth.Auth;

  onModuleInit() {
    const serviceAccount = require('../../secrets/lexora-be481-firebase-adminsdk-fbsvc-07a70221c8.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    this.auth = admin.auth();
  }
}
