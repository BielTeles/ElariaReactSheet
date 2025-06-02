import { ClassData } from '../types/character';

export const classes: Record<string, ClassData> = {
  evocador: {
    id: 'evocador',
    name: 'Evocador',
    description: 'Estudioso e praticante das artes elementais, aprendendo a sentir, chamar e moldar as energias primordiais de Elaria. Busca sintonia profunda com um dos seis elementos fundamentais.',
    hitDie: 8,
    hitPointsPerLevel: 4,
    manaPointsBase: 6,
    manaPointsPerLevel: 4,
    skillChoices: 3,
    availableSkills: [
      'Misticismo',
      'Intuição',
      'Percepção',
      'Sobrevivência',
      'Vontade',
      'Investigação'
    ],
    subclasses: ['terra', 'agua', 'ar', 'fogo', 'luz', 'sombra']
  },

  tita: {
    id: 'tita',
    name: 'Titã',
    description: 'Personificação do poder primordial que reside no âmago de todos os seres: a pura força física e capacidade de resistir. Manifestação ambulante da Vontade Indomável e Resiliência Eterna.',
    hitDie: 12,
    hitPointsPerLevel: 6,
    manaPointsBase: 0,
    manaPointsPerLevel: 0,
    vigorBase: 1, // Vigor = 1 + Constituição
    skillChoices: 3,
    availableSkills: [
      'Atletismo',
      'Fortitude',
      'Intimidação',
      'Luta',
      'Percepção',
      'Sobrevivência'
    ],
    subclasses: ['baluarte', 'furia-primal', 'quebra-montanhas']
  },

  sentinela: {
    id: 'sentinela',
    name: 'Sentinela',
    description: 'Mestre da percepção, adaptação e precisão. Opera nas fronteiras confiando em habilidades aguçadas, conhecimento do terreno e ataques certeiros para superar desafios.',
    hitDie: 8,
    hitPointsPerLevel: 4,
    manaPointsBase: 4,
    manaPointsPerLevel: 2,
    keyAttribute: 'sabedoria', // Base, pode ser alterado por arquétipo
    skillChoices: 4,
    availableSkills: [
      'Furtividade',
      'Sobrevivência', 
      'Investigação',
      'Intuição',
      'Acrobatismo',
      'Atletismo',
      'Reflexos',
      'Ladinagem',
      'Iniciativa'
    ],
    subclasses: ['rastreador', 'lamina-crepusculo', 'olho-vigilante']
  },

  elo: {
    id: 'elo',
    name: 'Elo',
    description: 'Mestre da conexão, influência e empatia, canalizando a Chama Interior e o Sentir Profundo. Poder reside na capacidade de entender, inspirar, proteger e guiar outros.',
    hitDie: 8,
    hitPointsPerLevel: 2,
    manaPointsBase: 6,
    manaPointsPerLevel: 4,
    keyAttribute: 'carisma',
    skillChoices: 4,
    availableSkills: [
      'Diplomacia',
      'Enganação',
      'Intuição',
      'Atuação',
      'Cura',
      'Religião',
      'Vontade',
      'Percepção'
    ],
    subclasses: ['voz-harmonia', 'porta-voz-chama', 'guardiao-coracao']
  }
};

