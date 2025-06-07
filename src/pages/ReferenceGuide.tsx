import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Shield, Wand2, Users, Scroll, Star } from 'lucide-react';

const ReferenceGuide: React.FC = () => {
  const sections = [
    {
      title: 'Raças',
      description: 'Conheça as diferentes raças de Elaria',
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Classes',
      description: 'Explore as classes e habilidades disponíveis',
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Magias',
      description: 'Descubra feitiços e habilidades mágicas',
      icon: Wand2,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Origens',
      description: 'Histórias de origem para seu personagem',
      icon: Scroll,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Divindades',
      description: 'Patronos e deidades do mundo de Elaria',
      icon: Star,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Melhorado */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl border-4 border-indigo-300">
        <div className="flex items-center space-x-4 mb-4">
          <Link 
            to="/" 
            className="p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors border-2 border-white/30 hover:border-white/50"
          >
            <ArrowLeft size={24} className="text-white" />
          </Link>
          <div className="flex items-center space-x-3">
            <BookOpen size={32} className="text-yellow-300" />
            <div>
              <h1 className="text-4xl font-fantasy font-bold">Guia de Referência</h1>
              <p className="text-indigo-100 text-lg font-medium">Explore o sistema e mundo de Elaria</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 border-2 border-white/20">
          <p className="text-white/90 font-medium">
            📚 Consulte informações detalhadas sobre raças, classes, magias e muito mais do universo de Elaria.
          </p>
        </div>
      </div>

      {/* Sections Grid Melhorado */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div key={section.title} className={`${section.bgColor} rounded-xl shadow-2xl border-4 ${section.borderColor} p-6 hover:shadow-2xl hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-2`}>
            <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
              <section.icon className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{section.title}</h3>
            <p className="text-gray-700 text-center font-medium">{section.description}</p>
          </div>
        ))}
      </div>

      {/* Content Placeholder Melhorado */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-12 text-center shadow-2xl border-4 border-gray-200">
        <BookOpen className="w-32 h-32 text-blue-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          📖 Conteúdo em Desenvolvimento
        </h2>
        <p className="text-gray-700 mb-6 text-lg font-medium max-w-2xl mx-auto">
          O guia de referência completo está sendo desenvolvido. Em breve você terá acesso a todas as informações sobre raças, classes, magias e muito mais do fascinante mundo de Elaria.
        </p>
        <div className="bg-blue-100 rounded-lg p-4 border-2 border-blue-200 max-w-md mx-auto">
          <p className="text-blue-800 font-bold">
            🚀 Fique atento às atualizações!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReferenceGuide; 