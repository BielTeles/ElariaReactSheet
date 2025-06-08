// ===================================================================
// SERVIÇO DE PERSONAGENS - ELARIA RPG
// ===================================================================

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  WriteBatch,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { Character } from '../types/character';
import {
  DatabaseCharacter,
  CharacterFilters,
  SortOptions,
  PaginatedResult,
  CharacterBackup
} from '../types/database';

/**
 * Classe de serviço para gerenciamento de personagens
 */
export class CharacterService {

  /**
   * Cria um novo personagem
   */
  static async createCharacter(character: Character, userId: string): Promise<string> {
    try {
      // Preparar dados para o Firestore
      const characterData: Omit<DatabaseCharacter, 'id'> = {
        ...character,
        // Garantir que propriedades derivadas existam
        class: character.mainClass,
        element: character.mainClass === 'evocador' ? character.subclass : undefined,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        version: 1,
        isPublic: false,
        tags: this.generateAutoTags(character)
      };

      // Remover campos que não devem ir para o banco e garantir que não há undefined
      const { id, createdAt: originalCreatedAt, updatedAt: originalUpdatedAt, ...rawData } = characterData as any;
      
      // Filtrar campos undefined para evitar erro do Firestore
      const cleanData = Object.fromEntries(
        Object.entries(rawData).filter(([_, value]) => value !== undefined)
      );
      
      console.log('🔥 [CharacterService] Dados finais para Firestore:', cleanData);

      const characterRef = doc(collection(db, 'characters'));
      const characterId = characterRef.id;

      const batch = writeBatch(db);
      batch.set(characterRef, cleanData);

      // Log da atividade
      const activityRef = doc(collection(db, 'activityLogs'));
      batch.set(activityRef, {
        userId,
        action: 'character_created',
        targetType: 'character',
        targetId: characterId,
        details: {
          characterName: character.name,
          class: character.mainClass,
          race: character.race
        },
        timestamp: Timestamp.now()
      });

      await batch.commit();
      return characterId;
    } catch (error) {
      console.error('Erro ao criar personagem:', error);
      throw new Error('Erro ao salvar personagem no banco de dados');
    }
  }

  /**
   * Obtém um personagem por ID
   */
  static async getCharacter(characterId: string, userId?: string): Promise<DatabaseCharacter | null> {
    try {
      const characterRef = doc(db, 'characters', characterId);
      const characterDoc = await getDoc(characterRef);

      if (!characterDoc.exists()) {
        return null;
      }

      const character = { id: characterDoc.id, ...characterDoc.data() } as DatabaseCharacter;

      // Verificar permissões
      if (userId && character.userId !== userId && !character.isPublic) {
        throw new Error('Você não tem permissão para visualizar este personagem');
      }

      return character;
    } catch (error) {
      console.error('Erro ao buscar personagem:', error);
      throw new Error('Erro ao carregar personagem');
    }
  }

