import React, { useState, useEffect } from 'react';
import { CharacterCreation, Subclass } from '../../../types/character';
import { classes, subclassData } from '../../../data/classes';
import { Shield, Star, Zap } from 'lucide-react';

interface SubclassStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const SubclassStep: React.FC<SubclassStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [selectedSubclass, setSelectedSubclass] = useState<Subclass | undefined>(data.subclass);

  // Obter subclasses disponíveis baseadas na classe selecionada
  const getAvailableSubclasses = () => {
    if (!data.mainClass) return [];
    
    const classData = classes[data.mainClass];
    return classData ? classData.subclasses : [];
  };

  const handleSubclassSelection = (subclass: Subclass) => {
    setSelectedSubclass(subclass);
    onUpdate({
      ...data,
      subclass
    });
  };

  const availableSubclasses = getAvailableSubclasses();

  // Limpar subclasse selecionada se mudou de classe
  useEffect(() => {
    if (data.subclass && !availableSubclasses.includes(data.subclass)) {
      setSelectedSubclass(undefined);
      onUpdate({
        ...data,
        subclass: undefined
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.mainClass, data.subclass]);

  if (!data.mainClass) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">Classe Não Selecionada</h3>
        <p className="text-slate-600 mb-6">Você precisa selecionar uma classe principal primeiro.</p>
        <button 
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
        >
          Voltar para Classes
        </button>
      </div>
    );
  }

  const getSubclassTypeTitle = () => {
    switch (data.mainClass) {
      case 'evocador': return 'Caminhos Elementais';
      case 'titã': return 'Arquétipos de Força';
      case 'sentinela': return 'Arquétipos de Vigilância';
      case 'elo': return 'Arquétipos de Ligação';
      default: return 'Especializações';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cabeçalho Padronizado */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-slate-800 mb-3">
          Escolha sua Especialização
        </h3>
        <p className="text-lg text-slate-600 mb-2">
          {getSubclassTypeTitle()} - {classes[data.mainClass]?.name}
        </p>
        <div className="text-sm text-slate-500">
          Escolha uma especialização que define seu estilo de jogo
        </div>
      </div>

      {/* Lista de Subclasses - UI Padronizada */}
      <div className="grid gap-4">
        {availableSubclasses.map((subclassId) => {
          const subclass = subclassData[subclassId];
          if (!subclass) return null;

          const isSelected = selectedSubclass === subclassId;

          return (
            <div
              key={subclassId}
              onClick={() => handleSubclassSelection(subclassId as Subclass)}
              className={`relative bg-white rounded-lg border-2 cursor-pointer transition-all duration-300 p-6 ${
                isSelected 
                  ? 'border-blue-400 bg-blue-50 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Cabeçalho */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  isSelected ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-bold text-slate-800">{subclass.name}</h4>
                    {subclass.keyAttribute && (
                      <span className="inline-block px-3 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {subclass.keyAttribute.charAt(0).toUpperCase() + subclass.keyAttribute.slice(1)}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm">{subclass.description}</p>
                </div>
              </div>

              {/* Informações em Grade */}
              <div className="grid gap-3">
                {/* Habilidade de Nível 1 */}
                {subclass.level1Ability && (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h5 className="font-semibold text-yellow-800 mb-1 flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4" />
                      Habilidade de Nível 1
                    </h5>
                    <p className="text-xs text-yellow-700">{subclass.level1Ability}</p>
                  </div>
                )}

                {/* Habilidade Passiva */}
                {subclass.passive && (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <h5 className="font-semibold text-gray-800 mb-1 flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4" />
                      Habilidade Passiva
                    </h5>
                    <p className="text-xs text-gray-700">{subclass.passive}</p>
                  </div>
                )}

                {/* Habilidades Disponíveis */}
                {subclass.abilities && subclass.abilities.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-blue-800 mb-2 flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4" />
                      Habilidades Disponíveis (Escolha 2)
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {subclass.abilities.slice(0, 4).map((ability, index) => (
                        <div
                          key={index}
                          className="px-2 py-1 bg-white text-blue-800 text-xs rounded border border-blue-200 text-center font-medium"
                        >
                          {ability}
                        </div>
                      ))}
                      {subclass.abilities.length > 4 && (
                        <div className="px-2 py-1 bg-white text-blue-600 text-xs rounded border border-blue-200 text-center font-medium italic">
                          +{subclass.abilities.length - 4} mais...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Indicador de Seleção */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Informação de Próximo Passo */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <h5 className="font-semibold text-green-800 mb-2">💡 Próximo Passo</h5>
        <p className="text-green-700 text-sm">
          Após escolher sua especialização, você poderá selecionar as habilidades específicas que deseja aprender.
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
          {!selectedSubclass && (
            <p className="text-sm text-orange-600">
              Selecione uma especialização para continuar
            </p>
          )}
        </div>

        <button 
          onClick={onNext} 
          disabled={!selectedSubclass}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
        >
          Próximo →
        </button>
      </div>
    </div>
  );
};

export default SubclassStep; 