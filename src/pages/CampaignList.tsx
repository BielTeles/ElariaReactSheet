import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CampaignService } from '../services/campaignService';
import { CampaignWithDetails, CreateCampaignData } from '../types/campaign';
import { CAMPAIGN_CONFIG, CAMPAIGN_MESSAGES } from '../constants';
import { 
  Plus, Users, Calendar, Eye, Share2, Trash2, 
  Search, Filter, Crown, Sword, Scroll,
  Play, Pause, AlertCircle
} from 'lucide-react';

const CampaignList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'owned' | 'member'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Estados do formulário de criação
  const [createForm, setCreateForm] = useState<CreateCampaignData>({
    name: '',
    description: '',
    settings: {
      is_public: false,
      allow_character_sharing: true,
      max_characters_per_player: CAMPAIGN_CONFIG.MAX_CHARACTERS_PER_PLAYER,
      auto_backup: true,
      rules: {
        allow_multiclass: true,
        starting_level: 1,
        use_optional_rules: false
      }
    }
  });

  // Carregar campanhas
  useEffect(() => {
    loadCampaigns();
  }, [user]);

  const loadCampaigns = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await CampaignService.getUserCampaigns(user.id);
      setCampaigns(data);
    } catch (err) {
      console.error('Erro ao carregar campanhas:', err);
      setError('Erro ao carregar campanhas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar campanhas
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'owned' && campaign.owner_id === user?.id) ||
                         (filterStatus === 'member' && campaign.owner_id !== user?.id);
    
    return matchesSearch && matchesFilter;
  });

  // Criar campanha
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsCreating(true);
      setError(null);

      const newCampaign = await CampaignService.createCampaign(user.id, createForm);
      setCampaigns(prev => [newCampaign, ...prev]);
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        description: '',
        settings: {
          is_public: false,
          allow_character_sharing: true,
          max_characters_per_player: CAMPAIGN_CONFIG.MAX_CHARACTERS_PER_PLAYER,
          auto_backup: true,
          rules: {
            allow_multiclass: true,
            starting_level: 1,
            use_optional_rules: false
          }
        }
      });
      
      // Mostrar sucesso
      alert(CAMPAIGN_MESSAGES.CREATED);
    } catch (err: any) {
      console.error('Erro ao criar campanha:', err);
      setError(err.message || 'Erro ao criar campanha');
    } finally {
      setIsCreating(false);
    }
  };

  // Deletar campanha
  const handleDeleteCampaign = async (campaignId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await CampaignService.deleteCampaign(campaignId);
      setCampaigns(prev => prev.filter(c => c.id !== campaignId));
      alert(CAMPAIGN_MESSAGES.DELETED);
    } catch (err: any) {
      console.error('Erro ao deletar campanha:', err);
      alert(err.message || 'Erro ao deletar campanha');
    }
  };

  // Visualizar campanha
  const viewCampaign = (campaignId: string) => {
    navigate(`/campaigns/${campaignId}`);
  };

  // Copiar link de convite
  const copyInviteLink = async (campaignId: string) => {
    try {
      // Aqui você implementaria a lógica para gerar/buscar o link de convite
      const inviteLink = `${window.location.origin}/campaigns/invite/SAMPLE_CODE`;
      await navigator.clipboard.writeText(inviteLink);
      alert('Link de convite copiado!');
    } catch (err) {
      console.error('Erro ao copiar link:', err);
      alert('Erro ao copiar link de convite');
    }
  };

  // Obter ícone de status
  const getStatusIcon = (campaign: CampaignWithDetails) => {
    if (campaign.is_active) {
      return <Play className="w-4 h-4 text-green-500" />;
    }
    return <Pause className="w-4 h-4 text-yellow-500" />;
  };

  // Obter cor do papel
  const getRoleColor = (campaign: CampaignWithDetails) => {
    return campaign.owner_id === user?.id ? 'text-purple-600' : 'text-blue-600';
  };

  // Obter texto do papel
  const getRoleText = (campaign: CampaignWithDetails) => {
    return campaign.owner_id === user?.id ? 'Mestre' : 'Jogador';
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Minhas Campanhas
              </h1>
              <p className="text-gray-600">
                Gerencie suas campanhas e participe de aventuras épicas
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nova Campanha
            </button>
          </div>

          {/* Filtros e Busca */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar campanhas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'owned' | 'member')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Todas</option>
                <option value="owned">Minhas Campanhas</option>
                <option value="member">Participando</option>
              </select>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Crown className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Campanhas como Mestre</p>
                  <p className="text-xl font-bold text-gray-900">
                    {campaigns.filter(c => c.owner_id === user?.id).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Participando</p>
                  <p className="text-xl font-bold text-gray-900">
                    {campaigns.filter(c => c.owner_id !== user?.id).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Play className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ativas</p>
                  <p className="text-xl font-bold text-gray-900">
                    {campaigns.filter(c => c.is_active).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Sword className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Personagens</p>
                  <p className="text-xl font-bold text-gray-900">
                    {campaigns.reduce((total, c) => total + c.character_count, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
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

        {/* Lista de Campanhas */}
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <Scroll className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'Nenhuma campanha encontrada' : 'Nenhuma campanha ainda'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Tente ajustar os filtros ou termos de busca'
                  : 'Crie sua primeira campanha ou aceite um convite para começar'
                }
              </p>
            </div>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Criar Primeira Campanha
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden"
              >
                {/* Header do Card */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(campaign)}
                      <span className={`text-sm font-medium ${getRoleColor(campaign)}`}>
                        {getRoleText(campaign)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => viewCampaign(campaign.id)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Visualizar campanha"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      {campaign.owner_id === user?.id && (
                        <>
                          <button
                            onClick={() => copyInviteLink(campaign.id)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Copiar link de convite"
                          >
                            <Share2 className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Excluir campanha"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {campaign.name}
                  </h3>
                  
                  {campaign.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {campaign.description}
                    </p>
                  )}

                  {/* Informações do Mestre */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {campaign.master_info.display_name || campaign.master_info.username}
                      </p>
                      <p className="text-xs text-gray-500">Mestre</p>
                    </div>
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="px-6 pb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-lg font-bold text-gray-900">
                          {campaign.member_count}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Membros</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Sword className="w-4 h-4 text-gray-500" />
                        <span className="text-lg font-bold text-gray-900">
                          {campaign.character_count}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Personagens</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(campaign.updated_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <button
                      onClick={() => viewCampaign(campaign.id)}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Abrir Campanha
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Criação */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Nova Campanha</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleCreateCampaign} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Campanha *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={CAMPAIGN_CONFIG.MAX_NAME_LENGTH}
                      value={createForm.name}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ex: A Jornada dos Heróis"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {createForm.name.length}/{CAMPAIGN_CONFIG.MAX_NAME_LENGTH}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      rows={3}
                      maxLength={CAMPAIGN_CONFIG.MAX_DESCRIPTION_LENGTH}
                      value={createForm.description}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      placeholder="Descreva sua campanha..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {createForm.description.length}/{CAMPAIGN_CONFIG.MAX_DESCRIPTION_LENGTH}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">Configurações</h3>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-600">
                        Permitir compartilhamento de personagens
                      </label>
                      <input
                        type="checkbox"
                        checked={createForm.settings?.allow_character_sharing}
                        onChange={(e) => setCreateForm(prev => ({
                          ...prev,
                          settings: {
                            ...prev.settings!,
                            allow_character_sharing: e.target.checked
                          }
                        }))}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-600">
                        Backup automático
                      </label>
                      <input
                        type="checkbox"
                        checked={createForm.settings?.auto_backup}
                        onChange={(e) => setCreateForm(prev => ({
                          ...prev,
                          settings: {
                            ...prev.settings!,
                            auto_backup: e.target.checked
                          }
                        }))}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Máximo de personagens por jogador
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={createForm.settings?.max_characters_per_player}
                        onChange={(e) => setCreateForm(prev => ({
                          ...prev,
                          settings: {
                            ...prev.settings!,
                            max_characters_per_player: parseInt(e.target.value)
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating || !createForm.name.trim()}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? 'Criando...' : 'Criar Campanha'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignList; 