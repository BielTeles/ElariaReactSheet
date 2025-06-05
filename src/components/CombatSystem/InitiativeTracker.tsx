import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { CombatParticipant, SuccessGrade } from '../../types/combat';

interface InitiativeTrackerProps {
  participants: CombatParticipant[];
  currentParticipantId: string | null;
  onNextTurn: () => void;
  showRollInitiative: boolean;
  onRollInitiative: () => void;
}

const InitiativeTracker: React.FC<InitiativeTrackerProps> = ({
  participants,
  currentParticipantId,
  onNextTurn,
  showRollInitiative,
  onRollInitiative
}) => {
  // Cores e ícones para graus de sucesso
  const getSuccessGradeDisplay = (grade: SuccessGrade) => {
    switch (grade) {
      case 'sucesso-extremo':
        return { 
          color: 'bg-purple-500', 
          text: 'Extremo', 
          icon: '⭐',
          textColor: 'text-purple-700'
        };
      case 'sucesso-bom':
        return { 
          color: 'bg-green-500', 
          text: 'Bom', 
          icon: '✓',
          textColor: 'text-green-700'
        };
      case 'sucesso-normal':
        return { 
          color: 'bg-blue-500', 
          text: 'Normal', 
          icon: '○',
          textColor: 'text-blue-700'
        };
      case 'fracasso-normal':
        return { 
          color: 'bg-yellow-500', 
          text: 'Fracasso', 
          icon: '△',
          textColor: 'text-yellow-700'
        };
      case 'fracasso-extremo':
        return { 
          color: 'bg-red-500', 
          text: 'Crítico', 
          icon: '✗',
          textColor: 'text-red-700'
        };
      default:
        return { 
          color: 'bg-gray-500', 
          text: 'Pendente', 
          icon: '?',
          textColor: 'text-gray-700'
        };
    }
  };

  const getDiceDisplay = (dice: number[], best: number) => {
    if (dice.length === 0) return null;
    
    return dice.map((d, index) => (
      <span 
        key={index}
        className={`inline-block w-6 h-6 text-xs rounded border text-center leading-6 ${
          d === best 
            ? 'bg-blue-100 border-blue-500 font-bold' 
            : 'bg-gray-100 border-gray-300'
        }`}
      >
        {d}
      </span>
    ));
  };

  // Ordena participantes por ordem de turno (já ordenados na iniciativa)
  const sortedParticipants = [...participants].sort((a, b) => {
    // Se não rolaram iniciativa ainda, mantém ordem original
    if (a.initiative.diceRolled.length === 0) return 0;
    
    const gradeA = a.initiative.successGrade;
    const gradeB = b.initiative.successGrade;
    
    const gradeValues = {
      'fracasso-extremo': 0,
      'fracasso-normal': 1,
      'sucesso-normal': 2,
      'sucesso-bom': 3,
      'sucesso-extremo': 4
    };
    
    const comparison = gradeValues[gradeB] - gradeValues[gradeA];
    if (comparison !== 0) return comparison;
    
    return b.initiative.bestDice - a.initiative.bestDice;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            Iniciativa
          </CardTitle>
          {showRollInitiative ? (
            <Button onClick={onRollInitiative}>
              Rolar Iniciativa
            </Button>
          ) : participants.length > 0 && (
            <Button onClick={onNextTurn} variant="outline" size="sm">
              Próximo Turno
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showRollInitiative ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Clique em "Rolar Iniciativa" para determinar a ordem dos turnos
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedParticipants.map((participant, index) => {
              const isCurrentTurn = participant.id === currentParticipantId;
              const gradeDisplay = getSuccessGradeDisplay(participant.initiative.successGrade);
              
              return (
                <div
                  key={participant.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isCurrentTurn 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Informações do participante */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-bold text-gray-600">
                          #{index + 1}
                        </span>
                        {isCurrentTurn && (
                          <span className="text-xs text-blue-600 font-semibold">
                            ATUAL
                          </span>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold">{participant.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Perícia: {participant.initiative.skillValue}</span>
                          {participant.initiative.diceRolled.length > 0 && (
                            <>
                              <span>•</span>
                              <span>Dados: {participant.initiative.diceRolled.join(', ')}</span>
                              <span>•</span>
                              <span>Melhor: {participant.initiative.bestDice}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status de vida e grau de sucesso */}
                    <div className="flex items-center gap-3">
                      {/* HP */}
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {participant.currentHP}/{participant.maxHP} PV
                        </div>
                        <Progress 
                          value={(participant.currentHP / participant.maxHP) * 100}
                          className="w-20 h-2"
                        />
                      </div>

                      {/* Grau de Sucesso */}
                      {participant.initiative.diceRolled.length > 0 && (
                        <Badge 
                          variant="outline" 
                          className={`${gradeDisplay.textColor} border-current`}
                        >
                          <span className="mr-1">{gradeDisplay.icon}</span>
                          {gradeDisplay.text}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Dados rolados */}
                  {participant.initiative.diceRolled.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Dados:</span>
                      <div className="flex gap-1">
                        {getDiceDisplay(participant.initiative.diceRolled, participant.initiative.bestDice)}
                      </div>
                    </div>
                  )}

                  {/* Condições ativas */}
                  {participant.conditions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {participant.conditions.map(condition => (
                        <Badge key={condition} variant="secondary" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {participants.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum participante no combate
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InitiativeTracker; 