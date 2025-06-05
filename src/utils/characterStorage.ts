import { CharacterCreation } from '../types/character';
import { CharacterState } from '../types/interactive';

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

const STORAGE_KEY = 'elaria-characters';
const BACKUP_KEY = 'elaria-characters-backup';
const CONFIG_KEY = 'elaria-config';
const CURRENT_VERSION = '1.1.0';

// Configuração padrão de auto-salvamento
const DEFAULT_CONFIG: AutoSaveConfig = {
  enabled: true,
  interval: 30000, // 30 segundos
  maxVersions: 5
};

export class CharacterStorage {
  private static autoSaveTimers: Map<string, NodeJS.Timeout> = new Map();
  
  // Salvar personagem
  static saveCharacter(characterData: CharacterCreation, characterState: CharacterState, reason?: string): SavedCharacter {
    // Validar dados antes de salvar
    this.validateCharacterData(characterData, characterState);
    
    const characters = this.getAllCharacters();
    
    // Gerar ID único se não existir
    const id = characterData.personalDetails?.name ? 
      this.generateId(characterData.personalDetails.name) : 
      this.generateId('Personagem');
    
    const savedCharacter: SavedCharacter = {
      id,
      name: characterData.personalDetails?.name || 'Sem Nome',
      data: characterData,
      state: characterState,
      createdAt: characterData.createdAt ? new Date(characterData.createdAt) : new Date(),
      lastModified: new Date(),
      version: CURRENT_VERSION
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
    
    return savedCharacter;
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

  // Validar dados do personagem
  private static validateCharacterData(data: CharacterCreation, state: CharacterState): void {
    // Validar dados básicos
    if (!data.personalDetails?.name || data.personalDetails.name.trim() === '') {
      throw new Error('Nome do personagem é obrigatório');
    }

    // Validar atributos (se existirem)
    if (data.attributes && Object.keys(data.attributes).length > 0) {
      // Validar valores de atributos conforme as regras do livro
      for (const [attr, value] of Object.entries(data.attributes)) {
        if (typeof value !== 'number') {
          throw new Error(`Valor inválido para atributo ${attr}: deve ser um número`);
        }
        
        // Conforme o livro.md: -5 ou menos causa efeitos drásticos
        // Para criação de personagens, permitimos -1 até valores razoáveis
        if (value < -1) {
          throw new Error(`Valor muito baixo para atributo ${attr}: ${value} (mínimo -1 para personagens jogadores)`);
        }
        
        // Para criação inicial, valores acima de 5 são improváveis com o sistema de pontos
        // Mas permitimos valores maiores para personagens já criados/editados
        if (value > 15) {
          console.warn(`Valor muito alto para atributo ${attr}: ${value} - verifique se está correto`);
        }
      }
    }

    // Validar estado (apenas valores negativos são problemáticos)
    if (state.currentHP < 0 || state.currentMP < 0 || state.currentVigor < 0) {
      throw new Error('Valores de recursos não podem ser negativos');
    }
  }

  // Salvar no histórico de versões
  private static saveToVersionHistory(character: SavedCharacter, reason?: string): void {
    const config = this.getConfig();
    const historyKey = `${STORAGE_KEY}-history-${character.id}`;
    
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
    const historyKey = `${STORAGE_KEY}-history-${characterId}`;
    
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
        version: CURRENT_VERSION
      };
      
      localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
    } catch (error) {
      console.error('Erro ao criar backup:', error);
    }
  }

  // Restaurar backup
  static restoreBackup(): boolean {
    try {
      const backup = localStorage.getItem(BACKUP_KEY);
      if (!backup) return false;
      
      const backupData = JSON.parse(backup);
      if (!backupData.characters) return false;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(backupData.characters));
      return true;
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      return false;
    }
  }

  // Configuração do sistema
  static getConfig(): AutoSaveConfig {
    try {
      const stored = localStorage.getItem(CONFIG_KEY);
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
      
      localStorage.setItem(CONFIG_KEY, JSON.stringify(updatedConfig));
      
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
    for (const [characterId, timer] of Array.from(this.autoSaveTimers.entries())) {
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
        version: CURRENT_VERSION,
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
      const stored = localStorage.getItem(STORAGE_KEY);
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
      const historyKey = `${STORAGE_KEY}-history-${id}`;
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
      version: CURRENT_VERSION
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
      character.version = CURRENT_VERSION;
      
      const characters = this.getAllCharacters();
      characters.push(character);
      this.saveToStorage(characters);
      
      // Importar histórico se disponível
      if (history.length > 0) {
        const historyKey = `${STORAGE_KEY}-history-${newId}`;
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
      version: CURRENT_VERSION,
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
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(BACKUP_KEY);
      
      // Remover históricos de versões
      const characters = this.getAllCharacters();
      characters.forEach(char => {
        const historyKey = `${STORAGE_KEY}-history-${char.id}`;
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
      const backup = localStorage.getItem(BACKUP_KEY);
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      throw new Error('Falha ao salvar personagens');
    }
  }
} 