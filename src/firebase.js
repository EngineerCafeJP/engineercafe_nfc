import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

if (import.meta.env.DEV) {
  const emulatorHost = import.meta.env.VITE_FIRESTORE_EMULATOR_HOST ;
  const emulatorPort = import.meta.env.VITE_FIRESTORE_EMULATOR_PORT ;
  connectFirestoreEmulator(db, emulatorHost, emulatorPort);
}

export { db };
