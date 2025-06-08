// ===================================================================
// CONTEXTO DE AUTENTICAÇÃO FIREBASE - ELARIA RPG
// ===================================================================

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { Timestamp } from 'firebase/firestore';
import { UserService } from '../services/userService';
import { DatabaseUser } from '../types/database';
import { LoginCredentials, RegisterCredentials, AuthContextType } from '../types/auth';

// ===================================================================
// ESTADO INICIAL
// ===================================================================

interface FirebaseAuthState {
  user: DatabaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: FirebaseAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// ===================================================================
// ACTIONS
// ===================================================================

type FirebaseAuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: DatabaseUser | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGIN_SUCCESS'; payload: DatabaseUser }
  | { type: 'LOGOUT' };

// ===================================================================
// REDUCER
// ===================================================================

function firebaseAuthReducer(state: FirebaseAuthState, action: FirebaseAuthAction): FirebaseAuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    default:
      return state;
  }
}

// ===================================================================
// UTILITÁRIOS DE CONVERSÃO
// ===================================================================

/**
 * Converte DatabaseUser para User (compatibilidade com tipos antigos)
 */
function convertDatabaseUserToUser(dbUser: DatabaseUser) {
  return {
    id: dbUser.uid,
    username: dbUser.username,
    email: dbUser.email,
    avatar: dbUser.avatar,
    createdAt: dbUser.createdAt.toDate(),
    lastLogin: dbUser.lastLogin.toDate(),
    preferences: {
      theme: dbUser.preferences.theme,
      language: dbUser.preferences.language,
      autoSave: dbUser.preferences.autoSave,
      notifications: dbUser.preferences.notifications,
    }
  };
}

// ===================================================================
// CONTEXTO
// ===================================================================

const FirebaseAuthContext = createContext<AuthContextType | undefined>(undefined);

// ===================================================================
// PROVIDER
// ===================================================================

interface FirebaseAuthProviderProps {
  children: React.ReactNode;
}

export const FirebaseAuthProvider: React.FC<FirebaseAuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(firebaseAuthReducer, initialState);

  // ===================================================================
  // INICIALIZAÇÃO
  // ===================================================================

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });

    // Observer do Firebase Auth
    const unsubscribe = UserService.onAuthStateChange((user: DatabaseUser | null) => {
      dispatch({ type: 'SET_USER', payload: user });
    });

    return unsubscribe;
  }, []);

  // ===================================================================
  // FUNÇÕES DE AUTENTICAÇÃO
  // ===================================================================

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const userData = await UserService.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      return true;
    } catch (error: any) {
      console.error('Erro no login:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return false;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<{ success: boolean; error?: string }> => {
    console.log('🔥 [FirebaseAuthContext] Iniciando register...');
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      console.log('🚀 [FirebaseAuthContext] Chamando UserService.register...');
      const userData = await UserService.register(credentials);
      console.log('✅ [FirebaseAuthContext] UserService.register retornou:', userData);
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
      console.log('🎉 [FirebaseAuthContext] Dispatch LOGIN_SUCCESS executado');
      return { success: true };
    } catch (error: any) {
      console.error('💥 [FirebaseAuthContext] Erro no registro:', error);
      console.error('📄 [FirebaseAuthContext] Error message:', error.message);
      
      dispatch({ type: 'SET_ERROR', payload: error.message });
      console.log('❌ [FirebaseAuthContext] Dispatch SET_ERROR executado');
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await UserService.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error: any) {
      console.error('Erro no logout:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const updateProfile = useCallback(async (updates: any): Promise<boolean> => {
    if (!state.user) return false;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      await UserService.updateUserData(state.user.uid, {
        username: updates.username,
        displayName: updates.username,
        avatar: updates.avatar,
        preferences: updates.preferences
      });

      // Recarregar dados do usuário
      const updatedUser = await UserService.getCurrentUserData();
      if (updatedUser) {
        dispatch({ type: 'SET_USER', payload: updatedUser });
      }

      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return false;
    }
  }, [state.user]);

  // ===================================================================
  // FUNÇÕES ADICIONAIS DO FIREBASE
  // ===================================================================

  const sendPasswordReset = useCallback(async (email: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await UserService.sendPasswordReset(email);
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error: any) {
      console.error('Erro ao enviar reset de senha:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return false;
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await UserService.updateUserPassword(newPassword);
      dispatch({ type: 'SET_LOADING', payload: false });
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return false;
    }
  }, []);

  // ===================================================================
  // VALOR DO CONTEXTO (COMPATIBILIDADE)
  // ===================================================================

  // Wrapper para manter compatibilidade com AuthContextType
  const registerWrapper = async (credentials: RegisterCredentials): Promise<boolean> => {
    const result = await register(credentials);
    return result.success;
  };

  const contextValue: AuthContextType = {
    user: state.user ? convertDatabaseUserToUser(state.user) : null,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register: registerWrapper,
    logout,
    clearError,
    updateProfile,
  };

  // Valor estendido com funcionalidades Firebase
  const extendedContextValue = {
    ...contextValue,
    // Dados específicos do Firebase
    firebaseUser: state.user,
    registerDetailed: register, // Função detalhada que retorna { success, error }
    sendPasswordReset,
    updatePassword,
  };

  return (
    <FirebaseAuthContext.Provider value={extendedContextValue as any}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

// ===================================================================
// HOOK
// ===================================================================

export const useFirebaseAuth = (): AuthContextType & {
  firebaseUser: DatabaseUser | null;
  registerDetailed: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
} => {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error('useFirebaseAuth deve ser usado dentro de um FirebaseAuthProvider');
  }
  return context as any;
}; 