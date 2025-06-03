import React, { useState } from 'react';
import { CharacterCreation } from '../../../types/character';
import { origins } from '../../../data/origins';
import { BookOpen, Star, Users } from 'lucide-react';

interface OriginStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const OriginStep: React.FC<OriginStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [selectedOrigin, setSelectedOrigin] = useState<string | undefined>(data.origin);

  const handleOriginSelection = (originId: string) => {
    setSelectedOrigin(originId);
    onUpdate({
      ...data,
      origin: originId
    });
  };

  const getOriginIcon = (originId: string) => {
    switch(originId) {
      case 'sobrevivente-brasas': return '🔥';
      case 'guarda-harmonia': return '🛡️';
      case 'iniciado-florestas': return '🌲';
      case 'erudito-biblioteca': return '📚';
      case 'artista-itinerante': return '🎭';
      case 'veterano-guerras': return '⚔️';
      default: return '📖';
    }
  };

  const canProceed = !!selectedOrigin;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-3">Escolha sua Origem</h3>
        <p className="text-slate-600">
          Todo aventureiro tem um passado. Sua origem representa sua história antes da jornada começar
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.values(origins).map((origin) => (
          <div
            key={origin.id}
            onClick={() => handleOriginSelection(origin.id)}
            className={`bg-white rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg p-6 ${
              selectedOrigin === origin.id 
                ? 'border-blue-400 bg-blue-50 shadow-lg transform scale-105' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="text-3xl">{getOriginIcon(origin.id)}</div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-slate-800 mb-2">{origin.name}</h4>
                {selectedOrigin === origin.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4 leading-relaxed">{origin.description}</p>

            {/* Perícias Treinadas */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800 text-sm">Perícias Treinadas:</span>
              </div>
              <div className="flex gap-2">
                {origin.trainedSkills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefício */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-800 text-sm">{origin.benefit.name}:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{origin.benefit.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Informação adicional */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h5 className="font-semibold text-blue-800 mb-2">💡 Sobre as Origens</h5>
            <div className="text-blue-700 text-sm space-y-1">
              <p>• <strong>Perícias Treinadas:</strong> Duas perícias que começam com Valor 1 (gratuito)</p>
              <p>• <strong>Benefício:</strong> Uma habilidade especial única relacionada ao seu passado</p>
              <p>• <strong>Independente:</strong> Sua origem é separada de raça e classe - representa sua história pessoal</p>
            </div>
          </div>
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
          {!canProceed && (
            <p className="text-sm text-orange-600 mb-2">
              Selecione uma origem para continuar
            </p>
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

export default OriginStep; 