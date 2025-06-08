import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Minus, Sword, Shield, Target, Zap, Eye } from 'lucide-react';
import { CharacterCreation } from '../../../types/character';
import { equipment, EquipmentItem } from '../../../data/equipment';

interface CombatSkillsStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface CombatSkill {
  name: string;
  attribute: string;
  icon: React.ComponentType<any>;
  description: string;
  relatedEquipment: string[];
  weaponRange?: string;
  color: string;
  borderColor: string;
}

// Perícias de combate que serão gerenciadas neste step
const combatSkills: Record<string, CombatSkill> = {
  'Bloqueio': { 
    name: 'Bloqueio', 
    attribute: 'constituição', 
    icon: Shield,
    description: 'Perícia de Reação para aparar ou bloquear ativamente ataques corpo a corpo ou à distância com escudo.',
    relatedEquipment: ['shield'],
    color: 'text-blue-600 bg-blue-100',
    borderColor: 'border-blue-400'
  },
  'Esquiva': { 
    name: 'Esquiva', 
    attribute: 'destreza', 
    icon: Eye,
    description: 'Perícia de Reação para se esquivar ativamente de ataques através de movimento ágil. Não pode ser usada com armadura pesada.',
    relatedEquipment: [],
    color: 'text-green-600 bg-green-100',
    borderColor: 'border-green-400'
  },
  'Corpo-a-Corpo': { 
    name: 'Corpo-a-Corpo', 
    attribute: 'força/destreza', 
    icon: Sword,
    description: 'Realizar ataques corpo-a-corpo armado com armas de curta distância ou de mãos vazias.',
    relatedEquipment: ['weapon'],
    weaponRange: 'Corpo a Corpo',
    color: 'text-red-600 bg-red-100',
    borderColor: 'border-red-400'
  },
  'Elemental': { 
    name: 'Elemental', 
    attribute: 'inteligência/sabedoria', 
    icon: Zap,
    description: 'Utilizado para realizar ataques de magia elemental.',
    relatedEquipment: [],
    color: 'text-purple-600 bg-purple-100',
    borderColor: 'border-purple-400'
  },
  'Pontaria': { 
    name: 'Pontaria', 
    attribute: 'destreza', 
    icon: Target,
    description: 'Habilidade de mirar e acertar alvos com precisão com ataques à distância (arcos, bestas, armas de arremesso).',
    relatedEquipment: ['weapon'],
    weaponRange: 'Distância',
    color: 'text-orange-600 bg-orange-100',
    borderColor: 'border-orange-400'
  }
};

// Tabela de custos por valor de perícia (conforme o livro)
const getSkillPointCost = (currentValue: number, targetValue: number): number => {
  let totalCost = 0;
  for (let i = currentValue + 1; i <= targetValue; i++) {
    if (i <= 4) totalCost += 1;
    else if (i <= 9) totalCost += 3;
    else if (i <= 14) totalCost += 6;
    else if (i <= 19) totalCost += 9;
    else totalCost += 12;
  }
  return totalCost;
};

