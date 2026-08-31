import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  projectId: firebaseConfigData.projectId,
  appId: firebaseConfigData.appId,
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Initialize Firestore with offline persistent cache & long polling for PWA offline capability
let firestoreDb;
try {
  const firestoreSettings = {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
    experimentalAutoDetectLongPolling: true,
  };

  if (firebaseConfigData.firestoreDatabaseId) {
    firestoreDb = initializeFirestore(
      app,
      firestoreSettings,
      firebaseConfigData.firestoreDatabaseId
    );
  } else {
    firestoreDb = initializeFirestore(app, firestoreSettings);
  }
} catch {
  // If already initialized, get existing instance
  firestoreDb = firebaseConfigData.firestoreDatabaseId
    ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
    : getFirestore(app);
}

export const db = firestoreDb;

export default app;

