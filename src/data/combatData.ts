import { 
  SuccessTable, 
  AttributeDiceConfiguration, 
  ConditionData, 
  ElementalAbility,
  Element 
} from '../types/combat';
import { Attributes } from '../types/character';

// Tabela de Sucessos baseada na Planilha de Sucessos de Elaria
export const SUCCESS_TABLE: SuccessTable[] = [
  { skillValue: -1, normal: 19, good: 20, extreme: 20 },
  { skillValue: 0, normal: 18, good: 20, extreme: 20 },
  { skillValue: 1, normal: 17, good: 19, extreme: 20 },
  { skillValue: 2, normal: 16, good: 18, extreme: 20 },
  { skillValue: 3, normal: 15, good: 17, extreme: 20 },
  { skillValue: 4, normal: 14, good: 16, extreme: 19 },
  { skillValue: 5, normal: 13, good: 15, extreme: 18 },
  { skillValue: 6, normal: 12, good: 14, extreme: 17 },
  { skillValue: 7, normal: 11, good: 13, extreme: 16 },
  { skillValue: 8, normal: 10, good: 12, extreme: 15 },
  { skillValue: 9, normal: 9, good: 11, extreme: 14 },
  { skillValue: 10, normal: 8, good: 10, extreme: 13 },
  { skillValue: 11, normal: 7, good: 9, extreme: 12 },
  { skillValue: 12, normal: 6, good: 8, extreme: 11 },
  { skillValue: 13, normal: 5, good: 7, extreme: 10 },
  { skillValue: 14, normal: 4, good: 6, extreme: 9 },
  { skillValue: 15, normal: 3, good: 5, extreme: 8 },
  { skillValue: 16, normal: 2, good: 4, extreme: 7 },
  { skillValue: 17, normal: 1, good: 3, extreme: 6 },
  { skillValue: 18, normal: 1, good: 2, extreme: 5 },
  { skillValue: 19, normal: 1, good: 1, extreme: 4 },
  { skillValue: 20, normal: 1, good: 1, extreme: 3 }
];

// Configuração de dados de vantagem/desvantagem baseada nos atributos
export const ATTRIBUTE_DICE_CONFIG: Record<number, AttributeDiceConfiguration> = {
  [-1]: { value: -1, diceCount: 2, advantage: false }, // Pega o menor
  [0]: { value: 0, diceCount: 1, advantage: true },    // Normal
  [1]: { value: 1, diceCount: 1, advantage: true },    // Normal
  [2]: { value: 2, diceCount: 2, advantage: true },    // Pega o maior
  [3]: { value: 3, diceCount: 2, advantage: true },    // Pega o maior
  [4]: { value: 4, diceCount: 3, advantage: true },    // Pega o maior
  [5]: { value: 5, diceCount: 3, advantage: true },    // Pega o maior
  [6]: { value: 6, diceCount: 4, advantage: true },    // Pega o maior
  [7]: { value: 7, diceCount: 4, advantage: true },    // Pega o maior
  [8]: { value: 8, diceCount: 5, advantage: true },    // Pega o maior
  [9]: { value: 9, diceCount: 5, advantage: true },    // Pega o maior
  [10]: { value: 10, diceCount: 6, advantage: true },  // Pega o maior
  [11]: { value: 11, diceCount: 6, advantage: true },  // Pega o maior
  [12]: { value: 12, diceCount: 7, advantage: true },  // Pega o maior
};

