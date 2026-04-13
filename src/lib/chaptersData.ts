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
//
// Each micro-chapter = 4 sessions:
//   1. Briefing (Input) — Scenario + Arsenal phrases
//   2. Drill (Accuracy) — Controlled practice with AI correction
//   3. Simulation (Fluency) — Pressure roleplay with Shadow Coach
//   4. Error Bank (Correction) — Review + Vault Save
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
        description: `Executive scenario + Key phrases for ${title.toLowerCase()}.`,
        sessionType: 'briefing', durationMinutes: 15,
        arsenalPhrases: arsenal, aiPersona, leadershipCompetency: competency,
      },
      {
        id: `${chId}-s2`, chapterId: chId, number: 2,
        title: `Drill: ${title}`,
        description: `Controlled practice with immediate AI correction.`,
        sessionType: 'drill', durationMinutes: 15,
        aiPersona, leadershipCompetency: competency,
      },
      {
        id: `${chId}-s3`, chapterId: chId, number: 3,
        title: `Simulation: ${title}`,
        description: `Pressure roleplay with a realistic scenario. Shadow Coach active.`,
        sessionType: 'simulation', durationMinutes: 20,
        aiPersona, leadershipCompetency: competency,
      },
      {
        id: `${chId}-s4`, chapterId: chId, number: 4,
        title: `Error Bank & Vault`,
        description: `Review errors, corrections and save key phrases to your Language Vault.`,
        sessionType: 'error_bank', durationMinutes: 10,
        leadershipCompetency: competency,
      },
    ],
  };
}

