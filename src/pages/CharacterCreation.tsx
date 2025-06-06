import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CharacterWizard from '../components/CharacterWizard/WizardContainer';

const CharacterCreation: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link 
          to="/characters" 
          className="p-2 text-contrast-medium hover:text-contrast-high transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-fantasy font-bold text-contrast-high">Criar Personagem</h1>
          <p className="text-contrast-medium mt-1">Forje seu herói de Elaria</p>
        </div>
      </div>

      {/* Character Wizard */}
      <CharacterWizard />
    </div>
  );
};

export default CharacterCreation; 