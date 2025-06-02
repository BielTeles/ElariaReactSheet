import { RaceData } from '../types/character';

export const races: Record<string, RaceData> = {
  alari: {
    id: 'alari',
    name: 'Alari',
    description: 'Descendentes míticos de Terrus, o Guardião dos Solos, os Alari foram os primeiros entre os povos sencientes a despertar em Elaria. Sua longa existência reflete a Resiliência Eterna, manifestando forte conexão com a natureza através do Sentir Profundo.',
    attributeBonus: 'sabedoria',
    bonusValue: 1,
    baseMovement: 12,
    traits: [
      'Herança de Terrus: +1 ponto de mana (PM) por nível e treinamento em Conhecimento (Natureza)',
      'Sintonia Ambiental: Dificuldade para descansar completamente em ambientes urbanos densos'
    ],
    patron: 'Terrus, o Guardião dos Solos'
  },
  
  roknar: {
    id: 'roknar',
    name: 'Roknar',
    description: 'Filhos míticos de Ignis, a Primeira Chama, os Roknar foram moldados pelo fogo e pela rocha nas profundezas das montanhas vulcânicas. Manifestam a Resiliência Eterna e a Vontade Indomável, sendo mestres da forja e engenharia.',
    attributeBonus: 'constituicao',
    bonusValue: 1,
    baseMovement: 6,
    traits: [
      'Duro como Pedra: +3 pontos de vida no 1º nível e +1 ponto de vida por nível seguinte',
      'Vida Soterrada: Visão no escuro e +1 em testes de Sobrevivência no subterrâneo',
      'Passos Pesados: Deslocamento limitado a 6 metros devido ao tamanho e pernas curtas'
    ],
    patron: 'Ignis, a Primeira Chama'
  },
  
  kain: {
    id: 'kain',
    name: 'Kain',
    description: 'A raça mais difundida e enigmática de Elaria, os Kain manifestam um equilíbrio dinâmico de todas as seis Essências. São incrivelmente adaptáveis, resilientes e movidos por ambição, refletindo sua origem multifacetada.',
    attributeBonus: 'escolha',
    bonusValue: 1,
    baseMovement: 9,
    traits: [
      'Versátil: Treinamento em duas perícias à escolha (não precisam ser da classe)',
      'Potencial: Escolha uma arma específica e receba +1 em rolagens de dano com ela'
    ],
    patron: 'Nenhum/Todos - Origem Multifacetada'
  },
  
  faelan: {
    id: 'faelan',
    name: 'Faelan',
    description: 'Filhos esquivos de Zephyrus, o Senhor dos Ventos, os Faelan possuem compleição esguia e traços distintamente felinos. Carregam o Fluxo Incessante em sua agilidade e o Olhar Penetrante em seus sentidos aguçados.',
    attributeBonus: 'destreza',
    bonusValue: 1,
    baseMovement: 9,
    traits: [
      'Olhos Felinos: Visão na penumbra, mas 1 dado de desvantagem com luz intensa direta',
      'Camuflagem Natural: Treinamento nas perícias Furtividade e Percepção'
    ],
    patron: 'Zephyrus, o Senhor dos Ventos'
  },
  
  celeres: {
    id: 'celeres',
    name: 'Celeres',
    description: 'Povo veloz e perceptivo ligado à Ondina, a Mãe das Águas. Possuem traços que lembram lebres, com orelhas longas e expressivas. Manifestam o Sentir Profundo através de intuição social e o Fluxo Incessante em sua rapidez.',
    attributeBonus: 'carisma',
    bonusValue: 1,
    baseMovement: 12,
    traits: [
      'Orelhas Atentas: Treinamento nas perícias Diplomacia e Intuição',
      'Salto Ágil: Pode gastar 1 PM para ignorar penalidades de terreno difícil por 1 turno',
      'Instinto de Presa: 1 dado de desvantagem em Diplomacia inicial com predadores naturais'
    ],
    patron: 'Ondina, a Mãe das Águas'
  },
  
  aurien: {
    id: 'aurien',
    name: 'Aurien',
    description: 'Filhos de Lumina, a Guardiã da Aurora, elevados nas terras banhadas pela luz intensa. Carregam a Chama Interior em sua convicção e a clareza do Olhar Penetrante em sua busca pela verdade e conhecimento.',
    attributeBonus: 'inteligencia',
    bonusValue: 1,
    baseMovement: 9,
    traits: [
      'Visão da Verdade: Vantagem em testes de Intuição para discernir mentiras e resistência contra Ilusões',
      'Filho da Luz: Conhece e pode conjurar Luz à vontade'
    ],
    patron: 'Lumina, a Guardiã da Aurora'
  },
  
  vesperi: {
    id: 'vesperi',
    name: 'Vesperi',
    description: 'Povo enigmático associado a Noctus, o Sábio das Sombras, elevados nas regiões de crepúsculo. São introspectivos, conhecidos por sua calma e afinidade com segredos, manifestando o Sentir Profundo e Olhar Penetrante únicos.',
    attributeBonus: 'sabedoria',
    bonusValue: 1,
    baseMovement: 9,
    traits: [
      'Visão no Escuro: Enxerga na penumbra até 18m como luz plena, no escuro como penumbra',
      'Manto das Sombras: Pode se esconder em penumbra; vantagem em Furtividade em baixa luz',
      'Mente Serena: Vantagem em testes de resistência contra efeitos de Amedrontado'
    ],
    patron: 'Noctus, o Sábio das Sombras'
  }
}; 