  /**
   * Obtém personagens do usuário
   */
  static async getUserCharacters(
    userId: string,
    filters?: CharacterFilters,
    sort?: SortOptions,
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResult<DatabaseCharacter>> {
    try {
      let charactersQuery = query(
        collection(db, 'characters'),
        where('userId', '==', userId)
      );

      // Aplicar filtros
      if (filters) {
        if (filters.class) {
          charactersQuery = query(charactersQuery, where('class', '==', filters.class));
        }
        if (filters.race) {
          charactersQuery = query(charactersQuery, where('race', '==', filters.race));
        }
        if (filters.tags && filters.tags.length > 0) {
          charactersQuery = query(charactersQuery, where('tags', 'array-contains-any', filters.tags));
        }
      }

      // Aplicar ordenação
      if (sort) {
        charactersQuery = query(charactersQuery, orderBy(sort.field, sort.direction));
      } else {
        charactersQuery = query(charactersQuery, orderBy('updatedAt', 'desc'));
      }

      // Paginação
      if (page > 1) {
        const offset = (page - 1) * pageSize;
        const offsetQuery = query(charactersQuery, limit(offset));
        const offsetSnapshot = await getDocs(offsetQuery);
        const lastDoc = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
        
        if (lastDoc) {
          charactersQuery = query(charactersQuery, startAfter(lastDoc));
        }
      }

      charactersQuery = query(charactersQuery, limit(pageSize));
      const snapshot = await getDocs(charactersQuery);

      const characters = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DatabaseCharacter[];

      // Contar total (aproximado)
      const totalQuery = query(collection(db, 'characters'), where('userId', '==', userId));
      const totalSnapshot = await getDocs(totalQuery);
      const total = totalSnapshot.size;

      return {
        data: characters,
        total,
        page,
        limit: pageSize,
        hasNext: characters.length === pageSize,
        hasPrevious: page > 1
      };
    } catch (error) {
      console.error('Erro ao buscar personagens do usuário:', error);
      throw new Error('Erro ao carregar personagens');
    }
  }

  /**
   * Atualiza um personagem
   */
  static async updateCharacter(
    characterId: string,
    updates: Partial<Character>,
    userId: string,
    createBackup = true
  ): Promise<void> {
    try {
      const characterRef = doc(db, 'characters', characterId);
      const characterDoc = await getDoc(characterRef);

      if (!characterDoc.exists()) {
        throw new Error('Personagem não encontrado');
      }

      const character = characterDoc.data() as DatabaseCharacter;

      // Verificar permissões
      if (character.userId !== userId) {
        throw new Error('Você não tem permissão para editar este personagem');
      }

      const batch = writeBatch(db);

      // Criar backup se solicitado
      let backupData: Partial<DatabaseCharacter> = {};
      if (createBackup) {
        const backupVersion = {
          version: character.version,
          data: { ...character },
          timestamp: Timestamp.now(),
          reason: 'before-edit'
        };

        const currentBackup = character.backup || { previousVersions: [], lastBackup: Timestamp.now() };
        currentBackup.previousVersions.push(backupVersion);

        // Manter apenas os últimos 10 backups
        if (currentBackup.previousVersions.length > 10) {
          currentBackup.previousVersions = currentBackup.previousVersions.slice(-10);
        }

        currentBackup.lastBackup = Timestamp.now();
        backupData.backup = currentBackup;
      }

      // Criar um personagem temporário para gerar tags
      const tempCharacter: Character = {
        ...character,
        ...updates,
        id: characterId,
        createdAt: character.createdAt.toDate(),
        updatedAt: character.updatedAt.toDate(),
        // Garantir propriedades derivadas
        class: updates.mainClass || character.mainClass,
        element: (updates.mainClass || character.mainClass) === 'evocador' 
          ? (updates.subclass || character.subclass) 
          : undefined
      };

      // Atualizar personagem
      const updateData = {
        ...updates,
        ...backupData,
        updatedAt: Timestamp.now(),
        version: increment(1),
        class: updates.mainClass || character.mainClass,
        element: (updates.mainClass || character.mainClass) === 'evocador' 
          ? (updates.subclass || character.subclass) 
          : undefined,
        tags: updates.name || updates.mainClass || updates.race 
          ? this.generateAutoTags(tempCharacter)
          : character.tags
      };

      batch.update(characterRef, updateData);

      // Log da atividade
      const activityRef = doc(collection(db, 'activityLogs'));
      batch.set(activityRef, {
        userId,
        action: 'character_updated',
        targetType: 'character',
        targetId: characterId,
        details: {
          characterName: character.name,
          updatedFields: Object.keys(updates)
        },
        timestamp: Timestamp.now()
      });

      await batch.commit();
    } catch (error) {
      console.error('Erro ao atualizar personagem:', error);
      throw new Error('Erro ao salvar alterações do personagem');
    }
  }

  /**
   * Deleta um personagem
   */
  static async deleteCharacter(characterId: string, userId: string): Promise<void> {
    try {
      const characterRef = doc(db, 'characters', characterId);
      const characterDoc = await getDoc(characterRef);

      if (!characterDoc.exists()) {
        throw new Error('Personagem não encontrado');
      }

      const character = characterDoc.data() as DatabaseCharacter;

      // Verificar permissões
      if (character.userId !== userId) {
        throw new Error('Você não tem permissão para deletar este personagem');
      }

      const batch = writeBatch(db);

      // Deletar personagem
      batch.delete(characterRef);

      // Atualizar estatísticas do usuário
      const userRef = doc(db, 'users', userId);
      batch.update(userRef, {
        'statistics.charactersCreated': increment(-1)
      });

      // Log da atividade
      const activityRef = doc(collection(db, 'activityLogs'));
      batch.set(activityRef, {
        userId,
        action: 'character_deleted',
        targetType: 'character',
        targetId: characterId,
        details: {
          characterName: character.name,
          class: character.mainClass,
          race: character.race
        },
        timestamp: Timestamp.now()
      });

      await batch.commit();
    } catch (error) {
      console.error('Erro ao deletar personagem:', error);
      throw new Error('Erro ao deletar personagem');
    }
  }

  /**
   * Duplica um personagem
   */
  static async duplicateCharacter(characterId: string, userId: string, newName?: string): Promise<string> {
    try {
      const originalCharacter = await this.getCharacter(characterId, userId);
      
      if (!originalCharacter) {
        throw new Error('Personagem original não encontrado');
      }

      if (originalCharacter.userId !== userId) {
        throw new Error('Você não tem permissão para duplicar este personagem');
      }

      // Criar cópia - converter DatabaseCharacter para Character
      const characterCopy: Character = {
        ...originalCharacter,
        id: '', // Será gerado automaticamente
        name: newName || `${originalCharacter.name} (Cópia)`,
        createdAt: originalCharacter.createdAt.toDate(),
        updatedAt: originalCharacter.updatedAt.toDate()
      };

      // Log da atividade original
      const activityRef = doc(collection(db, 'activityLogs'));
      const batch = writeBatch(db);
      batch.set(activityRef, {
        userId,
        action: 'character_created',
        targetType: 'character',
        targetId: originalCharacter.id!,
        details: {
          characterName: originalCharacter.name,
          class: originalCharacter.mainClass,
          race: originalCharacter.race
        },
        timestamp: Timestamp.now()
      });

      await batch.commit();

      return await this.createCharacter(characterCopy, userId);
    } catch (error) {
      console.error('Erro ao duplicar personagem:', error);
      throw new Error('Erro ao duplicar personagem');
    }
  }

  /**
   * Alterna visibilidade pública do personagem
   */
  static async togglePublicVisibility(characterId: string, userId: string): Promise<boolean> {
    try {
      const characterRef = doc(db, 'characters', characterId);
      const characterDoc = await getDoc(characterRef);

      if (!characterDoc.exists()) {
        throw new Error('Personagem não encontrado');
      }

      const character = characterDoc.data() as DatabaseCharacter;

      // Verificar permissões
      if (character.userId !== userId) {
        throw new Error('Você não tem permissão para alterar este personagem');
      }

      const newVisibility = !character.isPublic;

      await updateDoc(characterRef, {
        isPublic: newVisibility,
        updatedAt: Timestamp.now()
      });

      return newVisibility;
    } catch (error) {
      console.error('Erro ao alterar visibilidade:', error);
      throw new Error('Erro ao alterar visibilidade do personagem');
    }
  }

  /**
   * Busca personagens públicos
   */
  static async searchPublicCharacters(
    searchTerm?: string,
    filters?: CharacterFilters,
    sort?: SortOptions,
    page = 1,
    pageSize = 20
  ): Promise<PaginatedResult<DatabaseCharacter>> {
    try {
      let charactersQuery = query(
        collection(db, 'characters'),
        where('isPublic', '==', true)
      );

      // Aplicar filtros
      if (filters) {
        if (filters.class) {
          charactersQuery = query(charactersQuery, where('class', '==', filters.class));
        }
        if (filters.race) {
          charactersQuery = query(charactersQuery, where('race', '==', filters.race));
        }
      }

      // Aplicar ordenação
      if (sort) {
        charactersQuery = query(charactersQuery, orderBy(sort.field, sort.direction));
      } else {
        charactersQuery = query(charactersQuery, orderBy('updatedAt', 'desc'));
      }

      // Paginação
      charactersQuery = query(charactersQuery, limit(pageSize));
      const snapshot = await getDocs(charactersQuery);

      let characters = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DatabaseCharacter[];

      // Filtrar por termo de busca (busca simples no nome)
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        characters = characters.filter(char => 
          char.name.toLowerCase().includes(lowerSearchTerm)
        );
      }

      return {
        data: characters,
        total: characters.length, // Aproximado
        page,
        limit: pageSize,
        hasNext: characters.length === pageSize,
        hasPrevious: page > 1
      };
    } catch (error) {
      console.error('Erro ao buscar personagens públicos:', error);
      throw new Error('Erro ao buscar personagens públicos');
    }
  }

