import React, { useState } from 'react';
import { CharacterCreation } from '../../../types/character';

interface PersonalDetailsStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({ data, onUpdate }) => {
  const [details, setDetails] = useState(data.personalDetails || {});

  const handleChange = (field: string, value: string) => {
    const newDetails = { ...details, [field]: value };
    setDetails(newDetails);
    onUpdate({
      ...data,
      personalDetails: newDetails
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Detalhes Pessoais</h3>
        <p className="text-slate-600">Defina a identidade do seu personagem</p>
      </div>

      <div className="card">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nome do Personagem *
            </label>
            <input
              type="text"
              value={details.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="input-field"
              placeholder="Digite o nome..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Idade
            </label>
            <input
              type="number"
              value={details.age || ''}
              onChange={(e) => handleChange('age', e.target.value)}
              className="input-field"
              placeholder="Anos..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Altura
            </label>
            <input
              type="text"
              value={details.height || ''}
              onChange={(e) => handleChange('height', e.target.value)}
              className="input-field"
              placeholder="Ex: 1,75m"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            História Pessoal
          </label>
          <textarea
            value={details.backstory || ''}
            onChange={(e) => handleChange('backstory', e.target.value)}
            rows={4}
            className="input-field"
            placeholder="Conte a história do seu personagem..."
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsStep; 