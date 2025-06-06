import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  User, Heart, Zap, Shield, Sword, Star, ArrowLeft, 
  Edit3, Save, FileText, Package, Coins, Users,
  Calendar, Dice6, Eye, Brain, Target, Flame,
  Crown, Mountain, Feather, Sparkles, Sun,
  Plus, Minus, ChevronDown, ChevronUp,
  BookOpen, ShoppingCart
} from 'lucide-react';
import { races } from '../../data/races';
import { classes, subclassData } from '../../data/classes';
import { origins } from '../../data/origins';
import { deities } from '../../data/deities';
import { equipment, initialFreeEquipment } from '../../data/equipment';
import DiceRoller from '../DiceRoller/DiceRoller';
import NotesSystem from '../NotesSystem/NotesSystem';
import ShopSystem from '../ShopSystem/ShopSystem';
import { CombatManager } from '../CombatSystem';
import { DiceRoll, CharacterState, CharacterNote, Transaction, InventoryItem, ShopItem } from '../../types/interactive';
import { CharacterStorage, SavedCharacter } from '../../utils/characterStorage';
import { Character } from '../../types/character';

interface CharacterData {
  personalDetails?: {
    name?: string;
    appearance?: string;
    personality?: string;
    background?: string;
  };
  race?: string;
  mainClass?: string;
  subclass?: string;
  origin?: string;
  deity?: string;
  level?: number;
  finalAttributes?: Record<string, number>;
  hitPoints?: number;
  manaPoints?: number;
  vigorPoints?: number;
  keyAttribute?: string;
  selectedClassSkills?: string[];
  selectedRaceSkills?: string[];
  finalSkillValues?: Record<string, number>;
  selectedSubclassAbilities?: string[];
  selectedEquipment?: string[];
  initialGold?: number;
  remainingGold?: number;
  createdAt?: string;
}

