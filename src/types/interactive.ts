export interface DiceRoll {
  id: string;
  timestamp: Date | string;
  type: 'attribute' | 'skill' | 'damage' | 'custom' | 'initiative' | 'resistance';
  name: string;
  attributeValue?: number;
  skillValue?: number;
  diceRolled: number[];
  finalResult: number;
  successLevel: 'failure-extreme' | 'failure-normal' | 'success-normal' | 'success-good' | 'success-extreme' | null;
  
  // Novos campos para rolagens avançadas
  modifier?: number;
  customDice?: string; // Ex: "3d6", "1d8+2", "2d20"
  damageType?: string;
  notes?: string;
  advantage?: boolean;
  disadvantage?: boolean;
  rollPurpose?: string; // Ex: "Ataque", "Dano", "Resistência"
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
  notes: CharacterNote[];
}

export interface ResourceChange {
  type: 'hp' | 'mp' | 'vigor';
  amount: number;
  reason: string;
}

// Nova interface para configurações de rolagem
export interface RollSettings {
  showAnimation: boolean;
  animationSpeed: 'fast' | 'normal' | 'slow';
  autoSave: boolean;
  soundEnabled: boolean;
}

// Interface para rolagens personalizadas
export interface CustomRoll {
  id: string;
  name: string;
  dice: string; // Ex: "1d20+5", "3d6"
  description?: string;
  category: 'combat' | 'skill' | 'damage' | 'utility' | 'custom';
}

export interface CharacterNote {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'session' | 'character' | 'plot' | 'combat' | 'custom';
  tags: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  isPrivate: boolean;
} 