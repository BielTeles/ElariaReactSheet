import React, { useState, useEffect } from 'react';
import { CharacterCreation } from '../../../types/character';
import { classes } from '../../../data/classes';
import { races } from '../../../data/races';
import { User, Shield, Eye, Brain, Zap, Clock } from 'lucide-react';

interface SkillsStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Lista completa de perícias conforme o livro
const allSkills: Record<string, { name: string; attribute: string; description: string; category: string }> = {
  'Acrobacia': { 
    name: 'Acrobacia', 
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
    category: 'mental'
  },
  'Diplomacia': { 
    name: 'Diplomacia', 
    attribute: 'carisma', 
    description: 'Interagir socialmente de forma positiva, negociar, persuadir, fazer amigos e influenciar pessoas.',
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
    description: 'Mentir convincentemente, blefar, disfarçar intenções ou aparência.',
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
    description: 'Conhecimento sobre táticas militares, estratégia, história de batalhas, armas e armaduras.',
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
    description: 'Coagir, ameaçar ou assustar outros para obter informações ou obediência através do medo.',
    category: 'social'
  },
  'Intuição': { 
    name: 'Intuição', 
    attribute: 'sabedoria', 
    description: 'Perceber as intenções, emoções e motivações ocultas de outras criaturas, sentir quando algo está errado.',
    category: 'mental'
  },
  'Investigação': { 
    name: 'Investigação', 
    attribute: 'inteligência', 
    description: 'Procurar pistas, analisar cenas de crime ou locais de interesse, deduzir informações a partir de evidências.',
    category: 'mental'
  },
  'Jogatina': { 
    name: 'Jogatina', 
    attribute: 'carisma', 
    description: 'Jogar e entender jogos de azar, cartas ou dados. Inclui a habilidade de trapacear sutilmente.',
    category: 'social'
  },
  'Ladinagem': { 
    name: 'Ladinagem', 
    attribute: 'destreza', 
    description: 'Abrir fechaduras, desarmar armadilhas, realizar pequenos furtos e outras tarefas que exigem mãos ágeis.',
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
    description: 'Usar os sentidos para notar detalhes no ambiente, avistar inimigos escondidos, ouvir conversas distantes.',
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

const SkillsStep: React.FC<SkillsStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [selectedClassSkills, setSelectedClassSkills] = useState<string[]>(data.selectedClassSkills || []);
  const [selectedRaceSkills, setSelectedRaceSkills] = useState<string[]>(data.selectedRaceSkills || []);

  // Obter perícias disponíveis da classe
  const classData = data.mainClass ? classes[data.mainClass] : null;
  const raceData = data.race ? races[data.race] : null;
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

  const raceSkills = getRaceSkills();
  const isKain = data.race === 'kain';

  // Atualizar dados do personagem quando perícias mudam
  useEffect(() => {
    onUpdate({
      ...data,
      selectedClassSkills: selectedClassSkills,
      selectedRaceSkills: selectedRaceSkills
    });
  }, [selectedClassSkills, selectedRaceSkills, data, onUpdate]);

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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'física': return <User className="w-5 h-5" />;
      case 'social': return <User className="w-5 h-5" />;
      case 'mental': return <Brain className="w-5 h-5" />;
      case 'mágica': return <Zap className="w-5 h-5" />;
      case 'combate': return <Shield className="w-5 h-5" />;
      case 'reação': return <Clock className="w-5 h-5" />;
      case 'resistência': return <Shield className="w-5 h-5" />;
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
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const canProceed = selectedClassSkills.length === skillChoices && 
                    (!isKain || selectedRaceSkills.length === 2) && 
                    raceSkills.length === 0; // Se a raça tem perícias fixas, não precisa escolher

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
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-3">Escolha suas Perícias</h3>
        <p className="text-slate-600">
          Selecione as perícias que definem as habilidades especializadas do seu personagem
        </p>
      </div>

      {/* Perícias da Classe */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-2xl font-bold text-slate-800 mb-4">
          Perícias da Classe ({selectedClassSkills.length}/{skillChoices})
        </h4>
        <p className="text-slate-600 mb-6">
          Como {classData.name}, você pode escolher {skillChoices} perícias da lista abaixo:
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

      {/* Perícias da Raça */}
      {(raceSkills.length > 0 || isKain) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-2xl font-bold text-slate-800 mb-4">
            Perícias da Raça
          </h4>
          
          {raceSkills.length > 0 ? (
            <>
              <p className="text-slate-600 mb-6">
                Como {raceData?.name}, você recebe automaticamente as seguintes perícias:
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
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">★</span>
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
                Como Kain, você pode escolher 2 perícias de qualquer categoria ({selectedRaceSkills.length}/2):
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

      {/* Informações sobre Perícias */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h5 className="font-semibold text-yellow-800 mb-2">💡 Sistema de Perícias</h5>
        <div className="text-yellow-700 text-sm space-y-2">
          <p>
            • Perícias representam habilidades aprendidas e treinamento específico
          </p>
          <p>
            • Ser treinado em uma perícia significa que ela começa com Valor 1
          </p>
          <p>
            • Você recebe 10 pontos de perícia no 1º nível para aumentar o Valor das perícias treinadas
          </p>
          <p>
            • <strong>Perícias de Reação:</strong> Bloqueio e Esquiva são usadas para evitar ataques em combate
          </p>
        </div>
      </div>

      {/* Navegação */}
      <div className="flex justify-between items-center pt-8 border-t border-gray-200">
        <button 
          onClick={onPrevious} 
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
        >
          ← Anterior
        </button>
        
        <div className="text-center">
          {!canProceed && (
            <p className="text-sm text-orange-600">
              {selectedClassSkills.length < skillChoices && `Selecione ${skillChoices - selectedClassSkills.length} perícia(s) da classe`}
              {isKain && selectedRaceSkills.length < 2 && ` | Selecione ${2 - selectedRaceSkills.length} perícia(s) de raça`}
            </p>
          )}
        </div>

        <button 
          onClick={onNext} 
          disabled={!canProceed}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
        >
          Próximo →
        </button>
      </div>
    </div>
  );
};

export default SkillsStep; 