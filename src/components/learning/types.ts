/**
 * 5-Stage Learning Loop Type Definitions
 * Comprehensive types for all learning components
 */

// ============================================================================
// LEARNING LOOP PROGRESS TYPES
// ============================================================================

export type StageNumber = 1 | 2 | 3 | 4 | 5;

export interface LearningLoopProgressProps {
  currentStage: StageNumber;
  completedStages: number[];
}

// ============================================================================
// BRIEFING STAGE TYPES
// ============================================================================

export interface BriefingData {
  title: string;
  framework: string;
  content: string;
  diagramUrl?: string;
}

export interface BriefingStageProps {
  title: string;
  framework: string;
  content: string;
  diagramUrl?: string;
  onComplete: () => void;
}

// ============================================================================
// DRILL STAGE TYPES
// ============================================================================

export interface DrillData {
  instruction: string;
  example: string;
}

export interface DrillStageProps {
  instruction: string;
  example: string;
  onComplete: () => void;
}

export interface EvaluationResult {
  score: number;
  breakdown: {
    grammar: number;
    vocabulary: number;
    tone: number;
    clarity: number;
  };
  strengths: string[];
  improvements: string[];
}

export interface EvaluationCriteria {
  grammar: {
    label: string;
    weight: number;
  };
  vocabulary: {
    label: string;
    weight: number;
  };
  tone: {
    label: string;
    weight: number;
  };
  clarity: {
    label: string;
    weight: number;
  };
}

// ============================================================================
// SIMULATION STAGE TYPES
// ============================================================================

export interface SimulationData {
  scenario: string;
  character: string;
}

export interface SimulationStageProps {
  scenario: string;
  character: string;
  onComplete: () => void;
}

export interface ChatMessage {
  id: string;
  role: "student" | "coach";
  content: string;
  timestamp?: Date;
}

export interface SimulationFeedback {
  exchangeCount: number;
  communicationQuality: "excellent" | "good" | "fair" | "poor";
  errorsCaptured: number;
  performanceNotes?: string[];
}

// ============================================================================
// ERROR BANK STAGE TYPES
// ============================================================================

export interface ErrorEntry {
  id: string;
  error: string;
  reason: string;
  correction: string;
  errorType?: "grammar" | "vocabulary" | "tone" | "clarity";
  difficulty?: "easy" | "medium" | "hard";
}

export interface ErrorBankStageProps {
  errors?: ErrorEntry[];
  onComplete: () => void;
}

export interface ErrorStats {
  total: number;
  reviewed: number;
  needsPractice: number;
}

// ============================================================================
// VAULT STAGE TYPES
// ============================================================================

export interface PhraseEntry {
  id: string;
  phrase: string;
  context: string;
  effectiveness: string;
  category?: "formal" | "casual" | "academic" | "professional";
  usageFrequency?: number;
}

export interface VaultStageProps {
  phrases?: PhraseEntry[];
  onComplete: () => void;
}

export interface VaultStats {
  totalPhrases: number;
  favouritedPhrases: number;
  phrasesByCategory?: Record<string, number>;
}

// ============================================================================
// MICRO CHAPTER PLAYER TYPES
// ============================================================================

export interface ChapterData {
  title: string;
  briefing: BriefingData;
  drill: DrillData;
  simulation: SimulationData;
  errors: ErrorEntry[];
  vault: PhraseEntry[];
}

export interface MicroChapterPlayerProps {
  chapterData: ChapterData;
  onComplete?: () => void;
  onStageChange?: (stage: StageNumber) => void;
}

export interface ChapterProgress {
  currentStage: StageNumber;
  completedStages: number[];
  totalStages: number;
  percentageComplete: number;
}

export interface ChapterAchievements {
  conceptsLearned: number;
  skillsPracticed: number;
  errorsReviewed: number;
  phrasesMastered: number;
  totalTime?: number; // in seconds
  completedAt?: Date;
}

// ============================================================================
// EVALUATION SYSTEM TYPES
// ============================================================================

export interface ScoreRange {
  min: number;
  max: number;
  label: string;
  color: string;
}

export const SCORE_RANGES: ScoreRange[] = [
  {
    min: 0,
    max: 59,
    label: "Needs Improvement",
    color: "text-red-400",
  },
  {
    min: 60,
    max: 69,
    label: "Fair",
    color: "text-orange-400",
  },
  {
    min: 70,
    max: 79,
    label: "Good",
    color: "text-yellow-400",
  },
  {
    min: 80,
    max: 100,
    label: "Excellent",
    color: "text-emerald-400",
  },
];

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface StudentResponse {
  stageNumber: StageNumber;
  responseText: string;
  timestamp: Date;
  duration?: number; // time spent on stage
}

export interface ChapterSession {
  chapterId: string;
  studentId: string;
  startTime: Date;
  endTime?: Date;
  responses: StudentResponse[];
  evaluations: Map<StageNumber, EvaluationResult>;
  progress: ChapterProgress;
  achievements?: ChapterAchievements;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface LearningLoopConfig {
  enableVoiceRecording: boolean;
  maxAttemptsPerStage: number;
  minScoreToProgress: number;
  animationDuration: number;
  autoAdvanceAfterScore: boolean;
  autoAdvanceDelay: number;
}

export const DEFAULT_CONFIG: LearningLoopConfig = {
  enableVoiceRecording: false,
  maxAttemptsPerStage: 3,
  minScoreToProgress: 70,
  animationDuration: 0.4,
  autoAdvanceAfterScore: false,
  autoAdvanceDelay: 2000,
};

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type AnimationVariant = "bounce" | "slide" | "fade" | "scale";

export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease?: "easeIn" | "easeOut" | "easeInOut" | "linear";
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
}

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: "#D4AF37",
  secondaryColor: "#1e293b",
  accentColor: "#D4AF37",
  successColor: "#10b981",
  warningColor: "#f59e0b",
  errorColor: "#ef4444",
};

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type {
  BriefingData,
  BriefingStageProps,
  DrillData,
  DrillStageProps,
  EvaluationResult,
  SimulationData,
  SimulationStageProps,
  ChatMessage,
  ErrorEntry,
  ErrorBankStageProps,
  PhraseEntry,
  VaultStageProps,
  ChapterData,
  MicroChapterPlayerProps,
  ChapterProgress,
  ChapterAchievements,
};
