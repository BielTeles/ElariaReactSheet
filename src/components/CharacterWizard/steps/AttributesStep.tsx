import React, { useState, useEffect } from 'react';
import { Plus, Minus, Info, Dices } from 'lucide-react';
import { CharacterCreation, Attributes } from '../../../types/character';

interface AttributesStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const AttributesStep: React.FC<AttributesStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [attributes, setAttributes] = useState<Partial<Attributes>>({
    forca: 8,
    destreza: 8,
    constituicao: 8,
    inteligencia: 8,
    sabedoria: 8,
    carisma: 8,
    ...data.attributes
  });

  const [pointsSpent, setPointsSpent] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  
  // Sistema de compra por pontos do Elaria
  const maxPoints = 32;
  const minValue = 8;
  const maxValue = 15;
  
  // Tabela de custo por valor
  const getCost = (value: number): number => {
    const costs: { [key: number]: number } = {
      8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
    };
    return costs[value] || 0;
  };

  const attributeInfo = {
    forca: {
      name: 'Força',
      description: 'Determina sua capacidade física, força de ataque corpo a corpo e capacidade de carga.',
      influences: 'Testes de Atletismo, dano em combate físico, carregamento'
    },
    destreza: {
      name: 'Destreza',
      description: 'Representa agilidade, reflexos e coordenação motora.',
      influences: 'Iniciativa, CA, ataques à distância, Acrobatismo, Furtividade'
    },
    constituicao: {
      name: 'Constituição',
      description: 'Indica resistência física, saúde e vigor.',
      influences: 'Pontos de Vida, testes de Fortitude, resistência à fadiga'
    },
    inteligencia: {
      name: 'Inteligência',
      description: 'Capacidade de raciocínio, memória e conhecimento acadêmico.',
      influences: 'Perícias de conhecimento, Pontos de Mana (Evocadores), Investigação'
    },
    sabedoria: {
      name: 'Sabedoria',
      description: 'Intuição, percepção e consciência do ambiente.',
      influences: 'Percepção, Intuição, Medicina, resistência mental'
    },
    carisma: {
      name: 'Carisma',
      description: 'Força de personalidade, presença e capacidade de liderança.',
      influences: 'Perícias sociais, Intimidação, Persuasão, liderança'
    }
  };

  useEffect(() => {
    const spent = Object.entries(attributes).reduce((total, [key, value]) => {
      if (value !== undefined) {
        return total + getCost(value);
      }
      return total;
    }, 0);
    setPointsSpent(spent);
  }, [attributes]);

  useEffect(() => {
    onUpdate({
      ...data,
      attributes
    });
  }, [attributes, data, onUpdate]);

  const canIncrease = (attr: keyof Attributes): boolean => {
    const currentValue = attributes[attr] || minValue;
    const currentCost = getCost(currentValue);
    const newCost = getCost(currentValue + 1);
    const costDifference = newCost - currentCost;
    
    return currentValue < maxValue && (pointsSpent + costDifference) <= maxPoints;
  };

  const canDecrease = (attr: keyof Attributes): boolean => {
    const currentValue = attributes[attr] || minValue;
    return currentValue > minValue;
  };

  const modifyAttribute = (attr: keyof Attributes, delta: number) => {
    const currentValue = attributes[attr] || minValue;
    const newValue = Math.max(minValue, Math.min(maxValue, currentValue + delta));
    
    if (delta > 0 && !canIncrease(attr)) return;
    if (delta < 0 && !canDecrease(attr)) return;
    
    setAttributes(prev => ({
      ...prev,
      [attr]: newValue
    }));
  };

  const getModifier = (value: number): string => {
    const mod = Math.floor((value - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const rollRandomAttributes = () => {
    // Sistema de rolagem 4d6, descarta menor
    const rollAttribute = (): number => {
      const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
      rolls.sort((a, b) => b - a);
      return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
    };

    const rolledAttributes = {
      forca: rollAttribute(),
      destreza: rollAttribute(),
      constituicao: rollAttribute(),
      inteligencia: rollAttribute(),
      sabedoria: rollAttribute(),
      carisma: rollAttribute()
    };

    setAttributes(rolledAttributes);
  };

  const remainingPoints = maxPoints - pointsSpent;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Distribuição de Atributos</h3>
        <p className="text-slate-600">
          Distribua {maxPoints} pontos entre seus atributos usando o sistema de compra por pontos
        </p>
      </div>

      {/* Points summary */}
      <div className="card bg-gradient-to-r from-agua-50 to-natureza-50">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-slate-800">Pontos Disponíveis</h4>
            <p className="text-sm text-slate-600">
              {remainingPoints} de {maxPoints} pontos restantes
            </p>
          </div>
          <div className="text-3xl font-bold text-agua-600">
            {remainingPoints}
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <button
            onClick={rollRandomAttributes}
            className="btn-secondary flex items-center space-x-2"
          >
            <Dices size={18} />
            <span>Rolar Aleatório</span>
          </button>
          
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Info size={18} />
            <span>Info dos Atributos</span>
          </button>
        </div>
      </div>

      {/* Info panel */}
      {showInfo && (
        <div className="card bg-luz-50">
          <h4 className="font-semibold text-slate-800 mb-4">Informações dos Atributos</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            {Object.entries(attributeInfo).map(([key, info]) => (
              <div key={key} className="bg-white p-3 rounded-lg">
                <h5 className="font-semibold text-slate-700">{info.name}</h5>
                <p className="text-slate-600 mb-2">{info.description}</p>
                <p className="text-xs text-slate-500"><strong>Influencia:</strong> {info.influences}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attributes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(attributeInfo).map(([key, info]) => {
          const attrKey = key as keyof Attributes;
          const value = attributes[attrKey] || minValue;
          const cost = getCost(value);
          
          return (
            <div key={key} className="card hover:shadow-lg transition-all duration-200">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-slate-800">{info.name}</h4>
                <p className="text-sm text-slate-600">{info.description}</p>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => modifyAttribute(attrKey, -1)}
                  disabled={!canDecrease(attrKey)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    canDecrease(attrKey)
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Minus size={16} />
                </button>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-800">{value}</div>
                  <div className="text-sm text-slate-500">
                    Mod: {getModifier(value)}
                  </div>
                </div>
                
                <button
                  onClick={() => modifyAttribute(attrKey, 1)}
                  disabled={!canIncrease(attrKey)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    canIncrease(attrKey)
                      ? 'bg-agua-500 hover:bg-agua-600 text-white'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="text-center">
                <span className="text-sm text-slate-500">
                  Custo: {cost} pontos
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cost table */}
      <div className="card bg-slate-50">
        <h4 className="font-semibold text-slate-800 mb-4">Tabela de Custos</h4>
        <div className="grid grid-cols-8 gap-2 text-center text-sm">
          <div className="font-semibold text-slate-700">Valor:</div>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="font-medium text-slate-600">{i + 8}</div>
          ))}
          <div className="font-semibold text-slate-700">Custo:</div>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="text-slate-600">{getCost(i + 8)}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttributesStep; 