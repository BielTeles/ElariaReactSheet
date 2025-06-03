import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  User, Heart, Zap, Shield, Sword, Star, ArrowLeft, 
  Edit3, Save, FileText, Package, Coins, Users,
  Calendar, Dice6, Eye, Brain, Target, Flame,
  Crown, Mountain, Feather, Sparkles, Moon, Sun,
  Plus, Minus, RotateCcw
} from 'lucide-react';
import { races } from '../../data/races';
import { classes } from '../../data/classes';
import { origins } from '../../data/origins';
import { deities } from '../../data/deities';
import { equipment, initialFreeEquipment } from '../../data/equipment';
import DiceRoller from '../DiceRoller/DiceRoller';
import { DiceRoll, CharacterState } from '../../types/interactive';
import { CharacterStorage, SavedCharacter } from '../../utils/characterStorage';

interface CharacterData {
  personalDetails?: {
    name?: string;
    appearance?: string;
    personality?: string;
    background?: string;
  };
  race?: string;
  mainClass?: string;
  subclass?: string;
  origin?: string;
  deity?: string;
  level?: number;
  finalAttributes?: Record<string, number>;
  hitPoints?: number;
  manaPoints?: number;
  vigorPoints?: number;
  keyAttribute?: string;
  selectedClassSkills?: string[];
  selectedRaceSkills?: string[];
  finalSkillValues?: Record<string, number>;
  selectedSubclassAbilities?: string[];
  selectedEquipment?: string[];
  initialGold?: number;
  remainingGold?: number;
  createdAt?: string;
}

