import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { 
  CombatParticipant, 
  AttackRoll, 
  CombatResolution,
  AttackSkill,
  SuccessGrade 
} from '../../types/combat';
import { Character, Attributes } from '../../types/character';
import { 
  rollAttributeDice, 
  getSuccessGrade, 
  ATTACK_SKILLS 
} from '../../data/combatData';

interface AttackCalculatorProps {
  participants: CombatParticipant[];
  characters: Character[];
  onAttackResolved: (resolution: CombatResolution) => void;
  onCancel: () => void;
}

interface WeaponOption {
  name: string;
  damage: string;
  type: string;
  skill: AttackSkill;
  attribute: keyof Attributes;
}

const AttackCalculator: React.FC<AttackCalculatorProps> = ({
  participants,
  characters,
  onAttackResolved,
  onCancel
}) => {
  const [attackerId, setAttackerId] = useState<string>('');
  const [targetId, setTargetId] = useState<string>('');
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponOption | null>(null);
  const [customSkillValue, setCustomSkillValue] = useState<number>(0);
  const [attackResult, setAttackResult] = useState<AttackRoll | null>(null);
  const [showDamageRoll, setShowDamageRoll] = useState(false);

  // Armas básicas disponíveis
  const basicWeapons: WeaponOption[] = [
    {
      name: 'Espada Longa',
      damage: '1d8',
      type: 'Corte',
      skill: 'corpo-a-corpo',
      attribute: 'forca'
    },
    {
      name: 'Adaga',
      damage: '1d4',
      type: 'Perfuração',
      skill: 'corpo-a-corpo',
      attribute: 'destreza'
    },
    {
      name: 'Arco Longo',
      damage: '1d6',
      type: 'Perfuração',
      skill: 'pontaria',
      attribute: 'destreza'
    },
    {
      name: 'Besta Leve',
      damage: '1d4',
      type: 'Perfuração',
      skill: 'pontaria',
      attribute: 'destreza'
    },
    {
      name: 'Magia Elemental',
      damage: '1d6',
      type: 'Elemental',
      skill: 'elemental',
      attribute: 'sabedoria'
    }
  ];

  const attacker = characters.find(c => c.id === attackerId);
  const target = participants.find(p => p.id === targetId);

  const rollAttack = useCallback(() => {
    if (!attacker || !selectedWeapon) return;

    const skillKey = selectedWeapon.skill;
    const skillValue = attacker.skills[skillKey] || customSkillValue;
    const attributeValue = attacker.attributes[selectedWeapon.attribute];

    const { dice, result } = rollAttributeDice(attributeValue);
    const successGrade = getSuccessGrade(result, skillValue);
    const isCritical = successGrade === 'sucesso-extremo';

    const attack: AttackRoll = {
      attackerId,
      targetId,
      attribute: selectedWeapon.attribute,
      skill: selectedWeapon.skill,
      skillValue,
      diceRolled: dice,
      bestDice: result,
      successGrade,
      isCritical,
      weapon: {
        name: selectedWeapon.name,
        damage: selectedWeapon.damage,
        type: selectedWeapon.type
      }
    };

    setAttackResult(attack);

    // Se o ataque teve sucesso, permitir rolagem de dano
    if (successGrade !== 'fracasso-extremo' && successGrade !== 'fracasso-normal') {
      setShowDamageRoll(true);
    } else {
      // Ataque falhou, resolver imediatamente
      const resolution: CombatResolution = {
        attack,
        hit: false,
        damageReduction: 0,
        finalDamage: 0,
        result: `${attacker.name} falhou no ataque com ${selectedWeapon.name}.`
      };
      onAttackResolved(resolution);
    }
  }, [attacker, selectedWeapon, customSkillValue, attackerId, targetId, onAttackResolved]);

  const rollDamage = useCallback(() => {
    if (!attackResult || !selectedWeapon || !target) return;

    // Simular rolagem de dano baseada na string de dados
    let diceCount = 1;
    let diceSize = 6;
    let modifier = 0;

    // Parse básico de string de dano como "1d6", "2d4+1", etc.
    const damageMatch = selectedWeapon.damage.match(/(\d+)d(\d+)(?:\+(\d+))?/);
    if (damageMatch) {
      diceCount = parseInt(damageMatch[1]);
      diceSize = parseInt(damageMatch[2]);
      modifier = parseInt(damageMatch[3] || '0');
    }

    // Rolar dados de dano
    const damageRolls: number[] = [];
    for (let i = 0; i < diceCount; i++) {
      damageRolls.push(Math.floor(Math.random() * diceSize) + 1);
    }

    // Se for crítico, rolar dados duas vezes
    if (attackResult.isCritical) {
      for (let i = 0; i < diceCount; i++) {
        damageRolls.push(Math.floor(Math.random() * diceSize) + 1);
      }
    }

    const baseDamage = damageRolls.reduce((sum, roll) => sum + roll, 0) + modifier;
    const damageReduction = target.damageReduction;
    const finalDamage = Math.max(0, baseDamage - damageReduction);

    const resolution: CombatResolution = {
      attack: attackResult,
      hit: true,
      damage: {
        rolled: damageRolls,
        total: baseDamage,
        type: selectedWeapon.type
      },
      damageReduction,
      finalDamage,
      result: `${attacker?.name} atacou ${target.name} com ${selectedWeapon.name} causando ${finalDamage} de dano.`
    };

    onAttackResolved(resolution);
  }, [attackResult, selectedWeapon, target, attacker, onAttackResolved]);

  const getSuccessGradeDisplay = (grade: SuccessGrade) => {
    switch (grade) {
      case 'sucesso-extremo':
        return { color: 'text-purple-700', text: 'Sucesso Extremo (Crítico!)', icon: '⭐' };
      case 'sucesso-bom':
        return { color: 'text-green-700', text: 'Sucesso Bom', icon: '✓' };
      case 'sucesso-normal':
        return { color: 'text-blue-700', text: 'Sucesso Normal', icon: '○' };
      case 'fracasso-normal':
        return { color: 'text-yellow-700', text: 'Fracasso Normal', icon: '△' };
      case 'fracasso-extremo':
        return { color: 'text-red-700', text: 'Fracasso Extremo', icon: '✗' };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-xl">⚔️</span>
          Calculadora de Ataque
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!attackResult ? (
          <>
            {/* Seleção do Atacante */}
            <div>
              <Label>Atacante</Label>
              <Select value={attackerId} onValueChange={setAttackerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o atacante" />
                </SelectTrigger>
                <SelectContent>
                  {characters.map(char => (
                    <SelectItem key={char.id} value={char.id}>
                      {char.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Seleção do Alvo */}
            <div>
              <Label>Alvo</Label>
              <Select value={targetId} onValueChange={setTargetId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o alvo" />
                </SelectTrigger>
                <SelectContent>
                  {participants.map(participant => (
                    <SelectItem key={participant.id} value={participant.id}>
                      {participant.name} ({participant.currentHP}/{participant.maxHP} PV)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Seleção da Arma */}
            <div>
              <Label>Arma/Ataque</Label>
              <Select 
                value={selectedWeapon?.name || ''} 
                onValueChange={(weaponName) => {
                  const weapon = basicWeapons.find(w => w.name === weaponName);
                  setSelectedWeapon(weapon || null);
                  if (weapon && attacker) {
                    setCustomSkillValue(attacker.skills[weapon.skill] || 0);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a arma" />
                </SelectTrigger>
                <SelectContent>
                  {basicWeapons.map(weapon => (
                    <SelectItem key={weapon.name} value={weapon.name}>
                      {weapon.name} ({weapon.damage} {weapon.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Valor da Perícia */}
            {selectedWeapon && (
              <div>
                <Label>
                  Valor da Perícia {ATTACK_SKILLS[selectedWeapon.skill].name}
                </Label>
                <Input
                  type="number"
                  value={customSkillValue}
                  onChange={(e) => setCustomSkillValue(parseInt(e.target.value) || 0)}
                  placeholder="Valor da perícia"
                />
                {attacker && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Atributo base: {selectedWeapon.attribute.toUpperCase()} = {attacker.attributes[selectedWeapon.attribute]}
                    {' '}({attacker.attributes[selectedWeapon.attribute] >= 2 ? 'Vantagem' : 
                       attacker.attributes[selectedWeapon.attribute] <= -1 ? 'Desvantagem' : 'Normal'})
                  </p>
                )}
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={rollAttack}
                disabled={!attackerId || !targetId || !selectedWeapon}
                className="flex-1"
              >
                Rolar Ataque
              </Button>
              <Button onClick={onCancel} variant="outline">
                Cancelar
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Resultado do Ataque */}
            <div className="space-y-4">
              <h3 className="font-semibold">Resultado do Ataque</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Dados Rolados</Label>
                  <div className="flex gap-1 mt-1">
                    {attackResult.diceRolled.map((d, index) => (
                      <span 
                        key={index}
                        className={`inline-block w-8 h-8 text-sm rounded border text-center leading-8 ${
                          d === attackResult.bestDice 
                            ? 'bg-blue-100 border-blue-500 font-bold' 
                            : 'bg-gray-100 border-gray-300'
                        }`}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Melhor dado: {attackResult.bestDice}
                  </p>
                </div>

                <div>
                  <Label>Grau de Sucesso</Label>
                  <div className="mt-1">
                    <Badge 
                      variant="outline" 
                      className={`${getSuccessGradeDisplay(attackResult.successGrade).color} border-current`}
                    >
                      <span className="mr-1">{getSuccessGradeDisplay(attackResult.successGrade).icon}</span>
                      {getSuccessGradeDisplay(attackResult.successGrade).text}
                    </Badge>
                  </div>
                </div>
              </div>

              {showDamageRoll ? (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">
                    O ataque teve sucesso! Agora role o dano.
                  </h4>
                  <div className="flex gap-2">
                    <Button onClick={rollDamage} className="flex-1">
                      Rolar Dano ({selectedWeapon?.damage})
                      {attackResult.isCritical && ' - CRÍTICO!'}
                    </Button>
                    <Button onClick={onCancel} variant="outline">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-t pt-4">
                  <p className="text-center text-muted-foreground">
                    O ataque falhou. Nenhum dano foi causado.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => setAttackResult(null)} className="flex-1">
                      Novo Ataque
                    </Button>
                    <Button onClick={onCancel} variant="outline">
                      Fechar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AttackCalculator; 