// ===================================================================
// PÁGINA DE REGISTRO - ELARIA RPG
// ===================================================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RegisterCredentials } from '../types/auth';
import { ROUTES, AUTH_SUCCESS_MESSAGES, AUTH_CONFIG } from '../constants';

export default function Register() {
  const navigate = useNavigate();
  const { register, error, isLoading, clearError } = useAuth();

  const [credentials, setCredentials] = useState<RegisterCredentials>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    isValid: false,
  });

  // Limpar erro ao montar componente
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Verificar força da senha
  useEffect(() => {
    const password = credentials.password;
    const strength = {
      hasMinLength: password.length >= AUTH_CONFIG.MIN_PASSWORD_LENGTH,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      isValid: false,
    };
    
    strength.isValid = strength.hasMinLength && strength.hasUpperCase && 
                      strength.hasLowerCase && strength.hasNumber;
    
    setPasswordStrength(strength);
  }, [credentials.password]);

  // Validação local
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!credentials.username) {
      errors.username = 'Nome de usuário é obrigatório';
    } else if (credentials.username.length > AUTH_CONFIG.MAX_USERNAME_LENGTH) {
      errors.username = `Nome de usuário deve ter no máximo ${AUTH_CONFIG.MAX_USERNAME_LENGTH} caracteres`;
    }

    if (!credentials.email) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
      errors.email = 'Email inválido';
    }

    if (!credentials.password) {
      errors.password = 'Senha é obrigatória';
    } else if (!passwordStrength.isValid) {
      errors.password = 'A senha não atende aos critérios de segurança';
    }

    if (!credentials.confirmPassword) {
      errors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (credentials.password !== credentials.confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manipular mudanças nos campos
  const handleInputChange = (field: keyof RegisterCredentials, value: string) => {
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

    const success = await register(credentials);
    
    if (success) {
      console.log(AUTH_SUCCESS_MESSAGES.REGISTER_SUCCESS);
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</h1>
          <p className="text-gray-600">Junte-se ao mundo de Elaria RPG</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome de usuário */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Nome de Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Seu nome de usuário"
                  value={credentials.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`
                    block w-full pl-10 pr-3 py-3 border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                    ${validationErrors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                  disabled={isLoading}
                  maxLength={AUTH_CONFIG.MAX_USERNAME_LENGTH}
                />
              </div>
              {validationErrors.username && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.username}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {credentials.username.length}/{AUTH_CONFIG.MAX_USERNAME_LENGTH} caracteres
              </p>
            </div>

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
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
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
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
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

              {/* Indicador de força da senha */}
              {credentials.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-xs space-x-4">
                    <div className={`flex items-center ${passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.hasMinLength ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <div className="h-3 w-3 border border-gray-300 rounded-full mr-1"></div>
                      )}
                      6+ caracteres
                    </div>
                    <div className={`flex items-center ${passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.hasUpperCase ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <div className="h-3 w-3 border border-gray-300 rounded-full mr-1"></div>
                      )}
                      Maiúscula
                    </div>
                  </div>
                  <div className="flex items-center text-xs space-x-4">
                    <div className={`flex items-center ${passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.hasLowerCase ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <div className="h-3 w-3 border border-gray-300 rounded-full mr-1"></div>
                      )}
                      Minúscula
                    </div>
                    <div className={`flex items-center ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordStrength.hasNumber ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <div className="h-3 w-3 border border-gray-300 rounded-full mr-1"></div>
                      )}
                      Número
                    </div>
                  </div>
                </div>
              )}

              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Confirmar senha */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={credentials.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`
                    block w-full pl-10 pr-12 py-3 border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                    ${validationErrors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.confirmPassword}
                </p>
              )}
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

            {/* Botão de registro */}
            <button
              type="submit"
              disabled={isLoading || !passwordStrength.isValid}
              className={`
                w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg
                text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                ${isLoading || !passwordStrength.isValid
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                }
                transition-colors duration-200
              `}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Criando conta...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Criar Conta
                </>
              )}
            </button>
          </form>

          {/* Links adicionais */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link 
                to={ROUTES.LOGIN}
                className="font-medium text-green-600 hover:text-green-500 transition-colors"
              >
                Faça login aqui
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