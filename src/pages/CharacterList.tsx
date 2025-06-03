import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CharacterStorage, SavedCharacter } from '../utils/characterStorage';
import SaveSettings from '../components/SaveSettings';
import SaveIndicator from '../components/SaveIndicator';
import { 
  Plus, User, Calendar, Eye, Trash2, Copy, Download, Upload, 
  BarChart3, Sparkles, Heart, Zap, Flame, Crown, Star,
  Search, Filter, MoreVertical, FileText, Save, Settings
} from 'lucide-react';

const CharacterList: React.FC = () => {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<SavedCharacter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterRace, setFilterRace] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [showSaveSettings, setShowSaveSettings] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Carregar personagens salvos
  useEffect(() => {
    loadCharacters();
    // Atualizar timestamp do último save
    const stats = CharacterStorage.getStats();
    setLastSaved(stats.lastBackup);
  }, []);

  const loadCharacters = () => {
    const savedCharacters = CharacterStorage.getAllCharacters();
    setCharacters(savedCharacters);
  };

  // Filtrar personagens
  const filteredCharacters = characters.filter(char => {
    const matchesSearch = char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         char.data.race?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         char.data.mainClass?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = !filterClass || char.data.mainClass === filterClass;
    const matchesRace = !filterRace || char.data.race === filterRace;
    
    return matchesSearch && matchesClass && matchesRace;
  });

  // Obter classes e raças únicas para filtros
  const uniqueClasses = Array.from(new Set(characters.map(c => c.data.mainClass).filter(Boolean)));
  const uniqueRaces = Array.from(new Set(characters.map(c => c.data.race).filter(Boolean)));

  // Ações de personagem
  const viewCharacter = (character: SavedCharacter) => {
    navigate('/character-sheet', {
      state: {
        characterData: character.data,
        characterId: character.id
      }
    });
  };

  const duplicateCharacter = (character: SavedCharacter) => {
    const duplicated = CharacterStorage.duplicateCharacter(character.id);
    if (duplicated) {
      loadCharacters();
      alert(`Personagem "${duplicated.name}" duplicado com sucesso!`);
    }
  };

  const deleteCharacter = (character: SavedCharacter) => {
    if (window.confirm(`Tem certeza que deseja deletar "${character.name}"?`)) {
      const success = CharacterStorage.deleteCharacter(character.id);
      if (success) {
        loadCharacters();
        alert('Personagem deletado com sucesso!');
      }
    }
  };

  const exportCharacter = (character: SavedCharacter) => {
    const jsonData = CharacterStorage.exportCharacter(character.id);
    if (jsonData) {
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${character.name.replace(/[^a-z0-9]/gi, '_')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const importCharacter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const imported = CharacterStorage.importCharacter(jsonData);
        if (imported) {
          loadCharacters();
          alert(`Personagem "${imported.name}" importado com sucesso!`);
        } else {
          alert('Erro ao importar personagem. Verifique o arquivo.');
        }
      } catch (error) {
        alert('Arquivo inválido.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const getClassIcon = (className?: string) => {
    switch (className) {
      case 'evocador': return <Sparkles className="w-4 h-4" />;
      case 'titã': return <Heart className="w-4 h-4" />;
      case 'sentinela': return <Eye className="w-4 h-4" />;
      case 'elo': return <Zap className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getResourceColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage > 60) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const stats = CharacterStorage.getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Meus Personagens</h1>
              <p className="text-slate-600">
                {characters.length} personagem{characters.length !== 1 ? 's' : ''} criado{characters.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Botão de Configurações */}
              <button
                onClick={() => setShowSaveSettings(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Configurações
              </button>

              {/* Botão de Estatísticas */}
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Estatísticas
              </button>

              {/* Import */}
              <label className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                Importar
                <input
                  type="file"
                  accept=".json"
                  onChange={importCharacter}
                  className="hidden"
                />
              </label>

              {/* Criar Novo */}
              <button
                onClick={() => navigate('/characters/new')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Criar Personagem
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Estatísticas (Modal) */}
        {showStats && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">📊 Estatísticas</h2>
                <button 
                  onClick={() => setShowStats(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">Classes Mais Populares</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.classes).map(([className, count]) => (
                      <div key={className} className="flex items-center justify-between">
                        <span className="capitalize">{className}</span>
                        <span className="font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">Raças Mais Populares</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.races).map(([raceName, count]) => (
                      <div key={raceName} className="flex items-center justify-between">
                        <span className="capitalize">{raceName}</span>
                        <span className="font-bold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">Sistema de Salvamento</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Versões no histórico</span>
                      <span className="font-bold">{stats.totalVersions || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Último backup</span>
                      <span className="font-bold text-xs">
                        {stats.lastBackup 
                          ? stats.lastBackup.toLocaleDateString('pt-BR')
                          : 'Nunca'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Auto-save</span>
                      <span className={`font-bold text-xs ${
                        CharacterStorage.getConfig().enabled 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {CharacterStorage.getConfig().enabled ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">Informações Gerais</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Total de personagens</span>
                      <span className="font-bold">{stats.total}</span>
                    </div>
                    {stats.oldestCreation && (
                      <div className="flex items-center justify-between">
                        <span>Primeiro criado</span>
                        <span className="font-bold text-xs">
                          {stats.oldestCreation.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                    {stats.newestCreation && (
                      <div className="flex items-center justify-between">
                        <span>Mais recente</span>
                        <span className="font-bold text-xs">
                          {stats.newestCreation.toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center text-gray-600">
                  <p className="text-sm mb-2">
                    Sistema de salvamento com backup automático e histórico de versões
                  </p>
                  <button
                    onClick={() => {
                      setShowStats(false);
                      setShowSaveSettings(true);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    Configurar Salvamento
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros e Busca */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nome, classe ou raça..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Classe</label>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas as Classes</option>
                {uniqueClasses.map(cls => (
                  <option key={cls} value={cls} className="capitalize">{cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Raça</label>
              <select
                value={filterRace}
                onChange={(e) => setFilterRace(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas as Raças</option>
                {uniqueRaces.map(race => (
                  <option key={race} value={race} className="capitalize">{race}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterClass('');
                  setFilterRace('');
                }}
                className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Personagens */}
        {filteredCharacters.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {characters.length === 0 ? 'Nenhum personagem criado' : 'Nenhum personagem encontrado'}
            </h3>
            <p className="text-gray-500 mb-6">
              {characters.length === 0 
                ? 'Comece criando seu primeiro herói de Elaria!'
                : 'Tente ajustar os filtros de busca.'}
            </p>
            {characters.length === 0 && (
              <button
                onClick={() => navigate('/characters/new')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
              >
                Criar Primeiro Personagem
              </button>
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCharacters.map((character) => (
              <div key={character.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                
                {/* Header do Card */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                        {getClassIcon(character.data.mainClass)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{character.name}</h3>
                        <p className="text-blue-100 text-sm">
                          {character.data.race} • {character.data.mainClass}
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <button
                        onClick={() => setSelectedCharacter(selectedCharacter === character.id ? null : character.id)}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {selectedCharacter === character.id && (
                        <div className="absolute right-0 top-full mt-2 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200 min-w-48 z-10">
                          <button
                            onClick={() => {
                              viewCharacter(character);
                              setSelectedCharacter(null);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Ver Ficha
                          </button>
                          <button
                            onClick={() => {
                              duplicateCharacter(character);
                              setSelectedCharacter(null);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicar
                          </button>
                          <button
                            onClick={() => {
                              exportCharacter(character);
                              setSelectedCharacter(null);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Exportar
                          </button>
                          <button
                            onClick={() => {
                              deleteCharacter(character);
                              setSelectedCharacter(null);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Deletar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-4">
                  {/* Recursos */}
                  <div className="space-y-3 mb-4">
                    {/* HP */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium">PV</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${getResourceColor(character.state.currentHP, character.data.hitPoints || 1)}`}
                            style={{ width: `${Math.max(0, (character.state.currentHP / (character.data.hitPoints || 1)) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold">
                          {character.state.currentHP}/{character.data.hitPoints}
                        </span>
                      </div>
                    </div>

                    {/* MP */}
                    {character.data.manaPoints && character.data.manaPoints > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium">PM</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${getResourceColor(character.state.currentMP, character.data.manaPoints)}`}
                              style={{ width: `${Math.max(0, (character.state.currentMP / character.data.manaPoints) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold">
                            {character.state.currentMP}/{character.data.manaPoints}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Vigor */}
                    {character.data.vigorPoints && character.data.vigorPoints > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="text-sm font-medium">Vigor</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${getResourceColor(character.state.currentVigor, character.data.vigorPoints)}`}
                              style={{ width: `${Math.max(0, (character.state.currentVigor / character.data.vigorPoints) * 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold">
                            {character.state.currentVigor}/{character.data.vigorPoints}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Informações Adicionais */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      Criado em {character.createdAt.toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Save className="w-3 h-3" />
                      Modificado em {character.lastModified.toLocaleDateString('pt-BR')}
                    </div>
                    {character.state.rollHistory.length > 0 && (
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        {character.state.rollHistory.length} rolagens realizadas
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer do Card */}
                <div className="bg-gray-50 px-4 py-3">
                  <button
                    onClick={() => viewCharacter(character)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Ver Ficha Completa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Indicador de Salvamento */}
      <div className="fixed bottom-4 right-4 z-40">
        <SaveIndicator
          status="idle"
          lastSaved={lastSaved || undefined}
          autoSaveEnabled={CharacterStorage.getConfig().enabled}
        />
      </div>

      {/* Modal de Configurações de Salvamento */}
      <SaveSettings
        isOpen={showSaveSettings}
        onClose={() => {
          setShowSaveSettings(false);
          loadCharacters(); // Recarregar caso algo tenha mudado
        }}
      />
    </div>
  );
};

export default CharacterList; 