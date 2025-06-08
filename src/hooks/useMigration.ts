// ===================================================================
// HOOK DE MIGRAÇÃO - ELARIA RPG
// ===================================================================

import { useState, useCallback } from 'react';
import { CharacterService } from '../services/characterService';
import { Character } from '../types/character';
import { STORAGE_KEYS } from '../constants';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';

/**
 * Hook para migração de dados do localStorage para o Firebase
 */
export const useMigration = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationError, setMigrationError] = useState<string | null>(null);
  const [migrationProgress, setMigrationProgress] = useState<{
    current: number;
    total: number;
    currentItem: string;
  }>({ current: 0, total: 0, currentItem: '' });

  const { firebaseUser } = useFirebaseAuth();

  /**
   * Converte personagem do localStorage para formato do Firebase
   */
  const convertLocalCharacterToFirebase = useCallback((localCharacter: any): Character => {
    const baseName = localCharacter.personalDetails?.name || localCharacter.name || 'Personagem Migrado';
    const baseHitPoints = localCharacter.hitPoints || 8;
    const baseManaPoints = localCharacter.manaPoints || 0;
    
    // Se já é um Character válido (formato novo), adaptar estrutura
    if (localCharacter.personalDetails && localCharacter.mainClass) {
      return {
        name: baseName,
        age: localCharacter.personalDetails?.age,
        height: localCharacter.personalDetails?.height,
        race: localCharacter.race || 'alari',
        mainClass: localCharacter.mainClass || 'evocador',
        subclass: localCharacter.subclass || 'terra',
        origin: localCharacter.origin || 'sobrevivente-brasas',
        deity: localCharacter.deity || null,
        
        // Atributos
        attributes: localCharacter.attributes || localCharacter.finalAttributes || {
          forca: 0,
          destreza: 0,
          constituicao: 0,
          inteligencia: 0,
          sabedoria: 0,
          carisma: 0
        },
        
        // Recursos e combate (formato correto)
        hitPoints: {
          current: typeof baseHitPoints === 'number' ? baseHitPoints : baseHitPoints.current || 8,
          maximum: typeof baseHitPoints === 'number' ? baseHitPoints : baseHitPoints.maximum || 8
        },
        manaPoints: {
          current: typeof baseManaPoints === 'number' ? baseManaPoints : baseManaPoints.current || 0,
          maximum: typeof baseManaPoints === 'number' ? baseManaPoints : baseManaPoints.maximum || 0
        },
        vigor: {
          current: 1,
          maximum: 1
        },
        
        // Perícias e habilidades
        skills: localCharacter.skills || {},
        abilities: localCharacter.abilities || [],
        
        // Equipamentos e inventário
        equipment: localCharacter.selectedEquipments || localCharacter.equipment || [],
        gold: localCharacter.remainingGold || localCharacter.money || localCharacter.gold || 150,
        
        // Metadados
        level: localCharacter.level || 1,
        backstory: localCharacter.personalDetails?.background,
        notes: localCharacter.personalDetails?.description,
        createdAt: localCharacter.createdAt ? new Date(localCharacter.createdAt) : new Date(),
        updatedAt: new Date()
      };
    }
    
    // Se é um formato antigo/diferente (CharacterStorage), tentar converter
    return {
      name: localCharacter.name || 'Personagem Migrado',
      race: localCharacter.data?.race || localCharacter.race || 'alari',
      mainClass: localCharacter.data?.mainClass || localCharacter.mainClass || 'evocador',
      subclass: localCharacter.data?.subclass || localCharacter.subclass || 'terra',
      origin: localCharacter.data?.origin || 'sobrevivente-brasas',
      deity: localCharacter.data?.deity || null,
      
      attributes: localCharacter.data?.finalAttributes || localCharacter.data?.attributes || {
        forca: 0,
        destreza: 0,
        constituicao: 0,
        inteligencia: 0,
        sabedoria: 0,
        carisma: 0
      },
      
      hitPoints: {
        current: 8,
        maximum: 8
      },
      manaPoints: {
        current: 0,
        maximum: 0
      },
      vigor: {
        current: 1,
        maximum: 1
      },
      
      skills: {},
      abilities: [],
      equipment: [],
      gold: 150,
      level: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }, []);

  /**
   * Verifica se existem dados no localStorage para migrar
   */
  const checkForLocalData = useCallback((): boolean => {
    try {
      const localCharacters = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
      return !!localCharacters && JSON.parse(localCharacters).length > 0;
    } catch (error) {
      console.error('Erro ao verificar dados locais:', error);
      return false;
    }
  }, []);

  /**
   * Obtém personagens do localStorage
   */
  const getLocalCharacters = useCallback((): Character[] => {
    try {
      const localCharacters = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
      if (!localCharacters) return [];
      
      const characters = JSON.parse(localCharacters);
      
      // Validar estrutura dos dados
      if (!Array.isArray(characters)) {
        console.warn('Dados de personagens locais em formato inválido');
        return [];
      }

      return characters.filter((char: any) => char && char.name);
    } catch (error) {
      console.error('Erro ao carregar personagens locais:', error);
      return [];
    }
  }, []);

  /**
   * Migra personagens do localStorage para o Firebase
   */
  const migrateCharacters = useCallback(async (): Promise<{
    success: number;
    failed: number;
    errors: string[];
  }> => {
    if (!firebaseUser) {
      throw new Error('Usuário não autenticado');
    }

    setIsMigrating(true);
    setMigrationError(null);

    const localCharacters = getLocalCharacters();
    const total = localCharacters.length;
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    setMigrationProgress({ current: 0, total, currentItem: '' });

    try {
      for (let i = 0; i < localCharacters.length; i++) {
        const character = localCharacters[i];
        
        setMigrationProgress({
          current: i + 1,
          total,
          currentItem: character.name || `Personagem ${i + 1}`
        });

        try {
          console.log(`🔄 [Migration] Tentando migrar personagem:`, character.name || 'Sem nome');
          console.log(`📋 [Migration] Dados originais:`, character);
          
          // Converter dados do localStorage para formato esperado pelo CharacterService
          const convertedCharacter = convertLocalCharacterToFirebase(character);
          console.log(`✅ [Migration] Dados convertidos:`, convertedCharacter);
          
          await CharacterService.createCharacter(convertedCharacter, firebaseUser.uid);
          console.log(`🎉 [Migration] Personagem migrado com sucesso:`, convertedCharacter.name);
          success++;
        } catch (error: any) {
          console.error(`💥 [Migration] Erro ao migrar personagem ${character.name || 'Sem nome'}:`, error);
          console.error(`📋 [Migration] Stack trace:`, error.stack);
          errors.push(`${character.name || 'Sem nome'}: ${error.message}`);
          failed++;
        }

        // Pequena pausa para não sobrecarregar o Firebase
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return { success, failed, errors };
    } finally {
      setIsMigrating(false);
      setMigrationProgress({ current: 0, total: 0, currentItem: '' });
    }
  }, [firebaseUser, getLocalCharacters]);

  /**
   * Cria backup dos dados locais antes da migração
   */
  const createLocalBackup = useCallback((): void => {
    try {
      const localData = {
        characters: getLocalCharacters(),
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };

      const backupKey = `${STORAGE_KEYS.BACKUP}-${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(localData));
      
      console.log('Backup criado com sucesso:', backupKey);
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      throw new Error('Falha ao criar backup dos dados locais');
    }
  }, [getLocalCharacters]);

  /**
   * Limpa dados do localStorage após migração bem-sucedida
   */
  const clearLocalData = useCallback((): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.CHARACTERS);
      console.log('Dados locais limpos após migração');
    } catch (error) {
      console.error('Erro ao limpar dados locais:', error);
    }
  }, []);

  /**
   * Executa migração completa
   */
  const executeMigration = useCallback(async (): Promise<boolean> => {
    if (!firebaseUser) {
      setMigrationError('Usuário não autenticado');
      return false;
    }

    if (!checkForLocalData()) {
      setMigrationError('Nenhum dado local encontrado para migrar');
      return false;
    }

    try {
      // 1. Criar backup
      setMigrationProgress({ current: 0, total: 1, currentItem: 'Criando backup...' });
      createLocalBackup();

      // 2. Migrar personagens
      const result = await migrateCharacters();

      // 3. Limpar dados locais se migração foi 100% bem-sucedida
      if (result.failed === 0) {
        clearLocalData();
      }

      // 4. Reportar resultado
      if (result.success > 0) {
        console.log(`Migração concluída: ${result.success} personagens migrados com sucesso`);
        if (result.failed > 0) {
          console.warn(`${result.failed} personagens falharam na migração:`, result.errors);
        }
        return true;
      } else {
        setMigrationError('Nenhum personagem foi migrado com sucesso');
        return false;
      }
    } catch (error: any) {
      console.error('Erro na migração:', error);
      setMigrationError(error.message);
      return false;
    }
  }, [firebaseUser, checkForLocalData, createLocalBackup, migrateCharacters, clearLocalData]);

  /**
   * Restaura backup local
   */
  const restoreLocalBackup = useCallback((backupKey: string): boolean => {
    try {
      const backupData = localStorage.getItem(backupKey);
      if (!backupData) {
        throw new Error('Backup não encontrado');
      }

      const backup = JSON.parse(backupData);
      localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(backup.characters));
      
      console.log('Backup restaurado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      setMigrationError('Erro ao restaurar backup');
      return false;
    }
  }, []);

  /**
   * Lista backups disponíveis
   */
  const getAvailableBackups = useCallback((): Array<{
    key: string;
    timestamp: string;
    characterCount: number;
  }> => {
    const backups: Array<{ key: string; timestamp: string; characterCount: number }> = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(STORAGE_KEYS.BACKUP)) {
          const data = localStorage.getItem(key);
          if (data) {
            const backup = JSON.parse(data);
            backups.push({
              key,
              timestamp: backup.timestamp,
              characterCount: backup.characters?.length || 0
            });
          }
        }
      }

      // Ordenar por timestamp (mais recente primeiro)
      backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Erro ao listar backups:', error);
    }

    return backups;
  }, []);

  return {
    // Estado
    isMigrating,
    migrationError,
    migrationProgress,
    
    // Funções
    checkForLocalData,
    executeMigration,
    createLocalBackup,
    clearLocalData,
    restoreLocalBackup,
    getAvailableBackups,
    
    // Utilitários
    getLocalCharacters,
  };
}; 