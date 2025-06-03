import React, { useState } from 'react';
import { CharacterCreation } from '../../../types/character';
import { deities } from '../../../data/deities';
import { BookOpen, Star, Zap, Users, Sparkles, Shield } from 'lucide-react';

interface DeityStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const DeityStep: React.FC<DeityStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [selectedDeity, setSelectedDeity] = useState<string | null>(data.deity || null);

  const handleDeitySelection = (deity: string | null) => {
    setSelectedDeity(deity);
    onUpdate({
      ...data,
      deity: deity
    });
  };

  // Obter ícone temático para cada divindade
  const getDeityIcon = (deityId: string | null) => {
    switch (deityId) {
      case 'ignis': return '🔥';
      case 'ondina': return '🌊';
      case 'terrus': return '🌍';
      case 'zephyrus': return '💨';
      case 'lumina': return '☀️';
      case 'noctus': return '🌙';
      default: return '⚪';
    }
  };

  // Obter cor temática para cada divindade
  const getDeityColor = (deityId: string | null) => {
    switch (deityId) {
      case 'ignis': return 'border-red-400 bg-red-50';
      case 'ondina': return 'border-blue-400 bg-blue-50';
      case 'terrus': return 'border-green-400 bg-green-50';
      case 'zephyrus': return 'border-cyan-400 bg-cyan-50';
      case 'lumina': return 'border-yellow-400 bg-yellow-50';
      case 'noctus': return 'border-purple-400 bg-purple-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-3">Escolha seu Patrono</h3>
        <p className="text-slate-600 mb-4">
          Os <strong>Primeiros</strong> são as seis grandes entidades que diferenciaram os Elementos. 
          Escolher um patrono é opcional, mas oferece benefícios especiais.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Seleção opcional - você pode escolher "Nenhum Patrono"</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Divindades */}
        {Object.values(deities).map((deity) => (
          <div
            key={deity.id}
            onClick={() => handleDeitySelection(deity.id)}
            className={`bg-white rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg p-6 ${
              selectedDeity === deity.id 
                ? `${getDeityColor(deity.id)} shadow-lg transform scale-105` 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl">{getDeityIcon(deity.id)}</div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-slate-800 mb-1">{deity.name}</h4>
                <p className="text-sm font-medium text-slate-600 italic mb-3">{deity.title}</p>
                {selectedDeity === deity.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-4 leading-relaxed">{deity.description}</p>

            {/* Domínios */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-indigo-800 text-sm">Domínios:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {deity.domains.map((domain) => (
                  <span 
                    key={domain}
                    className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>

            {/* Essências */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-800 text-sm">Essências:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {deity.essences.map((essence) => (
                  <span 
                    key={essence}
                    className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
                  >
                    {essence}
                  </span>
                ))}
              </div>
            </div>

            {/* Seguidores */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-teal-600" />
                <span className="font-medium text-teal-800 text-sm">Seguidores típicos:</span>
              </div>
              <p className="text-xs text-slate-600">{deity.followers.join(', ')}</p>
            </div>

            {/* Perícia Treinada */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800 text-sm">Perícia Treinada:</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {deity.trainedSkill}
              </span>
            </div>

            {/* Benefício */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-800 text-sm">{deity.benefit.name}:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-purple-50 p-2 rounded border border-purple-200">
                {deity.benefit.description}
              </p>
            </div>
          </div>
        ))}

        {/* Opção Nenhum Patrono */}
        <div
          onClick={() => handleDeitySelection(null)}
          className={`bg-white rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg p-6 ${
            selectedDeity === null 
              ? 'border-gray-400 bg-gray-50 shadow-lg transform scale-105' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="text-4xl">⚪</div>
            <div className="flex-1">
              <h4 className="text-xl font-bold text-slate-800 mb-1">Nenhum Patrono</h4>
              <p className="text-sm font-medium text-slate-600 italic mb-3">Caminho independente</p>
              {selectedDeity === null && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            Você escolhe não seguir nenhum dos Primeiros, preferindo confiar em sua própria força e determinação. 
            Alguns aventureiros encontram poder na independência e na autodeterminação.
          </p>

          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700">
              <span className="text-sm">Sem benefícios especiais, mas também sem obrigações</span>
            </div>
          </div>
        </div>
      </div>

      {/* Informação adicional */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h5 className="font-semibold text-blue-800 mb-2">💡 Sobre os Patronos</h5>
            <div className="text-blue-700 text-sm space-y-1">
              <p>• <strong>Opcional:</strong> Escolher um patrono é completamente opcional</p>
              <p>• <strong>Perícia Treinada:</strong> Cada patrono oferece uma perícia que começa com Valor 1</p>
              <p>• <strong>Benefício Único:</strong> Cada patrono concede uma habilidade especial temática</p>
              <p>• <strong>Interpretação:</strong> Pode ser fé religiosa, filosofia, herança ancestral ou sintonia natural</p>
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
          <p className="text-sm text-gray-600">
            {selectedDeity 
              ? `Patrono selecionado: ${deities[selectedDeity]?.name || 'Nenhum'}`
              : 'Nenhum patrono selecionado'
            }
          </p>
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

export default DeityStep; 