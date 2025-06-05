import React, { useState, useMemo } from 'react';
import { ShoppingCart, X, Coins, Package, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { ShopItem, InventoryItem, Transaction } from '../../types/interactive';
import { shopItems, shopCategories } from '../../data/shop';

interface ShopSystemProps {
  isOpen: boolean;
  onClose: () => void;
  currentMoney: number;
  transactions: Transaction[];
  inventory: InventoryItem[];
  selectedEquipment: string[]; // Equipamentos da criação de personagem
  onPurchase: (item: ShopItem, quantity: number, finalPrice: number) => void;
  onSell: (inventoryItem: InventoryItem, sellPrice: number) => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  onAdjustMoney: (amount: number, description: string, source: Transaction['source']) => void;
}

const ShopSystem: React.FC<ShopSystemProps> = ({
  isOpen,
  onClose,
  currentMoney,
  transactions,
  inventory,
  selectedEquipment,
  onPurchase,
  onSell,
  onAdjustMoney
}) => {
  // Estados simples
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'shop' | 'inventory' | 'money'>('shop');

  // Filtrar itens da loja
  const filteredItems = useMemo(() => {
    return Object.values(shopItems).filter(item => {
      // Filtro de busca
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filtro de categoria
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      
      return true;
    });
  }, [searchTerm, selectedCategory]);

  // Comprar item diretamente
  const purchaseItem = (item: ShopItem) => {
    if (item.price > currentMoney) return;
    
    onPurchase(item, 1, item.price);
  };

  // Verificar se o item já está no inventário ou equipamentos
  const getInventoryQuantity = (itemId: string) => {
    // Verificar inventário da loja
    const inventoryItem = inventory.find(inv => inv.equipmentId === itemId);
    const inventoryQty = inventoryItem ? inventoryItem.quantity : 0;
    
    // Verificar equipamentos selecionados na criação
    const selectedQty = selectedEquipment.includes(itemId) ? 1 : 0;
    
    return inventoryQty + selectedQty;
  };

  // Vender item com 50% do valor (metade do preço)
  const sellItem = (inventoryItem: InventoryItem) => {
    const sellPrice = Math.floor(inventoryItem.purchasePrice * 0.5);
    onSell(inventoryItem, sellPrice);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Loja Simples</h2>
                <p className="text-emerald-100">Comércio Básico de Elaria</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-emerald-100 text-sm">Seus Elfens</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <Coins className="w-6 h-6" />
                  {currentMoney.toLocaleString()}
                </div>
              </div>
              
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Navegação simples */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'shop', label: 'Loja', icon: ShoppingCart },
              { id: 'inventory', label: 'Inventário', icon: Package },
              { id: 'money', label: 'Dinheiro', icon: Coins }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-600 border-b-2 border-emerald-500'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtros simples (apenas na aba da loja) */}
        {activeTab === 'shop' && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">Todas as categorias</option>
                {Object.entries(shopCategories).map(([key, category]) => (
                  <option key={key} value={key}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'shop' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Itens Disponíveis</h3>
                <div className="text-sm text-gray-600">
                  {filteredItems.length} {filteredItems.length === 1 ? 'item encontrado' : 'itens encontrados'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => {
                const inventoryQty = getInventoryQuantity(item.id);
                const canAfford = item.price <= currentMoney;
                
                return (
                  <div key={item.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:border-emerald-300 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0">{shopCategories[item.category].icon}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                              {shopCategories[item.category].name}
                            </span>
                            {inventoryQty > 0 && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 flex items-center gap-1">
                                <Package className="w-3 h-3" />
                                Tenho {inventoryQty}x
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className={`font-bold flex items-center gap-1 ${canAfford ? 'text-emerald-600' : 'text-red-500'}`}>
                          <Coins className="w-4 h-4" />
                          <span className="whitespace-nowrap">{item.price} {item.priceUnit}</span>
                        </div>
                        {!canAfford && (
                          <div className="text-xs text-red-500 mt-1">
                            Faltam {(item.price - currentMoney).toFixed(1)} Ef
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 flex-1 min-h-[2.5rem]">{item.description}</p>
                    
                    {inventoryQty > 0 && (
                      <div className="bg-blue-50 rounded-lg p-2 mb-3">
                        <div className="text-xs text-blue-700 text-center">
                          💡 Você pode vender por {Math.floor(item.price * 0.5)} Ef na aba Inventário
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => purchaseItem(item)}
                      disabled={!canAfford}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors mt-auto flex items-center justify-center gap-2 ${
                        canAfford 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'bg-gray-400 cursor-not-allowed text-white'
                      }`}
                    >
                      {canAfford ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Comprar
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4" />
                          Elfens Insuficientes
                        </>
                      )}
                                       </button>
                 </div>
                );
              })}
            </div>
            </>
          )}
          
          {activeTab === 'inventory' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Seu Inventário</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {inventory.length} {inventory.length === 1 ? 'item' : 'itens'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Coins className="w-4 h-4" />
                    Valor total: {inventory.reduce((total, item) => total + (item.purchasePrice * item.quantity), 0)} Ef
                  </span>
                </div>
              </div>
              
              {inventory.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">Inventário vazio</h3>
                  <p className="text-gray-400">Compre alguns itens na loja!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inventory.map(item => {
                    const sellPrice = Math.floor(item.purchasePrice * 0.5);
                    const totalValue = item.purchasePrice * item.quantity;
                    const totalSellValue = sellPrice * item.quantity;
                    
                    return (
                      <div key={item.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:border-emerald-300">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-1">{item.name}</h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Package className="w-3 h-3" />
                                Qtd: {item.quantity}
                              </span>
                              {item.isEquipped && (
                                <span className="flex items-center gap-1 text-blue-600">
                                  ⚡ Equipado
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs text-gray-500">Valor unitário</div>
                            <div className="font-medium text-emerald-600">{item.purchasePrice} Ef</div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-100 rounded-lg p-3 mb-3 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Valor total:</span>
                            <span className="font-medium text-gray-800">{totalValue} Ef</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Venda (50%):</span>
                            <span className="font-medium text-orange-600">{totalSellValue} Ef</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Comprado em:</span>
                            <span>{new Date(item.purchaseDate).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {item.quantity > 1 && (
                            <button
                              onClick={() => {
                                // Vender apenas 1 unidade
                                const singleItemCopy = { ...item, quantity: 1 };
                                sellItem(singleItemCopy);
                              }}
                              className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                            >
                              Vender 1x
                            </button>
                          )}
                          
                          <button
                            onClick={() => sellItem(item)}
                            className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                          >
                            {item.quantity > 1 ? `Vender Todos (${item.quantity}x)` : 'Vender'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'money' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Gerenciar Dinheiro</h3>
                <div className="text-sm text-gray-600">
                  Ajustar seus Elfens
                </div>
              </div>
              
              {/* Painel principal de dinheiro */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-amber-800 text-xl">Seus Elfens</div>
                      <div className="text-sm text-amber-600">Moeda de Elaria</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-amber-600">
                      {currentMoney.toFixed(1)} Ef
                    </div>
                    <div className="text-sm text-amber-600">
                      1 Ef = 10 EfP (Elfens Prata)
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botões de ajuste rápido */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <button
                  onClick={() => onAdjustMoney(-10, 'Ajuste rápido: -10 Ef', 'manual')}
                  className="bg-red-100 hover:bg-red-200 text-red-700 p-4 rounded-lg font-medium transition-colors flex flex-col items-center gap-2"
                >
                  <span className="text-2xl">-10</span>
                  <span className="text-sm">Elfens</span>
                </button>
                
                <button
                  onClick={() => onAdjustMoney(-1, 'Ajuste rápido: -1 Ef', 'manual')}
                  className="bg-red-100 hover:bg-red-200 text-red-700 p-4 rounded-lg font-medium transition-colors flex flex-col items-center gap-2"
                >
                  <span className="text-2xl">-1</span>
                  <span className="text-sm">Elfen</span>
                </button>
                
                <button
                  onClick={() => onAdjustMoney(1, 'Ajuste rápido: +1 Ef', 'manual')}
                  className="bg-green-100 hover:bg-green-200 text-green-700 p-4 rounded-lg font-medium transition-colors flex flex-col items-center gap-2"
                >
                  <span className="text-2xl">+1</span>
                  <span className="text-sm">Elfen</span>
                </button>
                
                <button
                  onClick={() => onAdjustMoney(10, 'Ajuste rápido: +10 Ef', 'manual')}
                  className="bg-green-100 hover:bg-green-200 text-green-700 p-4 rounded-lg font-medium transition-colors flex flex-col items-center gap-2"
                >
                  <span className="text-2xl">+10</span>
                  <span className="text-sm">Elfens</span>
                </button>
              </div>
              
              {/* Ajuste personalizado */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Ajuste Personalizado</h4>
                <button
                  onClick={() => {
                    const amount = prompt('Digite o valor a adicionar/remover (use - para remover):');
                    if (amount !== null && !isNaN(Number(amount))) {
                      const value = Number(amount);
                      onAdjustMoney(value, `Ajuste manual: ${value >= 0 ? '+' : ''}${value} Ef`, 'manual');
                    }
                  }}
                  className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>✏️ Valor Personalizado</span>
                </button>
              </div>
              
              {/* Histórico de transações recentes */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium text-gray-800 mb-3">Histórico Recente</h4>
                {(!transactions || transactions.length === 0) ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">📊</div>
                    <p className="text-gray-500">Nenhuma transação ainda</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {transactions.slice(-10).reverse().map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">
                            {transaction.description}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(transaction.timestamp).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{transaction.amount} Ef
                          </div>
                          <div className="text-xs text-gray-500">
                            Saldo: {transaction.balanceAfter} Ef
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopSystem; 