export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "available" | "coming_soon" | "beta";
  layer: "toolkit" | "progress" | "practice";
  category: string;
}

export interface Layer {
  id: string;
  letter: string; // "A" | "B" | "C"
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  tools: Tool[];
}

export const layersData: Layer[] = [
  {
    id: "toolkit",
    letter: "A",
    name: "MY TOOLKIT",
    subtitle: "On-Demand Utilities",
    description: "Instant tools to solve immediate communication challenges before, during, or after a meeting.",
    icon: "Wrench",
    tools: [
      {
        id: "rescue-mode",
        name: "Rescue Mode",
        description: "Emergency meeting prep in 2 minutes. Get the phrases, vocabulary, and opening script you need right now.",
        icon: "Siren",
        status: "available",
        layer: "toolkit",
        category: "Emergency",
      },
      {
        id: "presentation-upgrade",
        name: "Presentation Upgrade & Rehearsal Studio",
        description: "Paste your slides content, get language upgrades, and rehearse delivery with the AI.",
        icon: "Presentation",
        status: "coming_soon",
        layer: "toolkit",
        category: "Presentations",
      },
      {
        id: "email-tone-translator",
        name: "Email Tone Translator",
        description: "Paste your email draft and get a version that sounds more executive, diplomatic, or assertive.",
        icon: "Mail",
        status: "available",
        layer: "toolkit",
        category: "Writing",
      },
      {
        id: "grammar-on-demand",
        name: "Grammar On Demand",
        description: "Quick-reference grammar library built for executive contexts. No textbook explanations — only real business usage.",
        icon: "BookOpen",
        status: "available",
        layer: "toolkit",
        category: "Language",
      },
      {
        id: "vocabulary-accelerator",
        name: "Vocabulary Accelerator",
        description: "Learn 5 high-impact executive words per day with context sentences and usage examples.",
        icon: "Zap",
        status: "available",
        layer: "toolkit",
        category: "Language",
      },
      {
        id: "meeting-prep-tool",
        name: "Meeting Preparation Tool",
        description: "Enter your meeting agenda and get the language, questions, and structures you need to lead it.",
        icon: "CalendarCheck",
        status: "available",
        layer: "toolkit",
        category: "Meetings",
      },
      {
        id: "ai-coach-persona",
        name: "AI Coach Persona Library",
        description: "Choose your AI coach: The Demanding MD, The Friendly Mentor, The Devil's Advocate, and more.",
        icon: "Bot",
        status: "available",
        layer: "toolkit",
        category: "AI",
      },
      {
        id: "shadow-coach",
        name: "Shadow Coach / Meeting Copilot",
        description: "Real-time language suggestions and post-meeting language debriefs.",
        icon: "Layers",
        status: "available",
        layer: "toolkit",
        category: "AI",
      },
    ],
  },
  {
    id: "progress",
    letter: "B",
    name: "MY PROGRESS",
    subtitle: "Tracking & Reflection",
    description: "Monitor your growth, reflect on your development, and earn recognition for your commitment.",
    icon: "BarChart2",
    tools: [
      {
        id: "voice-dna-profile",
        name: "Voice DNA Profile",
        description: "Your personalised executive communication profile — strengths, gaps, and growth trajectory.",
        icon: "Dna",
        status: "available",
        layer: "progress",
        category: "Profile",
      },
      {
        id: "executive-journal",
        name: "Executive Journal",
        description: "Reflect on each session, log communication wins, and track your language evolution.",
        icon: "NotebookPen",
        status: "available",
        layer: "progress",
        category: "Reflection",
      },
      {
        id: "maintenance-mode",
        name: "Maintenance Mode",
        description: "A lightweight programme to keep your English sharp after completing your main course.",
        icon: "RefreshCw",
        status: "coming_soon",
        layer: "progress",
        category: "Maintenance",
      },
      {
        id: "exec-certification",
        name: "VOICE³ Executive Certification",
        description: "The formal recognition of your executive communication transformation.",
        icon: "Award",
        status: "coming_soon",
        layer: "progress",
        category: "Certification",
      },
    ],
  },
  {
    id: "practice",
    letter: "C",
    name: "MY PRACTICE",
    subtitle: "Simulation & Social",
    description: "Pressure test your communication in safe but demanding simulations and peer environments.",
    icon: "Swords",
    tools: [
      {
        id: "ai-debate-club",
        name: "AI Debate Club",
        description: "Debate hot business topics with the AI. Defend your position, counter-argue, and persuade.",
        icon: "MessageSquare",
        status: "available",
        layer: "practice",
        category: "Debate",
      },
      {
        id: "async-peer-debate",
        name: "Asynchronous Peer Debate",
        description: "Record your argument on a topic, respond to a peer's view, and develop your async communication.",
        icon: "Users",
        status: "available",
        layer: "practice",
        category: "Debate",
      },
      {
        id: "hostile-qa-gauntlet",
        name: "Hostile Q&A Gauntlet",
        description: "The AI will ask aggressive business questions. You have 30 seconds per answer. Filler words cost lives.",
        icon: "Flame",
        status: "available",
        layer: "practice",
        category: "Simulation",
      },
      {
        id: "boardroom-simulation",
        name: "Boardroom Simulation Library",
        description: "Full scenario simulations: investor calls, board presentations, crisis briefings, and more.",
        icon: "Building2",
        status: "coming_soon",
        layer: "practice",
        category: "Simulation",
      },
    ],
  },
];
