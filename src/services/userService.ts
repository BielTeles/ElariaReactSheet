// ===================================================================
// SERVIÇO DE USUÁRIOS - ELARIA RPG
// ===================================================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  UserCredential
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from './firebase';
import {
  DatabaseUser,
  CreateUserData,
  UpdateUserData,
  UserDatabasePreferences,
  UserStatistics
} from '../types/database';
import { LoginCredentials, RegisterCredentials } from '../types/auth';

/**
 * Classe de serviço para gerenciamento de usuários
 */
export class UserService {
  
  /**
   * Registra um novo usuário
   */
  static async register(credentials: RegisterCredentials): Promise<DatabaseUser> {
    try {
      console.log('🔥 [UserService] Iniciando registro...');
      console.log('📝 [UserService] Email:', credentials.email);
      console.log('👤 [UserService] Username:', credentials.username);

      // Criar usuário no Firebase Auth REAL
      console.log('🔐 [UserService] Criando usuário no Firebase Auth REAL...');
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      console.log('✅ [UserService] Usuário criado no Firebase Auth:', userCredential.user.uid);

      const firebaseUser = userCredential.user;

      // Após autenticação, verificar se o username já existe
      console.log('👀 [UserService] Verificando se username existe...');
      const usernameExists = await this.checkUsernameExists(credentials.username);
      console.log('📊 [UserService] Username existe?', usernameExists);
      
      if (usernameExists) {
        console.log('❌ [UserService] Username já existe, deletando usuário...');
        // Se username existe, deletar usuário criado e lançar erro
        await userCredential.user.delete();
        throw new Error('Nome de usuário já está em uso');
      }

      // Atualizar perfil do Firebase Auth
      console.log('📝 [UserService] Atualizando perfil do Firebase Auth...');
      await updateProfile(firebaseUser, {
        displayName: credentials.username
      });
      console.log('✅ [UserService] Perfil do Firebase Auth atualizado');

      // Criar documento do usuário no Firestore
      console.log('💾 [UserService] Criando documento no Firestore...');
      const userData: DatabaseUser = {
        uid: firebaseUser.uid,
        email: credentials.email,
        username: credentials.username,
        displayName: credentials.username,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
        preferences: this.getDefaultPreferences(),
        statistics: this.getDefaultStatistics()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      console.log('✅ [UserService] Documento criado no Firestore');

      // Log da atividade
      console.log('📊 [UserService] Salvando log de atividade...');
      await this.logActivity(firebaseUser.uid, 'user_login', 'user', firebaseUser.uid, {
        action: 'first_login'
      });
      console.log('✅ [UserService] Log de atividade salvo');

      console.log('🎉 [UserService] Registro concluído com sucesso!');
      return userData;
    } catch (error: any) {
      console.error('💥 [UserService] Erro no registro:', error);
      console.error('🔍 [UserService] Error code:', error.code);
      console.error('📄 [UserService] Error message:', error.message);
      
      const translatedMessage = this.getErrorMessage(error.code);
      console.log('🌍 [UserService] Mensagem traduzida:', translatedMessage);
      
      throw new Error(translatedMessage || error.message);
    }
  }

  /**
   * Faz login do usuário
   */
  static async login(credentials: LoginCredentials): Promise<DatabaseUser> {
    try {
      // Fazer login no Firebase Auth
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const firebaseUser = userCredential.user;

      // Buscar ou criar dados do usuário no Firestore
      let userData = await this.getUserData(firebaseUser.uid);

      if (!userData) {
        // Criar dados se não existirem (usuários existentes)
        userData = await this.createUserData({
          email: firebaseUser.email!,
          username: firebaseUser.displayName || 'Usuário'
        }, firebaseUser.uid);
      }

      // Atualizar último login
      await this.updateLastLogin(firebaseUser.uid);

      // Log da atividade
      await this.logActivity(firebaseUser.uid, 'user_login', 'user', firebaseUser.uid, {});

      return userData;
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(this.getErrorMessage(error.code) || error.message);
    }
  }

  /**
   * Faz logout do usuário
   */
  static async logout(): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Log da atividade antes do logout
        await this.logActivity(currentUser.uid, 'user_logout', 'user', currentUser.uid, {});
      }
      
