// ===================================================================
// CONTEXTO DE AUTENTICAÇÃO - ELARIA RPG
// ===================================================================

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { 
  User, 
  AuthState, 
  AuthContextType, 
  LoginCredentials, 
  RegisterCredentials,
  UserPreferences,
  StoredUserData,
  SessionToken
} from '../types/auth';
import { 
  STORAGE_KEYS, 
  AUTH_CONFIG, 
  AUTH_ERROR_MESSAGES 
} from '../constants';

// ===================================================================
// ESTADO INICIAL
// ===================================================================

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// ===================================================================
// ACTIONS
// ===================================================================

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' };

// ===================================================================
// REDUCER
// ===================================================================

function authReducer(state: AuthState, action: AuthAction): AuthState {
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
// UTILITÁRIOS
// ===================================================================

/**
 * Gera um ID único
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Valida email
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida senha
 */
function isValidPassword(password: string): boolean {
  return AUTH_CONFIG.PASSWORD_PATTERN.test(password);
}

/**
 * Cria token de sessão
 */
function createSessionToken(userId: string, rememberMe: boolean): SessionToken {
  const duration = rememberMe ? AUTH_CONFIG.REMEMBER_ME_DURATION : AUTH_CONFIG.SESSION_DURATION;
  return {
    token: generateId(),
    userId,
    expiresAt: new Date(Date.now() + duration),
    refreshToken: generateId(),
  };
}

/**
 * Verifica se o token é válido
 */
function isTokenValid(token: SessionToken): boolean {
  return new Date() < new Date(token.expiresAt);
}

// ===================================================================
// SERVIÇOS DE STORAGE
// ===================================================================

class AuthStorage {
  /**
   * Salva dados do usuário
   */
  static saveUserData(userData: StoredUserData): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify({
        ...userData,
        user: {
          ...userData.user,
          createdAt: userData.user.createdAt.toISOString(),
          lastLogin: userData.user.lastLogin.toISOString(),
        },
        sessionToken: {
          ...userData.sessionToken,
          expiresAt: userData.sessionToken.expiresAt.toISOString(),
        }
      }));
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
    }
  }

  /**
   * Carrega dados do usuário
   */
  static loadUserData(): StoredUserData | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!data) return null;

      const parsed = JSON.parse(data);
      return {
        ...parsed,
        user: {
          ...parsed.user,
          createdAt: new Date(parsed.user.createdAt),
          lastLogin: new Date(parsed.user.lastLogin),
        },
        sessionToken: {
          ...parsed.sessionToken,
          expiresAt: new Date(parsed.sessionToken.expiresAt),
        }
      };
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      return null;
    }
  }

  /**
   * Remove dados do usuário
   */
  static clearUserData(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Carrega usuários existentes (simulação de BD)
   */
  static loadUsers(): User[] {
    try {
      const data = localStorage.getItem('elaria-users');
      if (!data) return [];
      
      const users = JSON.parse(data);
      return users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: new Date(user.lastLogin),
      }));
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      return [];
    }
  }

  /**
   * Salva usuários (simulação de BD)
   */
  static saveUsers(users: User[]): void {
    try {
      const serializedUsers = users.map(user => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        lastLogin: user.lastLogin.toISOString(),
      }));
      localStorage.setItem('elaria-users', JSON.stringify(serializedUsers));
    } catch (error) {
      console.error('Erro ao salvar usuários:', error);
    }
  }
}

