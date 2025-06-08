// ===================================================================
// COMPONENTE HEADER - NAVEGAÇÃO PRINCIPAL
// ===================================================================

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Users, Home, Menu, User, LogOut, LogIn, UserPlus, ChevronDown } from 'lucide-react';
import { ROUTES } from '../constants';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';

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
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useFirebaseAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fechar menu do usuário quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
   * Renderiza o menu do usuário (autenticado)
   */
  const renderUserMenu = () => {
    if (!isAuthenticated || !user) {
      return (
        <div className="flex items-center space-x-2">
          <Link
            to={ROUTES.LOGIN}
            className="flex items-center space-x-2 px-4 py-2 text-white hover:text-yellow-200 transition-colors"
          >
            <LogIn size={20} />
            <span className="hidden sm:inline">Entrar</span>
          </Link>
          <Link
            to={ROUTES.REGISTER}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors font-semibold"
          >
            <UserPlus size={20} />
            <span className="hidden sm:inline">Registrar</span>
          </Link>
        </div>
      );
    }

         return (
       <div className="relative" ref={userMenuRef}>
         <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center space-x-2 px-4 py-2 text-white hover:text-yellow-200 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <User size={16} className="text-black" />
          </div>
          <span className="hidden sm:inline font-medium">{user.username}</span>
          <ChevronDown size={16} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="py-2">
              <Link
                to={ROUTES.PROFILE}
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <User size={16} />
                <span>Perfil</span>
              </Link>
              <hr className="my-2" />
              <button
                onClick={() => {
                  logout();
                  setIsUserMenuOpen(false);
                  navigate(ROUTES.HOME);
                }}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
              >
                <LogOut size={16} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
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
              // TODO: Implementar toggle do menu mobile
              onClick={() => {
                // Por enquanto apenas mostra o menu sempre visível
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
          <div className="flex justify-around">
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
        </nav>
      </div>
    </header>
  );
};

export default Header; 