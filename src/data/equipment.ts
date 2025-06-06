export interface EquipmentItem {
  id: string;
  name: string;
  category: 'weapon' | 'armor' | 'item';
  subcategory?: string;
  price: number; // em Elfens
  priceUnit: 'Ef' | 'EfP';
  weight?: number; // em kg - NOVO
  description?: string;
  
  // Para armas
  damage?: string;
  keyAttribute?: string;
  damageType?: string;
  hands?: '1 Mão' | '2 Mãos';
  range?: 'Corpo a Corpo' | 'Distância';
  
  // Para armaduras
  armorType?: 'Leve' | 'Média' | 'Pesada';
  damageReduction?: number;
  attributePenalty?: string;
  
  // Para itens gerais
  uses?: string;
}

export const equipment: Record<string, EquipmentItem> = {
  // ARMAS SIMPLES
  'adaga': {
    id: 'adaga',
    name: 'Adaga',
    category: 'weapon',
    subcategory: 'simple',
    price: 5,
    priceUnit: 'Ef',
    weight: 0.5,
    damage: '1d4',
    keyAttribute: 'DES',
    damageType: 'Perf./Corte',
    hands: '1 Mão',
    range: 'Corpo a Corpo',
    description: 'Uma lâmina pequena e versátil, ideal para combate próximo e trabalhos delicados.'
  },
  'maca-leve': {
    id: 'maca-leve',
    name: 'Maça Leve',
    category: 'weapon',
    subcategory: 'simple',
    price: 5,
    priceUnit: 'Ef',
    weight: 1.5,
    damage: '1d6',
    keyAttribute: 'FOR',
    damageType: 'Impacto',
    hands: '1 Mão',
    range: 'Corpo a Corpo',
    description: 'Uma arma contundente simples mas eficaz, fácil de manusear.'
  },
  'lanca-curta': {
    id: 'lanca-curta',
    name: 'Lança Curta',
    category: 'weapon',
    subcategory: 'simple',
    price: 5,
    priceUnit: 'Ef',
    weight: 1.0,
    damage: '1d6',
    keyAttribute: 'FOR',
    damageType: 'Perf.',
    hands: '1 Mão',
    range: 'Corpo a Corpo',
    description: 'Uma lança de tamanho reduzido, boa para combate em espaços apertados.'
  },
  'besta-leve': {
    id: 'besta-leve',
    name: 'Besta Leve',
    category: 'weapon',
    subcategory: 'simple',
    price: 5,
    priceUnit: 'Ef',
    weight: 2.0,
    damage: '1d4',
    keyAttribute: 'DES',
    damageType: 'Perf.',
    hands: '1 Mão',
    range: 'Distância',
    description: 'Uma besta pequena e fácil de carregar, ideal para iniciantes em combate à distância.'
  },

  // ARMAS MARCIAIS
  'espada-curta': {
    id: 'espada-curta',
    name: 'Espada Curta',
    category: 'weapon',
    subcategory: 'martial',
    price: 5,
    priceUnit: 'Ef',
    weight: 1.0,
    damage: '1d6',
    keyAttribute: 'DES',
    damageType: 'Corte',
    hands: '1 Mão',
    range: 'Corpo a Corpo',
    description: 'Uma lâmina ágil e balanceada, favorita de guerreiros experientes.'
  },
  'machado-mao': {
    id: 'machado-mao',
    name: 'Machado de Mão',
    category: 'weapon',
    subcategory: 'martial',
    price: 5,
    priceUnit: 'Ef',
    weight: 1.5,
    damage: '1d6',
    keyAttribute: 'FOR',
    damageType: 'Corte',
    hands: '1 Mão',
    range: 'Corpo a Corpo',
    description: 'Um machado compacto mas poderoso, pode ser arremessado se necessário.'
  },
  'espada-longa': {
    id: 'espada-longa',
    name: 'Espada Longa',
    category: 'weapon',
    subcategory: 'martial',
    price: 10,
    priceUnit: 'Ef',
    weight: 3.0,
    damage: '1d8',
    keyAttribute: 'FOR',
    damageType: 'Corte',
    hands: '2 Mãos',
    range: 'Corpo a Corpo',
    description: 'A arma clássica dos cavaleiros, requer duas mãos mas oferece alcance superior.'
  },
  'machado-grande': {
    id: 'machado-grande',
    name: 'Machado Grande',
    category: 'weapon',
    subcategory: 'martial',
    price: 10,
    priceUnit: 'Ef',
    weight: 4.0,
    damage: '1d8',
    keyAttribute: 'FOR',
    damageType: 'Corte',
    hands: '2 Mãos',
    range: 'Corpo a Corpo',
    description: 'Uma arma devastadora que requer força e técnica para ser manejada efetivamente.'
  },
  'arco-longo': {
    id: 'arco-longo',
    name: 'Arco Longo',
    category: 'weapon',
    subcategory: 'martial',
    price: 10,
    priceUnit: 'Ef',
    weight: 1.5,
    damage: '1d6',
    keyAttribute: 'DES',
    damageType: 'Perf.',
    hands: '2 Mãos',
    range: 'Distância',
    description: 'O arco preferido de arqueiros experientes, oferece precisão e alcance superiores.'
  },

  // ARMADURAS
  'couro': {
    id: 'couro',
    name: 'Couro',
    category: 'armor',
    subcategory: 'light',
    price: 5,
    priceUnit: 'Ef',
    weight: 3.0,
    armorType: 'Leve',
    damageReduction: 1,
    attributePenalty: '0',
    description: 'Armadura básica de couro curtido, oferece proteção sem sacrificar mobilidade.'
  },
  'couro-batido': {
    id: 'couro-batido',
    name: 'Couro Batido',
    category: 'armor',
    subcategory: 'light',
    price: 5,
    priceUnit: 'Ef',
    weight: 4.0,
    armorType: 'Leve',
    damageReduction: 1,
    attributePenalty: '0',
    description: 'Couro endurecido através de tratamento especial, mais resistente que couro comum.'
  },
  'gibao-peles': {
    id: 'gibao-peles',
    name: 'Gibão de Peles',
    category: 'armor',
    subcategory: 'light',
    price: 5,
    priceUnit: 'Ef',
    weight: 3.5,
    armorType: 'Leve',
    damageReduction: 1,
    attributePenalty: '0',
    description: 'Várias camadas de peles animais costuradas, popular entre caçadores e batedores.'
  },
  'cota-malha': {
    id: 'cota-malha',
    name: 'Cota de Malha',
    category: 'armor',
    subcategory: 'medium',
    price: 50,
    priceUnit: 'Ef',
    weight: 12.0,
    armorType: 'Média',
    damageReduction: 2,
    attributePenalty: '-1 (Força)',
    description: 'Anéis de metal entrelaçados formando uma proteção flexível mas pesada.'
  },
  'brunea': {
    id: 'brunea',
    name: 'Brunea',
    category: 'armor',
    subcategory: 'medium',
    price: 50,
    priceUnit: 'Ef',
    weight: 15.0,
    armorType: 'Média',
    damageReduction: 2,
    attributePenalty: '-1 (Destreza)',
    description: 'Armadura de placas parciais sobre couro, balanceando proteção e agilidade.'
  },
  'armadura-completa': {
    id: 'armadura-completa',
    name: 'Armadura Completa',
    category: 'armor',
    subcategory: 'heavy',
    price: 85,
    priceUnit: 'Ef',
    weight: 25.0,
    armorType: 'Pesada',
    damageReduction: 3,
    attributePenalty: '-1 (Destreza e Força)',
    description: 'A melhor proteção disponível, placas de metal articuladas cobrindo todo o corpo.'
  },

  // EQUIPAMENTO GERAL
  'corda': {
    id: 'corda',
    name: 'Corda (15m)',
    category: 'item',
    subcategory: 'general',
    price: 3,
    priceUnit: 'Ef',
    weight: 3.0,
    description: 'Corda resistente de cânhamo, essencial para escaladas e travessias.'
  },
  'tocha': {
    id: 'tocha',
    name: 'Tocha',
    category: 'item',
    subcategory: 'general',
    price: 2,
    priceUnit: 'EfP',
    weight: 0.2,
    description: 'Iluminação portátil que dura algumas horas.'
  },
  'racao-viagem': {
    id: 'racao-viagem',
    name: 'Ração de Viagem (1 dia)',
    category: 'item',
    subcategory: 'general',
    price: 5,
    priceUnit: 'EfP',
    weight: 0.3,
    description: 'Alimento preservado que sustenta um aventureiro por um dia inteiro.'
  },
  'kit-cura': {
    id: 'kit-cura',
    name: 'Kit de Cura',
    category: 'item',
    subcategory: 'general',
    price: 50,
    priceUnit: 'Ef',
    weight: 2.0,
    description: 'Bandagens, ervas medicinais e unguentos para primeiros socorros.'
  },
  'saco-dormir': {
    id: 'saco-dormir',
    name: 'Saco de Dormir',
    category: 'item',
    subcategory: 'general',
    price: 5,
    priceUnit: 'EfP',
    weight: 1.0,
    description: 'Essencial para descansar confortavelmente em viagens.'
  },
  'mochila': {
    id: 'mochila',
    name: 'Mochila',
    category: 'item',
    subcategory: 'general',
    price: 3,
    priceUnit: 'Ef',
    weight: 0.5,
    description: 'Para carregar todos os seus pertences de aventureiro.'
  },
  'cantil': {
    id: 'cantil',
    name: 'Cantil',
    category: 'item',
    subcategory: 'general',
    price: 1,
    priceUnit: 'Ef',
    weight: 0.3,
    description: 'Recipiente para água, fundamental para sobrevivência.'
  },
  'pederneira': {
    id: 'pederneira',
    name: 'Pederneira',
    category: 'item',
    subcategory: 'general',
    price: 5,
    priceUnit: 'EfP',
    weight: 0.1,
    description: 'Para acender fogueiras e tochas quando necessário.'
  },
  'historia-paz-dourada': {
    id: 'historia-paz-dourada',
    name: 'História da Paz Dourada',
    category: 'item',
    subcategory: 'general',
    price: 3,
    priceUnit: 'Ef',
    weight: 0.5,
    description: 'Um livro sobre a história recente de Elaria, útil para conhecimento geral.'
  }
};

