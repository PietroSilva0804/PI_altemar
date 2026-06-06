'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: 'studio-5766777685-f9bd4',
  appId: '1:483246258769:web:b1e2c8643225e11545d670',
  storageBucket: 'studio-5766777685-f9bd4.firebasestorage.app',
  apiKey: 'AIzaSyCgG54f0WRIF9x3OdzZuADxI34s65otnkI',
  authDomain: 'studio-5766777685-f9bd4.firebaseapp.com',
  messagingSenderId: '483246258769',
};

// Inicialize o Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