// Condições de Elaria com seus efeitos específicos
export const CONDITIONS_DATA: Record<string, ConditionData> = {
  'amedrontado': {
    id: 'amedrontado',
    name: 'Amedrontado',
    description: 'Sofre desvantagem em testes de ataque e perícia enquanto a fonte do medo estiver visível. Não pode se mover voluntariamente para perto da fonte do medo.',
    effects: {
      attackDisadvantage: true,
      skillDisadvantage: true
    }
  },
  'atordoado': {
    id: 'atordoado',
    name: 'Atordoado',
    description: 'Incapacitado, não pode realizar ações ou reações. Ataques contra a criatura têm vantagem.',
    effects: {
      attacksAgainstAdvantage: true,
      automaticFailures: ['ações', 'reações']
    }
  },
  'caido': {
    id: 'caido',
    name: 'Caído',
    description: 'Deslocamento é 0 (exceto rastejar). Ataques corpo a corpo contra a criatura têm vantagem; ataques à distância têm desvantagem. A criatura tem desvantagem em suas próprias jogadas de ataque.',
    effects: {
      movementZero: true,
      attackDisadvantage: true,
      attacksAgainstAdvantage: true // Apenas corpo a corpo
    }
  },
  'cego': {
    id: 'cego',
    name: 'Cego',
    description: 'Não pode ver. Falha automaticamente em testes que exigem visão. Ataques contra a criatura têm vantagem; ataques da criatura têm dupla desvantagem.',
    effects: {
      attacksAgainstAdvantage: true,
      doubleDisadvantage: true,
      automaticFailures: ['testes visuais']
    }
  },
  'contido': {
    id: 'contido',
    name: 'Contido',
    description: 'Deslocamento é 0. Ataques contra a criatura têm vantagem; ataques da criatura têm desvantagem. Sofre desvantagem em testes de Destreza.',
    effects: {
      movementZero: true,
      attackDisadvantage: true,
      attacksAgainstAdvantage: true,
      skillDisadvantage: true // Especificamente Destreza
    }
  },
  'envenenado': {
    id: 'envenenado',
    name: 'Envenenado',
    description: 'Sofre desvantagem em jogadas de ataque e testes de atributo.',
    effects: {
      attackDisadvantage: true,
      skillDisadvantage: true
    }
  },
  'inconsciente': {
    id: 'inconsciente',
    name: 'Inconsciente',
    description: 'Incapacitado, não pode se mover ou falar, não está ciente dos arredores. Larga o que estiver segurando. Ataques contra a criatura têm vantagem e são acertos críticos se o atacante estiver adjacente.',
    effects: {
      movementZero: true,
      attacksAgainstAdvantage: true,
      criticalHitsWhenAdjacent: true,
      automaticFailures: ['todas as ações']
    }
  },
  'invisivel': {
    id: 'invisivel',
    name: 'Invisível',
    description: 'Não pode ser visto sem ajuda de magia ou sentidos especiais. Ataques contra a criatura têm desvantagem; ataques da criatura têm vantagem.',
    effects: {
      attacksFromAdvantage: true,
      // Ataques contra têm desvantagem (implementar separadamente)
    }
  }
};

// Elementos de Elaria com suas características
export const ELEMENTS_DATA: Record<Element, { name: string; color: string; description: string }> = {
  'terra': {
    name: 'Terra',
    color: '#8B4513',
    description: 'Elemento da estabilidade, resistência e proteção. Ligado a Terrus.'
  },
  'agua': {
    name: 'Água',
    color: '#1E90FF',
    description: 'Elemento da fluidez, adaptação e cura. Ligado a Ondina.'
  },
  'ar': {
    name: 'Ar',
    color: '#87CEEB',
    description: 'Elemento da velocidade, movimento e liberdade. Ligado a Zephyrus.'
  },
  'fogo': {
    name: 'Fogo',
    color: '#FF4500',
    description: 'Elemento da paixão, destruição e energia. Ligado a Ignis.'
  },
  'luz': {
    name: 'Luz',
    color: '#FFD700',
    description: 'Elemento da verdade, clareza e purificação. Ligado a Lumina.'
  },
  'sombra': {
    name: 'Sombra',
    color: '#2F2F2F',
    description: 'Elemento do mistério, subterfúgio e intuição. Ligado a Noctus.'
  }
};

// Perícias de ataque com seus atributos base
export const ATTACK_SKILLS = {
  'corpo-a-corpo': {
    name: 'Corpo a Corpo',
    attribute: 'forca' as keyof Attributes,
    description: 'Ataques corpo a corpo com armas de Força'
  },
  'pontaria': {
    name: 'Pontaria',
    attribute: 'destreza' as keyof Attributes,
    description: 'Ataques à distância e corpo a corpo com armas de Destreza'
  },
  'elemental': {
    name: 'Elemental',
    attribute: 'sabedoria' as keyof Attributes, // Pode variar por classe
    description: 'Ataques mágicos elementais'
  }
};

