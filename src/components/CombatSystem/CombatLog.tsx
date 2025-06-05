import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { CombatAction, CombatParticipant } from '../../types/combat';

interface CombatLogProps {
  actions: CombatAction[];
  participants: CombatParticipant[];
}

const CombatLog: React.FC<CombatLogProps> = ({ actions, participants }) => {
  const getParticipantName = (id: string) => {
    const participant = participants.find(p => p.id === id);
    return participant?.name || 'Desconhecido';
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'attack': return '⚔️';
      case 'defense': return '🛡️';
      case 'move': return '🏃';
      case 'ability': return '✨';
      case 'item': return '🎒';
      default: return '📝';
    }
  };

  const sortedActions = [...actions].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">📖</span>
          Log de Combate
        </CardTitle>
      </CardHeader>
      <CardContent>
        {actions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma ação registrada ainda
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedActions.map(action => (
              <div 
                key={action.id}
                className="border rounded-lg p-3 bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span>{getActionIcon(action.actionType)}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          R{action.round} T{action.turn + 1}
                        </Badge>
                        <span className="font-semibold">
                          {getParticipantName(action.participantId)}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{action.description}</p>
                      
                      {/* Detalhes da resolução */}
                      {action.resolution && (
                        <div className="mt-2 p-2 bg-white rounded border text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <strong>Ataque:</strong> {action.resolution.attack.successGrade}
                              <br />
                              <strong>Dados:</strong> {action.resolution.attack.diceRolled.join(', ')}
                              <br />
                              <strong>Melhor:</strong> {action.resolution.attack.bestDice}
                            </div>
                            <div>
                              <strong>Resultado:</strong> {action.resolution.hit ? 'Acertou' : 'Errou'}
                              {action.resolution.damage && (
                                <>
                                  <br />
                                  <strong>Dano:</strong> {action.resolution.damage.total} ({action.resolution.damage.rolled.join('+')})
                                  <br />
                                  <strong>RD:</strong> -{action.resolution.damageReduction}
                                  <br />
                                  <strong>Final:</strong> {action.resolution.finalDamage}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right text-xs text-muted-foreground">
                    {formatTime(action.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CombatLog; 