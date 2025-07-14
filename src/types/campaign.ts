// ===================================================================
// TIPOS ESPECÍFICOS PARA CAMPANHAS - ELARIA RPG
// ===================================================================

import { Campaign, CampaignMember, CampaignSettings, CampaignPermissions } from './database';
import { CharacterCreation } from './character';
import { CharacterState } from './interactive';

/**
 * Dados completos de uma campanha com informações expandidas
 */
export interface CampaignWithDetails extends Campaign {
  member_count: number;
  character_count: number;
  last_activity: string;
  invite_code?: string;
  master_info: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

/**
 * Dados para criação de campanha
 */
export interface CreateCampaignData {
  name: string;
  description: string;
  settings?: Partial<CampaignSettings>;
}

/**
 * Dados para atualização de campanha
 */
export interface UpdateCampaignData {
  name?: string;
  description?: string;
  settings?: Partial<CampaignSettings>;
  is_active?: boolean;
}

/**
 * Convite para campanha
 */
export interface CampaignInvite {
  id: string;
  campaign_id: string;
  campaign_name: string;
  master_name: string;
  invite_code: string;
  expires_at: string;
  max_uses?: number;
  current_uses: number;
  created_at: string;
  is_active: boolean;
}

/**
 * Dados para processar convite
 */
export interface ProcessInviteData {
  invite_code: string;
  character_ids?: string[];
}

/**
 * Resultado do processamento de convite
 */
export interface ProcessInviteResult {
  success: boolean;
  campaign?: CampaignWithDetails;
  error?: string;
  already_member?: boolean;
}

/**
 * Personagem vinculado a uma campanha
 */
export interface CampaignCharacter {
  id: string;
  user_id: string;
  campaign_id: string;
  character_data: CharacterCreation;
  character_state: CharacterState;
  player_info: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
  linked_at: string;
  is_active: boolean;
  permissions: {
    master_can_view: boolean;
    master_can_edit: boolean;
    public_in_campaign: boolean;
  };
}

/**
 * Estado do rastreador de combate
 */
export interface CombatTracker {
  id: string;
  campaign_id: string;
  name: string;
  is_active: boolean;
  current_round: number;
  current_turn: number;
  participants: CombatParticipant[];
  created_at: string;
  updated_at: string;
}

/**
 * Participante do combate
 */
export interface CombatParticipant {
  id: string;
  type: 'character' | 'npc' | 'monster';
  name: string;
  character_id?: string;
  initiative: number;
  current_hp: number;
  max_hp: number;
  current_mp?: number;
  max_mp?: number;
  conditions: string[];
  notes: string;
  is_active: boolean;
  player_info?: {
    user_id: string;
    username: string;
  };
}

/**
 * Dados para criar participante de combate
 */
export interface CreateCombatParticipantData {
  type: 'character' | 'npc' | 'monster';
  name: string;
  character_id?: string;
  max_hp: number;
  max_mp?: number;
  initiative?: number;
  notes?: string;
}

/**
 * Atualização de participante de combate
 */
export interface UpdateCombatParticipantData {
  current_hp?: number;
  current_mp?: number;
  conditions?: string[];
  notes?: string;
  is_active?: boolean;
}

/**
 * Filtros para campanhas
 */
export interface CampaignFilters {
  owner_id?: string;
  is_active?: boolean;
  name_contains?: string;
  created_after?: string;
  created_before?: string;
  has_characters?: boolean;
  member_count_min?: number;
  member_count_max?: number;
}

/**
 * Estatísticas da campanha
 */
export interface CampaignStats {
  total_sessions: number;
  total_play_time: number; // em minutos
  average_session_length: number; // em minutos
  most_active_player: string;
  character_distribution: {
    class: Record<string, number>;
    race: Record<string, number>;
    level: Record<number, number>;
  };
  combat_stats: {
    total_combats: number;
    average_combat_length: number; // em rounds
    most_used_abilities: string[];
  };
}

/**
 * Evento de tempo real da campanha
 */
export interface CampaignRealtimeEvent {
  type: 'character_update' | 'member_join' | 'member_leave' | 'combat_update' | 'message';
  campaign_id: string;
  user_id: string;
  data: any;
  timestamp: string;
}

/**
 * Configurações de notificação da campanha
 */
export interface CampaignNotificationSettings {
  character_updates: boolean;
  member_changes: boolean;
  combat_events: boolean;
  chat_messages: boolean;
  system_announcements: boolean;
}

/**
 * Permissões expandidas para o sistema de campanhas
 */
export interface ExtendedCampaignPermissions extends CampaignPermissions {
  can_start_combat: boolean;
  can_manage_combat: boolean;
  can_view_all_characters: boolean;
  can_create_npcs: boolean;
  can_manage_invites: boolean;
}

/**
 * Dados de sessão da campanha
 */
export interface CampaignSession {
  id: string;
  campaign_id: string;
  name: string;
  description?: string;
  started_at: string;
  ended_at?: string;
  duration?: number; // em minutos
  participants: string[]; // user_ids
  events: CampaignSessionEvent[];
  notes: string;
  created_by: string;
}

/**
 * Evento de sessão
 */
export interface CampaignSessionEvent {
  id: string;
  type: 'combat' | 'roleplay' | 'exploration' | 'rest' | 'custom';
  title: string;
  description?: string;
  timestamp: string;
  duration?: number; // em minutos
  participants: string[];
  data?: any;
}

/**
 * Dados para busca de campanhas
 */
export interface CampaignSearchData {
  query: string;
  filters: CampaignFilters;
  sort: {
    field: 'name' | 'created_at' | 'updated_at' | 'member_count';
    direction: 'asc' | 'desc';
  };
  pagination: {
    page: number;
    limit: number;
  };
}

/**
 * Resultado da busca de campanhas
 */
export interface CampaignSearchResult {
  campaigns: CampaignWithDetails[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Validação de dados da campanha
 */
export interface CampaignValidationResult {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}

/**
 * Configurações de backup da campanha
 */
export interface CampaignBackupSettings {
  auto_backup: boolean;
  backup_interval: number; // em minutos
  max_backups: number;
  include_character_states: boolean;
  include_combat_history: boolean;
}

/**
 * Backup da campanha
 */
export interface CampaignBackup {
  id: string;
  campaign_id: string;
  backup_data: {
    campaign: Campaign;
    characters: CampaignCharacter[];
    combat_trackers: CombatTracker[];
    sessions: CampaignSession[];
  };
  created_at: string;
  created_by: string;
  size: number; // em bytes
  type: 'auto' | 'manual' | 'before_update';
} 