      await signOut(auth);
    } catch (error: any) {
      console.error('Erro no logout:', error);
      throw new Error('Erro ao fazer logout');
    }
  }

  /**
   * Obtém dados do usuário atual
   */
  static async getCurrentUserData(): Promise<DatabaseUser | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    return await this.getUserData(currentUser.uid);
  }

  /**
   * Atualiza dados do usuário
   */
  static async updateUserData(userId: string, updates: UpdateUserData): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      
      // Validar username se estiver sendo atualizado
      if (updates.username) {
        const usernameExists = await this.checkUsernameExists(updates.username, userId);
        if (usernameExists) {
          throw new Error('Nome de usuário já está em uso');
        }

        // Atualizar também no Firebase Auth
        const currentUser = auth.currentUser;
        if (currentUser && currentUser.uid === userId) {
          await updateProfile(currentUser, {
            displayName: updates.username
          });
        }
      }

      // Atualizar no Firestore
      await updateDoc(userRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });

      // Log da atividade
      await this.logActivity(userId, 'profile_updated', 'user', userId, updates);
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error);
      throw new Error(error.message || 'Erro ao atualizar perfil');
    }
  }

  /**
   * Envia email de reset de senha
   */
  static async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Erro ao enviar reset de senha:', error);
      throw new Error(this.getErrorMessage(error.code) || 'Erro ao enviar email');
    }
  }

  /**
   * Atualiza senha do usuário
   */
  static async updateUserPassword(newPassword: string): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuário não está logado');
      }

      await updatePassword(currentUser, newPassword);
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      throw new Error(this.getErrorMessage(error.code) || 'Erro ao atualizar senha');
    }
  }

  /**
   * Observer para mudanças de autenticação
   */
  static onAuthStateChange(callback: (user: DatabaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userData = await this.getUserData(firebaseUser.uid);
        callback(userData);
      } else {
        callback(null);
      }
    });
  }

  // ===================================================================
  // MÉTODOS PRIVADOS
  // ===================================================================

  /**
   * Obtém dados do usuário do Firestore
   */
  private static async getUserData(uid: string): Promise<DatabaseUser | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? userDoc.data() as DatabaseUser : null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  }

  /**
   * Cria dados do usuário no Firestore
   */
  private static async createUserData(data: CreateUserData, uid: string): Promise<DatabaseUser> {
    const userData: DatabaseUser = {
      uid,
      email: data.email,
      username: data.username,
      displayName: data.username,
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now(),
      preferences: { ...this.getDefaultPreferences(), ...data.preferences },
      statistics: this.getDefaultStatistics()
    };

    await setDoc(doc(db, 'users', uid), userData);
    return userData;
  }

  /**
   * Verifica se o username já existe
   */
  private static async checkUsernameExists(username: string, excludeUserId?: string): Promise<boolean> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      const querySnapshot = await getDocs(q);

      if (excludeUserId) {
        // Filtrar o próprio usuário
        return querySnapshot.docs.some(doc => doc.id !== excludeUserId);
      }

      return !querySnapshot.empty;
    } catch (error) {
      console.error('Erro ao verificar username:', error);
      return false;
    }
  }

  /**
   * Atualiza último login do usuário
   */
  private static async updateLastLogin(uid: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        lastLogin: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao atualizar último login:', error);
    }
  }

  /**
   * Log de atividade
   */
  private static async logActivity(
    userId: string,
    action: string,
    targetType: string,
    targetId: string,
    details: Record<string, any>
  ): Promise<void> {
    try {
      const activityLog = {
        userId,
        action,
        targetType,
        targetId,
        details,
        timestamp: Timestamp.now()
      };

      await setDoc(doc(collection(db, 'activityLogs')), activityLog);
    } catch (error) {
      console.error('Erro ao salvar log de atividade:', error);
    }
  }

  /**
   * Preferências padrão do usuário
   */
  private static getDefaultPreferences(): UserDatabasePreferences {
    return {
      theme: 'auto',
      language: 'pt-BR',
      autoSave: true,
      notifications: true,
      autoBackup: true,
      shareCharacters: false
    };
  }

  /**
   * Estatísticas padrão do usuário
   */
  private static getDefaultStatistics(): UserStatistics {
    return {
      charactersCreated: 0,
      totalPlayTime: 0
    };
  }

  /**
   * Traduz códigos de erro do Firebase
   */
  private static getErrorMessage(errorCode: string): string | null {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'Este email já está em uso. Tente fazer login ou use outro email.',
      'auth/weak-password': 'A senha é muito fraca. Use pelo menos 6 caracteres.',
      'auth/invalid-email': 'Email inválido. Verifique o formato do email.',
      'auth/user-not-found': 'Usuário não encontrado. Verifique o email ou crie uma conta.',
      'auth/wrong-password': 'Senha incorreta. Tente novamente.',
      'auth/invalid-credential': 'Credenciais inválidas. Verifique seu email e senha.',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
      'auth/requires-recent-login': 'É necessário fazer login novamente para esta operação.',
      'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
      'auth/operation-not-allowed': 'Operação não permitida. Entre em contato com o suporte.'
    };

    return errorMessages[errorCode] || null;
  }
} 