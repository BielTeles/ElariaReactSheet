import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Shield, Users, Scroll, Star, ChevronDown, ChevronRight, Zap, Crown, Target, Heart } from 'lucide-react';
import { races } from '../data/races';
import { classes, subclassData } from '../data/classes';
import { origins } from '../data/origins';
import { deities } from '../data/deities';

const ReferenceGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getClassIcon = (classId: string) => {
    switch (classId) {
      case 'evocador': return <Zap className="w-5 h-5 text-white" />;
      case 'titã': return <Shield className="w-5 h-5 text-white" />;
      case 'sentinela': return <Target className="w-5 h-5 text-white" />;
      case 'elo': return <Heart className="w-5 h-5 text-white" />;
      default: return <Crown className="w-5 h-5 text-white" />;
    }
  };

  const getDeityIcon = (deityId: string) => {
    switch (deityId) {
      case 'ignis': return '🔥';
      case 'ondina': return '🌊';
      case 'terrus': return '🌍';
      case 'zephyrus': return '💨';
      case 'lumina': return '☀️';
      case 'noctus': return '🌙';
      default: return '⭐';
    }
  };

  const sections = [
    {
      id: 'races',
      title: 'Raças',
      description: 'Conheça as diferentes raças de Elaria',
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'classes',
      title: 'Classes',
      description: 'Explore as classes e habilidades disponíveis',
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'origins',
      title: 'Origens',
      description: 'Histórias de origem para seu personagem',
      icon: Scroll,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'deities',
      title: 'Divindades',
      description: 'Patronos e deidades do mundo de Elaria',
      icon: Star,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'system',
      title: 'Sistema',
      description: 'Mecânicas e regras básicas do jogo',
      icon: BookOpen,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
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
            📚 Explore o rico universo de Elaria através de suas raças únicas, classes poderosas, origens fascinantes e divindades primordiais. Cada elemento foi cuidadosamente elaborado para criar experiências de RPG memoráveis.
          </p>
        </div>
      </div>

      {/* Navigation Sections */}
      {!activeSection ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`${section.bgColor} rounded-xl shadow-2xl border-4 ${section.borderColor} p-6 hover:shadow-2xl hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-2 text-left`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                <section.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{section.title}</h3>
              <p className="text-gray-700 text-center font-medium">{section.description}</p>
            </button>
          ))}
        </div>
      ) : (
        <div>
          {/* Back Button */}
          <button
            onClick={() => setActiveSection(null)}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar ao Menu
          </button>

          {/* Content by Section */}
          {activeSection === 'races' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">🧝 Raças de Elaria</h2>
              {Object.values(races).map((race) => (
                <div key={race.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleExpanded(race.id)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{race.name}</h3>
                          <p className="text-sm text-gray-600">+{race.bonusValue} {race.attributeBonus === 'escolha' ? 'Atributo à escolha' : race.attributeBonus} • Movimento: {race.baseMovement}m</p>
                        </div>
                      </div>
                      {expandedItems.has(race.id) ? 
                        <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      }
                    </div>
                  </button>
                  
                  {expandedItems.has(race.id) && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="mt-4 space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Descrição</h4>
                          <p className="text-gray-700 leading-relaxed">{race.description}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Patrono</h4>
                          <p className="text-purple-700 font-medium">{race.patron}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Traços Raciais</h4>
                          <div className="space-y-2">
                            {race.traits.map((trait, index) => (
                              <div key={index} className="bg-green-50 rounded-lg p-3 border border-green-200">
                                <p className="text-sm text-green-800">
                                  <strong>{trait.split(':')[0]}:</strong>
                                  {trait.split(':')[1]}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeSection === 'classes' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">⚔️ Classes de Elaria</h2>
              {Object.values(classes).map((classData) => (
                <div key={classData.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleExpanded(classData.id)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          {getClassIcon(classData.id)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{classData.name}</h3>
                          <p className="text-sm text-gray-600">
                            DV: d{classData.hitDie} • PV/nível: +{classData.hitPointsPerLevel} • 
                            {classData.manaPointsBase > 0 && ` PM: ${classData.manaPointsBase}+${classData.manaPointsPerLevel}/nível`}
                            {classData.vigorBase && ` • Vigor: ${classData.vigorBase}+CON`}
                          </p>
                        </div>
                      </div>
                      {expandedItems.has(classData.id) ? 
                        <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      }
                    </div>
                  </button>
                  
                  {expandedItems.has(classData.id) && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="mt-4 space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Descrição</h4>
                          <p className="text-gray-700 leading-relaxed">{classData.description}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Perícias Disponíveis</h4>
                            <div className="flex flex-wrap gap-1">
                              {classData.availableSkills.map((skill) => (
                                <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">Escolha {classData.skillChoices} perícias</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Subclasses</h4>
                            <div className="space-y-2">
                              {classData.subclasses.map((subclassId) => {
                                const subclass = subclassData[subclassId];
                                return subclass ? (
                                  <div key={subclassId} className="bg-blue-50 rounded p-2 border border-blue-200">
                                    <p className="font-medium text-blue-800 text-sm">{subclass.name}</p>
                                    <p className="text-xs text-blue-700">{subclass.description}</p>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeSection === 'origins' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">📜 Origens de Elaria</h2>
              {Object.values(origins).map((origin) => (
                <div key={origin.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleExpanded(origin.id)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                          <Scroll className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{origin.name}</h3>
                          <p className="text-sm text-gray-600">
                            Perícias: {origin.trainedSkills.join(', ')}
                          </p>
                        </div>
                      </div>
                      {expandedItems.has(origin.id) ? 
                        <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      }
                    </div>
                  </button>
                  
                  {expandedItems.has(origin.id) && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="mt-4 space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">História</h4>
                          <p className="text-gray-700 leading-relaxed">{origin.description}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Benefício: {origin.benefit.name}</h4>
                          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                            <p className="text-sm text-yellow-800">{origin.benefit.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeSection === 'deities' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">✨ Divindades de Elaria</h2>
              {Object.values(deities).map((deity) => (
                <div key={deity.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleExpanded(deity.id)}
                    className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
                          {getDeityIcon(deity.id)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{deity.name}</h3>
                          <p className="text-sm text-purple-600 font-medium">{deity.title}</p>
                          <p className="text-sm text-gray-600">Perícia: {deity.trainedSkill}</p>
                        </div>
                      </div>
                      {expandedItems.has(deity.id) ? 
                        <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      }
                    </div>
                  </button>
                  
                  {expandedItems.has(deity.id) && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="mt-4 space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Descrição</h4>
                          <p className="text-gray-700 leading-relaxed">{deity.description}</p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Domínios</h4>
                            <div className="flex flex-wrap gap-1">
                              {deity.domains.map((domain) => (
                                <span key={domain} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                  {domain}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Essências</h4>
                            <div className="flex flex-wrap gap-1">
                              {deity.essences.map((essence) => (
                                <span key={essence} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                                  {essence}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Seguidores</h4>
                          <p className="text-gray-700 text-sm">{deity.followers.join(', ')}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Benefício: {deity.benefit.name}</h4>
                          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                            <p className="text-sm text-purple-800">{deity.benefit.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
          </div>
        ))}
            </div>
                     )}

           {activeSection === 'system' && (
             <div className="space-y-6">
               <h2 className="text-3xl font-bold text-gray-800 mb-6">⚙️ Sistema de Elaria</h2>
               
               {/* As Seis Grandes Essências - CORRIGIDO */}
               <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                 <h3 className="text-2xl font-bold text-gray-800 mb-4">✨ As Seis Grandes Essências Primordiais</h3>
                 <p className="text-gray-700 mb-4">
                   O mundo de Elaria foi tecido por seis Essências primordiais que definem toda a realidade. Cada atributo dos personagens é o reflexo mortal dessas forças fundamentais:
                 </p>
                 <div className="grid md:grid-cols-2 gap-4">
                   <div className="space-y-3">
                     <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                       <h4 className="font-bold text-red-800">💪 Vontade Indomável</h4>
                       <p className="text-sm text-red-700"><strong>Força (FOR):</strong> Afirmação e poder direto. Poder muscular bruto e capacidade física.</p>
                     </div>
                     <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                       <h4 className="font-bold text-blue-800">🌊 Fluxo Incessante</h4>
                       <p className="text-sm text-blue-700"><strong>Destreza (DES):</strong> Mudança, movimento e adaptabilidade rápida. Agilidade e reflexos.</p>
                     </div>
                     <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                       <h4 className="font-bold text-green-800">🛡️ Resiliência Eterna</h4>
                       <p className="text-sm text-green-700"><strong>Constituição (CON):</strong> Permanência, durabilidade e capacidade de suportar. Resistência física.</p>
                     </div>
                   </div>
                   <div className="space-y-3">
                     <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                       <h4 className="font-bold text-purple-800">🎯 Olhar Penetrante</h4>
                       <p className="text-sm text-purple-700"><strong>Inteligência (INT):</strong> Razão, compreensão de padrões e análise crítica. Raciocínio lógico.</p>
                     </div>
                     <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                       <h4 className="font-bold text-indigo-800">🧘 Sentir Profundo</h4>
                       <p className="text-sm text-indigo-700"><strong>Sabedoria (SAB):</strong> Intuição, percepção sutil e conexão empática. Sintonia com o ambiente.</p>
                     </div>
                     <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                       <h4 className="font-bold text-amber-800">🔥 Chama Interior</h4>
                       <p className="text-sm text-amber-700"><strong>Carisma (CAR):</strong> Presença, conexão, inspiração e influência. Força de personalidade.</p>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Sistema de Dados - CORRIGIDO */}
               <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                 <h3 className="text-2xl font-bold text-gray-800 mb-4">🎲 Sistema de Dados e Testes</h3>
                 <div className="space-y-4">
                   <div>
                     <h4 className="font-bold text-gray-800 mb-2">Como Fazer um Teste</h4>
                     <p className="text-gray-700 mb-2">1. MJ determina <strong>Atributo</strong> (para dados de vantagem/desvantagem) e <strong>Perícia</strong></p>
                     <p className="text-gray-700 mb-2">2. Role dados conforme valor do atributo e pegue o maior/menor</p>
                     <p className="text-gray-700 mb-2">3. Compare resultado d20 com Planilha de Sucessos usando valor da perícia</p>
                   </div>

                   <div>
                     <h4 className="font-bold text-gray-800 mb-2">Dados de Vantagem/Desvantagem por Atributo</h4>
                     <div className="grid md:grid-cols-3 gap-3">
                       <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                         <p className="text-sm text-red-800">
                           <strong>Atributo -1 ou menos:</strong><br/>
                           Role 2d20, use o MENOR
                         </p>
                       </div>
                       <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                         <p className="text-sm text-gray-800">
                           <strong>Atributo 0 ou 1:</strong><br/>
                           Role 1d20 normal
                         </p>
                       </div>
                       <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                         <p className="text-sm text-green-800">
                           <strong>Atributo 2+:</strong><br/>
                           Role múltiplos d20, use o MAIOR<br/>
                           <small>(2-3: 2d20, 4-5: 3d20, etc.)</small>
                         </p>
                       </div>
                     </div>
                   </div>

                   <div>
                     <h4 className="font-bold text-gray-800 mb-2">Graus de Sucesso</h4>
                     <div className="bg-gray-50 p-3 rounded-lg">
                       <p className="text-sm text-gray-600">
                         <strong>Fracasso Extremo:</strong> 1 natural no d20<br/>
                         <strong>Fracasso Normal:</strong> Abaixo do necessário<br/>
                         <strong>Sucesso Normal:</strong> Alcança valor base<br/>
                         <strong>Sucesso Bom:</strong> Alcança valor superior<br/>
                         <strong>Sucesso Extremo:</strong> 20 natural ou valor máximo
                       </p>
                     </div>
                   </div>

                   <div>
                     <h4 className="font-bold text-gray-800 mb-2">Testes de Resistência</h4>
                     <div className="grid md:grid-cols-3 gap-3">
                       <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                         <p className="text-sm text-orange-800">
                           <strong>Fortitude (CON):</strong><br/>
                           Doenças, venenos, fadiga
                         </p>
                       </div>
                       <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                         <p className="text-sm text-blue-800">
                           <strong>Reflexos (DES):</strong><br/>
                           Explosões, armadilhas, quedas
                         </p>
                       </div>
                       <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                         <p className="text-sm text-purple-800">
                           <strong>Vontade (SAB):</strong><br/>
                           Medo, encantamentos, controle mental
                         </p>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Os Seis Elementos - CORRETO */}
               <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                 <h3 className="text-2xl font-bold text-gray-800 mb-4">🌟 Os Seis Elementos</h3>
                 <p className="text-gray-700 mb-4">
                   A magia em Elaria deriva dos seis elementos fundamentais. Evocadores especializam-se em um Caminho Elemental:
                 </p>
                 <div className="grid md:grid-cols-3 gap-4">
                   <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                     <div className="text-3xl mb-2">🔥</div>
                     <h4 className="font-bold text-red-800">Fogo</h4>
                     <p className="text-sm text-red-700">Paixão, transformação, energia primordial da criação e destruição</p>
                   </div>
                   <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                     <div className="text-3xl mb-2">🌊</div>
                     <h4 className="font-bold text-blue-800">Água</h4>
                     <p className="text-sm text-blue-700">Fluidez, adaptabilidade, ciclos da vida, cura e mistérios</p>
                   </div>
                   <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                     <div className="text-3xl mb-2">🌍</div>
                     <h4 className="font-bold text-green-800">Terra</h4>
                     <p className="text-sm text-green-700">Estabilidade, resistência, permanência e crescimento</p>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                     <div className="text-3xl mb-2">💨</div>
                     <h4 className="font-bold text-gray-800">Ar</h4>
                     <p className="text-sm text-gray-700">Liberdade, movimento, comunicação e mudança rápida</p>
                   </div>
                   <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center">
                     <div className="text-3xl mb-2">☀️</div>
                     <h4 className="font-bold text-yellow-800">Luz</h4>
                     <p className="text-sm text-yellow-700">Verdade, clareza, esperança, proteção e revelação</p>
                   </div>
                   <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
                     <div className="text-3xl mb-2">🌙</div>
                     <h4 className="font-bold text-purple-800">Sombra</h4>
                     <p className="text-sm text-purple-700">Mistério, intuição, segredos, repouso e o oculto</p>
                   </div>
                 </div>
               </div>

               {/* Recursos do Personagem - CORRIGIDO */}
               <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                 <h3 className="text-2xl font-bold text-gray-800 mb-4">💎 Recursos do Personagem</h3>
                 <div className="grid md:grid-cols-3 gap-4">
                   <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                     <h4 className="font-bold text-red-800 flex items-center gap-2">
                       <Heart className="w-5 h-5" />
                       Pontos de Vida (PV)
                     </h4>
                     <p className="text-sm text-red-700 mt-2">
                       Resistência física e capacidade de suportar danos. Baseado na classe e Constituição. Representa sua durabilidade em combate.
                     </p>
                   </div>
                   <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                     <h4 className="font-bold text-blue-800 flex items-center gap-2">
                       <Zap className="w-5 h-5" />
                       Pontos de Mana (PM)
                     </h4>
                     <p className="text-sm text-blue-700 mt-2">
                       Energia mística para conjurar magias e habilidades especiais. Usado por Evocadores, Sentinelas e Elos para suas habilidades sobrenaturais.
                     </p>
                   </div>
                   <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                     <h4 className="font-bold text-orange-800 flex items-center gap-2">
                       <Shield className="w-5 h-5" />
                       Pontos de Vigor (V)
                     </h4>
                     <p className="text-sm text-orange-700 mt-2">
                       Energia física bruta exclusiva dos Titãs. Igual a 1 + Constituição. Usado para manobras poderosas e habilidades de combate corpo a corpo.
        </p>
      </div>
                 </div>
               </div>

               {/* Combate - NOVO */}
               <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                 <h3 className="text-2xl font-bold text-gray-800 mb-4">⚔️ Sistema de Combate</h3>
                 <div className="space-y-4">
                   <div>
                     <h4 className="font-bold text-gray-800 mb-2">Sequência de Ataque</h4>
                     <div className="bg-gray-50 p-3 rounded-lg">
                       <p className="text-sm text-gray-700">
                         1. <strong>Declarar Ataque:</strong> Atacante escolhe alvo e tipo de ataque<br/>
                         2. <strong>Teste de Ataque:</strong> Rola dados conforme atributo relevante<br/>
                         3. <strong>Defensor Escolhe Reação:</strong> Bloqueio (CON) ou Esquiva (DES)<br/>
                         4. <strong>Teste de Reação:</strong> Defensor rola sua defesa<br/>
                         5. <strong>Comparar Sucessos:</strong> Determina se ataque acerta<br/>
                         6. <strong>Calcular Dano:</strong> Rola dano e aplica Redução de Dano (RD)
                       </p>
                     </div>
                   </div>

                   <div>
                     <h4 className="font-bold text-gray-800 mb-2">Resolução de Defesa</h4>
                     <div className="grid md:grid-cols-3 gap-3">
                       <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                         <p className="text-sm text-green-800">
                           <strong>Defesa Superior:</strong><br/>
                           Reação > Ataque = Anula
                         </p>
                       </div>
                       <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                         <p className="text-sm text-yellow-800">
                           <strong>Defesa Igual:</strong><br/>
                           Bloqueio = Metade do dano<br/>
                           Esquiva = Dano total
                         </p>
                       </div>
                       <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                         <p className="text-sm text-red-800">
                           <strong>Defesa Inferior:</strong><br/>
                           Reação < Ataque = Acerta
                         </p>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}
         </div>
       )}
    </div>
  );
};

export default ReferenceGuide; 