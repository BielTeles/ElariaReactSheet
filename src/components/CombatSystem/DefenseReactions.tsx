import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { CombatParticipant } from '../../types/combat';
import { Character } from '../../types/character';

interface DefenseReactionsProps {
  participants: CombatParticipant[];
  characters: Character[];
}

const DefenseReactions: React.FC<DefenseReactionsProps> = ({
  participants,
  characters
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">🛡️</span>
          Reações Defensivas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-4">
          Sistema de Bloqueio e Esquiva será implementado em breve
        </p>
      </CardContent>
    </Card>
  );
};

export default DefenseReactions; 