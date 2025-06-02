import React from 'react';
import { CharacterCreation } from '../../../types/character';
import { Check } from 'lucide-react';

interface SummaryStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ data }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Resumo do Personagem</h3>
        <p className="text-slate-600">Revise as informações antes de finalizar</p>
      </div>

      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-natureza-500 to-agua-500 rounded-full flex items-center justify-center">
            <Check className="text-white" size={24} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-800">
              {data.personalDetails?.name || 'Personagem sem nome'}
            </h4>
            <p className="text-slate-600">
              {data.race} • {data.mainClass} • {data.subclass}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-slate-700 mb-3">Atributos</h5>
            <div className="space-y-2">
              {Object.entries(data.attributes || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-slate-600 capitalize">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-slate-700 mb-3">Características</h5>
            <div className="space-y-2 text-sm">
              <p><strong>Raça:</strong> {data.race}</p>
              <p><strong>Classe:</strong> {data.mainClass}</p>
              <p><strong>Subclasse:</strong> {data.subclass}</p>
              <p><strong>Origem:</strong> {data.origin}</p>
              <p><strong>Patrono:</strong> {data.deity || 'Nenhum'}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h5 className="font-semibold text-slate-700 mb-3">Perícias Selecionadas</h5>
          <div className="flex flex-wrap gap-2">
            {data.selectedSkills?.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-agua-100 text-agua-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStep; 