// Tipos base para atributos
export interface Attributes {
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  sabedoria: number;
  carisma: number;
}

// Tipos de raças
export type Race = 'alari' | 'roknar' | 'kain' | 'faelan' | 'celeres' | 'aurien' | 'vesperi';

// Tipos de classes principais
export type MainClass = 'evocador' | 'tita' | 'sentinela' | 'elo';

// Tipos de subclasses/caminhos
export type EvocadorPath = 'terra' | 'agua' | 'ar' | 'fogo' | 'luz' | 'sombra';
export type TitaArchetype = 'baluarte' | 'furia-primal' | 'quebra-montanhas';
export type SentinelaArchetype = 'rastreador' | 'lamina-crepusculo' | 'olho-vigilante';
export type EloArchetype = 'voz-harmonia' | 'porta-voz-chama' | 'guardiao-coracao';

export type Subclass = EvocadorPath | TitaArchetype | SentinelaArchetype | EloArchetype;

// Tipos de origens
export type Origin = 'sobrevivente-brasas' | 'guarda-harmonia' | 'iniciado-florestas' | 
  'erudito-biblioteca' | 'artista-itinerante' | 'veterano-guerras';

// Tipos de divindades/patronos
export type Deity = 'ignis' | 'ondina' | 'terrus' | 'zephyrus' | 'lumina' | 'noctus' | null;

// Interface para perícias
export interface Skills {
  [key: string]: number;
}

// Interface para equipamentos
export interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'item';
  description?: string;
  equipped?: boolean;
  quantity?: number;
}

// Interface principal do personagem
export interface Character {
  id: string;
  name: string;
  age?: number;
  height?: string;
  
  // Características de criação
  attributes: Attributes;
  race: Race;
  mainClass: MainClass;
  subclass: Subclass;
  origin: Origin;
  deity: Deity;
  
  // Mecânicas de jogo
  level: number;
  hitPoints: {
    current: number;
    maximum: number;
  };
  manaPoints: {
    current: number;
    maximum: number;
  };
  vigor?: {
    current: number;
    maximum: number;
  };
  
  // Perícias e habilidades
  skills: Skills;
  abilities: string[];
  
  // Equipamentos
  equipment: Equipment[];
  gold: number;
  
  // Notas e história
  backstory?: string;
  goals?: string[];
  contacts?: string[];
  notes?: string;
  
  // Metadados
  createdAt: Date;
  updatedAt: Date;
}

// Interface para dados de raça
export interface RaceData {
  id: Race;
  name: string;
  description: string;
  attributeBonus: keyof Attributes;
  bonusValue: number;
  baseMovement: number;
  traits: string[];
  patron?: string;
}

// Interface para dados de classe
export interface ClassData {
  id: MainClass;
  name: string;
  description: string;
  hitDie: number;
  hitPointsPerLevel: number;
  manaPointsBase: number;
  manaPointsPerLevel: number;
  skillChoices: number;
  availableSkills: string[];
  subclasses: Subclass[];
}

// Interface para criação de personagem (wizard)
export interface CharacterCreation {
  step: number;
  attributes: Partial<Attributes>;
  race?: Race;
  mainClass?: MainClass;
  subclass?: Subclass;
  origin?: Origin;
  deity?: Deity;
  selectedSkills: string[];
  equipment: Equipment[];
  personalDetails: {
    name?: string;
    age?: number;
    height?: string;
    backstory?: string;
  };
} 