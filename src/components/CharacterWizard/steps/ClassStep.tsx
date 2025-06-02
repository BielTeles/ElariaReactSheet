import React, { useState } from 'react';
import { Check, Zap } from 'lucide-react';
import { CharacterCreation, MainClass } from '../../../types/character';
import { classes } from '../../../data/classes';

interface ClassStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ClassStep: React.FC<ClassStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [selectedClass, setSelectedClass] = useState<MainClass | undefined>(data.mainClass);

  const handleClassSelection = (classId: MainClass) => {
    setSelectedClass(classId);
    onUpdate({
      ...data,
      mainClass: classId
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Escolha sua Classe</h3>
        <p className="text-slate-600">
          Sua classe define suas habilidades principais e estilo de jogo
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.values(classes).map((cls) => {
          const isSelected = selectedClass === cls.id;
          
          return (
            <div
              key={cls.id}
              onClick={() => handleClassSelection(cls.id)}
              className={`card cursor-pointer transition-all duration-300 hover:shadow-lg ${
                isSelected ? 'ring-2 ring-agua-400 shadow-lg' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-fogo-500 to-fogo-600 rounded-lg flex items-center justify-center">
                  <Zap className="text-white" size={20} />
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-agua-500 rounded-full flex items-center justify-center">
                    <Check className="text-white" size={14} />
                  </div>
                )}
              </div>

              <h4 className="text-lg font-bold text-slate-800 mb-2">{cls.name}</h4>
              <p className="text-sm text-slate-600 mb-4">{cls.description}</p>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Dado de Vida:</span>
                  <span className="font-medium">d{cls.hitDie}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">PV por Nível:</span>
                  <span className="font-medium">{cls.hitPointsPerLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Perícias:</span>
                  <span className="font-medium">{cls.skillChoices} escolhas</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClassStep; 