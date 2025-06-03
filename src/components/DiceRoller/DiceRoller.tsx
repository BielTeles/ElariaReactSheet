import React, { useState, useEffect } from 'react';
import { Dice6, RotateCcw, Clock, Target, TrendingUp } from 'lucide-react';

interface DiceRoll {
  id: string;
  timestamp: Date;
  type: 'attribute' | 'skill';
  name: string;
  attributeValue: number;
  skillValue?: number;
  diceRolled: number[];
  finalResult: number;
  successLevel: 'failure-extreme' | 'failure-normal' | 'success-normal' | 'success-good' | 'success-extreme' | null;
}

interface DiceRollerProps {
  isOpen: boolean;
  onClose: () => void;
  rollHistory: DiceRoll[];
  onAddRoll: (roll: DiceRoll) => void;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ isOpen, onClose, rollHistory, onAddRoll }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentRoll, setCurrentRoll] = useState<DiceRoll | null>(null);

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

  const rollDice = async (name: string, attributeValue: number, skillValue?: number, type: 'attribute' | 'skill' = 'skill') => {
    setIsRolling(true);

    const diceCount = getDiceCount(attributeValue);
    const takeType = getTakeType(attributeValue);
    
    // Simular rolagem com animação
    const diceResults: number[] = [];
    for (let i = 0; i < diceCount; i++) {
      diceResults.push(Math.floor(Math.random() * 20) + 1);
    }

    // Determinar resultado final
    let finalResult: number;
    if (takeType === 'highest') {
      finalResult = Math.max(...diceResults);
    } else if (takeType === 'lowest') {
      finalResult = Math.min(...diceResults);
    } else {
      finalResult = diceResults[0];
    }

    const successLevel = determineSuccess(finalResult, skillValue);

    const newRoll: DiceRoll = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      name,
      attributeValue,
      skillValue,
      diceRolled: diceResults,
      finalResult,
      successLevel
    };

    // Animação de delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setCurrentRoll(newRoll);
    onAddRoll(newRoll);
    setIsRolling(false);
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Dice6 className="w-8 h-8" />
              Sistema de Rolagem - Elaria RPG
            </h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 grid lg:grid-cols-2 gap-6">
          
          {/* Resultado Atual */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Último Resultado
            </h3>

            {isRolling ? (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center border-2 border-dashed border-blue-300">
                <div className="animate-spin w-16 h-16 mx-auto mb-4">
                  <Dice6 className="w-16 h-16 text-blue-600" />
                </div>
                <p className="text-lg font-medium text-blue-800">Rolando dados...</p>
              </div>
            ) : currentRoll ? (
              <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-slate-800">{currentRoll.name}</h4>
                  <span className="text-sm text-slate-500">
                    {currentRoll.timestamp.toLocaleTimeString('pt-BR')}
                  </span>
                </div>

                {/* Dados Rolados */}
                <div className="mb-4">
                  <p className="text-sm text-slate-600 mb-2">
                    Dados Rolados ({getDiceCount(currentRoll.attributeValue)} d20):
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {currentRoll.diceRolled.map((die, index) => (
                      <div 
                        key={index}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border-2 ${
                          die === currentRoll.finalResult ? 'bg-indigo-100 border-indigo-500 text-indigo-800' : 'bg-gray-100 border-gray-300 text-gray-600'
                        }`}
                      >
                        {die}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Tipo: {getTakeType(currentRoll.attributeValue) === 'highest' ? 'Vantagem (maior)' : 
                           getTakeType(currentRoll.attributeValue) === 'lowest' ? 'Desvantagem (menor)' : 'Normal'}
                  </p>
                </div>

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
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
                <Dice6 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma rolagem ainda</p>
                <p className="text-sm text-gray-500">Clique em algum atributo ou perícia na ficha</p>
              </div>
            )}

            {/* Ações Rápidas */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800">Rolagens Rápidas:</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => rollDice('Teste Padrão', 0, undefined, 'attribute')}
                  disabled={isRolling}
                  className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <Dice6 className="w-4 h-4 mx-auto mb-1" />
                  1d20 Normal
                </button>
                
                <button
                  onClick={() => rollDice('Teste com Vantagem', 3, undefined, 'attribute')}
                  disabled={isRolling}
                  className="p-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                  2d20 Vantagem
                </button>
              </div>
            </div>
          </div>

          {/* Histórico */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Histórico de Rolagens
              </h3>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Limpar
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {rollHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Nenhuma rolagem no histórico</p>
                </div>
              ) : (
                rollHistory.slice().reverse().map((roll) => (
                  <div key={roll.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-800">{roll.name}</span>
                      <span className="text-xs text-slate-500">
                        {roll.timestamp.toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {roll.diceRolled.map((die, index) => (
                          <span 
                            key={index}
                            className={`text-xs px-2 py-1 rounded ${
                              die === roll.finalResult ? 'bg-indigo-100 text-indigo-800 font-bold' : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {die}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-800">{roll.finalResult}</span>
                        {roll.successLevel && (
                          <span className={`text-xs px-2 py-1 rounded-full ${getSuccessColor(roll.successLevel)}`}>
                            {getSuccessText(roll.successLevel).replace(/[!]/g, '')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceRoller; 