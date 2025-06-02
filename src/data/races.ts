import { RaceData } from '../types/character';

export const races: Record<string, RaceData> = {
  alari: {
    id: 'alari',
    name: 'Alari',
    description: 'Ligados ao elemento Terra, os Alari são conhecidos por sua resistência, paciência e conexão profunda com a natureza. Têm pele terrosa, olhos dourados e uma constituição robusta.',
    attributeBonus: 'constituicao',
    bonusValue: 2,
    baseMovement: 9,
    traits: [
      'Resistência Natural: +1 bônus em testes de Fortitude',
      'Conexão Telúrica: Sentem vibrações no solo em um raio de 3 metros',
      'Tolerância: Não são afetados por condições climáticas adversas naturais'
    ],
    patron: 'Terrus, o Guardião dos Solos'
  },
  
  roknar: {
    id: 'roknar',
    name: 'Roknar',
    description: 'Conectados ao elemento Fogo, os Roknar possuem temperamento forte, paixão ardente e grande força física. Têm pele avermelhada, cabelos escuros e olhos como brasas.',
    attributeBonus: 'forca',
    bonusValue: 2,
    baseMovement: 9,
    traits: [
      'Fúria Ancestral: Uma vez por dia, podem entrar em fúria (+2 em Força por 1 minuto)',
      'Resistência ao Calor: Imunes a efeitos de calor natural',
      'Pele Resistente: Redução de 1 ponto em dano físico (mínimo 1)'
    ],
    patron: 'Ignis, a Primeira Chama'
  },
  
  kain: {
    id: 'kain',
    name: 'Kain',
    description: 'Mestres da Água, os Kain são adaptáveis, empáticos e fluidos em seus movimentos. Possuem tons azulados na pele, cabelos que parecem ondular e grande intuição.',
    attributeBonus: 'sabedoria',
    bonusValue: 2,
    baseMovement: 9,
    traits: [
      'Respiração Aquática: Podem respirar debaixo d\'água',
      'Natação Natural: Velocidade de natação igual ao deslocamento terrestre',
      'Empatia Aquática: +2 em testes sociais com criaturas aquáticas'
    ],
    patron: 'Ondina, a Mãe das Águas'
  },
  
  faelan: {
    id: 'faelan',
    name: 'Faelan',
    description: 'Conectados ao Ar, os Faelan são ágeis, curiosos e livres como o vento. Têm compleição delgada, cabelos claros que parecem flutuar e movimentos graciosos.',
    attributeBonus: 'destreza',
    bonusValue: 2,
    baseMovement: 12,
    traits: [
      'Agilidade Aérea: +3 metros de deslocamento base',
      'Queda Suave: Reduzem dano de queda pela metade',
      'Sentidos Aguçados: +1 bônus em testes de Percepção'
    ],
    patron: 'Zephyrus, o Senhor dos Ventos'
  },
  
  celeres: {
    id: 'celeres',
    name: 'Celeres',
    description: 'Rápidos e adaptativos, os Celeres são mestres da velocidade e da precisão. Possuem traços felinos, reflexos apurados e grande destreza manual.',
    attributeBonus: 'destreza',
    bonusValue: 1,
    baseMovement: 12,
    traits: [
      'Velocidade Felina: +3 metros de deslocamento',
      'Reflexos Apurados: +1 bônus em Iniciativa',
      'Escalada Natural: Velocidade de escalada igual à metade do deslocamento',
      'Bônus adicional: +1 em Constituição'
    ]
  },
  
  aurien: {
    id: 'aurien',
    name: 'Aurien',
    description: 'Ligados à Luz, os Aurien irradiam sabedoria e serenidade. Têm pele dourada, cabelos luminosos e olhos que brilham com luz própria.',
    attributeBonus: 'inteligencia',
    bonusValue: 2,
    baseMovement: 9,
    traits: [
      'Aura Luminosa: Podem gerar luz suave em um raio de 3 metros',
      'Resistência à Escuridão: Imunes a efeitos de medo causados por trevas',
      'Conhecimento Ancestral: +1 perícia adicional à escolha no nível 1'
    ],
    patron: 'Lumina, a Senhora da Aurora'
  },
  
  vesperi: {
    id: 'vesperi',
    name: 'Vesperi',
    description: 'Conectados às Sombras, os Vesperi são misteriosos, perspicazes e habilidosos. Têm pele pálida, cabelos escuros e olhos profundos como a noite.',
    attributeBonus: 'carisma',
    bonusValue: 2,
    baseMovement: 9,
    traits: [
      'Visão nas Trevas: Podem ver no escuro até 18 metros',
      'Furtividade Natural: +2 bônus em testes de Furtividade',
      'Resistência Mental: +1 bônus em testes contra efeitos mentais'
    ],
    patron: 'Noctus, o Guardião das Sombras'
  }
}; 