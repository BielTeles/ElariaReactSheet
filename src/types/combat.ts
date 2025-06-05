// Tipos específicos para o sistema de combate de Elaria

// Graus de sucesso baseados no sistema de Elaria
export type SuccessGrade = 'fracasso-extremo' | 'fracasso-normal' | 'sucesso-normal' | 'sucesso-bom' | 'sucesso-extremo';

// Elementos de Elaria
export type Element = 'terra' | 'agua' | 'ar' | 'fogo' | 'luz' | 'sombra';

// Tipos de perícias de ataque
export type AttackSkill = 'corpo-a-corpo' | 'pontaria' | 'elemental';

// Tipos de reação defensiva
export type DefenseReaction = 'bloqueio' | 'esquiva';

// Condições de Elaria
export type Condition = 
  | 'amedrontado'
  | 'atordoado'
  | 'caido'
  | 'cego'
  | 'contido'
  | 'envenenado'
  | 'inconsciente'
  | 'invisivel';

// Interface para dados de condição
export interface ConditionData {
  id: Condition;
  name: string;
  description: string;
  effects: {
    attackDisadvantage?: boolean;
    skillDisadvantage?: boolean;
    movementZero?: boolean;
    attacksAgainstAdvantage?: boolean;
    attacksFromAdvantage?: boolean;
    automaticFailures?: string[];
    criticalHitsWhenAdjacent?: boolean;
    doubleDisadvantage?: boolean;
  };
}

// Interface para um teste de ataque
export interface AttackRoll {
  attackerId: string;
  targetId: string;
  attribute: keyof import('./character').Attributes;
  skill: AttackSkill;
  skillValue: number;
  diceRolled: number[];
  bestDice: number;
  successGrade: SuccessGrade;
  isCritical: boolean;
  weapon?: {
    name: string;
    damage: string;
    type: string;
  };
}

// Interface para uma reação defensiva
export interface DefenseRoll {
  defenderId: string;
  reactionType: DefenseReaction;
  attribute: keyof import('./character').Attributes;
  skillValue: number;
  diceRolled: number[];
  bestDice: number;
  successGrade: SuccessGrade;
  hasShield?: boolean;
  isHeavyArmor?: boolean;
}

// Interface para resolução de combate
export interface CombatResolution {
  attack: AttackRoll;
  defense?: DefenseRoll;
  hit: boolean;
  damage?: {
    rolled: number[];
    total: number;
    type: string;
  };
  damageReduction: number;
  finalDamage: number;
  result: string;
}

// Interface para participante do combate
export interface CombatParticipant {
  id: string;
  name: string;
  type: 'player' | 'npc' | 'enemy';
  initiative: {
    diceRolled: number[];
    bestDice: number;
    successGrade: SuccessGrade;
    skillValue: number;
  };
  currentHP: number;
  maxHP: number;
  currentMP?: number;
  maxMP?: number;
  currentVigor?: number;
  maxVigor?: number;
  conditions: Condition[];
  damageReduction: number;
  position?: {
    x: number;
    y: number;
  };
}

// Interface para estado do combate
export interface CombatState {
  isActive: boolean;
  round: number;
  turn: number;
  participants: CombatParticipant[];
  turnOrder: string[]; // IDs ordenados por iniciativa
  currentParticipantId: string | null;
  actionLog: CombatAction[];
}

// Interface para ação de combate
export interface CombatAction {
  id: string;
  round: number;
  turn: number;
  participantId: string;
  actionType: 'attack' | 'defense' | 'move' | 'ability' | 'item' | 'other';
  description: string;
  timestamp: Date;
  resolution?: CombatResolution;
}

// Interface para habilidade elemental
export interface ElementalAbility {
  id: string;
  name: string;
  element: Element;
  cost: number;
  costType: 'mana' | 'vigor';
  actionType: 'acao-padrao' | 'acao-bonus' | 'reacao' | 'acao-livre';
  range: string;
  target: string;
  duration: string;
  description: string;
  damage?: string;
  effect?: string;
  savingThrow?: {
    attribute: keyof import('./character').Attributes;
    difficulty: string;
  };
  concentration?: boolean;
  classRestriction?: import('./character').MainClass[];
}

// Interface para dados da planilha de sucessos
export interface SuccessTable {
  skillValue: number;
  normal: number;
  good: number;
  extreme: number;
}

// Interface para configurações de dados de vantagem/desvantagem
export interface AttributeDiceConfiguration {
  value: number;
  diceCount: number;
  advantage: boolean; // true = pega maior, false = pega menor
} 