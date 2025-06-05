import { ShopItem } from '../types/interactive';

export const shopCategories = {
  weapon: { name: 'Armas', icon: '⚔️', color: 'red' },
  armor: { name: 'Armaduras', icon: '🛡️', color: 'blue' },
  item: { name: 'Itens', icon: '🎒', color: 'green' }
};

export const shopItems: Record<string, ShopItem> = {
  // ARMAS SIMPLES - Preços conforme livro
  'adaga': {
    id: 'adaga',
    name: 'Adaga',
    description: 'Uma lâmina pequena e versátil. Dano 1d4, Atributo: DES, Perfuração/Corte, 1 Mão.',
    category: 'weapon',
    price: 5,
    basePrice: 5,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },
  'maca-leve': {
    id: 'maca-leve',
    name: 'Maça Leve',
    description: 'Arma simples de impacto. Dano 1d6, Atributo: FOR, Impacto, 1 Mão.',
    category: 'weapon',
    price: 5,
    basePrice: 5,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },
  'lanca-curta': {
    id: 'lanca-curta',
    name: 'Lança Curta',
    description: 'Lança de combate básica. Dano 1d6, Atributo: FOR, Perfuração, 1 Mão.',
    category: 'weapon',
    price: 5,
    basePrice: 5,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },
  'besta-leve': {
    id: 'besta-leve',
    name: 'Besta Leve',
    description: 'Arma de distância simples. Dano 1d4, Atributo: DES, Perfuração, 1 Mão, Distância.',
    category: 'weapon',
    price: 5,
    basePrice: 5,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },

  // ARMAS MARCIAIS - Preços conforme livro
  'espada-curta': {
    id: 'espada-curta',
    name: 'Espada Curta',
    description: 'Espada equilibrada. Dano 1d6, Atributo: DES, Corte, 1 Mão.',
    category: 'weapon',
    price: 5,
    basePrice: 5,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },
  'machado-de-mao': {
    id: 'machado-de-mao',
    name: 'Machado de Mão',
    description: 'Machado pequeno. Dano 1d6, Atributo: FOR, Corte, 1 Mão.',
    category: 'weapon',
    price: 5,
    basePrice: 5,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },
  'espada-longa': {
    id: 'espada-longa',
    name: 'Espada Longa',
    description: 'Espada nobre de duas mãos. Dano 1d8, Atributo: FOR, Corte, 2 Mãos.',
    category: 'weapon',
    price: 10,
    basePrice: 10,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },
  'machado-grande': {
    id: 'machado-grande',
    name: 'Machado Grande',
    description: 'Machado pesado de duas mãos. Dano 1d8, Atributo: FOR, Corte, 2 Mãos.',
    category: 'weapon',
    price: 10,
    basePrice: 10,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },
  'arco-longo': {
    id: 'arco-longo',
    name: 'Arco Longo',
    description: 'Arco poderoso. Dano 1d6, Atributo: DES, Perfuração, 2 Mãos, Distância.',
    category: 'weapon',
    price: 10,
    basePrice: 10,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },

  // ARMADURAS - Preços conforme livro
  'couro': {
    id: 'couro',
    name: 'Armadura de Couro',
    description: 'Proteção básica de couro. RD 1, Tipo: Leve, sem penalidade.',
    category: 'armor',
    price: 5,
    basePrice: 5,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },
  'couro-batido': {
    id: 'couro-batido',
    name: 'Couro Batido',
    description: 'Couro endurecido. RD 1, Tipo: Leve, sem penalidade.',
    category: 'armor',
    price: 5,
    basePrice: 5,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },
  'gibao-de-peles': {
    id: 'gibao-de-peles',
    name: 'Gibão de Peles',
    description: 'Armadura de peles. RD 1, Tipo: Leve, sem penalidade.',
    category: 'armor',
    price: 5,
    basePrice: 5,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },
  'cota-de-malha': {
    id: 'cota-de-malha',
    name: 'Cota de Malha',
    description: 'Armadura de metal. RD 2, Tipo: Média, -1 Força.',
    category: 'armor',
    price: 50,
    basePrice: 50,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },
  'brunea': {
    id: 'brunea',
    name: 'Brunea',
    description: 'Armadura reforçada. RD 2, Tipo: Média, -1 Destreza.',
    category: 'armor',
    price: 50,
    basePrice: 50,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },
  'armadura-completa': {
    id: 'armadura-completa',
    name: 'Armadura Completa',
    description: 'Proteção máxima. RD 3, Tipo: Pesada, -1 Destreza e Força.',
    category: 'armor',
    price: 85,
    basePrice: 85,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },

  // ITENS BÁSICOS - Preços conforme livro
  'corda': {
    id: 'corda',
    name: 'Corda (15m)',
    description: 'Corda resistente para escalada e uso geral.',
    category: 'item',
    price: 3,
    basePrice: 3,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },
  'tocha': {
    id: 'tocha',
    name: 'Tocha',
    description: 'Fonte de luz portátil.',
    category: 'item',
    price: 2,
    basePrice: 2,
    priceUnit: 'EfP',
    rarity: 'common',
    isAvailable: true
  },
  'racao': {
    id: 'racao',
    name: 'Ração de Viagem (1 dia)',
    description: 'Comida preservada para aventuras.',
    category: 'item',
    price: 5,
    basePrice: 5,
    priceUnit: 'EfP',
    rarity: 'common',
    isAvailable: true
  },
  'kit-de-cura': {
    id: 'kit-de-cura',
    name: 'Kit de Cura',
    description: 'Suprimentos básicos para primeiros socorros.',
    category: 'item',
    price: 50,
    basePrice: 50,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },
  'mochila': {
    id: 'mochila',
    name: 'Mochila',
    description: 'Para carregar equipamentos de aventura.',
    category: 'item',
    price: 3,
    basePrice: 3,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },
  'cantil': {
    id: 'cantil',
    name: 'Cantil',
    description: 'Recipiente para água.',
    category: 'item',
    price: 1,
    basePrice: 1,
    priceUnit: 'Ef',
    rarity: 'common',
    isAvailable: true
  },
  'pederneira': {
    id: 'pederneira',
    name: 'Pederneira',
    description: 'Para acender fogos.',
    category: 'item',
    price: 5,
    basePrice: 5,
    priceUnit: 'EfP',
    rarity: 'common',
    isAvailable: true
  }
};

export const shopLocations = [
  'Taverna do Javali Dourado',
  'Ferraria do Martelo Flamejante',
  'Empório Arcano de Mystral',
  'Mercado Central de Pedravale',
  'Loja de Aventureiros',
  'Feira dos Mercadores',
  'Arsenal da Guarda',
  'Botica da Velha Sábia'
];

export const shopkeepers = [
  'Thorin Martelo-Forte',
  'Elara Luaverde',
  'Gareth o Comerciante',
  'Mystral, a Maga',
  'Berto Boapreço',
  'Capitão Marcus',
  'Vovó Willow',
  'Korak dos Mil Tesouros'
]; 