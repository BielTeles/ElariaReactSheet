import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthDebugInfo: React.FC = () => {
  const { user, loading, error, clearError } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  const forceReload = () => {
    console.log('🔄 Forçando reload da página...');
    window.location.reload();
  };

  const clearLocalStorage = () => {
    console.log('🧹 Limpando localStorage...');
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
            loading 
              ? 'bg-red-600 text-white animate-pulse' 
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {loading ? '🔴 Loading...' : '🔧 Debug Auth'}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border-2 border-purple-300 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-purple-800">Debug Autenticação</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 text-lg"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-medium">Loading:</span>
          <span className={`px-2 py-1 rounded ${loading ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-green-100 text-green-800'}`}>
            {loading ? 'TRUE' : 'FALSE'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="font-medium">User:</span>
          <span className={`px-2 py-1 rounded ${user ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {user ? 'LOGADO' : 'NÃO LOGADO'}
          </span>
        </div>
        
        {user && (
          <div className="text-xs text-gray-600">
            <p><strong>Nome:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>ID:</strong> {user.id.slice(0, 8)}...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-2">
            <p className="text-red-800 text-xs">
              <strong>Erro:</strong> {error}
            </p>
            <button
              onClick={clearError}
              className="mt-1 text-xs text-red-600 hover:text-red-800 underline"
            >
              Limpar erro
            </button>
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-2">
          <p>Timestamp: {new Date().toLocaleTimeString()}</p>
        </div>
        
        {/* Botões de emergência */}
        <div className="space-y-1 mt-3 pt-2 border-t border-gray-200">
          <button
            onClick={forceReload}
            className="w-full px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
          >
            🔄 Recarregar Página
          </button>
          
          {loading && (
            <button
              onClick={clearLocalStorage}
              className="w-full px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
            >
              🚨 Reset Completo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthDebugInfo; 