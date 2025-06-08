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
    description: 'Você nasceu, cresceu ou passou uma parte significativa da sua vida nas terras áridas e perigosas do Círculo de Brasas, a região dominada pelo Fogo no sul de Serathis. Você aprendeu a suportar o calor implacável, a navegar por paisagens vulcânicas e a respeitar (ou temer) o poder bruto do elemento Fogo e das criaturas que lá habitam.',
    trainedSkills: ['Fortitude', 'Sobrevivência'],
    benefit: {
      name: 'Tolerância Ígnea',
      description: 'Sua exposição prolongada ao calor extremo o tornou resistente. Você recebe Resistência a Fogo 1 (sempre que sofrer dano de Fogo, reduza o dano em 1 ponto) e ignora os efeitos de calor extremo não mágico (como em desertos ou perto de lava).'
    }
  },

  'guarda-harmonia': {
    id: 'guarda-harmonia',
    name: 'Guarda de Harmonia',
    description: 'Você serviu na guarda da cidade de Harmonia, a cosmopolita capital da Grande Aliança. Patrulhou as ruas movimentadas, lidou com a incrível diversidade de povos e culturas que lá coexistem, investigou pequenos delitos e talvez tenha ajudado a manter a paz durante festivais ou eventos diplomáticos.',
    trainedSkills: ['Percepção', 'Investigação'],
    benefit: {
      name: 'Conexão na Guarda',
      description: 'Você ainda mantém contato com um membro (ou ex-membro) da guarda de Harmonia (ou outra cidade grande, a definir com o Mestre). Uma vez por sessão de jogo, você pode tentar contatar essa pessoa para obter informações sobre assuntos locais, figuras importantes ou rumores que circulam nos quartéis ou nas ruas.'
    }
  },

  'iniciado-florestas': {
    id: 'iniciado-florestas',
    name: 'Iniciado das Florestas',
    description: 'Você passou uma parte importante da sua vida imerso nos segredos das florestas antigas de Elaria, talvez sob a tutela de um eremita Alari, de espíritos da natureza ou simplesmente aprendendo pela observação e sobrevivência. Você aprendeu a ler os sinais das árvores, a seguir rastros que outros não veem e a sentir a pulsação da vida selvagem.',
    trainedSkills: ['Conhecimento', 'Sobrevivência'],
    benefit: {
      name: 'Sintonia Natural',
      description: 'Você possui uma ligação empática com o ambiente natural ao seu redor. Uma vez por dia, você pode passar um minuto em meditação silenciosa (requer concentração leve) para sentir o estado geral da vida selvagem (vegetal e animal) num raio de 30 metros: se está calma, agitada (medo/alerta), saudável, doente ou perturbada por alguma influência não natural.'
    }
  },

  'erudito-biblioteca': {
    id: 'erudito-biblioteca',
    name: 'Erudito da Grande Biblioteca',
    description: 'Você dedicou uma parte significativa de sua vida aos estudos dentro dos muros da Grande Biblioteca de Elaria, em Harmonia. Seja como um estudante formal, um assistente de pesquisador ou um simples autodidata que passava os dias entre os tomos, você adquiriu um vasto conhecimento teórico sobre história, culturas, magia ou outros assuntos.',
    trainedSkills: ['Investigação', 'Conhecimento'],
    benefit: {
      name: 'Conhecimento Enciclopédico',
      description: 'Uma vez por sessão de jogo, você pode declarar que seu personagem pesquisou extensivamente sobre um tópico específico encontrado durante a aventura (uma criatura rara, um símbolo antigo, um evento histórico obscuro). Faça um teste de Inteligência (Investigação) com um Grau de Sucesso definido pelo Mestre baseado na obscuridade do tópico (Normal para comum, Bom para raro, Extremo para muito obscuro). Se passar, você se lembra de uma informação útil e relevante sobre o tópico.'
    }
  },

  'artista-itinerante': {
    id: 'artista-itinerante',
    name: 'Artista Itinerante',
    description: 'Sua vida era a estrada, a taverna, o palco improvisado na praça da vila. Você viajou por Elaria como músico, contador de histórias, ator, dançarino ou outro tipo de artista, vivendo de sua habilidade de entreter, encantar ou talvez enganar plateias. Você conhece canções e contos de diversas terras, sabe como ler um público e como usar seu carisma para conseguir uma refeição quente ou um lugar seguro para dormir.',
    trainedSkills: ['Atuação', 'Enganação'],
    benefit: {
      name: 'Performance Cativante',
      description: 'Uma vez por dia, ao realizar uma performance artística (cantar, tocar, contar história, etc.) por pelo menos 1 minuto para uma audiência de pelo menos cinco criaturas, você pode fazer um teste de Carisma (Atuação). Com um Sucesso Normal, você prende a atenção da maioria dos presentes pela duração da performance. Com um Sucesso Bom ou Extremo, além de prender a atenção, você pode influenciar sutilmente o humor geral do grupo ou criar uma distração eficaz para seus aliados agirem.'
    }
  },

  'veterano-guerras': {
    id: 'veterano-guerras',
    name: 'Veterano das Guerras',
    description: 'Antes da paz da Grande Aliança ser estabelecida (ou talvez em alguma escaramuça fronteiriça mais recente), você lutou. Seja como soldado de um dos reinos emergentes, mercenário buscando fortuna, membro de uma milícia defendendo sua vila ou mesmo um batedor em território inimigo durante a turbulenta Era do Conflito, você conheceu o clangor do aço, a estratégia do campo de batalha e a dura realidade da guerra.',
    trainedSkills: ['Guerra', 'Fortitude'],
    benefit: {
      name: 'Instinto de Batalha',
      description: 'A experiência em combate real afiou seus reflexos. Você pode gastar 1 PM para ganhar vantagem (rolar um dado d20 adicional e usar o maior resultado) em uma jogada de ataque ou em um teste de Iniciativa. Você pode usar este benefício um número de vezes por dia igual ao seu modificador de Constituição (mínimo 1).'
    }
  }
}; 