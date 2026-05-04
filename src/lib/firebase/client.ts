'use client';

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFirebaseClientEnv, hasFirebaseClientEnv } from '@/lib/env';

let firebaseApp = null;

if (hasFirebaseClientEnv()) {
  firebaseApp = getApps().length ? getApp() : initializeApp(getFirebaseClientEnv());
}

export const clientApp = firebaseApp;
export const clientDb = firebaseApp ? getFirestore(firebaseApp) : null;
export const clientAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const clientStorage = firebaseApp ? getStorage(firebaseApp) : null;
export const googleProvider = new GoogleAuthProvider();