const CharacterSheet: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessTable, setShowSuccessTable] = useState(false);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  
  // ID do personagem salvo (se aplicável)
  const characterId = location.state?.characterId;
  const [savedCharacter, setSavedCharacter] = useState<SavedCharacter | null>(null);
  
  // Estado interativo do personagem
  const [characterState, setCharacterState] = useState<CharacterState>({
    currentHP: 0,
    currentMP: 0,
    currentVigor: 0,
    tempHP: 0,
    conditions: [],
    rollHistory: []
  });
  
  const characterData: CharacterData = location.state?.characterData || savedCharacter?.data || {};
  const isNewCharacter = location.state?.isNewCharacter || false;

  // Carregar personagem salvo se tiver ID
  useEffect(() => {
    if (characterId && !savedCharacter) {
      const loaded = CharacterStorage.loadCharacter(characterId);
      if (loaded) {
        setSavedCharacter(loaded);
        setCharacterState(loaded.state);
      }
    }
  }, [characterId, savedCharacter]);

  // Auto-save do estado a cada mudança
  useEffect(() => {
    if (characterId && savedCharacter && 
        (characterState.currentHP !== savedCharacter.state.currentHP ||
         characterState.currentMP !== savedCharacter.state.currentMP ||
         characterState.currentVigor !== savedCharacter.state.currentVigor ||
         characterState.rollHistory.length !== savedCharacter.state.rollHistory.length)) {
      
      // Debounce para evitar muitas escritas
      const timer = setTimeout(() => {
        CharacterStorage.updateCharacterState(characterId, characterState);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [characterState, characterId, savedCharacter]);

  // Inicializar recursos quando o personagem carrega
  useEffect(() => {
    if (characterData.hitPoints && characterState.currentHP === 0) {
      setCharacterState(prev => ({
        ...prev,
        currentHP: characterData.hitPoints || 0,
        currentMP: characterData.manaPoints || 0,
        currentVigor: characterData.vigorPoints || 0
      }));
    }
  }, [characterData, characterState.currentHP]);

  // Funções de gerenciamento de recursos
  const adjustResource = (type: 'hp' | 'mp' | 'vigor', amount: number) => {
    setCharacterState(prev => {
      const newState = { ...prev };
      const maxValues = {
        hp: characterData.hitPoints || 0,
        mp: characterData.manaPoints || 0,
        vigor: characterData.vigorPoints || 0
      };

      switch (type) {
        case 'hp':
          newState.currentHP = Math.max(0, Math.min(maxValues.hp, prev.currentHP + amount));
          break;
        case 'mp':
          newState.currentMP = Math.max(0, Math.min(maxValues.mp, prev.currentMP + amount));
          break;
        case 'vigor':
          newState.currentVigor = Math.max(0, Math.min(maxValues.vigor, prev.currentVigor + amount));
          break;
      }
      return newState;
    });
  };

  // Função de rolagem de dados
  const rollAttribute = (attributeName: string, attributeValue: number) => {
    setShowDiceRoller(true);
    // A rolagem será feita pelo componente DiceRoller
  };

  const rollSkill = (skillName: string, skillValue: number, attributeValue: number) => {
    setShowDiceRoller(true);
    // A rolagem será feita pelo componente DiceRoller  
  };

  const addRollToHistory = (roll: DiceRoll) => {
    setCharacterState(prev => ({
      ...prev,
      rollHistory: [...prev.rollHistory, roll]
    }));
  };

  if (!characterData.personalDetails?.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-2xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Personagem não encontrado</h2>
          <p className="text-slate-600 mb-6">Não foi possível carregar os dados do personagem.</p>
          <button 
            onClick={() => navigate('/characters')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Voltar para Personagens
          </button>
        </div>
      </div>
    );
  }

  const raceData = characterData.race ? races[characterData.race] : null;
  const classData = characterData.mainClass ? classes[characterData.mainClass] : null;
  const originData = characterData.origin ? origins[characterData.origin] : null;
  const deityData = characterData.deity ? deities[characterData.deity] : null;

  const attributeNames: Record<string, string> = {
    forca: 'Força',
    destreza: 'Destreza',
    constituicao: 'Constituição',
    inteligencia: 'Inteligência',
    sabedoria: 'Sabedoria',
    carisma: 'Carisma'
  };

  const attributeEssences: Record<string, string> = {
    forca: 'Vontade Indomável',
    destreza: 'Fluxo Incessante', 
    constituicao: 'Resiliência Eterna',
    inteligencia: 'Olhar Penetrante',
    sabedoria: 'Sentir Profundo',
    carisma: 'Chama Interior'
  };

  // Sistema de dados de vantagem/desvantagem conforme o livro
  const getDiceInfo = (attributeValue: number) => {
    if (attributeValue <= -1) return { dice: '2d20', type: 'desvantagem', color: 'text-red-600', take: 'menor' };
    if (attributeValue <= 1) return { dice: '1d20', type: 'normal', color: 'text-gray-600', take: 'único' };
    if (attributeValue <= 3) return { dice: '2d20', type: 'vantagem', color: 'text-green-600', take: 'maior' };
    if (attributeValue <= 5) return { dice: '3d20', type: 'vantagem', color: 'text-green-600', take: 'maior' };
    if (attributeValue <= 7) return { dice: '4d20', type: 'vantagem', color: 'text-green-600', take: 'maior' };
    if (attributeValue <= 9) return { dice: '5d20', type: 'vantagem', color: 'text-green-600', take: 'maior' };
    if (attributeValue <= 11) return { dice: '6d20', type: 'vantagem', color: 'text-green-600', take: 'maior' };
    return { dice: '7d20', type: 'vantagem', color: 'text-green-600', take: 'maior' };
  };

  // Planilha de sucessos conforme o livro
  const getSuccessTargets = (skillValue: number) => {
    const successTable: Record<number, { normal: number | null, good: number | null, extreme: number | null }> = {
      1: { normal: 20, good: null, extreme: null },
      2: { normal: 19, good: 20, extreme: null },
      3: { normal: 18, good: 20, extreme: null },
      4: { normal: 17, good: 19, extreme: null },
      5: { normal: 16, good: 19, extreme: 20 },
      6: { normal: 15, good: 18, extreme: 20 },
      7: { normal: 14, good: 18, extreme: 20 },
      8: { normal: 13, good: 17, extreme: 20 },
      9: { normal: 12, good: 17, extreme: 20 },
      10: { normal: 11, good: 16, extreme: 19 },
      11: { normal: 10, good: 16, extreme: 19 },
      12: { normal: 9, good: 15, extreme: 19 },
      13: { normal: 8, good: 15, extreme: 19 },
      14: { normal: 7, good: 14, extreme: 18 },
      15: { normal: 6, good: 14, extreme: 18 },
      16: { normal: 5, good: 13, extreme: 18 },
      17: { normal: 4, good: 13, extreme: 18 },
      18: { normal: 3, good: 12, extreme: 17 },
      19: { normal: 2, good: 12, extreme: 17 },
      20: { normal: 2, good: 11, extreme: 16 }
    };

    return successTable[Math.min(skillValue, 20)] || successTable[20];
  };

  const getTrainedSkills = () => {
    const skills: string[] = [];
    
    // Perícias da classe
    if (characterData.selectedClassSkills) {
      skills.push(...characterData.selectedClassSkills);
    }
    
    // Perícias da raça
    if (characterData.selectedRaceSkills) {
      skills.push(...characterData.selectedRaceSkills);
    }
    
    // Perícias fixas da raça
    if (raceData) {
      if (characterData.race === 'faelan') {
        skills.push('Furtividade', 'Percepção');
      } else if (characterData.race === 'celeres') {
        skills.push('Diplomacia', 'Intuição');
      }
    }
    
    // Perícias da origem
    if (originData) {
      skills.push(...originData.trainedSkills);
    }
    
    // Perícia da divindade
    if (deityData) {
      skills.push(deityData.trainedSkill);
    }
    
    return Array.from(new Set(skills)); // Remove duplicatas
  };

  const getClassIcon = (className?: string) => {
    switch (className) {
      case 'evocador': return <Sparkles className="w-5 h-5" />;
      case 'titã': return <Mountain className="w-5 h-5" />;
      case 'sentinela': return <Eye className="w-5 h-5" />;
      case 'elo': return <Heart className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getDeityIcon = (deity?: string) => {
    switch (deity) {
      case 'ignis': return '🔥';
      case 'ondina': return '🌊';
      case 'terrus': return '🌍';
      case 'zephyrus': return '💨';
      case 'lumina': return '☀️';
      case 'noctus': return '🌙';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Header Épico */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 shadow-2xl border-b border-slate-600">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/characters')}
                className="p-3 hover:bg-slate-600 rounded-xl transition-colors group"
              >
                <ArrowLeft className="w-6 h-6 text-slate-300 group-hover:text-white" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  {getClassIcon(characterData.mainClass)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">
                    {characterData.personalDetails?.name}
                  </h1>
                  <div className="flex items-center gap-3 text-slate-300">
                    <span className="flex items-center gap-1">
                      <Crown className="w-4 h-4" />
                      {raceData?.name}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {getClassIcon(characterData.mainClass)}
                      {characterData.mainClass}
                    </span>
                    <span>•</span>
                    <span>{characterData.subclass}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Nível {characterData.level || 1}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isNewCharacter && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Novo Herói!</span>
                </div>
              )}
              
              <button
                onClick={() => setShowSuccessTable(!showSuccessTable)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg"
              >
                <Dice6 className="w-4 h-4" />
                Planilha de Sucessos
              </button>

              <button
                onClick={() => setShowDiceRoller(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg"
              >
                <Dice6 className="w-4 h-4" />
                Sistema de Rolagem
              </button>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 shadow-lg ${
                  isEditing 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700'
                }`}
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {isEditing ? 'Salvar' : 'Editar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Planilha de Sucessos (Modal) */}
      {showSuccessTable && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <Dice6 className="w-6 h-6 text-purple-600" />
                  Planilha de Sucessos - Sistema de Elaria
                </h3>
                <button 
                  onClick={() => setShowSuccessTable(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Como Usar:</h4>
                <ol className="text-blue-700 text-sm space-y-1">
                  <li>1. <strong>Role os dados</strong> conforme seu atributo (vantagem/desvantagem)</li>
                  <li>2. <strong>Encontre o valor da perícia</strong> na tabela abaixo</li>
                  <li>3. <strong>Compare o resultado</strong> do d20 com os alvos para determinar o sucesso</li>
                  <li>4. <strong>20 natural</strong> = Sucesso Extremo | <strong>1 natural</strong> = Fracasso Extremo</li>
                </ol>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <tr>
                      <th className="p-3 text-left font-semibold">Valor da Perícia</th>
                      <th className="p-3 text-center font-semibold">Sucesso Normal</th>
                      <th className="p-3 text-center font-semibold">Sucesso Bom</th>
                      <th className="p-3 text-center font-semibold">Sucesso Extremo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((value) => {
                      const targets = getSuccessTargets(value);
                      return (
                        <tr key={value} className={value % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="p-3 font-bold text-slate-800">{value}</td>
                          <td className="p-3 text-center text-green-700 font-medium">
                            {targets.normal ? `${targets.normal}+` : '—'}
                          </td>
                          <td className="p-3 text-center text-blue-700 font-medium">
                            {targets.good ? `${targets.good}+` : '—'}
                          </td>
                          <td className="p-3 text-center text-purple-700 font-medium">
                            {targets.extreme ? `${targets.extreme}+` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="font-semibold text-green-800 mb-2">✅ Sucessos</h5>
                  <div className="text-green-700 text-sm space-y-1">
                    <p><strong>Extremo:</strong> Resultado excepcional</p>
                    <p><strong>Bom:</strong> Resultado acima da média</p>
                    <p><strong>Normal:</strong> Resultado satisfatório</p>
                  </div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h5 className="font-semibold text-red-800 mb-2">❌ Fracassos</h5>
                  <div className="text-red-700 text-sm space-y-1">
                    <p><strong>Normal:</strong> Falha comum</p>
                    <p><strong>Extremo:</strong> Falha catastrófica (1 natural)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Coluna 1: Atributos e Combate (4 colunas) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Estatísticas de Combate */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Estatísticas de Combate
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Pontos de Vida */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-red-800">Pontos de Vida</div>
                        <div className="text-xs text-red-600">PV Atual / Máximo</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        {characterState.currentHP}/{characterData.hitPoints}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <button 
                          onClick={() => adjustResource('hp', -1)}
                          className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded text-xs flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => adjustResource('hp', 1)}
                          className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded text-xs flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Barra de HP */}
                  <div className="px-4 pb-3">
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(0, (characterState.currentHP / (characterData.hitPoints || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Pontos de Mana */}
                {characterData.manaPoints && characterData.manaPoints > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-blue-800">Pontos de Mana</div>
                          <div className="text-xs text-blue-600">PM Atual / Máximo</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {characterState.currentMP}/{characterData.manaPoints}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <button 
                            onClick={() => adjustResource('mp', -1)}
                            className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => adjustResource('mp', 1)}
                            className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded text-xs flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Barra de MP */}
                    <div className="px-4 pb-3">
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(0, (characterState.currentMP / characterData.manaPoints) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pontos de Vigor */}
                {characterData.vigorPoints && characterData.vigorPoints > 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Flame className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-orange-800">Pontos de Vigor</div>
                          <div className="text-xs text-orange-600">V Atual / Máximo</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">
                          {characterState.currentVigor}/{characterData.vigorPoints}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <button 
                            onClick={() => adjustResource('vigor', -1)}
                            className="w-6 h-6 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => adjustResource('vigor', 1)}
                            className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded text-xs flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Barra de Vigor */}
                    <div className="px-4 pb-3">
                      <div className="w-full bg-orange-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(0, (characterState.currentVigor / characterData.vigorPoints) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Atributos e Essências */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Atributos & Essências
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(characterData.finalAttributes || {}).map(([key, value]) => {
                    const diceInfo = getDiceInfo(value);
                    
                    return (
                      <div 
                        key={key} 
                        className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer hover:border-purple-300"
                        onClick={() => rollAttribute(attributeNames[key], value)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-bold text-slate-800 text-lg">{attributeNames[key]}</div>
                            <div className="text-xs text-slate-500 italic">{attributeEssences[key]}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-slate-800">{value}</div>
                            <div className={`text-xs font-medium ${diceInfo.color}`}>
                              {diceInfo.dice}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className={`px-2 py-1 rounded-full ${
                            diceInfo.type === 'vantagem' ? 'bg-green-100 text-green-700' :
                            diceInfo.type === 'desvantagem' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {diceInfo.type === 'vantagem' ? `🎯 Vantagem` : 
                             diceInfo.type === 'desvantagem' ? `⚠️ Desvantagem` : 
                             `⚖️ Normal`}
                          </span>
                          <span className="text-slate-600">
                            🎲 Clique para rolar
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 2: Perícias e Habilidades (4 colunas) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Perícias */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Perícias & Testes
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {Object.entries(characterData.finalSkillValues || {})
                    .filter(([_, value]) => value > 0)
                    .sort((a, b) => b[1] - a[1])
                    .map(([skill, value]) => {
                      const isTrainedSkill = getTrainedSkills().includes(skill);
                      const targets = getSuccessTargets(value);
                      
                      return (
                        <div key={skill} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800">{skill}</span>
                              {isTrainedSkill && (
                                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-medium">
                                  Treinada
                                </span>
                              )}
                            </div>
                            <div className="text-xl font-bold text-blue-600">{value}</div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex gap-3">
                              <span className="text-green-600">
                                Normal: {targets.normal ? `${targets.normal}+` : '—'}
                              </span>
                              <span className="text-blue-600">
                                Bom: {targets.good ? `${targets.good}+` : '—'}
                              </span>
                              <span className="text-purple-600">
                                Extremo: {targets.extreme ? `${targets.extreme}+` : '—'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Habilidades de Subclasse */}
            {characterData.selectedSubclassAbilities && characterData.selectedSubclassAbilities.length > 0 && (
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sword className="w-5 h-5" />
                    Habilidades de Classe
                  </h3>
                </div>
                
                <div className="p-6 space-y-3">
                  {characterData.selectedSubclassAbilities.map((ability, index) => (
                    <div key={index} className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
                      <h5 className="font-semibold text-red-800 mb-1 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        {ability}
                      </h5>
                      <p className="text-sm text-red-600">
                        Habilidade do caminho <span className="font-medium">{characterData.subclass}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Traços Raciais */}
            {raceData && (
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Traços Raciais
                  </h3>
                </div>
                
                <div className="p-6 space-y-3">
                  {raceData.traits.map((trait, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                      <p className="text-sm text-green-700">{trait}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Coluna 3: Equipamentos e Detalhes (4 colunas) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Informações do Personagem */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-500 to-gray-500 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações do Herói
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Origem</div>
                    <div className="font-medium text-gray-800">{characterData.origin}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Patrono</div>
                    <div className="font-medium text-gray-800 flex items-center gap-1">
                      <span>{getDeityIcon(characterData.deity)}</span>
                      {characterData.deity || 'Nenhum'}
                    </div>
                  </div>
                </div>

                {characterData.personalDetails?.appearance && (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <div className="text-xs text-blue-600 mb-1 font-medium">Aparência:</div>
                    <div className="text-sm text-blue-800">{characterData.personalDetails.appearance}</div>
                  </div>
                )}
                
                {characterData.personalDetails?.personality && (
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <div className="text-xs text-purple-600 mb-1 font-medium">Personalidade:</div>
                    <div className="text-sm text-purple-800">{characterData.personalDetails.personality}</div>
                  </div>
                )}
                
                {characterData.personalDetails?.background && (
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="text-xs text-green-600 mb-1 font-medium">História:</div>
                    <div className="text-sm text-green-800">{characterData.personalDetails.background}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Benefício do Patrono */}
            {deityData && (
              <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sun className="w-5 h-5" />
                    Benefício do Patrono
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{getDeityIcon(characterData.deity)}</div>
                      <div>
                        <h5 className="font-bold text-amber-800 mb-1">
                          {deityData.benefit.name}
                        </h5>
                        <p className="text-sm text-amber-700 mb-2">{deityData.benefit.description}</p>
                        <div className="text-xs text-amber-600 font-medium">
                          Patrono: {deityData.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Equipamentos */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Equipamentos & Posses
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Equipamento Básico */}
                <div>
                  <h5 className="font-medium text-slate-600 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Equipamento Básico:
                  </h5>
                  <div className="grid grid-cols-1 gap-2">
                    {initialFreeEquipment.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm text-slate-600 bg-gray-50 rounded p-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Equipamentos Comprados */}
                {characterData.selectedEquipment && characterData.selectedEquipment.length > 0 && (
                  <div>
                    <h5 className="font-medium text-slate-600 mb-3 flex items-center gap-2">
                      <Coins className="w-4 h-4" />
                      Equipamentos Comprados:
                    </h5>
                    <div className="space-y-2">
                      {characterData.selectedEquipment.map((equipId) => {
                        const item = equipment[equipId];
                        if (!item) return null;
                        
                        const getItemColor = () => {
                          switch (item.category) {
                            case 'weapon': return 'border-red-200 bg-red-50';
                            case 'armor': return 'border-blue-200 bg-blue-50';
                            default: return 'border-green-200 bg-green-50';
                          }
                        };
                        
                        return (
                          <div key={equipId} className={`flex items-center justify-between p-3 rounded-lg border ${getItemColor()}`}>
                            <span className="font-medium text-slate-700">{item.name}</span>
                            <span className="text-xs text-slate-500 font-medium">
                              {item.priceUnit === 'Ef' ? `${item.price} Ef` : `${item.price} EfP`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Resumo Financeiro */}
                {characterData.remainingGold !== undefined && (
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <Coins className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-yellow-800">Dinheiro Restante</div>
                        <div className="text-xs text-yellow-600">Elfens (Ef) disponíveis</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {characterData.remainingGold.toFixed(1)} Ef
                    </div>
                  </div>
                )}

                {/* Data de Criação */}
                {characterData.createdAt && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      Herói criado em {new Date(characterData.createdAt).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sistema de Rolagem */}
      <DiceRoller
        isOpen={showDiceRoller}
        onClose={() => setShowDiceRoller(false)}
        rollHistory={characterState.rollHistory}
        onAddRoll={addRollToHistory}
      />
    </div>
  );
};

export default CharacterSheet; 