export interface Session {
  id: string;
  chapterId: string;
  number: number;
  title: string;
  description: string;
  sessionType: 'diagnostic' | 'briefing' | 'drill' | 'simulation' | 'error_bank' | 'professor_session';
  durationMinutes: number;
  arsenalPhrases?: string[];
  aiPersona?: string;
  leadershipCompetency?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  programme: string;
  pillar: string;
  targetLevel: string;
  isDiagnostic: boolean;
  totalSessions: number;
  sessions: Session[];
}

// ═══════════════════════════════════════════════════════════
// VOICE³ Programme Architecture — 6 Core Programmes
// Based on the VOICE³ VAULT (March 2026)
//
// Each micro-chapter = 4 sessions:
//   1. Briefing (Input) — Scenario + Arsenal phrases
//   2. Drill (Accuracy) — Controlled practice with AI correction
//   3. Simulation (Fluency) — Pressure roleplay with Shadow Coach
//   4. Error Bank (Correction) — Review + Vault Save
//
// Programme → 10 Chapters → 4 Sessions each = 40 sessions per programme
// ═══════════════════════════════════════════════════════════

function buildMicroChapter(
  chId: string,
  chNum: number,
  programme: string,
  pillar: string,
  targetLevel: string,
  title: string,
  desc: string,
  arsenal: string[],
  aiPersona: string,
  competency: string,
): Chapter {
  return {
    id: chId,
    number: chNum,
    title,
    description: desc,
    programme,
    pillar,
    targetLevel,
    isDiagnostic: false,
    totalSessions: 4,
    sessions: [
      {
        id: `${chId}-s1`, chapterId: chId, number: 1,
        title: `Briefing: ${title}`,
        description: `Cenário executivo + Arsenal de frases para ${title.toLowerCase()}.`,
        sessionType: 'briefing', durationMinutes: 15,
        arsenalPhrases: arsenal, aiPersona, leadershipCompetency: competency,
      },
      {
        id: `${chId}-s2`, chapterId: chId, number: 2,
        title: `Drill: ${title}`,
        description: `Prática controlada com correção imediata da IA.`,
        sessionType: 'drill', durationMinutes: 15,
        aiPersona, leadershipCompetency: competency,
      },
      {
        id: `${chId}-s3`, chapterId: chId, number: 3,
        title: `Simulação: ${title}`,
        description: `Roleplay de pressão com cenário real. Shadow Coach activo.`,
        sessionType: 'simulation', durationMinutes: 20,
        aiPersona, leadershipCompetency: competency,
      },
      {
        id: `${chId}-s4`, chapterId: chId, number: 4,
        title: `Error Bank & Vault`,
        description: `Revisão de erros, correções e gravação no teu Language Vault.`,
        sessionType: 'error_bank', durationMinutes: 10,
        leadershipCompetency: competency,
      },
    ],
  };
}

