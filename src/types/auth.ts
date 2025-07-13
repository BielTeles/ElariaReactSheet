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