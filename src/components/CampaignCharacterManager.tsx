import React, { useState, useEffect } from 'react';
import { User, Plus, Eye, Shield, AlertCircle, Users, Settings, Heart, Zap, Sword } from 'lucide-react';
import { CampaignService } from '../services/campaignService';
import { CharacterStorage } from '../utils/characterStorage';
import { CampaignCharacter } from '../types/campaign';
import { Character } from '../types/character';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface CampaignCharacterManagerProps {
  campaignId: string;
  campaignName: string;
  isOwner: boolean;
  allowCharacterSharing: boolean;
}

const CampaignCharacterManager: React.FC<CampaignCharacterManagerProps> = ({
  campaignId,
  campaignName,
  isOwner,
  allowCharacterSharing
}) => {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<CampaignCharacter[]>([]);
  const [availableCharacters, setAvailableCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [linking, setLinking] = useState(false);

  // Carregar personagens da campanha
  useEffect(() => {
    loadCampaignCharacters();
  }, [campaignId]);

  // Carregar personagens disponíveis do usuário
  useEffect(() => {
    if (user) {
      const userCharacters = CharacterStorage.getAllCharacters();
      setAvailableCharacters(userCharacters);
    }
  }, [user]);

  const loadCampaignCharacters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CampaignService.getCampaignCharacters(campaignId);
      setCharacters(data);
    } catch (err: any) {
      console.error('Erro ao carregar personagens:', err);
      setError(err.message || 'Erro ao carregar personagens da campanha');
    } finally {
      setLoading(false);
    }
  };

  // Vincular personagens selecionados
  const handleLinkCharacters = async () => {
    if (!user || selectedCharacters.length === 0) return;

    try {
      setLinking(true);
      setError(null);
      
      await CampaignService.linkCharactersToCampaign(
        campaignId,
        user.id,
        selectedCharacters
      );
      
      // Recarregar personagens
      await loadCampaignCharacters();
      
      setShowLinkModal(false);
      setSelectedCharacters([]);
      alert('Personagens vinculados com sucesso!');
    } catch (err: any) {
      console.error('Erro ao vincular personagens:', err);
      setError(err.message || 'Erro ao vincular personagens');
    } finally {
      setLinking(false);
    }
  };

  // Obter personagens disponíveis para vincular
  const getAvailableCharacters = () => {
    // Primeiro, vamos verificar se temos dados válidos
    if (!characters || !availableCharacters) {
      return [];
    }
    
    // Obter IDs dos personagens já vinculados pelo usuário atual
    const linkedCharacterIds = characters
      .filter(char => char.user_id === user?.id)
      .map(char => {
        // O character_id vem do banco, mas precisamos mapear para o ID local
        // Por enquanto, vamos usar o nome como identificador único
        return char.character_data.personalDetails?.name || '';
      });
    
    return availableCharacters.filter(char => 
      !linkedCharacterIds.includes(char.name)
    );
  };

  // Alternar seleção de personagem
  const toggleCharacterSelection = (characterId: string) => {
    setSelectedCharacters(prev => 
      prev.includes(characterId)
        ? prev.filter(id => id !== characterId)
        : [...prev, characterId]
    );
  };

  // Obter cor da vida baseada na porcentagem
  const getHealthColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Obter cor da mana baseada na porcentagem
  const getManaColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 30) return 'text-purple-600';
    return 'text-red-600';
  };

  // Visualizar personagem
  const viewCharacter = (character: CampaignCharacter) => {
    // Implementar visualização da ficha do personagem
    console.log('Visualizar personagem:', character);
  };

  if (!allowCharacterSharing) {
    return (
      <div className="text-center py-8">
        <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Compartilhamento Desabilitado
        </h3>
        <p className="text-gray-600">
          O compartilhamento de personagens está desabilitado para esta campanha.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Personagens da Campanha
          </h3>
          <p className="text-sm text-gray-600">
            {characters.length} personagens vinculados
          </p>
        </div>
        
        {user && getAvailableCharacters().length > 0 && (
          <button
            onClick={() => setShowLinkModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Vincular Personagens
          </button>
        )}
      </div>

      {/* Erro */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Lista de Personagens */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : characters.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum personagem vinculado
          </h3>
          <p className="text-gray-600 mb-4">
            Os jogadores podem vincular seus personagens à campanha
          </p>
          {user && getAvailableCharacters().length > 0 && (
            <button
              onClick={() => setShowLinkModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Vincular Primeiro Personagem
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((character) => (
            <div
              key={character.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header do Card */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {character.character_data.personalDetails?.name || 'Sem nome'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {character.player_info.username}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => viewCharacter(character)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Visualizar personagem"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {isOwner && (
                    <button
                      className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Configurações"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Informações do Personagem */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Raça/Classe:</span>
                  <span className="font-medium">
                    {character.character_data.race} {character.character_data.mainClass}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Nível:</span>
                  <span className="font-medium">
                    {character.character_data.level || 1}
                  </span>
                </div>
              </div>

              {/* Recursos do Personagem */}
              <div className="mt-4 space-y-2">
                {/* Pontos de Vida */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600">PV</span>
                  </div>
                  <span className={`text-sm font-medium ${getHealthColor(
                    character.character_state.currentHP,
                    character.character_data.hitPoints || 0
                  )}`}>
                    {character.character_state.currentHP} / {character.character_data.hitPoints || 0}
                  </span>
                </div>

                {/* Pontos de Mana */}
                {character.character_data.manaPoints && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600">PM</span>
                    </div>
                    <span className={`text-sm font-medium ${getManaColor(
                      character.character_state.currentMP,
                      character.character_data.manaPoints
                    )}`}>
                      {character.character_state.currentMP} / {character.character_data.manaPoints}
                    </span>
                  </div>
                )}

                {/* Pontos de Vigor */}
                {character.character_data.vigorPoints && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sword className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">Vigor</span>
                    </div>
                    <span className="text-sm font-medium text-yellow-600">
                      {character.character_state.currentVigor} / {character.character_data.vigorPoints}
                    </span>
                  </div>
                )}
              </div>

              {/* Status de Permissões */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Permissões:</span>
                  <div className="flex items-center gap-2">
                    {character.permissions.master_can_view && (
                      <div className="flex items-center gap-1 text-green-600">
                        <Eye className="w-3 h-3" />
                        <span>Visualizar</span>
                      </div>
                    )}
                    {character.permissions.master_can_edit && (
                      <div className="flex items-center gap-1 text-blue-600">
                        <Settings className="w-3 h-3" />
                        <span>Editar</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Vinculação */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Vincular Personagens
                </h2>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <p className="text-gray-600 mb-4">
                Selecione os personagens que deseja vincular à campanha:
              </p>

              {getAvailableCharacters().length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Todos os seus personagens já estão vinculados ou você não tem personagens disponíveis.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {getAvailableCharacters().map((character) => (
                      <label
                        key={character.id}
                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCharacters.includes(character.id)}
                          onChange={() => toggleCharacterSelection(character.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{character.name}</p>
                          <p className="text-sm text-gray-600">
                            {character.data.race} {character.data.mainClass} - Nível {character.data.level || 1}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowLinkModal(false)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleLinkCharacters}
                      disabled={linking || selectedCharacters.length === 0}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {linking ? 'Vinculando...' : `Vincular (${selectedCharacters.length})`}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignCharacterManager; 