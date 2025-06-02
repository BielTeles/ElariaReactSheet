import React, { useState } from 'react';
import { Check, Zap } from 'lucide-react';
import { CharacterCreation } from '../../../types/character';
import { classes } from '../../../data/classes';

interface ClassStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ClassStep: React.FC<ClassStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [selectedClass, setSelectedClass] = useState<string | undefined>(data.mainClass);

  const handleClassSelection = (classId: string) => {
    setSelectedClass(classId);
    onUpdate({
      ...data,
      mainClass: classId
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-slate-800 mb-3">Escolha sua Classe</h3>
        <p className="text-lg text-slate-600">
          Sua classe define suas habilidades principais e estilo de jogo
        </p>
      </div>

      {/* Grid de Classes */}
      <div className="grid md:grid-cols-2 gap-6">
        {Object.values(classes).map((cls) => {
          const isSelected = selectedClass === cls.id;
          
          return (
            <div
              key={cls.id}
              onClick={() => handleClassSelection(cls.id)}
              className={`relative bg-white rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md p-6 ${
                isSelected 
                  ? 'border-blue-400 shadow-lg bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Cabeçalho com ícone */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Zap className="text-white" size={20} />
                </div>
                {isSelected && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="text-white" size={16} />
                  </div>
                )}
              </div>

              {/* Nome e Descrição */}
              <h4 className="text-xl font-bold text-slate-800 mb-3">{cls.name}</h4>
              <p className="text-slate-600 mb-4 leading-relaxed">{cls.description}</p>

              {/* Estatísticas */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-slate-600 font-medium">Dado de Vida:</span>
                  <span className="font-bold text-slate-800">d{cls.hitDie}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-slate-600 font-medium">PV por Nível:</span>
                  <span className="font-bold text-slate-800">{cls.hitPointsPerLevel}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-slate-600 font-medium">PM Base:</span>
                  <span className="font-bold text-slate-800">{cls.manaPointsBase}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-slate-600 font-medium">Perícias:</span>
                  <span className="font-bold text-slate-800">{cls.skillChoices} escolhas</span>
                </div>
                {cls.vigorBase && (
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded border border-yellow-200">
                    <span className="text-yellow-700 font-medium">Vigor Base:</span>
                    <span className="font-bold text-yellow-800">{cls.vigorBase} + CON</span>
                  </div>
                )}
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
          disabled={!selectedClass}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
        >
          Próximo →
        </button>
      </div>
    </div>
  );
};

export default ClassStep; 