export const chaptersData: Chapter[] = [
  // ═══ CHAPTER 0: DIAGNOSTIC ═══
  {
    id: 'ch0',
    number: 0,
    title: 'Executive Diagnostic',
    description: 'Initial assessment: Adaptive Intake Form + Spoken Authority Baseline to personalise your learning path.',
    programme: 'DIAGNOSTIC',
    pillar: 'Assessment',
    targetLevel: 'All',
    isDiagnostic: true,
    totalSessions: 1,
    sessions: [
      {
        id: 'ch0-s1', chapterId: 'ch0', number: 1,
        title: 'Spoken Authority Baseline',
        description: '60-second pressure scenario. AI analyses fluency, vocabulary, grammar and executive presence.',
        sessionType: 'diagnostic', durationMinutes: 30,
      },
    ],
  },

  // ═══ DEFEND — Anchor Tone (Courage & Firmness) ═══
  buildMicroChapter('ch1', 1, 'DEFEND', 'Anchor', 'B2/C1',
    'The Diplomatic Refusal',
    'Say "no" with authority without damaging the relationship. William Ury\'s "Positive No" framework.',
    [
      '"I understand the urgency, and I need to be transparent about our capacity."',
      '"I appreciate you thinking of us for this. Right now, our priority is [X]."',
      '"Let me suggest an alternative that works for both sides."',
    ],
    'The Challenger', 'Courage & Firmness',
  ),
  buildMicroChapter('ch2', 2, 'DEFEND', 'Anchor', 'B2/C1',
    'Defending Scope in Meetings',
    'Hold clear boundaries when pressured to accept more work or unrealistic deadlines.',
    [
      '"That falls outside the agreed scope. Let me walk you through what we committed to."',
      '"I want to deliver quality, and adding this would compromise our timeline."',
      '"If we add this, something else needs to come off. Which priority should we adjust?"',
    ],
    'The Challenger', 'Accountability',
  ),
  buildMicroChapter('ch3', 3, 'DEFEND', 'Anchor', 'C1',
    'Hostile Q&A',
    'Respond to difficult and provocative questions with composure and clarity.',
    [
      '"That\'s a fair challenge. Let me address it directly."',
      '"I hear the concern behind your question. The data shows..."',
      '"Rather than speculate, let me share what we know for certain."',
    ],
    'The Challenger', 'Stakeholder Awareness',
  ),

  // ═══ TRANSLATE — Analyst Tone (Clear Articulation) ═══
  buildMicroChapter('ch4', 4, 'TRANSLATE', 'Analyst', 'B1/B2',
    'Explaining Technical Complexity',
    'Translate technical concepts for non-technical stakeholders without jargon.',
    [
      '"Before we had [old way]. Now, [new way]. What this means for your team is..."',
      '"Think of it like [analogy]. The impact on your timeline is..."',
      '"In practical terms, this translates to [concrete outcome] by [date]."',
    ],
    'The Analyst', 'Articulation',
  ),
  buildMicroChapter('ch5', 5, 'TRANSLATE', 'Analyst', 'B2',
    'Presenting Data to Executives',
    'Communicate results and metrics clearly and actionably.',
    [
      '"The key takeaway is [insight]. This matters because [business impact]."',
      '"Looking at the trend, we\'re seeing [pattern]. My recommendation is..."',
      '"Three numbers you need to know: [X], [Y], and [Z]. Here\'s why."',
    ],
    'The Analyst', 'Vision',
  ),
  buildMicroChapter('ch6', 6, 'TRANSLATE', 'Analyst', 'B2/C1',
    'Reporting Problems to the Board',
    'Communicate bad news in a structured way without creating panic.',
    [
      '"I want to flag something early so we can address it proactively."',
      '"The situation is [X]. The risk is [Y]. Our mitigation plan is [Z]."',
      '"To be transparent, we\'re behind on [metric]. Here\'s our recovery plan."',
    ],
    'The Analyst', 'Commitment',
  ),

  // ═══ LEAD — Collaborator Tone (Empathy & Trust) ═══
  buildMicroChapter('ch7', 7, 'LEAD', 'Collaborator', 'C1/C2',
    'Constructive Feedback',
    'Give critical feedback while preserving the relationship and motivating improvement.',
    [
      '"I\'ve noticed a tendency to [behavior]. The impact might be [effect]."',
      '"This might be coming across as [perception]. How can we calibrate?"',
      '"What I appreciate is [strength]. Where I see an opportunity is [area]."',
    ],
    'The Collaborator', 'Empathy',
  ),
  buildMicroChapter('ch8', 8, 'LEAD', 'Collaborator', 'C1',
    'Leading Team Meetings',
    'Run productive meetings, manage participation and reach decisions.',
    [
      '"Before we move on, I want to make sure everyone\'s been heard."',
      '"Let\'s capture this as an action item. [Name], can you own this by [date]?"',
      '"I\'m sensing some hesitation. Let\'s surface that before we commit."',
    ],
    'The Collaborator', 'Collaboration',
  ),
  buildMicroChapter('ch9', 9, 'LEAD', 'Collaborator', 'C1/C2',
    'Difficult Conversations',
    'Navigate interpersonal conflicts with diplomacy and balanced assertiveness.',
    [
      '"I want to address something directly because I value this relationship."',
      '"From my perspective, the breakdown happened at [point]. What\'s your read?"',
      '"How can we move forward in a way that works for both of us?"',
    ],
    'The Collaborator', 'Trust-Building',
  ),

  // ═══ CAPSTONE: Final Assessment ═══
  {
    id: 'ch10',
    number: 10,
    title: 'Capstone & Certification',
    description: 'Unscripted final simulation + coach feedback + VOICE³ certification.',
    programme: 'CAPSTONE',
    pillar: 'All',
    targetLevel: 'C1/C2',
    isDiagnostic: false,
    totalSessions: 2,
    sessions: [
      {
        id: 'ch10-s1', chapterId: 'ch10', number: 1,
        title: 'Capstone Simulation',
        description: 'High-pressure unscripted scenario. Demonstrate all acquired competencies.',
        sessionType: 'simulation', durationMinutes: 30,
        leadershipCompetency: 'Executive Presence',
      },
      {
        id: 'ch10-s2', chapterId: 'ch10', number: 2,
        title: 'Certification Session',
        description: 'Final session with your coach — review your journey and receive your VOICE³ certificate.',
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
  diagnostic: 'Diagnostic',
  briefing: 'Briefing',
  drill: 'Drill',
  simulation: 'Simulation',
  error_bank: 'Error Bank',
  professor_session: 'Live Coach Session',
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
  { id: 'DEFEND', name: 'DEFEND', tone: 'Anchor', color: '#ef4444', description: 'Authority under pressure, hostile Q&A, setting boundaries', competency: 'Courage & Firmness' },
  { id: 'TRANSLATE', name: 'TRANSLATE', tone: 'Analyst', color: '#3b82f6', description: 'Technical clarity, data for executives, simplified explanation', competency: 'Clear Articulation' },
  { id: 'LEAD', name: 'LEAD', tone: 'Collaborator', color: '#10b981', description: 'Feedback, team leadership, difficult conversations', competency: 'Empathy & Trust' },
  { id: 'OPERATE', name: 'OPERATE', tone: 'Commander', color: '#f59e0b', description: 'Daily standups, supplier negotiation, project updates', competency: 'Accountability' },
  { id: 'DECODE', name: 'DECODE', tone: 'Listener', color: '#8b5cf6', description: 'Accent comprehension, idioms, fast speech processing', competency: 'Stakeholder Awareness' },
  { id: 'PREPARE', name: 'PREPARE', tone: 'All', color: '#ec4899', description: '3-5 chapter sprint for urgent events (interviews, keynotes, pitches)', competency: 'Adaptability' },
];

// AI Tone profiles
export const toneProfiles = [
  { id: 'diplomat', name: 'Diplomat', description: 'High-context, softened. For VIP clients and delicate negotiations.', style: 'Hedging, conditionals, indirect language' },
  { id: 'anchor', name: 'Anchor', description: 'Firm, assertive. For defending boundaries and scope creep.', style: 'Clear limits, no hedging, direct' },
  { id: 'american_direct', name: 'American Direct', description: 'Low-context, action-oriented. For American boards and bad news.', style: 'Bottom-line first, zero preamble' },
  { id: 'collaborator', name: 'Collaborator', description: 'Inclusive, team-oriented. For leading teams and cross-functional work.', style: '"We" pronouns, open questions' },
];
