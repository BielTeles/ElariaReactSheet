import { CharacterCreation } from '../types/character';
import { CharacterState } from '../types/interactive';
import { 
  APP_VERSION, 
  STORAGE_KEYS, 
  AUTO_SAVE_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES 
} from '../constants';
import { 
  validateCharacterData, 
  ValidationResult,
  sanitizeString
} from './validation';

export interface SavedCharacter {
  id: string;
  name: string;
  data: CharacterCreation;
  state: CharacterState;
  createdAt: Date;
  lastModified: Date;
  version: string;
}

// Interface para histórico de versões
export interface CharacterVersion {
  timestamp: Date;
  data: CharacterCreation;
  state: CharacterState;
  changeReason?: string;
}

// Interface para configurações de auto-salvamento
export interface AutoSaveConfig {
  enabled: boolean;
  interval: number; // em millisegundos
  maxVersions: number; // máximo de versões mantidas no histórico
}

// Configuração padrão de auto-salvamento
const DEFAULT_CONFIG: AutoSaveConfig = {
  enabled: AUTO_SAVE_CONFIG.ENABLED,
  interval: AUTO_SAVE_CONFIG.INTERVAL,
  maxVersions: AUTO_SAVE_CONFIG.MAX_VERSIONS
};

export class CharacterStorage {
  private static autoSaveTimers: Map<string, NodeJS.Timeout> = new Map();
  
