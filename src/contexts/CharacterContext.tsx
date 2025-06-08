// ===================================================================
// CONTEXTO DE PERSONAGENS FIREBASE - ELARIA RPG
// ===================================================================

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { CharacterService } from '../services/characterService';
import { Character } from '../types/character';
import { DatabaseCharacter, CharacterFilters, SortOptions } from '../types/database';
import { useFirebaseAuth } from './FirebaseAuthContext';

// ===================================================================
// ESTADO INICIAL
// ===================================================================

interface CharacterState {
  characters: DatabaseCharacter[];
  currentCharacter: DatabaseCharacter | null;
  isLoading: boolean;
  error: string | null;
  totalCharacters: number;
  currentPage: number;
  hasMore: boolean;
}

const initialState: CharacterState = {
  characters: [],
  currentCharacter: null,
  isLoading: false,
  error: null,
  totalCharacters: 0,
  currentPage: 1,
  hasMore: false,
};

// ===================================================================
// ACTIONS
// ===================================================================

type CharacterAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_CHARACTERS'; payload: { characters: DatabaseCharacter[]; total: number; page: number; hasMore: boolean } }
  | { type: 'ADD_CHARACTER'; payload: DatabaseCharacter }
  | { type: 'UPDATE_CHARACTER'; payload: DatabaseCharacter }
  | { type: 'DELETE_CHARACTER'; payload: string }
  | { type: 'SET_CURRENT_CHARACTER'; payload: DatabaseCharacter | null }
  | { type: 'APPEND_CHARACTERS'; payload: { characters: DatabaseCharacter[]; hasMore: boolean } };

// ===================================================================
// REDUCER
// ===================================================================

function characterReducer(state: CharacterState, action: CharacterAction): CharacterState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_CHARACTERS':
      return {
        ...state,
        characters: action.payload.characters,
        totalCharacters: action.payload.total,
        currentPage: action.payload.page,
        hasMore: action.payload.hasMore,
        isLoading: false,
        error: null,
      };
    
    case 'ADD_CHARACTER':
      return {
        ...state,
        characters: [action.payload, ...state.characters],
        totalCharacters: state.totalCharacters + 1,
      };
    
    case 'UPDATE_CHARACTER':
      return {
        ...state,
        characters: state.characters.map(char =>
          char.id === action.payload.id ? action.payload : char
        ),
        currentCharacter: state.currentCharacter?.id === action.payload.id 
          ? action.payload 
          : state.currentCharacter,
      };
    
    case 'DELETE_CHARACTER':
      return {
        ...state,
        characters: state.characters.filter(char => char.id !== action.payload),
        totalCharacters: state.totalCharacters - 1,
        currentCharacter: state.currentCharacter?.id === action.payload 
          ? null 
          : state.currentCharacter,
      };
    
    case 'SET_CURRENT_CHARACTER':
      return { ...state, currentCharacter: action.payload };
    
    case 'APPEND_CHARACTERS':
      return {
        ...state,
        characters: [...state.characters, ...action.payload.characters],
        hasMore: action.payload.hasMore,
        currentPage: state.currentPage + 1,
        isLoading: false,
      };
    
    default:
      return state;
  }
}

// ===================================================================
// CONTEXTO
// ===================================================================

interface CharacterContextType {
  // Estado
  characters: DatabaseCharacter[];
  currentCharacter: DatabaseCharacter | null;
  isLoading: boolean;
  error: string | null;
  totalCharacters: number;
  hasMore: boolean;
  
  // Ações
  loadCharacters: (filters?: CharacterFilters, sort?: SortOptions) => Promise<void>;
  loadMoreCharacters: () => Promise<void>;
  createCharacter: (character: Character) => Promise<string>;
  updateCharacter: (characterId: string, updates: Partial<Character>) => Promise<void>;
  deleteCharacter: (characterId: string) => Promise<void>;
  duplicateCharacter: (characterId: string, newName?: string) => Promise<string>;
  loadCharacter: (characterId: string) => Promise<void>;
  togglePublicVisibility: (characterId: string) => Promise<boolean>;
  clearError: () => void;
  clearCurrentCharacter: () => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

// ===================================================================
// PROVIDER
// ===================================================================

interface CharacterProviderProps {
  children: React.ReactNode;
}

export const CharacterProvider: React.FC<CharacterProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(characterReducer, initialState);
  const { firebaseUser } = useFirebaseAuth();

  // ===================================================================
  // FUNÇÕES DE PERSONAGENS
  // ===================================================================

