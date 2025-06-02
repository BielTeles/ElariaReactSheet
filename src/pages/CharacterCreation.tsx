import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import WizardContainer from '../components/CharacterWizard/WizardContainer';

const CharacterCreation: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/characters"
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-fantasy font-bold text-slate-800">Criar Personagem</h1>
          <p className="text-slate-600 mt-1">Forje seu herói de Elaria</p>
        </div>
      </div>

      {/* Wizard */}
      <WizardContainer />
    </div>
  );
};

export default CharacterCreation; 