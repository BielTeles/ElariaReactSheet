import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Shield, Wand2, Users, Scroll, Star } from 'lucide-react';

const ReferenceGuide: React.FC = () => {
  const sections = [
    {
      title: 'Raças',
      description: 'Conheça as diferentes raças de Elaria',
      icon: Users,
      color: 'from-natureza-500 to-natureza-600'
    },
    {
      title: 'Classes',
      description: 'Explore as classes e habilidades disponíveis',
      icon: Shield,
      color: 'from-agua-500 to-agua-600'
    },
    {
      title: 'Magias',
      description: 'Descubra feitiços e habilidades mágicas',
      icon: Wand2,
      color: 'from-fogo-500 to-fogo-600'
    },
    {
      title: 'Origens',
      description: 'Histórias de origem para seu personagem',
      icon: Scroll,
      color: 'from-terra-500 to-terra-600'
    },
    {
      title: 'Divindades',
      description: 'Patronos e deidades do mundo de Elaria',
      icon: Star,
      color: 'from-luz-500 to-luz-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link 
          to="/" 
          className="p-2 text-contrast-medium hover:text-contrast-high transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-fantasy font-bold text-contrast-high">Guia de Referência</h1>
          <p className="text-contrast-medium mt-1">Explore o sistema e mundo de Elaria</p>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div key={section.title} className="card hover:shadow-xl transition-all duration-300">
            <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center mb-4`}>
              <section.icon className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-contrast-high mb-2">{section.title}</h3>
            <p className="text-contrast-medium">{section.description}</p>
          </div>
        ))}
      </div>

      {/* Content Placeholder */}
      <div className="card text-center py-12">
        <BookOpen className="w-24 h-24 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-contrast-high mb-4">
          Conteúdo em Desenvolvimento
        </h2>
        <p className="text-contrast-medium mb-6">
          O guia de referência completo está sendo desenvolvido. Em breve você terá acesso a todas as informações sobre raças, classes, magias e muito mais.
        </p>
        <p className="text-sm text-contrast-low">
          Fique atento às atualizações!
        </p>
      </div>
    </div>
  );
};

export default ReferenceGuide; 