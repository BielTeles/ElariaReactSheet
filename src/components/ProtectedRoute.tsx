import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { user, loading } = useAuth();

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se usuário não está autenticado, mostra fallback ou tela de login
  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-blue-200 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
              <span className="text-black font-bold text-2xl">E</span>
            </div>
            
            <h1 className="text-2xl font-fantasy font-bold text-gray-900 mb-2">
              🎲 ELARIA RPG
            </h1>
            <p className="text-gray-600 mb-6">
              Faça login para acessar esta funcionalidade
            </p>
            
            <div className="space-y-4">
              <GoogleLoginButton size="lg">
                Entrar com Google
              </GoogleLoginButton>
              
              <div className="text-sm text-gray-500">
                Você precisa estar logado para acessar esta página
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se usuário está autenticado, renderiza o conteúdo
  return <>{children}</>;
};

export default ProtectedRoute; 