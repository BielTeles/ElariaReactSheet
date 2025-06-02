import { ClassData, SubclassData } from '../types/character';

export const classes: Record<string, ClassData> = {
  evocador: {
    id: 'evocador',
    name: 'Evocador',
    description: 'Estudioso e praticante das artes elementais, aprendendo a sentir, chamar e moldar as energias primordiais de Elaria. Busca sintonia profunda com um dos seis elementos fundamentais.',
    hitDie: 8,
    hitPointsPerLevel: 4,
    manaPointsBase: 6,
    manaPointsPerLevel: 4,
    keyAttribute: 'sabedoria', // Base, alterado por caminho elemental
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

  titã: {
    id: 'titã',
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
      'Corpo-a-Corpo',
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
    keyAttribute: 'sabedoria', // Base, alterado por arquétipo
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
      'Iniciativa',
      'Percepção' // Adicionada conforme o livro
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

export const subclassData: Record<string, SubclassData> = {
  // Evocador - Caminhos Elementais
  terra: {
    name: 'Caminho da Terra',
    description: 'Canalizadores do poder bruto e estável do elemento Terra. Inspirados na Resiliência Eterna de Terrus. Usam Sabedoria para conectar-se profundamente com o solo.',
    keyAttribute: 'sabedoria',
    level1Ability: 'Sintonia Reforçada (Terra): +1 RD contra dano; Sentido Sísmico (detecta criaturas no solo até 9m)',
    abilities: ['Postura Inabalável', 'Abraço da Terra', 'Moldar Abrigo']
  },
  agua: {
    name: 'Caminho da Água',
    description: 'Mestres da fluidez, adaptabilidade e poder restaurador. Ligados à Ondina. Usam Sabedoria para sentir os ciclos da vida e empatia das correntes.',
    keyAttribute: 'sabedoria',
    level1Ability: 'Sintonia Reforçada (Água): Prender respiração 5min, vantagem Atletismo (Nadar); Sentir a Água (detecta movimento aquático)',
    abilities: ['Forma Fluida', 'Projétil de Água', 'Pulso Restaurador']
  },
  ar: {
    name: 'Caminho do Ar',
    description: 'Mestres da liberdade e movimento. Ligados a Zephyrus. Usam Inteligência para controlar ventos e correntes através de foco mental preciso.',
    keyAttribute: 'inteligencia',
    level1Ability: 'Sintonia Reforçada (Ar): +1,5m deslocamento base; Sentir a Brisa (vantagem detectar voo/invisíveis)',
    abilities: ['Corrente Ascendente', 'Sopro Desestabilizador', 'Manto de Vento']
  },
  fogo: {
    name: 'Caminho do Fogo',
    description: 'Mestres da energia primordial da paixão e transformação. Ligados a Ignis. Usam Inteligência para disciplinar e controlar a chama interior.',
    keyAttribute: 'inteligencia',
    level1Ability: 'Sintonia Reforçada (Fogo): Resistência a Fogo; Coração Ardente (vantagem vs Amedrontado)',
    abilities: ['Combustão Controlada', 'Alimentar as Chamas', 'Marca Incinerante']
  },
  luz: {
    name: 'Caminho da Luz',
    description: 'Faróis de esperança, cura e revelação. Ligados a Lumina. Usam Sabedoria para canalizar convicção e buscar verdade com clareza serena.',
    keyAttribute: 'sabedoria',
    level1Ability: 'Sintonia Reforçada (Luz): Vantagem Intuição vs mentiras; Presença Serena (aliados +vantagem vs Medo)',
    abilities: ['Bálsamo de Luz', 'Luz Reveladora', 'Seta Luminosa']
  },
  sombra: {
    name: 'Caminho da Sombra',
    description: 'Mestres dos mistérios e do oculto. Ligados a Noctus. Usam Inteligência para controle mental preciso e percepção aguçada do escondido.',
    keyAttribute: 'inteligencia',
    level1Ability: 'Sintonia Reforçada (Sombra): Vantagem Furtividade na penumbra; Mente Quieta (vantagem vs leitura mental)',
    abilities: ['Véu de Engano', 'Toque Debilitante', 'Passo Sombrio']
  },

  // Titã - Arquétipos de Força
  baluarte: {
    name: 'Baluarte',
    description: 'Personificação da muralha intransponível, escudo inabalável que protege os mais fracos e sustenta a linha de frente.',
    passive: 'Presença Protetora: Aliados adjacentes recebem +1 RD contra ataques corpo a corpo (enquanto consciente e adjacente)',
    abilities: ['Postura Defensiva', 'Proteger Aliado', 'Escudo Ecoante', 'Ancorar Posição']
  },
  'furia-primal': {
    name: 'Fúria Primal',
    description: 'Abraça a Vontade Indomável em forma crua e explosiva, canalizando emoções intensas em poder físico avassalador.',
    passive: 'Ímpeto Selvagem: +1,5m movimento com metade PV; recupera 2V ao zerar inimigo',
    abilities: ['Golpe Furioso', 'Grito de Guerra', 'Ignorar a Dor', 'Avanço Implacável']
  },
  'quebra-montanhas': {
    name: 'Quebra-Montanhas',
    description: 'Foca imensa força na aplicação de poder bruto para superar obstáculos físicos e destruir defesas inimigas.',
    level1Ability: 'Golpe Destruidor: Ao acertar ataque corpo a corpo com arma pesada (duas mãos), ignora 1 ponto de RD do alvo',
    abilities: ['Quebrar Escudo', 'Firmeza da Montanha', 'Impacto Arrasador', 'Rompante Poderoso']
  },

  // Sentinela - Arquétipos de Vigilância  
  rastreador: {
    name: 'Rastreador dos Ermos',
    description: 'Aprimora sua conexão com o mundo natural, tornando-se mestre da sobrevivência, caça e perseguição em ambientes selvagens.',
    keyAttribute: 'sabedoria',
    passive: 'Passo Leve na Mata: Ignora terreno difícil natural; treinamento em Sobrevivência',
    abilities: ['Marca do Caçador', 'Disparo Preciso', 'Armadilha Improvisada', 'Companheiro Animal (Elo Menor)']
  },
  'lamina-crepusculo': {
    name: 'Lâmina do Crepúsculo',
    description: 'Utiliza furtividade, agilidade e surpresa como principais armas. Mestre da infiltração e combate rápido e preciso.',
    keyAttribute: 'destreza',
    passive: 'Dança das Sombras: +1,5m movimento em penumbra/escuridão; treinamento Furtividade',
    abilities: ['Golpe Desorientador', 'Passo Fantasma', 'Ataque Furtivo', 'Visão Crepuscular']
  },
  'olho-vigilante': {
    name: 'Olho Vigilante',
    description: 'Aprimora ao máximo suas capacidades analíticas e perceptivas, transformando a Inteligência em ferramenta de investigação e tática.',
    keyAttribute: 'inteligencia',
    passive: 'Análise Tática: Treinamento Investigação; INT para Iniciativa',
    abilities: ['Estudar Oponente', 'Antecipar Movimento', 'Ponto Fraco', 'Leitura Rápida']
  },

  // Elo - Arquétipos de Ligação
  'voz-harmonia': {
    name: 'Voz da Harmonia',
    description: 'Diplomata e pacificador que foca seu poder na resolução pacífica de conflitos, usando empatia e palavra para tecer acordos.',
    passive: 'Aura Pacificadora: Criaturas hostis que começam turno adjacentes sofrem 1 dado de desvantagem no primeiro ataque (se você não agiu hostilmente)',
    abilities: ['Palavra Calmante', 'Negociação Persuasiva', 'Elo Empático (Sentir Verdade)', 'Discurso Conciliador']
  },
  'porta-voz-chama': {
    name: 'Porta-Voz da Chama',
    description: 'Canaliza a Chama Interior para inspirar coragem, liderança e ação, especialmente no calor da batalha.',
    passive: 'Foco na Performance: Treinamento em Atuação; pode usar Atuação para inspirar multidões (Diplomacia) ou incitar ação (Intimidação)',
    abilities: ['Comando de Batalha', 'Grito Motivador', 'Performance Revigorante', 'Elo Protetor (Aura)']
  },
  'guardiao-coracao': {
    name: 'Guardião do Coração',
    description: 'Protetor empático e curador espiritual que foca nas necessidades emocionais e físicas dos outros.',
    passive: 'Escudo Empático: Treinamento em Cura; você e aliados até 1,5m recebem +1 em Vontade contra medo/desespero',
    abilities: ['Toque Restaurador Aprimorado', 'Vínculo Protetor', 'Palavras de Conforto', 'Detectar Dor/Aflição']
  }
}; 