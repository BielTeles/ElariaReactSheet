// ===================================================================
// SERVIÇO DE CAMPANHAS - ELARIA RPG
// ===================================================================

import { supabase } from './supabase';
import { 
  CampaignSettings 
} from '../types/database';
import {
  CampaignWithDetails,
  CreateCampaignData,
  UpdateCampaignData,
  CampaignInvite,
  ProcessInviteResult,
  CampaignCharacter,
  CombatTracker,
  CombatParticipant,
  CreateCombatParticipantData
} from '../types/campaign';
import { CAMPAIGN_CONFIG, CAMPAIGN_MESSAGES } from '../constants';

/**
 * Serviço para gerenciamento de campanhas
 */
export class CampaignService {
  
  // ===================================================================
  // OPERAÇÕES BÁSICAS DE CAMPANHA
  // ===================================================================

  /**
   * Buscar campanhas do usuário
   */
  static async getUserCampaigns(userId: string): Promise<CampaignWithDetails[]> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          profiles!campaigns_owner_id_fkey (
            username,
            display_name,
            avatar_url
          )
        `)
        .or(`owner_id.eq.${userId},members.cs.["${userId}"]`)
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data?.map(campaign => this.transformCampaignData(campaign)) || [];
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
      throw error;
    }
  }

  /**
   * Buscar campanha por ID
   */
  static async getCampaignById(campaignId: string): Promise<CampaignWithDetails | null> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          profiles!campaigns_owner_id_fkey (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('id', campaignId)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }

      return this.transformCampaignData(data);
    } catch (error) {
      console.error('Erro ao buscar campanha:', error);
      throw error;
    }
  }

  /**
   * Criar nova campanha
   */
  static async createCampaign(
    userId: string, 
    campaignData: CreateCampaignData
  ): Promise<CampaignWithDetails> {
    try {
      // Validar dados
      this.validateCampaignData(campaignData);

      // Criar campanha
      const { data, error } = await supabase
        .from('campaigns')
        .insert({
          name: campaignData.name,
          description: campaignData.description,
          owner_id: userId,
          members: [userId],
          settings: {
            ...this.getDefaultSettings(),
            ...campaignData.settings
          }
        })
        .select(`
          *,
          profiles!campaigns_owner_id_fkey (
            username,
            display_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Registrar atividade
      await this.logActivity(userId, 'campaign_created', 'campaign', data.id, {
        campaign_name: data.name
      });

      return this.transformCampaignData(data);
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      throw error;
    }
  }

  /**
   * Atualizar campanha
   */
  static async updateCampaign(
    campaignId: string, 
    updates: UpdateCampaignData
  ): Promise<CampaignWithDetails> {
    try {
      // Validar dados
      if (updates.name) {
        this.validateCampaignData({ name: updates.name, description: updates.description || '' });
      }

      const { data, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', campaignId)
        .select(`
          *,
          profiles!campaigns_owner_id_fkey (
            username,
            display_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;

      // Registrar atividade
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await this.logActivity(user.id, 'campaign_updated', 'campaign', campaignId, {
          updates: Object.keys(updates)
        });
      }

      return this.transformCampaignData(data);
    } catch (error) {
      console.error('Erro ao atualizar campanha:', error);
      throw error;
    }
  }

  /**
   * Deletar campanha
   */
  static async deleteCampaign(campaignId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ is_active: false })
        .eq('id', campaignId);

      if (error) throw error;

      // Registrar atividade
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await this.logActivity(user.id, 'campaign_deleted', 'campaign', campaignId, {});
      }
    } catch (error) {
      console.error('Erro ao deletar campanha:', error);
      throw error;
    }
  }

  // ===================================================================
  // SISTEMA DE CONVITES
  // ===================================================================

  /**
   * Criar convite para campanha
   */
  static async createInvite(
    campaignId: string,
    maxUses?: number,
    expiryDays: number = CAMPAIGN_CONFIG.INVITE_EXPIRY_DAYS
  ): Promise<CampaignInvite> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Gerar código único
      let inviteCode: string;
      let attempts = 0;
      const maxAttempts = 10;

      do {
        inviteCode = this.generateInviteCode();
        attempts++;
      } while (attempts < maxAttempts && await this.inviteCodeExists(inviteCode));

      if (attempts >= maxAttempts) {
        throw new Error('Não foi possível gerar um código de convite único');
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiryDays);

      const { data, error } = await supabase
        .from('campaign_invites')
        .insert({
          campaign_id: campaignId,
          invite_code: inviteCode,
          created_by: user.id,
          expires_at: expiresAt.toISOString(),
          max_uses: maxUses
        })
        .select(`
          *,
          campaigns!campaign_invites_campaign_id_fkey (
            name,
            profiles!campaigns_owner_id_fkey (
              username
            )
          )
        `)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        campaign_id: data.campaign_id,
        campaign_name: data.campaigns.name,
        master_name: data.campaigns.profiles.username,
        invite_code: data.invite_code,
        expires_at: data.expires_at,
        max_uses: data.max_uses,
        current_uses: data.current_uses,
        created_at: data.created_at,
        is_active: data.is_active
      };
    } catch (error) {
      console.error('Erro ao criar convite:', error);
      throw error;
    }
  }

  /**
   * Processar convite (jogador entra na campanha)
   */
  static async processInvite(
    inviteCode: string,
    characterIds: string[] = []
  ): Promise<ProcessInviteResult> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Buscar convite
      const { data: invite, error: inviteError } = await supabase
        .from('campaign_invites')
        .select(`
          *,
          campaigns!campaign_invites_campaign_id_fkey (
            *,
            profiles!campaigns_owner_id_fkey (
              username,
              display_name,
              avatar_url
            )
          )
        `)
        .eq('invite_code', inviteCode)
        .eq('is_active', true)
        .single();

      if (inviteError || !invite) {
        return { success: false, error: CAMPAIGN_MESSAGES.INVITE_INVALID };
      }

      // Verificar se o convite expirou
      if (new Date(invite.expires_at) < new Date()) {
        return { success: false, error: CAMPAIGN_MESSAGES.INVITE_EXPIRED };
      }

      // Verificar limite de usos
      if (invite.max_uses && invite.current_uses >= invite.max_uses) {
        return { success: false, error: 'Convite atingiu o limite de usos' };
      }

      // Verificar se o usuário já é membro
      const campaign = invite.campaigns;
      const isAlreadyMember = campaign.members.includes(user.id);

      if (isAlreadyMember) {
        return { 
          success: false, 
          error: 'Você já é membro desta campanha',
          already_member: true,
          campaign: this.transformCampaignData(campaign)
        };
      }

      // Adicionar usuário à campanha
      const updatedMembers = [...campaign.members, user.id];
      
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({ members: updatedMembers })
        .eq('id', campaign.id);

      if (updateError) throw updateError;

      // Atualizar contador de usos do convite
      await supabase
        .from('campaign_invites')
        .update({ current_uses: invite.current_uses + 1 })
        .eq('id', invite.id);

      // Vincular personagens se fornecidos
      if (characterIds.length > 0) {
        await this.linkCharactersToCampaign(campaign.id, user.id, characterIds);
      }

      // Registrar atividade
      await this.logActivity(user.id, 'campaign_joined', 'campaign', campaign.id, {
        campaign_name: campaign.name,
        invite_code: inviteCode
      });

      return {
        success: true,
        campaign: this.transformCampaignData({ ...campaign, members: updatedMembers })
      };
    } catch (error) {
      console.error('Erro ao processar convite:', error);
      return { success: false, error: 'Erro interno do servidor' };
    }
  }

  /**
   * Buscar convites da campanha
   */
  static async getCampaignInvites(campaignId: string): Promise<CampaignInvite[]> {
    try {
      const { data, error } = await supabase
        .from('campaign_invites')
        .select(`
          *,
          campaigns!campaign_invites_campaign_id_fkey (
            name,
            profiles!campaigns_owner_id_fkey (
              username
            )
          )
        `)
        .eq('campaign_id', campaignId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(invite => ({
        id: invite.id,
        campaign_id: invite.campaign_id,
        campaign_name: invite.campaigns.name,
        master_name: invite.campaigns.profiles.username,
        invite_code: invite.invite_code,
        expires_at: invite.expires_at,
        max_uses: invite.max_uses,
        current_uses: invite.current_uses,
        created_at: invite.created_at,
        is_active: invite.is_active
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar convites:', error);
      throw error;
    }
  }

  // ===================================================================
  // GERENCIAMENTO DE PERSONAGENS
  // ===================================================================

  /**
   * Vincular personagens à campanha
   */
  static async linkCharactersToCampaign(
    campaignId: string,
    userId: string,
    characterIds: string[]
  ): Promise<void> {
    try {
      const insertData = characterIds.map(characterId => ({
        campaign_id: campaignId,
        character_id: characterId,
        user_id: userId
      }));

      const { error } = await supabase
        .from('campaign_characters')
        .insert(insertData);

      if (error) throw error;

      // Registrar atividade
      await this.logActivity(userId, 'characters_linked', 'campaign', campaignId, {
        character_count: characterIds.length
      });
    } catch (error) {
      console.error('Erro ao vincular personagens:', error);
      throw error;
    }
  }

  /**
   * Buscar personagens da campanha
   */
  static async getCampaignCharacters(campaignId: string): Promise<CampaignCharacter[]> {
    try {
      const { data, error } = await supabase
        .from('campaign_characters')
        .select(`
          *,
          characters!campaign_characters_character_id_fkey (
            *
          ),
          profiles!campaign_characters_user_id_fkey (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('campaign_id', campaignId)
        .eq('is_active', true)
        .order('linked_at', { ascending: false });

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        user_id: item.user_id,
        campaign_id: item.campaign_id,
        character_data: item.characters.data,
        character_state: {
          currentHP: item.characters.data.hitPoints || 0,
          currentMP: item.characters.data.manaPoints || 0,
          currentVigor: item.characters.data.vigorPoints || 0,
          tempHP: 0,
          conditions: [],
          rollHistory: [],
          notes: [],
          currentMoney: item.characters.data.remainingGold || 0,
          transactions: [],
          inventory: [],
          equippedWeapon: undefined,
          equippedArmor: undefined,
          equippedShield: undefined,
          equippedAccessories: []
        },
        player_info: {
          username: item.profiles.username,
          display_name: item.profiles.display_name,
          avatar_url: item.profiles.avatar_url
        },
        linked_at: item.linked_at,
        is_active: item.is_active,
        permissions: item.permissions
      })) || [];
    } catch (error) {
      console.error('Erro ao buscar personagens da campanha:', error);
      throw error;
    }
  }

  // ===================================================================
  // RASTREADOR DE COMBATE
  // ===================================================================

  /**
   * Criar rastreador de combate
   */
  static async createCombatTracker(
    campaignId: string,
    name: string
  ): Promise<CombatTracker> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('combat_trackers')
        .insert({
          campaign_id: campaignId,
          name,
          created_by: user.id
        })
        .select('*')
        .single();

      if (error) throw error;

      return {
        id: data.id,
        campaign_id: data.campaign_id,
        name: data.name,
        is_active: data.is_active,
        current_round: data.current_round,
        current_turn: data.current_turn,
        participants: data.participants || [],
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao criar rastreador de combate:', error);
      throw error;
    }
  }

  /**
   * Adicionar participante ao combate
   */
  static async addCombatParticipant(
    trackerId: string,
    participantData: CreateCombatParticipantData
  ): Promise<CombatTracker> {
    try {
      // Buscar rastreador atual
      const { data: tracker, error: fetchError } = await supabase
        .from('combat_trackers')
        .select('*')
        .eq('id', trackerId)
        .single();

      if (fetchError || !tracker) throw fetchError || new Error('Rastreador não encontrado');

      // Criar novo participante
      const newParticipant: CombatParticipant = {
        id: crypto.randomUUID(),
        type: participantData.type,
        name: participantData.name,
        character_id: participantData.character_id,
        initiative: participantData.initiative || 0,
        current_hp: participantData.max_hp,
        max_hp: participantData.max_hp,
        current_mp: participantData.max_mp,
        max_mp: participantData.max_mp,
        conditions: [],
        notes: participantData.notes || '',
        is_active: true
      };

      const updatedParticipants = [...(tracker.participants || []), newParticipant];

      // Atualizar rastreador
      const { data, error } = await supabase
        .from('combat_trackers')
        .update({ participants: updatedParticipants })
        .eq('id', trackerId)
        .select('*')
        .single();

      if (error) throw error;

      return {
        id: data.id,
        campaign_id: data.campaign_id,
        name: data.name,
        is_active: data.is_active,
        current_round: data.current_round,
        current_turn: data.current_turn,
        participants: data.participants || [],
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao adicionar participante:', error);
      throw error;
    }
  }

  // ===================================================================
  // FUNÇÕES AUXILIARES
  // ===================================================================

  /**
   * Transformar dados da campanha
   */
  private static transformCampaignData(data: any): CampaignWithDetails {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      owner_id: data.owner_id,
      members: data.members || [],
      characters: data.characters || [],
      settings: data.settings || this.getDefaultSettings(),
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at,
      member_count: (data.members || []).length,
      character_count: (data.characters || []).length,
      last_activity: data.updated_at,
      master_info: {
        username: data.profiles?.username || 'Desconhecido',
        display_name: data.profiles?.display_name,
        avatar_url: data.profiles?.avatar_url
      }
    };
  }

  /**
   * Configurações padrão da campanha
   */
  private static getDefaultSettings(): CampaignSettings {
    return {
      is_public: false,
      allow_character_sharing: true,
      max_characters_per_player: CAMPAIGN_CONFIG.MAX_CHARACTERS_PER_PLAYER,
      auto_backup: true,
      rules: {
        allow_multiclass: true,
        starting_level: 1,
        use_optional_rules: false
      }
    };
  }

  /**
   * Validar dados da campanha
   */
  private static validateCampaignData(data: CreateCampaignData): void {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Nome da campanha é obrigatório');
    }

    if (data.name.length > CAMPAIGN_CONFIG.MAX_NAME_LENGTH) {
      throw new Error(`Nome da campanha deve ter no máximo ${CAMPAIGN_CONFIG.MAX_NAME_LENGTH} caracteres`);
    }

    if (data.description && data.description.length > CAMPAIGN_CONFIG.MAX_DESCRIPTION_LENGTH) {
      throw new Error(`Descrição deve ter no máximo ${CAMPAIGN_CONFIG.MAX_DESCRIPTION_LENGTH} caracteres`);
    }
  }

  /**
   * Gerar código de convite
   */
  private static generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < CAMPAIGN_CONFIG.INVITE_CODE_LENGTH; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Verificar se código de convite já existe
   */
  private static async inviteCodeExists(code: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('campaign_invites')
      .select('id')
      .eq('invite_code', code)
      .eq('is_active', true)
      .single();

    return !error && !!data;
  }

  /**
   * Registrar atividade
   */
  private static async logActivity(
    userId: string,
    action: string,
    targetType: string,
    targetId: string,
    details: any
  ): Promise<void> {
    try {
      await supabase
        .from('activity_logs')
        .insert({
          user_id: userId,
          action,
          target_type: targetType,
          target_id: targetId,
          details
        });
    } catch (error) {
      console.warn('Erro ao registrar atividade:', error);
    }
  }
} 