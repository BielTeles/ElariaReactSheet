import React, { useState, useEffect, useCallback } from 'react';
import { CharacterCreation } from '../../../types/character';
import { classes } from '../../../data/classes';
import { races } from '../../../data/races';
import { origins } from '../../../data/origins';
import { deities } from '../../../data/deities';
import { User, Brain, Zap, Shield, Clock, Eye, Minus, Plus } from 'lucide-react';

interface SkillsStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Lista completa de perícias conforme o livro
const allSkills: Record<string, { name: string; attribute: string; description: string; category: string }> = {
  'Acrobatismo': { 
    name: 'Acrobatismo', 
    attribute: 'destreza', 
    description: 'Equilibrar-se em superfícies estreitas, realizar saltos e piruetas, cair com segurança, escapar de agarrões.',
    category: 'física'
  },
  'Adestramento': { 
    name: 'Adestramento', 
    attribute: 'carisma', 
    description: 'Ensinar truques a animais, acalmar bestas, usar montarias em situações difíceis.',
    category: 'social'
  },
  'Atletismo': { 
    name: 'Atletismo', 
    attribute: 'força', 
    description: 'Escalar, nadar, saltar longas distâncias, arrombar portas, e outros feitos de força física bruta.',
    category: 'física'
  },
  'Atuação': { 
    name: 'Atuação', 
    attribute: 'carisma', 
    description: 'Entreter uma audiência com música, dança, oratória, teatro, etc. Também usada para disfarces convincentes.',
    category: 'social'
  },
  'Bloqueio': { 
    name: 'Bloqueio', 
    attribute: 'constituição', 
    description: 'Perícia de Reação para aparar ou bloquear ativamente ataques corpo a corpo ou à distância com escudo.',
    category: 'reação'
  },
  'Cavalgar': { 
    name: 'Cavalgar', 
    attribute: 'destreza', 
    description: 'Montar e guiar uma montaria em velocidade ou combate, realizar manobras equestres.',
    category: 'física'
  },
  'Conhecimento': { 
    name: 'Conhecimento', 
    attribute: 'inteligência', 
    description: 'Saber geral e específico sobre o mundo. Escolha uma especialização (Arcano, História, Natureza, Religião, etc.)',
    category: 'mental'
  },
  'Corpo-a-Corpo': { 
    name: 'Corpo-a-Corpo', 
    attribute: 'força/destreza', 
    description: 'Realizar ataques corpo-a-corpo armado com armas de curta distância ou de mãos vazias.',
    category: 'combate'
  },
  'Cura': { 
    name: 'Cura', 
    attribute: 'sabedoria', 
    description: 'Realizar primeiros socorros, tratar ferimentos, diagnosticar doenças ou venenos, estabilizar moribundos.',
    category: 'útil'
  },
  'Diplomacia': { 
    name: 'Diplomacia', 
    attribute: 'carisma', 
    description: 'Interagir socialmente de forma positiva, negociar, persuadir, fazer amigos e influenciar pessoas com boa vontade.',
    category: 'social'
  },
  'Elemental': { 
    name: 'Elemental', 
    attribute: 'inteligência/sabedoria', 
    description: 'Utilizado para realizar ataques de magia elemental.',
    category: 'mágica'
  },
  'Enganação': { 
    name: 'Enganação', 
    attribute: 'carisma', 
    description: 'Mentir convincentemente, blefar, disfarçar intenções ou aparência (complementa Atuação para disfarces).',
    category: 'social'
  },
  'Esquiva': { 
    name: 'Esquiva', 
    attribute: 'destreza', 
    description: 'Perícia de Reação para se esquivar ativamente de ataques através de movimento ágil. Não pode ser usada com armadura pesada.',
    category: 'reação'
  },
  'Fortitude': { 
    name: 'Fortitude', 
    attribute: 'constituição', 
    description: 'Resistência física para suportar danos contínuos, doenças, venenos, fadiga e condições ambientais extremas.',
    category: 'resistência'
  },
  'Furtividade': { 
    name: 'Furtividade', 
    attribute: 'destreza', 
    description: 'Mover-se em silêncio, esconder-se nas sombras, evitar ser detectado.',
    category: 'física'
  },
  'Guerra': { 
    name: 'Guerra', 
    attribute: 'inteligência', 
    description: 'Conhecimento sobre táticas militares, estratégia, história de batalhas, armas e armaduras, fortificações.',
    category: 'mental'
  },
  'Iniciativa': { 
    name: 'Iniciativa', 
    attribute: 'destreza', 
    description: 'Rapidez de reação no início de combates e outras situações que exigem ação imediata.',
    category: 'combate'
  },
  'Intimidação': { 
    name: 'Intimidação', 
    attribute: 'carisma', 
    description: 'Coagir, ameaçar ou assustar outros para obter informações ou obediência através do medo ou da força de presença.',
    category: 'social'
  },
  'Intuição': { 
    name: 'Intuição', 
    attribute: 'sabedoria', 
    description: 'Perceber as intenções, emoções e motivações ocultas de outras criaturas, sentir quando algo está errado, detectar mentiras.',
    category: 'mental'
  },
  'Investigação': { 
    name: 'Investigação', 
    attribute: 'inteligência', 
    description: 'Procurar pistas, analisar cenas de crime ou locais de interesse, deduzir informações a partir de evidências, decifrar códigos.',
    category: 'mental'
  },
  'Jogatina': { 
    name: 'Jogatina', 
    attribute: 'carisma', 
    description: 'Jogar e entender jogos de azar, cartas ou dados. Inclui a habilidade de trapacear sutilmente ou perceber trapaças.',
    category: 'social'
  },
  'Ladinagem': { 
    name: 'Ladinagem', 
    attribute: 'destreza', 
    description: 'Abrir fechaduras, desarmar armadilhas, realizar pequenos furtos (bater carteira), e outras tarefas que exigem mãos ágeis e discretas.',
    category: 'física'
  },
  'Misticismo': { 
    name: 'Misticismo', 
    attribute: 'inteligência', 
    description: 'Conhecimento sobre magia, tradições arcanas, planos de existência, criaturas mágicas e itens encantados.',
    category: 'mágica'
  },
  'Nobreza': { 
    name: 'Nobreza', 
    attribute: 'inteligência', 
    description: 'Conhecimento das leis, linhagens, protocolos e costumes da nobreza e alta sociedade.',
    category: 'mental'
  },
  'Percepção': { 
    name: 'Percepção', 
    attribute: 'sabedoria', 
    description: 'Usar os sentidos (visão, audição, olfato) para notar detalhes no ambiente, avistar inimigos escondidos, ouvir conversas distantes.',
    category: 'mental'
  },
  'Pontaria': { 
    name: 'Pontaria', 
    attribute: 'destreza', 
    description: 'Habilidade de mirar e acertar alvos com precisão com ataques à distância (arcos, bestas, armas de arremesso).',
    category: 'combate'
  },
  'Reflexos': { 
    name: 'Reflexos', 
    attribute: 'destreza', 
    description: 'Capacidade de reagir rapidamente a perigos súbitos e áreas de efeito, como armadilhas e explosões.',
    category: 'resistência'
  },
  'Religião': { 
    name: 'Religião', 
    attribute: 'sabedoria', 
    description: 'Conhecimento sobre divindades, tradições religiosas, rituais e cosmologia divina.',
    category: 'mental'
  },
  'Sobrevivência': { 
    name: 'Sobrevivência', 
    attribute: 'sabedoria', 
    description: 'Orientar-se, seguir rastros, encontrar comida/água, prever clima em ermos, construir abrigos improvisados.',
    category: 'mental'
  },
  'Vontade': { 
    name: 'Vontade', 
    attribute: 'sabedoria', 
    description: 'Resistência mental contra efeitos que afetam a mente, como medo, encantamentos, ilusões e controle mental.',
    category: 'resistência'
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

const SkillsStep: React.FC<SkillsStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  // Estado para seleção de perícias treinadas
  const [selectedClassSkills, setSelectedClassSkills] = useState<string[]>(data.selectedClassSkills || []);
  const [selectedRaceSkills, setSelectedRaceSkills] = useState<string[]>(data.selectedRaceSkills || []);
  
  // Estado para valores das perícias e pontos gastos
  const [skillValues, setSkillValues] = useState<Record<string, number>>(data.skillValues || {});
  const [spentPoints, setSpentPoints] = useState<number>(0);
  const maxPoints = 10;

  // Obter dados da classe, raça e origem
  const classData = data.mainClass ? classes[data.mainClass] : null;
  const raceData = data.race ? races[data.race] : null;
  const originData = data.origin ? origins[data.origin] : null;
  const deityData = data.deity ? deities[data.deity] : null;
  const availableClassSkills = classData?.availableSkills || [];
  const skillChoices = classData?.skillChoices || 0;

  // Obter perícias fixas da raça
  const getRaceSkills = () => {
    if (!raceData) return [];
    
    const skills: string[] = [];
    if (data.race === 'faelan') {
      skills.push('Furtividade', 'Percepção');
    } else if (data.race === 'celeres') {
      skills.push('Diplomacia', 'Intuição');
    } else if (data.race === 'kain') {
      // Kain pode escolher 2 perícias de qualquer lista
      return [];
    }
    return skills;
  };

  // Obter perícias da origem
  const getOriginSkills = (): string[] => {
    if (!originData) return [];
    return [...originData.trainedSkills];
  };

  // Obter perícia da divindade
  const getDeitySkill = (): string[] => {
    if (!deityData) return [];
    return [deityData.trainedSkill];
  };

  const raceSkills = getRaceSkills();
  const originSkills = getOriginSkills();
  const deitySkills = getDeitySkill();
  const isKain = data.race === 'kain';

  // Calcular perícias treinadas (que começam com valor 1)
  const getTrainedSkills = (): string[] => {
    const trained = [...selectedClassSkills, ...raceSkills, ...originSkills, ...deitySkills];
    if (isKain) {
      trained.push(...selectedRaceSkills);
    }
    return trained;
  };

  const trainedSkills = getTrainedSkills();

  // Calcular valor final de cada perícia
  const getFinalSkillValue = useCallback((skillName: string): number => {
    const isTrained = trainedSkills.includes(skillName);
    const baseValue = isTrained ? 1 : 0; // Perícias treinadas começam com 1
    const boughtValue = skillValues[skillName] || 0;
    return baseValue + boughtValue;
  }, [trainedSkills, skillValues]);

  // Calcular pontos gastos
  useEffect(() => {
    let total = 0;
    Object.entries(skillValues).forEach(([skillName, boughtValue]) => {
      if (boughtValue > 0) {
        const isTrained = trainedSkills.includes(skillName);
        const startValue = isTrained ? 1 : 0;
        total += getSkillPointCost(startValue, startValue + boughtValue);
      }
    });
    setSpentPoints(total);
  }, [skillValues, trainedSkills]);

  // Atualizar dados do personagem
  useEffect(() => {
    onUpdate({
      ...data,
      selectedClassSkills: selectedClassSkills,
      selectedRaceSkills: selectedRaceSkills,
      skillValues: skillValues,
      finalSkillValues: Object.fromEntries(
        Object.keys(allSkills).map(skill => [skill, getFinalSkillValue(skill)])
      )
    });
  }, [selectedClassSkills, selectedRaceSkills, skillValues, data, getFinalSkillValue, onUpdate]);

  const toggleClassSkill = (skill: string) => {
    if (selectedClassSkills.includes(skill)) {
      setSelectedClassSkills(selectedClassSkills.filter(s => s !== skill));
    } else if (selectedClassSkills.length < skillChoices) {
      setSelectedClassSkills([...selectedClassSkills, skill]);
    }
  };

  const toggleRaceSkill = (skill: string) => {
    if (selectedRaceSkills.includes(skill)) {
      setSelectedRaceSkills(selectedRaceSkills.filter(s => s !== skill));
    } else if (selectedRaceSkills.length < 2) {
      setSelectedRaceSkills([...selectedRaceSkills, skill]);
    }
  };

  const canIncreaseSkill = (skillName: string): boolean => {
    const currentFinalValue = getFinalSkillValue(skillName);
    const currentBoughtValue = skillValues[skillName] || 0;
    const isTrained = trainedSkills.includes(skillName);
    const startValue = isTrained ? 1 : 0;
    
    if (currentFinalValue >= 20) return false; // Máximo de 20
    
    const costToIncrease = getSkillPointCost(startValue + currentBoughtValue, startValue + currentBoughtValue + 1);
    return spentPoints + costToIncrease <= maxPoints;
  };

  const canDecreaseSkill = (skillName: string): boolean => {
    return (skillValues[skillName] || 0) > 0;
  };

  const increaseSkill = (skillName: string) => {
    if (!canIncreaseSkill(skillName)) return;
    
    const newBoughtValue = (skillValues[skillName] || 0) + 1;
    setSkillValues({
      ...skillValues,
      [skillName]: newBoughtValue
    });
  };

  const decreaseSkill = (skillName: string) => {
    if (!canDecreaseSkill(skillName)) return;
    
    const currentBoughtValue = skillValues[skillName] || 0;
    if (currentBoughtValue <= 1) {
      const { [skillName]: removed, ...rest } = skillValues;
      setSkillValues(rest);
    } else {
      setSkillValues({
        ...skillValues,
        [skillName]: currentBoughtValue - 1
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'física': return <User className="w-5 h-5" />;
      case 'social': return <User className="w-5 h-5" />;
      case 'mental': return <Brain className="w-5 h-5" />;
      case 'mágica': return <Zap className="w-5 h-5" />;
      case 'combate': return <Shield className="w-5 h-5" />;
      case 'reação': return <Clock className="w-5 h-5" />;
      case 'resistência': return <Shield className="w-5 h-5" />;
      case 'útil': return <Eye className="w-5 h-5" />;
      default: return <Eye className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'física': return 'text-blue-600 bg-blue-100';
      case 'social': return 'text-green-600 bg-green-100';
      case 'mental': return 'text-purple-600 bg-purple-100';
      case 'mágica': return 'text-indigo-600 bg-indigo-100';
      case 'combate': return 'text-red-600 bg-red-100';
      case 'reação': return 'text-orange-600 bg-orange-100';
      case 'resistência': return 'text-gray-600 bg-gray-100';
      case 'útil': return 'text-emerald-600 bg-emerald-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const canProceed = selectedClassSkills.length === skillChoices && 
                    (!isKain || selectedRaceSkills.length === 2);

  if (!classData) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">Classe Não Selecionada</h3>
        <p className="text-slate-600 mb-6">Você precisa selecionar uma classe primeiro.</p>
        <button 
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
        >
          Voltar para Classes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-3">Sistema de Perícias</h3>
        <p className="text-slate-600">
          Primeiro selecione suas perícias treinadas, depois distribua seus 10 pontos em qualquer perícia
        </p>
      </div>

      {/* Seleção de Perícias Treinadas */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-2xl font-bold text-slate-800 mb-4">
          1. Perícias Treinadas da Classe ({selectedClassSkills.length}/{skillChoices})
        </h4>
        <p className="text-slate-600 mb-6">
          Como {classData.name}, escolha {skillChoices} perícias. <span className="font-semibold text-green-600">Perícias treinadas começam com Valor 1 (gratuito)</span>:
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableClassSkills.map((skillName) => {
            const skill = allSkills[skillName];
            const isSelected = selectedClassSkills.includes(skillName);
            const isDisabled = !isSelected && selectedClassSkills.length >= skillChoices;
            
            if (!skill) return null;
            
            return (
              <div
                key={skillName}
                onClick={() => !isDisabled && toggleClassSkill(skillName)}
                className={`relative bg-white rounded-lg border-2 cursor-pointer transition-all duration-300 p-4 ${
                  isSelected 
                    ? 'border-blue-400 bg-blue-50 shadow-lg' 
                    : isDisabled
                    ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 p-2 rounded-lg ${
                    isSelected 
                      ? 'bg-blue-200 text-blue-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getCategoryIcon(skill.category)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-bold text-slate-800">{skill.name}</h5>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                        {skill.attribute}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{skill.description}</p>
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seção 2: Perícias da Origem */}
      {originSkills.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-2xl font-bold text-slate-800 mb-4">
            2. Perícias da Origem
          </h4>
          
          <p className="text-slate-600 mb-6">
            Como <span className="font-semibold text-purple-600">{originData?.name}</span>, você recebe automaticamente as seguintes perícias <span className="font-semibold text-green-600">(Valor 1 cada)</span>:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {originSkills.map((skillName) => {
              const skill = allSkills[skillName];
              if (!skill) return null;
              
              return (
                <div
                  key={skillName}
                  className="bg-purple-50 rounded-lg border-2 border-purple-400 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-purple-200 text-purple-700">
                      {getCategoryIcon(skill.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-bold text-slate-800">{skill.name}</h5>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                          {skill.attribute}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{skill.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Seção 3: Perícia do Patrono */}
      {deitySkills.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-2xl font-bold text-slate-800 mb-4">
            {originSkills.length > 0 ? '3' : '2'}. Perícia do Patrono
          </h4>
          
          <p className="text-slate-600 mb-6">
            Como seguidor de <span className="font-semibold text-amber-600">{deityData?.name}</span>, você recebe automaticamente a seguinte perícia <span className="font-semibold text-green-600">(Valor 1)</span>:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {deitySkills.map((skillName) => {
              const skill = allSkills[skillName];
              if (!skill) return null;
              
              return (
                <div
                  key={skillName}
                  className="bg-amber-50 rounded-lg border-2 border-amber-400 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-amber-200 text-amber-700">
                      {getCategoryIcon(skill.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-bold text-slate-800">{skill.name}</h5>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                          {skill.attribute}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{skill.description}</p>
                      <div className="mt-2 text-xs text-amber-700 bg-amber-100 p-2 rounded">
                        <strong>Benefício do Patrono:</strong> {deityData?.benefit.description}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Seção 4/3/2: Perícias da Raça */}
      {(raceSkills.length > 0 || isKain) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-2xl font-bold text-slate-800 mb-4">
            {(() => {
              let sectionNumber = 2;
              if (originSkills.length > 0) sectionNumber++;
              if (deitySkills.length > 0) sectionNumber++;
              return `${sectionNumber}. Perícias da Raça`;
            })()}
          </h4>
          
          {raceSkills.length > 0 ? (
            <>
              <p className="text-slate-600 mb-6">
                Como {raceData?.name}, você recebe automaticamente as seguintes perícias <span className="font-semibold text-green-600">(Valor 1 cada)</span>:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {raceSkills.map((skillName) => {
                  const skill = allSkills[skillName];
                  if (!skill) return null;
                  
                  return (
                    <div
                      key={skillName}
                      className="bg-green-50 rounded-lg border-2 border-green-400 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 p-2 rounded-lg bg-green-200 text-green-700">
                          {getCategoryIcon(skill.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-bold text-slate-800">{skill.name}</h5>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                              {skill.attribute}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{skill.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : isKain ? (
            <>
              <p className="text-slate-600 mb-6">
                Como Kain, você pode escolher 2 perícias de qualquer lista ({selectedRaceSkills.length}/2):
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(allSkills).map(([skillName, skill]) => {
                  const isSelected = selectedRaceSkills.includes(skillName);
                  const isDisabled = !isSelected && selectedRaceSkills.length >= 2;
                  
                  return (
                    <div
                      key={skillName}
                      onClick={() => !isDisabled && toggleRaceSkill(skillName)}
                      className={`relative bg-white rounded-lg border-2 cursor-pointer transition-all duration-300 p-4 ${
                        isSelected 
                          ? 'border-green-400 bg-green-50 shadow-lg' 
                          : isDisabled
                          ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`flex-shrink-0 p-2 rounded-lg ${
                          isSelected 
                            ? 'bg-green-200 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {getCategoryIcon(skill.category)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-bold text-slate-800">{skill.name}</h5>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                              {skill.attribute}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{skill.description}</p>
                        </div>
                        
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Seção Final: Distribuir Pontos de Perícia */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-2xl font-bold text-slate-800">
            {(() => {
              let sectionNumber = 2;
              if (originSkills.length > 0) sectionNumber++;
              if (deitySkills.length > 0) sectionNumber++;
              if (raceSkills.length > 0 || isKain) sectionNumber++;
              return `${sectionNumber}. Distribuir Pontos de Perícia`;
            })()}
          </h4>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600">
              {spentPoints} / {maxPoints} pontos gastos
            </p>
            <p className="text-sm text-slate-600">
              Você pode gastar até {maxPoints} pontos em qualquer perícia
            </p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-yellow-600 text-xl">💡</span>
            <div>
              <h5 className="font-semibold text-yellow-800 mb-2">Regra dos 10 Pontos:</h5>
              <div className="text-yellow-700 text-sm space-y-1">
                <p>• <strong>Perícias Treinadas:</strong> Começam com Valor 1 (gratuito) - mostradas acima</p>
                <p>• <strong>10 Pontos Livres:</strong> Podem ser gastos em QUALQUER perícia (treinada ou não)</p>
                <p>• <strong>Custos:</strong> Valores 1-4: 1 ponto cada | Valores 5-9: 3 pontos cada | Valor 10+: 6 pontos cada</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(allSkills).map(([skillName, skill]) => {
            const isTrained = trainedSkills.includes(skillName);
            const boughtValue = skillValues[skillName] || 0;
            const finalValue = getFinalSkillValue(skillName);
            const canIncrease = canIncreaseSkill(skillName);
            const canDecrease = canDecreaseSkill(skillName);
            
            return (
              <div
                key={skillName}
                className={`bg-white rounded-lg border-2 p-4 ${
                  isTrained ? 'border-green-300 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`flex-shrink-0 p-2 rounded-lg ${
                    isTrained 
                      ? 'bg-green-200 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {getCategoryIcon(skill.category)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-bold text-slate-800">{skill.name}</h5>
                      {isTrained && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Treinada
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                        {skill.attribute}
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        Valor: {finalValue}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {isTrained ? `Base: 1 + Comprados: ${boughtValue}` : `Comprados: ${boughtValue}`}
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
                
                <p className="text-xs text-slate-500 mt-2">{skill.description}</p>
              </div>
            );
          })}
        </div>
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
          {!canProceed && (
            <div className="text-sm text-red-600">
              Complete a seleção de perícias treinadas para continuar
            </div>
          )}
        </div>
        
        <button 
          onClick={onNext}
          disabled={!canProceed}
          className={`px-6 py-3 rounded-lg transition-colors ${
            canProceed
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default SkillsStep; 