import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * Nenhum valor fica escrito aqui: tudo vem de variáveis de ambiente.
 *
 * - Local: crie um `.env.local` na raiz (veja `.env.example`).
 * - Netlify: cadastre as mesmas variáveis em Site settings > Environment variables.
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey) {
  console.error(
    "[Firebase] Configuração ausente. Crie um arquivo .env.local com as variáveis REACT_APP_FIREBASE_* (veja .env.example)."
  );
}

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
export default firebaseApp;
