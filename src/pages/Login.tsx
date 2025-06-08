// ===================================================================
// PÁGINA DE LOGIN - ELARIA RPG
// ===================================================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../types/auth';
import { ROUTES, AUTH_SUCCESS_MESSAGES } from '../constants';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, isLoading, clearError } = useAuth();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // URL de destino após login
  const from = (location.state as any)?.from?.pathname || ROUTES.HOME;

  // Limpar erro ao montar componente
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Validação local
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!credentials.email) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      errors.email = 'Email inválido';
    }

    if (!credentials.password) {
      errors.password = 'Senha é obrigatória';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manipular mudanças nos campos
  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo específico
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Limpar erro geral
    if (error) {
      clearError();
    }
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await login(credentials);
    
    if (success) {
      // Opcional: mostrar mensagem de sucesso
      console.log(AUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS);
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta!</h1>
          <p className="text-gray-600">Entre na sua conta do Elaria RPG</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={credentials.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`
                    block w-full pl-10 pr-3 py-3 border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                  disabled={isLoading}
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`
                    block w-full pl-10 pr-12 py-3 border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    ${validationErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Lembrar-me */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={credentials.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Manter-me conectado por 30 dias
              </label>
            </div>

            {/* Erro geral */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Botão de login */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg
                text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                }
                transition-colors duration-200
              `}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Links adicionais */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link 
                to={ROUTES.REGISTER}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </div>

        {/* Link para voltar */}
        <div className="mt-6 text-center">
          <Link
            to={ROUTES.HOME}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
} 