/// <reference types="vite/client" />

import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID as string,
  appId: import.meta.env.VITE_FIREBASE_APPID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID as string,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

if (import.meta.env.DEV) {
  console.log("connecting to emulators");
  const emulatorHost = import.meta.env.VITE_FIRESTORE_EMULATOR_HOST as string;
  const emulatorPort = parseInt(import.meta.env.VITE_FIRESTORE_EMULATOR_PORT as string, 10);
  connectFirestoreEmulator(db, emulatorHost, emulatorPort);
}

export { db };
