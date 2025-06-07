// ===================================================================
// UTILITÁRIOS DE CÁLCULO - ELARIA RPG
// ===================================================================

import { CharacterCreation } from '../types/character';
import { CharacterState } from '../types/interactive';
import { ATTRIBUTES, CHARACTER_LIMITS } from '../constants';
import { races } from '../data/races';
import { classes } from '../data/classes';

/**
 * Calcula quantos dados de vantagem/desvantagem um atributo fornece
 */
export function calculateAttributeDice(attributeValue: number): {
  diceCount: number;
  advantage: boolean;
  disadvantage: boolean;
} {
  if (attributeValue <= -1) {
    return { diceCount: 2, advantage: false, disadvantage: true };
  }
  
  if (attributeValue <= 1) {
    return { diceCount: 1, advantage: false, disadvantage: false };
  }
  
  // Para valores 2+, calcular número de dados de vantagem
  let diceCount = 2; // Começa com 2d20 para valor 2-3
  
  if (attributeValue >= 4) {
    diceCount = Math.min(7, Math.floor((attributeValue - 2) / 2) + 2);
  }
  
  return { diceCount, advantage: true, disadvantage: false };
}

/**
 * Calcula o custo total em pontos para um valor de atributo
 */
export function calculateAttributePointCost(targetValue: number): number {
  if (targetValue === -1) return -1;
  if (targetValue === 0) return 0;
  
  // Custo é a soma de 1+2+...+targetValue
  let cost = 0;
  for (let i = 1; i <= targetValue; i++) {
    cost += i;
  }
  
  return cost;
}

/**
 * Calcula quantos pontos foram gastos nos atributos atuais
 */
export function calculateTotalAttributePoints(attributes: Record<string, number>): number {
  let total = 0;
  
  for (const value of Object.values(attributes)) {
    total += calculateAttributePointCost(value);
  }
  
  return total;
}

/**
 * Calcula os atributos finais após aplicar bônus racial
 */
export function calculateFinalAttributes(
  baseAttributes: Record<string, number>,
  raceId?: string,
  selectedAttributeBonus?: string
): Record<string, number> {
  const finalAttributes = { ...baseAttributes };
  
  if (!raceId) return finalAttributes;
  
  const raceData = races[raceId];
  if (!raceData) return finalAttributes;
  
  // Aplicar bônus racial
  if (raceData.attributeBonus === 'escolha' && selectedAttributeBonus) {
    // Kain pode escolher qual atributo recebe bônus
    if (finalAttributes[selectedAttributeBonus] !== undefined) {
      finalAttributes[selectedAttributeBonus] += raceData.bonusValue;
    }
  } else if (raceData.attributeBonus !== 'escolha') {
    // Outras raças têm atributo fixo
    const attributeKey = raceData.attributeBonus as string;
    if (finalAttributes[attributeKey] !== undefined) {
      finalAttributes[attributeKey] += raceData.bonusValue;
    }
  }
  
  return finalAttributes;
}

/**
 * Calcula pontos de vida máximos
 */
export function calculateMaxHP(
  characterData: CharacterCreation,
  level: number = 1
): number {
  const constitution = characterData.finalAttributes?.constituicao || 
                     characterData.attributes?.constituicao || 0;
  
  if (!characterData.mainClass) return 0;
  
  const classData = classes[characterData.mainClass];
  if (!classData) return 0;
  
  let hp = 0;
  
  // PV base da raça (se for Roknar, tem bônus especial)
  if (characterData.race === 'roknar') {
    hp += 3; // Bônus de raça no 1º nível
  }
  
  // PV por nível da classe
  for (let i = 1; i <= level; i++) {
    if (i === 1) {
      // Primeiro nível: valor máximo do dado de vida
      hp += classData.hitDie;
    } else {
      // Níveis seguintes: valor fixo da classe
      hp += classData.hitPointsPerLevel;
    }
    
    // Bônus de Constituição por nível
    hp += Math.max(0, constitution);
    
    // Bônus racial adicional dos Roknar
    if (characterData.race === 'roknar' && i > 1) {
      hp += 1;
    }
  }
  
  return Math.max(1, hp); // Mínimo 1 PV
}

/**
 * Calcula pontos de mana máximos
 */
export function calculateMaxMP(
  characterData: CharacterCreation,
  level: number = 1
): number {
  if (!characterData.mainClass) return 0;
  
  const classData = classes[characterData.mainClass];
  if (!classData || classData.manaPointsBase === 0) return 0;
  
  let mp = classData.manaPointsBase;
  
  // MP por nível adicional
  if (level > 1) {
    mp += (level - 1) * classData.manaPointsPerLevel;
  }
  
  // Bônus racial dos Alari
  if (characterData.race === 'alari') {
    mp += level; // +1 PM por nível
  }
  
  return mp;
}

