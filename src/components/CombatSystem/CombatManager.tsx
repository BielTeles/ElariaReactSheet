import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  CombatState, 
  CombatParticipant, 
  AttackRoll, 
  DefenseRoll, 
  CombatResolution,
  SuccessGrade,
  Condition
} from '../../types/combat';
import { Character } from '../../types/character';
import { 
  rollAttributeDice, 
  getSuccessGrade, 
  compareSuccessGrades,
  CONDITIONS_DATA 
} from '../../data/combatData';
import InitiativeTracker from './InitiativeTracker';
import AttackCalculator from './AttackCalculator';
import DefenseReactions from './DefenseReactions';
import ConditionManager from './ConditionManager';
import CombatLog from './CombatLog';

interface CombatManagerProps {
  characters: Character[];
  onClose: () => void;
}

const CombatManager: React.FC<CombatManagerProps> = ({ characters, onClose }) => {
  const [combatState, setCombatState] = useState<CombatState>({
    isActive: false,
    round: 0,
    turn: 0,
    participants: [],
    turnOrder: [],
    currentParticipantId: null,
    actionLog: []
  });

  const [pendingAttack, setPendingAttack] = useState<AttackRoll | null>(null);
  const [showInitiativeRoll, setShowInitiativeRoll] = useState(false);

  // Inicia o combate
  const startCombat = useCallback(() => {
    const participants: CombatParticipant[] = characters.map(char => ({
      id: char.id,
      name: char.name,
      type: 'player' as const,
      initiative: {
        diceRolled: [],
        bestDice: 0,
        successGrade: 'fracasso-normal' as SuccessGrade,
        skillValue: char.skills['iniciativa'] || 0
      },
      currentHP: char.hitPoints.current,
      maxHP: char.hitPoints.maximum,
      currentMP: char.manaPoints?.current,
      maxMP: char.manaPoints?.maximum,
      currentVigor: char.vigor?.current,
      maxVigor: char.vigor?.maximum,
      conditions: [],
      damageReduction: 0 // Será calculado baseado na armadura
    }));

    setCombatState(prev => ({
      ...prev,
      isActive: true,
      round: 1,
      participants
    }));

    setShowInitiativeRoll(true);
  }, [characters]);

  // Rola iniciativa para todos os participantes
  const rollInitiative = useCallback(() => {
    const updatedParticipants = combatState.participants.map(participant => {
      const character = characters.find(c => c.id === participant.id);
      if (!character) return participant;

      const { dice, result } = rollAttributeDice(character.attributes.destreza);
      const successGrade = getSuccessGrade(result, participant.initiative.skillValue);

      return {
        ...participant,
        initiative: {
          ...participant.initiative,
          diceRolled: dice,
          bestDice: result,
          successGrade
        }
      };
    });

    // Ordena por grau de sucesso e depois por resultado do dado
    const turnOrder = [...updatedParticipants].sort((a, b) => {
      const gradeComparison = compareSuccessGrades(b.initiative.successGrade, a.initiative.successGrade);
      if (gradeComparison !== 0) return gradeComparison;
      return b.initiative.bestDice - a.initiative.bestDice;
    }).map(p => p.id);

    setCombatState(prev => ({
      ...prev,
      participants: updatedParticipants,
      turnOrder,
      currentParticipantId: turnOrder[0] || null,
      turn: 0
    }));

    setShowInitiativeRoll(false);
  }, [combatState.participants, characters]);

  // Próximo turno
  const nextTurn = useCallback(() => {
    setCombatState(prev => {
      const nextTurnIndex = (prev.turn + 1) % prev.turnOrder.length;
      const nextRound = nextTurnIndex === 0 ? prev.round + 1 : prev.round;

      return {
        ...prev,
        turn: nextTurnIndex,
        round: nextRound,
        currentParticipantId: prev.turnOrder[nextTurnIndex] || null
      };
    });
  }, []);

  // Adiciona condição a um participante
  const addCondition = useCallback((participantId: string, condition: Condition) => {
    setCombatState(prev => ({
      ...prev,
      participants: prev.participants.map(p => 
        p.id === participantId && !p.conditions.includes(condition)
          ? { ...p, conditions: [...p.conditions, condition] }
          : p
      )
    }));
  }, []);

  // Remove condição de um participante
  const removeCondition = useCallback((participantId: string, condition: Condition) => {
    setCombatState(prev => ({
      ...prev,
      participants: prev.participants.map(p => 
        p.id === participantId
          ? { ...p, conditions: p.conditions.filter(c => c !== condition) }
          : p
      )
    }));
  }, []);

  // Aplica dano a um participante
  const applyDamage = useCallback((participantId: string, damage: number) => {
    setCombatState(prev => ({
      ...prev,
      participants: prev.participants.map(p => 
        p.id === participantId
          ? { ...p, currentHP: Math.max(0, p.currentHP - damage) }
          : p
      )
    }));
  }, []);

  // Cura um participante
  const healParticipant = useCallback((participantId: string, healing: number) => {
    setCombatState(prev => ({
      ...prev,
      participants: prev.participants.map(p => 
        p.id === participantId
          ? { ...p, currentHP: Math.min(p.maxHP, p.currentHP + healing) }
          : p
      )
    }));
  }, []);

  // Adiciona ação ao log
  const addToLog = useCallback((description: string, resolution?: CombatResolution) => {
    const action = {
      id: `${Date.now()}-${Math.random()}`,
      round: combatState.round,
      turn: combatState.turn,
      participantId: combatState.currentParticipantId || '',
      actionType: 'other' as const,
      description,
      timestamp: new Date(),
      resolution
    };

    setCombatState(prev => ({
      ...prev,
      actionLog: [...prev.actionLog, action]
    }));
  }, [combatState.round, combatState.turn, combatState.currentParticipantId]);

  const currentParticipant = combatState.participants.find(
    p => p.id === combatState.currentParticipantId
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Combate */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⚔️</span>
              Sistema de Combate - Elaria
            </CardTitle>
            <div className="flex gap-2">
              {combatState.isActive && (
                <Badge variant="outline">
                  Rodada {combatState.round} | Turno {combatState.turn + 1}
                </Badge>
              )}
              <Button onClick={onClose} variant="outline">
                Fechar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!combatState.isActive ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold mb-4">
                Preparar para o Combate
              </h3>
              <p className="text-muted-foreground mb-4">
                {characters.length} personagem(s) participarão do combate
              </p>
              <Button onClick={startCombat}>
                Iniciar Combate
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rastreador de Iniciativa */}
              <div>
                <InitiativeTracker
                  participants={combatState.participants}
                  currentParticipantId={combatState.currentParticipantId}
                  onNextTurn={nextTurn}
                  showRollInitiative={showInitiativeRoll}
                  onRollInitiative={rollInitiative}
                />
              </div>

              {/* Ações do Turno Atual */}
              <div>
                {currentParticipant && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Turno de {currentParticipant.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => setPendingAttack({} as AttackRoll)}
                          className="flex-1"
                        >
                          Atacar
                        </Button>
                        <Button 
                          onClick={nextTurn}
                          variant="outline"
                          className="flex-1"
                        >
                          Pular Turno
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calculadora de Ataque */}
      {pendingAttack && (
        <AttackCalculator
          participants={combatState.participants}
          characters={characters}
          onAttackResolved={(resolution) => {
            addToLog(`Ataque realizado`, resolution);
            if (resolution.hit && resolution.finalDamage > 0) {
              applyDamage(resolution.attack.targetId, resolution.finalDamage);
            }
            setPendingAttack(null);
          }}
          onCancel={() => setPendingAttack(null)}
        />
      )}

      {/* Sistema de Reações Defensivas */}
      <DefenseReactions
        participants={combatState.participants}
        characters={characters}
      />

      {/* Gerenciador de Condições */}
      <ConditionManager
        participants={combatState.participants}
        onAddCondition={addCondition}
        onRemoveCondition={removeCondition}
      />

      {/* Log de Combate */}
      <CombatLog
        actions={combatState.actionLog}
        participants={combatState.participants}
      />
    </div>
  );
};

export default CombatManager; 