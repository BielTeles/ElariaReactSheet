import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CampaignService } from '../services/campaignService';
import { CharacterStorage } from '../utils/characterStorage';
import { ProcessInviteResult } from '../types/campaign';
import { ROUTES } from '../constants';
import { 
  CheckCircle, AlertCircle, XCircle, Users, Crown, 
  Loader, ArrowRight, Home, UserPlus, Scroll
} from 'lucide-react';

const CampaignInvite: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessInviteResult | null>(null);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [availableCharacters, setAvailableCharacters] = useState<any[]>([]);
  const [showCharacterSelection, setShowCharacterSelection] = useState(false);

  // Carregar personagens disponíveis
  useEffect(() => {
    if (user) {
      const characters = CharacterStorage.getAllCharacters();
      setAvailableCharacters(characters);
    }
  }, [user]);

  // Processar convite automaticamente quando usuário estiver autenticado
  useEffect(() => {
    if (user && code && !result && !processing) {
      handleProcessInvite();
    }
  }, [user, code, result, processing]);

  const handleProcessInvite = async (characterIds: string[] = []) => {
    if (!code || !user) return;

    try {
      setProcessing(true);
      const inviteResult = await CampaignService.processInvite(code, characterIds);
      setResult(inviteResult);
      
      if (inviteResult.success && inviteResult.campaign) {
        // Redirecionar para a campanha após sucesso
        setTimeout(() => {
          navigate(`/campaigns/${inviteResult.campaign!.id}`);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Erro ao processar convite:', error);
      setResult({
        success: false,
        error: error.message || 'Erro ao processar convite'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCharacterSelection = () => {
    setShowCharacterSelection(true);
  };

  const handleConfirmWithCharacters = () => {
    handleProcessInvite(selectedCharacters);
    setShowCharacterSelection(false);
  };

  const toggleCharacterSelection = (characterId: string) => {
    setSelectedCharacters(prev => 
      prev.includes(characterId) 
        ? prev.filter(id => id !== characterId)
        : [...prev, characterId]
    );
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Não autenticado
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <UserPlus className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Convite para Campanha
            </h1>
            <p className="text-gray-600">
              Você precisa estar logado para aceitar este convite
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Código do Convite:</strong> {code}
              </p>
            </div>
            
            <p className="text-sm text-gray-600">
              Faça login com sua conta Google para continuar
            </p>
            
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir para Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Processando
  if (processing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <Loader className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Processando Convite
            </h1>
            <p className="text-gray-600">
              Aguarde enquanto verificamos o convite...
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Código:</strong> {code}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Resultado do processamento
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          {result.success ? (
            // Sucesso
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Bem-vindo à Campanha!
              </h1>
              <p className="text-gray-600">
                Você entrou na campanha com sucesso
              </p>
            </div>
          ) : (
            // Erro
            <div className="mb-6">
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Erro no Convite
              </h1>
              <p className="text-gray-600">
                {result.error || 'Não foi possível processar o convite'}
              </p>
            </div>
          )}

          {/* Informações da campanha */}
          {result.campaign && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Scroll className="w-6 h-6 text-purple-600" />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    {result.campaign.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {result.campaign.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  <span>{result.campaign.master_info.username}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{result.campaign.member_count} membros</span>
                </div>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="space-y-3">
            {result.success && result.campaign ? (
              <>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    Redirecionando para a campanha em alguns segundos...
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/campaigns/${result.campaign!.id}`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span>Ir para Campanha</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : result.already_member && result.campaign ? (
              <button
                onClick={() => navigate(`/campaigns/${result.campaign!.id}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Ir para Campanha</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate(ROUTES.HOME)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Voltar ao Início</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Estado inicial - mostrar opções
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <Scroll className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Convite para Campanha
          </h1>
          <p className="text-gray-600">
            Você foi convidado para participar de uma campanha
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>Código do Convite:</strong> {code}
            </p>
          </div>

          {availableCharacters.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Personagens Disponíveis:</strong> {availableCharacters.length}
              </p>
              <p className="text-xs text-blue-600">
                Você pode vincular personagens à campanha agora ou depois
              </p>
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={() => handleProcessInvite()}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Aceitar Convite
            </button>
            
            {availableCharacters.length > 0 && (
              <button
                onClick={handleCharacterSelection}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Aceitar e Vincular Personagens
              </button>
            )}
            
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Seleção de Personagens */}
      {showCharacterSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Selecionar Personagens
                </h2>
                <button
                  onClick={() => setShowCharacterSelection(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <p className="text-gray-600 mb-4">
                Escolha quais personagens deseja vincular à campanha:
              </p>

              <div className="space-y-3 mb-6">
                {availableCharacters.map((character) => (
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
                        {character.data.race} {character.data.mainClass}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCharacterSelection(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmWithCharacters}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirmar ({selectedCharacters.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignInvite; 