import React, { useState, useMemo } from 'react';
import { 
  Brain, 
  Search,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface Skill {
  name: string;
  attribute: string;
  description: string;
  category: string;
  value: number;
  isTrained: boolean;
  source: string[];
  modifier?: number;
}

interface ExpandedSkillSystemProps {
  characterData: any;
  executeInlineRoll: (name: string, type: 'attribute' | 'skill' | 'damage' | 'initiative', attributeValue?: number, skillValue?: number, diceString?: string, event?: React.MouseEvent) => Promise<void>;
  getAttributeForSkill: (skillName: string) => string;
  getTrainedSkills: () => string[];
  getSuccessTargets: (skillValue: number) => { normal: number | null; good: number | null; extreme: number | null };
}

const ExpandedSkillSystem: React.FC<ExpandedSkillSystemProps> = ({
  characterData,
  executeInlineRoll,
  getAttributeForSkill,
  getTrainedSkills,
  getSuccessTargets
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTrainedOnly, setShowTrainedOnly] = useState(false);



  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'física': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'social': return 'text-green-600 bg-green-50 border-green-200';
      case 'mental': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'mágica': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'combate': return 'text-red-600 bg-red-50 border-red-200';
      case 'reação': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'resistência': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'útil': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getAttributeName = (attribute: string) => {
    const names: Record<string, string> = {
      força: 'Força', forca: 'Força',
      destreza: 'Destreza',
      constituição: 'Constituição', constituicao: 'Constituição',
      inteligência: 'Inteligência', inteligencia: 'Inteligência',
      sabedoria: 'Sabedoria',
      carisma: 'Carisma'
    };
    return names[attribute] || attribute;
  };

  // Processar perícias para exibição
  const processedSkills = useMemo(() => {
    const trainedSkills = getTrainedSkills();
    
    // Lista completa de perícias do sistema
    const allSkills: Record<string, { name: string; attribute: string; description: string; category: string }> = {
      'Acrobatismo': { 
        name: 'Acrobatismo', 
        attribute: 'destreza', 
        description: 'Equilibrar-se, fazer manobras acrobáticas, saltar, escalar superfícies difíceis.',
        category: 'física'
      },
      'Atuação': { 
        name: 'Atuação', 
        attribute: 'carisma', 
        description: 'Representar, cantar, dançar, tocar instrumentos, entreter uma audiência.',
        category: 'social'
      },
      'Atletismo': { 
        name: 'Atletismo', 
        attribute: 'força', 
        description: 'Correr, nadar, escalar, saltar longas distâncias, levantar objetos pesados.',
        category: 'física'
      },
      'Conhecimento': { 
        name: 'Conhecimento', 
        attribute: 'inteligência', 
        description: 'Conhecimento geral sobre história, geografia, culturas, ciências e assuntos acadêmicos.',
        category: 'mental'
      },
      'Corpo-a-Corpo': { 
        name: 'Corpo-a-Corpo', 
        attribute: 'força', 
        description: 'Habilidade de combate com armas de combate próximo (espadas, machados, martelos, etc.).',
        category: 'combate'
      },
      'Cura': { 
        name: 'Cura', 
        attribute: 'sabedoria', 
        description: 'Tratar ferimentos, doenças, aplicar primeiros socorros, conhecimento médico básico.',
        category: 'útil'
      },
      'Diplomacia': { 
        name: 'Diplomacia', 
        attribute: 'carisma', 
        description: 'Negociar, persuadir, mediar conflitos, influenciar através de argumentos racionais e carisma.',
        category: 'social'
      },
      'Elemental': { 
        name: 'Elemental', 
        attribute: 'sabedoria', 
        description: 'Controlar e manipular elementos mágicos (fogo, água, terra, ar) em combate e utilidade.',
        category: 'mágica'
      },
      'Enganação': { 
        name: 'Enganação', 
        attribute: 'carisma', 
        description: 'Mentir convincentemente, blefar, disfarçar-se, criar identidades falsas.',
        category: 'social'
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

    // Função para obter fontes da perícia
    const getSkillSource = (skillName: string) => {
      const sources = [];

      if (characterData.selectedClassSkills?.includes(skillName)) sources.push('Classe');
      if (characterData.selectedRaceSkills?.includes(skillName)) sources.push('Raça');
      
      // Perícias fixas da raça - ADICIONANDO ALARI
      if (characterData.race === 'faelan' && ['Furtividade', 'Percepção'].includes(skillName)) {
        sources.push('Raça');
      } else if (characterData.race === 'celeres' && ['Diplomacia', 'Intuição'].includes(skillName)) {
        sources.push('Raça');
      } else if (characterData.race === 'alari' && ['Diplomacia', 'Conhecimento'].includes(skillName)) {
        sources.push('Raça');
      }

      // Perícias da origem
      const origins = {
        'soldado': ['Fortitude', 'Sobrevivência'],
        'artesão': ['Percepção', 'Investigação'],
        'eremita': ['Natureza', 'Sobrevivência'],
        'nobre': ['Investigação', 'Conhecimento'],
        'artista': ['Atuação', 'Enganação'],
        'mercenário': ['Luta', 'Fortitude'],
        'ladino': ['Intimidação'],
        'curandeiro': ['Cura'],
        'caçador': ['Sobrevivência'],
        'acrobata': ['Acrobatismo'],
        'explorador': ['Percepção'],
        'sombrio': ['Furtividade']
      };

      if (characterData.origin && origins[characterData.origin as keyof typeof origins]?.includes(skillName)) {
        sources.push('Origem');
      }

      // Perícia da divindade
      const deitySkills = {
        'ignis': 'Intimidação',
        'ondina': 'Cura',
        'terrus': 'Fortitude',
        'zephyrus': 'Sobrevivência',
        'lumina': 'Percepção',
        'noctus': 'Furtividade'
      };

      if (characterData.deity && deitySkills[characterData.deity as keyof typeof deitySkills] === skillName) {
        sources.push('Patrono');
      }

      return sources;
    };
    
    return Object.entries(allSkills)
      .map(([skillName, skillData]) => {
        const finalValue = characterData.finalSkillValues?.[skillName] || 0;
        const isTrained = trainedSkills.includes(skillName);
        const source = getSkillSource(skillName);
        
        // Valor da perícia conforme as regras (0 para não treinada, 1+ para treinada com pontos investidos)
        const effectiveValue = finalValue;
        
        return {
          name: skillName,
          attribute: skillData.attribute,
          description: skillData.description,
          category: skillData.category,
          value: effectiveValue,
          isTrained,
          source
        } as Skill;
      })
      .filter(skill => {
        // Filtros - RESTAURADOS: busca e filtro de treinadas
        if (showTrainedOnly && !skill.isTrained) return false;
        if (searchTerm && !skill.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        // Mostrar todas as perícias (treinadas e não treinadas conforme regras)
        return true;
      })
      .sort((a, b) => {
        // Ordenar: primeiro treinadas, depois por valor decrescente
        if (a.isTrained && !b.isTrained) return -1;
        if (!a.isTrained && b.isTrained) return 1;
        return b.value - a.value;
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterData, searchTerm, showTrainedOnly]);

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header Colapsável - IGUAL AOS OUTROS CARDS */}
      <div 
        className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 cursor-pointer hover:from-indigo-600 hover:to-purple-600 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Perícias
          </h3>
          <div className="flex items-center gap-2">
            <div className="text-xs text-white bg-white bg-opacity-20 px-2 py-1 rounded">
              {processedSkills.length} de 28
            </div>
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5 text-white" />
            ) : (
              <ChevronUp className="w-5 h-5 text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Barra de Controles - só aparece quando expandido */}
      {!isCollapsed && (
        <div className="px-4 pb-3 pt-0 border-b border-gray-200">
          <div className="flex flex-col gap-2">
            {/* Campo de Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar perícias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            {/* Filtros */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showTrainedOnly}
                  onChange={(e) => setShowTrainedOnly(e.target.checked)}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700">Apenas Treinadas</span>
              </label>
              
              <span className="text-xs text-gray-500">
                {processedSkills.length} de 28 perícias
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo - IGUAL AOS OUTROS CARDS */}
      {!isCollapsed && (
        <div className="p-3">
          <div className="space-y-1.5 max-h-80 overflow-y-auto">
            {processedSkills.map((skill) => {
              const attributeKey = getAttributeForSkill(skill.name);
              const attributeValue = characterData.finalAttributes?.[attributeKey] || 0;
              
              return (
                <div 
                  key={skill.name} 
                  className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-2 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-indigo-300"
                  onClick={(e) => {
                    executeInlineRoll(`Teste de ${skill.name}`, 'skill', attributeValue, skill.value, undefined, e);
                  }}
                  title={`${skill.description}\n\n${skill.isTrained ? 'TREINADA' : 'NÃO TREINADA'}\nValor da Perícia: ${skill.value} (usado na Planilha de Sucessos)\nAtributo ${getAttributeName(skill.attribute)}: ${attributeValue >= 0 ? '+' : ''}${attributeValue} (determina dados de vantagem/desvantagem)\n\nFontes: ${skill.source.join(', ') || 'Nenhuma - Pode tentar testes básicos'}\nCategoria: ${skill.category}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800 text-xs">{skill.name}</span>
                      {/* Badge para treinadas vs não treinadas */}
                      {skill.isTrained ? (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                          ✓ Treinada
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded-full">
                          Não Treinada
                        </span>
                      )}
                      {/* Badge para categoria */}
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(skill.category).replace('border-', 'bg-').replace('bg-', 'bg-')}`}>
                        {skill.category.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className={`text-sm font-bold ${skill.value > 0 ? 'text-slate-600' : 'text-gray-400'}`}>
                      {skill.value}
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-600 leading-snug mb-1">
                    <strong>Atributo:</strong> {getAttributeName(skill.attribute)} ({attributeValue >= 0 ? '+' : ''}{attributeValue}) dados
                    {skill.source.length > 0 && (
                      <span> • <strong>Fontes:</strong> {skill.source.join(', ')}</span>
                    )}
                  </div>
                  
                  <div className="text-xs text-indigo-600 font-medium">
                    🎲 Clique para rolar • Valor {skill.value} na Planilha • Alvo: {getSuccessTargets(skill.value).normal ? `${getSuccessTargets(skill.value).normal}+` : 'Muito Difícil'}
                  </div>
                </div>
              );
            })}
            
            {processedSkills.length === 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                Nenhuma perícia encontrada.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandedSkillSystem;