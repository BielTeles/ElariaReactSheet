// ===================================================================
// MOCK FIREBASE - PARA DEMONSTRAÇÃO
// ===================================================================

import { RegisterCredentials, LoginCredentials } from '../types/auth';
import { DatabaseUser } from '../types/database';

interface MockUser {
  uid: string;
  email: string;
  username: string;
  password: string; // Em produção NUNCA armazenar senha em texto plano
  createdAt: Date;
}

class MockFirebaseAuth {
  private users: MockUser[] = [];
  private currentUser: MockUser | null = null;

  // Simula createUserWithEmailAndPassword
  async createUserWithEmailAndPassword(email: string, password: string): Promise<{ user: { uid: string; email: string } }> {
    console.log('🔧 [MockFirebase] Simulando criação de usuário...');
    
    // Simular delay da rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar se email já existe
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('auth/email-already-in-use');
    }
    
    // Criar usuário
    const uid = 'mock_' + Math.random().toString(36).substr(2, 9);
    const newUser: MockUser = {
      uid,
      email,
      username: email.split('@')[0], // Username temporário
      password,
      createdAt: new Date()
    };
    
    this.users.push(newUser);
    this.currentUser = newUser;
    
    console.log('✅ [MockFirebase] Usuário criado:', uid);
    return {
      user: { uid, email }
    };
  }

  // Simula signInWithEmailAndPassword
  async signInWithEmailAndPassword(email: string, password: string): Promise<{ user: { uid: string; email: string } }> {
    console.log('🔧 [MockFirebase] Simulando login...');
    
    // Simular delay da rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('auth/invalid-credential');
    }
    
    this.currentUser = user;
    console.log('✅ [MockFirebase] Login realizado:', user.uid);
    
    return {
      user: { uid: user.uid, email: user.email }
    };
  }

  // Simula signOut
  async signOut(): Promise<void> {
    console.log('🔧 [MockFirebase] Simulando logout...');
    this.currentUser = null;
    console.log('✅ [MockFirebase] Logout realizado');
  }

  // Getter para usuário atual
  get currentUserData(): MockUser | null {
    return this.currentUser;
  }

  // Simula updateProfile
  async updateProfile(updates: { displayName: string }): Promise<void> {
    if (this.currentUser) {
      this.currentUser.username = updates.displayName;
      console.log('✅ [MockFirebase] Perfil atualizado');
    }
  }
}

class MockFirestore {
  private collections: { [key: string]: { [docId: string]: any } } = {
    users: {},
    characters: {},
    activityLogs: {}
  };

  // Simula setDoc
  async setDoc(path: string, data: any): Promise<void> {
    console.log('💾 [MockFirestore] Salvando documento:', path);
    
    const [collection, docId] = path.split('/');
    if (!this.collections[collection]) {
      this.collections[collection] = {};
    }
    
    // Simular timestamp
    const docData = {
      ...data,
      createdAt: data.createdAt || new Date(),
      lastLogin: data.lastLogin || new Date()
    };
    
    this.collections[collection][docId] = docData;
    console.log('✅ [MockFirestore] Documento salvo');
  }

  // Simula getDoc
  async getDoc(path: string): Promise<{ exists: () => boolean; data: () => any }> {
    console.log('📖 [MockFirestore] Buscando documento:', path);
    
    const [collection, docId] = path.split('/');
    const doc = this.collections[collection]?.[docId];
    
    return {
      exists: () => !!doc,
      data: () => doc
    };
  }

  // Simula query para username
  async queryUsername(username: string): Promise<boolean> {
    console.log('🔍 [MockFirestore] Verificando username:', username);
    
    const users = Object.values(this.collections.users || {});
    const exists = users.some((user: any) => user.username === username);
    
    console.log('📊 [MockFirestore] Username existe?', exists);
    return exists;
  }
}

// Instâncias globais
export const mockAuth = new MockFirebaseAuth();
export const mockDb = new MockFirestore();

// Funções de conveniência que imitam o Firebase SDK
export const createUserWithEmailAndPassword = mockAuth.createUserWithEmailAndPassword.bind(mockAuth);
export const signInWithEmailAndPassword = mockAuth.signInWithEmailAndPassword.bind(mockAuth);
export const signOut = mockAuth.signOut.bind(mockAuth);
export const updateProfile = mockAuth.updateProfile.bind(mockAuth);

export const setDoc = (pathParts: any, data: any) => {
  const path = `${pathParts.path}`;
  return mockDb.setDoc(path, data);
};

export const getDoc = (pathParts: any) => {
  const path = `${pathParts.path}`;
  return mockDb.getDoc(path);
};

export const checkUsernameExists = mockDb.queryUsername.bind(mockDb);

console.log('🎭 [MockFirebase] Sistema de demonstração inicializado');
console.log('📝 [MockFirebase] Este é um sistema simulado para teste'); 