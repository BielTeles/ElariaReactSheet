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
    <header className="bg-gradient-to-r from-gray-900 to-black shadow-2xl border-b-4 border-yellow-400">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-red-500 rounded-full flex items-center justify-center border-4 border-white">
              <span className="text-black font-bold text-xl">E</span>
            </div>
            <div>
              <h1 className="text-white font-fantasy text-2xl font-bold">🎲 ELARIA RPG</h1>
              <p className="text-yellow-200 text-sm font-semibold">Sistema de Fichas</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors duration-200 border-2 ${
                  isActive(path)
                    ? 'bg-yellow-400 text-black font-bold shadow-lg border-yellow-600'
                    : 'text-white hover:bg-white/20 hover:text-yellow-200 font-semibold border-white/30 hover:border-yellow-400'
                }`}
              >
                <Icon size={20} />
                <span className="font-semibold">{label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white p-3 hover:bg-yellow-400 hover:text-black rounded-lg transition-colors border-2 border-white hover:border-yellow-400">
              <User size={24} />
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="md:hidden border-t-2 border-yellow-400 py-4 bg-black/50">
          <div className="flex justify-around">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center space-y-1 py-3 px-4 rounded-lg transition-colors border-2 ${
                  isActive(path) ? 'text-black bg-yellow-400 font-bold border-yellow-600' : 'text-white hover:text-yellow-200 hover:bg-white/10 border-white/30 hover:border-yellow-400'
                }`}
              >
                <Icon size={24} />
                <span className="text-sm font-semibold">{label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 