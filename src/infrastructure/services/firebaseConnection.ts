import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/**
 * Nenhum valor fica escrito aqui: tudo vem de variáveis de ambiente.
 *
 * - Local: crie um `.env.local` na raiz (veja `.env.example`).
 * - Netlify: cadastre as mesmas variáveis em Site settings > Environment variables
 *   e rode um novo deploy (elas só entram no bundle durante o build).
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

/** Variáveis obrigatórias que ficaram sem valor no build. */
export const variaveisFaltando: string[] = Object.entries({
  REACT_APP_FIREBASE_API_KEY: firebaseConfig.apiKey,
  REACT_APP_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  REACT_APP_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  REACT_APP_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
  REACT_APP_FIREBASE_APP_ID: firebaseConfig.appId,
})
  .filter(([, valor]) => !valor)
  .map(([nome]) => nome);

export const configuracaoValida = variaveisFaltando.length === 0;

if (!configuracaoValida) {
  console.error(
    "[Firebase] Configuração incompleta. Faltam as variáveis:",
    variaveisFaltando.join(", ")
  );
}

/*
 * Com a configuração incompleta, tanto o getAuth (auth/invalid-api-key) quanto
 * o getStorage (storage/no-default-bucket) lançam já no import e derrubam o app
 * inteiro antes do React montar — o usuário só vê o carregamento girando.
 * Aqui nada é inicializado nesse caso; quem trata a situação é o index.tsx,
 * mostrando uma tela de erro legível.
 */
const naoConfigurado = <T,>() => undefined as unknown as T;

const firebaseApp: FirebaseApp = configuracaoValida
  ? initializeApp(firebaseConfig)
  : naoConfigurado<FirebaseApp>();

export const db: Firestore = configuracaoValida
  ? getFirestore(firebaseApp)
  : naoConfigurado<Firestore>();

export const auth: Auth = configuracaoValida
  ? getAuth(firebaseApp)
  : naoConfigurado<Auth>();

export const storage: FirebaseStorage = configuracaoValida
  ? getStorage(firebaseApp)
  : naoConfigurado<FirebaseStorage>();

export default firebaseApp;
