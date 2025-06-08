// ===================================================================
// CONFIGURAÇÃO DO FIREBASE - ELARIA RPG
// ===================================================================

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// ===================================================================
// CONFIGURAÇÃO ROBUSTA DE VARIÁVEIS DE AMBIENTE
// ===================================================================

// Debug das variáveis de ambiente
console.log('🔍 [Firebase] Debug das variáveis de ambiente:');
console.log('📍 REACT_APP_FIREBASE_API_KEY:', process.env.REACT_APP_FIREBASE_API_KEY);
console.log('📍 REACT_APP_FIREBASE_AUTH_DOMAIN:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);
console.log('📍 REACT_APP_FIREBASE_PROJECT_ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID);
console.log('📍 NODE_ENV:', process.env.NODE_ENV);

// Função para obter variável de ambiente com fallback
const getEnvVar = (key: string, fallback: string): string => {
  const value = process.env[key];
  if (!value || value === 'undefined') {
    console.log(`⚠️ [Firebase] ${key} não definida, usando fallback`);
    return fallback;
  }
  console.log(`✅ [Firebase] ${key} carregada:`, value.substring(0, 10) + '...');
  return value;
};

// Configuração do Firebase com fallbacks robustos - CONFIGURAÇÕES REAIS
const firebaseConfig = {
  apiKey: getEnvVar('REACT_APP_FIREBASE_API_KEY', 'AIzaSyC-UQn8wwnQ1eeowGFcmTAdLQ8gWVY-wuA'),
  authDomain: getEnvVar('REACT_APP_FIREBASE_AUTH_DOMAIN', 'elaria-rpg.firebaseapp.com'),
  projectId: getEnvVar('REACT_APP_FIREBASE_PROJECT_ID', 'elaria-rpg'),
  storageBucket: getEnvVar('REACT_APP_FIREBASE_STORAGE_BUCKET', 'elaria-rpg.firebasestorage.app'),
  messagingSenderId: getEnvVar('REACT_APP_FIREBASE_MESSAGING_SENDER_ID', '855490750259'),
  appId: getEnvVar('REACT_APP_FIREBASE_APP_ID', '1:855490750259:web:8d46eb9ee8e9a8b5ca0046'),
  measurementId: getEnvVar('REACT_APP_FIREBASE_MEASUREMENT_ID', 'G-XXXXXXXXXX')
};

console.log('🔥 [Firebase] Configuração final:');
console.log('🔑 API Key:', firebaseConfig.apiKey);
console.log('🌐 Auth Domain:', firebaseConfig.authDomain);
console.log('📁 Project ID:', firebaseConfig.projectId);

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics (opcional)
let analytics = null;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics não pôde ser inicializado:', error);
  }
}

// Configuração para desenvolvimento local (Firebase Emulator)
// DESABILITADO - USANDO FIREBASE REAL EM PRODUÇÃO
const USE_EMULATOR = false; // Mude para true se quiser usar emulator

if (process.env.NODE_ENV === 'development' && USE_EMULATOR) {
  console.log('🔧 [Firebase] Conectando aos emulators locais...');
  
  // Auth Emulator
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    console.log('✅ [Firebase] Auth Emulator conectado em localhost:9099');
  } catch (error) {
    console.log('⚠️ [Firebase] Auth Emulator já conectado ou erro:', error);
  }
  
  // Firestore Emulator  
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('✅ [Firebase] Firestore Emulator conectado em localhost:8080');
  } catch (error) {
    console.log('⚠️ [Firebase] Firestore Emulator já conectado ou erro:', error);
  }
} else {
  console.log('🔥 [Firebase] Usando Firebase REAL em produção');
}

export { analytics };
export default app; 