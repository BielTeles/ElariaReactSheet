import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { CombatParticipant, Condition } from '../../types/combat';
import { CONDITIONS_DATA } from '../../data/combatData';

interface ConditionManagerProps {
  participants: CombatParticipant[];
  onAddCondition: (participantId: string, condition: Condition) => void;
  onRemoveCondition: (participantId: string, condition: Condition) => void;
}

const ConditionManager: React.FC<ConditionManagerProps> = ({
  participants,
  onAddCondition,
  onRemoveCondition
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<Condition | ''>('');

  const handleAddCondition = () => {
    if (selectedParticipant && selectedCondition) {
      onAddCondition(selectedParticipant, selectedCondition as Condition);
      setSelectedCondition('');
    }
  };

  const getConditionIcon = (condition: Condition) => {
    const icons: Record<Condition, string> = {
      'amedrontado': '😰',
      'atordoado': '😵',
      'caido': '⬇️',
      'cego': '👁️‍🗨️',
      'contido': '🪢',
      'envenenado': '☠️',
      'inconsciente': '😴',
      'invisivel': '👻'
    };
    return icons[condition] || '❓';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">🎭</span>
          Gerenciador de Condições
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Adicionar Condição */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione personagem" />
            </SelectTrigger>
            <SelectContent>
              {participants.map(participant => (
                <SelectItem key={participant.id} value={participant.id}>
                  {participant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCondition} onValueChange={(value) => setSelectedCondition(value as Condition | '')}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione condição" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CONDITIONS_DATA).map(condition => (
                <SelectItem key={condition.id} value={condition.id}>
                  {getConditionIcon(condition.id)} {condition.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            onClick={handleAddCondition}
            disabled={!selectedParticipant || !selectedCondition}
          >
            Adicionar
          </Button>
        </div>

        {/* Lista de Participantes com Condições */}
        <div className="space-y-3">
          {participants.map(participant => (
            <div key={participant.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{participant.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {participant.conditions.length === 0 ? (
                      <Badge variant="outline" className="text-green-600">
                        Nenhuma condição
                      </Badge>
                    ) : (
                      participant.conditions.map(condition => {
                        const conditionData = CONDITIONS_DATA[condition];
                        return (
                          <Badge 
                            key={condition}
                            variant="secondary"
                            className="cursor-pointer hover:bg-red-100"
                            onClick={() => onRemoveCondition(participant.id, condition)}
                            title={`Clique para remover: ${conditionData?.description}`}
                          >
                            {getConditionIcon(condition)} {conditionData?.name}
                            <span className="ml-1 text-xs">✕</span>
                          </Badge>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Efeitos das Condições */}
              {participant.conditions.length > 0 && (
                <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                  <strong>Efeitos ativos:</strong>
                  <ul className="mt-1 space-y-1">
                    {participant.conditions.map(condition => {
                      const conditionData = CONDITIONS_DATA[condition];
                      return (
                        <li key={condition} className="text-muted-foreground">
                          • {conditionData?.description}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {participants.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum participante no combate
          </div>
        )}

        {/* Referência de Condições */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Referência Rápida - Condições de Elaria</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {Object.values(CONDITIONS_DATA).map(condition => (
              <div key={condition.id} className="flex items-start gap-2">
                <span>{getConditionIcon(condition.id)}</span>
                <div>
                  <strong>{condition.name}:</strong>
                  <p className="text-muted-foreground text-xs mt-1">
                    {condition.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConditionManager; 