export const subclassData = {
  // Evocador - Caminhos Elementais
  terra: {
    name: 'Caminho da Terra',
    description: 'Canalizadores do poder bruto e estável do elemento Terra. Inspirados na Resiliência Eterna de Terrus.',
    keyAttribute: 'sabedoria',
    level1Ability: 'Sintonia Reforçada (Terra): +1 RD contra dano; Manifestações da Terra (2 escolhas); Sentido Sísmico'
  },
  agua: {
    name: 'Caminho da Água',
    description: 'Mestres da fluidez, adaptabilidade e poder restaurador do elemento Água. Ligados à Ondina.',
    keyAttribute: 'sabedoria',
    level1Ability: 'Sintonia Reforçada (Água): Prender respiração por 5min, vantagem em Atletismo (Nadar)'
  },
  ar: {
    name: 'Caminho do Ar',
    description: 'Domínio sobre os ventos e tempestades, movimento e liberdade.',
    keyAttribute: 'inteligencia',
    level1Ability: 'Sintonia Reforçada (Ar): Manifestações específicas do elemento Ar'
  },
  fogo: {
    name: 'Caminho do Fogo',
    description: 'Mestres da chama primordial e energia destrutiva.',
    keyAttribute: 'inteligencia',
    level1Ability: 'Sintonia Reforçada (Fogo): Manifestações específicas do elemento Fogo'
  },
  luz: {
    name: 'Caminho da Luz',
    description: 'Guardiões da clareza, revelação e proteção.',
    keyAttribute: 'sabedoria',
    level1Ability: 'Sintonia Reforçada (Luz): Manifestações específicas do elemento Luz'
  },
  sombra: {
    name: 'Caminho da Sombra',
    description: 'Mestres dos mistérios, sutileza e poder das trevas.',
    keyAttribute: 'inteligencia',
    level1Ability: 'Sintonia Reforçada (Sombra): Manifestações específicas do elemento Sombra'
  },

  // Titã - Arquétipos de Força
  baluarte: {
    name: 'Baluarte',
    description: 'Personificação da muralha intransponível, escudo inabalável que protege os mais fracos.',
    passive: 'Presença Protetora: Aliados adjacentes recebem +1 RD contra ataques corpo a corpo',
    abilities: ['Postura Defensiva', 'Proteger Aliado', 'Escudo Ecoante', 'Ancorar Posição']
  },
  'furia-primal': {
    name: 'Fúria Primal',
    description: 'Abraça a Vontade Indomável em forma crua e explosiva. Canaliza emoções intensas em poder físico.',
    passive: 'Ímpeto Selvagem: +1,5m movimento com metade PV; recupera 2V ao zerar inimigo',
    abilities: ['Golpe Furioso', 'Grito de Guerra', 'Ignorar a Dor', 'Avanço Implacável']
  },
  'quebra-montanhas': {
    name: 'Quebra-Montanhas',
    description: 'Especialista em força aplicada e destruição controlada.',
    passive: 'Força Demolidora: Capacidades especiais de destruição',
    abilities: ['Golpe Demolidor', 'Quebrar Defesas', 'Impacto Sísmico', 'Força Bruta']
  },

  // Sentinela - Arquétipos de Vigilância
  rastreador: {
    name: 'Rastreador dos Ermos',
    description: 'Mestre da sobrevivência, caça e perseguição em ambientes selvagens.',
    keyAttribute: 'sabedoria',
    passive: 'Passo Leve na Mata: Ignora terreno difícil natural; treinamento em Sobrevivência',
    abilities: ['Marca do Caçador', 'Disparo Preciso', 'Armadilha Improvisada', 'Companheiro Animal']
  },
  'lamina-crepusculo': {
    name: 'Lâmina do Crepúsculo',
    description: 'Utiliza furtividade, agilidade e surpresa. Mestre da infiltração e combate rápido.',
    keyAttribute: 'destreza',
    passive: 'Dança das Sombras: +1,5m movimento em penumbra/escuridão; treinamento Furtividade',
    abilities: ['Golpe Desorientador', 'Passo Fantasma', 'Ataque Furtivo', 'Visão Crepuscular']
  },
  'olho-vigilante': {
    name: 'Olho Vigilante',
    description: 'Aprimora capacidades analíticas e perceptivas. Mestre da investigação e tática.',
    keyAttribute: 'inteligencia',
    passive: 'Análise Tática: Treinamento Investigação; INT para Iniciativa',
    abilities: ['Estudar Oponente', 'Antecipar Movimento', 'Ponto Fraco', 'Leitura Rápida']
  },

  // Elo - Arquétipos de Ligação
  'voz-harmonia': {
    name: 'Voz da Harmonia',
    description: 'Diplomata e pacificador, mestre da resolução de conflitos.',
    abilities: ['Palavra Tranquilizadora', 'Mediar Conflito', 'Aura de Paz', 'Harmonia Empática']
  },
  'porta-voz-chama': {
    name: 'Porta-Voz da Chama',
    description: 'Canaliza a Chama Interior para inspirar coragem, liderança e ação.',
    abilities: ['Grito de Guerra', 'Inspirar Coragem', 'Comando Tático', 'Chama Motivadora']
  },
  'guardiao-coracao': {
    name: 'Guardião do Coração',
    description: 'Protetor empático e curador espiritual, conecta-se profundamente com emoções.',
    abilities: ['Empatia Profunda', 'Escudo Emocional', 'Cura do Coração', 'Vínculo Protetor']
  }
}; 