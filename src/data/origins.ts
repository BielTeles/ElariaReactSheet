export interface OriginData {
  id: string;
  name: string;
  description: string;
  trainedSkills: [string, string];
  benefit: {
    name: string;
    description: string;
  };
}

export const origins: Record<string, OriginData> = {
  'sobrevivente-brasas': {
    id: 'sobrevivente-brasas',
    name: 'Sobrevivente do Círculo de Brasas',
    description: 'Você nasceu, cresceu ou passou uma parte significativa da sua vida nas terras áridas e perigosas do Círculo de Brasas. Aprendeu a suportar o calor implacável e navegar por paisagens vulcânicas.',
    trainedSkills: ['Fortitude', 'Sobrevivência'],
    benefit: {
      name: 'Tolerância Ígnea',
      description: 'Você recebe Resistência a Fogo 1 (sempre que sofrer dano de Fogo, reduza o dano em 1 ponto) e ignora os efeitos de calor extremo não mágico.'
    }
  },

  'guarda-harmonia': {
    id: 'guarda-harmonia',
    name: 'Guarda de Harmonia',
    description: 'Você serviu na guarda da cidade de Harmonia, a cosmopolita capital da Grande Aliança. Patrulhou as ruas, lidou com a diversidade de povos e investigou pequenos delitos.',
    trainedSkills: ['Percepção', 'Investigação'],
    benefit: {
      name: 'Conexão na Guarda',
      description: 'Uma vez por sessão, você pode contatar um membro da guarda para obter informações sobre assuntos locais, figuras importantes ou rumores.'
    }
  },

  'iniciado-florestas': {
    id: 'iniciado-florestas',
    name: 'Iniciado das Florestas',
    description: 'Você passou uma parte importante da sua vida imerso nos segredos das florestas antigas de Elaria, aprendendo a ler os sinais das árvores e seguir rastros.',
    trainedSkills: ['Natureza', 'Sobrevivência'],
    benefit: {
      name: 'Sintonia Natural',
      description: 'Uma vez por dia, pode passar um minuto em meditação para sentir o estado da vida selvagem num raio de 30 metros.'
    }
  },

  'erudito-biblioteca': {
    id: 'erudito-biblioteca',
    name: 'Erudito da Grande Biblioteca',
    description: 'Você dedicou uma parte significativa de sua vida aos estudos dentro dos muros da Grande Biblioteca de Elaria, em Harmonia, adquirindo vasto conhecimento teórico.',
    trainedSkills: ['Investigação', 'Conhecimento'],
    benefit: {
      name: 'Conhecimento Enciclopédico',
      description: 'Uma vez por sessão, pode declarar que pesquisou sobre um tópico e fazer teste de Investigação para lembrar informação útil sobre ele.'
    }
  },

  'artista-itinerante': {
    id: 'artista-itinerante',
    name: 'Artista Itinerante',
    description: 'Sua vida era a estrada, a taverna, o palco improvisado. Você viajou por Elaria como músico, contador de histórias, ator ou outro tipo de artista.',
    trainedSkills: ['Atuação', 'Enganação'],
    benefit: {
      name: 'Performance Cativante',
      description: 'Uma vez por dia, ao realizar uma performance artística por 1 minuto para audiência de pelo menos 5 criaturas, pode influenciar humor geral ou criar distração.'
    }
  },

  'veterano-guerras': {
    id: 'veterano-guerras',
    name: 'Veterano das Guerras',
    description: 'Antes da paz da Grande Aliança, você lutou. Seja como soldado, mercenário ou miliciano, você conheceu o clangor do aço e a estratégia do campo de batalha.',
    trainedSkills: ['Luta', 'Fortitude'],
    benefit: {
      name: 'Instinto de Batalha',
      description: 'Pode gastar 1 PM para ganhar vantagem em jogada de ataque ou teste de Iniciativa. Usos por dia igual ao modificador de Constituição (mínimo 1).'
    }
  }
}; 