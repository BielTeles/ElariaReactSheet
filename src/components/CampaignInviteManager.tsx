import React, { useState, useEffect } from 'react';
import { Copy, Plus, Calendar, Share2, XCircle, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { CampaignService } from '../services/campaignService';
import { CampaignInvite } from '../types/campaign';
import { CAMPAIGN_CONFIG } from '../constants';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface CampaignInviteManagerProps {
  campaignId: string;
  campaignName: string;
  isOwner: boolean;
}

const CampaignInviteManager: React.FC<CampaignInviteManagerProps> = ({
  campaignId,
  campaignName,
  isOwner
}) => {
  const [invites, setInvites] = useState<CampaignInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState<string | null>(null);

  // Estados do formulário de criação
  const [createForm, setCreateForm] = useState({
    maxUses: '',
    expiryDays: CAMPAIGN_CONFIG.INVITE_EXPIRY_DAYS.toString()
  });

  // Carregar convites
  useEffect(() => {
    if (isOwner) {
      loadInvites();
    }
  }, [campaignId, isOwner]);

  const loadInvites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CampaignService.getCampaignInvites(campaignId);
      setInvites(data);
    } catch (err: any) {
      console.error('Erro ao carregar convites:', err);
      setError(err.message || 'Erro ao carregar convites');
    } finally {
      setLoading(false);
    }
  };

  // Criar convite
  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setCreating(true);
      setError(null);

      const maxUses = createForm.maxUses ? parseInt(createForm.maxUses) : undefined;
      const expiryDays = parseInt(createForm.expiryDays);

      const newInvite = await CampaignService.createInvite(
        campaignId,
        maxUses,
        expiryDays
      );

      setInvites(prev => [newInvite, ...prev]);
      setShowCreateForm(false);
      setCreateForm({
        maxUses: '',
        expiryDays: CAMPAIGN_CONFIG.INVITE_EXPIRY_DAYS.toString()
      });
      
      // Mostrar o código do convite
      setShowInviteCode(newInvite.invite_code);
    } catch (err: any) {
      console.error('Erro ao criar convite:', err);
      setError(err.message || 'Erro ao criar convite');
    } finally {
      setCreating(false);
    }
  };

  // Copiar link de convite
  const copyInviteLink = async (inviteCode: string) => {
    try {
      const inviteUrl = `${window.location.origin}/campaigns/invite/${inviteCode}`;
      await navigator.clipboard.writeText(inviteUrl);
      alert('Link de convite copiado para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar link:', err);
      alert('Erro ao copiar link. Tente novamente.');
    }
  };

  // Verificar se convite está expirado
  const isExpired = (invite: CampaignInvite): boolean => {
    return new Date(invite.expires_at) < new Date();
  };

  // Verificar se convite atingiu limite de usos
  const isMaxUsesReached = (invite: CampaignInvite): boolean => {
    return invite.max_uses ? invite.current_uses >= invite.max_uses : false;
  };

  // Obter status do convite
  const getInviteStatus = (invite: CampaignInvite) => {
    if (!invite.is_active) return { text: 'Inativo', color: 'text-gray-500', icon: XCircle };
    if (isExpired(invite)) return { text: 'Expirado', color: 'text-red-500', icon: XCircle };
    if (isMaxUsesReached(invite)) return { text: 'Limite Atingido', color: 'text-yellow-500', icon: AlertCircle };
    return { text: 'Ativo', color: 'text-green-500', icon: CheckCircle };
  };

  // Formatear data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOwner) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Apenas o mestre da campanha pode gerenciar convites.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Convites da Campanha</h3>
          <p className="text-sm text-gray-600">
            Gerencie convites para {campaignName}
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Criar Convite
        </button>
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

      {/* Modal de Criação */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Criar Convite</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Limite de Usos
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={createForm.maxUses}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, maxUses: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Deixe vazio para ilimitado"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Quantas pessoas podem usar este convite
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Validade (dias)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    required
                    value={createForm.expiryDays}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, expiryDays: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Por quantos dias o convite será válido
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? 'Criando...' : 'Criar Convite'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Código de Convite */}
      {showInviteCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Convite Criado!</h2>
                <button
                  onClick={() => setShowInviteCode(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg mb-4">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Convite criado com sucesso!</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código do Convite
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={showInviteCode}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-center text-lg font-bold"
                    />
                    <button
                      onClick={() => copyInviteLink(showInviteCode)}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      title="Copiar link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Compartilhe este código ou o link com os jogadores
                  </p>
                </div>

                <button
                  onClick={() => setShowInviteCode(null)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Convites */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : invites.length === 0 ? (
        <div className="text-center py-8">
          <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum convite criado
          </h3>
          <p className="text-gray-600 mb-4">
            Crie convites para permitir que jogadores entrem na campanha
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Criar Primeiro Convite
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {invites.map((invite) => {
            const status = getInviteStatus(invite);
            const StatusIcon = status.icon;
            
            return (
              <div
                key={invite.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-5 h-5 ${status.color}`} />
                      <span className={`font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyInviteLink(invite.invite_code)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Copiar link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowInviteCode(invite.invite_code)}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Ver código"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Código</p>
                    <p className="font-mono font-bold">{invite.invite_code}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Usos</p>
                    <p className="font-medium">
                      {invite.current_uses}
                      {invite.max_uses ? ` / ${invite.max_uses}` : ' / ∞'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Expira em</p>
                    <p className="font-medium">{formatDate(invite.expires_at)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Criado em</p>
                    <p className="font-medium">{formatDate(invite.created_at)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampaignInviteManager; 