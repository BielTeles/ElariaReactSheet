// ===================================================================
// SERVIÇO DE PERSONAGENS - ELARIA RPG
// ===================================================================

import { supabase, logActivity } from './supabase';
import { Character } from '../types/character';
import { DatabaseCharacter, CharacterFilters, SortOptions, PaginatedResult } from '../types/database';

// ===================================================================
// TIPOS DE ERRO
// ===================================================================

export interface CharacterServiceError {
  code: string;
  message: string;
  details?: any;
}

// ===================================================================
// CONVERSÕES DE TIPO
// ===================================================================

/**
 * Converte Character para DatabaseCharacter
 */
const convertCharacterToDatabase = (character: Character, userId: string): Omit<DatabaseCharacter, 'id' | 'created_at' | 'updated_at'> => {
  const { id, createdAt, updatedAt, name, ...characterData } = character;
  return {
    user_id: userId,
    name,
    ...characterData,
    version: 1,
    is_public: false,
    tags: [],
    backup: {
      previous_versions: [],
      last_backup: new Date().toISOString(),
    }
  };
};

/**
 * Converte DatabaseCharacter para Character
 */
const convertDatabaseToCharacter = (dbCharacter: DatabaseCharacter): Character => {
  const { user_id, created_at, updated_at, version, is_public, tags, backup, ...characterData } = dbCharacter;
  return {
    ...characterData,
    id: dbCharacter.id!,
    createdAt: new Date(dbCharacter.created_at),
    updatedAt: new Date(dbCharacter.updated_at),
  };
};

// ===================================================================
// SERVIÇOS PRINCIPAIS
// ===================================================================

/**
 * Cria um novo personagem
 */
export const createCharacter = async (character: Character): Promise<{ success: boolean; character?: Character; error?: CharacterServiceError }> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'Usuário não autenticado'
        }
      };
    }

    const dbCharacter = convertCharacterToDatabase(character, user.id);

    const { data, error } = await supabase
      .from('characters')
      .insert(dbCharacter)
      .select('*')
      .single();

    if (error) {
      return {
        success: false,
        error: {
          code: 'CREATION_FAILED',
          message: error.message
        }
      };
    }

    // Log de atividade
    await logActivity('character_created', 'character', data.id, {
      character_name: character.name,
      character_class: character.class
    });

    // Atualizar estatísticas do usuário
    await updateUserStatistics(user.id, 'characters_created', 1);

    return {
      success: true,
      character: convertDatabaseToCharacter(data)
    };

  } catch (error) {
    console.error('Erro ao criar personagem:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Erro interno do servidor'
      }
    };
  }
};

/**
 * Busca personagens do usuário
 */
export const getUserCharacters = async (
  filters?: CharacterFilters,
  sort?: SortOptions,
  page: number = 1,
  limit: number = 20
): Promise<{ success: boolean; result?: PaginatedResult<Character>; error?: CharacterServiceError }> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'Usuário não autenticado'
        }
      };
    }

    let query = supabase
      .from('characters')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    // Aplicar filtros
    if (filters) {
      if (filters.is_public !== undefined) {
        query = query.eq('is_public', filters.is_public);
      }
      if (filters.class) {
        query = query.contains('data', { class: filters.class });
      }
      if (filters.race) {
        query = query.contains('data', { race: filters.race });
      }
      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }
      if (filters.created_after) {
        query = query.gte('created_at', filters.created_after);
      }
      if (filters.created_before) {
        query = query.lte('created_at', filters.created_before);
      }
    }

    // Aplicar ordenação
    if (sort) {
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });
    } else {
      query = query.order('updated_at', { ascending: false });
    }

    // Aplicar paginação
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: error.message
        }
      };
    }

    const characters = data?.map(convertDatabaseToCharacter) || [];
    const total = count || 0;

    return {
      success: true,
      result: {
        data: characters,
        total,
        page,
        limit,
        hasNext: offset + limit < total,
        hasPrevious: page > 1,
      }
    };

  } catch (error) {
    console.error('Erro ao buscar personagens:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Erro interno do servidor'
      }
    };
  }
};

/**
 * Busca um personagem específico
 */
export const getCharacter = async (characterId: string): Promise<{ success: boolean; character?: Character; error?: CharacterServiceError }> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'Usuário não autenticado'
        }
      };
    }

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Personagem não encontrado'
        }
      };
    }

    return {
      success: true,
      character: convertDatabaseToCharacter(data)
    };

  } catch (error) {
    console.error('Erro ao buscar personagem:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Erro interno do servidor'
      }
    };
  }
};

/**
 * Atualiza um personagem
 */
