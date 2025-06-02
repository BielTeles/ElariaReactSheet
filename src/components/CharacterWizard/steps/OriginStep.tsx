import React, { useState } from 'react';
import { CharacterCreation, Origin } from '../../../types/character';

interface OriginStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const OriginStep: React.FC<OriginStepProps> = ({ data, onUpdate }) => {
  const [selectedOrigin, setSelectedOrigin] = useState<Origin | undefined>(data.origin);

  const handleOriginSelection = (origin: Origin) => {
    setSelectedOrigin(origin);
    onUpdate({
      ...data,
      origin
    });
  };

  const origins: { id: Origin; name: string }[] = [
    { id: 'sobrevivente-brasas', name: 'Sobrevivente do Círculo de Brasas' },
    { id: 'guarda-harmonia', name: 'Guarda de Harmonia' },
    { id: 'iniciado-florestas', name: 'Iniciado das Florestas' },
    { id: 'erudito-biblioteca', name: 'Erudito da Biblioteca' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Escolha sua Origem</h3>
        <p className="text-slate-600">Seu passado molda quem você é hoje</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {origins.map((origin) => (
          <div
            key={origin.id}
            onClick={() => handleOriginSelection(origin.id)}
            className={`card cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedOrigin === origin.id ? 'ring-2 ring-agua-400' : ''
            }`}
          >
            <h4 className="text-lg font-bold text-slate-800">{origin.name}</h4>
            <p className="text-sm text-slate-600">Descrição da origem</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OriginStep; 