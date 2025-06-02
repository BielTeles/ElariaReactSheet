import React, { useState } from 'react';
import { CharacterCreation } from '../../../types/character';

interface SkillsStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const SkillsStep: React.FC<SkillsStepProps> = ({ data, onUpdate }) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(data.selectedSkills || []);

  const availableSkills = [
    'Atletismo', 'Acrobatismo', 'Furtividade', 'Percepção', 
    'Investigação', 'Medicina', 'Persuasão', 'Intimidação'
  ];

  const toggleSkill = (skill: string) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    
    setSelectedSkills(newSkills);
    onUpdate({
      ...data,
      selectedSkills: newSkills
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Escolha suas Perícias</h3>
        <p className="text-slate-600">Selecione as perícias baseadas na sua classe</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableSkills.map((skill) => (
          <div
            key={skill}
            onClick={() => toggleSkill(skill)}
            className={`card cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedSkills.includes(skill) ? 'ring-2 ring-agua-400 bg-agua-50' : ''
            }`}
          >
            <h4 className="text-lg font-semibold text-slate-800">{skill}</h4>
            <p className="text-sm text-slate-600">Descrição da perícia</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsStep; 