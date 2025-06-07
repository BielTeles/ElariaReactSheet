import React, { useState } from 'react';
import { CharacterCreation } from '../../../types/character';
import { equipment, initialFreeEquipment, rollInitialGold, getDisplayPrice, EquipmentItem } from '../../../data/equipment';
import { Coins, Package, ShoppingCart, Sword, Shield, Dice6, RefreshCw } from 'lucide-react';

interface EquipmentStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const EquipmentStep: React.FC<EquipmentStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const [initialGold, setInitialGold] = useState<number>(data.initialGold || 0);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(data.selectedEquipment || []);
  const [currentGold, setCurrentGold] = useState<number>(data.remainingGold || data.initialGold || 0);
  const [goldRolled, setGoldRolled] = useState<boolean>(!!data.initialGold);

  // Rolar ouro inicial
  const handleRollGold = () => {
    const rolled = rollInitialGold();
    setInitialGold(rolled);
    setCurrentGold(rolled);
    setGoldRolled(true);
    
    onUpdate({
      ...data,
      initialGold: rolled,
      remainingGold: rolled
    });
  };

  // Calcular custo total dos equipamentos selecionados
  const calculateTotalCost = (): number => {
    return selectedEquipment.reduce((total, equipId) => {
      const item = equipment[equipId];
      if (!item) return total;
      
      // Converter tudo para Elfens para cálculo
      if (item.priceUnit === 'EfP') {
        return total + (item.price / 10);
      }
      return total + item.price;
    }, 0);
  };

  // Verificar se pode comprar um item
  const canAfford = (item: EquipmentItem): boolean => {
    const itemCostInEf = item.priceUnit === 'EfP' ? item.price / 10 : item.price;
    const totalCostWithItem = calculateTotalCost() + itemCostInEf;
    return totalCostWithItem <= initialGold;
  };

  // Adicionar/remover equipamento
  const toggleEquipment = (equipId: string) => {
    const item = equipment[equipId];
    if (!item) return;

    if (selectedEquipment.includes(equipId)) {
      // Remover item
      const newSelected = selectedEquipment.filter(id => id !== equipId);
      setSelectedEquipment(newSelected);
      
      const newTotalCost = newSelected.reduce((total, id) => {
        const equipItem = equipment[id];
        if (!equipItem) return total;
        return total + (equipItem.priceUnit === 'EfP' ? equipItem.price / 10 : equipItem.price);
      }, 0);
      
      const newRemainingGold = initialGold - newTotalCost;
      setCurrentGold(newRemainingGold);
      
      onUpdate({
        ...data,
        selectedEquipment: newSelected,
        remainingGold: newRemainingGold
      });
    } else if (canAfford(item)) {
      // Adicionar item
      const newSelected = [...selectedEquipment, equipId];
      setSelectedEquipment(newSelected);
      
      const itemCostInEf = item.priceUnit === 'EfP' ? item.price / 10 : item.price;
      const newTotalCost = calculateTotalCost() + itemCostInEf;
      const newRemainingGold = initialGold - newTotalCost;
      setCurrentGold(newRemainingGold);
      
      onUpdate({
        ...data,
        selectedEquipment: newSelected,
        remainingGold: newRemainingGold
      });
    }
  };

  // Obter ícone por categoria
  const getCategoryIcon = (category: string, subcategory?: string) => {
    switch (category) {
      case 'weapon':
        return <Sword className="w-5 h-5" />;
      case 'armor':
        return <Shield className="w-5 h-5" />;
      case 'item':
        return <Package className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  // Obter cor por categoria
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'weapon':
        return 'text-red-600 bg-red-100 border-red-300';
      case 'armor':
        return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'item':
        return 'text-green-600 bg-green-100 border-green-300';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  // Agrupar equipamentos por categoria
  const groupedEquipment = Object.values(equipment).reduce((groups, item) => {
    const key = `${item.category}-${item.subcategory}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, EquipmentItem[]>);

  const canProceed = goldRolled;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Cabeçalho */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-3">Equipamento Inicial</h3>
        <p className="text-slate-600">
          Role seus Elfens iniciais e compre equipamentos para sua jornada
        </p>
      </div>

      {/* Seção de Ouro Inicial */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-2xl font-bold text-slate-800 mb-4">1. Moeda Inicial</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-slate-600 mb-4">
              Role <strong>4d6 Elfens (Ef)</strong> para determinar seu dinheiro inicial. 
              A moeda de Elaria é imbuída com mana elemental!
            </p>
            
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handleRollGold}
                disabled={goldRolled}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                  goldRolled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                <Dice6 className="w-5 h-5" />
                {goldRolled ? 'Já Rolado' : 'Rolar 4d6 Elfens'}
              </button>
              
              {goldRolled && (
                <button
                  onClick={() => {
                    setGoldRolled(false);
                    setSelectedEquipment([]);
                    setCurrentGold(0);
                    onUpdate({
                      ...data,
                      initialGold: 0,
                      selectedEquipment: [],
                      remainingGold: 0
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Rolar Novamente
                </button>
              )}
            </div>

            {goldRolled && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Coins className="w-6 h-6 text-yellow-600" />
                  <span className="text-xl font-bold text-yellow-800">
                    {initialGold} Elfens Iniciais
                  </span>
                </div>
                <div className="text-sm text-yellow-700">
                  <p>Restam: <strong>{currentGold.toFixed(1)} Ef</strong></p>
                  <p className="mt-1">1 Elfen (Ef) = 10 Elfens Prata (EfP)</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-semibold text-blue-800 mb-3">💡 Sistema Monetário</h5>
            <div className="text-blue-700 text-sm space-y-2">
              <p>• <strong>Elfen (Ef):</strong> Moeda de ouro com mana elemental</p>
              <p>• <strong>Elfen Prata (EfP):</strong> Para transações menores</p>
              <p>• <strong>Conversão:</strong> 1 Ef = 10 EfP</p>
              <p>• <strong>Inicial:</strong> 4d6 Ef (mínimo 4, máximo 24)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Equipamento Gratuito */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-2xl font-bold text-slate-800 mb-4">2. Equipamento Básico Gratuito</h4>
        
        <p className="text-slate-600 mb-4">
          Todo aventureiro começa com estes itens essenciais (gratuitos):
        </p>
        
        <div className="grid md:grid-cols-3 gap-4">
          {initialFreeEquipment.map((item) => (
            <div key={item.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-green-600">
                  {getCategoryIcon(item.category)}
                </div>
                <h5 className="font-semibold text-slate-800">{item.name}</h5>
              </div>
              <p className="text-xs text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Loja de Equipamentos */}
      {goldRolled && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-2xl font-bold text-slate-800">3. Comprar Equipamentos</h4>
            <div className="text-right">
              <div className="flex items-center gap-2 text-lg font-bold text-green-600">
                <Coins className="w-5 h-5" />
                {currentGold.toFixed(1)} Ef restantes
              </div>
              <div className="text-sm text-slate-600">
                Gasto: {(initialGold - currentGold).toFixed(1)} Ef
              </div>
            </div>
          </div>

          {/* Armas Simples */}
          <div className="mb-8">
            <h5 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Sword className="w-5 h-5 text-red-600" />
              Armas Simples
            </h5>
            <div className="grid lg:grid-cols-2 gap-4">
              {groupedEquipment['weapon-simple']?.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleEquipment(item.id)}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-300 ${
                    selectedEquipment.includes(item.id)
                      ? 'border-red-400 bg-red-50 shadow-lg'
                      : canAfford(item)
                      ? 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      : 'border-gray-200 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h6 className="font-bold text-slate-800">{item.name}</h6>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {getDisplayPrice(item)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-2">
                    <span><strong>Dano:</strong> {item.damage}</span>
                    <span><strong>Tipo:</strong> {item.damageType}</span>
                    <span><strong>Atributo:</strong> {item.keyAttribute}</span>
                    <span><strong>Mãos:</strong> {item.hands}</span>
                  </div>
                  <p className="text-xs text-slate-600">{item.description}</p>
                  {selectedEquipment.includes(item.id) && (
                    <div className="mt-2 flex items-center gap-1 text-red-600">
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-xs font-medium">Adicionado</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Armas Marciais */}
          <div className="mb-8">
            <h5 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Sword className="w-5 h-5 text-red-600" />
              Armas Marciais
            </h5>
            <div className="grid lg:grid-cols-2 gap-4">
              {groupedEquipment['weapon-martial']?.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleEquipment(item.id)}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-300 ${
                    selectedEquipment.includes(item.id)
                      ? 'border-red-400 bg-red-50 shadow-lg'
                      : canAfford(item)
                      ? 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      : 'border-gray-200 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h6 className="font-bold text-slate-800">{item.name}</h6>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {getDisplayPrice(item)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-2">
                    <span><strong>Dano:</strong> {item.damage}</span>
                    <span><strong>Tipo:</strong> {item.damageType}</span>
                    <span><strong>Atributo:</strong> {item.keyAttribute}</span>
                    <span><strong>Mãos:</strong> {item.hands}</span>
                  </div>
                  <p className="text-xs text-slate-600">{item.description}</p>
                  {selectedEquipment.includes(item.id) && (
                    <div className="mt-2 flex items-center gap-1 text-red-600">
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-xs font-medium">Adicionado</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Armaduras */}
          <div className="mb-8">
            <h5 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Armaduras
            </h5>
            <div className="grid lg:grid-cols-2 gap-4">
              {[...groupedEquipment['armor-light'] || [], ...groupedEquipment['armor-medium'] || [], ...groupedEquipment['armor-heavy'] || []].map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleEquipment(item.id)}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-300 ${
                    selectedEquipment.includes(item.id)
                      ? 'border-blue-400 bg-blue-50 shadow-lg'
                      : canAfford(item)
                      ? 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      : 'border-gray-200 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h6 className="font-bold text-slate-800">{item.name}</h6>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {getDisplayPrice(item)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-2">
                    <span><strong>Tipo:</strong> {item.armorType}</span>
                    <span><strong>RD:</strong> {item.damageReduction}</span>
                    <span><strong>Penalidade:</strong> {item.attributePenalty}</span>
                  </div>
                  <p className="text-xs text-slate-600">{item.description}</p>
                  {selectedEquipment.includes(item.id) && (
                    <div className="mt-2 flex items-center gap-1 text-blue-600">
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-xs font-medium">Adicionado</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Equipamento Geral */}
          <div className="mb-8">
            <h5 className="text-xl font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              Equipamento Geral
            </h5>
            <div className="grid lg:grid-cols-3 gap-4">
              {groupedEquipment['item-general']?.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleEquipment(item.id)}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-300 ${
                    selectedEquipment.includes(item.id)
                      ? 'border-green-400 bg-green-50 shadow-lg'
                      : canAfford(item)
                      ? 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                      : 'border-gray-200 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h6 className="font-bold text-slate-800">{item.name}</h6>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      {getDisplayPrice(item)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{item.description}</p>
                  {selectedEquipment.includes(item.id) && (
                    <div className="mt-2 flex items-center gap-1 text-green-600">
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-xs font-medium">Adicionado</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navegação */}
      <div className="flex justify-between items-center pt-6">
        <button 
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Anterior
        </button>
        
        <div className="text-center">
          {!canProceed && (
            <p className="text-sm text-orange-600 mb-2">
              Role seus Elfens iniciais para continuar
            </p>
          )}
          {goldRolled && (
            <p className="text-sm text-gray-600">
              {selectedEquipment.length} item(ns) selecionado(s)
            </p>
          )}
        </div>
        
        <button 
          onClick={onNext}
          disabled={!canProceed}
          className={`px-6 py-3 rounded-lg transition-colors ${
            canProceed
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default EquipmentStep; 