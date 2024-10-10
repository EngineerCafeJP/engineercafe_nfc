import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-nfc',
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export { db };
