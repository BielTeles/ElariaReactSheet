import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CharacterCreation } from '../../../types/character';
import { CharacterState, InventoryItem } from '../../../types/interactive';
import { CharacterStorage } from '../../../utils/characterStorage';
import { races } from '../../../data/races';
import { deities } from '../../../data/deities';
import { origins } from '../../../data/origins';
import { classes, subclassData } from '../../../data/classes';
import { equipment, initialFreeEquipment } from '../../../data/equipment';
import { Check, Plus, Coins, Package, Sword, Shield, Heart, Zap, Star, Save } from 'lucide-react';

interface SummaryStepProps {
  data: CharacterCreation;
  onUpdate: (data: CharacterCreation) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const navigate = useNavigate();
  const [selectedKainBonus, setSelectedKainBonus] = useState<string>(data.selectedAttributeBonus || '');
  const [isFinishing, setIsFinishing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Função para calcular atributos finais com bônus raciais
  const calculateFinalAttributes = () => {
    const baseAttributes = data.attributes || {};
    const finalAttributes = { ...baseAttributes };
    
    if (data.race && races[data.race]) {
      const raceData = races[data.race];
      
      if (raceData.attributeBonus === 'escolha' && selectedKainBonus) {
        // Para Kain, aplicar bônus no atributo escolhido
        const attributeKey = selectedKainBonus as keyof typeof finalAttributes;
        if (finalAttributes[attributeKey] !== undefined) {
          finalAttributes[attributeKey] = (finalAttributes[attributeKey] || 0) + raceData.bonusValue;
        }
      } else if (raceData.attributeBonus !== 'escolha') {
        // Aplicar bônus racial específico
        const attributeKey = raceData.attributeBonus as keyof typeof finalAttributes;
        if (finalAttributes[attributeKey] !== undefined) {
          finalAttributes[attributeKey] = (finalAttributes[attributeKey] || 0) + raceData.bonusValue;
        }
      }
    }
    
    return finalAttributes;
  };

  // Função para calcular PV, PM e Vigor conforme o livro
  const calculateFinalStats = () => {
    // Verificações de segurança
    if (!data.mainClass || !data.finalAttributes) {
      console.warn('calculateFinalStats: dados insuficientes', { mainClass: data.mainClass, finalAttributes: data.finalAttributes });
      return null;
    }
    
    const classData = classes[data.mainClass];
    if (!classData) {
      console.warn('calculateFinalStats: classe não encontrada', data.mainClass);
      return null;
    }
    
    const constitution = data.finalAttributes.constituicao || 0;
    
    let hitPoints = 0;
    let manaPoints = 0;
    let vigorPoints = 0;
    let keyAttribute = '';
    
    // Calcular conforme a classe
    switch (data.mainClass) {
      case 'evocador':
        hitPoints = 8 + constitution;
        // PM varia conforme o caminho elemental
        const pathToAttribute: Record<string, string> = {
          'terra': 'sabedoria',
          'agua': 'sabedoria', 
          'fogo': 'inteligencia',
          'ar': 'inteligencia',
          'luz': 'sabedoria',
          'sombra': 'inteligencia'
        };
        keyAttribute = pathToAttribute[data.subclass || ''] || 'inteligencia';
        const evocadorKeyAttr = data.finalAttributes[keyAttribute as keyof typeof data.finalAttributes] || 0;
        manaPoints = 6 + evocadorKeyAttr;
        break;
        
      case 'titã':
        hitPoints = 12 + constitution;
        vigorPoints = 1 + constitution;
        keyAttribute = 'constituicao';
        break;
        
      case 'sentinela':
        hitPoints = 8 + constitution;
        const sabedoria = data.finalAttributes.sabedoria || 0;
        manaPoints = 4 + sabedoria;
        keyAttribute = 'sabedoria';
        break;
        
      case 'elo':
        hitPoints = 8 + constitution;
        const carisma = data.finalAttributes.carisma || 0;
        manaPoints = 6 + carisma;
        keyAttribute = 'carisma';
        break;
        
      default:
        console.warn('calculateFinalStats: classe não reconhecida', data.mainClass);
        return null;
    }
    
    // Garantir valores mínimos
    hitPoints = Math.max(1, hitPoints);
    manaPoints = Math.max(0, manaPoints);
    vigorPoints = Math.max(0, vigorPoints);
    
    return {
      hitPoints,
      manaPoints,
      vigorPoints,
      keyAttribute
    };
  };

  const finalStats = calculateFinalStats();

  // Função utilitária para obter nome da subclasse
  const getSubclassName = (subclassId?: string) => {
    if (!subclassId) return '';
    return subclassData[subclassId]?.name || subclassId;
  };

  // Função utilitária para obter nome da classe
  const getClassName = (classId?: string) => {
    if (!classId) return '';
    return classes[classId]?.name || classId;
  };

  // Função para finalizar o personagem
  const finalizeCharacter = async () => {
    setIsFinishing(true);
    
    try {
      // Validações básicas apenas para campos obrigatórios
      if (!data.personalDetails?.name?.trim()) {
        throw new Error('Nome do personagem é obrigatório');
      }
      
      // Validação específica para Kain (bônus racial deve ser escolhido)
      if (data.race === 'kain' && !selectedKainBonus) {
        throw new Error('Kain deve escolher um atributo para receber bônus');
      }

      // Usar os mesmos cálculos da função calculateFinalStats que já está correta
      const stats = calculateFinalStats();
      
      if (!stats) {
        throw new Error('Não foi possível calcular as estatísticas do personagem');
      }

      // Criar dados finalizados
      const finalizedData: CharacterCreation = {
        ...data,
        hitPoints: stats.hitPoints,
        manaPoints: stats.manaPoints > 0 ? stats.manaPoints : undefined,
        vigorPoints: stats.vigorPoints > 0 ? stats.vigorPoints : undefined,
        level: 1,
        createdAt: new Date().toISOString()
      };

      // Converter equipamentos selecionados para inventário
      const inventoryFromEquipments: InventoryItem[] = (finalizedData.selectedEquipment || []).map(equipId => {
        const equipmentData = equipment[equipId];
        if (!equipmentData) return null;
        
        return {
          id: `starting-${equipId}-${Date.now()}`,
          name: equipmentData.name,
          equipmentId: equipId,
          quantity: 1,
          purchaseDate: new Date(),
          purchasePrice: equipmentData.price,
          source: 'starting' as const,
          isEquipped: false
        };
      }).filter(Boolean) as InventoryItem[];

      // Estado inicial do personagem
      const initialState: CharacterState = {
        currentHP: stats.hitPoints,
        currentMP: stats.manaPoints,
        currentVigor: stats.vigorPoints,
        tempHP: 0,
        conditions: [],
        rollHistory: [],
        notes: [],
        // Sistema financeiro
        currentMoney: finalizedData.remainingGold || 0,
        transactions: [],
        inventory: inventoryFromEquipments,
        // Equipamentos equipados
        equippedWeapon: undefined,
        equippedArmor: undefined,
        equippedShield: undefined,
        equippedAccessories: []
      };

      // Salvar personagem
      const savedCharacter = CharacterStorage.saveCharacter(finalizedData, initialState, 'Personagem criado');
      
      setIsSaved(true);
      
      // Aguardar um pouco para mostrar feedback
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navegar para a ficha com os dados salvos
      navigate('/character-sheet', {
        state: {
          characterData: finalizedData,
          characterId: savedCharacter.id,
          isNewCharacter: true
        }
      });

    } catch (error) {
      console.error('Erro ao finalizar personagem:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`Erro ao salvar personagem: ${errorMessage}\n\nVerifique se todos os dados estão preenchidos corretamente.`);
    } finally {
      setIsFinishing(false);
    }
  };

  const finalAttributes = calculateFinalAttributes();
  const raceData = data.race ? races[data.race] : null;
  const isKain = data.race === 'kain';
  const isKainNeedsChoice = isKain && !selectedKainBonus;

  // Atualizar dados do personagem com atributos finais e escolha de Kain
  const prevFinalAttributesRef = React.useRef<any>(null);
  const prevSelectedKainBonusRef = React.useRef<string | null>(null);
  
  React.useEffect(() => {
    // Verificar se realmente houve mudanças para evitar loops infinitos
    const finalAttributesChanged = JSON.stringify(prevFinalAttributesRef.current) !== JSON.stringify(finalAttributes);
    const kainBonusChanged = prevSelectedKainBonusRef.current !== selectedKainBonus;
    
    if (finalAttributesChanged || kainBonusChanged) {
      // Atualizar referências
      prevFinalAttributesRef.current = finalAttributes;
      prevSelectedKainBonusRef.current = selectedKainBonus;
      
      // Só atualizar se realmente houver mudanças nos dados
      const needsUpdate = 
        JSON.stringify(data.finalAttributes) !== JSON.stringify(finalAttributes) ||
        data.selectedAttributeBonus !== selectedKainBonus;
      
      if (needsUpdate) {
        onUpdate({
          ...data,
          finalAttributes: finalAttributes,
          selectedAttributeBonus: selectedKainBonus
        });
      }
    }
  }, [finalAttributes, selectedKainBonus]); // Mantendo apenas as dependências essenciais

  const attributeNames: Record<string, string> = {
    forca: 'Força',
    destreza: 'Destreza', 
    constituicao: 'Constituição',
    inteligencia: 'Inteligência',
    sabedoria: 'Sabedoria',
    carisma: 'Carisma'
  };

  const handleKainBonusSelection = (attributeKey: string) => {
    setSelectedKainBonus(attributeKey);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-3">Resumo do Personagem</h3>
        <p className="text-slate-600">
          {isFinishing ? 'Finalizando seu herói...' : 'Revise as informações antes de finalizar'}
        </p>
      </div>

      {isFinishing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-blue-800 font-medium">Criando seu personagem...</p>
          <p className="text-blue-600 text-sm mt-2">Calculando estatísticas finais e preparando a ficha</p>
        </div>
      )}

      {!isFinishing && (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Check className="text-white" size={24} />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-slate-800">
                  {data.personalDetails?.name || 'Personagem sem nome'}
                </h4>
                <p className="text-slate-600 text-lg">
                  {raceData?.name} • {getClassName(data.mainClass)} • {getSubclassName(data.subclass)}
                </p>
              </div>
            </div>

            {/* Estatísticas Finais */}
            {finalStats && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Estatísticas de Combate (Nível 1)
                </h5>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Heart className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-red-800">Pontos de Vida</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{finalStats.hitPoints}</div>
                    <div className="text-xs text-red-500">
                      {data.mainClass === 'titã' ? '12' : '8'} + {data.finalAttributes?.constituicao || 0} (Const.)
                    </div>
                  </div>
                  
                  {finalStats.manaPoints > 0 && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Pontos de Mana</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{finalStats.manaPoints}</div>
                      <div className="text-xs text-blue-500">
                        {data.mainClass === 'elo' ? '6' : data.mainClass === 'sentinela' ? '4' : '6'} + {data.finalAttributes?.[finalStats.keyAttribute as keyof typeof data.finalAttributes] || 0} ({attributeNames[finalStats.keyAttribute] || 'Atrib.'})
                      </div>
                    </div>
                  )}
                  
                  {finalStats.vigorPoints > 0 && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Shield className="w-4 h-4 text-orange-600" />
                        <span className="font-medium text-orange-800">Pontos de Vigor</span>
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{finalStats.vigorPoints}</div>
                      <div className="text-xs text-orange-500">
                        1 + {data.finalAttributes?.constituicao || 0} (Const.)
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h5 className="text-xl font-semibold text-slate-700 mb-4">Atributos</h5>
                
                {/* Escolha de bônus para Kain */}
                {isKain && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h6 className="font-semibold text-blue-800 mb-3">
                      Escolha do Bônus Racial Kain (+1 em qualquer atributo):
                    </h6>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(attributeNames).map(([key, name]) => (
                        <button
                          key={key}
                          onClick={() => handleKainBonusSelection(key)}
                          className={`p-2 text-sm rounded-lg border-2 transition-colors ${
                            selectedKainBonus === key
                              ? 'border-blue-500 bg-blue-100 text-blue-800 font-medium'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                    {!selectedKainBonus && (
                      <p className="text-blue-700 text-xs mt-2">
                        * Você deve escolher um atributo para receber o bônus
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  {Object.entries(data.attributes || {}).map(([key, baseValue]) => {
                    const finalValue = finalAttributes[key as keyof typeof finalAttributes];
                    const hasBonus = finalValue !== baseValue;
                    
                    return (
                      <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-slate-700 font-medium">
                          {attributeNames[key]}:
                        </span>
                        <div className="flex items-center gap-3">
                          {hasBonus ? (
                            <>
                              <span className="text-sm text-gray-500">{baseValue}</span>
                              <span className="text-green-600 font-medium">→</span>
                              <span className="font-bold text-green-600">{finalValue}</span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                +{raceData?.bonusValue || 1}
                              </span>
                            </>
                          ) : isKain && !selectedKainBonus ? (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800">{baseValue}</span>
                              <Plus className="w-4 h-4 text-blue-500" />
                              <span className="text-xs text-blue-600">potencial +1</span>
                            </div>
                          ) : (
                            <span className="font-medium text-slate-800">{baseValue}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Mostrar bônus racial aplicado */}
                {raceData && raceData.attributeBonus !== 'escolha' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
                      <strong>Bônus Racial:</strong> +{raceData.bonusValue} em {attributeNames[raceData.attributeBonus]} 
                      (de {raceData.name})
                    </p>
                  </div>
                )}

                {/* Mostrar bônus escolhido para Kain */}
                {isKain && selectedKainBonus && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
                      <strong>Bônus Racial:</strong> +{raceData?.bonusValue || 1} em {attributeNames[selectedKainBonus]} 
                      (escolha Kain)
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h5 className="text-xl font-semibold text-slate-700 mb-4">Características</h5>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <strong className="text-slate-700">Raça:</strong> {raceData?.name}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <strong className="text-slate-700">Classe:</strong> {getClassName(data.mainClass)}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <strong className="text-slate-700">Subclasse:</strong> {getSubclassName(data.subclass)}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <strong className="text-slate-700">Origem:</strong> {data.origin}
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <strong className="text-slate-700">Patrono:</strong> {data.deity || 'Nenhum'}
                  </div>
                </div>
              </div>
            </div>

            {/* Perícias */}
            <div className="mt-8">
              <h5 className="text-xl font-semibold text-slate-700 mb-4">Perícias</h5>
              
              {/* Perícias Treinadas */}
              <div className="mb-4">
                <h6 className="font-medium text-slate-600 mb-2">Perícias Treinadas (Valor 1):</h6>
                <div className="flex flex-wrap gap-2">
                  {/* Perícias da Classe */}
                  {(data.selectedClassSkills || []).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      title="Perícia da Classe"
                    >
                      {skill}
                    </span>
                  ))}
                  
                  {/* Perícias da Raça */}
                  {(data.selectedRaceSkills || []).map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      title="Perícia da Raça"
                    >
                      {skill}
                    </span>
                  ))}
                  
                  {/* Perícias da Origem */}
                  {(() => {
                    const originData = data.origin ? origins[data.origin] : null;
                    return originData ? originData.trainedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                        title="Perícia da Origem"
                      >
                        {skill}
                      </span>
                    )) : [];
                  })()}
                  
                  {/* Perícia da Divindade */}
                  {(() => {
                    const deityData = data.deity ? deities[data.deity] : null;
                    return deityData ? (
                      <span
                        className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                        title="Perícia do Patrono"
                      >
                        {deityData.trainedSkill}
                      </span>
                    ) : null;
                  })()}
                </div>
              </div>

              {/* Perícias com Pontos Investidos */}
              {data.finalSkillValues && Object.entries(data.finalSkillValues).some(([_, value]) => value > 1) && (
                <div>
                  <h6 className="font-medium text-slate-600 mb-2">Perícias com Pontos Investidos:</h6>
                  <div className="grid md:grid-cols-2 gap-2">
                    {Object.entries(data.finalSkillValues)
                      .filter(([_, value]) => value > 1)
                      .map(([skill, value]) => (
                        <div key={skill} className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                          <span className="text-slate-700">{skill}</span>
                          <span className="font-bold text-blue-600">Valor {value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Traços Raciais */}
            {raceData && (
              <div className="mt-8">
                <h5 className="text-xl font-semibold text-slate-700 mb-4">Traços Raciais</h5>
                <div className="space-y-2">
                  {raceData.traits.map((trait, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-slate-600">{trait}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefício do Patrono */}
            {data.deity && deities[data.deity] && (
              <div className="mt-8">
                <h5 className="text-xl font-semibold text-slate-700 mb-4">Benefício do Patrono</h5>
                <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      {data.deity === 'ignis' ? '🔥' : 
                       data.deity === 'ondina' ? '🌊' : 
                       data.deity === 'terrus' ? '🌍' : 
                       data.deity === 'zephyrus' ? '💨' : 
                       data.deity === 'lumina' ? '☀️' : 
                       data.deity === 'noctus' ? '🌙' : '⚪'}
                    </div>
                    <div>
                      <h6 className="font-semibold text-amber-800 mb-2">
                        {deities[data.deity].benefit.name} - {deities[data.deity].name}
                      </h6>
                      <p className="text-sm text-amber-700">{deities[data.deity].benefit.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Equipamentos */}
            <div className="mt-8">
              <h5 className="text-xl font-semibold text-slate-700 mb-4">Equipamentos</h5>
              
              {/* Equipamento Gratuito */}
              <div className="mb-4">
                <h6 className="font-medium text-slate-600 mb-2">Equipamento Básico (Gratuito):</h6>
                <div className="flex flex-wrap gap-2">
                  {initialFreeEquipment.map((item) => (
                    <span
                      key={item.id}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                      title="Equipamento Gratuito"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Equipamentos Comprados */}
              {data.selectedEquipment && data.selectedEquipment.length > 0 && (
                <div className="mb-4">
                  <h6 className="font-medium text-slate-600 mb-2">Equipamentos Comprados:</h6>
                  <div className="grid md:grid-cols-2 gap-3">
                    {data.selectedEquipment.map((equipId) => {
                      const item = equipment[equipId];
                      if (!item) return null;
                      
                      const getIcon = () => {
                        switch (item.category) {
                          case 'weapon': return <Sword className="w-4 h-4" />;
                          case 'armor': return <Shield className="w-4 h-4" />;
                          default: return <Package className="w-4 h-4" />;
                        }
                      };
                      
                      const getColor = () => {
                        switch (item.category) {
                          case 'weapon': return 'bg-red-50 text-red-800 border-red-200';
                          case 'armor': return 'bg-blue-50 text-blue-800 border-blue-200';
                          default: return 'bg-green-50 text-green-800 border-green-200';
                        }
                      };
                      
                      return (
                        <div
                          key={equipId}
                          className={`flex items-center gap-2 p-3 rounded-lg border ${getColor()}`}
                        >
                          {getIcon()}
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs opacity-75">
                              {item.priceUnit === 'Ef' ? `${item.price} Ef` : `${item.price} EfP`}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Resumo de Moeda */}
              {data.initialGold && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Coins className="w-5 h-5 text-yellow-600" />
                    <h6 className="font-semibold text-yellow-800">Resumo Financeiro</h6>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-yellow-700">Inicial:</span>
                      <div className="font-bold text-yellow-800">{data.initialGold} Ef</div>
                    </div>
                    <div>
                      <span className="text-yellow-700">Gasto:</span>
                      <div className="font-bold text-yellow-800">
                        {((data.initialGold || 0) - (data.remainingGold || 0)).toFixed(1)} Ef
                      </div>
                    </div>
                    <div>
                      <span className="text-yellow-700">Restante:</span>
                      <div className="font-bold text-yellow-800">
                        {(data.remainingGold || 0).toFixed(1)} Ef
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Navegação */}
      <div className="flex justify-between items-center pt-6">
        <button 
          onClick={onPrevious}
          disabled={isFinishing}
          className={`px-6 py-3 rounded-lg transition-colors ${
            isFinishing 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Anterior
        </button>
        
        <div className="text-center">
          {isKainNeedsChoice && !isFinishing && (
            <p className="text-sm text-orange-600 mb-2">
              Kain deve escolher um atributo para receber bônus +1
            </p>
          )}
        </div>
        
        <button 
          onClick={finalizeCharacter}
          disabled={isKainNeedsChoice || isFinishing}
          className={`px-8 py-3 rounded-lg transition-colors font-medium ${
            isKainNeedsChoice || isFinishing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg'
          }`}
        >
          {isFinishing ? (
            <div className="flex items-center gap-2">
              {isSaved ? (
                <>
                  <Check className="w-5 h-5" />
                  Personagem Salvo!
                </>
              ) : (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Salvando...
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              Finalizar e Salvar Personagem
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default SummaryStep; 