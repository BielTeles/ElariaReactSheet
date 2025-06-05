export interface DiceRoll {
  id: string;
  timestamp: Date | string;
  type: 'attribute' | 'skill' | 'damage' | 'initiative' | 'custom';
  name: string;
  attributeValue?: number;
  skillValue?: number;
  diceRolled: number[];
  finalResult: number;
  successLevel?: 'success-extreme' | 'success-good' | 'success-normal' | 'failure-normal' | 'failure-extreme' | null;
  rollPurpose?: string;
  modifier?: number;
  customDice?: string;
  notes?: string;
}

export interface CharacterState {
  currentHP: number;
  currentMP: number;
  currentVigor: number;
  tempHP: number;
  conditions: string[];
  equippedWeapon?: string;
  equippedArmor?: string;
  equippedShield?: string;
  equippedAccessories?: string[];
  rollHistory: DiceRoll[];
  notes: CharacterNote[];
  currentMoney: number;
  transactions: Transaction[];
  inventory: InventoryItem[];
}

export interface ResourceChange {
  type: 'hp' | 'mp' | 'vigor';
  amount: number;
  reason: string;
}

export interface RollSettings {
  showAnimation: boolean;
  animationSpeed: 'fast' | 'normal' | 'slow';
  autoSave: boolean;
  soundEnabled: boolean;
}

export interface CustomRoll {
  id: string;
  name: string;
  dice: string;
  description?: string;
  category: 'combat' | 'skill' | 'damage' | 'utility' | 'custom';
}

export interface CharacterNote {
  id: string;
  title: string;
  content: string;
  category: 'geral' | 'personagem' | 'sessao' | 'enredo' | 'combate' | 'personalizada';
  tags: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  timestamp: Date;
  type: 'income' | 'expense';
  amount: number;
  source: 'purchase' | 'sale' | 'reward' | 'manual' | 'loot' | 'payment' | 'other';
  description: string;
  itemId?: string;
  balanceBefore: number;
  balanceAfter: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: 'weapon' | 'armor' | 'item';
  price: number;
  basePrice: number;
  priceUnit: 'Ef' | 'EfP';
  rarity: 'common';
  isAvailable: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  equipmentId: string;
  quantity: number;
  purchaseDate: Date;
  purchasePrice: number;
  source: 'purchase' | 'loot' | 'gift' | 'starting';
  isEquipped: boolean;
  notes?: string;
} 