export const chaptersData: Chapter[] = [
  // ═══ CAPÍTULO 0: DIAGNÓSTICO ═══
  {
    id: 'ch0',
    number: 0,
    title: 'Diagnóstico Executivo',
    description: 'Avaliação inicial: Intake Form adaptativo + Spoken Authority Baseline para personalizar o teu percurso.',
    programme: 'DIAGNOSTIC',
    pillar: 'Assessment',
    targetLevel: 'All',
    isDiagnostic: true,
    totalSessions: 1,
    sessions: [
      {
        id: 'ch0-s1', chapterId: 'ch0', number: 1,
        title: 'Spoken Authority Baseline',
        description: 'Cenário de 60 segundos sob pressão. A IA analisa fluência, vocabulário, gramática e presença executiva.',
        sessionType: 'diagnostic', durationMinutes: 30,
      },
    ],
  },

  // ═══ DEFEND — Anchor Tone (Courage & Firmness) ═══
  buildMicroChapter('ch1', 1, 'DEFEND', 'Anchor', 'B2/C1',
    'A Recusa Diplomática',
    'Dizer "não" com autoridade sem destruir a relação. Modelo "Positive No" de William Ury.',
    [
      '"I understand the urgency, and I need to be transparent about our capacity."',
      '"I appreciate you thinking of us for this. Right now, our priority is [X]."',
      '"Let me suggest an alternative that works for both sides."',
    ],
    'The Challenger', 'Courage & Firmness',
  ),
  buildMicroChapter('ch2', 2, 'DEFEND', 'Anchor', 'B2/C1',
    'Defender Scope em Reuniões',
    'Manter limites claros quando pressionado para aceitar mais trabalho ou prazos irrealistas.',
    [
      '"That falls outside the agreed scope. Let me walk you through what we committed to."',
      '"I want to deliver quality, and adding this would compromise our timeline."',
      '"If we add this, something else needs to come off. Which priority should we adjust?"',
    ],
    'The Challenger', 'Accountability',
  ),
  buildMicroChapter('ch3', 3, 'DEFEND', 'Anchor', 'C1',
    'Q&A Hostil',
    'Responder a perguntas difíceis e provocativas com compostura e clareza.',
    [
      '"That\'s a fair challenge. Let me address it directly."',
      '"I hear the concern behind your question. The data shows..."',
      '"Rather than speculate, let me share what we know for certain."',
    ],
    'The Challenger', 'Stakeholder Awareness',
  ),

  // ═══ TRANSLATE — Analyst Tone (Clear Articulation) ═══
  buildMicroChapter('ch4', 4, 'TRANSLATE', 'Analyst', 'B1/B2',
    'Explicar Complexidade Técnica',
    'Traduzir conceitos técnicos para stakeholders não-técnicos sem jargão.',
    [
      '"Before we had [old way]. Now, [new way]. What this means for your team is..."',
      '"Think of it like [analogy]. The impact on your timeline is..."',
      '"In practical terms, this translates to [concrete outcome] by [date]."',
    ],
    'The Analyst', 'Articulation',
  ),
  buildMicroChapter('ch5', 5, 'TRANSLATE', 'Analyst', 'B2',
    'Apresentação de Dados a Executivos',
    'Comunicar resultados e métricas de forma clara e accionável.',
    [
      '"The key takeaway is [insight]. This matters because [business impact]."',
      '"Looking at the trend, we\'re seeing [pattern]. My recommendation is..."',
      '"Three numbers you need to know: [X], [Y], and [Z]. Here\'s why."',
    ],
    'The Analyst', 'Vision',
  ),
  buildMicroChapter('ch6', 6, 'TRANSLATE', 'Analyst', 'B2/C1',
    'Reportar Problemas ao Board',
    'Comunicar más notícias de forma estruturada sem criar pânico.',
    [
      '"I want to flag something early so we can address it proactively."',
      '"The situation is [X]. The risk is [Y]. Our mitigation plan is [Z]."',
      '"To be transparent, we\'re behind on [metric]. Here\'s our recovery plan."',
    ],
    'The Analyst', 'Commitment',
  ),

  // ═══ LEAD — Collaborator Tone (Empathy & Trust) ═══
  buildMicroChapter('ch7', 7, 'LEAD', 'Collaborator', 'C1/C2',
    'Feedback Construtivo',
    'Dar feedback crítico preservando a relação e motivando melhoria.',
    [
      '"I\'ve noticed a tendency to [behavior]. The impact might be [effect]."',
      '"This might be coming across as [perception]. How can we calibrate?"',
      '"What I appreciate is [strength]. Where I see an opportunity is [area]."',
    ],
    'The Collaborator', 'Empathy',
  ),
  buildMicroChapter('ch8', 8, 'LEAD', 'Collaborator', 'C1',
    'Liderar Reuniões de Equipa',
    'Conduzir reuniões produtivas, gerir participação e chegar a decisões.',
    [
      '"Before we move on, I want to make sure everyone\'s been heard."',
      '"Let\'s capture this as an action item. [Name], can you own this by [date]?"',
      '"I\'m sensing some hesitation. Let\'s surface that before we commit."',
    ],
    'The Collaborator', 'Collaboration',
  ),
  buildMicroChapter('ch9', 9, 'LEAD', 'Collaborator', 'C1/C2',
    'Conversas Difíceis',
    'Navegar conflitos interpessoais com diplomacia e assertividade equilibrada.',
    [
      '"I want to address something directly because I value this relationship."',
      '"From my perspective, the breakdown happened at [point]. What\'s your read?"',
      '"How can we move forward in a way that works for both of us?"',
    ],
    'The Collaborator', 'Trust-Building',
  ),

  // ═══ CAPSTONE: Sessão com Professora ═══
  {
    id: 'ch10',
    number: 10,
    title: 'Capstone & Certificação',
    description: 'Simulação final sem guião + feedback do professor + certificação VOICE³.',
    programme: 'CAPSTONE',
    pillar: 'All',
    targetLevel: 'C1/C2',
    isDiagnostic: false,
    totalSessions: 2,
    sessions: [
      {
        id: 'ch10-s1', chapterId: 'ch10', number: 1,
        title: 'Simulação Capstone',
        description: 'Cenário de alta pressão sem guião. Demonstra todas as competências adquiridas.',
        sessionType: 'simulation', durationMinutes: 30,
        leadershipCompetency: 'Executive Presence',
      },
      {
        id: 'ch10-s2', chapterId: 'ch10', number: 2,
        title: 'Sessão de Certificação',
        description: 'Sessão final com a professora — revisão do percurso e entrega da certificação VOICE³.',
        sessionType: 'professor_session', durationMinutes: 60,
        leadershipCompetency: 'Executive Presence',
      },
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
  briefing: '📖 Briefing',
  drill: '🎯 Drill',
  simulation: '🎭 Simulação',
  error_bank: '📝 Error Bank',
  professor_session: '👩‍🏫 Aula com Professora',
};

export const sessionTypeColors: Record<Session['sessionType'], string> = {
  diagnostic: 'text-purple-400 bg-purple-400/10',
  briefing: 'text-blue-400 bg-blue-400/10',
  drill: 'text-cyan-400 bg-cyan-400/10',
  simulation: 'text-orange-400 bg-orange-400/10',
  error_bank: 'text-green-400 bg-green-400/10',
  professor_session: 'text-amber-400 bg-amber-400/10',
};

// Programme metadata
export const programmes = [
  { id: 'DEFEND', name: 'DEFEND', tone: 'Anchor', color: '#ef4444', description: 'Autoridade sob pressão, Q&A hostil, limites claros', competency: 'Courage & Firmness' },
  { id: 'TRANSLATE', name: 'TRANSLATE', tone: 'Analyst', color: '#3b82f6', description: 'Clareza técnica, dados para executivos, explicação simplificada', competency: 'Clear Articulation' },
  { id: 'LEAD', name: 'LEAD', tone: 'Collaborator', color: '#10b981', description: 'Feedback, liderança de equipa, conversas difíceis', competency: 'Empathy & Trust' },
  { id: 'OPERATE', name: 'OPERATE', tone: 'Commander', color: '#f59e0b', description: 'Reuniões diárias, negociação com fornecedores, updates de projecto', competency: 'Accountability' },
  { id: 'DECODE', name: 'DECODE', tone: 'Listener', color: '#8b5cf6', description: 'Compreensão de sotaques, idioms, linguagem rápida', competency: 'Stakeholder Awareness' },
  { id: 'PREPARE', name: 'PREPARE', tone: 'All', color: '#ec4899', description: 'Sprint de 3-5 capítulos para eventos urgentes (entrevistas, keynotes, pitches)', competency: 'Adaptability' },
];

// AI Tone profiles
export const toneProfiles = [
  { id: 'diplomat', name: 'Diplomat', description: 'Alta-contexto, suavizado. Para clientes VIP e negociações delicadas.', style: 'Hedging, condicionais, linguagem indirecta' },
  { id: 'anchor', name: 'Anchor', description: 'Firme, assertivo. Para defesa de limites e scope creep.', style: 'Limites claros, sem hedging, directo' },
  { id: 'american_direct', name: 'American Direct', description: 'Baixa-contexto, orientado à acção. Para boards americanos e bad news.', style: 'Bottom-line first, zero preâmbulo' },
  { id: 'collaborator', name: 'Collaborator', description: 'Inclusivo, orientado à equipa. Para liderar equipas e cross-functional.', style: 'Pronomes "we", perguntas abertas' },
];
