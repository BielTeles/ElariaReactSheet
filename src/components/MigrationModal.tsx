// ===================================================================
// MODAL DE MIGRAÇÃO - ELARIA RPG
// ===================================================================

import React, { useState, useEffect } from 'react';
import { 
  CloudArrowUpIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentDuplicateIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useMigration } from '../hooks/useMigration';

interface MigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMigrationComplete: () => void;
}

export const MigrationModal: React.FC<MigrationModalProps> = ({
  isOpen,
  onClose,
  onMigrationComplete
}) => {
  const {
    isMigrating,
    migrationError,
    migrationProgress,
    checkForLocalData,
    executeMigration,
    getLocalCharacters,
    getAvailableBackups
  } = useMigration();

  const [showDetails, setShowDetails] = useState(false);
  const [localCharacters, setLocalCharacters] = useState<any[]>([]);
  const [migrationCompleted, setMigrationCompleted] = useState(false);

  // ===================================================================
  // EFFECTS
  // ===================================================================

  useEffect(() => {
    if (isOpen) {
      setLocalCharacters(getLocalCharacters());
      setMigrationCompleted(false);
    }
  }, [isOpen, getLocalCharacters]);

  // ===================================================================
  // HANDLERS
  // ===================================================================

  const handleMigration = async () => {
    try {
      const success = await executeMigration();
      if (success) {
        setMigrationCompleted(true);
        setTimeout(() => {
          onMigrationComplete();
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Erro na migração:', error);
    }
  };

  const handleClose = () => {
    if (!isMigrating) {
      onClose();
    }
  };

  // ===================================================================
  // RENDER CONDITIONS
  // ===================================================================

  if (!isOpen) return null;

  const hasLocalData = checkForLocalData();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          
          {/* Header */}
          <div className="sm:flex sm:items-start">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
              <CloudArrowUpIcon className="w-6 h-6 text-blue-600" />
            </div>
            
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Migração para a Nuvem
              </h3>
              
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Detectamos personagens salvos localmente. Vamos migrá-los para o banco de dados na nuvem para maior segurança.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-5">
            
            {/* Status da Migração Concluída */}
            {migrationCompleted && (
              <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded-md">
                <div className="flex">
                  <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Migração Concluída!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Seus personagens foram migrados com sucesso para a nuvem.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Erro de Migração */}
            {migrationError && (
              <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <XCircleIcon className="w-5 h-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Erro na Migração
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{migrationError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progresso da Migração */}
            {isMigrating && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Migrando...
                  </span>
                  <span className="text-sm text-gray-500">
                    {migrationProgress.current} / {migrationProgress.total}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${migrationProgress.total > 0 
                        ? (migrationProgress.current / migrationProgress.total) * 100 
                        : 0}%`
                    }}
                  />
                </div>
                
                {migrationProgress.currentItem && (
                  <p className="mt-2 text-sm text-gray-600">
                    {migrationProgress.currentItem}
                  </p>
                )}
              </div>
            )}

            {/* Informações dos Dados Locais */}
            {hasLocalData && !migrationCompleted && (
              <div className="mb-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex">
                    <DocumentDuplicateIcon className="w-5 h-5 text-blue-400" />
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-blue-800">
                        Dados Encontrados
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          Encontramos <strong>{localCharacters.length}</strong> personagem(ns) 
                          salvo(s) localmente:
                        </p>
                        
                        <button
                          onClick={() => setShowDetails(!showDetails)}
                          className="mt-2 text-blue-600 hover:text-blue-500 text-sm underline"
                        >
                          {showDetails ? 'Ocultar' : 'Ver'} detalhes
                        </button>
                        
                        {showDetails && (
                          <ul className="mt-2 space-y-1">
                            {localCharacters.slice(0, 5).map((char, index) => (
                              <li key={index} className="text-xs">
                                • {char.name} ({char.class || 'Classe não definida'})
                              </li>
                            ))}
                            {localCharacters.length > 5 && (
                              <li className="text-xs text-blue-600">
                                • ... e mais {localCharacters.length - 5} personagens
                              </li>
                            )}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Aviso sobre Backup */}
            {!migrationCompleted && (
              <div className="mb-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Backup Automático
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Um backup dos seus dados será criado automaticamente antes da migração. 
                          Você poderá restaurá-los se necessário.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sem Dados Locais */}
            {!hasLocalData && !migrationCompleted && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-800">
                      Nenhum Dado Local
                    </h3>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Não encontramos personagens salvos localmente para migrar.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            {!migrationCompleted && hasLocalData && (
              <button
                onClick={handleMigration}
                disabled={isMigrating}
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMigrating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Migrando...
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="w-4 h-4 mr-2" />
                    Iniciar Migração
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={handleClose}
              disabled={isMigrating}
              className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {migrationCompleted ? 'Fechar' : hasLocalData ? 'Pular por Agora' : 'Fechar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 