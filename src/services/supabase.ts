// ===================================================================
// CLIENTE SUPABASE - ELARIA RPG
// ===================================================================

import { createClient } from '@supabase/supabase-js';
import { DatabaseUser, DatabaseCharacter, Campaign, ActivityLog } from '../types/database';

// ===================================================================
// CONFIGURAÇÃO
// ===================================================================

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas!');
}

// ===================================================================
// TIPOS DO BANCO
// ===================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: DatabaseUser;
        Insert: Omit<DatabaseUser, 'id' | 'created_at' | 'last_login'>;
        Update: Partial<Omit<DatabaseUser, 'id' | 'created_at'>>;
      };
      characters: {
        Row: DatabaseCharacter;
        Insert: Omit<DatabaseCharacter, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DatabaseCharacter, 'id' | 'created_at'>>;
      };
      campaigns: {
        Row: Campaign;
        Insert: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Campaign, 'id' | 'created_at'>>;
      };
      activity_logs: {
        Row: ActivityLog;
        Insert: Omit<ActivityLog, 'id' | 'timestamp'>;
        Update: Partial<Omit<ActivityLog, 'id' | 'timestamp'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// ===================================================================
// CLIENTE SUPABASE
// ===================================================================

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// ===================================================================
// UTILITÁRIOS
// ===================================================================

/**
 * Verifica se o cliente está conectado
 */
export const isConnected = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
};

/**
 * Obtém o usuário atual
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

/**
 * Obtém o perfil do usuário atual
 */
export const getCurrentProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Log de atividade
 */
export const logActivity = async (
  action: ActivityLog['action'],
  targetType: ActivityLog['target_type'],
  targetId: string,
  details: Record<string, any> = {}
) => {
  const user = await getCurrentUser();
  if (!user) return;

  const { error } = await supabase
    .from('activity_logs')
    .insert({
      user_id: user.id,
      action,
      target_type: targetType,
      target_id: targetId,
      details,
    });

  if (error) {
    console.error('Erro ao registrar atividade:', error);
  }
};

export default supabase; 