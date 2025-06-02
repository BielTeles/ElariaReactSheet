import { ClassData } from '../types/character';

export const classes: Record<string, ClassData> = {
  evocador: {
    id: 'evocador',
    name: 'Evocador',
    description: 'Mestres dos elementos primordiais, os Evocadores canalizam as forças da natureza através de conexões profundas com as essências elementais. Cada Evocador segue um Caminho Elemental específico.',
    hitDie: 6,
    hitPointsPerLevel: 6,
    manaPointsBase: 10,
    manaPointsPerLevel: 5,
    skillChoices: 3,
    availableSkills: [
      'Arcano',
      'Investigação',
      'Medicina',
      'Natureza',
      'Percepção',
      'Religião'
    ],
    subclasses: ['terra', 'agua', 'ar', 'fogo', 'luz', 'sombra']
  },

  tita: {
    id: 'tita',
    name: 'Titã',
    description: 'Guerreiros poderosos que dominam o campo de batalha através de força bruta, resistência e presença intimidadora. Cada Titã segue um Arquétipo de Força que define seu estilo de combate.',
    hitDie: 10,
    hitPointsPerLevel: 10,
    manaPointsBase: 0,
    manaPointsPerLevel: 0,
    skillChoices: 2,
    availableSkills: [
      'Atletismo',
      'Intimidação',
      'Medicina',
      'Percepção',
      'Sobrevivência',
      'Fortitude'
    ],
    subclasses: ['baluarte', 'furia-primal', 'quebra-montanhas']
  },

  sentinela: {
    id: 'sentinela',
    name: 'Sentinela',
    description: 'Especialistas em percepção, precisão e adaptação. Os Sentinelas são observadores natos que dominam tanto o combate à distância quanto a sobrevivência em ambientes hostis.',
    hitDie: 8,
    hitPointsPerLevel: 8,
    manaPointsBase: 0,
    manaPointsPerLevel: 0,
    skillChoices: 4,
    availableSkills: [
      'Acrobatismo',
      'Atletismo',
      'Furtividade',
      'Investigação',
      'Natureza',
      'Percepção',
      'Sobrevivência',
      'Rastreamento'
    ],
    subclasses: ['rastreador', 'lamina-crepusculo', 'olho-vigilante']
  },

  elo: {
    id: 'elo',
    name: 'Elo',
    description: 'Mestres da conexão humana, os Elos usam empatia, carisma e compreensão para influenciar, inspirar e unir pessoas. São líderes naturais e diplomatas habilidosos.',
    hitDie: 8,
    hitPointsPerLevel: 8,
    manaPointsBase: 5,
    manaPointsPerLevel: 3,
    skillChoices: 4,
    availableSkills: [
      'Atuação',
      'Enganação',
      'História',
      'Intuição',
      'Intimidação',
      'Investigação',
      'Persuasão',
      'Religião'
    ],
    subclasses: ['voz-harmonia', 'porta-voz-chama', 'guardiao-coracao']
  }
};

export const subclassData = {
  // Evocador - Caminhos Elementais
  terra: {
    name: 'Caminho da Terra',
    description: 'Conectados à estabilidade e resistência da terra',
    keyAttribute: 'constituicao',
    level1Ability: 'Pele de Pedra: +1 redução de dano físico'
  },
  agua: {
    name: 'Caminho da Água',
    description: 'Mestres da fluidez e adaptação',
    keyAttribute: 'sabedoria',
    level1Ability: 'Cura Menor: Recupera 1d4+SAB PV uma vez por descanso'
  },
  ar: {
    name: 'Caminho do Ar',
    description: 'Livres como o vento, rápidos como a tempestade',
    keyAttribute: 'destreza',
    level1Ability: 'Rajada: Empurra inimigos 1,5m como ação bônus'
  },
  fogo: {
    name: 'Caminho do Fogo',
    description: 'Portadores da chama primordial',
    keyAttribute: 'forca',
    level1Ability: 'Toque Flamejante: +1d4 dano de fogo em ataques corpo a corpo'
  },
  luz: {
    name: 'Caminho da Luz',
    description: 'Guardiões da clareza e esperança',
    keyAttribute: 'inteligencia',
    level1Ability: 'Chama Sagrada: Cria luz que cega inimigos por 1 turno'
  },
  sombra: {
    name: 'Caminho da Sombra',
    description: 'Mestres dos mistérios e da sutileza',
    keyAttribute: 'carisma',
    level1Ability: 'Manto Sombrio: Invisibilidade por 1 turno, 1x por descanso'
  },

  // Titã - Arquétipos de Força
  baluarte: {
    name: 'Baluarte',
    description: 'Defensor inabalável, protetor do grupo',
    passive: 'Presença Protetora: Aliados adjacentes recebem +1 CA',
    abilities: ['Escudo Humano', 'Muralha Viva', 'Guarda Incansável']
  },
  'furia-primal': {
    name: 'Fúria Primal',
    description: 'Guerreiro selvagem guiado por instintos',
    passive: 'Instinto de Batalha: +1 dano quando com menos de 50% PV',
    abilities: ['Rugido Intimidador', 'Golpe Selvagem', 'Berserker']
  },
  'quebra-montanhas': {
    name: 'Quebra-Montanhas',
    description: 'Destruidor de obstáculos e barreiras',
    passive: 'Força Bruta: Dobra capacidade de carga e destruição',
    abilities: ['Golpe Demolidor', 'Quebrar Defesas', 'Impacto Sísmico']
  },

  // Sentinela - Arquétipos de Vigilância
  rastreador: {
    name: 'Rastreador dos Ermos',
    description: 'Especialista em sobrevivência e rastreamento',
    passive: 'Sobrevivente Nato: +2 em testes de Sobrevivência e Natureza',
    abilities: ['Rastreamento Aprimorado', 'Camuflagem Natural', 'Tiro Certeiro']
  },
  'lamina-crepusculo': {
    name: 'Lâmina do Crepúsculo',
    description: 'Assassino silencioso da penumbra',
    passive: 'Ataque Furtivo: +1d6 dano em ataques surpresa',
    abilities: ['Golpe Sombrio', 'Movimento das Sombras', 'Ataque Letal']
  },
  'olho-vigilante': {
    name: 'Olho Vigilante',
    description: 'Analista tático e investigador',
    passive: 'Análise Tática: +2 em Percepção e Investigação',
    abilities: ['Avaliar Fraquezas', 'Coordenar Ataque', 'Insight Tático']
  },

  // Elo - Arquétipos de Ligação
  'voz-harmonia': {
    name: 'Voz da Harmonia',
    description: 'Diplomata e pacificador',
    abilities: ['Palavra Tranquilizadora', 'Mediar Conflito', 'Aura de Paz']
  },
  'porta-voz-chama': {
    name: 'Porta-Voz da Chama',
    description: 'Líder inspirador em combate',
    abilities: ['Grito de Guerra', 'Inspirar Coragem', 'Comando Tático']
  },
  'guardiao-coracao': {
    name: 'Guardião do Coração',
    description: 'Protetor empático e curador espiritual',
    abilities: ['Empatia Profunda', 'Escudo Emocional', 'Cura do Coração']
  }
}; 