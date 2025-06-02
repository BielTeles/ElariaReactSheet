import React, { useState, useEffect } from 'react';
import { CharacterCreation, Subclass } from '../../../types/character';
import { classes, subclassData } from '../../../data/classes';
import { Flame, Mountain, Droplets, Wind, Sun, Moon } from 'lucide-react';

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
          className="btn btn-secondary"
        >
          Voltar para Classes
        </button>
      </div>
    );
  }

  // Função para obter ícone do elemento
  const getElementIcon = (subclassId: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      terra: <Mountain className="w-5 h-5 text-amber-600" />,
      agua: <Droplets className="w-5 h-5 text-blue-600" />,
      ar: <Wind className="w-5 h-5 text-cyan-600" />,
      fogo: <Flame className="w-5 h-5 text-red-600" />,
      luz: <Sun className="w-5 h-5 text-yellow-600" />,
      sombra: <Moon className="w-5 h-5 text-purple-600" />
    };
    return iconMap[subclassId];
  };

  // Função para obter cor do atributo
  const getAttributeColor = (attribute: string) => {
    return attribute === 'sabedoria' 
      ? 'text-emerald-700 bg-emerald-100 border-emerald-200' 
      : 'text-blue-700 bg-blue-100 border-blue-200';
  };

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
      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-slate-800 mb-3">
          Escolha seu {getSubclassTypeTitle()}
        </h3>
        <p className="text-lg text-slate-600">
          Especialização da classe {classes[data.mainClass]?.name}
        </p>
        
        {/* Informações especiais para Evocador */}
        {data.mainClass === 'evocador' && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h4 className="font-bold text-indigo-800 mb-3 text-lg">Sistema de Atributos Elementais</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-lg border border-emerald-200">
                <h5 className="font-semibold text-emerald-800 mb-1">Sabedoria (Sentir Profundo)</h5>
                <p className="text-emerald-700 text-sm">Terra, Água, Luz</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Inteligência (Olhar Penetrante)</h5>
                <p className="text-blue-700 text-sm">Ar, Fogo, Sombra</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Subclasses */}
      <div className="space-y-4">
        {availableSubclasses.map((subclassId) => {
          const subclass = subclassData[subclassId];
          if (!subclass) return null;

          const isSelected = selectedSubclass === subclassId;

          return (
            <div
              key={subclassId}
              onClick={() => handleSubclassSelection(subclassId as Subclass)}
              className={`relative bg-white rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
                isSelected 
                  ? 'border-blue-400 shadow-lg bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="p-6">
                {/* Cabeçalho com ícone e nome */}
                <div className="flex items-start gap-4 mb-4">
                  {data.mainClass === 'evocador' && (
                    <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                      {getElementIcon(subclassId)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-slate-800">{subclass.name}</h4>
                      {subclass.keyAttribute && (
                        <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium border ${getAttributeColor(subclass.keyAttribute)}`}>
                          {subclass.keyAttribute.charAt(0).toUpperCase() + subclass.keyAttribute.slice(1)}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 leading-relaxed">{subclass.description}</p>
                  </div>
                </div>

                {/* Grade de informações */}
                <div className="grid gap-4">
                  {/* Habilidades de Nível 1 */}
                  {subclass.level1Ability && (
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h5 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                        ⭐ Habilidades de Nível 1
                      </h5>
                      <p className="text-sm text-yellow-700">{subclass.level1Ability}</p>
                    </div>
                  )}

                  {/* Habilidade Passiva */}
                  {subclass.passive && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        🛡️ Habilidade Passiva
                      </h5>
                      <p className="text-sm text-gray-700">{subclass.passive}</p>
                    </div>
                  )}

                  {/* Manifestações/Habilidades Disponíveis */}
                  {subclass.abilities && subclass.abilities.length > 0 && (
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h5 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                        ⚡ {data.mainClass === 'evocador' ? 'Manifestações (Escolha 2)' : 'Habilidades Disponíveis'}
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {subclass.abilities.map((ability, index) => (
                          <div
                            key={index}
                            className="px-3 py-2 bg-white text-orange-800 text-sm rounded-md border border-orange-200 text-center font-medium"
                          >
                            {ability}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Indicador de seleção */}
              {isSelected && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full border border-blue-300">
                  ✓ Selecionado
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navegação */}
      <div className="flex justify-between items-center pt-8 border-t border-gray-200">
        <button 
          onClick={onPrevious} 
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
        >
          ← Anterior
        </button>
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