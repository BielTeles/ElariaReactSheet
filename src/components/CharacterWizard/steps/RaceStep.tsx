import React, { useState } from 'react';
import { Check, Users, Star, Move } from 'lucide-react';
import { CharacterCreation } from '../../../types/character';
import { races } from '../../../data/races';

interface RaceStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const RaceStep: React.FC<RaceStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [selectedRace, setSelectedRace] = useState<string | undefined>(data.race);

  const handleRaceSelection = (raceId: string) => {
    setSelectedRace(raceId);
    onUpdate({
      ...data,
      race: raceId
    });
  };

  const getElementColor = (raceId: string): string => {
    const colorMap: { [key: string]: string } = {
      alari: 'terra',
      roknar: 'fogo', 
      kain: 'agua',
      faelan: 'natureza',
      celeres: 'natureza',
      aurien: 'luz',
      vesperi: 'sombra'
    };
    return colorMap[raceId] || 'slate';
  };

  const getAttributeName = (attr: string): string => {
    const names: { [key: string]: string } = {
      forca: 'Força',
      destreza: 'Destreza', 
      constituicao: 'Constituição',
      inteligencia: 'Inteligência',
      sabedoria: 'Sabedoria',
      carisma: 'Carisma'
    };
    return names[attr] || attr;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Escolha sua Raça</h3>
        <p className="text-slate-600">
          As raças de Elaria possuem conexões elementais e habilidades únicas
        </p>
      </div>

      {/* Selected race preview */}
      {selectedRace && (
        <div className="card bg-gradient-to-r from-green-50 to-yellow-50">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 bg-gradient-to-br from-${getElementColor(selectedRace)}-500 to-${getElementColor(selectedRace)}-600 rounded-full flex items-center justify-center`}>
              <Users className="text-white" size={28} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800">{races[selectedRace].name}</h4>
              <p className="text-slate-600">Raça selecionada</p>
            </div>
            <div className="ml-auto">
              <div className="flex items-center space-x-2 text-natureza-600">
                <Check size={20} />
                <span className="font-semibold">Selecionado</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Race selection grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(races).map((race) => {
          const isSelected = selectedRace === race.id;
          const elementColor = getElementColor(race.id);
          
          return (
            <div
              key={race.id}
              onClick={() => handleRaceSelection(race.id)}
              className={`card cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                isSelected
                  ? `ring-2 ring-${elementColor}-400 shadow-lg`
                  : 'hover:shadow-md'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br from-${elementColor}-500 to-${elementColor}-600 rounded-lg flex items-center justify-center`}>
                  <Users className="text-white" size={20} />
                </div>
                {isSelected && (
                  <div className={`w-6 h-6 bg-${elementColor}-500 rounded-full flex items-center justify-center`}>
                    <Check className="text-white" size={14} />
                  </div>
                )}
              </div>

              {/* Race name and description */}
              <h4 className="text-lg font-bold text-slate-800 mb-2">{race.name}</h4>
              <p className="text-sm text-slate-600 mb-4 line-clamp-3">{race.description}</p>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className={`text-${elementColor}-500`} size={16} />
                    <span className="text-sm font-medium text-slate-700">Bônus de Atributo</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    +{race.bonusValue} {getAttributeName(race.attributeBonus)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Move className={`text-${elementColor}-500`} size={16} />
                    <span className="text-sm font-medium text-slate-700">Deslocamento</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">
                    {race.baseMovement}m
                  </span>
                </div>
              </div>

              {/* Traits preview */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <h5 className="text-sm font-semibold text-slate-700 mb-2">Habilidades Raciais:</h5>
                <div className="space-y-1">
                  {race.traits.slice(0, 2).map((trait, index) => (
                    <p key={index} className="text-xs text-slate-600">
                      • {trait.split(':')[0]}
                    </p>
                  ))}
                  {race.traits.length > 2 && (
                    <p className="text-xs text-slate-500">
                      ... e mais {race.traits.length - 2} habilidades
                    </p>
                  )}
                </div>
              </div>

              {/* Patron */}
              {race.patron && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    <strong>Patrono:</strong> {race.patron}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed view for selected race */}
      {selectedRace && (
        <div className="card bg-white">
          <h4 className="text-xl font-bold text-slate-800 mb-4">
            Detalhes: {races[selectedRace].name}
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-slate-700 mb-3">Descrição Completa</h5>
              <p className="text-sm text-slate-600 mb-4">{races[selectedRace].description}</p>
              
              <h5 className="font-semibold text-slate-700 mb-3">Características</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Bônus de Atributo:</span>
                  <span className="text-sm font-medium text-slate-800">
                    +{races[selectedRace].bonusValue} {getAttributeName(races[selectedRace].attributeBonus)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Deslocamento Base:</span>
                  <span className="text-sm font-medium text-slate-800">
                    {races[selectedRace].baseMovement} metros
                  </span>
                </div>
                {races[selectedRace].patron && (
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Patrono Elemental:</span>
                    <span className="text-sm font-medium text-slate-800">
                      {races[selectedRace].patron}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h5 className="font-semibold text-slate-700 mb-3">Habilidades Raciais</h5>
              <div className="space-y-3">
                {races[selectedRace].traits.map((trait, index) => {
                  const [name, description] = trait.split(': ');
                  return (
                    <div key={index} className="bg-slate-50 p-3 rounded-lg">
                      <h6 className="font-medium text-slate-800 text-sm">{name}</h6>
                      {description && (
                        <p className="text-xs text-slate-600 mt-1">{description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaceStep; 