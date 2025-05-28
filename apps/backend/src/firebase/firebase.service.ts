// apps/backend/src/firebase/firebase.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { admin } from './firebase-admin.config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  public auth!: admin.auth.Auth;

  onModuleInit() {
    this.auth = admin.auth();
  }
}