// Perícias de reação defensiva
export const DEFENSE_SKILLS = {
  'bloqueio': {
    name: 'Bloqueio',
    attribute: 'constituicao' as keyof Attributes,
    description: 'Defesa ativa com escudo',
    requirements: ['escudo']
  },
  'esquiva': {
    name: 'Esquiva',
    attribute: 'destreza' as keyof Attributes,
    description: 'Defesa ativa evitando o ataque',
    requirements: ['sem armadura pesada']
  }
};

// Habilidades elementais básicas (exemplos)
export const BASIC_ELEMENTAL_ABILITIES: ElementalAbility[] = [
  {
    id: 'jato-agua',
    name: 'Jato d\'Água',
    element: 'agua',
    cost: 1,
    costType: 'mana',
    actionType: 'acao-padrao',
    range: '9 metros',
    target: '1 criatura',
    duration: 'Instantâneo',
    description: 'Projeta um jato d\'água pressurizado contra o alvo.',
    damage: '1d6',
    classRestriction: ['evocador']
  },
  {
    id: 'rajada-terra',
    name: 'Rajada de Terra',
    element: 'terra',
    cost: 1,
    costType: 'mana',
    actionType: 'acao-padrao',
    range: '6 metros',
    target: '1 criatura',
    duration: 'Instantâneo',
    description: 'Ergue pedras do solo para atacar o inimigo.',
    damage: '1d6',
    classRestriction: ['evocador']
  },
  {
    id: 'chama-menor',
    name: 'Chama Menor',
    element: 'fogo',
    cost: 1,
    costType: 'mana',
    actionType: 'acao-padrao',
    range: '12 metros',
    target: '1 criatura',
    duration: 'Instantâneo',
    description: 'Projeta uma pequena chama contra o alvo.',
    damage: '1d4',
    classRestriction: ['evocador']
  }
];

// Funções utilitárias
export function getSuccessGrade(diceResult: number, skillValue: number): 'fracasso-extremo' | 'fracasso-normal' | 'sucesso-normal' | 'sucesso-bom' | 'sucesso-extremo' {
  // 1 natural é sempre fracasso extremo
  if (diceResult === 1) return 'fracasso-extremo';
  
  // 20 natural é sempre sucesso extremo
  if (diceResult === 20) return 'sucesso-extremo';
  
  // Encontra os valores alvo na tabela
  const tableEntry = SUCCESS_TABLE.find(entry => entry.skillValue === skillValue) || 
                     SUCCESS_TABLE[SUCCESS_TABLE.length - 1]; // Usa o último valor se não encontrar
  
  if (diceResult >= tableEntry.extreme) return 'sucesso-extremo';
  if (diceResult >= tableEntry.good) return 'sucesso-bom';
  if (diceResult >= tableEntry.normal) return 'sucesso-normal';
  
  return 'fracasso-normal';
}

export function rollAttributeDice(attributeValue: number): { dice: number[], result: number } {
  const config = ATTRIBUTE_DICE_CONFIG[attributeValue] || ATTRIBUTE_DICE_CONFIG[1];
  const dice: number[] = [];
  
  for (let i = 0; i < config.diceCount; i++) {
    dice.push(Math.floor(Math.random() * 20) + 1);
  }
  
  const result = config.advantage 
    ? Math.max(...dice) 
    : Math.min(...dice);
  
  return { dice, result };
}

export function compareSuccessGrades(grade1: string, grade2: string): number {
  const gradeValues = {
    'fracasso-extremo': 0,
    'fracasso-normal': 1,
    'sucesso-normal': 2,
    'sucesso-bom': 3,
    'sucesso-extremo': 4
  };
  
  const value1 = gradeValues[grade1 as keyof typeof gradeValues] || 0;
  const value2 = gradeValues[grade2 as keyof typeof gradeValues] || 0;
  
  return value1 - value2;
} 