export const updateCharacter = async (characterId: string, character: Character): Promise<{ success: boolean; character?: Character; error?: CharacterServiceError }> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'Usuário não autenticado'
        }
      };
    }

    // Buscar personagem atual para backup
    const { data: currentCharacter } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .eq('user_id', user.id)
      .single();

    if (!currentCharacter) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Personagem não encontrado'
        }
      };
    }

    // Criar backup se necessário
    const backup = currentCharacter.backup || { previous_versions: [], last_backup: null };
    backup.previous_versions.push({
      version: currentCharacter.version,
      data: currentCharacter.data,
      timestamp: new Date().toISOString(),
      reason: 'before-edit'
    });

    // Manter apenas as últimas 5 versões
    if (backup.previous_versions.length > 5) {
      backup.previous_versions = backup.previous_versions.slice(-5);
    }

    backup.last_backup = new Date().toISOString();

    // Atualizar personagem
    const { data, error } = await supabase
      .from('characters')
      .update({
        name: character.name,
        data: character,
        version: currentCharacter.version + 1,
        backup
      })
      .eq('id', characterId)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: error.message
        }
      };
    }

    // Log de atividade
    await logActivity('character_updated', 'character', characterId, {
      character_name: character.name,
      version: data.version
    });

    return {
      success: true,
      character: convertDatabaseToCharacter(data)
    };

  } catch (error) {
    console.error('Erro ao atualizar personagem:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Erro interno do servidor'
      }
    };
  }
};

/**
 * Exclui um personagem
 */
export const deleteCharacter = async (characterId: string): Promise<{ success: boolean; error?: CharacterServiceError }> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'Usuário não autenticado'
        }
      };
    }

    // Buscar personagem para log
    const { data: character } = await supabase
      .from('characters')
      .select('name, data')
      .eq('id', characterId)
      .eq('user_id', user.id)
      .single();

    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', characterId)
      .eq('user_id', user.id);

    if (error) {
      return {
        success: false,
        error: {
          code: 'DELETE_FAILED',
          message: error.message
        }
      };
    }

    // Log de atividade
    if (character) {
      await logActivity('character_deleted', 'character', characterId, {
        character_name: character.name,
        character_class: character.data.class
      });
    }

    return { success: true };

  } catch (error) {
    console.error('Erro ao excluir personagem:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Erro interno do servidor'
      }
    };
  }
};

/**
 * Busca personagens públicos
 */
export const getPublicCharacters = async (
  filters?: Omit<CharacterFilters, 'user_id'>,
  sort?: SortOptions,
  page: number = 1,
  limit: number = 20
): Promise<{ success: boolean; result?: PaginatedResult<Character>; error?: CharacterServiceError }> => {
  try {
    let query = supabase
      .from('characters')
      .select('*', { count: 'exact' })
      .eq('is_public', true);

    // Aplicar filtros
    if (filters) {
      if (filters.class) {
        query = query.contains('data', { class: filters.class });
      }
      if (filters.race) {
        query = query.contains('data', { race: filters.race });
      }
      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }
      if (filters.created_after) {
        query = query.gte('created_at', filters.created_after);
      }
      if (filters.created_before) {
        query = query.lte('created_at', filters.created_before);
      }
    }

    // Aplicar ordenação
    if (sort) {
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Aplicar paginação
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return {
        success: false,
        error: {
          code: 'FETCH_FAILED',
          message: error.message
        }
      };
    }

    const characters = data?.map(convertDatabaseToCharacter) || [];
    const total = count || 0;

    return {
      success: true,
      result: {
        data: characters,
        total,
        page,
        limit,
        hasNext: offset + limit < total,
        hasPrevious: page > 1,
      }
    };

  } catch (error) {
    console.error('Erro ao buscar personagens públicos:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Erro interno do servidor'
      }
    };
  }
};

/**
 * Altera a visibilidade de um personagem
 */
export const toggleCharacterVisibility = async (characterId: string, isPublic: boolean): Promise<{ success: boolean; error?: CharacterServiceError }> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'Usuário não autenticado'
        }
      };
    }

    const { error } = await supabase
      .from('characters')
      .update({ is_public: isPublic })
      .eq('id', characterId)
      .eq('user_id', user.id);

    if (error) {
      return {
        success: false,
        error: {
          code: 'UPDATE_FAILED',
          message: error.message
        }
      };
    }

    // Log de atividade
    await logActivity('character_shared', 'character', characterId, {
      is_public: isPublic
    });

    return { success: true };

  } catch (error) {
    console.error('Erro ao alterar visibilidade:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Erro interno do servidor'
      }
    };
  }
};

// ===================================================================
// UTILITÁRIOS
// ===================================================================

/**
 * Atualiza estatísticas do usuário
 */
const updateUserStatistics = async (userId: string, field: string, increment: number) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('statistics')
      .eq('id', userId)
      .single();

    if (profile) {
      const statistics = profile.statistics || {};
      statistics[field] = (statistics[field] || 0) + increment;

      await supabase
        .from('profiles')
        .update({ statistics })
        .eq('id', userId);
    }
  } catch (error) {
    console.error('Erro ao atualizar estatísticas:', error);
  }
};

export default {
  createCharacter,
  getUserCharacters,
  getCharacter,
  updateCharacter,
  deleteCharacter,
  getPublicCharacters,
  toggleCharacterVisibility,
}; 