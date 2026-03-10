export interface Session {
  id: string;
  chapterId: string;
  number: number;
  title: string;
  description: string;
  sessionType: 'diagnostic' | 'reading' | 'ai_chat' | 'writing' | 'audio_recording' | 'scenario_drill' | 'multiple_choice' | 'reflection' | 'professor_session';
  durationMinutes: number;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  isDiagnostic: boolean;
  totalSessions: number;
  sessions: Session[];
}

export const chaptersData: Chapter[] = [
  {
    id: 'ch1',
    number: 1,
    title: 'Diagnóstico',
    description: 'Avaliação inicial do teu nível e estilo de aprendizagem para personalizar o teu percurso.',
    isDiagnostic: true,
    totalSessions: 1,
    sessions: [
      { id: 'ch1-s1', chapterId: 'ch1', number: 1, title: 'Diagnóstico Inicial', description: 'Avaliação completa do teu nível actual, pontos fortes e áreas de melhoria.', sessionType: 'diagnostic', durationMinutes: 30 },
    ],
  },
  {
    id: 'ch2',
    number: 2,
    title: 'Voice Foundations',
    description: 'Bases sólidas de comunicação oral em contexto profissional.',
    isDiagnostic: false,
    totalSessions: 5,
    sessions: [
      { id: 'ch2-s1', chapterId: 'ch2', number: 1, title: 'Introdução ao Inglês Empresarial', description: 'Vocabulário e frases essenciais para contextos profissionais.', sessionType: 'reading', durationMinutes: 20 },
      { id: 'ch2-s2', chapterId: 'ch2', number: 2, title: 'A Tua Voz Profissional', description: 'Desenvolve um tom e presença vocal adequados ao contexto.', sessionType: 'audio_recording', durationMinutes: 25 },
      { id: 'ch2-s3', chapterId: 'ch2', number: 3, title: 'Apresentações Curtas', description: 'Estrutura e entrega de apresentações de 2 minutos.', sessionType: 'scenario_drill', durationMinutes: 25 },
      { id: 'ch2-s4', chapterId: 'ch2', number: 4, title: 'Prática com IA', description: 'Conversa com o assistente AI sobre temas profissionais.', sessionType: 'ai_chat', durationMinutes: 20 },
      { id: 'ch2-s5', chapterId: 'ch2', number: 5, title: 'Aula com Professora #1', description: 'Sessão personalizada com revisão do progresso e foco em pontos de melhoria.', sessionType: 'professor_session', durationMinutes: 45 },
    ],
  },
  {
    id: 'ch3',
    number: 3,
    title: 'Clarity & Structure',
    description: 'Comunica com clareza e estrutura as tuas ideias de forma eficaz.',
    isDiagnostic: false,
    totalSessions: 5,
    sessions: [
      { id: 'ch3-s1', chapterId: 'ch3', number: 1, title: 'Email Profissional', description: 'Estrutura e tom adequados para emails formais e informais.', sessionType: 'writing', durationMinutes: 25 },
      { id: 'ch3-s2', chapterId: 'ch3', number: 2, title: 'Framework PREP', description: 'Point–Reason–Example–Point para respostas estruturadas.', sessionType: 'scenario_drill', durationMinutes: 25 },
      { id: 'ch3-s3', chapterId: 'ch3', number: 3, title: 'Reuniões — Participação Activa', description: 'Frases e estratégias para participar eficazmente em reuniões.', sessionType: 'reading', durationMinutes: 25 },
      { id: 'ch3-s4', chapterId: 'ch3', number: 4, title: 'Vocabulário de Impacto', description: 'Palavras e expressões que aumentam a clareza e o impacto.', sessionType: 'multiple_choice', durationMinutes: 20 },
      { id: 'ch3-s5', chapterId: 'ch3', number: 5, title: 'Reflexão: Pontos de Melhoria', description: 'Analisa o teu progresso e identifica áreas prioritárias.', sessionType: 'reflection', durationMinutes: 15 },
    ],
  },
  {
    id: 'ch4',
    number: 4,
    title: 'Confidence & Presence',
    description: 'Desenvolve confiança e presença executiva na comunicação oral.',
    isDiagnostic: false,
    totalSessions: 8,
    sessions: [
      { id: 'ch4-s1', chapterId: 'ch4', number: 1, title: 'Presença Executiva', description: 'O que define um comunicador de alto impacto.', sessionType: 'reading', durationMinutes: 20 },
      { id: 'ch4-s2', chapterId: 'ch4', number: 2, title: 'Gravação: Introdução Profissional', description: 'Grava uma introdução de 60 segundos sobre o teu papel.', sessionType: 'audio_recording', durationMinutes: 25 },
      { id: 'ch4-s3', chapterId: 'ch4', number: 3, title: 'Eliminar Filler Words', description: 'Técnicas para reduzir "um", "err", "like" e hesitações.', sessionType: 'scenario_drill', durationMinutes: 25 },
      { id: 'ch4-s4', chapterId: 'ch4', number: 4, title: 'Ritmo e Pausa', description: 'Usa o silêncio estratégico para aumentar o impacto.', sessionType: 'audio_recording', durationMinutes: 20 },
      { id: 'ch4-s5', chapterId: 'ch4', number: 5, title: 'Prática Conversacional', description: 'Diálogos de alta pressão com feedback da IA.', sessionType: 'ai_chat', durationMinutes: 30 },
      { id: 'ch4-s6', chapterId: 'ch4', number: 6, title: 'Quiz de Vocabulário', description: 'Verifica a assimilação do vocabulário trabalhado.', sessionType: 'multiple_choice', durationMinutes: 15 },
      { id: 'ch4-s7', chapterId: 'ch4', number: 7, title: 'Reflexão: Crescimento de Confiança', description: 'Avalia a evolução da tua confiança oral.', sessionType: 'reflection', durationMinutes: 15 },
      { id: 'ch4-s8', chapterId: 'ch4', number: 8, title: 'Aula com Professora #2', description: 'Sessão de foco em confiança e presença com feedback personalizado.', sessionType: 'professor_session', durationMinutes: 45 },
    ],
  },
  {
    id: 'ch5',
    number: 5,
    title: 'Vocabulary & Impact',
    description: 'Expande o vocabulário profissional e aumenta o impacto das tuas palavras.',
    isDiagnostic: false,
    totalSessions: 5,
    sessions: [
      { id: 'ch5-s1', chapterId: 'ch5', number: 1, title: 'Vocabulário Executivo', description: 'Termos e expressões usados por líderes de topo.', sessionType: 'reading', durationMinutes: 20 },
      { id: 'ch5-s2', chapterId: 'ch5', number: 2, title: 'Metáforas e Analogias', description: 'Como usar metáforas para tornar ideias complexas acessíveis.', sessionType: 'scenario_drill', durationMinutes: 25 },
      { id: 'ch5-s3', chapterId: 'ch5', number: 3, title: 'Escrita Persuasiva', description: 'Redige uma proposta persuasiva de 200 palavras.', sessionType: 'writing', durationMinutes: 25 },
      { id: 'ch5-s4', chapterId: 'ch5', number: 4, title: 'Prática com IA: Pitch', description: 'Pratica o teu pitch de produto ou ideia com feedback da IA.', sessionType: 'ai_chat', durationMinutes: 25 },
      { id: 'ch5-s5', chapterId: 'ch5', number: 5, title: 'Teste de Vocabulário', description: 'Avaliação do vocabulário adquirido neste capítulo.', sessionType: 'multiple_choice', durationMinutes: 15 },
    ],
  },
  {
    id: 'ch6',
    number: 6,
    title: 'Professional Scenarios',
    description: 'Aplicação em contextos reais: reuniões, negociações, apresentações.',
    isDiagnostic: false,
    totalSessions: 8,
    sessions: [
      { id: 'ch6-s1', chapterId: 'ch6', number: 1, title: 'Negociação em Inglês', description: 'Técnicas e frases para negociações win-win.', sessionType: 'reading', durationMinutes: 30 },
      { id: 'ch6-s2', chapterId: 'ch6', number: 2, title: 'Simulação: Negociação', description: 'Role-play de uma negociação de contrato com a IA.', sessionType: 'scenario_drill', durationMinutes: 30 },
      { id: 'ch6-s3', chapterId: 'ch6', number: 3, title: 'Reuniões de Alto Nível', description: 'Chamar à ordem, resumir e conduzir reuniões.', sessionType: 'reading', durationMinutes: 25 },
      { id: 'ch6-s4', chapterId: 'ch6', number: 4, title: 'Gravação: Reunião Simulada', description: 'Grava a tua participação numa reunião executiva simulada.', sessionType: 'audio_recording', durationMinutes: 25 },
      { id: 'ch6-s5', chapterId: 'ch6', number: 5, title: 'Email de Follow-up', description: 'Redige emails de follow-up eficazes pós-reunião.', sessionType: 'writing', durationMinutes: 20 },
      { id: 'ch6-s6', chapterId: 'ch6', number: 6, title: 'Prática Conversacional', description: 'Pratica cenários profissionais com o assistente IA.', sessionType: 'ai_chat', durationMinutes: 25 },
      { id: 'ch6-s7', chapterId: 'ch6', number: 7, title: 'Quiz: Cenários Profissionais', description: 'Testa o teu conhecimento de cenários profissionais.', sessionType: 'multiple_choice', durationMinutes: 15 },
      { id: 'ch6-s8', chapterId: 'ch6', number: 8, title: 'Aula com Professora #3', description: 'Sessão de role-play e feedback em cenários profissionais.', sessionType: 'professor_session', durationMinutes: 45 },
    ],
  },
  {
    id: 'ch7',
    number: 7,
    title: 'Presentations & Pitching',
    description: 'Apresentações de alto impacto e pitches que convencem.',
    isDiagnostic: false,
    totalSessions: 5,
    sessions: [
      { id: 'ch7-s1', chapterId: 'ch7', number: 1, title: 'Estrutura de Apresentações', description: 'O modelo TED e outras estruturas de apresentação poderosas.', sessionType: 'reading', durationMinutes: 25 },
      { id: 'ch7-s2', chapterId: 'ch7', number: 2, title: 'Storytelling Executivo', description: 'Como usar narrativas para engajar audiências profissionais.', sessionType: 'scenario_drill', durationMinutes: 30 },
      { id: 'ch7-s3', chapterId: 'ch7', number: 3, title: 'Gravação: Apresentação de 3 min', description: 'Apresenta um tema à tua escolha durante 3 minutos.', sessionType: 'audio_recording', durationMinutes: 30 },
      { id: 'ch7-s4', chapterId: 'ch7', number: 4, title: 'Q&A de Alta Pressão', description: 'Responde a perguntas difíceis com clareza e confiança.', sessionType: 'ai_chat', durationMinutes: 25 },
      { id: 'ch7-s5', chapterId: 'ch7', number: 5, title: 'Reflexão: Evolução da Presença', description: 'Avalia a evolução da tua presença em apresentações.', sessionType: 'reflection', durationMinutes: 15 },
    ],
  },
  {
    id: 'ch8',
    number: 8,
    title: 'Difficult Conversations',
    description: 'Navega conversas difíceis com diplomacia e assertividade.',
    isDiagnostic: false,
    totalSessions: 8,
    sessions: [
      { id: 'ch8-s1', chapterId: 'ch8', number: 1, title: 'Comunicação Assertiva', description: 'O equilíbrio entre assertividade e diplomacia.', sessionType: 'reading', durationMinutes: 20 },
      { id: 'ch8-s2', chapterId: 'ch8', number: 2, title: 'Dar Feedback Construtivo', description: 'Frameworks para dar e receber feedback profissional.', sessionType: 'scenario_drill', durationMinutes: 25 },
      { id: 'ch8-s3', chapterId: 'ch8', number: 3, title: 'Desacordo Profissional', description: 'Como discordar com respeito e clareza.', sessionType: 'ai_chat', durationMinutes: 25 },
      { id: 'ch8-s4', chapterId: 'ch8', number: 4, title: 'Gravação: Conversa Difícil', description: 'Role-play de uma conversa difícil gravada.', sessionType: 'audio_recording', durationMinutes: 25 },
      { id: 'ch8-s5', chapterId: 'ch8', number: 5, title: 'Gestão de Conflito', description: 'Técnicas de de-escalada em situações tensas.', sessionType: 'reading', durationMinutes: 20 },
      { id: 'ch8-s6', chapterId: 'ch8', number: 6, title: 'Escrita: Email Difícil', description: 'Redige um email a abordar uma situação sensível.', sessionType: 'writing', durationMinutes: 20 },
      { id: 'ch8-s7', chapterId: 'ch8', number: 7, title: 'Quiz: Conversas Difíceis', description: 'Avalia a compreensão das técnicas estudadas.', sessionType: 'multiple_choice', durationMinutes: 15 },
      { id: 'ch8-s8', chapterId: 'ch8', number: 8, title: 'Aula com Professora #4', description: 'Simulação de conversas difíceis com feedback imediato.', sessionType: 'professor_session', durationMinutes: 45 },
    ],
  },
  {
    id: 'ch9',
    number: 9,
    title: 'Advanced Fluency',
    description: 'Fluência avançada em contextos de alta exigência profissional.',
    isDiagnostic: false,
    totalSessions: 5,
    sessions: [
      { id: 'ch9-s1', chapterId: 'ch9', number: 1, title: 'Comunicação Oral Avançada', description: 'Fluência, pronúncia e expressões idiomáticas.', sessionType: 'reading', durationMinutes: 30 },
      { id: 'ch9-s2', chapterId: 'ch9', number: 2, title: 'Gravação: Discurso Espontâneo', description: 'Fala durante 2 minutos sobre um tema inesperado.', sessionType: 'audio_recording', durationMinutes: 25 },
      { id: 'ch9-s3', chapterId: 'ch9', number: 3, title: 'Debate com IA', description: 'Debate um tema controverso com o assistente IA.', sessionType: 'ai_chat', durationMinutes: 30 },
      { id: 'ch9-s4', chapterId: 'ch9', number: 4, title: 'Negociação Estratégica', description: 'BATNA, ZOPA e técnicas de negociação avançada.', sessionType: 'scenario_drill', durationMinutes: 30 },
      { id: 'ch9-s5', chapterId: 'ch9', number: 5, title: 'Reflexão: Evolução Total', description: 'Avalia a evolução completa desde o início do programa.', sessionType: 'reflection', durationMinutes: 20 },
    ],
  },
  {
    id: 'ch10',
    number: 10,
    title: 'Mastery & Certification',
    description: 'Capítulo final: demonstra a tua mestria e recebe a tua certificação.',
    isDiagnostic: false,
    totalSessions: 5,
    sessions: [
      { id: 'ch10-s1', chapterId: 'ch10', number: 1, title: 'Liderança & Influência', description: 'Comunicação de líderes de topo: visão, accountability e inspiração.', sessionType: 'reading', durationMinutes: 30 },
      { id: 'ch10-s2', chapterId: 'ch10', number: 2, title: 'Gravação Final: Executive Speech', description: 'Apresentação de 5 minutos demonstrando toda a evolução.', sessionType: 'audio_recording', durationMinutes: 35 },
      { id: 'ch10-s3', chapterId: 'ch10', number: 3, title: 'Avaliação Final', description: 'Avaliação abrangente de todas as competências desenvolvidas.', sessionType: 'multiple_choice', durationMinutes: 25 },
      { id: 'ch10-s4', chapterId: 'ch10', number: 4, title: 'Reflexão de Mastery', description: 'Reflexão profunda sobre o percurso e os próximos passos.', sessionType: 'reflection', durationMinutes: 20 },
      { id: 'ch10-s5', chapterId: 'ch10', number: 5, title: 'Aula de Certificação', description: 'Sessão final com a professora — entrega da certificação VOICE³.', sessionType: 'professor_session', durationMinutes: 60 },
    ],
  },
];

