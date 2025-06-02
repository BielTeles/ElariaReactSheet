import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const CharacterSheet: React.FC = () => {
  const { id } = useParams<{ id: string }>();

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
          <h1 className="text-3xl font-fantasy font-bold text-slate-800">Ficha do Personagem</h1>
          <p className="text-slate-600 mt-1">ID: {id}</p>
        </div>
      </div>

      {/* Character sheet content */}
      <div className="card">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Ficha Completa em Desenvolvimento
          </h2>
          <p className="text-slate-600 mb-6">
            A visualização completa da ficha de personagem será implementada nas próximas etapas.
          </p>
          <p className="text-sm text-slate-500">
            Incluirá: Atributos, Habilidades, Equipamentos, Histórico e muito mais!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet; 