/**
 * Calcula pontos de vigor máximos (apenas Titãs)
 */
export function calculateMaxVigor(
  characterData: CharacterCreation
): number {
  if (!characterData.mainClass || characterData.mainClass !== 'titã') {
    return 0;
  }
  
  const constitution = characterData.finalAttributes?.constituicao || 
                     characterData.attributes?.constituicao || 0;
  
  // Vigor = 1 + Constituição
  return Math.max(1, 1 + constitution);
}

/**
 * Calcula deslocamento do personagem
 */
export function calculateMovement(characterData: CharacterCreation): number {
  if (!characterData.race) return 9; // Padrão
  
  const raceData = races[characterData.race];
  if (!raceData) return 9;
  
  let movement = raceData.baseMovement;
  
  // Bônus de divindade Zephyrus
  if (characterData.deity === 'zephyrus') {
    movement += 1.5;
  }
  
  return movement;
}

/**
 * Calcula valor final de uma perícia
 */
export function calculateSkillValue(
  baseValue: number,
  attributeValue: number,
  isTrained: boolean = false
): number {
  let total = baseValue;
  
  // Adicionar bônus de atributo se treinado
  if (isTrained) {
    total += Math.max(0, attributeValue);
  }
  
  return total;
}

/**
 * Calcula a redução de dano base (sem equipamentos)
 */
export function calculateBaseArmorClass(characterData: CharacterCreation): number {
  // Base 10 + Destreza para CA
  const dexterity = characterData.finalAttributes?.destreza || 
                   characterData.attributes?.destreza || 0;
  
  return 10 + Math.max(0, dexterity);
}

/**
 * Calcula ouro inicial do personagem
 */
export function rollInitialGold(): number {
  // 4d6 conforme as regras
  let total = 0;
  for (let i = 0; i < 4; i++) {
    total += Math.floor(Math.random() * 6) + 1;
  }
  return total;
}

/**
 * Calcula o atributo chave da classe/subclasse
 */
export function getKeyAttribute(
  characterData: CharacterCreation
): string | null {
  if (!characterData.mainClass) return null;
  
  const classData = classes[characterData.mainClass];
  if (!classData) return null;
  
  // Para Evocadores, o atributo pode variar por caminho elemental
  if (characterData.mainClass === 'evocador' && characterData.subclass) {
    // Caminhos que usam Inteligência: ar, fogo, sombra
    const intSubclasses = ['ar', 'fogo', 'sombra'];
    if (intSubclasses.includes(characterData.subclass)) {
      return ATTRIBUTES.INTELIGENCIA;
    }
    // Caminhos que usam Sabedoria: terra, agua, luz
    return ATTRIBUTES.SABEDORIA;
  }
  
  // Outras classes têm atributo padrão
  return classData.keyAttribute || null;
}

/**
 * Valida se a distribuição de pontos de atributo está correta
 */
export function validateAttributePointDistribution(
  attributes: Record<string, number>
): {
  isValid: boolean;
  pointsUsed: number;
  pointsAvailable: number;
} {
  const pointsUsed = calculateTotalAttributePoints(attributes);
  const pointsAvailable = CHARACTER_LIMITS.INITIAL_ATTRIBUTE_POINTS;
  
  // Verificar se tem penalidade opcional (-1 em um atributo = +1 ponto)
  const hasNegativeAttribute = Object.values(attributes).some(value => value === -1);
  const totalAvailable = hasNegativeAttribute ? 
    CHARACTER_LIMITS.BONUS_ATTRIBUTE_POINTS : 
    CHARACTER_LIMITS.INITIAL_ATTRIBUTE_POINTS;
  
  return {
    isValid: pointsUsed === totalAvailable,
    pointsUsed,
    pointsAvailable: totalAvailable
  };
}

/**
 * Calcula modificador de atributo para sistemas que usam +/-
 */
export function calculateAttributeModifier(attributeValue: number): number {
  // Em Elaria, o próprio valor do atributo é usado diretamente
  // Mas para compatibilidade, retorna o valor como modificador
  return attributeValue;
}

/**
 * Calcula nível baseado em experiência (para futuras expansões)
 */
export function calculateLevelFromXP(experience: number): number {
  // Implementação simples - pode ser expandida conforme regras de XP
  if (experience < 1000) return 1;
  if (experience < 3000) return 2;
  if (experience < 6000) return 3;
  if (experience < 10000) return 4;
  return Math.min(20, Math.floor(experience / 2000) + 1);
}

/**
 * Utilitário para ordenar atributos por valor
 */
export function sortAttributesByValue(
  attributes: Record<string, number>
): Array<{ name: string; value: number; label: string }> {
  return Object.entries(attributes)
    .map(([key, value]) => ({
      name: key,
      value,
      label: ATTRIBUTES[key as keyof typeof ATTRIBUTES] || key
    }))
    .sort((a, b) => b.value - a.value);
} 