// ===================================================================
// TIPOS DO BANCO DE DADOS - ELARIA RPG (SUPABASE)
// ===================================================================

import { Character } from './character';

/**
 * Usuário no banco de dados
 */
export interface DatabaseUser {
  id: string; // UUID do Supabase
  email: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string; // ISO string
  last_login: string; // ISO string
  preferences: UserDatabasePreferences;
  statistics: UserStatistics;
}

/**
 * Preferências do usuário no banco
 */
export interface UserDatabasePreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'pt-BR' | 'en';
  auto_save: boolean;
  notifications: boolean;
  auto_backup: boolean;
  share_characters: boolean;
}

/**
 * Estatísticas do usuário
 */
export interface UserStatistics {
  characters_created: number;
  total_play_time: number; // em minutos
  favorite_class?: string;
  favorite_race?: string;
  last_character_created?: string; // ISO string
}

/**
 * Personagem no banco de dados
 */
export interface DatabaseCharacter extends Omit<Character, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string; // UUID do Supabase
  user_id: string; // ID do proprietário
  created_at: string; // ISO string
  updated_at: string; // ISO string
  version: number; // Para versionamento
  is_public: boolean; // Se pode ser visto por outros
  tags: string[]; // Tags para organização
  backup?: CharacterBackup;
}

/**
 * Backup de personagem
 */
export interface CharacterBackup {
  previous_versions: {
    version: number;
    data: Partial<DatabaseCharacter>;
    timestamp: string; // ISO string
    reason: string; // 'auto' | 'manual' | 'before-edit'
  }[];
  last_backup: string; // ISO string
}

/**
 * Campanha/Grupo
 */
export interface Campaign {
  id: string;
  name: string;
  description: string;
  owner_id: string; // ID do mestre
  members: CampaignMember[];
  characters: string[]; // IDs dos personagens
  created_at: string; // ISO string
  updated_at: string; // ISO string
  settings: CampaignSettings;
  is_active: boolean;
}

/**
 * Membro da campanha
 */
export interface CampaignMember {
  user_id: string;
  username: string;
  role: 'master' | 'player';
  joined_at: string; // ISO string
  character_ids: string[];
  permissions: CampaignPermissions;
}

/**
 * Configurações da campanha
 */
export interface CampaignSettings {
  is_public: boolean;
  allow_character_sharing: boolean;
  max_characters_per_player: number;
  auto_backup: boolean;
  rules: {
    allow_multiclass: boolean;
    starting_level: number;
    use_optional_rules: boolean;
  };
}

/**
 * Permissões na campanha
 */
export interface CampaignPermissions {
  can_invite: boolean;
  can_edit_characters: boolean;
  can_view_other_characters: boolean;
  can_manage_settings: boolean;
}

/**
 * Log de atividades
 */
export interface ActivityLog {
  id: string;
  user_id: string;
  action: ActivityAction;
  target_type: 'character' | 'campaign' | 'user';
  target_id: string;
  details: Record<string, any>;
  timestamp: string; // ISO string
  ip_address?: string;
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
 * Estrutura das tabelas do Supabase
 */
export interface SupabaseTables {
  users: DatabaseUser;
  characters: DatabaseCharacter;
  campaigns: Campaign;
  activity_logs: ActivityLog;
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
  display_name?: string;
  avatar_url?: string;
  preferences?: Partial<UserDatabasePreferences>;
}

/**
 * Filtros para busca de personagens
 */
export interface CharacterFilters {
  user_id?: string;
  is_public?: boolean;
  class?: string;
  race?: string;
  tags?: string[];
  created_after?: string; // ISO string
  created_before?: string; // ISO string
}

/**
 * Opções de ordenação
 */
export interface SortOptions {
  field: string;
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