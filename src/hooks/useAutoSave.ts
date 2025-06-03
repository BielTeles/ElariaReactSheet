import { useEffect, useRef, useCallback } from 'react';
import { CharacterStorage } from '../utils/characterStorage';
import { CharacterCreation } from '../types/character';
import { CharacterState } from '../types/interactive';

interface UseAutoSaveOptions {
  characterId?: string;
  enabled?: boolean;
  onSaveSuccess?: (characterId: string) => void;
  onSaveError?: (error: Error) => void;
}

interface SaveData {
  data: CharacterCreation;
  state: CharacterState;
}

export const useAutoSave = (options: UseAutoSaveOptions = {}) => {
  const { characterId, enabled = true, onSaveSuccess, onSaveError } = options;
  const dataRef = useRef<SaveData | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Função para salvar manualmente
  const saveNow = useCallback((data: CharacterCreation, state: CharacterState, reason?: string) => {
    try {
      const savedCharacter = CharacterStorage.saveCharacter(data, state, reason);
      onSaveSuccess?.(savedCharacter.id);
      return savedCharacter;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Erro desconhecido ao salvar');
      onSaveError?.(err);
      throw err;
    }
  }, [onSaveSuccess, onSaveError]);

  // Atualizar dados para auto-salvamento
  const updateData = useCallback((data: CharacterCreation, state: CharacterState) => {
    dataRef.current = { data, state };
  }, []);

  // Configurar auto-salvamento
  const setupAutoSave = useCallback(() => {
    if (!enabled || !characterId) return;

    // Limpar timer anterior
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Configurar o auto-salvamento usando o CharacterStorage
    CharacterStorage.setupAutoSave(characterId, () => {
      if (!dataRef.current) {
        throw new Error('Dados não disponíveis para auto-salvamento');
      }
      return dataRef.current;
    });

    console.log(`Auto-salvamento configurado para personagem ${characterId}`);
  }, [enabled, characterId]);

  // Parar auto-salvamento
  const stopAutoSave = useCallback(() => {
    if (characterId) {
      CharacterStorage.stopAutoSave(characterId);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [characterId]);

  // Efeito para configurar/limpar auto-salvamento
  useEffect(() => {
    if (enabled && characterId) {
      setupAutoSave();
    } else {
      stopAutoSave();
    }

    // Cleanup ao desmontar
    return () => {
      stopAutoSave();
    };
  }, [enabled, characterId, setupAutoSave, stopAutoSave]);

  // Função para obter configuração atual
  const getConfig = useCallback(() => {
    return CharacterStorage.getConfig();
  }, []);

  // Função para atualizar configuração
  const updateConfig = useCallback((newConfig: Partial<any>) => {
    CharacterStorage.updateConfig(newConfig);
    // Reconfigurar auto-save se necessário
    if (enabled && characterId) {
      setupAutoSave();
    }
  }, [enabled, characterId, setupAutoSave]);

  return {
    saveNow,
    updateData,
    setupAutoSave,
    stopAutoSave,
    getConfig,
    updateConfig,
    isAutoSaveEnabled: enabled && !!characterId
  };
};

export default useAutoSave; 