// ===================================================================
// TIPOS DE AUTENTICAÇÃO - ELARIA RPG
// ===================================================================

/**
 * Interface para dados do usuário
 */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
  preferences: UserPreferences;
}

/**
 * Preferências do usuário
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'pt-BR' | 'en';
  autoSave: boolean;
  notifications: boolean;
}

/**
 * Interface para credenciais de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Interface para dados de registro
 */
export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Estado da autenticação
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Contexto de autenticação
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
}

/**
 * Token de sessão
 */
export interface SessionToken {
  token: string;
  userId: string;
  expiresAt: Date;
  refreshToken: string;
}

/**
 * Dados armazenados do usuário
 */
export interface StoredUserData {
  user: User;
  sessionToken: SessionToken;
  rememberMe: boolean;
} 