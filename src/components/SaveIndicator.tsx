import React, { useState, useEffect } from 'react';
import { Save, Clock, AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'auto-saving';

interface SaveIndicatorProps {
  status: SaveStatus;
  lastSaved?: Date;
  error?: string;
  autoSaveEnabled?: boolean;
  className?: string;
}

const SaveIndicator: React.FC<SaveIndicatorProps> = ({
  status,
  lastSaved,
  error,
  autoSaveEnabled = false,
  className = ''
}) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (status === 'saved' || status === 'error') {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const getStatusInfo = () => {
    switch (status) {
      case 'saving':
        return {
          icon: <Save className="w-4 h-4 animate-pulse" />,
          text: 'Salvando...',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200'
        };
      case 'auto-saving':
        return {
          icon: <Clock className="w-4 h-4 animate-spin" />,
          text: 'Auto-salvando...',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-700',
          borderColor: 'border-purple-200'
        };
      case 'saved':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Salvo',
          bgColor: 'bg-green-100',
          textColor: 'text-green-700',
          borderColor: 'border-green-200'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Erro ao salvar',
          bgColor: 'bg-red-100',
          textColor: 'text-red-700',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: autoSaveEnabled ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />,
          text: autoSaveEnabled ? 'Auto-save ativo' : 'Auto-save inativo',
          bgColor: autoSaveEnabled ? 'bg-slate-100' : 'bg-gray-100',
          textColor: autoSaveEnabled ? 'text-slate-600' : 'text-gray-500',
          borderColor: autoSaveEnabled ? 'border-slate-200' : 'border-gray-200'
        };
    }
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'há poucos segundos';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `há ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`relative ${className}`}>
      {/* Indicador principal */}
      <div 
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200
          ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor}
          ${showMessage ? 'scale-105' : 'scale-100'}
        `}
        title={error || (lastSaved ? `Último salvamento: ${formatLastSaved(lastSaved)}` : undefined)}
      >
        {statusInfo.icon}
        <span className="text-sm font-medium">{statusInfo.text}</span>
        
        {/* Timestamp do último salvamento */}
        {lastSaved && status === 'idle' && (
          <span className="text-xs opacity-70">
            • {formatLastSaved(lastSaved)}
          </span>
        )}
      </div>

      {/* Mensagem de erro expandida */}
      {error && status === 'error' && showMessage && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg shadow-lg min-w-64 z-10">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-red-800 text-sm">Erro no Salvamento</div>
              <div className="text-red-700 text-xs mt-1">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de sucesso */}
      {status === 'saved' && showMessage && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-green-50 border border-green-200 rounded-lg shadow-lg z-10">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-green-800 text-sm font-medium">Salvo com sucesso!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveIndicator; 