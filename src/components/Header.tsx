import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, BookOpen, Users, Home } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/characters', label: 'Personagens', icon: Users },
    { path: '/reference', label: 'Referência', icon: BookOpen },
  ];

  return (
    <header className="bg-gradient-to-r from-terra-700 to-agua-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-luz-500 to-fogo-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-white font-fantasy text-xl font-bold">Elaria RPG</h1>
              <p className="text-slate-200 text-xs">Sistema de Fichas</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive(path)
                    ? 'bg-white/20 text-white'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white p-2">
              <User size={24} />
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="md:hidden border-t border-white/20 py-4">
          <div className="flex justify-around">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center space-y-1 py-2 ${
                  isActive(path) ? 'text-white' : 'text-slate-300'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs">{label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 