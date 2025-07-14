import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CampaignService } from '../services/campaignService';
import { CampaignWithDetails } from '../types/campaign';
import CampaignInviteManager from '../components/CampaignInviteManager';
import CampaignCharacterManager from '../components/CampaignCharacterManager';
import { ROUTES } from '../constants';
import { 
  ArrowLeft, Crown, Users, Settings, Share2, 
  Calendar, MapPin, Shield, Scroll, Swords,
  AlertCircle, CheckCircle, Edit, Save, X
} from 'lucide-react';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [campaign, setCampaign] = useState<CampaignWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'invites' | 'combat'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: ''
  });

  // Carregar dados da campanha
  useEffect(() => {
    if (id) {
      loadCampaign();
    }
  }, [id]);

  const loadCampaign = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await CampaignService.getCampaignById(id);
      
      if (!data) {
        setError('Campanha não encontrada');
        return;
      }
      
      setCampaign(data);
      setEditForm({
        name: data.name,
        description: data.description || ''
      });
    } catch (err: any) {
      console.error('Erro ao carregar campanha:', err);
      setError(err.message || 'Erro ao carregar campanha');
    } finally {
      setLoading(false);
    }
  };

  // Salvar alterações
  const handleSave = async () => {
    if (!campaign || !user) return;

    try {
      setError(null);
      const updatedCampaign = await CampaignService.updateCampaign(campaign.id, {
        name: editForm.name,
        description: editForm.description
      });
      
      setCampaign(updatedCampaign);
      setIsEditing(false);
      alert('Campanha atualizada com sucesso!');
    } catch (err: any) {
      console.error('Erro ao atualizar campanha:', err);
      setError(err.message || 'Erro ao atualizar campanha');
    }
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    if (campaign) {
      setEditForm({
        name: campaign.name,
        description: campaign.description || ''
      });
    }
    setIsEditing(false);
  };

  // Verificar se é o dono da campanha
  const isOwner = campaign?.owner_id === user?.id;

  // Obter cor do status
  const getStatusColor = () => {
    if (!campaign) return 'text-gray-500';
    return campaign.is_active ? 'text-green-500' : 'text-red-500';
  };

  // Obter texto do status
  const getStatusText = () => {
    if (!campaign) return 'Desconhecido';
    return campaign.is_active ? 'Ativa' : 'Inativa';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate(ROUTES.CAMPAIGNS)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar às Campanhas
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(ROUTES.CAMPAIGNS)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar às Campanhas
            </button>
            
            {isOwner && (
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Salvar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Informações da Campanha */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Campanha
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Scroll className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {campaign.name}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Crown className="w-4 h-4" />
                        <span>{campaign.master_info.username}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{campaign.member_count} membros</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className={`w-4 h-4 ${getStatusColor()}`} />
                        <span className={getStatusColor()}>{getStatusText()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {campaign.description && (
                  <p className="text-gray-700 leading-relaxed">
                    {campaign.description}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'overview'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Visão Geral
                </button>
                <button
                  onClick={() => setActiveTab('characters')}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'characters'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Personagens
                </button>
                {isOwner && (
                  <button
                    onClick={() => setActiveTab('invites')}
                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'invites'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Convites
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('combat')}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'combat'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Combate
                </button>
              </nav>
            </div>

            {/* Conteúdo das Tabs */}
            <div className="p-8">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                      <div className="flex items-center gap-3">
                        <Users className="w-8 h-8" />
                        <div>
                          <p className="text-blue-100">Membros</p>
                          <p className="text-2xl font-bold">{campaign.member_count}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                      <div className="flex items-center gap-3">
                        <Swords className="w-8 h-8" />
                        <div>
                          <p className="text-purple-100">Personagens</p>
                          <p className="text-2xl font-bold">{campaign.character_count}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-8 h-8" />
                        <div>
                          <p className="text-green-100">Criada em</p>
                          <p className="text-lg font-bold">
                            {new Date(campaign.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Configurações da Campanha
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Compartilhamento de Personagens</span>
                        <span className={`font-medium ${
                          campaign.settings.allow_character_sharing ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {campaign.settings.allow_character_sharing ? 'Habilitado' : 'Desabilitado'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Backup Automático</span>
                        <span className={`font-medium ${
                          campaign.settings.auto_backup ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {campaign.settings.auto_backup ? 'Habilitado' : 'Desabilitado'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Máx. Personagens por Jogador</span>
                        <span className="font-medium text-gray-900">
                          {campaign.settings.max_characters_per_player}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Multiclasse</span>
                        <span className={`font-medium ${
                          campaign.settings.rules.allow_multiclass ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {campaign.settings.rules.allow_multiclass ? 'Permitido' : 'Não Permitido'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'characters' && (
                <CampaignCharacterManager
                  campaignId={campaign.id}
                  campaignName={campaign.name}
                  isOwner={isOwner}
                  allowCharacterSharing={campaign.settings.allow_character_sharing}
                />
              )}

              {activeTab === 'invites' && isOwner && (
                <CampaignInviteManager
                  campaignId={campaign.id}
                  campaignName={campaign.name}
                  isOwner={isOwner}
                />
              )}

              {activeTab === 'combat' && (
                <div className="text-center py-12">
                  <Swords className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Rastreador de Combate
                  </h3>
                  <p className="text-gray-600 mb-6">
                    O rastreador de combate será implementado em breve.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg">
                    <Settings className="w-4 h-4" />
                    Em Desenvolvimento
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail; 