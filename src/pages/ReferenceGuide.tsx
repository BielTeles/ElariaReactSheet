import React from 'react';
import { BookOpen, Users, Zap, Scroll, Star } from 'lucide-react';

const ReferenceGuide: React.FC = () => {
  const sections = [
    {
      title: 'Raças',
      description: 'Conheça as raças de Elaria e suas habilidades',
      icon: Users,
      color: 'terra'
    },
    {
      title: 'Classes',
      description: 'Explore as classes e seus caminhos únicos',
      icon: Zap,
      color: 'fogo'
    },
    {
      title: 'Origens',
      description: 'Descubra as origens que moldam os heróis',
      icon: Scroll,
      color: 'agua'
    },
    {
      title: 'Divindades',
      description: 'Os Primeiros e seus domínios elementais',
      icon: Star,
      color: 'luz'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-fantasy font-bold text-slate-800">Guia de Referência</h1>
        <p className="text-slate-600 mt-1">Explore o sistema e mundo de Elaria</p>
      </div>

      {/* Sections grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.title} className="card hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className={`w-12 h-12 bg-gradient-to-br from-${section.color}-500 to-${section.color}-600 rounded-lg flex items-center justify-center mb-4`}>
              <section.icon className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">{section.title}</h3>
            <p className="text-slate-600">{section.description}</p>
          </div>
        ))}
      </div>

      {/* Coming soon */}
      <div className="card">
        <div className="text-center py-12">
          <BookOpen className="w-24 h-24 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Conteúdo de Referência em Desenvolvimento
          </h2>
          <p className="text-slate-600 mb-6">
            O guia completo de referência será implementado nas próximas etapas.
          </p>
          <p className="text-sm text-slate-500">
            Baseado na documentação completa do sistema Elaria!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReferenceGuide; 