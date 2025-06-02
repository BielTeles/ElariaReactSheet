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
    description: 'Você nasceu, cresceu ou passou uma parte significativa da sua vida nas terras áridas e perigosas do Círculo de Brasas, a região dominada pelo Fogo no sul de Serathis. Aprendeu a suportar o calor implacável, navegar por paisagens vulcânicas e respeitar o poder bruto do elemento Fogo.',
    trainedSkills: ['Fortitude', 'Sobrevivência'],
    benefit: {
      name: 'Tolerância Ígnea',
      description: 'Você recebe Resistência a Fogo 1 (sempre que sofrer dano de Fogo, reduza o dano em 1 ponto) e ignora os efeitos de calor extremo não mágico (como em desertos ou perto de lava).'
    }
  },

  'guarda-harmonia': {
    id: 'guarda-harmonia',
    name: 'Guarda de Harmonia',
    description: 'Você serviu na guarda da cidade de Harmonia, a cosmopolita capital da Grande Aliança. Patrulhou as ruas movimentadas, lidou com a incrível diversidade de povos e culturas, investigou pequenos delitos e ajudou a manter a paz durante festivais ou eventos diplomáticos.',
    trainedSkills: ['Percepção', 'Investigação'],
    benefit: {
      name: 'Conexão na Guarda',
      description: 'Você ainda mantém contato com um membro da guarda de Harmonia. Uma vez por sessão de jogo, você pode tentar contatar essa pessoa para obter informações sobre assuntos locais, figuras importantes ou rumores que circulam nos quartéis ou nas ruas.'
    }
  },

  'iniciado-florestas': {
    id: 'iniciado-florestas',
    name: 'Iniciado das Florestas',
    description: 'Você passou uma parte importante da sua vida imerso nos segredos das florestas antigas de Elaria, talvez sob a tutela de um eremita Alari, de espíritos da natureza ou simplesmente aprendendo pela observação e sobrevivência. Aprendeu a ler os sinais das árvores, seguir rastros e sentir a pulsação da vida selvagem.',
    trainedSkills: ['Sobrevivência', 'Intuição'],
    benefit: {
      name: 'Sintonia Natural',
      description: 'Você possui uma ligação empática com o ambiente natural. Uma vez por dia, você pode passar um minuto em meditação silenciosa para sentir o estado geral da vida selvagem (vegetal e animal) num raio de 30 metros: se está calma, agitada, saudável, doente ou perturbada por alguma influência não natural.'
    }
  },

  'erudito-biblioteca': {
    id: 'erudito-biblioteca',
    name: 'Erudito da Grande Biblioteca',
    description: 'Você dedicou uma parte significativa de sua vida aos estudos dentro dos muros da Grande Biblioteca de Elaria, em Harmonia. Seja como estudante formal, assistente de pesquisador ou autodidata, você adquiriu vasto conhecimento teórico sobre história, culturas, magia ou outros assuntos.',
    trainedSkills: ['Investigação', 'Conhecimento'],
    benefit: {
      name: 'Conhecimento Enciclopédico',
      description: 'Uma vez por sessão de jogo, você pode declarar que pesquisou extensivamente sobre um tópico específico encontrado durante a aventura. Faça um teste de Inteligência (Investigação): Sucesso Normal para tópicos comuns, Bom para raros, Extremo para muito obscuros. Se passar, você se lembra de informação útil sobre o tópico.'
    }
  },

  'artista-itinerante': {
    id: 'artista-itinerante',
    name: 'Artista Itinerante',
    description: 'Sua vida era a estrada, a taverna, o palco improvisado na praça da vila. Você viajou por Elaria como músico, contador de histórias, ator, dançarino ou outro tipo de artista, vivendo de sua habilidade de entreter, encantar ou talvez enganar plateias.',
    trainedSkills: ['Atuação', 'Enganação'],
    benefit: {
      name: 'Performance Cativante',
      description: 'Uma vez por dia, ao realizar uma performance artística por pelo menos 1 minuto para uma audiência de pelo menos 5 criaturas, faça um teste de Carisma (Atuação). Com Sucesso Normal, você prende a atenção da maioria dos presentes. Com Sucesso Bom ou Extremo, pode influenciar sutilmente o humor geral ou criar uma distração eficaz.'
    }
  },

  'veterano-guerras': {
    id: 'veterano-guerras',
    name: 'Veterano das Guerras',
    description: 'Antes da paz da Grande Aliança ser estabelecida, você lutou. Seja como soldado de um dos reinos emergentes, mercenário buscando fortuna, membro de uma milícia defendendo sua vila ou batedor em território inimigo, você conheceu o clangor do aço, a estratégia do campo de batalha e a dura realidade da guerra.',
    trainedSkills: ['Atletismo', 'Fortitude'],
    benefit: {
      name: 'Instinto de Batalha',
      description: 'A experiência em combate real afiou seus reflexos. Você pode gastar 1 PM para ganhar vantagem em uma jogada de ataque ou em um teste de Iniciativa. Você pode usar este benefício um número de vezes por dia igual ao seu modificador de Constituição (mínimo 1).'
    }
  }
}; 