// Equipamentos iniciais gratuitos que todo personagem recebe
export const initialFreeEquipment: EquipmentItem[] = [
  equipment['mochila'],
  equipment['saco-dormir'],
  {
    id: 'traje-viajante',
    name: 'Traje de Viajante',
    category: 'item',
    subcategory: 'clothing',
    price: 0,
    priceUnit: 'Ef',
    weight: 1.0,
    description: 'Roupas simples e resistentes, adequadas para aventuras.'
  }
];

// Função para rolar 4d6 Elfens iniciais
export const rollInitialGold = (): number => {
  let total = 0;
  for (let i = 0; i < 4; i++) {
    total += Math.floor(Math.random() * 6) + 1;
  }
  return total;
};

// Função para converter entre Elfens e Elfens Prata
export const convertCurrency = (amount: number, from: 'Ef' | 'EfP', to: 'Ef' | 'EfP'): number => {
  if (from === to) return amount;
  if (from === 'Ef' && to === 'EfP') return amount * 10;
  if (from === 'EfP' && to === 'Ef') return Math.floor(amount / 10);
  return amount;
};

// Função para obter preço em Elfens Prata para display
export const getDisplayPrice = (item: EquipmentItem): string => {
  if (item.priceUnit === 'Ef') {
    return `${item.price} Ef`;
  } else {
    return `${item.price} EfP`;
  }
}; 