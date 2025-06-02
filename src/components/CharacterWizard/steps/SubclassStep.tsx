import React, { useState } from 'react';
import { CharacterCreation, Subclass } from '../../../types/character';

interface SubclassStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const SubclassStep: React.FC<SubclassStepProps> = ({ data, onUpdate }) => {
  const [selectedSubclass, setSelectedSubclass] = useState<Subclass | undefined>(data.subclass);

  const handleSubclassSelection = (subclass: Subclass) => {
    setSelectedSubclass(subclass);
    onUpdate({
      ...data,
      subclass
    });
  };

  const mockSubclasses: Subclass[] = ['terra', 'agua', 'fogo', 'baluarte'];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Escolha sua Subclasse</h3>
        <p className="text-slate-600">Especialização baseada na sua classe principal</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {mockSubclasses.map((subclass) => (
          <div
            key={subclass}
            onClick={() => handleSubclassSelection(subclass)}
            className={`card cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedSubclass === subclass ? 'ring-2 ring-agua-400' : ''
            }`}
          >
            <h4 className="text-lg font-bold text-slate-800">{subclass}</h4>
            <p className="text-sm text-slate-600">Descrição da subclasse</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubclassStep; 