  const loadCharacters = useCallback(async (
    filters?: CharacterFilters,
    sort?: SortOptions
  ): Promise<void> => {
    if (!firebaseUser) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const result = await CharacterService.getUserCharacters(
        firebaseUser.uid,
        filters,
        sort,
        1,
        20
      );

      dispatch({
        type: 'SET_CHARACTERS',
        payload: {
          characters: result.data,
          total: result.total,
          page: result.page,
          hasMore: result.hasNext,
        },
      });
    } catch (error: any) {
      console.error('Erro ao carregar personagens:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [firebaseUser]);

  const loadMoreCharacters = useCallback(async (): Promise<void> => {
    if (!firebaseUser || !state.hasMore || state.isLoading) return;

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const result = await CharacterService.getUserCharacters(
        firebaseUser.uid,
        undefined,
        undefined,
        state.currentPage + 1,
        20
      );

      dispatch({
        type: 'APPEND_CHARACTERS',
        payload: {
          characters: result.data,
          hasMore: result.hasNext,
        },
      });
    } catch (error: any) {
      console.error('Erro ao carregar mais personagens:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [firebaseUser, state.hasMore, state.isLoading, state.currentPage]);

  const createCharacter = useCallback(async (character: Character): Promise<string> => {
    if (!firebaseUser) {
      throw new Error('Usuário não autenticado');
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const characterId = await CharacterService.createCharacter(character, firebaseUser.uid);
      
      // Recarregar lista de personagens
      await loadCharacters();
      
      return characterId;
    } catch (error: any) {
      console.error('Erro ao criar personagem:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [firebaseUser, loadCharacters]);

  const updateCharacter = useCallback(async (
    characterId: string,
    updates: Partial<Character>
  ): Promise<void> => {
    if (!firebaseUser) {
      throw new Error('Usuário não autenticado');
    }

    dispatch({ type: 'CLEAR_ERROR' });

    try {
      await CharacterService.updateCharacter(characterId, updates, firebaseUser.uid);
      
      // Recarregar o personagem atualizado se for o atual
      if (state.currentCharacter?.id === characterId) {
        try {
          const updatedCharacter = await CharacterService.getCharacter(characterId, firebaseUser.uid);
          dispatch({ type: 'SET_CURRENT_CHARACTER', payload: updatedCharacter });
        } catch (error) {
          console.error('Erro ao recarregar personagem atual:', error);
        }
      }
      
      // Recarregar lista de personagens
      await loadCharacters();
    } catch (error: any) {
      console.error('Erro ao atualizar personagem:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [firebaseUser, state.currentCharacter, loadCharacters]);

  const deleteCharacter = useCallback(async (characterId: string): Promise<void> => {
    if (!firebaseUser) {
      throw new Error('Usuário não autenticado');
    }

    dispatch({ type: 'CLEAR_ERROR' });

    try {
      await CharacterService.deleteCharacter(characterId, firebaseUser.uid);
      dispatch({ type: 'DELETE_CHARACTER', payload: characterId });
    } catch (error: any) {
      console.error('Erro ao deletar personagem:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [firebaseUser]);

  const duplicateCharacter = useCallback(async (
    characterId: string,
    newName?: string
  ): Promise<string> => {
    if (!firebaseUser) {
      throw new Error('Usuário não autenticado');
    }

    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const newCharacterId = await CharacterService.duplicateCharacter(
        characterId,
        firebaseUser.uid,
        newName
      );
      
      // Recarregar lista de personagens
      await loadCharacters();
      
      return newCharacterId;
    } catch (error: any) {
      console.error('Erro ao duplicar personagem:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [firebaseUser, loadCharacters]);

  const loadCharacter = useCallback(async (characterId: string): Promise<void> => {
    if (!firebaseUser) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const character = await CharacterService.getCharacter(characterId, firebaseUser.uid);
      dispatch({ type: 'SET_CURRENT_CHARACTER', payload: character });
    } catch (error: any) {
      console.error('Erro ao carregar personagem:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [firebaseUser]);

  const togglePublicVisibility = useCallback(async (characterId: string): Promise<boolean> => {
    if (!firebaseUser) {
      throw new Error('Usuário não autenticado');
    }

    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const newVisibility = await CharacterService.togglePublicVisibility(
        characterId,
        firebaseUser.uid
      );
      
      // Recarregar lista de personagens para atualizar a interface
      await loadCharacters();
      
      return newVisibility;
    } catch (error: any) {
      console.error('Erro ao alterar visibilidade:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [firebaseUser, loadCharacters]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const clearCurrentCharacter = useCallback(() => {
    dispatch({ type: 'SET_CURRENT_CHARACTER', payload: null });
  }, []);

  // ===================================================================
  // VALOR DO CONTEXTO
  // ===================================================================

  const contextValue: CharacterContextType = {
    characters: state.characters,
    currentCharacter: state.currentCharacter,
    isLoading: state.isLoading,
    error: state.error,
    totalCharacters: state.totalCharacters,
    hasMore: state.hasMore,
    loadCharacters,
    loadMoreCharacters,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    duplicateCharacter,
    loadCharacter,
    togglePublicVisibility,
    clearError,
    clearCurrentCharacter,
  };

  return (
    <CharacterContext.Provider value={contextValue}>
      {children}
    </CharacterContext.Provider>
  );
};

// ===================================================================
// HOOK
// ===================================================================

export const useCharacters = (): CharacterContextType => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacters deve ser usado dentro de um CharacterProvider');
  }
  return context;
}; 