  /**
   * Restaura backup de personagem
   */
  static async restoreCharacterBackup(
    characterId: string,
    backupVersion: number,
    userId: string
  ): Promise<void> {
    try {
      const characterRef = doc(db, 'characters', characterId);
      const characterDoc = await getDoc(characterRef);

      if (!characterDoc.exists()) {
        throw new Error('Personagem não encontrado');
      }

      const character = characterDoc.data() as DatabaseCharacter;

      // Verificar permissões
      if (character.userId !== userId) {
        throw new Error('Você não tem permissão para restaurar este personagem');
      }

      const backup = character.backup?.previousVersions.find(b => b.version === backupVersion);
      if (!backup) {
        throw new Error('Backup não encontrado');
      }

      // Restaurar dados do backup
      await updateDoc(characterRef, {
        ...backup.data,
        updatedAt: Timestamp.now(),
        version: increment(1)
      });

      // Log da atividade
      const activityRef = doc(collection(db, 'activityLogs'));
      await setDoc(activityRef, {
        userId,
        action: 'character_updated',
        targetType: 'character',
        targetId: characterId,
        details: {
          characterName: character.name,
          action: 'backup_restored',
          backupVersion
        },
        timestamp: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      throw new Error('Erro ao restaurar backup do personagem');
    }
  }

  // ===================================================================
  // MÉTODOS PRIVADOS
  // ===================================================================

  /**
   * Gera tags automáticas baseadas nas características do personagem
   */
  private static generateAutoTags(character: Character): string[] {
    const tags: string[] = [];

    if (character.mainClass) {
      tags.push(character.mainClass.toLowerCase());
    }

    if (character.race) {
      tags.push(character.race.toLowerCase());
    }

    if (character.mainClass === 'evocador' && character.subclass) {
      tags.push(character.subclass.toLowerCase());
    }

    if (character.deity) {
      tags.push(character.deity.toLowerCase());
    }

    if (character.origin) {
      tags.push(character.origin.toLowerCase());
    }

    return Array.from(new Set(tags)); // Remove duplicatas usando Array.from
  }
} 