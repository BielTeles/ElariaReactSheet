import React, { useState } from 'react';
import { CharacterCreation, Deity } from '../../../types/character';

interface DeityStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const DeityStep: React.FC<DeityStepProps> = ({ data, onUpdate }) => {
  const [selectedDeity, setSelectedDeity] = useState<Deity>(data.deity || null);

  const handleDeitySelection = (deity: Deity) => {
    setSelectedDeity(deity);
    onUpdate({
      ...data,
      deity
    });
  };

  const deities: { id: Deity; name: string }[] = [
    { id: 'ignis', name: 'Ignis, a Primeira Chama' },
    { id: 'ondina', name: 'Ondina, a Mãe das Águas' },
    { id: 'terrus', name: 'Terrus, o Guardião dos Solos' },
    { id: null, name: 'Nenhum Patrono' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Escolha seu Patrono</h3>
        <p className="text-slate-600">Os Primeiros oferecem orientação (opcional)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {deities.map((deity) => (
          <div
            key={deity.id || 'none'}
            onClick={() => handleDeitySelection(deity.id)}
            className={`card cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedDeity === deity.id ? 'ring-2 ring-agua-400' : ''
            }`}
          >
            <h4 className="text-lg font-bold text-slate-800">{deity.name}</h4>
            <p className="text-sm text-slate-600">Descrição do patrono</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeityStep; 