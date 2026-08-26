import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0385276763",
  appId: "1:398473187816:web:becc6125d6dc5dc1f8545d",
  apiKey: "AIzaSyDPvrnAw7xVXxwof-KdC2YpTz93FSYYGRs",
  authDomain: "gen-lang-client-0385276763.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-probashimuktofun-1f8d1a6e-7e1d-405a-aa01-b0a70d406f10",
  storageBucket: "gen-lang-client-0385276763.firebasestorage.app",
  messagingSenderId: "398473187816"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export default app;
