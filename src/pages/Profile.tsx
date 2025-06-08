// ===================================================================
// PÁGINA DE PERFIL - ELARIA RPG
// ===================================================================

import React, { useState } from 'react';
import { User, Settings, Calendar, Clock, Save, LogOut } from 'lucide-react';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import { UserPreferences } from '../types/auth';

export default function Profile() {
  const { user, logout, updateProfile } = useFirebaseAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    preferences: user?.preferences || {
      theme: 'auto' as const,
      language: 'pt-BR' as const,
      autoSave: true,
      notifications: true,
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Usuário não encontrado</p>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    
    const success = await updateProfile({
      username: editData.username,
      preferences: editData.preferences,
    });

    if (success) {
      setIsEditing(false);
    }
    
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditData({
      username: user.username,
      preferences: user.preferences,
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              Membro desde {user.createdAt.toLocaleDateString('pt-BR')}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              Último acesso {user.lastLogin.toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Configurações */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Configurações
            </h2>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Editar
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Nome de usuário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome de Usuário
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSaving}
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.username}</p>
              )}
            </div>

            {/* Email (somente leitura) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{user.email}</p>
              <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
            </div>

            {/* Tema */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tema
              </label>
              {isEditing ? (
                <select
                  value={editData.preferences.theme}
                  onChange={(e) => setEditData({
                    ...editData,
                    preferences: {
                      ...editData.preferences,
                      theme: e.target.value as 'light' | 'dark' | 'auto'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSaving}
                >
                  <option value="auto">Automático</option>
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                </select>
              ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {user.preferences.theme === 'auto' ? 'Automático' :
                   user.preferences.theme === 'light' ? 'Claro' : 'Escuro'}
                </p>
              )}
            </div>

            {/* Idioma */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idioma
              </label>
              {isEditing ? (
                <select
                  value={editData.preferences.language}
                  onChange={(e) => setEditData({
                    ...editData,
                    preferences: {
                      ...editData.preferences,
                      language: e.target.value as 'pt-BR' | 'en'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSaving}
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en">English</option>
                </select>
              ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {user.preferences.language === 'pt-BR' ? 'Português (Brasil)' : 'English'}
                </p>
              )}
            </div>

            {/* Auto salvamento */}
            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={editData.preferences.autoSave}
                  onChange={(e) => setEditData({
                    ...editData,
                    preferences: {
                      ...editData.preferences,
                      autoSave: e.target.checked
                    }
                  })}
                  className="sr-only"
                  disabled={!isEditing || isSaving}
                />
                <div className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${editData.preferences.autoSave ? 'bg-blue-600' : 'bg-gray-200'}
                  ${!isEditing || isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}>
                  <span className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${editData.preferences.autoSave ? 'translate-x-6' : 'translate-x-1'}
                  `} />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Auto salvamento
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-14">
                Salva automaticamente os personagens a cada 30 segundos
              </p>
            </div>

            {/* Notificações */}
            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={editData.preferences.notifications}
                  onChange={(e) => setEditData({
                    ...editData,
                    preferences: {
                      ...editData.preferences,
                      notifications: e.target.checked
                    }
                  })}
                  className="sr-only"
                  disabled={!isEditing || isSaving}
                />
                <div className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${editData.preferences.notifications ? 'bg-blue-600' : 'bg-gray-200'}
                  ${!isEditing || isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}>
                  <span className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${editData.preferences.notifications ? 'translate-x-6' : 'translate-x-1'}
                  `} />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Notificações
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-14">
                Receber notificações sobre atualizações e eventos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 