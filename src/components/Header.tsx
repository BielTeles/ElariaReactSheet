// ===================================================================
// COMPONENTE HEADER - NAVEGAÇÃO PRINCIPAL
// ===================================================================

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Users, Home, Menu, User, LogOut } from 'lucide-react';
import { ROUTES } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';

/**
 * Item de navegação
 */
interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  ariaLabel: string;
}

/**
 * Componente Header principal
 */
const Header: React.FC = () => {
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * Verifica se a rota está ativa
   */
  const isActive = (path: string): boolean => {
    if (path === ROUTES.HOME) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  /**
   * Lista de itens de navegação memoizada
   */
  const navItems = useMemo<NavItem[]>(() => [
    { 
      path: ROUTES.HOME, 
      label: 'Início', 
      icon: Home,
      ariaLabel: 'Ir para página inicial'
    },
    { 
      path: ROUTES.CHARACTERS, 
      label: 'Personagens', 
      icon: Users,
      ariaLabel: 'Ver lista de personagens'
    },
    { 
      path: ROUTES.REFERENCE, 
      label: 'Referência', 
      icon: BookOpen,
      ariaLabel: 'Consultar guia de referência'
    },
  ], []);

  /**
   * Renderiza um item de navegação
   */
  const renderNavItem = (item: NavItem, isMobileNav = false) => {
    const active = isActive(item.path);
    const Icon = item.icon;
    
    const baseClasses = `
      flex items-center space-x-2 px-6 py-3 rounded-lg 
      transition-all duration-200 font-semibold border-2
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    `;
    
    const activeClasses = `
      bg-yellow-400 text-black shadow-lg border-yellow-600
      transform hover:scale-105
    `;
    
    const inactiveClasses = `
      text-white hover:bg-white/20 hover:text-yellow-200 
      border-white/30 hover:border-yellow-400 hover:shadow-md
    `;

    const className = `${baseClasses} ${active ? activeClasses : inactiveClasses}`.trim();

    return (
      <Link
        key={item.path}
        to={item.path}
        className={className}
        aria-label={item.ariaLabel}
        aria-current={active ? 'page' : undefined}
      >
        <Icon size={isMobileNav ? 24 : 20} aria-hidden="true" />
        <span className={isMobileNav ? 'text-sm' : 'text-base'}>
          {item.label}
        </span>
      </Link>
    );
  };

  /**
   * Fecha menu do usuário quando clica fora
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Verificar se o clique foi fora do menu E fora do botão do perfil
      const isOutsideMenu = userMenuRef.current && !userMenuRef.current.contains(target);
      const isOutsideProfileButton = profileButtonRef.current && !profileButtonRef.current.contains(target);
      
      if (isOutsideMenu && isOutsideProfileButton && isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    // Adicionar listener apenas quando o menu estiver aberto
    if (isUserMenuOpen) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
    }
    
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);

  /**
   * Faz logout
   */
  const handleDropdownLogout = async () => {
    // Fechar o menu imediatamente
    setIsUserMenuOpen(false);
    
    try {
      await signOut();
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error);
    }
  };



  /**
   * Renderiza o menu do usuário autenticado
   */
  const renderAuthenticatedUserMenu = () => {
    return (
      <div className="flex items-center space-x-3">
        {/* Botão Criar Personagem */}
        <Link
          to={ROUTES.CHARACTER_NEW}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors font-semibold"
        >
          <span className="hidden sm:inline">Criar Personagem</span>
        </Link>

        {/* Menu do Usuário */}
        <div className="relative" ref={userMenuRef}>
          <button
            ref={profileButtonRef}
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors border border-white/30 hover:border-yellow-400"
            aria-label="Menu do usuário"
          >
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="Avatar" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={16} className="text-black" />
              )}
            </div>
            <span className="hidden md:inline font-semibold">
              {user?.username || 'Usuário'}
            </span>
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-600">
                  {user?.email}
                </p>
              </div>
              
              <div
                onClick={handleDropdownLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDropdownLogout();
                  }
                }}
              >
                <LogOut size={16} />
                <span>Sair</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  /**
   * Renderiza o menu para usuário não autenticado
   */
  const renderGuestUserMenu = () => {
    return (
      <div className="flex items-center space-x-2">
        <GoogleLoginButton
          variant="outline"
          size="sm"
          className="!px-3 !py-2"
        >
          <span className="hidden sm:inline">Entrar</span>
          <span className="sm:hidden">Login</span>
        </GoogleLoginButton>
      </div>
    );
  };

  /**
   * Renderiza o menu do usuário baseado no estado de autenticação
   */
  const renderUserMenu = () => {
    if (loading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      );
    }

    return user ? renderAuthenticatedUserMenu() : renderGuestUserMenu();
  };

  return (
    <header 
      className="bg-gradient-to-r from-gray-900 to-black shadow-2xl border-b-4 border-yellow-400"
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to={ROUTES.HOME} 
            className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg p-1"
            aria-label="Elaria RPG - Voltar ao início"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-red-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-black font-bold text-xl" aria-hidden="true">E</span>
            </div>
            <div>
              <h1 className="text-white font-fantasy text-2xl font-bold">
                🎲 ELARIA RPG
              </h1>
              <p className="text-yellow-200 text-sm font-semibold">
                Sistema de Fichas
              </p>
            </div>
          </Link>

          {/* Navegação Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <nav 
              className="flex space-x-2" 
              role="navigation"
              aria-label="Navegação principal"
            >
              {navItems.map(item => renderNavItem(item))}
            </nav>
            
            {/* Menu do usuário */}
            {renderUserMenu()}
          </div>

          {/* Menu Mobile Toggle */}
          <div className="md:hidden">
            <button 
              className="text-white p-3 hover:bg-yellow-400 hover:text-black rounded-lg transition-colors border-2 border-white hover:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              aria-label="Abrir menu de navegação"
              aria-expanded="false"
              onClick={() => {
                console.log('Menu mobile clicado - implementar toggle');
              }}
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Navegação Mobile */}
        <nav 
          className="md:hidden border-t-2 border-yellow-400 py-4 bg-black/50"
          role="navigation"
          aria-label="Navegação mobile"
        >
          <div className="flex justify-around mb-4">
            {navItems.map(item => {
              const active = isActive(item.path);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex flex-col items-center space-y-1 py-3 px-4 rounded-lg 
                    transition-colors border-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${active 
                      ? 'text-black bg-yellow-400 font-bold border-yellow-600' 
                      : 'text-white hover:text-yellow-200 hover:bg-white/10 border-white/30 hover:border-yellow-400'
                    }
                  `}
                  aria-label={item.ariaLabel}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={24} aria-hidden="true" />
                  <span className="text-sm font-semibold">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
          
          {/* Menu do usuário mobile */}
          <div className="flex justify-center">
            {renderUserMenu()}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 