import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

if (import.meta.env.DEV) {
  console.log("connecting to emulators");
  const emulatorHost = import.meta.env.VITE_FIRESTORE_EMULATOR_HOST;
  const emulatorPort = import.meta.env.VITE_FIRESTORE_EMULATOR_PORT;
  connectFirestoreEmulator(db, emulatorHost, emulatorPort);
}

export { db };