export const getChapterById = (id: string) => chaptersData.find(c => c.id === id);
export const getSessionById = (id: string) => {
  for (const chapter of chaptersData) {
    const session = chapter.sessions.find(s => s.id === id);
    if (session) return session;
  }
  return null;
};

export const sessionTypeLabels: Record<Session['sessionType'], string> = {
  diagnostic: '🎯 Diagnóstico',
  reading: '📖 Leitura',
  ai_chat: '🤖 Chat IA',
  writing: '✍️ Escrita',
  audio_recording: '🎙️ Gravação',
  scenario_drill: '🎭 Simulação',
  multiple_choice: '☑️ Quiz',
  reflection: '💭 Reflexão',
  professor_session: '👩‍🏫 Aula com Professora',
};

export const sessionTypeColors: Record<Session['sessionType'], string> = {
  diagnostic: 'text-purple-400 bg-purple-400/10',
  reading: 'text-blue-400 bg-blue-400/10',
  ai_chat: 'text-cyan-400 bg-cyan-400/10',
  writing: 'text-green-400 bg-green-400/10',
  audio_recording: 'text-red-400 bg-red-400/10',
  scenario_drill: 'text-orange-400 bg-orange-400/10',
  multiple_choice: 'text-yellow-400 bg-yellow-400/10',
  reflection: 'text-pink-400 bg-pink-400/10',
  professor_session: 'text-amber-400 bg-amber-400/10',
};
