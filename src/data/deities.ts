export interface DeityData {
  id: string;
  name: string;
  title: string;
  description: string;
  domains: string[];
  essences: string[];
  followers: string[];
  trainedSkill: string;
  benefit: {
    name: string;
    description: string;
  };
}

export const deities: Record<string, DeityData> = {
  ignis: {
    id: 'ignis',
    name: 'Ignis',
    title: 'A Primeira Chama',
    description: 'Patrono do Fogo, da Criação, da Destruição, da Paixão e da Forja.',
    domains: ['Fogo', 'Criação', 'Destruição', 'Paixão', 'Forja'],
    essences: ['Vontade Indomável', 'Chama Interior'],
    followers: ['Roknar', 'Piromantes', 'Ferreiros', 'Espíritos impetuosos'],
    trainedSkill: 'Intimidação',
    benefit: {
      name: 'Resistência Ígnea',
      description: 'Você recebe Resistência a Fogo 1 (sempre que sofrer dano de Fogo, reduza o dano em 1 ponto).'
    }
  },

  ondina: {
    id: 'ondina',
    name: 'Ondina',
    title: 'A Mãe das Águas',
    description: 'Patrona da Água, da Adaptabilidade, dos Ciclos, da Cura e dos Mistérios Profundos.',
    domains: ['Água', 'Adaptabilidade', 'Ciclos', 'Cura', 'Mistérios Profundos'],
    essences: ['Sentir Profundo', 'Fluxo Incessante'],
    followers: ['Celeres', 'Hidromantes', 'Curandeiros', 'Marinheiros', 'Comunidades costeiras'],
    trainedSkill: 'Cura',
    benefit: {
      name: 'Bênção das Marés',
      description: 'Você pode prender a respiração debaixo d\'água por até 10 minutos.'
    }
  },

  terrus: {
    id: 'terrus',
    name: 'Terrus',
    title: 'O Guardião dos Solos',
    description: 'Patrono da Terra, da Estabilidade, da Resistência, do Crescimento e da Paciência.',
    domains: ['Terra', 'Estabilidade', 'Resistência', 'Crescimento', 'Paciência'],
    essences: ['Resiliência Eterna', 'Olhar Penetrante'],
    followers: ['Alari', 'Geomantes', 'Agricultores', 'Construtores'],
    trainedSkill: 'Sobrevivência',
    benefit: {
      name: 'Pés Firmes',
      description: 'Você tem vantagem em testes de resistência para evitar ser derrubado (condição Caído) enquanto estiver em contato direto com solo natural.'
    }
  },

  zephyrus: {
    id: 'zephyrus',
    name: 'Zephyrus',
    title: 'O Senhor dos Ventos',
    description: 'Patrono do Ar, da Liberdade, do Movimento, da Comunicação e da Mudança.',
    domains: ['Ar', 'Liberdade', 'Movimento', 'Comunicação', 'Mudança'],
    essences: ['Fluxo Incessante', 'Vontade Indomável'],
    followers: ['Faelan', 'Aeromantes', 'Viajantes', 'Mensageiros', 'Espíritos livres'],
    trainedSkill: 'Acrobatismo',
    benefit: {
      name: 'Passo do Vento',
      description: 'Seu deslocamento base aumenta em +1,5 metros.'
    }
  },

  lumina: {
    id: 'lumina',
    name: 'Lumina',
    title: 'A Guardiã da Aurora',
    description: 'Patrona da Luz, da Verdade, da Clareza, da Esperança e da Proteção.',
    domains: ['Luz', 'Verdade', 'Clareza', 'Esperança', 'Proteção'],
    essences: ['Chama Interior', 'Olhar Penetrante'],
    followers: ['Aurien', 'Luminantes', 'Estudiosos', 'Juízes'],
    trainedSkill: 'Percepção',
    benefit: {
      name: 'Olhar Claro',
      description: 'Você tem vantagem em testes de resistência contra efeitos que causam a condição Cego ou que obscurecem magicamente a visão.'
    }
  },

  noctus: {
    id: 'noctus',
    name: 'Noctus',
    title: 'O Sábio das Sombras',
    description: 'Patrono da Sombra, do Mistério, da Intuição, dos Segredos e do Repouso.',
    domains: ['Sombra', 'Mistério', 'Intuição', 'Segredos', 'Repouso'],
    essences: ['Sentir Profundo', 'Olhar Penetrante'],
    followers: ['Vesperi', 'Umbrantes', 'Espiões', 'Filósofos'],
    trainedSkill: 'Furtividade',
    benefit: {
      name: 'Véu das Sombras',
      description: 'Uma vez por dia, como ação bônus, você pode se tornar invisível até o final do seu turno, desde que esteja em penumbra ou escuridão. A invisibilidade termina se você atacar.'
    }
  }
}; 