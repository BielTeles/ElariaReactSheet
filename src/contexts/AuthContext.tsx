import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { User } from '../types/auth';
import { supabase } from '../services/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Singleton para controlar inicialização global
let globalInitialized = false;
let globalInitializing = false;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const forceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Força fim do loading após timeout
  const forceStopLoading = useCallback(() => {
    if (!mountedRef.current) return;
    console.log('🔴 FORÇANDO FIM DO LOADING - TIMEOUT ATINGIDO');
    setLoading(false);
    globalInitialized = true;
    globalInitializing = false;
    setError(null);
  }, []);

  // Timeout mais agressivo para evitar loading infinito
  const setLoadingWithTimeout = useCallback((isLoading: boolean, timeout = 3000) => {
    if (!mountedRef.current) return;
    console.log(`🟡 setLoadingWithTimeout: ${isLoading}, timeout: ${timeout}ms`);
    
    // Limpar timeouts existentes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (forceTimeoutRef.current) {
      clearTimeout(forceTimeoutRef.current);
    }

    if (isLoading) {
      setLoading(true);
      
      // Timeout normal
      timeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          console.warn('⚠️ Loading timeout - tentando finalizar...');
          setLoading(false);
          globalInitialized = true;
          globalInitializing = false;
        }
      }, timeout);
      
      // Timeout forçado (mais agressivo)
      forceTimeoutRef.current = setTimeout(forceStopLoading, timeout + 1000);
    } else {
      setLoading(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (forceTimeoutRef.current) {
        clearTimeout(forceTimeoutRef.current);
        forceTimeoutRef.current = null;
      }
    }
  }, [forceStopLoading]);

  // Converte usuário do Supabase para nosso tipo User
  const convertSupabaseUser = useCallback((supabaseUser: any, profile?: any): User => {
    return {
      id: supabaseUser.id,
      username: profile?.username || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'Usuário',
      email: supabaseUser.email || '',
      avatar: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
      createdAt: new Date(supabaseUser.created_at),
      lastLogin: new Date(),
      preferences: profile?.preferences || {
        theme: 'auto',
        language: 'pt-BR',
        autoSave: true,
        notifications: true,
      }
    };
  }, []);

  // Busca ou cria perfil do usuário
  const getOrCreateProfile = useCallback(async (supabaseUser: any) => {
    try {
      console.log('🔍 Buscando/criando perfil para:', supabaseUser.email);
      
      // Primeiro, tenta buscar o perfil existente
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('❌ Erro ao buscar perfil:', profileError);
        return null;
      }

      // Se perfil não existe, cria um novo
      if (!profile) {
        console.log('➕ Criando novo perfil...');
        const newProfile = {
          id: supabaseUser.id,
          username: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'Usuário',
          display_name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'Usuário',
          avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
          preferences: {
            theme: 'auto',
            language: 'pt-BR',
            auto_save: true,
            notifications: true,
            auto_backup: true,
            share_characters: false,
          }
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select('*')
          .single();

        if (createError) {
          console.error('❌ Erro ao criar perfil:', createError);
          return null;
        }

        console.log('✅ Perfil criado com sucesso');
        return createdProfile;
      }

      console.log('✅ Perfil encontrado');
      return profile;
    } catch (error) {
      console.error('❌ Erro ao gerenciar perfil:', error);
      return null;
    }
  }, []);

  // Atualiza estado do usuário
  const updateUserState = useCallback(async (session: Session | null) => {
    if (!mountedRef.current) return;
    
    console.log('🔄 updateUserState chamado, session:', !!session);

    try {
      if (session?.user) {
        console.log('👤 Usuário encontrado, processando...');
        const profile = await getOrCreateProfile(session.user);
        const userData = convertSupabaseUser(session.user, profile);
        if (mountedRef.current) {
          setUser(userData);
          setError(null);
          console.log('✅ Estado do usuário atualizado:', userData.username);
        }
      } else {
        console.log('🚫 Nenhum usuário na sessão');
        if (mountedRef.current) {
          setUser(null);
          setError(null);
        }
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar estado do usuário:', error);
      if (mountedRef.current) {
        setError('Erro ao carregar dados do usuário');
      }
    } finally {
      if (mountedRef.current) {
        console.log('🏁 Finalizando loading...');
        setLoadingWithTimeout(false);
        globalInitialized = true;
        globalInitializing = false;
      }
    }
  }, [getOrCreateProfile, convertSupabaseUser, setLoadingWithTimeout]);

  // Inicializa autenticação apenas uma vez globalmente
  useEffect(() => {
    if (globalInitialized || globalInitializing) {
      console.log('⚠️ Já inicializado ou inicializando globalmente, pulando...');
      if (globalInitialized) {
        setLoading(false);
      }
      return;
    }

    console.log('🚀 Inicializando autenticação (primeira vez)...');
    globalInitializing = true;

    const initializeAuth = async () => {
      try {
        setLoadingWithTimeout(true, 3000);
        
        console.log('📡 Obtendo sessão...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mountedRef.current) {
          console.log('⚠️ Componente desmontado, cancelando...');
          globalInitializing = false;
          return;
        }
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
          setError('Erro ao carregar sessão');
          setLoadingWithTimeout(false);
          globalInitialized = true;
          globalInitializing = false;
        } else {
          console.log('📡 Sessão obtida, atualizando estado...');
          await updateUserState(session);
        }
      } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        if (mountedRef.current) {
          setError('Erro ao inicializar autenticação');
          setLoadingWithTimeout(false);
          globalInitialized = true;
          globalInitializing = false;
        }
      }
    };

    initializeAuth();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return;
        console.log('🔔 Auth state changed:', event, session?.user?.email);
        
        // Processar logout
        if (event === 'SIGNED_OUT') {
          console.log('🚪 Processando logout...');
          setUser(null);
          setError(null);
          setLoadingWithTimeout(false);
          return;
        }
        
        // Ignorar apenas TOKEN_REFRESHED
        if (event === 'TOKEN_REFRESHED') {
          console.log('⚠️ Evento ignorado:', event);
          return;
        }
        
        await updateUserState(session);
      }
    );

    return () => {
      console.log('🧹 Limpando subscription...');
      subscription.unsubscribe();
    };
  }, []); // Dependências vazias para executar apenas uma vez

  // Timeout de emergência - força fim do loading após 4 segundos
  useEffect(() => {
    if (!loading) return;
    
    const emergencyTimeout = setTimeout(() => {
      if (loading && mountedRef.current) {
        console.log('🚨 TIMEOUT DE EMERGÊNCIA - FORÇANDO FIM DO LOADING');
        forceStopLoading();
      }
    }, 4000);

    return () => clearTimeout(emergencyTimeout);
  }, [loading, forceStopLoading]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      console.log('🧹 Limpando AuthProvider...');
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (forceTimeoutRef.current) {
        clearTimeout(forceTimeoutRef.current);
      }
    };
  }, []);

  // Login com Google
  const signInWithGoogle = async () => {
    try {
      console.log('🔑 Iniciando login com Google...');
      setLoadingWithTimeout(true, 30000);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('❌ Erro no login com Google:', error);
      setError(error.message || 'Erro ao fazer login com Google');
      setLoadingWithTimeout(false);
    }
  };

  // Logout
  const signOut = async () => {
    try {
      console.log('🚪 AuthContext: Iniciando logout...');
      setError(null);

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }
      
      console.log('✅ AuthContext: Logout do Supabase realizado');
      
      // Resetar estado imediatamente
      setUser(null);
      globalInitialized = false;
      globalInitializing = false;
      
      console.log('✅ AuthContext: Estado resetado, logout concluído');
    } catch (error: any) {
      console.error('❌ AuthContext: Erro no logout:', error);
      setError(error.message || 'Erro ao fazer logout');
      throw error; // Re-throw para que o Header possa capturar
    }
  };

  // Limpa erro
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 