const CharacterSheet: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessTable, setShowSuccessTable] = useState(false);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [showNotesSystem, setShowNotesSystem] = useState(false);
  const [showShopSystem, setShowShopSystem] = useState(false);
  const [showCombatSystem, setShowCombatSystem] = useState(false);
  
  // ID do personagem salvo (se aplicável)
  const characterId = location.state?.characterId;
  const [savedCharacter, setSavedCharacter] = useState<SavedCharacter | null>(null);
  
  // Estado interativo do personagem
  const [characterState, setCharacterState] = useState<CharacterState>({
    currentHP: 0,
    currentMP: 0,
    currentVigor: 0,
    tempHP: 0,
    conditions: [],
    rollHistory: [],
    notes: [],
    // Sistema financeiro
    currentMoney: 0,
    transactions: [],
    inventory: [],
    // Equipamentos equipados
    equippedWeapon: undefined,
    equippedArmor: undefined,
    equippedShield: undefined,
    equippedAccessories: []
  });
  
  const characterData: CharacterData = location.state?.characterData || savedCharacter?.data || {};
  const isNewCharacter = location.state?.isNewCharacter || false;

  // Estados para o sistema de rolagem integrado
  const [quickRollResult, setQuickRollResult] = useState<{
    show: boolean;
    roll: DiceRoll | null;
    position: { x: number; y: number };
  }>({
    show: false,
    roll: null,
    position: { x: 0, y: 0 }
  });

  // Estados para colapsar seções
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    identity: false,
    abilities: false,
    racialTraits: false,
    divineBlessing: false,
    equipment: false
  });

  // Função para alternar colapso de seção
  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Carregar personagem salvo se tiver ID
  useEffect(() => {
    if (characterId && !savedCharacter) {
      const loaded = CharacterStorage.loadCharacter(characterId);
      if (loaded) {
        setSavedCharacter(loaded);
        
        // Migração: converter selectedEquipment para inventário se necessário
        let migratedInventory = loaded.state.inventory || [];
        if (loaded.data.selectedEquipment && loaded.data.selectedEquipment.length > 0) {
          // Verificar quais equipamentos não estão no inventário
          const existingEquipmentIds = migratedInventory.map(item => item.equipmentId);
          const missingEquipments = loaded.data.selectedEquipment.filter(
            equipId => !existingEquipmentIds.includes(equipId)
          );
          
          // Adicionar equipamentos faltantes
          if (missingEquipments.length > 0) {
            const newInventoryItems: InventoryItem[] = missingEquipments.map(equipId => {
              const equipmentData = equipment[equipId];
              if (!equipmentData) return null;
              
              return {
                id: `migrated-${equipId}-${Date.now()}`,
                name: equipmentData.name,
                equipmentId: equipId,
                quantity: 1,
                purchaseDate: new Date(loaded.data.createdAt || new Date()),
                purchasePrice: equipmentData.price,
                source: 'starting' as const,
                isEquipped: false
              };
            }).filter(Boolean) as InventoryItem[];
            
            migratedInventory = [...migratedInventory, ...newInventoryItems];
          }
        }
        
        // Garantir que o estado carregado tenha todos os campos necessários
        // IMPORTANTE: Usar valores salvos exatos (incluindo 0), só usar fallback se undefined
        const stateWithDefaults = {
          currentHP: loaded.state.currentHP !== undefined ? loaded.state.currentHP : (loaded.data.hitPoints || 0),
          currentMP: loaded.state.currentMP !== undefined ? loaded.state.currentMP : (loaded.data.manaPoints || 0),
          currentVigor: loaded.state.currentVigor !== undefined ? loaded.state.currentVigor : (loaded.data.vigorPoints || 0),
          tempHP: loaded.state.tempHP || 0,
          conditions: loaded.state.conditions || [],
          rollHistory: loaded.state.rollHistory || [],
          notes: loaded.state.notes || [], // Garantir que notes existe
          currentMoney: loaded.state.currentMoney || 0,
          transactions: loaded.state.transactions || [],
          inventory: migratedInventory,
          equippedWeapon: loaded.state.equippedWeapon,
          equippedArmor: loaded.state.equippedArmor,
          equippedShield: loaded.state.equippedShield,
          equippedAccessories: loaded.state.equippedAccessories || []
        };
        setCharacterState(stateWithDefaults);
        
        // Salvar o estado migrado se houve mudanças no inventário
        if (migratedInventory.length !== (loaded.state.inventory || []).length) {
          setTimeout(() => {
            CharacterStorage.updateCharacterState(characterId, stateWithDefaults, 'Migração de equipamentos para inventário');
          }, 100);
        }
      }
    }
  }, [characterId, savedCharacter]);

  // Auto-save do estado a cada mudança
  useEffect(() => {
    if (characterId && savedCharacter && 
        (characterState.currentHP !== savedCharacter.state.currentHP ||
         characterState.currentMP !== savedCharacter.state.currentMP ||
         characterState.currentVigor !== savedCharacter.state.currentVigor ||
         characterState.rollHistory.length !== savedCharacter.state.rollHistory.length ||
         characterState.notes?.length !== savedCharacter.state.notes?.length)) {
      
      // Debounce para evitar muitas escritas, mas mais responsivo
      const timer = setTimeout(() => {
        CharacterStorage.updateCharacterState(characterId, characterState);
        // Atualizar o savedCharacter local para evitar loops
        setSavedCharacter(prev => prev ? { ...prev, state: characterState } : prev);
      }, 500); // Reduzido de 1000ms para 500ms
      
      return () => clearTimeout(timer);
    }
  }, [characterState, characterId, savedCharacter]);

  // Inicializar recursos APENAS para personagens novos (não salvos)
  useEffect(() => {
    if (!characterId && characterData.hitPoints && characterState.currentHP === 0) {
      // Apenas para personagens novos vindos do wizard
      setCharacterState(prev => ({
        ...prev,
        currentHP: characterData.hitPoints || 0,
        currentMP: characterData.manaPoints || 0,
        currentVigor: characterData.vigorPoints || 0,
        currentMoney: characterData.remainingGold || 0
      }));
    }
  }, [characterData, characterState.currentHP, characterId]);

  // Funções de gerenciamento de recursos
  const adjustResource = (type: 'hp' | 'mp' | 'vigor', amount: number) => {
    setCharacterState(prev => {
      const newState = { ...prev };
      const maxValues = {
        hp: characterData.hitPoints || 0,
        mp: characterData.manaPoints || 0,
        vigor: characterData.vigorPoints || 0
      };

      switch (type) {
        case 'hp':
          newState.currentHP = Math.max(0, Math.min(maxValues.hp, prev.currentHP + amount));
          break;
        case 'mp':
          newState.currentMP = Math.max(0, Math.min(maxValues.mp, prev.currentMP + amount));
          break;
        case 'vigor':
          newState.currentVigor = Math.max(0, Math.min(maxValues.vigor, prev.currentVigor + amount));
          break;
      }
      
      // Salvar imediatamente para mudanças manuais de recursos
      if (characterId) {
        setTimeout(() => {
          CharacterStorage.updateCharacterState(characterId, newState, `Ajuste manual de ${type.toUpperCase()}`);
        }, 100);
      }
      
      return newState;
    });
  };



  const addRollToHistory = (roll: DiceRoll) => {
    setCharacterState(prev => ({
      ...prev,
      rollHistory: [...prev.rollHistory, roll]
    }));
  };

  // Funções de gerenciamento de notas
  const addNote = (noteData: Omit<CharacterNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: CharacterNote = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCharacterState(prev => ({
      ...prev,
      notes: [...(prev.notes || []), newNote]
    }));
  };

  const updateNote = (noteId: string, updates: Partial<CharacterNote>) => {
    setCharacterState(prev => ({
      ...prev,
      notes: (prev.notes || []).map(note => 
        note.id === noteId 
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      )
    }));
  };

  const deleteNote = (noteId: string) => {
    setCharacterState(prev => ({
      ...prev,
      notes: (prev.notes || []).filter(note => note.id !== noteId)
    }));
  };

  // Funções de gerenciamento financeiro
  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'timestamp' | 'balanceBefore' | 'balanceAfter'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      timestamp: new Date(),
      balanceBefore: characterState.currentMoney,
      balanceAfter: characterState.currentMoney + (transactionData.type === 'income' ? transactionData.amount : -transactionData.amount)
    };
    
    setCharacterState(prev => ({
      ...prev,
      currentMoney: newTransaction.balanceAfter,
      transactions: [...(prev.transactions || []), newTransaction]
    }));
  };

  const adjustMoney = (amount: number, description: string, source: Transaction['source'] = 'manual') => {
    const type: 'income' | 'expense' = amount >= 0 ? 'income' : 'expense';
    addTransaction({
      type,
      amount: Math.abs(amount),
      source,
      description
    });
  };

  const handlePurchase = (item: ShopItem, quantity: number, finalPrice: number) => {
    // Verificar se tem dinheiro suficiente
    const totalCost = finalPrice * quantity;
    if (totalCost > characterState.currentMoney) {
      alert('Dinheiro insuficiente!');
      return;
    }

    // Criar transação de compra
    addTransaction({
      type: 'expense',
      amount: totalCost,
      source: 'purchase',
      description: `Compra: ${item.name} x${quantity}`,
      itemId: item.id
    });

    // Verificar se já existe o item no inventário
    const existingItem = characterState.inventory?.find(inv => inv.equipmentId === item.id);
    
    if (existingItem) {
      // Se já existe, atualizar quantidade
      setCharacterState(prev => ({
        ...prev,
        inventory: (prev.inventory || []).map(inv => 
          inv.equipmentId === item.id 
            ? { ...inv, quantity: inv.quantity + quantity }
            : inv
        )
      }));
    } else {
      // Se não existe, criar novo item
      const inventoryItem: InventoryItem = {
        id: `${Date.now()}`,
        name: item.name,
        equipmentId: item.id,
        quantity: quantity,
        purchaseDate: new Date(),
        purchasePrice: finalPrice,
        source: 'purchase',
        isEquipped: false
      };

      setCharacterState(prev => ({
        ...prev,
        inventory: [...(prev.inventory || []), inventoryItem]
      }));
    }
  };

  const handleSell = (inventoryItem: InventoryItem, sellPrice: number) => {
    // Criar transação de venda
    addTransaction({
      type: 'income',
      amount: sellPrice,
      source: 'sale',
      description: `Venda: ${inventoryItem.name}`,
      itemId: inventoryItem.equipmentId
    });

    // Independente da fonte (starting ou purchase), remover do inventory
    // Porque os equipamentos iniciais foram migrados para o inventory
    if (inventoryItem.quantity > 1) {
      setCharacterState(prev => ({
        ...prev,
        inventory: (prev.inventory || []).map(item => 
          item.id === inventoryItem.id 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      }));
    } else {
      // Remover do inventário se quantidade for 1
      setCharacterState(prev => ({
        ...prev,
        inventory: (prev.inventory || []).filter(item => item.id !== inventoryItem.id)
      }));
    }
  };

  // Função para executar rolagem integrada
  const executeInlineRoll = async (
    name: string,
    type: 'attribute' | 'skill' | 'damage' | 'initiative',
    attributeValue?: number,
    skillValue?: number,
    diceString?: string,
    event?: React.MouseEvent
  ) => {
    // Obter posição do clique
    const rect = event?.currentTarget.getBoundingClientRect();
    const position = rect ? { 
      x: rect.left + rect.width / 2, 
      y: rect.top 
    } : { x: 0, y: 0 };

    let diceResults: number[] = [];
    let finalResult: number = 0; // Inicializar com valor padrão
    let successLevel: DiceRoll['successLevel'] = null;
    let breakdown = '';

    try {
      if (type === 'damage' && diceString) {
        // Rolagem de dano (armas)
        const diceRoll = rollCustomDice(diceString);
        diceResults = diceRoll.results;
        finalResult = diceRoll.total;
        breakdown = diceRoll.breakdown;
      } else if (type === 'skill' || type === 'attribute' || type === 'initiative') {
        // Rolagem de perícia/atributo
        if (attributeValue === undefined) return;

        const diceCount = getDiceCount(attributeValue);
        const takeType = getTakeType(attributeValue);
        
        // Rolar dados
        for (let i = 0; i < diceCount; i++) {
          diceResults.push(Math.floor(Math.random() * 20) + 1);
        }

        // Determinar resultado
        if (takeType === 'highest') {
          finalResult = Math.max(...diceResults);
        } else if (takeType === 'lowest') {
          finalResult = Math.min(...diceResults);
        } else {
          finalResult = diceResults[0];
        }

        // Para perícias, iniciativa e atributos, consultar tabela de sucessos
        if ((type === 'skill' || type === 'initiative') && skillValue) {
          successLevel = determineSuccess(finalResult, skillValue);
        } else if (type === 'attribute' && attributeValue !== undefined) {
          // Para atributos, usar o próprio valor do atributo como valor de teste
          successLevel = determineSuccess(finalResult, attributeValue);
        }

        breakdown = `${diceResults.join(', ')} → ${takeType === 'highest' ? 'maior' : takeType === 'lowest' ? 'menor' : 'único'}: ${finalResult}`;
      }

      const newRoll: DiceRoll = {
        id: Date.now().toString(),
        timestamp: new Date(),
        type,
        name,
        attributeValue,
        skillValue,
        diceRolled: diceResults,
        finalResult,
        successLevel,
        rollPurpose: breakdown
      };

      // Mostrar resultado
      setQuickRollResult({
        show: true,
        roll: newRoll,
        position
      });

      // Adicionar ao histórico
      addRollToHistory(newRoll);

      // Auto-fechar após 4 segundos
      setTimeout(() => {
        setQuickRollResult(prev => ({ ...prev, show: false }));
      }, 4000);

    } catch (error) {
      console.error('Erro na rolagem:', error);
    }
  };

  // Funções auxiliares para rolagem (já existem, mas vou garantir que estão disponíveis)
  const getDiceCount = (attributeValue: number): number => {
    if (attributeValue <= -1) return 2;
    if (attributeValue <= 1) return 1;
    if (attributeValue <= 3) return 2;
    if (attributeValue <= 5) return 3;
    if (attributeValue <= 7) return 4;
    if (attributeValue <= 9) return 5;
    if (attributeValue <= 11) return 6;
    return 7;
  };

  const getTakeType = (attributeValue: number): 'lowest' | 'highest' | 'only' => {
    if (attributeValue <= -1) return 'lowest';
    if (attributeValue <= 1) return 'only';
    return 'highest';
  };

  const determineSuccess = (result: number, skillValue: number): DiceRoll['successLevel'] => {
    // Regras especiais para valores baixos
    if (skillValue <= -1) {
      // Valor -1 ou menos: apenas 20 natural resulta em sucesso extremo
      if (result === 20) return 'success-extreme';
      if (result === 1) return 'failure-extreme';
      return 'failure-normal';
    }
    
    if (skillValue === 0) {
      // Valor 0: apenas 20 natural resulta em sucesso extremo
      if (result === 20) return 'success-extreme';
      if (result === 1) return 'failure-extreme';
      return 'failure-normal';
    }

    // Regras normais para valores 1+
    if (result === 20) return 'success-extreme';
    if (result === 1) return 'failure-extreme';

    const targets = getSuccessTargets(skillValue);
    if (targets.extreme && result >= targets.extreme) return 'success-extreme';
    if (targets.good && result >= targets.good) return 'success-good';
    if (targets.normal && result >= targets.normal) return 'success-normal';
    
    return 'failure-normal';
  };

  const rollCustomDice = (diceString: string): { results: number[], total: number, breakdown: string } => {
    const match = diceString.match(/^(\d+)?d(\d+)([+-]\d+)?$/);
    if (!match) throw new Error('Formato inválido');
    
    const count = parseInt(match[1] || '1');
    const sides = parseInt(match[2]);
    const modifier = parseInt(match[3] || '0');
    
    const results: number[] = [];
    for (let i = 0; i < count; i++) {
      results.push(Math.floor(Math.random() * sides) + 1);
    }
    
    const sum = results.reduce((acc, val) => acc + val, 0);
    const total = sum + modifier;
    
    const breakdown = `${results.join(' + ')}${modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''}${modifier}` : ''} = ${total}`;
    
    return { results, total, breakdown };
  };

  // Mapear atributos para perícias relevantes
  const getAttributeForSkill = (skillName: string): string => {
    const skillToAttribute: Record<string, string> = {
      'Atletismo': 'forca',
      'Acrobacia': 'destreza',
      'Furtividade': 'destreza',
      'Ladinagem': 'destreza',
      'Pontaria': 'destreza',
      'Iniciativa': 'destreza',
      'Reflexos': 'destreza',
      'Cura': 'sabedoria',
      'Intuição': 'sabedoria',
      'Percepção': 'sabedoria',
      'Religião': 'sabedoria',
      'Sobrevivência': 'sabedoria',
      'Vontade': 'sabedoria',
      'Conhecimento': 'inteligencia',
      'Guerra': 'inteligencia',
      'Investigação': 'inteligencia',
      'Misticismo': 'inteligencia',
      'Adestramento': 'carisma',
      'Atuação': 'carisma',
      'Diplomacia': 'carisma',
      'Enganação': 'carisma',
      'Intimidação': 'carisma',
      'Jogatina': 'carisma',
      'Fortitude': 'constituicao'
    };
    
    return skillToAttribute[skillName] || 'forca';
  };

  // Função para determinar se uma habilidade é ativa (precisa de rolagem)
  const isActiveAbility = (abilityName: string): boolean => {
    const activeAbilities = [
      // Evocador - Habilidades que fazem rolagens
      'Combustão Controlada', 'Alimentar as Chamas', 'Marca Incinerante',
      'Forma Fluida', 'Projétil de Água', 'Pulso Restaurador',
      'Corrente Ascendente', 'Sopro Desestabilizador', 'Manto de Vento',
      'Postura Inabalável', 'Abraço da Terra', 'Moldar Abrigo',
      'Bálsamo de Luz', 'Luz Reveladora', 'Seta Luminosa',
      'Véu de Engano', 'Toque Debilitante', 'Passo Sombrio',
      
      // Titã - Habilidades ativas
      'Golpe Furioso', 'Grito de Guerra', 'Ignorar a Dor', 'Avanço Implacável',
      'Postura Defensiva', 'Proteger Aliado', 'Escudo Ecoante', 'Ancorar Posição',
      'Quebrar Escudo', 'Firmeza da Montanha', 'Impacto Arrasador', 'Rompante Poderoso',
      
      // Sentinela - Habilidades ativas
      'Marca do Caçador', 'Disparo Preciso', 'Armadilha Improvisada', 'Companheiro Animal',
      'Golpe Desorientador', 'Passo Fantasma', 'Ataque Furtivo', 'Visão Crepuscular',
      'Estudar Oponente', 'Antecipar Movimento', 'Ponto Fraco', 'Leitura Rápida',
      
      // Elo - Habilidades ativas
      'Palavra Calmante', 'Negociação Persuasiva', 'Elo Empático', 'Discurso Conciliador',
      'Comando de Batalha', 'Grito Motivador', 'Performance Revigorante', 'Elo Protetor',
      'Toque Restaurador Aprimorado', 'Vínculo Protetor', 'Palavras de Conforto', 'Detectar Dor'
    ];
    
    return activeAbilities.some(active => abilityName.includes(active));
  };

  // Função para obter descrição completa de habilidade - CORRIGIDA
  const getAbilityDescription = (abilityName: string, subclassId?: string): string => {
    // Descrições corrigidas baseadas no livro oficial
    const abilityDescriptions: Record<string, string> = {
      // Evocador - Terra
      'Postura Inabalável': 'Ação: Gaste 1 PM para ganhar Resistência a Dano 2 até o fim do turno e não poder ser movido à força.',
      'Abraço da Terra': 'Ação: Gaste 2 PM para fazer brotar terra ao redor de um inimigo (9m). Teste de Sabedoria vs Reflexos do alvo. Sucesso: alvo fica Imobilizado por 1 turno.',
      'Moldar Abrigo': 'Ritual (10 min): Gaste 3 PM para moldar terra/pedra, criando abrigo básico para até 4 pessoas por 8 horas.',
      
      // Evocador - Água
      'Forma Fluida': 'Ação Bônus: Gaste 1 PM para ignorar penalidades de terreno e oportunidades de ataque até fim do turno.',
      'Projétil de Água': 'Ação: Gaste 1 PM para disparar jato d\'água (18m). Ataque de Sabedoria, dano 1d6+SAB. Pode empurrar 1,5m.',
      'Pulso Restaurador': 'Ação: Gaste 2 PM para restaurar 1d4+SAB PV a você ou aliado tocado. +1d4 se alvo estiver ferido.',
      
      // Evocador - Ar
      'Corrente Ascendente': 'Ação Bônus: Gaste 1 PM para voar 6m neste turno sem provocar ataques de oportunidade.',
      'Sopro Desestabilizador': 'Ação: Gaste 1 PM para criar rajada (cone 4,5m). Teste INT vs Fortitude. Sucesso: empurra 3m.',
      'Manto de Vento': 'Ação: Gaste 2 PM para criar barreira de vento. +2 CA contra ataques à distância por 3 turnos.',
      
      // Evocador - Fogo (CORRIGIDAS)
      'Combustão Controlada': 'Ação: Gaste 2 PM (9m). Explosão de fogo em ponto visível (raio 1,5m). Criaturas fazem Teste Destreza (CD Normal) ou sofrem 1d6 dano de Fogo (metade se passarem).',
      'Alimentar as Chamas': 'Ação Bônus: Gaste 1 PM. Próximo ataque de Fogo neste turno causa +1d4 dano de Fogo.',
      'Marca Incinerante': 'Ação: Toque, gaste 1 PM. Teste Fortitude (CD Normal). Falha: próximo dano de Fogo em 2 turnos causa +1d4 extra.',
      
      // Evocador - Luz (CORRIGIDAS)
      'Bálsamo de Luz': 'Ação: Toque, gaste 2 PM. Alvo recupera 1d6+SAB PV e tem vantagem no próximo teste vs doenças/venenos.',
      'Luz Reveladora': 'Ação: Gaste 2 PM (9m). Área 1,5m revela invisíveis e dissipa Escuridão Mágica. Duração: Concentração.',
      'Seta Luminosa': 'Ação: Gaste 2 PM (18m). Ataque de magia SAB, dano 1d6+SAB radiante. Seres vulneráveis à luz têm desvantagem.',
      
      // Evocador - Sombra (CORRIGIDAS)
      'Véu de Engano': 'Ação: Gaste 2 PM. Por 1 hora, vantagem em Enganação para disfarces ou ilusões visuais/auditivas menores.',
      'Toque Debilitante': 'Ação: Toque, gaste 1 PM. Teste Constituição (CD Normal). Falha: 1d4 necrótico + desvantagem no próximo teste FOR/DES.',
      'Passo Sombrio': 'Ação Bônus: Gaste 2 PM. Teleporte 6m entre áreas de penumbra/escuridão.',
      
      // Titã - Baluarte (CORRIGIDAS)
      'Postura Defensiva': 'Ação Bônus: Gaste 1 V. Com escudo: +1 RD, vantagem vs movimento forçado. Inimigos adjacentes fazem Carisma (CD Bom) ou devem te atacar.',
      'Proteger Aliado': 'Reação: Gaste 1 V (+1 V). Aliado adjacente sendo atacado: teste Bloqueio vs ataque. Sucesso igual/maior: você vira o alvo.',
      'Escudo Ecoante': 'Reação: Gaste 1 V (+1 V). Após bloqueio bem-sucedido corpo a corpo: atacante sofre 1d4 dano sônico.',
      'Ancorar Posição': 'Ação Bônus: Gaste 1 V (+1 V). Movimento 0, mas inimigos gastam +1,5m para passar por você.',
      
      // Titã - Fúria Primal (CORRIGIDAS)
      'Golpe Furioso': 'Ação Bônus: Gaste 1 V (+1 V). Após acertar ataque: ataque extra com desvantagem no mesmo alvo.',
      'Grito de Guerra': 'Ação: Gaste 1 V. Inimigos 9m fazem Vontade (CD Normal) ou ficam Amedrontados por 1 rodada.',
      'Ignorar a Dor': 'Reação: Gaste 1 V. Quando sofrer dano (não fatal): reduza dano por sua Constituição (mín 1).',
      'Avanço Implacável': 'Ação Movimento: Gaste 1 V. Move até deslocamento total, atravessa inimigos, vantagem em quebrar objetos.',
      
      // Titã - Quebra-Montanhas (CORRIGIDAS)
      'Quebrar Escudo': 'Ação Ataque: Gaste 1 V. Ataque vs escudo inimigo (CD Bom FOR). Sucesso: destrói o escudo em vez de dano.',
      'Firmeza da Montanha': 'Ação Bônus: Gaste 2 V. RD 2 contra todos os danos até próximo turno, mas movimento 0.',
      'Impacto Arrasador': 'Ataque com arma pesada que acerte parede/objeto destrói área 1,5x1,5m.',
      'Rompante Poderoso': 'Carga de 6m+ com arma pesada causa +2d6 dano.',
      
      // Sentinela - Rastreador
      'Marca do Caçador': 'Ação: Gaste 1 PM para marcar inimigo visto. +2 dano contra ele por 24h.',
      'Disparo Preciso': 'Ação: Ataque à distância ignora cobertura parcial e tem +2 acerto.',
      'Armadilha Improvisada': 'Ação (1 min): Gaste 1 PM para preparar armadilha que causa 2d4 dano.',
      'Companheiro Animal': 'Ritual: Ganha animal companheiro leal (estatísticas definidas pelo Mestre).',
      
      // Sentinela - Lâmina do Crepúsculo
      'Golpe Desorientador': 'Ataque furtivo bem-sucedido deixa alvo Atordoado até fim do próximo turno.',
      'Passo Fantasma': 'Ação Bônus: Gaste 1 PM para se mover 4,5m sem provocar ataques oportunidade.',
      'Ataque Furtivo': 'Ataques com vantagem ou contra inimigos adjacentes a aliados causam +1d6 dano.',
      'Visão Crepuscular': 'Enxerga normalmente em penumbra e tem vantagem em Percepção na escuridão.',
      
      // Sentinela - Olho Vigilante
      'Estudar Oponente': 'Ação: Gaste 1 PM para analisar inimigo. Próximo ataque contra ele tem vantagem.',
      'Antecipar Movimento': 'Reação: Quando inimigo se mover (9m), você pode se mover 1,5m gratuitamente.',
      'Ponto Fraco': 'Após estudar oponente, seus ataques contra ele ignoram 1 ponto de RD.',
      'Leitura Rápida': 'Ação Bônus: Faça teste Investigação para identificar tipo, fraquezas ou habilidades de criatura.',
      
      // Elo - Voz da Harmonia
      'Palavra Calmante': 'Ação: Gaste 1 PM. Criatura hostil (18m) faz teste Vontade ou para de atacar por 1 turno.',
      'Negociação Persuasiva': 'Ação (1 min): Gaste 1 PM. Teste Diplomacia com vantagem para negociar.',
      'Elo Empático': 'Ação: Toque, gaste 1 PM para sentir emoções verdadeiras da criatura por 10 min.',
      'Discurso Conciliador': 'Ação (10 min): Gaste 2 PM para pacificar grupo hostil (teste Diplomacia).',
      
      // Elo - Porta-Voz da Chama
      'Comando de Batalha': 'Ação Bônus: Gaste 1 PM. Aliado (18m) pode fazer ataque extra como reação.',
      'Grito Motivador': 'Ação: Gaste 1 PM. Aliados (9m) ganham +2 no próximo teste de ataque.',
      'Performance Revigorante': 'Ação (1 min): Gaste 2 PM. Aliados recuperam 1d4 PV e removem Amedrontado.',
      'Elo Protetor': 'Ação: Gaste 2 PM para criar aura (3m). Aliados na aura ganham +1 CA por 10 min.',
      
      // Elo - Guardião do Coração
      'Toque Restaurador Aprimorado': 'Ação: Gaste 1 PM para curar 1d6+CAR PV e remover 1 condição.',
      'Vínculo Protetor': 'Ação: Gaste 2 PM para criar vínculo com aliado. Dano sofrido é dividido entre vocês.',
      'Palavras de Conforto': 'Ação Bônus: Gaste 1 PM. Aliado (9m) remove Amedrontado e ganha +2 Vontade.',
      'Detectar Dor': 'Ação: Concentração, detecta ferimentos e doenças em criaturas (30m) por 10 min.'
    };
    
    return abilityDescriptions[abilityName] || `Habilidade poderosa do caminho ${subclassId}. Consulte o Mestre para detalhes.`;
  };

  if (!characterData.personalDetails?.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-2xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Personagem não encontrado</h2>
          <p className="text-slate-600 mb-6">Não foi possível carregar os dados do personagem.</p>
          <button 
            onClick={() => navigate('/characters')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Voltar para Personagens
          </button>
        </div>
      </div>
    );
  }

  const raceData = characterData.race ? races[characterData.race] : null;
  const classData = characterData.mainClass ? classes[characterData.mainClass] : null;
  const originData = characterData.origin ? origins[characterData.origin] : null;
  const deityData = characterData.deity ? deities[characterData.deity] : null;

  const attributeNames: Record<string, string> = {
    forca: 'Força',
    destreza: 'Destreza',
    constituicao: 'Constituição',
    inteligencia: 'Inteligência',
    sabedoria: 'Sabedoria',
    carisma: 'Carisma'
  };

  const attributeEssences: Record<string, string> = {
    forca: 'Vontade Indomável',
    destreza: 'Fluxo Incessante', 
    constituicao: 'Resiliência Eterna',
    inteligencia: 'Olhar Penetrante',
    sabedoria: 'Sentir Profundo',
    carisma: 'Chama Interior'
  };

  // Sistema de dados de vantagem/desvantagem conforme o livro
  const getDiceInfo = (attributeValue: number) => {
    if (attributeValue <= -1) return { dice: '2d20', type: 'desvantagem', color: 'text-red-600', take: 'menor' };
    if (attributeValue <= 1) return { dice: '1d20', type: 'normal', color: 'text-gray-600', take: 'único' };
    if (attributeValue <= 3) return { dice: '2d20', type: 'vantagem', color: 'text-green-600', take: 'maior' };
    if (attributeValue <= 5) return { dice: '3d20', type: 'vantagem', color: 'text-green-600', take: 'maior' };
    if (attributeValue <= 7) return { dice: '4d20', type: 'vantagem', color: 'text-green-600', take: 'maior' };
    if (attributeValue <= 9) return { dice: '5d20', type: 'vantagem', color: 'text-green-600', take: 'maior' };
    if (attributeValue <= 11) return { dice: '6d20', type: 'vantagem', color: 'text-green-600', take: 'maior' };
    return { dice: '7d20', type: 'vantagem', color: 'text-green-600', take: 'maior' };
  };

  // Planilha de sucessos conforme o livro
  const getSuccessTargets = (skillValue: number) => {
    const successTable: Record<number, { normal: number | null, good: number | null, extreme: number | null }> = {
      '-1': { normal: null, good: null, extreme: null }, // Valor -1: Sempre fracasso (só 20 para extremo)
      0: { normal: null, good: null, extreme: 20 }, // Valor 0: Só sucesso extremo no 20
      1: { normal: 20, good: null, extreme: null },
      2: { normal: 19, good: 20, extreme: null },
      3: { normal: 18, good: 20, extreme: null },
      4: { normal: 17, good: 19, extreme: null },
      5: { normal: 16, good: 19, extreme: 20 },
      6: { normal: 15, good: 18, extreme: 20 },
      7: { normal: 14, good: 18, extreme: 20 },
      8: { normal: 13, good: 17, extreme: 20 },
      9: { normal: 12, good: 17, extreme: 20 },
      10: { normal: 11, good: 16, extreme: 19 },
      11: { normal: 10, good: 16, extreme: 19 },
      12: { normal: 9, good: 15, extreme: 19 },
      13: { normal: 8, good: 15, extreme: 19 },
      14: { normal: 7, good: 14, extreme: 18 },
      15: { normal: 6, good: 14, extreme: 18 },
      16: { normal: 5, good: 13, extreme: 18 },
      17: { normal: 4, good: 13, extreme: 18 },
      18: { normal: 3, good: 12, extreme: 17 },
      19: { normal: 2, good: 12, extreme: 17 },
      20: { normal: 2, good: 11, extreme: 16 }
    };

    // Tratar valores especiais
    if (skillValue <= -1) {
      return successTable['-1'];
    } else if (skillValue === 0) {
      return successTable[0];
    } else {
    return successTable[Math.min(skillValue, 20)] || successTable[20];
    }
  };

  const getTrainedSkills = () => {
    const skills: string[] = [];
    
    // Perícias da classe
    if (characterData.selectedClassSkills) {
      skills.push(...characterData.selectedClassSkills);
    }
    
    // Perícias da raça
    if (characterData.selectedRaceSkills) {
      skills.push(...characterData.selectedRaceSkills);
    }
    
    // Perícias fixas da raça
    if (raceData) {
      if (characterData.race === 'faelan') {
        skills.push('Furtividade', 'Percepção');
      } else if (characterData.race === 'celeres') {
        skills.push('Diplomacia', 'Intuição');
      }
    }
    
    // Perícias da origem
    if (originData) {
      skills.push(...originData.trainedSkills);
    }
    
    // Perícia da divindade
    if (deityData) {
      skills.push(deityData.trainedSkill);
    }
    
    return Array.from(new Set(skills)); // Remove duplicatas
  };

  const getClassIcon = (className?: string) => {
    switch (className) {
      case 'evocador': return <Sparkles className="w-5 h-5" />;
      case 'titã': return <Mountain className="w-5 h-5" />;
      case 'sentinela': return <Eye className="w-5 h-5" />;
      case 'elo': return <Heart className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getDeityIcon = (deity?: string) => {
    switch (deity) {
      case 'ignis': return '🔥';
      case 'ondina': return '🌊';
      case 'terrus': return '🌍';
      case 'zephyrus': return '💨';
      case 'lumina': return '☀️';
      case 'noctus': return '🌙';
      default: return '⚪';
    }
  };

  const getSubclassName = (subclassId?: string) => {
    if (!subclassId) return '';
    return subclassData[subclassId]?.name || subclassId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Header Épico - OTIMIZADO */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 shadow-2xl border-b border-slate-600">
        <div className="w-full px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Seção Principal do Personagem */}
            <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
              <button
                onClick={() => navigate('/characters')}
                className="flex-shrink-0 p-2 sm:p-3 hover:bg-slate-600 rounded-xl transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300 group-hover:text-white" />
              </button>
              
              {/* Avatar do Personagem */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-slate-600">
                  {getClassIcon(characterData.mainClass)}
                </div>
                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-white shadow-lg">
                  {characterData.level || 1}
                </div>
              </div>
              
              {/* Identidade Principal */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 truncate">
                    {characterData.personalDetails?.name}
                  </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-slate-300 mb-1 sm:mb-2">
                  <span className="flex items-center gap-1 sm:gap-2 bg-slate-700 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm">
                    <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">{raceData?.name}</span>
                    </span>
                  <span className="flex items-center gap-1 sm:gap-2 bg-slate-700 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm">
                      {getClassIcon(characterData.mainClass)}
                    <span className="font-medium">{classData?.name}</span>
                    </span>
                  <span className="flex items-center gap-1 sm:gap-2 bg-slate-700 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-medium">{getSubclassName(characterData.subclass)}</span>
                    </span>
                  </div>
                
                {/* Essências e Patrono */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                  {deityData && (
                    <span className="flex items-center gap-1 text-amber-300">
                      <span className="text-sm sm:text-lg">{getDeityIcon(characterData.deity)}</span>
                      <span>Protegido por {deityData.name}</span>
                    </span>
                  )}
                  {originData && (
                    <span className="text-slate-400">
                      {originData.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Controles */}
            <div className="flex flex-col gap-3 w-full lg:w-auto">
              {/* Linha 1: Status e Edição */}
              <div className="flex flex-wrap items-center gap-2 justify-end">
              {isNewCharacter && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-lg text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    <span>Novo Herói!</span>
                </div>
              )}
              
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 shadow-lg text-xs font-medium ${
                    isEditing 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700'
                  }`}
                >
                  {isEditing ? <Save className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
                  {isEditing ? 'Salvar' : 'Editar'}
                </button>
              </div>

              {/* Linha 2: Ferramentas de Jogo */}
              <div className="flex flex-wrap items-center gap-2 justify-end">
                {/* Grupo: Sistemas de Dados */}
                <div className="flex gap-1 bg-black/20 rounded-lg p-1">
              <button
                onClick={() => setShowSuccessTable(!showSuccessTable)}
                    className="flex items-center gap-1.5 px-2 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg text-xs font-medium"
                    title="Planilha de Sucessos"
              >
                    <Dice6 className="w-3 h-3" />
                    <span className="hidden sm:inline">Planilha</span>
              </button>

              <button
                onClick={() => setShowDiceRoller(true)}
                    className="flex items-center gap-1.5 px-2 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-md hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg text-xs font-medium"
                    title="Sistema de Rolagem"
              >
                    <Target className="w-3 h-3" />
                    <span className="hidden sm:inline">Rolagem</span>
              </button>
                </div>
              
                {/* Grupo: Gestão de Personagem */}
                <div className="flex gap-1 bg-black/20 rounded-lg p-1">
              <button
                    onClick={() => setShowNotesSystem(true)}
                    className="flex items-center gap-1.5 px-2 py-1.5 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-md hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 shadow-lg text-xs font-medium"
                    title="Notas do Personagem"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span className="hidden sm:inline">Notas</span>
                    {(characterState.notes || []).length > 0 && (
                      <span className="bg-white/20 rounded-full px-1.5 py-0.5 text-xs">
                        {(characterState.notes || []).length}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowShopSystem(true)}
                    className="flex items-center gap-1.5 px-2 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-md hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-lg text-xs font-medium"
                    title="Sistema de Comércio"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    <span className="hidden sm:inline">Loja</span>
              </button>
                </div>

                {/* Grupo: Combate */}
                <div className="flex gap-1 bg-black/20 rounded-lg p-1">
                  <button
                    onClick={() => setShowCombatSystem(true)}
                    className="flex items-center gap-1.5 px-2 py-1.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-md hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-lg text-xs font-medium"
                    title="Sistema de Combate"
                  >
                    <Sword className="w-3 h-3" />
                    <span className="hidden sm:inline">Combate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Planilha de Sucessos (Modal) */}
      {showSuccessTable && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <Dice6 className="w-6 h-6 text-purple-600" />
                  Planilha de Sucessos - Sistema de Elaria
                </h3>
                <button 
                  onClick={() => setShowSuccessTable(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Como Usar:</h4>
                <ol className="text-blue-700 text-sm space-y-1">
                  <li>1. <strong>Role os dados</strong> conforme seu atributo (vantagem/desvantagem)</li>
                  <li>2. <strong>Encontre o valor da perícia</strong> na tabela abaixo</li>
                  <li>3. <strong>Compare o resultado</strong> do d20 com os alvos para determinar o sucesso</li>
                  <li>4. <strong>20 natural</strong> = Sucesso Extremo | <strong>1 natural</strong> = Fracasso Extremo</li>
                </ol>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <tr>
                      <th className="p-3 text-left font-semibold">Valor da Perícia</th>
                      <th className="p-3 text-center font-semibold">Sucesso Normal</th>
                      <th className="p-3 text-center font-semibold">Sucesso Bom</th>
                      <th className="p-3 text-center font-semibold">Sucesso Extremo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((value) => {
                      const targets = getSuccessTargets(value);
                      return (
                        <tr key={value} className={value % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="p-3 font-bold text-slate-800">{value}</td>
                          <td className="p-3 text-center text-green-700 font-medium">
                            {targets.normal ? `${targets.normal}+` : '—'}
                          </td>
                          <td className="p-3 text-center text-blue-700 font-medium">
                            {targets.good ? `${targets.good}+` : '—'}
                          </td>
                          <td className="p-3 text-center text-purple-700 font-medium">
                            {targets.extreme ? `${targets.extreme}+` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="font-semibold text-green-800 mb-2">✅ Sucessos</h5>
                  <div className="text-green-700 text-sm space-y-1">
                    <p><strong>Extremo:</strong> Resultado excepcional</p>
                    <p><strong>Bom:</strong> Resultado acima da média</p>
                    <p><strong>Normal:</strong> Resultado satisfatório</p>
                  </div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h5 className="font-semibold text-red-800 mb-2">❌ Fracassos</h5>
                  <div className="text-red-700 text-sm space-y-1">
                    <p><strong>Normal:</strong> Falha comum</p>
                    <p><strong>Extremo:</strong> Falha catastrófica (1 natural)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="w-full py-4">
        <div className="grid xl:grid-cols-16 lg:grid-cols-12 md:grid-cols-8 gap-4 sm:gap-5 lg:gap-6 px-4">
          
          {/* Coluna 1: Combate e Atributos (4 colunas no XL, 3 no LG, 2 no MD) */}
          <div className="xl:col-span-4 lg:col-span-3 md:col-span-2 space-y-4">
            
            {/* Estatísticas de Combate */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Estatísticas de Combate
                </h3>
              </div>
              
              <div className="p-3 space-y-2">
                {/* Pontos de Vida */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-red-800 text-sm">Pontos de Vida</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold text-red-600">
                        {characterState.currentHP}/{characterData.hitPoints}
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => adjustResource('hp', -1)}
                          className="w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded text-xs flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => adjustResource('hp', 1)}
                          className="w-5 h-5 bg-green-500 hover:bg-green-600 text-white rounded text-xs flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-red-200 rounded-full h-1.5">
                      <div 
                        className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(0, (characterState.currentHP / (characterData.hitPoints || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Pontos de Mana */}
                {characterData.manaPoints && characterData.manaPoints > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-blue-800 text-sm">Pontos de Mana</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-blue-600">
                          {characterState.currentMP}/{characterData.manaPoints}
                        </div>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => adjustResource('mp', -1)}
                            className="w-5 h-5 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => adjustResource('mp', 1)}
                            className="w-5 h-5 bg-green-500 hover:bg-green-600 text-white rounded text-xs flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-blue-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(0, (characterState.currentMP / characterData.manaPoints) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pontos de Vigor */}
                {characterData.vigorPoints && characterData.vigorPoints > 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                          <Flame className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-orange-800 text-sm">Pontos de Vigor</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-bold text-orange-600">
                          {characterState.currentVigor}/{characterData.vigorPoints}
                        </div>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => adjustResource('vigor', -1)}
                            className="w-5 h-5 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => adjustResource('vigor', 1)}
                            className="w-5 h-5 bg-green-500 hover:bg-green-600 text-white rounded text-xs flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-orange-200 rounded-full h-1.5">
                        <div 
                          className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(0, (characterState.currentVigor / characterData.vigorPoints) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Atributos e Essências */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Atributos & Essências
                </h3>
              </div>
              
              <div className="p-3 sm:p-4">
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  {Object.entries(characterData.finalAttributes || {}).map(([key, value]) => {
                    const diceInfo = getDiceInfo(value);
                    
                    return (
                      <div 
                        key={key} 
                        className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-2 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-purple-300 hover:scale-[1.01] active:scale-[0.99]"
                        onClick={(e) => executeInlineRoll(`Teste de ${attributeNames[key]}`, 'attribute', value, undefined, undefined, e)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{attributeNames[key]}</div>
                            <div className="text-xs text-slate-500">{attributeEssences[key]}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-slate-800">{value}</div>
                            <div className={`text-xs ${diceInfo.color}`}>
                              {diceInfo.dice}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Perícias (4 colunas no XL, 3 no LG, 2 no MD) */}
          <div className="xl:col-span-4 lg:col-span-3 md:col-span-2 space-y-4">
            {/* Perícias */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Perícias & Testes
                </h3>
              </div>
              
              <div className="p-3">
                <div className="space-y-1.5 max-h-80 sm:max-h-96 overflow-y-auto">
                  {Object.entries(characterData.finalSkillValues || {})
                    .filter(([_, value]) => value > 0)
                    .sort((a, b) => b[1] - a[1])
                    .map(([skill, value]) => {
                      const isTrainedSkill = getTrainedSkills().includes(skill);
                      const targets = getSuccessTargets(value);
                      
                      return (
                        <div key={skill} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2 border border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-indigo-300"
                             onClick={(e) => {
                               const attributeKey = getAttributeForSkill(skill);
                               const attributeValue = characterData.finalAttributes?.[attributeKey] || 0;
                               executeInlineRoll(`Teste de ${skill}`, 'skill', attributeValue, value, undefined, e);
                             }}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800 text-xs">{skill}</span>
                              {isTrainedSkill && (
                                <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                                  ✓
                                </span>
                              )}
                            </div>
                            <div className="text-sm font-bold text-blue-600">{value}</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 3: Habilidades de Subclasse */}
          <div className="xl:col-span-4 lg:col-span-3 md:col-span-2 space-y-4">
            {characterData.selectedSubclassAbilities && characterData.selectedSubclassAbilities.length > 0 && (
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-red-500 to-pink-500 p-4 cursor-pointer hover:from-red-600 hover:to-pink-600 transition-colors"
                  onClick={() => toggleSection('abilities')}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sword className="w-5 h-5" />
                      Habilidades de Classe
                    </h3>
                    {collapsedSections.abilities ? (
                      <ChevronDown className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronUp className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>

                {!collapsedSections.abilities && (
                  <div className="p-3">
                    <div className="space-y-1.5 max-h-80 overflow-y-auto">
                      {/* Habilidade de Nível 1 se existir */}
                      {subclassData[characterData.subclass!]?.level1Ability && (
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-2 border border-indigo-200 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center justify-between mb-1">
                                                          <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-800 text-xs">Sintonia Inicial</span>
                              <span className="text-xs bg-indigo-500 text-white px-2 py-1 rounded-full">
                                Nv 1
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-indigo-700 leading-snug">
                            {subclassData[characterData.subclass!].level1Ability}
                          </div>
                        </div>
                      )}
                      
                      {/* Habilidades Selecionadas */}
                      {characterData.selectedSubclassAbilities.map((ability, index) => {
                        const isActive = isActiveAbility(ability);
                        const description = getAbilityDescription(ability, characterData.subclass);
                        
                        return (
                          <div 
                            key={index} 
                            className={`bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-2 border border-red-200 hover:shadow-md transition-all duration-200 ${
                              isActive ? 'cursor-pointer hover:border-red-300' : ''
                            }`}
                            onClick={isActive ? (e) => {
                              const rollType = ability.includes('Toque') || ability.includes('Ataque') ? 'skill' : 'attribute';
                              const attributeKey = characterData.keyAttribute || 'sabedoria';
                              const attributeValue = characterData.finalAttributes?.[attributeKey] || 0;
                              executeInlineRoll(`${ability}`, rollType, attributeValue, undefined, undefined, e);
                            } : undefined}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-800 text-xs">{ability}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  isActive ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                                }`}>
                                  {isActive ? '⚡' : '🛡️'}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-red-700 leading-snug">
                              {description}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Equipamentos */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 cursor-pointer hover:from-teal-600 hover:to-green-600 transition-colors"
                onClick={() => toggleSection('equipment')}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Equipamentos & Posses
                  </h3>
                  {collapsedSections.equipment ? (
                    <ChevronDown className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronUp className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>
              
              {!collapsedSections.equipment && (
                <div className="p-3">
                  <div className="space-y-1.5 max-h-80 overflow-y-auto">
                {/* Equipamento Básico */}
                    {initialFreeEquipment.map((item) => (
                      <div key={item.id} className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-2 border border-gray-200 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-1">
                                                      <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800 text-xs">{item.name}</span>
                            <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-full font-medium">
                              Básico
                            </span>
                      </div>
                  </div>
                        {item.description && (
                          <div className="text-xs text-slate-600 leading-snug">
                            {item.description}
                          </div>
                        )}
                      </div>
                    ))}

                {/* Equipamentos da Criação */}
                {characterData.selectedEquipment && characterData.selectedEquipment.length > 0 && (
                      <>
                      {characterData.selectedEquipment
                        .filter(equipId => {
                          // Não mostrar equipamento se já existe no inventário como 'starting'
                          return !characterState.inventory?.some(invItem => 
                            invItem.equipmentId === equipId && invItem.source === 'starting'
                          );
                        })
                        .map((equipId) => {
                        const item = equipment[equipId];
                        if (!item) return null;
                        
                          const getItemGradient = () => {
                          switch (item.category) {
                              case 'weapon': return 'from-red-50 to-pink-50';
                              case 'armor': return 'from-blue-50 to-indigo-50';
                              default: return 'from-green-50 to-emerald-50';
                            }
                          };
                          
                          const getItemBorder = () => {
                            switch (item.category) {
                              case 'weapon': return 'border-red-200';
                              case 'armor': return 'border-blue-200';
                              default: return 'border-green-200';
                            }
                          };
                          
                          const getCategoryBadge = () => {
                            switch (item.category) {
                              case 'weapon': return 'bg-red-500 text-white';
                              case 'armor': return 'bg-blue-500 text-white';
                              default: return 'bg-green-500 text-white';
                            }
                          };
                          
                          const isWeapon = item.category === 'weapon';
                        
                        return (
                            <div 
                              key={equipId} 
                              className={`bg-gradient-to-r ${getItemGradient()} rounded-lg p-2 border ${getItemBorder()} hover:shadow-md transition-all duration-200 ${
                                isWeapon ? 'cursor-pointer hover:border-red-300' : ''
                              }`}
                              onClick={isWeapon ? (e) => {
                                if (item.damage) {
                                  executeInlineRoll(`Dano: ${item.name}`, 'damage', undefined, undefined, item.damage, e);
                                }
                              } : undefined}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-slate-800 text-xs">{item.name}</span>
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryBadge()}`}>
                                    {item.category === 'weapon' ? '⚔️ Arma' : 
                                     item.category === 'armor' ? '🛡️ Armadura' : 
                                     '📦 Item'}
                                  </span>
                                  <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded-full font-medium">
                                    Inicial
                                  </span>
                          </div>
                                <div className="text-sm font-bold text-slate-600">
                                  {item.priceUnit === 'Ef' ? `${item.price} Ef` : `${item.price} EfP`}
                    </div>
                              </div>
                              
                              {item.description && (
                                <div className="text-xs text-slate-600 leading-snug mb-1">
                                  {item.description}
                                </div>
                              )}
                              
                              {isWeapon && item.damage && (
                                <div className="text-xs text-red-600 font-medium">
                                  🎲 {item.damage} ({item.damageType}) • Clique para rolar dano
                                </div>
                              )}
                              
                              {item.category === 'armor' && (
                                <div className="text-xs text-blue-600 font-medium">
                                  🛡️ Redução: {item.damageReduction} • {item.armorType}
                                  {item.attributePenalty && item.attributePenalty !== '0' && (
                                    <span className="text-orange-600"> • Penalidade: {item.attributePenalty}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </>
                    )}

                {/* Inventário da Loja */}
                {characterState.inventory && characterState.inventory.length > 0 && (
                  <>
                    {characterState.inventory.map((inventoryItem) => {
                      const item = equipment[inventoryItem.equipmentId];
                      if (!item) return null;
                      
                      const getItemGradient = () => {
                        switch (item.category) {
                          case 'weapon': return 'from-red-50 to-pink-50';
                          case 'armor': return 'from-blue-50 to-indigo-50';
                          default: return 'from-green-50 to-emerald-50';
                        }
                      };
                      
                      const getItemBorder = () => {
                        switch (item.category) {
                          case 'weapon': return 'border-red-200';
                          case 'armor': return 'border-blue-200';
                          default: return 'border-green-200';
                        }
                      };
                      
                      const getCategoryBadge = () => {
                        switch (item.category) {
                          case 'weapon': return 'bg-red-500 text-white';
                          case 'armor': return 'bg-blue-500 text-white';
                          default: return 'bg-green-500 text-white';
                        }
                      };
                      
                      const isWeapon = item.category === 'weapon';
                    
                      return (
                        <div 
                          key={inventoryItem.id} 
                          className={`bg-gradient-to-r ${getItemGradient()} rounded-lg p-2 border ${getItemBorder()} hover:shadow-md transition-all duration-200 ${
                            isWeapon ? 'cursor-pointer hover:border-red-300' : ''
                          }`}
                          onClick={isWeapon ? (e) => {
                            if (item.damage) {
                              executeInlineRoll(`Dano: ${item.name}`, 'damage', undefined, undefined, item.damage, e);
                            }
                          } : undefined}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800 text-xs">{item.name}</span>
                              {inventoryItem.quantity > 1 && (
                                <span className="text-xs bg-purple-500 text-white px-1.5 py-0.5 rounded-full font-medium">
                                  {inventoryItem.quantity}x
                                </span>
                              )}
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryBadge()}`}>
                                {item.category === 'weapon' ? '⚔️ Arma' : 
                                 item.category === 'armor' ? '🛡️ Armadura' : 
                                 '📦 Item'}
                              </span>
                              <span className="text-xs bg-amber-500 text-white px-2 py-1 rounded-full font-medium">
                                Comprado
                              </span>
                            </div>
                            <div className="text-sm font-bold text-slate-600">
                              {item.priceUnit === 'Ef' ? `${item.price} Ef` : `${item.price} EfP`}
                            </div>
                          </div>
                          
                          {item.description && (
                            <div className="text-xs text-slate-600 leading-snug mb-1">
                              {item.description}
                            </div>
                          )}
                          
                          {isWeapon && item.damage && (
                            <div className="text-xs text-red-600 font-medium">
                              🎲 {item.damage} ({item.damageType}) • Clique para rolar dano
                            </div>
                          )}
                          
                          {item.category === 'armor' && (
                            <div className="text-xs text-blue-600 font-medium">
                              🛡️ Redução: {item.damageReduction} • {item.armorType}
                              {item.attributePenalty && item.attributePenalty !== '0' && (
                                <span className="text-orange-600"> • Penalidade: {item.attributePenalty}</span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
                  </div>

                {/* Resumo Financeiro */}
                {characterData.remainingGold !== undefined && (
                    <div className="mt-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <Coins className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-yellow-800">Dinheiro Restante</div>
                        <div className="text-xs text-yellow-600">Elfens (Ef) disponíveis</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {characterData.remainingGold.toFixed(1)} Ef
                    </div>
                  </div>
                )}

                {/* Data de Criação */}
                {characterData.createdAt && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      Herói criado em {new Date(characterData.createdAt).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                )}
              </div>
              )}
            </div>
          </div>

          {/* Coluna 4: Aspectos Narrativos e RPG (4 colunas no XL, 3 no LG, 2 no MD) */}
          <div className="xl:col-span-4 lg:col-span-3 md:col-span-2 space-y-4">
            
            {/* Informações do Personagem - MELHORADA com Colapso */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-slate-600 to-gray-600 p-4 cursor-pointer hover:from-slate-700 hover:to-gray-700 transition-colors"
                onClick={() => toggleSection('identity')}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Identidade do Herói
                  </h3>
                  {collapsedSections.identity ? (
                    <ChevronDown className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronUp className="w-5 h-5 text-white" />
                  )}
        </div>
      </div>

              {!collapsedSections.identity && (
                <div className="p-4 space-y-4">
                  {/* Informações Básicas */}
                  <div className="grid grid-cols-1 gap-4">
                    {/* Linhagem e Origem */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-medium text-blue-600 mb-1 flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            LINHAGEM
                          </div>
                          <div className="font-bold text-blue-800">{raceData?.name}</div>
                          <div className="text-xs text-blue-600 mt-1">
                            Patrono: {raceData?.patron}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-indigo-600 mb-1 flex items-center gap-1">
                            <Mountain className="w-3 h-3" />
                            ORIGEM
                          </div>
                          <div className="font-bold text-indigo-800">{originData?.name || characterData.origin}</div>
                          <div className="text-xs text-indigo-600 mt-1">
                            {originData?.benefit.name}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chamado e Divindade */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-medium text-purple-600 mb-1 flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            CHAMADO
                          </div>
                          <div className="font-bold text-purple-800">{classData?.name}</div>
                          <div className="text-xs text-purple-600 mt-1">
                            {getSubclassName(characterData.subclass)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-pink-600 mb-1 flex items-center gap-1">
                            <Sun className="w-3 h-3" />
                            PATRONO DIVINO
                          </div>
                          <div className="font-bold text-pink-800 flex items-center gap-1">
                            <span>{getDeityIcon(characterData.deity)}</span>
                            {deityData?.name || 'Nenhum'}
                          </div>
                          {deityData && (
                            <div className="text-xs text-pink-600 mt-1">
                              {deityData.title}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Descrições Detalhadas */}
                  {characterData.personalDetails?.appearance && (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-emerald-800 mb-2">Aparência Física</div>
                          <div className="text-sm text-emerald-700 leading-relaxed">
                            {characterData.personalDetails.appearance}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {characterData.personalDetails?.personality && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Heart className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-amber-800 mb-2">Personalidade & Caráter</div>
                          <div className="text-sm text-amber-700 leading-relaxed">
                            {characterData.personalDetails.personality}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {characterData.personalDetails?.background && (
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-violet-800 mb-2">História & Antecedentes</div>
                          <div className="text-sm text-violet-700 leading-relaxed">
                            {characterData.personalDetails.background}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Origem Detalhada */}
                  {originData && (
                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-slate-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-slate-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mountain className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800 mb-2">Origem: {originData.name}</div>
                          <div className="text-sm text-slate-700 leading-relaxed mb-3">
                            {originData.description}
                          </div>
                          <div className="bg-slate-100 rounded-lg p-3">
                            <div className="text-xs font-semibold text-slate-600 mb-1">
                              💎 {originData.benefit.name}
                            </div>
                            <div className="text-xs text-slate-600">
                              {originData.benefit.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Traços Raciais - MELHORADOS */}
            {raceData && (
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 cursor-pointer hover:from-emerald-600 hover:to-teal-600 transition-colors"
                  onClick={() => toggleSection('racialTraits')}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Herança Racial - {raceData.name}
                    </h3>
                    {collapsedSections.racialTraits ? (
                      <ChevronDown className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronUp className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>
                
                {!collapsedSections.racialTraits && (
                  <div className="p-6 space-y-4">
                    {/* Descrição da Raça */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Crown className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-green-800 mb-2">Linhagem dos {raceData.name}</div>
                          <div className="text-sm text-green-700 leading-relaxed">
                            {raceData.description}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Traços Raciais */}
                    {raceData.traits.map((trait, index) => (
                      <div key={index} className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Feather className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-emerald-700 leading-relaxed">
                              <strong className="text-emerald-800">
                                {trait.split(':')[0]}:
                              </strong>
                              {trait.split(':')[1]}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Benefício do Patrono - MELHORADO */}
            {deityData && (
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 cursor-pointer hover:from-orange-600 hover:to-yellow-600 transition-colors"
                  onClick={() => toggleSection('divineBlessing')}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sun className="w-5 h-5" />
                      Bênção Divina
                    </h3>
                    {collapsedSections.divineBlessing ? (
                      <ChevronDown className="w-5 h-5 text-white" />
                    ) : (
                      <ChevronUp className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>
                
                {!collapsedSections.divineBlessing && (
                  <div className="p-6">
                    {/* Informações da Divindade */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="text-4xl flex-shrink-0">{getDeityIcon(characterData.deity)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-bold text-amber-800 text-lg">{deityData.name}</h5>
                            <span className="text-sm text-amber-600 italic">{deityData.title}</span>
                          </div>
                          <div className="text-sm text-amber-700 leading-relaxed mb-3">
                            {deityData.description}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs font-semibold text-amber-600 mb-1">Domínios:</div>
                              <div className="text-xs text-amber-700">
                                {deityData.domains.join(', ')}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-amber-600 mb-1">Essências:</div>
                              <div className="text-xs text-amber-700">
                                {deityData.essences.join(', ')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Benefício Divino */}
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border-2 border-yellow-300">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h5 className="font-bold text-yellow-800 mb-2 text-lg">
                            ✨ {deityData.benefit.name}
                          </h5>
                          <div className="text-sm text-yellow-700 leading-relaxed">
                            {deityData.benefit.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sistema de Rolagem Avançado */}
      <DiceRoller
        isOpen={showDiceRoller}
        onClose={() => setShowDiceRoller(false)}
        rollHistory={characterState.rollHistory}
        onAddRoll={addRollToHistory}
      />

      {/* Sistema de Notas */}
      {showNotesSystem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">
                    Notas de {characterData.personalDetails?.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowNotesSystem(false)}
                  className="text-white hover:text-gray-200 text-2xl font-bold p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="overflow-auto max-h-[calc(90vh-80px)]">
              <NotesSystem
                notes={characterState.notes || []}
                onAddNote={addNote}
                onUpdateNote={updateNote}
                onDeleteNote={deleteNote}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sistema de Comércio */}
      {showShopSystem && (
        <ShopSystem
          isOpen={showShopSystem}
          onClose={() => setShowShopSystem(false)}
          currentMoney={characterState.currentMoney}
          transactions={characterState.transactions}
          inventory={characterState.inventory}
          selectedEquipment={savedCharacter?.data.selectedEquipment || characterData.selectedEquipment || []}
          onPurchase={handlePurchase}
          onSell={handleSell}
          onAddTransaction={addTransaction}
          onAdjustMoney={adjustMoney}
        />
      )}

      {/* Sistema de Combate */}
      {showCombatSystem && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-red-500 to-rose-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sword className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">
                    Sistema de Combate - {characterData.personalDetails?.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowCombatSystem(false)}
                  className="text-white hover:text-gray-200 text-2xl font-bold p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="overflow-auto max-h-[calc(95vh-80px)]">
              <CombatManager
                characters={savedCharacter ? [{
                  id: savedCharacter.id,
                  name: savedCharacter.data.personalDetails?.name || 'Personagem Sem Nome',
                  age: 0,
                  height: '',
                  attributes: {
                    forca: savedCharacter.data.finalAttributes?.forca || 0,
                    destreza: savedCharacter.data.finalAttributes?.destreza || 0,
                    constituicao: savedCharacter.data.finalAttributes?.constituicao || 0,
                    inteligencia: savedCharacter.data.finalAttributes?.inteligencia || 0,
                    sabedoria: savedCharacter.data.finalAttributes?.sabedoria || 0,
                    carisma: savedCharacter.data.finalAttributes?.carisma || 0
                  },
                  race: (savedCharacter.data.race as any) || 'kain',
                  mainClass: (savedCharacter.data.mainClass as any) || 'titã',
                  subclass: (savedCharacter.data.subclass as any) || 'baluarte',
                  origin: (savedCharacter.data.origin as any) || 'sobrevivente-brasas',
                  deity: (savedCharacter.data.deity as any) || null,
                  level: savedCharacter.data.level || 1,
                  hitPoints: {
                    current: characterState.currentHP,
                    maximum: savedCharacter.data.hitPoints || 0
                  },
                  manaPoints: {
                    current: characterState.currentMP,
                    maximum: savedCharacter.data.manaPoints || 0
                  },
                  vigor: savedCharacter.data.vigorPoints ? {
                    current: characterState.currentVigor,
                    maximum: savedCharacter.data.vigorPoints
                  } : undefined,
                  skills: savedCharacter.data.finalSkillValues || {},
                  abilities: savedCharacter.data.selectedSubclassAbilities || [],
                  equipment: [],
                  gold: characterState.currentMoney,
                  createdAt: new Date(savedCharacter.data.createdAt || new Date()),
                  updatedAt: new Date()
                }] : []}
                onClose={() => setShowCombatSystem(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Resultado de Rolagem Rápida */}
      {quickRollResult.show && quickRollResult.roll && (
        <div 
          className="fixed z-50 bg-white rounded-xl shadow-2xl border-2 border-indigo-300 p-4 transform transition-all duration-300 animate-bounce"
          style={{
            left: `${quickRollResult.position.x - 150}px`,
            top: `${quickRollResult.position.y - 100}px`,
            minWidth: '300px'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-slate-800 text-sm">{quickRollResult.roll.name}</h4>
            <button 
              onClick={() => setQuickRollResult(prev => ({ ...prev, show: false }))}
              className="text-gray-400 hover:text-gray-600 text-lg font-bold"
            >
              ×
            </button>
          </div>

          {/* Dados Rolados */}
          {quickRollResult.roll.diceRolled.length > 0 && (
            <div className="mb-3">
              <div className="flex gap-1 flex-wrap">
                {quickRollResult.roll.diceRolled.map((die, index) => (
                  <span 
                    key={index}
                    className={`text-xs px-2 py-1 rounded border font-bold ${
                      (quickRollResult.roll!.type === 'skill' || quickRollResult.roll!.type === 'attribute') &&
                      ((quickRollResult.roll!.attributeValue! <= -1 && die === Math.min(...quickRollResult.roll!.diceRolled)) ||
                       (quickRollResult.roll!.attributeValue! > 1 && die === Math.max(...quickRollResult.roll!.diceRolled)) ||
                       (quickRollResult.roll!.attributeValue! <= 1 && quickRollResult.roll!.attributeValue! > -1))
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-800' : 'bg-gray-100 border-gray-300 text-gray-600'
                    }`}
                  >
                    {die}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Breakdown */}
          {quickRollResult.roll.rollPurpose && (
            <div className="mb-3 text-xs text-gray-600 bg-gray-50 p-2 rounded">
              {quickRollResult.roll.rollPurpose}
            </div>
          )}

          {/* Resultado Final */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-slate-800">{quickRollResult.roll.finalResult}</span>
            {quickRollResult.roll.successLevel && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                quickRollResult.roll.successLevel === 'success-extreme' ? 'bg-purple-100 text-purple-600' :
                quickRollResult.roll.successLevel === 'success-good' ? 'bg-blue-100 text-blue-600' :
                quickRollResult.roll.successLevel === 'success-normal' ? 'bg-green-100 text-green-600' :
                quickRollResult.roll.successLevel === 'failure-normal' ? 'bg-orange-100 text-orange-600' :
                'bg-red-100 text-red-600'
              }`}>
                {quickRollResult.roll.successLevel === 'success-extreme' ? 'Sucesso Extremo!' :
                 quickRollResult.roll.successLevel === 'success-good' ? 'Sucesso Bom' :
                 quickRollResult.roll.successLevel === 'success-normal' ? 'Sucesso Normal' :
                 quickRollResult.roll.successLevel === 'failure-normal' ? 'Fracasso Normal' :
                 'Fracasso Extremo!'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterSheet; 