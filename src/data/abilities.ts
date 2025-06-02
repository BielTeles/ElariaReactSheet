// Descrições detalhadas das habilidades das subclasses baseadas no livro de Elaria

export interface AbilityDetails {
  name: string;
  type: string; // Ação, Ação Bônus, Reação, Passivo, etc.
  cost: string; // Custo em PM ou V
  range?: string; // Alcance se aplicável
  duration?: string; // Duração se aplicável
  description: string; // Descrição completa da mecânica
  flavorText?: string; // Texto descritivo opcional
}

export const subclassAbilities: Record<string, AbilityDetails> = {
  // Evocador - Caminho da Terra
  'Postura Inabalável': {
    name: 'Postura Inabalável',
    type: 'Reação',
    cost: '1 PM',
    description: 'Quando você for alvo de um efeito que o forçaria a se mover ou o derrubaria (como um empurrão ou um ataque de derrubar), você pode usar sua reação para ganhar vantagem no teste de resistência contra esse efeito específico.',
    flavorText: 'Sua conexão com a terra o torna firme como uma montanha.'
  },
  
  'Abraço da Terra': {
    name: 'Abraço da Terra',
    type: 'Ação',
    cost: '1 PM',
    range: 'Alcance 9m',
    duration: '15 segundos (3 turnos)',
    description: 'Você comanda a terra para dificultar o movimento. Escolha uma área quadrada de 1,5m no chão que você possa ver. Criaturas que entrarem ou começarem seu turno na área devem fazer um Teste de Resistência de Força (CD Normal). Se falharem, têm seu deslocamento reduzido pela metade até saírem da área afetada.',
    flavorText: 'A terra responde ao seu comando, criando obstáculos naturais.'
  },
  
  'Moldar Abrigo': {
    name: 'Moldar Abrigo',
    type: 'Ação',
    cost: '2 PM',
    range: 'Toque',
    duration: '15 segundos (3 turnos) ou até destruído',
    description: 'Você toca uma superfície de terra ou pedra (que esteja 1,5m ou 1q e esteja livre) e a molda rapidamente para criar uma cobertura para uma criatura Média ou menor. A cobertura tem PV igual ao dobro do seu nível e RD 1.',
    flavorText: 'Com um toque, você molda a terra em proteção sólida.'
  },

  // Evocador - Caminho da Água
  'Forma Fluida': {
    name: 'Forma Fluida',
    type: 'Ação Bônus',
    cost: '1 PM',
    range: 'Pessoal',
    duration: 'Até o próximo turno',
    description: 'Seu corpo torna-se momentaneamente mais maleável como a água. Você pode se mover através de espaços ocupados por criaturas hostis (mas não pode terminar seu movimento lá) e tem vantagem em testes de Acrobacia para escapar de agarrões ou amarras.',
    flavorText: 'Seu corpo flui como água, adaptando-se aos obstáculos.'
  },
  
  'Projétil de Água': {
    name: 'Projétil de Água',
    type: 'Ação',
    cost: '1 PM',
    range: 'Alcance 9m',
    description: 'Você lança um golpe rápido de água pressurizada. Faça um teste de ataque de magia à distância (use Sabedoria para ataque). Se acertar, causa 1d6 + Sabedoria de dano de impacto.',
    flavorText: 'Um jato concentrado de água atinge seu alvo com força.'
  },
  
  'Pulso Restaurador': {
    name: 'Pulso Restaurador',
    type: 'Ação',
    cost: '2 PM',
    range: 'Toque',
    description: 'Você canaliza a energia vital da água para fechar ferimentos. O alvo recupera 1d4 + Sabedoria Pontos de Vida. Além disso, você pode tentar encerrar um efeito de veneno de ação lenta ou uma doença não mágica que afete o alvo (requer um teste de Cura com CD definida pelo Mestre).',
    flavorText: 'A energia curativa da água flui através do seu toque.'
  },

  // Evocador - Caminho do Ar
  'Corrente Ascendente': {
    name: 'Corrente Ascendente',
    type: 'Ação Bônus',
    cost: '1 PM',
    range: 'Pessoal',
    duration: '1 Turno',
    description: 'Você cria correntes de ar sob seus pés, tornando-se mais leve e ágil. Até o final do seu turno, você ignora penalidades de deslocamento por terreno difícil e tem vantagem em testes de Acrobacia feitos para manter o equilíbrio ou saltar.',
    flavorText: 'Ventos invisíveis elevam seus passos, dando-lhe leveza sobrenatural.'
  },
  
  'Sopro Desestabilizador': {
    name: 'Sopro Desestabilizador',
    type: 'Ação',
    cost: '1 PM',
    range: 'Alcance 9m',
    duration: '1 Turno',
    description: 'Você lança uma lufada de vento precisa contra um alvo. A criatura deve fazer um Teste de Resistência de Força (CD Normal). Se falhar, ela sofre 1 dado de desvantagem em sua próxima jogada de ataque corpo a corpo realizada antes do final do próximo turno dela.',
    flavorText: 'Um sopro direcionado desarma o equilíbrio do oponente.'
  },
  
  'Manto de Vento': {
    name: 'Manto de Vento',
    type: 'Reação',
    cost: '2 PM',
    description: 'Quando você ou uma criatura a até 1,5m de você é alvo de um ataque à distância com um projétil físico (flecha, virote, pedra, etc.) que você possa ver, você pode usar sua reação para criar uma lufada de vento protetora. O atacante faz a jogada de ataque com 1 dado de desvantagem.',
    flavorText: 'Rajadas de vento desviam projéteis de seu caminho.'
  },

  // Evocador - Caminho do Fogo
  'Combustão Controlada': {
    name: 'Combustão Controlada',
    type: 'Ação',
    cost: '2 PM',
    range: 'Alcance 9m',
    duration: '1 turno',
    description: 'Você causa uma pequena explosão de fogo num ponto que possa ver. Criaturas num raio de 1,5m desse ponto devem fazer um Teste de Resistência de Destreza (CD Normal). Se falharem, sofrem 1d6 de dano de Fogo (metade se passarem).',
    flavorText: 'Uma explosão controlada de chamas irrompe onde você designa.'
  },
  
  'Alimentar as Chamas': {
    name: 'Alimentar as Chamas',
    type: 'Ação Bônus',
    cost: '1 PM',
    range: 'Pessoal',
    description: 'Você intensifica sua chama interior. Seu próximo ataque que cause dano de Fogo neste turno causa 1d4 de dano de Fogo adicional.',
    flavorText: 'Sua paixão interior se manifesta em chamas mais intensas.'
  },
  
  'Marca Incinerante': {
    name: 'Marca Incinerante',
    type: 'Ação',
    cost: '1 PM',
    range: 'Toque',
    duration: '2 turnos',
    description: 'Você toca uma criatura, deixando uma brasa latente. O alvo deve fazer um Teste de Fortitude (CD Normal). Se falhar, ele fica marcado. Na primeira vez que sofrer dano de Fogo antes do final dos próximos 2 turnos, ele sofre 1d4 de dano de Fogo adicional e a marca desaparece.',
    flavorText: 'Uma marca ardente permanece oculta, pronta para explodir.'
  },

  // Evocador - Caminho da Luz
  'Bálsamo de Luz': {
    name: 'Bálsamo de Luz',
    type: 'Ação',
    cost: '2 PM',
    range: 'Toque',
    description: 'Você canaliza luz curativa. O alvo recupera 1d6 + Sabedoria Pontos de Vida e recebe vantagem em seu próximo teste de resistência contra doenças ou venenos feito na próxima hora.',
    flavorText: 'Luz dourada flui através do seu toque, curando feridas e purificando.'
  },
  
  'Luz Reveladora': {
    name: 'Luz Reveladora',
    type: 'Ação',
    cost: '2 PM',
    range: 'Alcance 9m',
    duration: 'Concentração',
    description: 'Você concentra um feixe de luz pura em uma área circular de 1,5m de raio que você possa ver. Qualquer criatura ou objeto invisível dentro da área torna-se visível como uma silhueta luminosa enquanto permanecer na área. Além disso, esta luz dissipa qualquer Escuridão Mágica de nível igual ou inferior a sua Sabedoria.',
    flavorText: 'Luz pura revela o que estava oculto nas sombras.'
  },
  
  'Seta Luminosa': {
    name: 'Seta Luminosa',
    type: 'Ação',
    cost: '2 PM',
    range: 'Alcance 18m',
    description: 'Você dispara uma seta de pura luz. Faça um teste de ataque de magia (use Sabedoria para ataque). Se acertar, causa 1d6 + Sabedoria de dano Radiante. Criaturas vulneráveis à luz (como alguns mortos-vivos ou seres sombrios) têm desvantagem em testes de resistência contra este dano.',
    flavorText: 'Um projétil de luz pura atravessa o ar em direção ao seu alvo.'
  },

  // Evocador - Caminho da Sombra
  'Véu de Engano': {
    name: 'Véu de Engano',
    type: 'Ação',
    cost: '2 PM',
    range: 'Pessoal',
    duration: '1 hora',
    description: 'Você tece sombras ilusórias ao seu redor. Pela próxima hora, você tem vantagem em testes de Carisma (Enganação) para disfarçar sua aparência ou criar uma pequena ilusão visual (como um objeto falso ou um som abafado).',
    flavorText: 'Sombras dançam ao seu redor, obscurecendo a realidade.'
  },
  
  'Toque Debilitante': {
    name: 'Toque Debilitante',
    type: 'Ação',
    cost: '1 PM',
    range: 'Toque',
    duration: '1 turno',
    description: 'Você toca uma criatura. Ela deve fazer um Teste de Constituição (CD Normal). Se falhar, ela sofre 1d4 de dano necrótico e tem desvantagem em seu próximo teste de Força ou Destreza realizado antes do final do próximo turno dela.',
    flavorText: 'Sombras drenam a energia vital do alvo através do seu toque.'
  },
  
  'Passo Sombrio': {
    name: 'Passo Sombrio',
    type: 'Ação Bônus',
    cost: '2 PM',
    range: 'Pessoal',
    description: 'Você se dissolve nas sombras e reaparece instantaneamente em um espaço desocupado que possa ver a até 6 metros de distância. Ambos os espaços (origem e destino) devem estar em área de penumbra ou escuridão.',
    flavorText: 'Você se torna uma com as sombras, emergindo em outro local.'
  },

  // Titã - Baluarte
  'Postura Defensiva': {
    name: 'Postura Defensiva',
    type: 'Ação Bônus',
    cost: '1 V',
    duration: 'Até o início do próximo turno',
    description: 'Enquanto você estiver empunhando um escudo, pode adotar esta postura. Enquanto na postura, sua Redução de Dano (RD) total aumenta em +1 e você tem vantagem em testes de resistência para evitar ser movido ou derrubado. Inimigos adjacentes são forçados a fazerem um teste de Carisma (CD Bom) - se falharem são obrigados a te atacar.',
    flavorText: 'Você se posiciona como uma muralha intransponível.'
  },
  
  'Proteger Aliado': {
    name: 'Proteger Aliado',
    type: 'Reação',
    cost: '1 V (+1 V)',
    description: 'Quando um inimigo que você possa ver ataca um aliado que esteja adjacente a você, você pode usar sua Reação para se interpor. Faça um teste de Bloqueio. Se o Grau de Sucesso do seu Bloqueio for igual ou maior que o Grau de Sucesso do ataque inimigo, o ataque atinge você em vez do aliado original (você ainda pode se beneficiar da sua RD e outras defesas).',
    flavorText: 'Você se joga no caminho do perigo para proteger um aliado.'
  },
  
  'Escudo Ecoante': {
    name: 'Escudo Ecoante',
    type: 'Reação',
    cost: '1 V (+1 V)',
    description: 'Quando você bloqueia com sucesso um ataque corpo a corpo usando a perícia Bloqueio (Grau de Sucesso igual ou maior), o atacante que você bloqueou sofre 1d4 de dano devido à vibração ressonante do seu escudo.',
    flavorText: 'Seu escudo ecoa com força, retornando parte do impacto.'
  },
  
  'Ancorar Posição': {
    name: 'Ancorar Posição',
    type: 'Ação Bônus',
    cost: '1 V (+1 V)',
    duration: 'Até o início do próximo turno',
    description: 'Você se firma resolutamente no chão. Seu deslocamento é reduzido a 0, mas qualquer criatura hostil que tente entrar ou passar por um espaço adjacente a você deve gastar 1,5 metros extras de movimento para cada 1,5 metros movidos nesse espaço.',
    flavorText: 'Você se torna um obstáculo imóvel e intimidador no campo de batalha.'
  },

  // Titã - Fúria Primal
  'Golpe Furioso': {
    name: 'Golpe Furioso',
    type: 'Ação Bônus',
    cost: '1 V (+1 V)',
    description: 'Após acertar um ataque corpo a corpo neste turno, você pode usar sua ação bônus para realizar um ataque adicional com a mesma arma contra o mesmo alvo, mas este ataque adicional é feito com 1 dado de desvantagem.',
    flavorText: 'Sua fúria se manifesta em golpes consecutivos devastadores.'
  },
  
  'Grito de Guerra': {
    name: 'Grito de Guerra',
    type: 'Ação',
    cost: '1 V',
    range: 'Até 9m',
    duration: '1 rodada',
    description: 'Você solta um urro intimidador. Todas as criaturas hostis a até 9m que possam ouvi-lo devem fazer um Teste de Vontade (CD Normal). Se falharem, ficam Amedrontadas por 1 rodada.',
    flavorText: 'Seu rugido primitivo ecoa pelo campo de batalha, aterrorizando inimigos.'
  },
  
  'Ignorar a Dor': {
    name: 'Ignorar a Dor',
    type: 'Reação',
    cost: '1 V',
    description: 'Quando você sofrer dano que não o reduziria a 0 PV, você pode usar sua reação para ignorar a dor e continuar lutando. Você reduz o dano sofrido por sua Constituição (mínimo 1).',
    flavorText: 'Sua determinação selvagem supera a dor física.'
  },
  
  'Avanço Implacável': {
    name: 'Avanço Implacável',
    type: 'Ação de Movimento',
    cost: '1 V',
    description: 'Você se move até seu deslocamento total. Durante este movimento, você pode atravessar espaços ocupados por criaturas hostis (considerado terreno difícil) e tem vantagem em testes de Força (Atletismo) feitos para quebrar objetos ou barreiras que estejam no seu caminho.',
    flavorText: 'Nada pode parar seu avanço determinado.'
  },

  // Titã - Quebra-Montanhas
  'Quebrar Escudo': {
    name: 'Quebrar Escudo',
    type: 'Ação de Ataque',
    cost: '1 V',
    description: 'Ao fazer um ataque corpo a corpo contra um oponente empunhando um escudo, você pode gastar 1 V para focar seu golpe no escudo. Se o ataque acertar (CD Bom - Força), em vez de causar dano normal, o escudo do oponente é destruído.',
    flavorText: 'Sua força concentrada despedaça as defesas inimigas.'
  },
  
  'Firmeza da Montanha': {
    name: 'Firmeza da Montanha',
    type: 'Ação Bônus',
    cost: '2 V',
    duration: 'Até o início do próximo turno',
    description: 'Você planta seus pés firmemente, canalizando a resiliência da pedra. Você ganha Redução de Dano (RD) 2 contra todos os tipos de dano, mas seu deslocamento é reduzido a 0.',
    flavorText: 'Você se torna imóvel como uma montanha, mas igualmente resistente.'
  },
  
  'Impacto Arrasador': {
    name: 'Impacto Arrasador',
    type: 'Ação',
    cost: '1 V',
    duration: '1 rodada (se atordoar)',
    description: 'Você realiza um único ataque corpo a corpo com uma arma pesada de duas mãos. Se acertar, além do dano normal, o ataque causa dano adicional igual a Força e o alvo deve fazer um Teste de Fortitude (CD Normal) ou ficará Atordoado por 1 rodada.',
    flavorText: 'Seu golpe possui força suficiente para abalar o chão.'
  },
  
  'Rompante Poderoso': {
    name: 'Rompante Poderoso',
    type: 'Ação de Movimento',
    cost: 'Variável',
    description: 'Você avança com força total. Você pode se mover até seu deslocamento e realizar um teste de Força (Atletismo) com vantagem para tentar derrubar um portão, parede frágil ou outro obstáculo físico similar no seu caminho. Se você terminar este movimento adjacente a uma criatura hostil, pode fazer um ataque corpo a corpo contra ela como ação livre.',
    flavorText: 'Você quebra obstáculos e atinge inimigos em um único movimento devastador.'
  },

  // Sentinela - Rastreador dos Ermos
  'Marca do Caçador': {
    name: 'Marca do Caçador',
    type: 'Ação Bônus',
    cost: '1 PM',
    range: 'Alcance 18m',
    duration: '1 cena (ou 1 hora)',
    description: 'Você escolhe uma criatura que possa ver como sua presa marcada. Até o final da cena (ou por 1 hora), você tem vantagem em testes de Sobrevivência para rastrear essa criatura e em testes de Intuição para discernir suas intenções imediatas. Você só pode ter uma criatura marcada por vez.',
    flavorText: 'Você marca sua presa como um predador experiente.'
  },
  
  'Disparo Preciso': {
    name: 'Disparo Preciso',
    type: 'Ação',
    cost: '1 PM',
    duration: 'Até o final do próximo turno do alvo',
    description: 'Ao fazer um ataque à distância com uma arma (como arco ou besta), você pode gastar 1 PM antes da rolagem de ataque para mirar em um ponto vital. Se o ataque acertar, além do dano normal, o alvo sofre 1d4 de dano adicional e deve fazer um Teste Fortitude (CD Normal) ou terá seu deslocamento reduzido em 3 metros até o final do próximo turno dele.',
    flavorText: 'Seu tiro atinge exatamente onde planejado, causando máximo impacto.'
  },
  
  'Armadilha Improvisada': {
    name: 'Armadilha Improvisada',
    type: 'Ação',
    cost: '2 PM',
    range: 'Espaço adjacente',
    duration: 'Até ser desarmada',
    description: 'Você usa materiais naturais próximos (galhos, cipós, pedras) para criar rapidamente uma armadilha simples. A primeira criatura Média ou menor a entrar nesse espaço deve fazer um Teste de Destreza (CD Normal). Se falhar, fica Imobilizada até usar uma ação para tentar se libertar (Teste de Força ou Destreza contra a mesma CD).',
    flavorText: 'Com habilidade natural, você transforma elementos do ambiente em armadilha.'
  },
  
  'Companheiro Animal (Elo Menor)': {
    name: 'Companheiro Animal (Elo Menor)',
    type: 'Ritual',
    cost: '1 PM (requer Descanso Longo)',
    duration: 'Até a morte do companheiro',
    description: 'Você forma um elo empático com um animal Pequeno ou Menor comum da região (como um falcão, coruja, rato, doninha). Ele se torna seu companheiro leal, mas não combativo. Ele pode realizar tarefas simples sob seu comando (como explorar uma área próxima, entregar uma mensagem pequena, criar uma distração menor). Ele age no seu turno, tem seus próprios PV (geralmente poucos) e pode ser alvo de ataques.',
    flavorText: 'Um elo especial se forma entre você e uma criatura da natureza.'
  },

  // Sentinela - Lâmina do Crepúsculo
  'Golpe Desorientador': {
    name: 'Golpe Desorientador',
    type: 'Ação',
    cost: '1 PM',
    duration: '1 turno',
    description: 'Ao fazer um ataque corpo a corpo, você pode gastar 1 PM para mirar em pontos vitais ou usar técnicas desorientadoras. Se o ataque acertar, além do dano normal, o alvo tem 1 dado de desvantagem em sua próxima jogada de ataque realizada antes do final do próximo turno dele.',
    flavorText: 'Seu golpe preciso deixa o oponente momentaneamente confuso.'
  },
  
  'Passo Fantasma': {
    name: 'Passo Fantasma',
    type: 'Ação Bônus',
    cost: '2 PM',
    range: 'Até 6 metros',
    description: 'Você se move rapidamente e silenciosamente até 6 metros, ignorando oportunidade de ataques. Durante este movimento, você pode passar através de espaços ocupados por criaturas (mas não pode terminar seu movimento lá) e tem vantagem em testes de Furtividade até o final do turno.',
    flavorText: 'Você se move como uma sombra, quase imperceptível.'
  },
  
  'Ataque Furtivo': {
    name: 'Ataque Furtivo',
    type: 'Passivo/Gatilho',
    cost: 'Nenhum',
    description: 'Quando você ataca um oponente que não pode vê-lo claramente (devido a Furtividade, invisibilidade, ou estar na retaguarda) ou que está distraído em combate com outro aliado adjacente, você causa 1d6 de dano adicional no ataque. Este dano adicional aumenta conforme você avança de nível.',
    flavorText: 'Você aproveita momentos de vulnerabilidade para golpes devastadores.'
  },
  
  'Visão Crepuscular': {
    name: 'Visão Crepuscular',
    type: 'Passivo',
    cost: 'Nenhum',
    description: 'Seus olhos se adaptam perfeitamente à baixa luminosidade. Você pode ver em penumbra como se fosse luz plena até uma distância de 18 metros. Além disso, você tem vantagem em testes de Percepção realizados em condições de pouca luz.',
    flavorText: 'Seus olhos brilham sutilmente na penumbra, como os de um felino.'
  },

  // Sentinela - Olho Vigilante
  'Estudar Oponente': {
    name: 'Estudar Oponente',
    type: 'Ação Bônus',
    cost: '1 PM',
    range: 'Criatura visível',
    duration: '1 cena (ou até estudar outro)',
    description: 'Você foca sua atenção analítica em uma criatura que possa ver. Até o final da cena (ou até escolher estudar outra criatura), você tem vantagem em testes de ataque contra essa criatura e pode usar Inteligência em vez de Sabedoria para testes de Intuição relacionados a ela.',
    flavorText: 'Sua análise revela padrões e fraquezas do oponente.'
  },
  
  'Antecipar Movimento': {
    name: 'Antecipar Movimento',
    type: 'Reação',
    cost: '1 PM',
    description: 'Quando uma criatura que você possa ver se move para um espaço adjacente a você, você pode usar sua reação para se mover 1,5 metros para um espaço desocupado sem provocar ataques de oportunidade. Este movimento deve ser feito antes do oponente completar sua ação.',
    flavorText: 'Sua capacidade de predição permite antecipar movimentos inimigos.'
  },
  
  'Ponto Fraco': {
    name: 'Ponto Fraco',
    type: 'Ação Bônus',
    cost: '2 PM',
    duration: '1 ataque',
    description: 'Após estudar um oponente por pelo menos 1 rodada, você pode identificar um ponto fraco em suas defesas. Seu próximo ataque contra essa criatura ignora 2 pontos de Redução de Dano (se houver) e, se acertar, causa 1d4 de dano adicional.',
    flavorText: 'Sua análise cuidadosa revela uma abertura crítica nas defesas.'
  },
  
  'Leitura Rápida': {
    name: 'Leitura Rápida',
    type: 'Ação',
    cost: '1 PM',
    range: 'Área ou objeto',
    description: 'Você pode analisar rapidamente uma área (como um cômodo) ou objeto complexo, fazendo um teste de Investigação com vantagem. Esta análise revela detalhes importantes que poderiam ser perdidos em uma observação casual, como passagens ocultas, armadilhas óbvias, ou pistas sobre eventos recentes.',
    flavorText: 'Sua mente analítica processa informações com velocidade impressionante.'
  },

  // Elo - Voz da Harmonia
  'Palavra Calmante': {
    name: 'Palavra Calmante',
    type: 'Ação',
    cost: '1 PM',
    range: 'Alcance 9m',
    duration: '1 turno',
    description: 'Você direciona palavras de calma a uma criatura que possa ouvi-lo. O alvo deve fazer um Teste de Vontade (CD Normal). Se falhar, ele não pode realizar ações hostis (como atacar ou usar habilidades ofensivas) em seu próximo turno, embora ainda possa se mover ou realizar outras ações.',
    flavorText: 'Suas palavras carregam uma serenidade que acalma até os corações mais furiosos.'
  },
  
  'Negociação Persuasiva': {
    name: 'Negociação Persuasiva',
    type: 'Ação Bônus',
    cost: '1 PM',
    range: 'Pessoal',
    duration: 'Até o próximo turno',
    description: 'Você se prepara para uma interação social crucial. Você ganha vantagem no próximo teste de Diplomacia que fizer antes do final do seu próximo turno.',
    flavorText: 'Você organiza seus pensamentos e palavras para máximo impacto diplomático.'
  },
  
  'Elo Empático (Sentir Verdade)': {
    name: 'Elo Empático (Sentir Verdade)',
    type: 'Ação',
    cost: '1 PM',
    range: 'Alcance 3m',
    description: 'Você foca sua empatia em uma criatura que possa ver. Você pode fazer um teste de Intuição oposto pelo teste Enganação da criatura. Se você vencer, o Mestre lhe informa se a criatura está deliberadamente mentindo sobre algo que disse no último minuto. Este uso substitui um dos efeitos normais da habilidade Elo Empático.',
    flavorText: 'Sua empatia aguçada permite sentir as dissonâncias entre palavras e intenções.'
  },
  
  'Discurso Conciliador': {
    name: 'Discurso Conciliador',
    type: 'Ação',
    cost: '2 PM',
    range: 'Alcance 9m',
    duration: '10 minutos',
    description: 'Você faz um breve discurso inspirando cooperação. Escolha a si mesmo e até um número de aliados igual ao seu Carisma (mínimo 1) que possam ouvi-lo. Os alvos escolhidos recebem vantagem em seu próximo teste de perícia social (Diplomacia, Enganação, Intimidação ou Atuação) feito nos próximos 10 minutos.',
    flavorText: 'Suas palavras tecem pontes de entendimento entre corações e mentes.'
  },

  // Elo - Porta-Voz da Chama
  'Comando de Batalha': {
    name: 'Comando de Batalha',
    type: 'Ação Bônus',
    cost: '1 PM',
    range: 'Alcance 9m',
    description: 'Você dá um comando tático a um aliado que possa ouvi-lo. O aliado pode usar a Reação dele imediatamente para se mover até metade do seu deslocamento ou fazer um único ataque corpo a corpo ou à distância.',
    flavorText: 'Sua voz de comando desperta reflexos de combate treinados.'
  },
  
  'Grito Motivador': {
    name: 'Grito Motivador',
    type: 'Ação',
    cost: '2 PM',
    range: 'Raio 3m',
    description: 'Você solta um grito que ecoa com a Chama Interior. Escolha a si mesmo e até um número de aliados igual ao Carisma (mínimo 1) dentro do alcance que possam ouvi-lo. Os alvos escolhidos recebem Pontos de Vida Temporários igual a 1d6 + Carisma.',
    flavorText: 'Seu grito de guerra ressoa com energia vital, fortalecendo espíritos e corpos.'
  },
  
  'Performance Revigorante': {
    name: 'Performance Revigorante',
    type: 'Pausa',
    cost: '2 PM',
    duration: 'Durante breve descanso',
    description: 'Você realiza uma performance inspiradora (canto, discurso, música) para seus aliados durante um breve descanso. Ao final da performance, escolha até um número de aliados igual ao seu Carisma (mínimo 1) que ouviram toda a performance. Cada alvo pode recuperar PV como se tivesse feito um descanso curto, sem realmente gastar o tempo de um descanso curto. Você só pode usar esta habilidade uma vez por descanso longo.',
    flavorText: 'Sua arte transcende entretenimento, tornando-se uma fonte literal de renovação.'
  },
  
  'Elo Protetor (Aura)': {
    name: 'Elo Protetor (Aura)',
    type: 'Ação Bônus',
    cost: '2 PM por turno',
    range: 'Pessoal',
    duration: 'Concentração',
    description: 'Você projeta uma aura de proteção motivacional. Aliados (incluindo você) a até 3 metros de você recebem +1 na RD contra ataques enquanto a aura durar.',
    flavorText: 'Sua presença inspira uma determinação que fortalece contra golpes inimigos.'
  },

  // Elo - Guardião do Coração
  'Toque Restaurador Aprimorado': {
    name: 'Toque Restaurador Aprimorado',
    type: 'Ação',
    cost: '2 PM',
    range: 'Toque',
    description: 'Você aprimora sua capacidade de cura. Quando você usa a habilidade Elo Empático (Alívio Menor), o alvo recupera 1d6 Pontos de Vida reais, além dos Pontos de Vida Temporários.',
    flavorText: 'Sua empatia transcende o emocional, manifestando-se como cura física genuína.'
  },
  
  'Vínculo Protetor': {
    name: 'Vínculo Protetor',
    type: 'Ação',
    cost: '2 PM por turno',
    range: 'Alcance 9m',
    duration: 'Concentração',
    description: 'Você cria um vínculo empático com um aliado voluntário que possa ver. Enquanto o vínculo durar, sempre que o aliado sofrer dano, você pode usar sua Reação para sofrer metade desse dano (arredondado para baixo) em vez dele. O vínculo termina se o alvo ficar a mais de 9m de você, se você ficar inconsciente, ou se você usar esta habilidade em outro alvo.',
    flavorText: 'Você compartilha não apenas emoções, mas também a dor física daqueles que protege.'
  },
  
  'Palavras de Conforto': {
    name: 'Palavras de Conforto',
    type: 'Ação',
    cost: '1 PM',
    range: 'Alcance 9m',
    description: 'Você oferece palavras de encorajamento e calma a um aliado que possa ouvi-lo e que esteja sofrendo de uma condição mental menor (como Amedrontado ou talvez uma penalidade por desespero, a critério do MJ). O alvo pode fazer imediatamente um novo Teste Vontade contra o efeito, com vantagem.',
    flavorText: 'Suas palavras carregam o poder de dissipar sombras da mente e do coração.'
  },
  
  'Detectar Dor/Aflição': {
    name: 'Detectar Dor/Aflição',
    type: 'Ação',
    cost: '1 PM',
    range: 'Pessoal',
    duration: 'Alguns minutos',
    description: 'Você expande sua empatia para sentir o sofrimento ao redor. Pelos próximos minutos, você tem vantagem em testes de Intuição ou Percepção para detectar criaturas feridas, doentes, envenenadas ou sob forte estresse emocional a até 9m de você, mesmo que estejam escondidas da visão normal (mas não através de barreiras sólidas).',
    flavorText: 'Sua empatia se estende como uma rede invisível, captando ecos de dor e aflição.'
  }
}; 