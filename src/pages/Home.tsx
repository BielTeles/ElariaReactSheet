import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, BookOpen, Scroll, Zap, Shield, Eye, Heart, LogIn, UserPlus } from 'lucide-react';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';
import { ROUTES } from '../constants';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useFirebaseAuth();

  const quickActions = [
    {
      title: 'Criar Personagem',
      description: 'Inicie a criação de um novo personagem para Elaria',
      path: ROUTES.CHARACTER_NEW,
      icon: Plus,
      color: 'from-green-500 to-green-600',
      textColor: 'text-white'
    },
    {
      title: 'Meus Personagens',
      description: 'Visualize e gerencie seus personagens existentes',
      path: ROUTES.CHARACTERS,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-white'
    },
    {
      title: 'Guia de Referência',
      description: 'Consulte raças, classes, regras e informações do sistema',
      path: ROUTES.REFERENCE,
      icon: BookOpen,
      color: 'from-yellow-500 to-yellow-600',
      textColor: 'text-white'
    }
  ];

  const classOverview = [
    {
      name: 'Evocador',
      description: 'Mestres dos elementos',
      icon: Zap,
      color: 'red'
    },
    {
      name: 'Titã',
      description: 'Guerreiros poderosos',
      icon: Shield,
      color: 'amber'
    },
    {
      name: 'Sentinela',
      description: 'Observadores especializados',
      icon: Eye,
      color: 'green'
    },
    {
      name: 'Elo',
      description: 'Mestres da conexão',
      icon: Heart,
      color: 'blue'
    }
  ];

  const authActions = [
    {
      title: 'Fazer Login',
      description: 'Entre na sua conta para acessar seus personagens',
      path: ROUTES.LOGIN,
      icon: LogIn,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-white'
    },
    {
      title: 'Criar Conta',
      description: 'Registre-se para começar sua jornada em Elaria',
      path: ROUTES.REGISTER,
      icon: UserPlus,
      color: 'from-green-500 to-green-600',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-white rounded-2xl border-4 border-blue-200 shadow-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-fantasy font-bold text-gray-900 mb-4">
            {isAuthenticated ? `Bem-vindo de volta, ${user?.username}!` : 'Bem-vindo ao mundo de'}{' '}
            {!isAuthenticated && (
              <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                Elaria
              </span>
            )}
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed font-medium">
            {isAuthenticated 
              ? 'Continue sua jornada épica em Elaria. Seus personagens aguardam por novas aventuras!'
              : 'Crie e gerencie personagens para o sistema de RPG Elaria, onde os elementos primordiais moldam heróis extraordinários em um mundo de magia e aventura.'
            }
          </p>
          <div className="flex justify-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.CHARACTER_NEW}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-lg font-bold hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-red-800"
                >
                  Criar Personagem
                </Link>
                <Link
                  to={ROUTES.CHARACTERS}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-blue-800"
                >
                  Meus Personagens
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.REGISTER}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-green-800"
                >
                  Criar Conta
                </Link>
                <Link
                  to={ROUTES.REFERENCE}
                  className="bg-white text-gray-900 px-8 py-4 rounded-lg font-bold border-4 border-gray-400 hover:border-gray-600 hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Explorar Sistema
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-4xl font-fantasy font-bold text-black mb-6">
          🎯 {isAuthenticated ? 'Ações Rápidas' : 'Comece Agora'}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {(isAuthenticated ? quickActions : [...authActions, quickActions[2]]).map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="group block"
            >
              <div className="bg-white rounded-xl shadow-2xl border-4 border-gray-300 p-6 hover:shadow-2xl hover:border-blue-400 transition-all duration-300 transform group-hover:-translate-y-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className={action.textColor} size={24} />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">{action.title}</h3>
                <p className="text-gray-700 font-medium">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Classes Overview - MELHOR CONTRASTE */}
      <section>
        <h2 className="text-4xl font-fantasy font-bold text-black mb-6">⚔️ Classes de Elaria</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classOverview.map((cls) => (
            <div key={cls.name} className="bg-white rounded-xl shadow-2xl border-4 border-gray-300 p-6 text-center hover:shadow-2xl hover:border-purple-400 transition-all duration-300">
              <div className={`w-16 h-16 bg-gradient-to-br from-${cls.color}-500 to-${cls.color}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <cls.icon className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">{cls.name}</h3>
              <p className="text-gray-700 text-sm font-medium">{cls.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features - FUNDO COLORIDO COM CONTRASTE */}
      <section className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8 border-4 border-purple-300 shadow-2xl">
        <h2 className="text-4xl font-fantasy font-bold text-black mb-6 text-center">
          ✨ Características do Sistema
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center bg-white rounded-lg p-4 shadow-lg border-2 border-gray-300">
            <Scroll className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-black mb-2">Origens Ricas</h3>
            <p className="text-gray-700 font-medium">Histórias e passados que moldam seu personagem</p>
          </div>
          <div className="text-center bg-white rounded-lg p-4 shadow-lg border-2 border-gray-300">
            <Zap className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-black mb-2">Elementos Vivos</h3>
            <p className="text-gray-700 font-medium">Seis elementos primordiais com poderes únicos</p>
          </div>
          <div className="text-center bg-white rounded-lg p-4 shadow-lg border-2 border-gray-300">
            <Heart className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-black mb-2">Conexões Profundas</h3>
            <p className="text-gray-700 font-medium">Divindades e patronos que guiam sua jornada</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 