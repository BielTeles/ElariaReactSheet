import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Users, Eye, Edit, Trash2 } from 'lucide-react';
import { Character } from '../types/character';

const CharacterList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data - será substituído por dados reais do localStorage/backend
  const [characters] = useState<Character[]>([
    // Em breve teremos personagens aqui
  ]);

  const filteredCharacters = characters.filter(char =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-fantasy font-bold text-slate-800">Meus Personagens</h1>
          <p className="text-slate-600 mt-1">Gerencie seus heróis de Elaria</p>
        </div>
        <Link
          to="/characters/new"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Novo Personagem</span>
        </Link>
      </div>

      {/* Search and filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar personagens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-agua-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Character grid */}
      {filteredCharacters.length === 0 ? (
        <div className="card text-center py-12">
          <Users className="w-24 h-24 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">
            {characters.length === 0 ? 'Nenhum personagem criado' : 'Nenhum resultado encontrado'}
          </h3>
          <p className="text-slate-500 mb-6">
            {characters.length === 0 
              ? 'Comece criando seu primeiro herói de Elaria!' 
              : 'Tente ajustar sua busca ou criar um novo personagem.'
            }
          </p>
          <Link
            to="/characters/new"
            className="btn-primary"
          >
            Criar Primeiro Personagem
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.map((character) => (
            <div key={character.id} className="card hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">{character.name}</h3>
                  <p className="text-slate-600">
                    {character.race} • {character.mainClass} • Nível {character.level}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Link
                    to={`/characters/${character.id}`}
                    className="p-2 text-slate-400 hover:text-agua-500 transition-colors"
                    title="Visualizar ficha"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    className="p-2 text-slate-400 hover:text-fogo-500 transition-colors"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">PV:</span>
                  <span className="text-sm font-medium">
                    {character.hitPoints.current}/{character.hitPoints.maximum}
                  </span>
                </div>
                {character.manaPoints.maximum > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">PM:</span>
                    <span className="text-sm font-medium">
                      {character.manaPoints.current}/{character.manaPoints.maximum}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-400">
                  Criado em {new Date(character.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterList; 