// ===================================================================
// CONTEXTO
// ===================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===================================================================
// PROVIDER
// ===================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ===================================================================
  // INICIALIZAÇÃO
  // ===================================================================

  useEffect(() => {
    const initAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const userData = AuthStorage.loadUserData();
        
        if (userData && isTokenValid(userData.sessionToken)) {
          // Atualizar último login
          const updatedUser = {
            ...userData.user,
            lastLogin: new Date(),
          };
          
          const updatedUserData = {
            ...userData,
            user: updatedUser,
          };
          
          AuthStorage.saveUserData(updatedUserData);
          dispatch({ type: 'SET_USER', payload: updatedUser });
        } else {
          // Sessão expirada
          AuthStorage.clearUserData();
          dispatch({ type: 'SET_USER', payload: null });
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar sessão' });
      }
    };

    initAuth();
  }, []);

  // ===================================================================
  // FUNÇÕES DE AUTENTICAÇÃO
  // ===================================================================

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Validações
      if (!credentials.email) {
        dispatch({ type: 'SET_ERROR', payload: AUTH_ERROR_MESSAGES.REQUIRED_EMAIL });
        return false;
      }

      if (!credentials.password) {
        dispatch({ type: 'SET_ERROR', payload: AUTH_ERROR_MESSAGES.REQUIRED_PASSWORD });
        return false;
      }

      if (!isValidEmail(credentials.email)) {
        dispatch({ type: 'SET_ERROR', payload: AUTH_ERROR_MESSAGES.INVALID_EMAIL });
        return false;
      }

      // Buscar usuário
      const users = AuthStorage.loadUsers();
      const user = users.find(u => u.email === credentials.email);

      if (!user) {
        dispatch({ type: 'SET_ERROR', payload: AUTH_ERROR_MESSAGES.USER_NOT_FOUND });
        return false;
      }

      // Aqui seria validada a senha (em um sistema real, seria um hash)
      // Por simplicidade, vamos usar uma validação básica
      
      // Atualizar dados do usuário
      const updatedUser = {
        ...user,
        lastLogin: new Date(),
      };

      // Criar sessão
      const sessionToken = createSessionToken(user.id, credentials.rememberMe || false);
      
      const userData: StoredUserData = {
        user: updatedUser,
        sessionToken,
        rememberMe: credentials.rememberMe || false,
      };

      // Salvar dados
      AuthStorage.saveUserData(userData);

      // Atualizar lista de usuários
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      AuthStorage.saveUsers(updatedUsers);

      dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
      return true;

    } catch (error) {
      console.error('Erro no login:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro interno. Tente novamente.' });
      return false;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      // Validações
      if (!credentials.username) {
        dispatch({ type: 'SET_ERROR', payload: AUTH_ERROR_MESSAGES.REQUIRED_USERNAME });
        return false;
      }

      if (!credentials.email) {
        dispatch({ type: 'SET_ERROR', payload: AUTH_ERROR_MESSAGES.REQUIRED_EMAIL });
        return false;
      }

      if (!credentials.password) {
        dispatch({ type: 'SET_ERROR', payload: AUTH_ERROR_MESSAGES.REQUIRED_PASSWORD });
        return false;
      }

      if (!isValidEmail(credentials.email)) {
        dispatch({ type: 'SET_ERROR', payload: AUTH_ERROR_MESSAGES.INVALID_EMAIL });
        return false;
      }

      if (!isValidPassword(credentials.password)) {
        dispatch({ type: 'SET_ERROR', payload: AUTH_ERROR_MESSAGES.WEAK_PASSWORD });
        return false;
      }

      if (credentials.password !== credentials.confirmPassword) {
        dispatch({ type: 'SET_ERROR', payload: AUTH_ERROR_MESSAGES.PASSWORDS_DONT_MATCH });
        return false;
      }

      // Verificar se usuário já existe
      const users = AuthStorage.loadUsers();
      
      if (users.some(u => u.email === credentials.email)) {
        dispatch({ type: 'SET_ERROR', payload: AUTH_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS });
        return false;
      }

      if (users.some(u => u.username === credentials.username)) {
        dispatch({ type: 'SET_ERROR', payload: AUTH_ERROR_MESSAGES.USERNAME_ALREADY_EXISTS });
        return false;
      }

      // Criar novo usuário
      const defaultPreferences: UserPreferences = {
        theme: 'auto',
        language: 'pt-BR',
        autoSave: true,
        notifications: true,
      };

      const newUser: User = {
        id: generateId(),
        username: credentials.username,
        email: credentials.email,
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: defaultPreferences,
      };

      // Salvar usuário
      const updatedUsers = [...users, newUser];
      AuthStorage.saveUsers(updatedUsers);

      // Fazer login automático
      const sessionToken = createSessionToken(newUser.id, false);
      
      const userData: StoredUserData = {
        user: newUser,
        sessionToken,
        rememberMe: false,
      };

      AuthStorage.saveUserData(userData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
      return true;

    } catch (error) {
      console.error('Erro no registro:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro interno. Tente novamente.' });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    AuthStorage.clearUserData();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<boolean> => {
    if (!state.user) return false;

    try {
      const updatedUser = { ...state.user, ...updates };
      
      // Atualizar na lista de usuários
      const users = AuthStorage.loadUsers();
      const updatedUsers = users.map(u => u.id === state.user!.id ? updatedUser : u);
      AuthStorage.saveUsers(updatedUsers);

      // Atualizar dados salvos
      const userData = AuthStorage.loadUserData();
      if (userData) {
        const updatedUserData = {
          ...userData,
          user: updatedUser,
        };
        AuthStorage.saveUserData(updatedUserData);
      }

      dispatch({ type: 'SET_USER', payload: updatedUser });
      return true;
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar perfil' });
      return false;
    }
  }, [state.user]);

  // ===================================================================
  // VALOR DO CONTEXTO
  // ===================================================================

  const contextValue: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ===================================================================
// HOOK
// ===================================================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 