import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, BookOpen, Scroll, Zap, Shield, Eye, Heart } from 'lucide-react';

const Home: React.FC = () => {
  const quickActions = [
    {
      title: 'Criar Personagem',
      description: 'Inicie a criação de um novo personagem para Elaria',
      path: '/characters/new',
      icon: Plus,
      color: 'from-natureza-500 to-natureza-600',
      textColor: 'text-white'
    },
    {
      title: 'Meus Personagens',
      description: 'Visualize e gerencie seus personagens existentes',
      path: '/characters',
      icon: Users,
      color: 'from-agua-500 to-agua-600',
      textColor: 'text-white'
    },
    {
      title: 'Guia de Referência',
      description: 'Consulte raças, classes, regras e informações do sistema',
      path: '/reference',
      icon: BookOpen,
      color: 'from-luz-500 to-luz-600',
      textColor: 'text-white'
    }
  ];

  const classOverview = [
    {
      name: 'Evocador',
      description: 'Mestres dos elementos',
      icon: Zap,
      color: 'fogo'
    },
    {
      name: 'Titã',
      description: 'Guerreiros poderosos',
      icon: Shield,
      color: 'terra'
    },
    {
      name: 'Sentinela',
      description: 'Observadores especializados',
      icon: Eye,
      color: 'natureza'
    },
    {
      name: 'Elo',
      description: 'Mestres da conexão',
      icon: Heart,
      color: 'luz'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-br from-terra-50 to-agua-50 rounded-2xl">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-fantasy font-bold text-slate-800 mb-4">
            Bem-vindo ao mundo de{' '}
            <span className="bg-gradient-to-r from-fogo-500 to-agua-500 bg-clip-text text-transparent">
              Elaria
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Crie e gerencie personagens para o sistema de RPG Elaria, onde os elementos primordiais
            moldam heróis extraordinários em um mundo de magia e aventura.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/characters/new"
              className="bg-gradient-to-r from-fogo-500 to-fogo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-fogo-600 hover:to-fogo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Criar Personagem
            </Link>
            <Link
              to="/reference"
              className="bg-white text-slate-700 px-8 py-3 rounded-lg font-semibold border-2 border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Explorar Sistema
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-3xl font-fantasy font-bold text-slate-800 mb-6">Ações Rápidas</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="group block"
            >
              <div className="card hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-2">
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className={action.textColor} size={24} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{action.title}</h3>
                <p className="text-slate-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Classes Overview */}
      <section>
        <h2 className="text-3xl font-fantasy font-bold text-slate-800 mb-6">Classes de Elaria</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classOverview.map((cls) => (
            <div key={cls.name} className="card text-center hover:shadow-lg transition-all duration-300">
              <div className={`w-16 h-16 bg-gradient-to-br from-${cls.color}-500 to-${cls.color}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <cls.icon className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{cls.name}</h3>
              <p className="text-slate-600 text-sm">{cls.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gradient-to-r from-sombra-50 to-luz-50 rounded-2xl p-8">
        <h2 className="text-3xl font-fantasy font-bold text-slate-800 mb-6 text-center">
          Características do Sistema
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <Scroll className="w-12 h-12 text-terra-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Origens Ricas</h3>
            <p className="text-slate-600">Histórias e passados que moldam seu personagem</p>
          </div>
          <div className="text-center">
            <Zap className="w-12 h-12 text-fogo-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Elementos Vivos</h3>
            <p className="text-slate-600">Seis elementos primordiais com poderes únicos</p>
          </div>
          <div className="text-center">
            <Heart className="w-12 h-12 text-luz-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Conexões Profundas</h3>
            <p className="text-slate-600">Divindades e patronos que guiam sua jornada</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 