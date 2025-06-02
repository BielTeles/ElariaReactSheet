import React, { useState, useEffect } from 'react';
import { CharacterCreation } from '../../../types/character';
import { classes, subclassData } from '../../../data/classes';
import { subclassAbilities } from '../../../data/abilities';
import { Zap, Star, Sparkles, Clock, Target, Flame } from 'lucide-react';

interface SubclassAbilitiesStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const SubclassAbilitiesStep: React.FC<SubclassAbilitiesStepProps> = ({ 
  data, 
  onUpdate, 
  onNext, 
  onPrevious 
}) => {
  const [selectedAbilities, setSelectedAbilities] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Limpar e sincronizar habilidades quando componente carrega ou subclasse muda
  useEffect(() => {
    if (!data.subclass) {
      setSelectedAbilities([]);
      setInitialized(true);
      return;
    }

    const subclass = subclassData[data.subclass];
    const availableAbilities = subclass?.abilities || [];
    
    if (!initialized) {
      // Primeira vez carregando o componente - sempre limpar
      console.log('Primeira vez no componente - limpando tudo');
      setSelectedAbilities([]);
      onUpdate({
        ...data,
        selectedSubclassAbilities: []
      });
      setInitialized(true);
      return;
    }

    // Verificar se as habilidades selecionadas pertencem à subclasse atual
    const currentSelectedAbilities = data.selectedSubclassAbilities || [];
    const validAbilities = currentSelectedAbilities.filter(ability => 
      availableAbilities.includes(ability)
    );

    // Se alguma habilidade selecionada não pertence à subclasse atual, limpar tudo
    if (validAbilities.length !== currentSelectedAbilities.length || currentSelectedAbilities.length === 0) {
      console.log('Limpando habilidades - subclasse atual:', data.subclass);
      console.log('Habilidades disponíveis:', availableAbilities);
      console.log('Habilidades previamente selecionadas:', currentSelectedAbilities);
      
      setSelectedAbilities([]);
      onUpdate({
        ...data,
        selectedSubclassAbilities: []
      });
    } else {
      // Todas as habilidades são válidas, usar as existentes
      console.log('Carregando habilidades válidas:', validAbilities);
      setSelectedAbilities(validAbilities);
    }
  }, [data.subclass, initialized]);

  if (!data.mainClass || !data.subclass) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">Subclasse Não Selecionada</h3>
        <p className="text-slate-600 mb-6">Você precisa selecionar uma subclasse primeiro.</p>
        <button 
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
        >
          Voltar para Subclasses
        </button>
      </div>
    );
  }

  const subclass = subclassData[data.subclass];
  const availableAbilities = subclass?.abilities || [];
  
  // Determinar quantas habilidades podem ser escolhidas (padrão: 2)
  const maxSelections = 2;
  const isEvocador = data.mainClass === 'evocador';

  const handleAbilityToggle = (ability: string) => {
    let newSelected: string[];
    
    if (selectedAbilities.includes(ability)) {
      // Remover se já selecionado
      newSelected = selectedAbilities.filter(a => a !== ability);
    } else if (selectedAbilities.length < maxSelections) {
      // Adicionar se não atingiu o limite
      newSelected = [...selectedAbilities, ability];
    } else {
      // Substitui a primeira seleção se atingiu o limite
      newSelected = [selectedAbilities[1], ability];
    }
    
    console.log('Habilidades selecionadas para', data.subclass, ':', newSelected);
    
    setSelectedAbilities(newSelected);
    onUpdate({
      ...data,
      selectedSubclassAbilities: newSelected
    });
  };

  const canProceed = selectedAbilities.length === maxSelections;

  const getAbilityIcon = (index: number) => {
    const icons = [Star, Zap, Sparkles];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="w-5 h-5" />;
  };

  const getAbilityTypeTitle = () => {
    return isEvocador ? 'Manifestações Elementais' : 'Habilidades de Arquétipo';
  };

  const getAbilityDescription = () => {
    if (isEvocador) {
      return `Como ${subclass?.name}, você pode escolher ${maxSelections} manifestações elementais que representam sua sintonia com o elemento.`;
    }
    return `Como ${subclass?.name}, você pode escolher ${maxSelections} habilidades que definem sua especialização.`;
  };

  const getAbilityDetails = (abilityName: string) => {
    return subclassAbilities[abilityName];
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'ação':
        return <Target className="w-4 h-4" />;
      case 'ação bônus':
        return <Zap className="w-4 h-4" />;
      case 'reação':
        return <Sparkles className="w-4 h-4" />;
      case 'passivo':
      case 'passivo/gatilho':
        return <Star className="w-4 h-4" />;
      case 'ritual':
        return <Clock className="w-4 h-4" />;
      default:
        return <Flame className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'ação':
        return 'text-red-600 bg-red-100';
      case 'ação bônus':
        return 'text-yellow-600 bg-yellow-100';
      case 'reação':
        return 'text-blue-600 bg-blue-100';
      case 'passivo':
      case 'passivo/gatilho':
        return 'text-green-600 bg-green-100';
      case 'ritual':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-slate-800 mb-3">
          Escolha suas {getAbilityTypeTitle()}
        </h3>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-bold text-blue-800 mb-2">{subclass?.name}</h4>
          <p className="text-blue-700 mb-3">{getAbilityDescription()}</p>
          <div className="text-sm text-blue-600">
            <span className="font-semibold">Selecionadas:</span> {selectedAbilities.length} / {maxSelections}
          </div>
        </div>
      </div>

      {/* Opções de Habilidades */}
      <div className="grid gap-6">
        {availableAbilities.map((ability, index) => {
          const isSelected = selectedAbilities.includes(ability);
          const isDisabled = !isSelected && selectedAbilities.length >= maxSelections;
          const abilityDetails = getAbilityDetails(ability);
          
          return (
            <div
              key={ability}
              onClick={() => !isDisabled && handleAbilityToggle(ability)}
              className={`relative bg-white rounded-lg border-2 cursor-pointer transition-all duration-300 p-6 ${
                isSelected 
                  ? 'border-blue-400 bg-blue-50 shadow-lg' 
                  : isDisabled
                  ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Ícone da habilidade */}
                <div className={`flex-shrink-0 p-3 rounded-lg ${
                  isSelected 
                    ? 'bg-blue-200 text-blue-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {getAbilityIcon(index)}
                </div>

                {/* Conteúdo principal */}
                <div className="flex-1">
                  {/* Header com nome e tipo */}
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-xl font-bold text-slate-800">{ability}</h4>
                    {abilityDetails?.type && (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(abilityDetails.type)}`}>
                        {getTypeIcon(abilityDetails.type)}
                        {abilityDetails.type}
                      </span>
                    )}
                  </div>

                  {/* Metadados da habilidade */}
                  {abilityDetails && (
                    <div className="flex flex-wrap gap-4 mb-3 text-sm text-slate-600">
                      {abilityDetails.cost && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Custo:</span>
                          <span className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">
                            {abilityDetails.cost}
                          </span>
                        </div>
                      )}
                      {abilityDetails.range && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Alcance:</span>
                          <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                            {abilityDetails.range}
                          </span>
                        </div>
                      )}
                      {abilityDetails.duration && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Duração:</span>
                          <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                            {abilityDetails.duration}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Descrição da habilidade */}
                  <p className="text-slate-700 text-sm leading-relaxed mb-3">
                    {abilityDetails?.description || `Uma habilidade especializada da ${subclass?.name}.`}
                  </p>

                  {/* Flavor text */}
                  {abilityDetails?.flavorText && (
                    <p className="text-slate-500 text-xs italic border-l-2 border-slate-300 pl-3">
                      {abilityDetails.flavorText}
                    </p>
                  )}
                </div>

                {/* Indicador de seleção */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Informação sobre uso */}
      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <h5 className="font-semibold text-yellow-800 mb-2">💡 Como Usar</h5>
        <p className="text-yellow-700 text-sm">
          {isEvocador 
            ? 'Estas manifestações usam Pontos de Mana (PM) e são ativadas durante o jogo. Cada uma tem custos e efeitos específicos que serão detalhados na ficha do personagem.'
            : 'Estas habilidades usam recursos específicos da sua classe (PM ou Pontos de Vigor) e podem ser ativadas durante combate ou exploração.'
          }
        </p>
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
              Selecione exatamente {maxSelections} {isEvocador ? 'manifestações' : 'habilidades'} para continuar
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

export default SubclassAbilitiesStep; 
