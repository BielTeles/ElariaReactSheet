export interface DiceRoll {
  id: string;
  timestamp: Date;
  type: 'attribute' | 'skill';
  name: string;
  attributeValue: number;
  skillValue?: number;
  diceRolled: number[];
  finalResult: number;
  successLevel: 'failure-extreme' | 'failure-normal' | 'success-normal' | 'success-good' | 'success-extreme' | null;
}

export interface CharacterState {
  currentHP: number;
  currentMP: number;
  currentVigor: number;
  tempHP: number;
  conditions: string[];
  equippedWeapon?: string;
  equippedArmor?: string;
  rollHistory: DiceRoll[];
}

export interface ResourceChange {
  type: 'hp' | 'mp' | 'vigor';
  amount: number;
  reason: string;
} 