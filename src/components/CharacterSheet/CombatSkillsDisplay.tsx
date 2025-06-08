import React, { useState } from 'react';
import { Sword, Shield, Target, Zap, Eye, ChevronDown, ChevronUp } from 'lucide-react';

interface CombatSkillsDisplayProps {
  characterData: any;
  executeInlineRoll: (name: string, type: 'attribute' | 'skill' | 'damage' | 'initiative', attributeValue?: number, skillValue?: number, diceString?: string, event?: React.MouseEvent) => Promise<void>;
  getSuccessTargets: (skillValue: number) => { normal: number | null; good: number | null; extreme: number | null };
}

// Definição das perícias de combate
const combatSkills = {
  'Bloqueio': { 
    name: 'Bloqueio', 
    attribute: 'constituicao', 
    icon: Shield,
    description: 'Perícia de Reação para aparar ou bloquear ativamente ataques corpo a corpo ou à distância com escudo.',
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  'Esquiva': { 
    name: 'Esquiva', 
    attribute: 'destreza', 
    icon: Eye,
    description: 'Perícia de Reação para se esquivar ativamente de ataques através de movimento ágil.',
    color: 'text-green-600 bg-green-50 border-green-200'
  },
  'Corpo-a-Corpo': { 
    name: 'Corpo-a-Corpo', 
    attribute: 'forca', 
    icon: Sword,
    description: 'Realizar ataques corpo-a-corpo armado com armas de curta distância ou de mãos vazias.',
    color: 'text-red-600 bg-red-50 border-red-200'
  },
  'Elemental': { 
    name: 'Elemental', 
    attribute: 'sabedoria', 
    icon: Zap,
    description: 'Utilizado para realizar ataques de magia elemental.',
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  'Pontaria': { 
    name: 'Pontaria', 
    attribute: 'destreza', 
    icon: Target,
    description: 'Habilidade de mirar e acertar alvos com precisão com ataques à distância.',
    color: 'text-orange-600 bg-orange-50 border-orange-200'
  }
} as const;

const CombatSkillsDisplay: React.FC<CombatSkillsDisplayProps> = ({
  characterData,
  executeInlineRoll,
  getSuccessTargets
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getAttributeName = (attribute: string) => {
    const names: Record<string, string> = {
      'forca': 'Força',
      'destreza': 'Destreza',
      'constituicao': 'Constituição',
      'inteligencia': 'Inteligência',
      'sabedoria': 'Sabedoria',
      'carisma': 'Carisma'
    };
    return names[attribute] || attribute;
  };

  // Verificar se há perícias de combate configuradas
  const hasCombatSkills = characterData.finalCombatSkillValues && 
    Object.keys(characterData.finalCombatSkillValues).length > 0;

  if (!hasCombatSkills) {
    return null; // Não exibir se não houver perícias de combate
  }

  const combatSkillsData = Object.entries(combatSkills).map(([skillName, skillInfo]) => {
    const value = characterData.finalCombatSkillValues?.[skillName] || 0;
    const attributeValue = characterData.finalAttributes?.[skillInfo.attribute] || 0;
    
    return {
      ...skillInfo,
      skillName,
      value,
      attributeValue,
      isTrained: value > 0
    };
  }).filter(skill => skill.value > 0); // Só mostrar perícias com valor > 0

  if (combatSkillsData.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-red-500 to-pink-500 p-4 cursor-pointer hover:from-red-600 hover:to-pink-600 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sword className="w-5 h-5" />
            Perícias de Combate
          </h3>
          <div className="flex items-center gap-2">
            <div className="text-xs text-white bg-white bg-opacity-20 px-2 py-1 rounded">
              {combatSkillsData.length} ativas
            </div>
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5 text-white" />
            ) : (
              <ChevronUp className="w-5 h-5 text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="p-3">
          <div className="space-y-2">
            {combatSkillsData.map((skill) => {
              const IconComponent = skill.icon;
              
              return (
                <div 
                  key={skill.skillName}
                  className={`rounded-lg p-3 border-2 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-red-300 ${skill.color}`}
                  onClick={(e) => {
                    executeInlineRoll(`${skill.name}`, 'skill', skill.attributeValue, skill.value, undefined, e);
                  }}
                  title={`${skill.description}\n\nValor da Perícia: ${skill.value}\nAtributo ${getAttributeName(skill.attribute)}: ${skill.attributeValue >= 0 ? '+' : ''}${skill.attributeValue}\n\nClique para rolar`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{skill.name}</span>
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                            Combate
                          </span>
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          <strong>Atributo:</strong> {getAttributeName(skill.attribute)} ({skill.attributeValue >= 0 ? '+' : ''}{skill.attributeValue})
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xl font-bold">
                        {skill.value}
                      </div>
                      <div className="text-xs opacity-75">
                        Alvo: {getSuccessTargets(skill.value).normal ? `${getSuccessTargets(skill.value).normal}+` : 'Muito Difícil'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs mt-2 opacity-75">
                    {skill.description}
                  </div>
                  
                  <div className="text-xs mt-2 font-medium opacity-90">
                    🎲 Clique para rolar • Valor {skill.value} na Planilha de Sucessos
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>💡 Perícias de Combate:</strong> Estas perícias são usadas para ataques, defesas e manobras de combate. 
              Elas se integram com seus equipamentos e podem ser usadas em conjunto com armas e armaduras específicas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CombatSkillsDisplay; 