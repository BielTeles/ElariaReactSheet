// ===================================================================
// TIPOS DO BANCO DE DADOS - ELARIA RPG
// ===================================================================

import { Timestamp } from 'firebase/firestore';
import { Character } from './character';

/**
 * Usuário no banco de dados
 */
export interface DatabaseUser {
  uid: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  preferences: UserDatabasePreferences;
  statistics: UserStatistics;
}

/**
 * Preferências do usuário no banco
 */
export interface UserDatabasePreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'pt-BR' | 'en';
  autoSave: boolean;
  notifications: boolean;
  autoBackup: boolean;
  shareCharacters: boolean;
}

/**
 * Estatísticas do usuário
 */
export interface UserStatistics {
  charactersCreated: number;
  totalPlayTime: number; // em minutos
  favoriteClass?: string;
  favoriteRace?: string;
  lastCharacterCreated?: Timestamp;
}

/**
 * Personagem no banco de dados
 */
export interface DatabaseCharacter extends Omit<Character, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string; // Firestore ID
  userId: string; // ID do proprietário
  createdAt: Timestamp;
  updatedAt: Timestamp;
  version: number; // Para versionamento
  isPublic: boolean; // Se pode ser visto por outros
  tags: string[]; // Tags para organização
  backup?: CharacterBackup;
}

/**
 * Backup de personagem
 */
export interface CharacterBackup {
  previousVersions: {
    version: number;
    data: Partial<DatabaseCharacter>;
    timestamp: Timestamp;
    reason: string; // 'auto' | 'manual' | 'before-edit'
  }[];
  lastBackup: Timestamp;
}

/**
 * Campanha/Grupo
 */
export interface Campaign {
  id: string;
  name: string;
  description: string;
  ownerId: string; // ID do mestre
  members: CampaignMember[];
  characters: string[]; // IDs dos personagens
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings: CampaignSettings;
  isActive: boolean;
}

/**
 * Membro da campanha
 */
export interface CampaignMember {
  userId: string;
  username: string;
  role: 'master' | 'player';
  joinedAt: Timestamp;
  characterIds: string[];
  permissions: CampaignPermissions;
}

/**
 * Configurações da campanha
 */
export interface CampaignSettings {
  isPublic: boolean;
  allowCharacterSharing: boolean;
  maxCharactersPerPlayer: number;
  autoBackup: boolean;
  rules: {
    allowMulticlass: boolean;
    startingLevel: number;
    useOptionalRules: boolean;
  };
}

/**
 * Permissões na campanha
 */
export interface CampaignPermissions {
  canInvite: boolean;
  canEditCharacters: boolean;
  canViewOtherCharacters: boolean;
  canManageSettings: boolean;
}

/**
 * Log de atividades
 */
export interface ActivityLog {
  id: string;
  userId: string;
  action: ActivityAction;
  targetType: 'character' | 'campaign' | 'user';
  targetId: string;
  details: Record<string, any>;
  timestamp: Timestamp;
  ipAddress?: string;
}

/**
 * Tipos de ação
 */
export type ActivityAction = 
  | 'character_created'
  | 'character_updated'
  | 'character_deleted'
  | 'character_shared'
  | 'campaign_created'
  | 'campaign_joined'
  | 'campaign_left'
  | 'user_login'
  | 'user_logout'
  | 'profile_updated';

/**
 * Estrutura das coleções do Firestore
 */
export interface FirestoreCollections {
  users: DatabaseUser;
  characters: DatabaseCharacter;
  campaigns: Campaign;
  activityLogs: ActivityLog;
}

/**
 * Dados para criação de usuário
 */
export interface CreateUserData {
  email: string;
  username: string;
  preferences?: Partial<UserDatabasePreferences>;
}

/**
 * Dados para atualização de usuário
 */
export interface UpdateUserData {
  username?: string;
  displayName?: string;
  avatar?: string;
  preferences?: Partial<UserDatabasePreferences>;
}

/**
 * Filtros para busca de personagens
 */
export interface CharacterFilters {
  userId?: string;
  isPublic?: boolean;
  class?: string;
  race?: string;
  tags?: string[];
  createdAfter?: Date;
  createdBefore?: Date;
}

/**
 * Opções de ordenação
 */
export interface SortOptions {
  field: keyof DatabaseCharacter;
  direction: 'asc' | 'desc';
}

/**
 * Resultado paginado
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
} 