import React, { useState, useEffect } from 'react';
import { CharacterStorage, AutoSaveConfig, CharacterVersion } from '../utils/characterStorage';
import { 
  Settings, Save, Clock, History, Download, Upload, Shield, 
  AlertTriangle, CheckCircle, XCircle, RotateCcw, Trash2 
} from 'lucide-react';

interface SaveSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  characterId?: string; // Se fornecido, mostra opções específicas do personagem
}

const SaveSettings: React.FC<SaveSettingsProps> = ({ isOpen, onClose, characterId }) => {
  const [config, setConfig] = useState<AutoSaveConfig>(CharacterStorage.getConfig());
  const [versions, setVersions] = useState<CharacterVersion[]>([]);
  const [lastBackup, setLastBackup] = useState<Date | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, characterId]);

  const loadData = () => {
    setConfig(CharacterStorage.getConfig());
    
    if (characterId) {
      setVersions(CharacterStorage.getVersionHistory(characterId));
    }
    
    const stats = CharacterStorage.getStats();
    setLastBackup(stats.lastBackup);
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleConfigChange = (newConfig: Partial<AutoSaveConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    CharacterStorage.updateConfig(newConfig);
    showNotification('success', 'Configurações atualizadas!');
  };

  const handleRestoreVersion = (versionIndex: number) => {
    if (!characterId) return;
    
    const success = CharacterStorage.restoreVersion(characterId, versionIndex);
    if (success) {
      showNotification('success', 'Versão restaurada com sucesso!');
      loadData();
    } else {
      showNotification('error', 'Erro ao restaurar versão');
    }
  };

  const handleBackupRestore = () => {
    const success = CharacterStorage.restoreBackup();
    if (success) {
      showNotification('success', 'Backup restaurado com sucesso!');
      loadData();
    } else {
      showNotification('error', 'Erro ao restaurar backup ou backup não encontrado');
    }
  };

  const handleExportAll = () => {
    try {
      const jsonData = CharacterStorage.exportAllCharacters();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elaria-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('success', 'Backup exportado com sucesso!');
    } catch (error) {
      showNotification('error', 'Erro ao exportar backup');
    }
  };

  const handleImportAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const importData = JSON.parse(jsonData);
        
        if (importData.characters) {
          // Importar cada personagem
          let importedCount = 0;
          importData.characters.forEach((charData: any) => {
            const imported = CharacterStorage.importCharacter(JSON.stringify(charData.character || charData));
            if (imported) importedCount++;
          });
          
          showNotification('success', `${importedCount} personagem(s) importado(s)!`);
          loadData();
        } else {
          showNotification('error', 'Formato de backup inválido');
        }
      } catch (error) {
        showNotification('error', 'Erro ao importar backup');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClearAll = () => {
    if (!showConfirmClear) {
      setShowConfirmClear(true);
      return;
    }
    
    const success = CharacterStorage.clearAllCharacters();
    if (success) {
      showNotification('success', 'Todos os personagens foram removidos');
      setShowConfirmClear(false);
      loadData();
    } else {
      showNotification('error', 'Erro ao limpar personagens');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('pt-BR');
  };

  const formatInterval = (ms: number) => {
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds}s`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.round(minutes)}min`;
    const hours = minutes / 60;
    return `${Math.round(hours)}h`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-slate-800">
              Configurações de Salvamento
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mx-6 mt-4 p-3 rounded-lg flex items-center gap-2 ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {notification.message}
          </div>
        )}

        <div className="p-6 space-y-8">
          {/* Auto-salvamento */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-slate-800">Auto-salvamento</h3>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-slate-700">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => handleConfigChange({ enabled: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Ativar auto-salvamento
                </label>
                <span className="text-sm text-slate-500">
                  {config.enabled ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              
              {config.enabled && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Intervalo de salvamento: {formatInterval(config.interval)}
                    </label>
                    <input
                      type="range"
                      min="10000"
                      max="300000"
                      step="10000"
                      value={config.interval}
                      onChange={(e) => handleConfigChange({ interval: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>10s</span>
                      <span>5min</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Máximo de versões no histórico: {config.maxVersions}
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="20"
                      step="1"
                      value={config.maxVersions}
                      onChange={(e) => handleConfigChange({ maxVersions: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>3</span>
                      <span>20</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Histórico de versões (apenas se characterId for fornecido) */}
          {characterId && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-slate-800">Histórico de Versões</h3>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                {versions.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {versions.map((version, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-white rounded-lg p-3 border"
                      >
                        <div>
                          <div className="font-medium text-slate-800">
                            {version.changeReason || 'Alteração'}
                          </div>
                          <div className="text-sm text-slate-500">
                            {formatDate(version.timestamp)}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRestoreVersion(index)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Restaurar
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">
                    Nenhuma versão no histórico
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Backup e Restauração */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-slate-800">Backup e Restauração</h3>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-700">Último backup automático</div>
                  <div className="text-sm text-slate-500">
                    {lastBackup ? formatDate(lastBackup) : 'Nenhum backup encontrado'}
                  </div>
                </div>
                <button
                  onClick={handleBackupRestore}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Restaurar Backup
                </button>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExportAll}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Exportar Tudo
                </button>
                
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Importar Backup
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportAll}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Área de Perigo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-slate-800">Área de Perigo</h3>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-800 mb-2">
                    Limpar Todos os Personagens
                  </h4>
                  <p className="text-sm text-red-700 mb-4">
                    Esta ação removerá permanentemente todos os personagens, históricos de versões e backups. 
                    Esta ação não pode ser desfeita.
                  </p>
                  
                  {!showConfirmClear ? (
                    <button
                      onClick={handleClearAll}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Limpar Todos os Dados
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-red-800">
                        Tem certeza? Esta ação é irreversível!
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleClearAll}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          Sim, limpar tudo
                        </button>
                        <button
                          onClick={() => setShowConfirmClear(false)}
                          className="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition-colors text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveSettings; 