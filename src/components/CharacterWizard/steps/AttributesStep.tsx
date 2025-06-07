import React, { useState, useEffect } from 'react';
import { Plus, Minus, Info, Dices, RefreshCw } from 'lucide-react';
import { CharacterCreation, Attributes } from '../../../types/character';

interface AttributesStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const AttributesStep: React.FC<AttributesStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [attributes, setAttributes] = useState<Partial<Attributes>>({
    forca: 0,
    destreza: 0,
    constituicao: 0,
    inteligencia: 0,
    sabedoria: 0,
    carisma: 0,
    ...data.attributes
  });

  const [pointsSpent, setPointsSpent] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showDiceTable, setShowDiceTable] = useState(false);
  
  // Sistema de compra por pontos do Elaria RPG
  const basePoints = 6;
  const minValue = -1;
  const maxValue = 10; // Praticamente impossível com 6-7 pontos, mas vamos limitar para a interface
  
  // Tabela de custo total por valor (conforme o livro)
  const getTotalCost = (value: number): number => {
    const costs: { [key: number]: number } = {
      [-1]: 0,   // Custo 0, mas ganha +1 ponto nos máximos
      0: 0,
      1: 1,      // 1
      2: 3,      // 1+2
      3: 6,      // 1+2+3
      4: 10,     // 1+2+3+4
      5: 15,     // 1+2+3+4+5
      6: 21,     // 1+2+3+4+5+6
      7: 28,     // etc.
      8: 36,
      9: 45,
      10: 55
    };
    return costs[value] || 0;
  };

  // Quantos dados rolar baseado no valor do atributo
  const getDiceInfo = (value: number): { dice: number; type: 'vantagem' | 'desvantagem' | 'normal' } => {
    if (value <= -1) return { dice: 2, type: 'desvantagem' };
    if (value <= 1) return { dice: 1, type: 'normal' };
    if (value <= 3) return { dice: 2, type: 'vantagem' };
    if (value <= 5) return { dice: 3, type: 'vantagem' };
    if (value <= 7) return { dice: 4, type: 'vantagem' };
    if (value <= 9) return { dice: 5, type: 'vantagem' };
    if (value <= 11) return { dice: 6, type: 'vantagem' };
    return { dice: 7, type: 'vantagem' };
  };

  const attributeInfo = {
    forca: {
      name: 'Força (FOR)',
      description: 'Poder muscular bruto, capacidade de exercer impacto físico. Eco da Vontade Indomável primordial.',
      influences: 'Atletismo, dano corpo a corpo e arremesso'
    },
    destreza: {
      name: 'Destreza (DES)',
      description: 'Agilidade, reflexos, equilíbrio e coordenação motora. Reflete o Fluxo Incessante.',
      influences: 'Acrobacia, Furtividade, Iniciativa, Ladinagem, Pontaria, Reflexos'
    },
    constituicao: {
      name: 'Constituição (CON)',
      description: 'Saúde, vigor, resistência física. Manifestação da Resiliência Eterna.',
      influences: 'Pontos de Vida (PV), testes de Fortitude'
    },
    inteligencia: {
      name: 'Inteligência (INT)',
      description: 'Raciocínio lógico, memória, análise e conhecimento. Ligada ao Olhar Penetrante.',
      influences: 'Conhecimento, Guerra, Investigação, Misticismo, magias de algumas classes'
    },
    sabedoria: {
      name: 'Sabedoria (SAB)',
      description: 'Percepção, intuição, bom senso e sintonia com o ambiente. Conecta-se ao Sentir Profundo.',
      influences: 'Cura, Intuição, Percepção, Sobrevivência, Vontade, magias de algumas classes'
    },
    carisma: {
      name: 'Carisma (CAR)',
      description: 'Força de personalidade, persuasão, liderança. Reflexo da Chama Interior.',
      influences: 'Adestramento, Atuação, Diplomacia, Enganação, Intimidação, Jogatina, magias de algumas classes'
    }
  };

  useEffect(() => {
    const spent = Object.entries(attributes).reduce((total, [key, value]) => {
      if (value !== undefined) {
        return total + getTotalCost(value);
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

  // Verifica quantos atributos estão em -1 (máximo 1 permitido)
  const getNegativeAttributesCount = (): number => {
    return Object.values(attributes).filter(value => value === -1).length;
  };

  // Pontos máximos disponíveis (6 base + 1 se tiver atributo em -1)
  const getMaxPoints = (): number => {
    return basePoints + (getNegativeAttributesCount() > 0 ? 1 : 0);
  };

  const canIncrease = (attr: keyof Attributes): boolean => {
    const currentValue = attributes[attr] || 0;
    if (currentValue >= maxValue) return false;
    
    const newValue = currentValue + 1;
    const currentCost = getTotalCost(currentValue);
    const newCost = getTotalCost(newValue);
    const costDifference = newCost - currentCost;
    
    return (pointsSpent + costDifference) <= getMaxPoints();
  };

  const canDecrease = (attr: keyof Attributes): boolean => {
    const currentValue = attributes[attr] || 0;
    
    // Se tentar reduzir para -1, só pode se não houver outro atributo em -1
    if (currentValue === 0) {
      return getNegativeAttributesCount() === 0;
    }
    
    return currentValue > minValue;
  };

  const modifyAttribute = (attr: keyof Attributes, delta: number) => {
    const currentValue = attributes[attr] || 0;
    const newValue = Math.max(minValue, Math.min(maxValue, currentValue + delta));
    
    if (delta > 0 && !canIncrease(attr)) return;
    if (delta < 0 && !canDecrease(attr)) return;
    
    setAttributes(prev => ({
      ...prev,
      [attr]: newValue
    }));
  };

  const resetAttributes = () => {
    setAttributes({
      forca: 0,
      destreza: 0,
      constituicao: 0,
      inteligencia: 0,
      sabedoria: 0,
      carisma: 0
    });
  };

  const remainingPoints = getMaxPoints() - pointsSpent;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Distribuição de Atributos</h3>
        <p className="text-slate-600">
          Sistema Elaria RPG: {basePoints} pontos base
        </p>
      </div>

      {/* Points summary */}
                  <div className="card bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold text-slate-800">Pontos Disponíveis</h4>
            <p className="text-sm text-slate-600">
              {remainingPoints} de {getMaxPoints()} pontos restantes
            </p>
            {getNegativeAttributesCount() > 0 && (
              <p className="text-xs text-fogo-600 mt-1">
                Bônus ativo: +1 ponto por atributo em -1
              </p>
            )}
          </div>
          <div className="text-3xl font-bold text-agua-600">
            {remainingPoints}
          </div>
        </div>
        
        <div className="mt-4 flex justify-between flex-wrap gap-2">
          <button
            onClick={resetAttributes}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw size={18} />
            <span>Resetar</span>
          </button>
          
          <button
            onClick={() => setShowDiceTable(!showDiceTable)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Dices size={18} />
            <span>Tabela de Dados</span>
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

      {/* Dice table */}
      {showDiceTable && (
        <div className="card bg-luz-50">
          <h4 className="font-semibold text-slate-800 mb-4">Sistema de Dados de Vantagem/Desvantagem</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2">Valor do Atributo</th>
                  <th className="text-left py-2">Dados Rolados</th>
                  <th className="text-left py-2">Efeito</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr><td className="py-1">-1 ou menos</td><td>2d20</td><td className="text-fogo-600">Pega o MENOR valor (desvantagem)</td></tr>
                <tr><td className="py-1">0 ou 1</td><td>1d20</td><td>Normal (sem vantagem/desvantagem)</td></tr>
                <tr><td className="py-1">2 ou 3</td><td>2d20</td><td className="text-natureza-600">Pega o MAIOR valor (vantagem)</td></tr>
                <tr><td className="py-1">4 ou 5</td><td>3d20</td><td className="text-natureza-600">Pega o MAIOR valor (vantagem)</td></tr>
                <tr><td className="py-1">6 ou 7</td><td>4d20</td><td className="text-natureza-600">Pega o MAIOR valor (vantagem)</td></tr>
                <tr><td className="py-1">8 ou 9</td><td>5d20</td><td className="text-natureza-600">Pega o MAIOR valor (vantagem)</td></tr>
                <tr><td className="py-1">10 ou 11</td><td>6d20</td><td className="text-natureza-600">Pega o MAIOR valor (vantagem)</td></tr>
                <tr><td className="py-1">12 ou mais</td><td>7d20</td><td className="text-natureza-600">Pega o MAIOR valor (vantagem)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info panel */}
      {showInfo && (
        <div className="card bg-luz-50">
          <h4 className="font-semibold text-slate-800 mb-4">As Seis Grandes Essências Primordiais</h4>
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
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
          const value = attributes[attrKey] || 0;
          const cost = getTotalCost(value);
          const diceInfo = getDiceInfo(value);
          
          return (
            <div key={key} className="card hover:shadow-lg transition-all duration-200">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-slate-800">{info.name}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{info.description}</p>
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
                  <div className={`text-3xl font-bold ${value < 0 ? 'text-fogo-600' : value <= 1 ? 'text-slate-600' : 'text-natureza-600'}`}>
                    {value}
                  </div>
                  <div className="text-xs text-slate-500">
                    {diceInfo.dice}d20 
                    {diceInfo.type === 'vantagem' && <span className="text-natureza-600"> (maior)</span>}
                    {diceInfo.type === 'desvantagem' && <span className="text-fogo-600"> (menor)</span>}
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
                <span className={`text-sm ${cost === 0 && value === -1 ? 'text-natureza-600' : 'text-slate-500'}`}>
                  {value === -1 ? 'Concede +1 ponto bônus' : `Custo: ${cost} pontos`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cost table */}
      <div className="card bg-slate-50">
        <h4 className="font-semibold text-slate-800 mb-4">Tabela de Custos por Valor</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2">Valor</th>
                <th>-1</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold py-2">Custo</td>
                <td className="text-natureza-600">0*</td>
                <td>0</td><td>1</td><td>3</td><td>6</td><td>10</td><td>15</td><td>21</td><td>28</td><td>36</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          * Valor -1 tem custo 0 mas concede +1 ponto bônus (máximo 1 atributo pode ter -1)
        </p>
        <p className="text-xs text-slate-500">
          ** Valores acima de 3 são muito difíceis de alcançar com 6-7 pontos iniciais
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={onPrevious} className="btn-secondary">
          Voltar
        </button>
        <button 
          onClick={onNext} 
          className="btn-primary"
          disabled={remainingPoints < 0}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default AttributesStep; 