const CombatSkillsStep: React.FC<CombatSkillsStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  // Estado para valores das perícias de combate e pontos gastos
  const [combatSkillValues, setCombatSkillValues] = useState<Record<string, number>>(data.combatSkillValues || {});
  const [spentPoints, setSpentPoints] = useState<number>(0);
  const maxPoints = 8; // Pontos específicos para perícias de combate

  // Calcular número de fontes para cada perícia (baseado no sistema anterior)
  const getSkillSourceCount = (skillName: string): number => {
    let count = 0;
    
    // Verificar se vem de classe
    if (data.selectedClassSkills?.includes(skillName)) count++;
    
    // Verificar se vem de raça
    const raceSkills = getRaceSkills();
    if (raceSkills.includes(skillName)) count++;
    
    // Verificar se vem de origem
    const originSkills = getOriginSkills();
    if (originSkills.includes(skillName)) count++;
    
    // Verificar se vem de patrono
    const deitySkills = getDeitySkills();
    if (deitySkills.includes(skillName)) count++;
    
    // Verificar Kain específico
    if (data.race === 'kain' && data.selectedRaceSkills?.includes(skillName)) count++;
    
    return count;
  };

  // Funções auxiliares para obter perícias de diferentes fontes
  const getRaceSkills = (): string[] => {
    if (!data.race) return [];
    
    const skills: string[] = [];
    if (data.race === 'faelan') {
      // Faelan não tem perícias de combate automáticas
    } else if (data.race === 'celeres') {
      // Celeres não tem perícias de combate automáticas
    }
    // Adicionar outras raças conforme necessário
    return skills;
  };

  const getOriginSkills = (): string[] => {
    if (!data.origin) return [];
    
    const skills: string[] = [];
    // Origens não concedem perícias de combate diretamente
    // Elas foram movidas para perícias gerais (ex: Guerra)
    return skills;
  };

  const getDeitySkills = (): string[] => {
    if (!data.deity) return [];
    
    const skills: string[] = [];
    // Adicionar perícias de combate específicas de patronos se houver
    return skills;
  };

  // Calcular valor final de cada perícia de combate
  const getFinalSkillValue = useCallback((skillName: string): number => {
    const sourceCount = getSkillSourceCount(skillName);
    const baseValue = sourceCount; // Cada fonte adiciona +1
    const boughtValue = combatSkillValues[skillName] || 0;
    return baseValue + boughtValue;
  }, [combatSkillValues, data, getSkillSourceCount]);

  // Calcular pontos gastos
  useEffect(() => {
    let total = 0;
    Object.entries(combatSkillValues).forEach(([skillName, boughtValue]) => {
      if (boughtValue > 0) {
        const baseFromSources = getSkillSourceCount(skillName);
        const startValue = baseFromSources;
        total += getSkillPointCost(startValue, startValue + boughtValue);
      }
    });
    setSpentPoints(total);
  }, [combatSkillValues, data, getSkillSourceCount]);

  // Atualizar dados do personagem
  useEffect(() => {
    onUpdate({
      ...data,
      combatSkillValues: combatSkillValues,
      finalCombatSkillValues: Object.fromEntries(
        Object.keys(combatSkills).map(skill => [skill, getFinalSkillValue(skill)])
      )
    });
  }, [combatSkillValues, data, getFinalSkillValue, onUpdate]);

  const canIncreaseSkill = (skillName: string): boolean => {
    const currentFinalValue = getFinalSkillValue(skillName);
    const currentBoughtValue = combatSkillValues[skillName] || 0;
    const baseFromSources = getSkillSourceCount(skillName);
    
    if (currentFinalValue >= 20) return false; // Máximo de 20
    
    const costToIncrease = getSkillPointCost(baseFromSources + currentBoughtValue, baseFromSources + currentBoughtValue + 1);
    return spentPoints + costToIncrease <= maxPoints;
  };

  const canDecreaseSkill = (skillName: string): boolean => {
    return (combatSkillValues[skillName] || 0) > 0;
  };

  const increaseSkill = (skillName: string) => {
    if (!canIncreaseSkill(skillName)) return;
    
    const newBoughtValue = (combatSkillValues[skillName] || 0) + 1;
    setCombatSkillValues({
      ...combatSkillValues,
      [skillName]: newBoughtValue
    });
  };

  const decreaseSkill = (skillName: string) => {
    if (!canDecreaseSkill(skillName)) return;
    
    const currentBoughtValue = combatSkillValues[skillName] || 0;
    if (currentBoughtValue <= 1) {
      const { [skillName]: removed, ...rest } = combatSkillValues;
      setCombatSkillValues(rest);
    } else {
      setCombatSkillValues({
        ...combatSkillValues,
        [skillName]: currentBoughtValue - 1
      });
    }
  };

  // Obter equipamentos relacionados à perícia
  const getRelatedEquipment = (skillName: string): EquipmentItem[] => {
    const skill = combatSkills[skillName];
    if (!skill) return [];

    return Object.values(equipment).filter(item => {
      // Verificar se é arma relacionada
      if (skill.relatedEquipment.includes('weapon') && item.category === 'weapon') {
        if (skill.weaponRange) {
          return item.range === skill.weaponRange;
        }
        return true;
      }
      // Verificar se é escudo relacionado
      if (skill.relatedEquipment.includes('shield')) {
        return item.category === 'armor' && item.subcategory === 'shield';
      }
      return false;
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-3">Perícias de Combate & Equipamentos</h3>
        <p className="text-slate-600">
          Configure suas perícias de combate e veja como elas se relacionam com seus equipamentos
        </p>
      </div>

      {/* Informações sobre pontos */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-yellow-600 text-xl">⚔️</span>
          <div>
            <h5 className="font-semibold text-yellow-800 mb-2">Sistema de Perícias de Combate:</h5>
            <div className="text-yellow-700 text-sm space-y-1">
              <p>• <strong>8 Pontos Específicos:</strong> Para distribuir apenas em perícias de combate</p>
              <p>• <strong>Integração com Equipamentos:</strong> Veja quais armas usam cada perícia</p>
              <p>• <strong>Duplicatas Somam:</strong> Perícias de múltiplas fontes recebem bônus acumulativo</p>
              <p>• <strong>Custos:</strong> Valores 1-4: 1 ponto | Valores 5-9: 3 pontos | Valor 10+: 6 pontos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status de pontos */}
      <div className="text-center bg-white rounded-lg border border-gray-200 p-4">
        <p className="text-lg font-bold text-blue-600">
          {spentPoints} / {maxPoints} pontos gastos
        </p>
        <p className="text-sm text-slate-600">
          Pontos específicos para perícias de combate
        </p>
      </div>

      {/* Perícias de Combate */}
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(combatSkills).map(([skillName, skill]) => {
          const sourceCount = getSkillSourceCount(skillName);
          const boughtValue = combatSkillValues[skillName] || 0;
          const finalValue = getFinalSkillValue(skillName);
          const canIncrease = canIncreaseSkill(skillName);
          const canDecrease = canDecreaseSkill(skillName);
          const hasMultipleSources = sourceCount > 1;
          const relatedEquipment = getRelatedEquipment(skillName);
          
          const IconComponent = skill.icon;
          
          return (
            <div
              key={skillName}
              className={`bg-white rounded-lg border-2 p-6 ${
                hasMultipleSources 
                  ? skill.borderColor 
                  : sourceCount > 0 
                  ? 'border-green-300' 
                  : 'border-gray-200'
              }`}
            >
              {/* Cabeçalho da Perícia */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`flex-shrink-0 p-3 rounded-lg ${skill.color}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-bold text-slate-800">{skill.name}</h4>
                    {hasMultipleSources && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Múltiplas Fontes
                      </span>
                    )}
                    {sourceCount === 1 && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Treinada
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-slate-600">
                      Atributo: <span className="font-semibold">{skill.attribute}</span>
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      Valor: {finalValue}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3">{skill.description}</p>
                </div>
              </div>

              {/* Controles de Valor */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  {(() => {
                    if (sourceCount > 1) {
                      return `Base: ${sourceCount} (múltiplas fontes) + Comprados: ${boughtValue}`;
                    } else if (sourceCount === 1) {
                      return `Base: 1 + Comprados: ${boughtValue}`;
                    } else {
                      return `Comprados: ${boughtValue}`;
                    }
                  })()}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseSkill(skillName)}
                    disabled={!canDecrease}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      canDecrease
                        ? 'bg-red-100 hover:bg-red-200 text-red-600 cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => increaseSkill(skillName)}
                    disabled={!canIncrease}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      canIncrease
                        ? 'bg-blue-100 hover:bg-blue-200 text-blue-600 cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Equipamentos Relacionados */}
              {relatedEquipment.length > 0 && (
                <div className="border-t pt-4">
                  <h5 className="font-semibold text-slate-700 mb-2">
                    Equipamentos Relacionados:
                  </h5>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {relatedEquipment.slice(0, 4).map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500">{item.damage || item.description}</span>
                      </div>
                    ))}
                    {relatedEquipment.length > 4 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{relatedEquipment.length - 4} mais equipamentos...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navegação */}
      <div className="flex justify-between items-center pt-6">
        <button 
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Anterior
        </button>
        
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">
            Pontos gastos: {spentPoints}/{maxPoints}
          </div>
          <div className="text-sm text-green-600">
            Perícias de combate configuradas!
          </div>
        </div>
        
        <button 
          onClick={onNext}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default CombatSkillsStep; 