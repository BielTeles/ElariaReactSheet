import React, { useState } from 'react';
import { 
  Dice6, Clock, Target, TrendingUp, Plus, Minus, 
  Swords, Zap, Settings, Calculator, Bookmark, 
  Volume2, VolumeX, Play, Save
} from 'lucide-react';
import { DiceRoll, CustomRoll, RollSettings } from '../../types/interactive';

interface DiceRollerProps {
  isOpen: boolean;
  onClose: () => void;
  rollHistory: DiceRoll[];
  onAddRoll: (roll: DiceRoll) => void;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ isOpen, onClose, rollHistory, onAddRoll }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentRoll, setCurrentRoll] = useState<DiceRoll | null>(null);
  const [activeTab, setActiveTab] = useState<'skill' | 'custom' | 'damage' | 'history'>('skill');
  
  // Estados para rolagens personalizadas
  const [customDice, setCustomDice] = useState('1d20');
  const [modifier, setModifier] = useState(0);
  const [rollName, setRollName] = useState('');
  const [notes, setNotes] = useState('');
  
  // Estados para rolagens rápidas
  const [quickSkillValue, setQuickSkillValue] = useState(10);
  const [quickAttributeValue, setQuickAttributeValue] = useState(2);
  
  // Configurações
  const [settings, setSettings] = useState<RollSettings>({
    showAnimation: true,
    animationSpeed: 'normal',
    autoSave: true,
    soundEnabled: false
  });

  // Rolagens salvas
  const [savedRolls, setSavedRolls] = useState<CustomRoll[]>([
    { id: '1', name: 'Ataque Básico', dice: '1d20+5', category: 'combat', description: 'Rolagem de ataque padrão' },
    { id: '2', name: 'Dano Espada', dice: '1d8+3', category: 'damage', description: 'Dano de espada longa' },
    { id: '3', name: 'Iniciativa', dice: '1d20+2', category: 'combat', description: 'Rolagem de iniciativa' },
    { id: '4', name: 'Cura Menor', dice: '1d4+1', category: 'utility', description: 'Recuperação de HP básica' }
  ]);

  // Parser para dados personalizados (ex: "3d6+2", "1d20-1")
  const parseDiceString = (diceString: string): { count: number, sides: number, modifier: number } => {
    const cleanString = diceString.replace(/\s/g, '').toLowerCase();
    const match = cleanString.match(/^(\d+)?d(\d+)([+-]\d+)?$/);
    
    if (!match) {
      throw new Error('Formato de dados inválido. Use formatos como: 1d20, 3d6+2, 1d8-1');
    }
    
    const count = parseInt(match[1] || '1');
    const sides = parseInt(match[2]);
    const modifier = parseInt(match[3] || '0');
    
    return { count, sides, modifier };
  };

  // Rolar dados personalizados
  const rollCustomDice = (diceString: string): { results: number[], total: number, breakdown: string } => {
    const { count, sides, modifier } = parseDiceString(diceString);
    const results: number[] = [];
    
    for (let i = 0; i < count; i++) {
      results.push(Math.floor(Math.random() * sides) + 1);
    }
    
    const sum = results.reduce((acc, val) => acc + val, 0);
    const total = sum + modifier;
    
    const breakdown = `${results.join(' + ')}${modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''}${modifier}` : ''} = ${total}`;
    
    return { results, total, breakdown };
  };

  // Sistema de dados de vantagem/desvantagem conforme o livro
  const getDiceCount = (attributeValue: number): number => {
    if (attributeValue <= -1) return 2; // Desvantagem
    if (attributeValue <= 1) return 1;  // Normal
    if (attributeValue <= 3) return 2;  // Vantagem
    if (attributeValue <= 5) return 3;
    if (attributeValue <= 7) return 4;
    if (attributeValue <= 9) return 5;
    if (attributeValue <= 11) return 6;
    return 7; // 12+
  };

  const getTakeType = (attributeValue: number): 'lowest' | 'highest' | 'only' => {
    if (attributeValue <= -1) return 'lowest';
    if (attributeValue <= 1) return 'only';
    return 'highest';
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

  const determineSuccess = (result: number, skillValue?: number): 'failure-extreme' | 'failure-normal' | 'success-normal' | 'success-good' | 'success-extreme' | null => {
    if (!skillValue) return null;

    // 20 natural sempre é sucesso extremo
    if (result === 20) return 'success-extreme';
    
    // 1 natural sempre é fracasso extremo
    if (result === 1) return 'failure-extreme';

    const targets = getSuccessTargets(skillValue);

    if (targets.extreme && result >= targets.extreme) return 'success-extreme';
    if (targets.good && result >= targets.good) return 'success-good';
    if (targets.normal && result >= targets.normal) return 'success-normal';
    
    return 'failure-normal';
  };

  const rollDice = async (
    name: string, 
    attributeValue?: number, 
    skillValue?: number, 
    type: DiceRoll['type'] = 'skill',
    customDiceString?: string,
    rollModifier?: number,
    rollNotes?: string
  ) => {
    setIsRolling(true);

    let diceResults: number[] = [];
    let finalResult: number;
    let successLevel: DiceRoll['successLevel'] = null;
    let breakdown = '';

    try {
      if (type === 'custom' || type === 'damage') {
        // Rolagem personalizada
        const diceString = customDiceString || customDice;
        const customRoll = rollCustomDice(diceString);
        diceResults = customRoll.results;
        finalResult = customRoll.total + (rollModifier || 0);
        breakdown = customRoll.breakdown;
        
        if (rollModifier) {
          breakdown += ` + ${rollModifier} (mod) = ${finalResult}`;
        }
      } else if (type === 'initiative') {
        // Iniciativa é uma perícia que usa a tabela de sucessos
        if (attributeValue === undefined) {
          throw new Error('Valor de atributo é necessário para rolagens de iniciativa');
        }

        const diceCount = getDiceCount(attributeValue);
        const takeType = getTakeType(attributeValue);
        
        // Simular rolagem com animação
        for (let i = 0; i < diceCount; i++) {
          diceResults.push(Math.floor(Math.random() * 20) + 1);
        }

        // Determinar resultado do d20
        let d20Result: number;
        if (takeType === 'highest') {
          d20Result = Math.max(...diceResults);
        } else if (takeType === 'lowest') {
          d20Result = Math.min(...diceResults);
        } else {
          d20Result = diceResults[0];
        }

        // CORREÇÃO: Aplicar modificador ANTES de consultar tabela de sucessos
        const modifiedResult = d20Result + (rollModifier || 0);
        finalResult = modifiedResult;

        // Para iniciativa, usamos um valor de perícia padrão ou o valor passado
        const initiativeSkill = skillValue || 10; // Valor padrão de iniciativa
        successLevel = determineSuccess(modifiedResult, initiativeSkill);
        breakdown = `${diceResults.join(', ')} → ${takeType === 'highest' ? 'maior' : takeType === 'lowest' ? 'menor' : 'único'}: ${d20Result}${rollModifier ? ` + ${rollModifier} = ${modifiedResult}` : ''}`;
      } else {
        // Rolagem tradicional (atributo/perícia)
        if (attributeValue === undefined) {
          throw new Error('Valor de atributo é necessário para rolagens de perícia');
        }

    const diceCount = getDiceCount(attributeValue);
    const takeType = getTakeType(attributeValue);
    
    // Simular rolagem com animação
    for (let i = 0; i < diceCount; i++) {
      diceResults.push(Math.floor(Math.random() * 20) + 1);
    }

        // Determinar resultado do d20
        let d20Result: number;
    if (takeType === 'highest') {
          d20Result = Math.max(...diceResults);
    } else if (takeType === 'lowest') {
          d20Result = Math.min(...diceResults);
    } else {
          d20Result = diceResults[0];
        }

        // CORREÇÃO: Aplicar modificador ANTES de consultar tabela de sucessos
        const modifiedResult = d20Result + (rollModifier || 0);
        finalResult = modifiedResult;

        successLevel = determineSuccess(modifiedResult, skillValue);
        breakdown = `${diceResults.join(', ')} → ${takeType === 'highest' ? 'maior' : takeType === 'lowest' ? 'menor' : 'único'}: ${d20Result}${rollModifier ? ` + ${rollModifier} = ${modifiedResult}` : ''}`;
      }

      // Delay da animação baseado nas configurações
      const delays = { fast: 500, normal: 1000, slow: 1500 };
      const delay = settings.showAnimation ? delays[settings.animationSpeed] : 100;
      
      await new Promise(resolve => setTimeout(resolve, delay));

    const newRoll: DiceRoll = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      name,
      attributeValue,
      skillValue,
      diceRolled: diceResults,
      finalResult,
        successLevel,
        modifier: rollModifier,
        customDice: customDiceString || (type === 'custom' ? customDice : undefined),
        notes: rollNotes || notes,
        rollPurpose: breakdown
      };

    setCurrentRoll(newRoll);
    onAddRoll(newRoll);
      
      // Auto-salvar se habilitado
      if (settings.autoSave && type === 'custom' && rollName) {
        saveCustomRoll();
      }
      
    } catch (error) {
      console.error('Erro na rolagem:', error);
      alert(error instanceof Error ? error.message : 'Erro desconhecido na rolagem');
    } finally {
    setIsRolling(false);
    }
  };



  // Funções utilitárias
  const saveCustomRoll = () => {
    if (!rollName.trim()) {
      alert('Nome da rolagem é obrigatório');
      return;
    }

    const newCustomRoll: CustomRoll = {
      id: Date.now().toString(),
      name: rollName,
      dice: `${customDice}${modifier !== 0 ? (modifier > 0 ? '+' : '') + modifier : ''}`,
      category: 'custom',
      description: notes || undefined
    };

    setSavedRolls(prev => [...prev, newCustomRoll]);
    setRollName('');
    setNotes('');
    alert('Rolagem salva com sucesso!');
  };

  const deleteSavedRoll = (id: string) => {
    setSavedRolls(prev => prev.filter(roll => roll.id !== id));
  };

  const rollSavedDice = (savedRoll: CustomRoll) => {
    rollDice(savedRoll.name, undefined, undefined, 'custom', savedRoll.dice, 0, savedRoll.description);
  };

  // Rolagens rápidas
  const quickSkillRoll = () => {
    rollDice('Teste Rápido de Perícia', quickAttributeValue, quickSkillValue, 'skill', undefined, modifier);
  };

  const quickAttributeRoll = () => {
    rollDice('Teste Rápido de Atributo', quickAttributeValue, undefined, 'attribute', undefined, modifier);
  };

  const quickInitiativeRoll = () => {
    rollDice('Iniciativa', quickAttributeValue, quickSkillValue, 'initiative', undefined, modifier);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Dice6 className="w-8 h-8" />
              Sistema de Rolagem Avançado - Elaria RPG
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title={settings.soundEnabled ? 'Desativar sons' : 'Ativar sons'}
              >
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'skill' as const, label: 'Perícias & Atributos', icon: Target },
              { id: 'custom' as const, label: 'Rolagens Personalizadas', icon: Calculator },
              { id: 'damage' as const, label: 'Dano & Combate', icon: Swords },
              { id: 'history' as const, label: 'Histórico', icon: Clock }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid lg:grid-cols-2 gap-6 h-full">
            
            {/* Left Panel - Controls */}
            <div className="space-y-6">
              {activeTab === 'skill' && (
                <SkillRollPanel 
                  quickSkillValue={quickSkillValue}
                  setQuickSkillValue={setQuickSkillValue}
                  quickAttributeValue={quickAttributeValue}
                  setQuickAttributeValue={setQuickAttributeValue}
                  modifier={modifier}
                  setModifier={setModifier}
                  onSkillRoll={quickSkillRoll}
                  onAttributeRoll={quickAttributeRoll}
                  onInitiativeRoll={quickInitiativeRoll}
                />
              )}

              {activeTab === 'custom' && (
                <CustomRollPanel
                  customDice={customDice}
                  setCustomDice={setCustomDice}
                  modifier={modifier}
                  setModifier={setModifier}
                  rollName={rollName}
                  setRollName={setRollName}
                  notes={notes}
                  setNotes={setNotes}
                  onRoll={() => rollDice(rollName || 'Rolagem Personalizada', undefined, undefined, 'custom')}
                  onSave={saveCustomRoll}
                  savedRolls={savedRolls}
                  onRollSaved={rollSavedDice}
                  onDeleteSaved={deleteSavedRoll}
                />
              )}

              {activeTab === 'damage' && (
                <DamageRollPanel
                  onRoll={(name: string, dice: string, damageType?: string) => 
                    rollDice(name, undefined, undefined, 'damage', dice, modifier, damageType)
                  }
                  modifier={modifier}
                  setModifier={setModifier}
                />
              )}

              {activeTab === 'history' && (
                <HistoryPanel rollHistory={rollHistory} />
              )}
            </div>

            {/* Right Panel - Results */}
            <ResultsPanel 
              isRolling={isRolling}
              currentRoll={currentRoll}
              settings={settings}
              setSettings={setSettings}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Componentes de Painel
interface SkillRollPanelProps {
  quickSkillValue: number;
  setQuickSkillValue: (value: number) => void;
  quickAttributeValue: number;
  setQuickAttributeValue: (value: number) => void;
  modifier: number;
  setModifier: (value: number) => void;
  onSkillRoll: () => void;
  onAttributeRoll: () => void;
  onInitiativeRoll: () => void;
}

const SkillRollPanel: React.FC<SkillRollPanelProps> = ({
  quickSkillValue, setQuickSkillValue, quickAttributeValue, setQuickAttributeValue,
  modifier, setModifier, onSkillRoll, onAttributeRoll, onInitiativeRoll
}) => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
      <Target className="w-5 h-5 text-indigo-600" />
      Rolagens de Perícia e Atributo
    </h3>

    {/* Controles Rápidos */}
    <div className="bg-blue-50 rounded-lg p-4 space-y-4">
      <h4 className="font-semibold text-blue-800">Configuração Rápida</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Valor da Perícia</label>
          <input
            type="number"
            value={quickSkillValue}
            onChange={(e) => setQuickSkillValue(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="20"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Valor do Atributo</label>
          <input
            type="number"
            value={quickAttributeValue}
            onChange={(e) => setQuickAttributeValue(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="-1"
            max="12"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Modificador</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModifier(modifier - 1)}
            className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            value={modifier}
            onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setModifier(modifier + 1)}
            className="w-8 h-8 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-600 rounded-lg"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onSkillRoll}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Target className="w-4 h-4" />
          Teste de Perícia
        </button>
        
        <button
          onClick={onAttributeRoll}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
        >
          <Zap className="w-4 h-4" />
          Teste de Atributo
        </button>

        <button
          onClick={onInitiativeRoll}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
        >
          <TrendingUp className="w-4 h-4" />
          Iniciativa
        </button>
      </div>
    </div>

    {/* Informações do Sistema */}
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-semibold text-gray-800 mb-3">Sistema de Dados Elaria</h4>
      <div className="text-sm text-gray-600 space-y-2">
        <p><strong>Vantagem/Desvantagem:</strong> Baseado no valor do atributo</p>
        <p><strong>Atributo -1:</strong> 2d20 (pega menor) - Desvantagem</p>
        <p><strong>Atributo 0-1:</strong> 1d20 - Normal</p>
        <p><strong>Atributo 2+:</strong> Múltiplos d20 (pega maior) - Vantagem</p>
        <p><strong>Modificadores:</strong> Aplicados antes de consultar tabela</p>
        <p><strong>Iniciativa:</strong> Perícia baseada em Destreza</p>
      </div>
    </div>
  </div>
);

interface CustomRollPanelProps {
  customDice: string;
  setCustomDice: (value: string) => void;
  modifier: number;
  setModifier: (value: number) => void;
  rollName: string;
  setRollName: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  onRoll: () => void;
  onSave: () => void;
  savedRolls: CustomRoll[];
  onRollSaved: (roll: CustomRoll) => void;
  onDeleteSaved: (id: string) => void;
}

const CustomRollPanel: React.FC<CustomRollPanelProps> = ({
  customDice, setCustomDice, modifier, setModifier, rollName, setRollName,
  notes, setNotes, onRoll, onSave, savedRolls, onRollSaved, onDeleteSaved
}) => (
  <div className="space-y-6">
    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
      <Calculator className="w-5 h-5 text-indigo-600" />
      Rolagens Personalizadas
    </h3>

    {/* Criador de Rolagem */}
    <div className="bg-green-50 rounded-lg p-4 space-y-4">
      <h4 className="font-semibold text-green-800">Criar Nova Rolagem</h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dados (ex: 3d6, 1d20)</label>
          <input
            type="text"
            value={customDice}
            onChange={(e) => setCustomDice(e.target.value)}
            placeholder="1d20"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Modificador</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModifier(modifier - 1)}
              className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={modifier}
              onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={() => setModifier(modifier + 1)}
              className="w-8 h-8 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-600 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Rolagem</label>
        <input
          type="text"
          value={rollName}
          onChange={(e) => setRollName(e.target.value)}
          placeholder="Ex: Ataque com Espada"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notas (opcional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Descrição da rolagem..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onRoll}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          <Play className="w-4 h-4" />
          Rolar
        </button>
        
        <button
          onClick={onSave}
          disabled={!rollName.trim()}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          Salvar
        </button>
      </div>
    </div>

    {/* Rolagens Salvas */}
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <Bookmark className="w-4 h-4" />
        Rolagens Salvas
      </h4>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {savedRolls.map(roll => (
          <div key={roll.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
            <div className="flex-1">
              <div className="font-medium text-gray-800">{roll.name}</div>
              <div className="text-sm text-gray-600">{roll.dice}</div>
              {roll.description && (
                <div className="text-xs text-gray-500 mt-1">{roll.description}</div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRollSaved(roll)}
                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded text-sm font-medium transition-colors"
              >
                Rolar
              </button>
              <button
                onClick={() => onDeleteSaved(roll.id)}
                className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded text-sm font-medium transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        ))}
        
        {savedRolls.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <Bookmark className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Nenhuma rolagem salva</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

interface DamageRollPanelProps {
  onRoll: (name: string, dice: string, damageType?: string) => void;
  modifier: number;
  setModifier: (value: number) => void;
}

const DamageRollPanel: React.FC<DamageRollPanelProps> = ({ onRoll, modifier, setModifier }) => {
  const [selectedDamageType, setSelectedDamageType] = useState('');

  const commonDamageRolls = [
    { name: 'Adaga', dice: '1d4', type: 'Perfuração/Corte' },
    { name: 'Espada Curta', dice: '1d6', type: 'Corte' },
    { name: 'Espada Longa', dice: '1d8', type: 'Corte' },
    { name: 'Machado Grande', dice: '1d8', type: 'Corte' },
    { name: 'Arco Longo', dice: '1d6', type: 'Perfuração' },
    { name: 'Maça Leve', dice: '1d6', type: 'Impacto' },
    { name: 'Lança Curta', dice: '1d6', type: 'Perfuração' },
    { name: 'Besta Leve', dice: '1d4', type: 'Perfuração' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <Swords className="w-5 h-5 text-indigo-600" />
        Rolagens de Dano e Combate
      </h3>

      {/* Modificador Global */}
      <div className="bg-red-50 rounded-lg p-4">
        <h4 className="font-semibold text-red-800 mb-3">Modificador de Dano</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModifier(modifier - 1)}
            className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            value={modifier}
            onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={() => setModifier(modifier + 1)}
            className="w-8 h-8 flex items-center justify-center bg-green-100 hover:bg-green-200 text-green-600 rounded-lg"
          >
            <Plus className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 ml-2">
            (FOR ou DES do personagem)
          </span>
        </div>
      </div>

      {/* Tipo de Dano */}
      <div className="bg-orange-50 rounded-lg p-4">
        <h4 className="font-semibold text-orange-800 mb-3">Tipo de Dano</h4>
        <select
          value={selectedDamageType}
          onChange={(e) => setSelectedDamageType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Selecione o tipo...</option>
          <option value="Corte">Corte</option>
          <option value="Perfuração">Perfuração</option>
          <option value="Impacto">Impacto</option>
          <option value="Fogo">Fogo</option>
          <option value="Gelo">Gelo</option>
          <option value="Elétrico">Elétrico</option>
          <option value="Ácido">Ácido</option>
          <option value="Psíquico">Psíquico</option>
        </select>
      </div>

      {/* Armas Comuns */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Armas Comuns</h4>
        <div className="grid grid-cols-2 gap-2">
          {commonDamageRolls.map(weapon => (
            <button
              key={weapon.name}
              onClick={() => onRoll(`Dano: ${weapon.name}`, weapon.dice, weapon.type)}
              className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <div className="font-medium text-gray-800 text-sm">{weapon.name}</div>
              <div className="text-xs text-gray-600">{weapon.dice} ({weapon.type})</div>
            </button>
          ))}
        </div>
      </div>

      {/* Rolagens Especiais */}
      <div className="bg-purple-50 rounded-lg p-4">
        <h4 className="font-semibold text-purple-800 mb-3">Curas e Efeitos</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onRoll('Cura Básica', '1d4', 'Cura')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Cura Básica
          </button>
          
          <button
            onClick={() => onRoll('Efeito Mágico', '1d6', 'Mágico')}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            <Zap className="w-4 h-4" />
            Efeito Mágico
          </button>
        </div>
      </div>
    </div>
  );
};

interface HistoryPanelProps {
  rollHistory: DiceRoll[];
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ rollHistory }) => {
  const getSuccessColor = (level: string) => {
    switch (level) {
      case 'success-extreme': return 'text-purple-600 bg-purple-100';
      case 'success-good': return 'text-blue-600 bg-blue-100';
      case 'success-normal': return 'text-green-600 bg-green-100';
      case 'failure-normal': return 'text-orange-600 bg-orange-100';
      case 'failure-extreme': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSuccessText = (level: string) => {
    switch (level) {
      case 'success-extreme': return 'Sucesso Extremo!';
      case 'success-good': return 'Sucesso Bom';
      case 'success-normal': return 'Sucesso Normal';
      case 'failure-normal': return 'Fracasso Normal';
      case 'failure-extreme': return 'Fracasso Extremo!';
      default: return 'Teste de Atributo';
    }
  };

  // Função para garantir que timestamp seja um objeto Date antes de usar toLocaleTimeString
  const formatTimestamp = (timestamp: Date | string): string => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          Histórico de Rolagens
        </h3>
        <span className="text-sm text-gray-500">
          {rollHistory.length} rolagem{rollHistory.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {rollHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Nenhuma rolagem no histórico</p>
            <p className="text-sm mt-1">Suas rolagens aparecerão aqui</p>
          </div>
        ) : (
          rollHistory.slice().reverse().map((roll) => (
            <div key={roll.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-800">{roll.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    roll.type === 'damage' ? 'bg-red-100 text-red-600' :
                    roll.type === 'custom' ? 'bg-purple-100 text-purple-600' :
                    roll.type === 'skill' ? 'bg-blue-100 text-blue-600' :
                    roll.type === 'initiative' ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {roll.type === 'damage' ? 'Dano' :
                     roll.type === 'custom' ? 'Personalizada' :
                     roll.type === 'skill' ? 'Perícia' : 
                     roll.type === 'initiative' ? 'Iniciativa' :
                     'Atributo'}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  {formatTimestamp(roll.timestamp)}
                </span>
              </div>
              
              {/* Dados Rolados */}
              {roll.diceRolled.length > 0 && (
                <div className="mb-3">
                  <div className="flex gap-1 flex-wrap">
                    {roll.diceRolled.map((die, index) => (
                      <span 
                        key={index}
                        className={`text-xs px-2 py-1 rounded border ${
                          die === Math.max(...roll.diceRolled) && roll.diceRolled.length > 1 ? 
                          'bg-indigo-100 border-indigo-300 text-indigo-800 font-bold' : 
                          'bg-gray-100 border-gray-300 text-gray-600'
                        }`}
                      >
                        {die}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Breakdown */}
              {roll.rollPurpose && (
                <div className="mb-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {roll.rollPurpose}
                </div>
              )}

              {/* Resultado e Sucesso */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-slate-800">{roll.finalResult}</span>
                  {roll.successLevel && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSuccessColor(roll.successLevel)}`}>
                      {getSuccessText(roll.successLevel).replace(/[!]/g, '')}
                    </span>
                  )}
                </div>
                
                {roll.notes && (
                  <span className="text-xs text-gray-500 italic">
                    {roll.notes}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

interface ResultsPanelProps {
  isRolling: boolean;
  currentRoll: DiceRoll | null;
  settings: RollSettings;
  setSettings: React.Dispatch<React.SetStateAction<RollSettings>>;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ isRolling, currentRoll, settings, setSettings }) => {
  const getSuccessColor = (level: string) => {
    switch (level) {
      case 'success-extreme': return 'text-purple-600 bg-purple-100';
      case 'success-good': return 'text-blue-600 bg-blue-100';
      case 'success-normal': return 'text-green-600 bg-green-100';
      case 'failure-normal': return 'text-orange-600 bg-orange-100';
      case 'failure-extreme': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSuccessText = (level: string) => {
    switch (level) {
      case 'success-extreme': return 'Sucesso Extremo!';
      case 'success-good': return 'Sucesso Bom';
      case 'success-normal': return 'Sucesso Normal';
      case 'failure-normal': return 'Fracasso Normal';
      case 'failure-extreme': return 'Fracasso Extremo!';
      default: return 'Resultado';
    }
  };

  // Função para garantir que timestamp seja um objeto Date
  const formatTimestamp = (timestamp: Date | string): string => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return date.toLocaleTimeString('pt-BR');
  };

  return (
          <div className="space-y-6">
      <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
          Resultado da Rolagem
            </h3>

        <button
          onClick={() => setSettings(prev => ({ ...prev, showAnimation: !prev.showAnimation }))}
          className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          title="Configurações"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Configurações Rápidas */}
      {settings.showAnimation && (
        <div className="bg-indigo-50 rounded-lg p-3">
          <h4 className="font-semibold text-indigo-800 mb-2 text-sm">Configurações</h4>
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.showAnimation}
                onChange={(e) => setSettings(prev => ({ ...prev, showAnimation: e.target.checked }))}
                className="rounded"
              />
              Animação
            </label>
            
            <select
              value={settings.animationSpeed}
              onChange={(e) => setSettings(prev => ({ ...prev, animationSpeed: e.target.value as 'fast' | 'normal' | 'slow' }))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="fast">Rápida</option>
              <option value="normal">Normal</option>
              <option value="slow">Lenta</option>
            </select>
          </div>
        </div>
      )}

      {/* Resultado Principal */}
            {isRolling ? (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center border-2 border-dashed border-blue-300">
                <div className="animate-spin w-16 h-16 mx-auto mb-4">
                  <Dice6 className="w-16 h-16 text-blue-600" />
                </div>
                <p className="text-lg font-medium text-blue-800">Rolando dados...</p>
          <p className="text-sm text-blue-600 mt-2">
            {settings.animationSpeed === 'fast' ? '⚡ Rápido' : 
             settings.animationSpeed === 'slow' ? '🐌 Devagar' : '⏱️ Normal'}
          </p>
              </div>
            ) : currentRoll ? (
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-slate-800">{currentRoll.name}</h4>
                  <span className="text-sm text-slate-500">
              {formatTimestamp(currentRoll.timestamp)}
                  </span>
                </div>

                {/* Dados Rolados */}
          {currentRoll.diceRolled.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-2">
                Dados Rolados:
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {currentRoll.diceRolled.map((die, index) => (
                      <div 
                        key={index}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border-2 ${
                      (currentRoll.type === 'skill' || currentRoll.type === 'attribute' || currentRoll.type === 'initiative') &&
                      ((currentRoll.attributeValue! <= -1 && die === Math.min(...currentRoll.diceRolled)) ||
                       (currentRoll.attributeValue! > 1 && die === Math.max(...currentRoll.diceRolled)) ||
                       (currentRoll.attributeValue! <= 1 && currentRoll.attributeValue! > -1 && currentRoll.diceRolled.length === 1))
                      ? 'bg-indigo-100 border-indigo-500 text-indigo-800' 
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                        }`}
                      >
                        {die}
                      </div>
                    ))}
                  </div>
            </div>
          )}

          {/* Breakdown */}
          {currentRoll.rollPurpose && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Cálculo:</p>
              <p className="text-sm text-blue-700">{currentRoll.rollPurpose}</p>
                </div>
          )}

                {/* Resultado Final */}
                <div className="bg-white rounded-lg p-4 border-2 border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-slate-700">Resultado Final:</span>
                    <span className="text-3xl font-bold text-slate-800">{currentRoll.finalResult}</span>
                  </div>
                  
                  {currentRoll.successLevel && (
                    <div className={`mt-3 px-4 py-2 rounded-lg font-medium text-center ${getSuccessColor(currentRoll.successLevel)}`}>
                      {getSuccessText(currentRoll.successLevel)}
                    </div>
                  )}

            {currentRoll.notes && (
              <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                <strong>Notas:</strong> {currentRoll.notes}
              </div>
            )}
          </div>
                </div>
              ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
          <Dice6 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Nenhuma rolagem ainda</p>
          <p className="text-sm text-gray-500">Clique em uma das opções à esquerda para começar</p>
        </div>
      )}
    </div>
  );
};

export default DiceRoller; 