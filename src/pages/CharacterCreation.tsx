import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, User } from 'lucide-react';
import CharacterWizard from '../components/CharacterWizard/WizardContainer';
import { useAuth } from '../contexts/AuthContext';

const CharacterCreation: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header Melhorado */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl border-4 border-purple-300">
        <div className="flex items-center space-x-4 mb-4">
          <Link 
            to="/characters" 
            className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors border-2 border-white/30 hover:border-white/50"
          >
            <ArrowLeft size={24} className="text-white" />
          </Link>
          <div className="flex items-center space-x-3">
            <Sparkles size={32} className="text-yellow-300" />
            <div>
              <h1 className="text-4xl font-fantasy font-bold">Criar Personagem</h1>
              <p className="text-purple-100 text-lg font-medium">Forje seu herói de Elaria</p>
            </div>
          </div>
        </div>
        
        {/* Informações do usuário */}
        {user && (
          <div className="bg-white/10 rounded-lg p-4 border-2 border-white/20 mb-4">
            <div className="flex items-center space-x-3 mb-2">
              <User size={20} className="text-white/80" />
              <span className="text-white/90 font-medium">
                Criando personagem para: <span className="text-yellow-300 font-bold">{user.username}</span>
              </span>
            </div>
            <p className="text-white/80 text-sm">
              Este personagem será salvo em sua conta e estará disponível em todos os seus dispositivos.
            </p>
          </div>
        )}
        
        <div className="bg-white/10 rounded-lg p-4 border-2 border-white/20">
          <p className="text-white/90 font-medium">
            🎲 Bem-vindo ao assistente de criação! Siga os passos para criar seu personagem único no mundo de Elaria.
          </p>
        </div>
      </div>

      {/* Character Wizard */}
      <CharacterWizard />
    </div>
  );
};

export default CharacterCreation; 