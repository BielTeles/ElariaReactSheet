// ===================================================================
// HOOK PERSONALIZADO - CÁLCULOS DE PERSONAGEM
// ===================================================================

import { useMemo } from 'react';
import { CharacterCreation } from '../types/character';
import { CharacterState } from '../types/interactive';
import {
  calculateFinalAttributes,
  calculateMaxHP,
  calculateMaxMP,
  calculateMaxVigor,
  calculateMovement,
  getKeyAttribute,
  calculateAttributeDice,
  validateAttributePointDistribution
} from '../utils/calculations';
import { ATTRIBUTE_LABELS } from '../constants';

/**
 * Interface para os resultados dos cálculos
 */
export interface CharacterCalculations {
  // Atributos
  finalAttributes: Record<string, number>;
  attributeModifiers: Record<string, {
    diceCount: number;
    advantage: boolean;
    disadvantage: boolean;
    label: string;
  }>;
  
  // Recursos
  maxHP: number;
  maxMP: number;
  maxVigor: number;
  movement: number;
  
  // Informações da classe
  keyAttribute: string | null;
  keyAttributeValue: number;
  
  // Validações
  attributeValidation: {
    isValid: boolean;
    pointsUsed: number;
    pointsAvailable: number;
  };
  
  // Utilitários
  getAttributeLabel: (attributeKey: string) => string;
  getAttributeDice: (attributeKey: string) => string;
}

/**
 * Hook personalizado para cálculos de personagem
 */
export function useCharacterCalculations(
  characterData: CharacterCreation,
  level: number = 1
): CharacterCalculations {
  
  // Memoizar atributos finais
  const finalAttributes = useMemo(() => {
    return calculateFinalAttributes(
      characterData.attributes || {},
      characterData.race,
      characterData.selectedAttributeBonus
    );
  }, [characterData.attributes, characterData.race, characterData.selectedAttributeBonus]);
  
  // Memoizar modificadores de atributos
  const attributeModifiers = useMemo(() => {
    const modifiers: Record<string, any> = {};
    
    Object.entries(finalAttributes).forEach(([key, value]) => {
      const diceInfo = calculateAttributeDice(value);
      modifiers[key] = {
        ...diceInfo,
        label: ATTRIBUTE_LABELS[key as keyof typeof ATTRIBUTE_LABELS] || key
      };
    });
    
    return modifiers;
  }, [finalAttributes]);
  
  // Memoizar recursos máximos
  const resources = useMemo(() => {
    const dataWithFinalAttributes = {
      ...characterData,
      finalAttributes
    };
    
    return {
      maxHP: calculateMaxHP(dataWithFinalAttributes, level),
      maxMP: calculateMaxMP(dataWithFinalAttributes, level),
      maxVigor: calculateMaxVigor(dataWithFinalAttributes),
      movement: calculateMovement(dataWithFinalAttributes)
    };
  }, [characterData, finalAttributes, level]);
  
  // Memoizar atributo chave
  const keyAttribute = useMemo(() => {
    return getKeyAttribute(characterData);
  }, [characterData.mainClass, characterData.subclass]);
  
  // Memoizar valor do atributo chave
  const keyAttributeValue = useMemo(() => {
    if (!keyAttribute) return 0;
    return finalAttributes[keyAttribute] || 0;
  }, [keyAttribute, finalAttributes]);
  
  // Memoizar validação de pontos de atributo
  const attributeValidation = useMemo(() => {
    return validateAttributePointDistribution(characterData.attributes || {});
  }, [characterData.attributes]);
  
  // Funções utilitárias
  const getAttributeLabel = useMemo(() => {
    return (attributeKey: string): string => {
      return ATTRIBUTE_LABELS[attributeKey as keyof typeof ATTRIBUTE_LABELS] || attributeKey;
    };
  }, []);
  
  const getAttributeDice = useMemo(() => {
    return (attributeKey: string): string => {
      const value = finalAttributes[attributeKey] || 0;
      const diceInfo = calculateAttributeDice(value);
      
      if (diceInfo.disadvantage) {
        return `${diceInfo.diceCount}d20 (menor)`;
      } else if (diceInfo.advantage) {
        return `${diceInfo.diceCount}d20 (maior)`;
      } else {
        return `${diceInfo.diceCount}d20`;
      }
    };
  }, [finalAttributes]);
  
  return {
    finalAttributes,
    attributeModifiers,
    ...resources,
    keyAttribute,
    keyAttributeValue,
    attributeValidation,
    getAttributeLabel,
    getAttributeDice
  };
}

/**
 * Hook para cálculos de estado do personagem
 */
export function useCharacterState(
  characterData: CharacterCreation,
  characterState: CharacterState
): {
  hpPercentage: number;
  mpPercentage: number;
  vigorPercentage: number;
  isUnconscious: boolean;
  isDying: boolean;
  isExhausted: boolean;
} {
  const { maxHP, maxMP, maxVigor } = useCharacterCalculations(characterData);
  
  return useMemo(() => {
    const hpPercentage = maxHP > 0 ? (characterState.currentHP / maxHP) * 100 : 0;
    const mpPercentage = maxMP > 0 ? (characterState.currentMP / maxMP) * 100 : 0;
    const vigorPercentage = maxVigor > 0 ? ((characterState.currentVigor || 0) / maxVigor) * 100 : 0;
    
    return {
      hpPercentage,
      mpPercentage,
      vigorPercentage,
      isUnconscious: characterState.currentHP <= 0,
      isDying: characterState.currentHP < 0,
      isExhausted: vigorPercentage <= 25
    };
  }, [characterState, maxHP, maxMP, maxVigor]);
}

/**
 * Hook para informações de progresso de criação
 */
export function useCharacterCreationProgress(
  characterData: CharacterCreation
): {
  completedSteps: number;
  totalSteps: number;
  progressPercentage: number;
  isComplete: boolean;
  missingSteps: string[];
} {
  return useMemo(() => {
    const steps = [
      { key: 'attributes', name: 'Atributos', isComplete: () => {
        const attrs = characterData.attributes || {};
        return Object.keys(attrs).length > 0 && 
               validateAttributePointDistribution(attrs).isValid;
      }},
      { key: 'race', name: 'Raça', isComplete: () => Boolean(characterData.race) },
      { key: 'class', name: 'Classe', isComplete: () => Boolean(characterData.mainClass) },
      { key: 'subclass', name: 'Subclasse', isComplete: () => Boolean(characterData.subclass) },
      { key: 'origin', name: 'Origem', isComplete: () => Boolean(characterData.origin) },
      { key: 'skills', name: 'Perícias', isComplete: () => {
        return Boolean(characterData.selectedClassSkills && 
                      characterData.selectedClassSkills.length > 0);
      }},
      { key: 'equipment', name: 'Equipamento', isComplete: () => {
        return typeof characterData.initialGold === 'number';
      }},
      { key: 'personal', name: 'Detalhes Pessoais', isComplete: () => {
        return Boolean(characterData.personalDetails?.name);
      }}
    ];
    
    const completedSteps = steps.filter(step => step.isComplete()).length;
    const totalSteps = steps.length;
    const progressPercentage = (completedSteps / totalSteps) * 100;
    const isComplete = completedSteps === totalSteps;
    const missingSteps = steps
      .filter(step => !step.isComplete())
      .map(step => step.name);
    
    return {
      completedSteps,
      totalSteps,
      progressPercentage,
      isComplete,
      missingSteps
    };
  }, [characterData]);
} 