  // Salvar personagem
  static saveCharacter(characterData: CharacterCreation, characterState: CharacterState, reason?: string): SavedCharacter {
    try {
      // Validar dados antes de salvar
      const validation = this.validateCharacterData(characterData, characterState);
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }
      
      const characters = this.getAllCharacters();
      
      // Gerar ID único se não existir
      const rawName = characterData.personalDetails?.name || 'Personagem';
      const sanitizedName = sanitizeString(rawName);
      const id = this.generateId(sanitizedName);
      
      const savedCharacter: SavedCharacter = {
        id,
        name: sanitizedName || 'Sem Nome',
        data: characterData,
        state: characterState,
        createdAt: characterData.createdAt ? new Date(characterData.createdAt) : new Date(),
        lastModified: new Date(),
        version: APP_VERSION
      };

      // Verificar se já existe um personagem com esse ID
      const existingIndex = characters.findIndex(char => char.id === id);
      
      if (existingIndex >= 0) {
        // Salvar versão anterior no histórico antes de atualizar
        this.saveToVersionHistory(characters[existingIndex], reason);
        
        // Atualizar existente
        characters[existingIndex] = savedCharacter;
      } else {
        // Adicionar novo
        characters.push(savedCharacter);
      }

      this.saveToStorage(characters);
      
      // Fazer backup automático
      this.createBackup();
      
      console.log(SUCCESS_MESSAGES.CHARACTER_SAVED, savedCharacter.name);
      return savedCharacter;
    } catch (error) {
      console.error(ERROR_MESSAGES.SAVE_FAILED, error);
      throw error;
    }
  }

  // Auto-salvamento de personagem
  static setupAutoSave(characterId: string, getData: () => { data: CharacterCreation, state: CharacterState }): void {
    const config = this.getConfig();
    if (!config.enabled) return;

    // Limpar timer anterior se existir
    const existingTimer = this.autoSaveTimers.get(characterId);
    if (existingTimer) {
      clearInterval(existingTimer);
    }

    // Configurar novo timer
    const timer = setInterval(() => {
      try {
        const { data, state } = getData();
        this.saveCharacter(data, state, 'Auto-salvamento');
        console.log(`Auto-salvamento realizado para personagem ${characterId}`);
      } catch (error) {
        console.error('Erro no auto-salvamento:', error);
      }
    }, config.interval);

    this.autoSaveTimers.set(characterId, timer);
  }

  // Parar auto-salvamento
  static stopAutoSave(characterId: string): void {
    const timer = this.autoSaveTimers.get(characterId);
    if (timer) {
      clearInterval(timer);
      this.autoSaveTimers.delete(characterId);
    }
  }

  // Validar dados do personagem (usa novo sistema de validação)
  private static validateCharacterData(data: CharacterCreation, state: CharacterState): ValidationResult {
    return validateCharacterData(data, state, { strict: false });
  }

  // Salvar no histórico de versões
  private static saveToVersionHistory(character: SavedCharacter, reason?: string): void {
    const config = this.getConfig();
    const historyKey = `${STORAGE_KEYS.HISTORY_PREFIX}${character.id}`;
    
    try {
      const existingHistory = localStorage.getItem(historyKey);
      let history: CharacterVersion[] = existingHistory ? JSON.parse(existingHistory) : [];
      
      // Adicionar nova versão
      const newVersion: CharacterVersion = {
        timestamp: character.lastModified,
        data: character.data,
        state: character.state,
        changeReason: reason
      };
      
      history.unshift(newVersion);
      
      // Manter apenas as últimas N versões
      if (history.length > config.maxVersions) {
        history = history.slice(0, config.maxVersions);
      }
      
      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (error) {
      console.error('Erro ao salvar histórico de versões:', error);
    }
  }

  // Obter histórico de versões
  static getVersionHistory(characterId: string): CharacterVersion[] {
    const historyKey = `${STORAGE_KEYS.HISTORY_PREFIX}${characterId}`;
    
    try {
      const stored = localStorage.getItem(historyKey);
      if (!stored) return [];
      
      const history = JSON.parse(stored) as CharacterVersion[];
      
      // Converter datas de volta para objetos Date
      return history.map(version => ({
        ...version,
        timestamp: new Date(version.timestamp)
      }));
    } catch (error) {
      console.error('Erro ao carregar histórico de versões:', error);
      return [];
    }
  }

  // Restaurar versão anterior
  static restoreVersion(characterId: string, versionIndex: number): boolean {
    try {
      const history = this.getVersionHistory(characterId);
      if (versionIndex >= history.length) return false;
      
      const versionToRestore = history[versionIndex];
      const characters = this.getAllCharacters();
      const characterIndex = characters.findIndex(char => char.id === characterId);
      
      if (characterIndex === -1) return false;
      
      // Atualizar personagem com a versão restaurada
      characters[characterIndex].data = versionToRestore.data;
      characters[characterIndex].state = versionToRestore.state;
      characters[characterIndex].lastModified = new Date();
      
      this.saveToStorage(characters);
      return true;
    } catch (error) {
      console.error('Erro ao restaurar versão:', error);
      return false;
    }
  }

  // Criar backup automático
  private static createBackup(): void {
    try {
      const characters = this.getAllCharacters();
      const backup = {
        timestamp: new Date(),
        characters,
        version: APP_VERSION
      };
      
      localStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(backup));
    } catch (error) {
      console.error('Erro ao criar backup:', error);
    }
  }

  // Restaurar backup
  static restoreBackup(): boolean {
    try {
      const backup = localStorage.getItem(STORAGE_KEYS.BACKUP);
      if (!backup) return false;
      
      const backupData = JSON.parse(backup);
      if (!backupData.characters) return false;
      
      localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(backupData.characters));
      return true;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return false;
    }
  }

  // Configuração do sistema
  static getConfig(): AutoSaveConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (!stored) return DEFAULT_CONFIG;
      
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      return DEFAULT_CONFIG;
    }
  }

  static updateConfig(newConfig: Partial<AutoSaveConfig>): void {
    try {
      const currentConfig = this.getConfig();
      const updatedConfig = { ...currentConfig, ...newConfig };
      
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updatedConfig));
      
      // Reiniciar todos os auto-saves com a nova configuração
      if (newConfig.interval || newConfig.enabled !== undefined) {
        this.restartAllAutoSaves();
      }
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
    }
  }

  // Reiniciar todos os auto-saves
  private static restartAllAutoSaves(): void {
    // Parar todos os timers atuais
    for (const [, timer] of Array.from(this.autoSaveTimers.entries())) {
      clearInterval(timer);
    }
    this.autoSaveTimers.clear();
    
    // Nota: Os timers precisarão ser reconfigurados pelos componentes
    console.log('Auto-saves reiniciados. Componentes precisam reconfigurar.');
  }

  // Carregar personagem por ID
  static loadCharacter(id: string): SavedCharacter | null {
    const characters = this.getAllCharacters();
    const character = characters.find(char => char.id === id) || null;
    
    // Migrar personagem antigo se necessário e salvar se foi migrado
    if (character) {
      const migratedCharacter = this.migrateCharacterData(character);
      
      // Se houve mudanças na migração, salvar
      if (migratedCharacter !== character) {
        this.saveCharacterDirectly(migratedCharacter);
      }
      
      return migratedCharacter;
    }
    
    return null;
  }

  // Salvar personagem diretamente (sem validação extra)
  private static saveCharacterDirectly(character: SavedCharacter): void {
    const characters = this.getAllCharacters();
    const index = characters.findIndex(char => char.id === character.id);
    
    if (index >= 0) {
      characters[index] = character;
    } else {
      characters.push(character);
    }
    
    this.saveToStorage(characters);
  }

  // Migrar dados de personagem para versões mais novas
  private static migrateCharacterData(character: SavedCharacter): SavedCharacter {
    let needsUpdate = false;
    const migratedState = { ...character.state };
    
    // Adicionar campo notes se não existir (migração v1.1.0)
    if (!migratedState.notes) {
      migratedState.notes = [];
      needsUpdate = true;
    }
    
    // Garantir que rollHistory existe
    if (!migratedState.rollHistory) {
      migratedState.rollHistory = [];
      needsUpdate = true;
    }
    
    // Garantir que conditions existe
    if (!migratedState.conditions) {
      migratedState.conditions = [];
      needsUpdate = true;
    }
    
    // Adicionar campos financeiros se não existirem (migração v1.2.0)
    if (migratedState.currentMoney === undefined) {
      migratedState.currentMoney = 0;
      needsUpdate = true;
    }
    
    if (!migratedState.transactions) {
      migratedState.transactions = [];
      needsUpdate = true;
    }
    
    if (!migratedState.inventory) {
      migratedState.inventory = [];
      needsUpdate = true;
    }
    

    
    // Adicionar campos de equipamentos se não existirem
    if (migratedState.equippedWeapon === undefined) {
      migratedState.equippedWeapon = undefined;
      needsUpdate = true;
    }
    
    if (migratedState.equippedArmor === undefined) {
      migratedState.equippedArmor = undefined;
      needsUpdate = true;
    }
    
    if (migratedState.equippedShield === undefined) {
      migratedState.equippedShield = undefined;
      needsUpdate = true;
    }
    
    if (!migratedState.equippedAccessories) {
      migratedState.equippedAccessories = [];
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      const updatedCharacter = {
        ...character,
        state: migratedState,
        version: APP_VERSION,
        lastModified: new Date()
      };
      
      // Salvar migração será feita apenas quando saveCharacter for chamado
      // Removemos a chamada recursiva aqui para evitar loop infinito
      
      return updatedCharacter;
    }
    
    return character;
  }

  // Obter todos os personagens
  static getAllCharacters(): SavedCharacter[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
      if (!stored) return [];
      
      const characters = JSON.parse(stored) as SavedCharacter[];
      
      // Converter datas de volta para objetos Date
      return characters.map(char => ({
        ...char,
        createdAt: new Date(char.createdAt),
        lastModified: new Date(char.lastModified)
      }));
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
      return [];
    }
  }

  // Deletar personagem
  static deleteCharacter(id: string): boolean {
    try {
      const characters = this.getAllCharacters();
      const filteredCharacters = characters.filter(char => char.id !== id);
      
      if (filteredCharacters.length === characters.length) {
        return false; // Personagem não encontrado
      }
      
      // Remover histórico de versões também
      const historyKey = `${STORAGE_KEYS.HISTORY_PREFIX}${id}`;
      localStorage.removeItem(historyKey);
      
      // Parar auto-salvamento se ativo
      this.stopAutoSave(id);
      
      this.saveToStorage(filteredCharacters);
      return true;
    } catch (error) {
      console.error('Erro ao deletar personagem:', error);
      return false;
    }
  }

  // Duplicar personagem
  static duplicateCharacter(id: string): SavedCharacter | null {
    const original = this.loadCharacter(id);
    if (!original) return null;

    const duplicated: SavedCharacter = {
      ...original,
      id: this.generateId(original.name + ' (Cópia)'),
      name: original.name + ' (Cópia)',
      createdAt: new Date(),
      lastModified: new Date(),
      state: {
        ...original.state,
        rollHistory: [] // Limpar histórico de rolagens da cópia
      }
    };

    const characters = this.getAllCharacters();
    characters.push(duplicated);
    this.saveToStorage(characters);
    
    return duplicated;
  }

  // Atualizar estado do personagem (HP, MP, histórico, etc.)
  static updateCharacterState(id: string, newState: Partial<CharacterState>, reason?: string): boolean {
    try {
      const characters = this.getAllCharacters();
      const characterIndex = characters.findIndex(char => char.id === id);
      
      if (characterIndex === -1) return false;
      
      // Salvar versão atual no histórico se houver mudança significativa
      const oldState = characters[characterIndex].state;
      const hasSignificantChange = this.hasSignificantStateChange(oldState, newState);
      
      if (hasSignificantChange) {
        this.saveToVersionHistory(characters[characterIndex], reason || 'Alteração de estado');
      }
      
      characters[characterIndex].state = {
        ...characters[characterIndex].state,
        ...newState
      };
      characters[characterIndex].lastModified = new Date();
      
      this.saveToStorage(characters);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar estado do personagem:', error);
      return false;
    }
  }

  // Verificar se há mudança significativa no estado
  private static hasSignificantStateChange(oldState: CharacterState, newState: Partial<CharacterState>): boolean {
    // Considera significativo se houver mudança em HP, MP, Vigor ou equipamentos
    const significantProps = ['currentHP', 'currentMP', 'currentVigor', 'equippedWeapon', 'equippedArmor'];
    
    return significantProps.some(prop => {
      return newState[prop as keyof CharacterState] !== undefined && 
             newState[prop as keyof CharacterState] !== oldState[prop as keyof CharacterState];
    });
  }

  // Exportar personagem para JSON
  static exportCharacter(id: string): string | null {
    const character = this.loadCharacter(id);
    if (!character) return null;
    
    // Incluir histórico de versões na exportação
    const history = this.getVersionHistory(id);
    
    const exportData = {
      character,
      history,
      exportDate: new Date(),
      version: APP_VERSION
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  // Importar personagem de JSON
  static importCharacter(jsonData: string): SavedCharacter | null {
    try {
      const importData = JSON.parse(jsonData);
      
      // Suportar tanto formato antigo quanto novo
      const character = importData.character || importData;
      const history = importData.history || [];
      
      // Validar estrutura básica
      if (!character.data || !character.state || !character.name) {
        throw new Error('Estrutura de personagem inválida');
      }
      
      // Gerar novo ID para evitar conflitos
      const newId = this.generateId(character.name + ' (Importado)');
      character.id = newId;
      character.name = character.name + ' (Importado)';
      character.createdAt = new Date();
      character.lastModified = new Date();
      character.version = APP_VERSION;
      
      const characters = this.getAllCharacters();
      characters.push(character);
      this.saveToStorage(characters);
      
      // Importar histórico se disponível
      if (history.length > 0) {
        const historyKey = `${STORAGE_KEYS.HISTORY_PREFIX}${newId}`;
        localStorage.setItem(historyKey, JSON.stringify(history));
      }
      
      return character;
    } catch (error) {
      console.error('Erro ao importar personagem:', error);
      return null;
    }
  }

  // Backup de todos os personagens
  static exportAllCharacters(): string {
    const characters = this.getAllCharacters();
    
    // Incluir históricos de todos os personagens
    const charactersWithHistory = characters.map(char => ({
      character: char,
      history: this.getVersionHistory(char.id)
    }));
    
    return JSON.stringify({
      version: APP_VERSION,
      exportDate: new Date(),
      characters: charactersWithHistory,
      config: this.getConfig()
    }, null, 2);
  }

  // Limpar todos os personagens (com confirmação)
  // Limpar dados corrompidos do localStorage (usar em caso de emergência)
  static emergency_clearCorruptedData(): boolean {
    try {
      // Limpar todos os dados relacionados aos personagens
      const keys = Object.keys(localStorage);
      const keysToRemove = keys.filter(key => 
        key.startsWith('elaria-rpg-characters') || 
        key.includes('character-history') ||
        key.includes('elaria-backup')
      );
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log('✅ Dados corrompidos removidos com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar dados corrompidos:', error);
      return false;
    }
  }

  static clearAllCharacters(): boolean {
    try {
      // Parar todos os auto-saves
      for (const [characterId] of Array.from(this.autoSaveTimers.entries())) {
        this.stopAutoSave(characterId);
      }
      
      // Remover dados principais
      localStorage.removeItem(STORAGE_KEYS.CHARACTERS);
      localStorage.removeItem(STORAGE_KEYS.BACKUP);
      
      // Remover históricos de versões
      const characters = this.getAllCharacters();
      characters.forEach(char => {
        const historyKey = `${STORAGE_KEYS.HISTORY_PREFIX}${char.id}`;
        localStorage.removeItem(historyKey);
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao limpar personagens:', error);
      return false;
    }
  }

  // Obter estatísticas
  static getStats() {
    const characters = this.getAllCharacters();
    const classes = characters.reduce((acc, char) => {
      const className = char.data.mainClass || 'Desconhecida';
      acc[className] = (acc[className] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const races = characters.reduce((acc, char) => {
      const raceName = char.data.race || 'Desconhecida';
      acc[raceName] = (acc[raceName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Estatísticas adicionais
    const totalVersions = characters.reduce((acc, char) => {
      return acc + this.getVersionHistory(char.id).length;
    }, 0);

    return {
      total: characters.length,
      classes,
      races,
      totalVersions,
      oldestCreation: characters.length > 0 ? 
        new Date(Math.min(...characters.map(c => c.createdAt.getTime()))) : null,
      newestCreation: characters.length > 0 ? 
        new Date(Math.max(...characters.map(c => c.createdAt.getTime()))) : null,
      lastBackup: this.getLastBackupDate()
    };
  }

  // Obter data do último backup
  private static getLastBackupDate(): Date | null {
    try {
      const backup = localStorage.getItem(STORAGE_KEYS.BACKUP);
      if (!backup) return null;
      
      const backupData = JSON.parse(backup);
      return backupData.timestamp ? new Date(backupData.timestamp) : null;
    } catch (error) {
      return null;
    }
  }

  // Funções auxiliares privadas
  private static generateId(baseName: string): string {
    const sanitized = baseName.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    
    return `${sanitized}-${timestamp}-${random}`;
  }

  private static saveToStorage(characters: SavedCharacter[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(characters));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      throw new Error('Falha ao salvar personagens');
    }
  }
} 