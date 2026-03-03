/**
 * Shared text scoring utilities for practice tools.
 * Analyzes user-written text for executive communication quality.
 */

export interface TextScore {
  clarity: number;      // 0-25: sentence length in optimal range
  structure: number;    // 0-25: transition words present
  authority: number;    // 0-25: absence of hedging words
  fillerPenalty: number; // 0-25: absence of filler words
  total: number;        // 0-100: sum of all dimensions
}

const TRANSITION_WORDS = [
  "however", "therefore", "furthermore", "in conclusion",
  "firstly", "additionally", "consequently", "moreover",
];

const HEDGING_WORDS = [
  "maybe", "perhaps", "i think", "kind of",
  "sort of", "i guess", "i feel like",
];

const FILLER_PATTERNS = [
  "um", "uh", "like,", "you know", "basically", "actually",
];

export function scoreExecutiveText(text: string): TextScore {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const avgLen = sentences.length > 0 ? words.length / sentences.length : 0;

  // Clarity: optimal sentence length is 10-25 words
  let clarity = 0;
  if (avgLen >= 10 && avgLen <= 25) {
    clarity = 25;
  } else if (avgLen < 10) {
    clarity = Math.round((avgLen / 10) * 25);
  } else {
    clarity = Math.max(0, Math.round(25 - ((avgLen - 25) / 25) * 25));
  }

  // Structure: +5 per transition word found (max 25)
  const lower = text.toLowerCase();
  let structure = 0;
  for (const tw of TRANSITION_WORDS) {
    if (lower.includes(tw)) structure = Math.min(25, structure + 5);
  }

  // Authority: starts at 25, -5 per hedging word
  let authority = 25;
  for (const hw of HEDGING_WORDS) {
    if (lower.includes(hw)) authority = Math.max(0, authority - 5);
  }

  // Filler penalty: starts at 25, -5 per filler pattern found
  let fillerPenalty = 25;
  for (const f of FILLER_PATTERNS) {
    if (lower.includes(f)) fillerPenalty = Math.max(0, fillerPenalty - 5);
  }

  const total = clarity + structure + authority + fillerPenalty;
  return { clarity, structure, authority, fillerPenalty, total };
}

/** Simplified version returning just a total score (0-100) */
export function scoreTextSimple(text: string): number {
  return scoreExecutiveText(text).total;
}
