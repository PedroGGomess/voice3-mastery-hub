// VOICE³ Persistence Layer — localStorage-based per-user storage

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getStore<T>(key: string, userId: string): T | null {
  try {
    const raw = localStorage.getItem(`voice3_${key}_${userId}`);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function setStore<T>(key: string, userId: string, data: T): void {
  try {
    localStorage.setItem(`voice3_${key}_${userId}`, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

// --- USER PROGRAMMES ---

export interface UserProgramme {
  programmeId: string;
  status: "active" | "completed" | "paused";
  startedAt: string;
  completedAt?: string;
  currentSessionIndex: number;
  sessionsProgress: Record<number, { completed: boolean; score: number; completedAt?: string }>;
}

export function getUserProgrammes(userId: string): UserProgramme[] {
  return getStore<UserProgramme[]>("programmes", userId) || [];
}

export function startProgramme(userId: string, programmeId: string, _totalSessions: number): UserProgramme {
  const programmes = getUserProgrammes(userId);
  const existing = programmes.find(p => p.programmeId === programmeId);
  if (existing) return existing;
  const entry: UserProgramme = {
    programmeId,
    status: "active",
    startedAt: new Date().toISOString(),
    currentSessionIndex: 0,
    sessionsProgress: {},
  };
  programmes.push(entry);
  setStore("programmes", userId, programmes);
  return entry;
}

export function updateProgrammeSession(
  userId: string,
  programmeId: string,
  sessionIndex: number,
  score: number
): void {
  const programmes = getUserProgrammes(userId);
  const prog = programmes.find(p => p.programmeId === programmeId);
  if (!prog) return;
  prog.sessionsProgress[sessionIndex] = {
    completed: true,
    score,
    completedAt: new Date().toISOString(),
  };
  prog.currentSessionIndex = Math.max(prog.currentSessionIndex, sessionIndex + 1);
  setStore("programmes", userId, programmes);
}

export function getProgrammeProgress(userId: string, programmeId: string): UserProgramme | null {
  return getUserProgrammes(userId).find(p => p.programmeId === programmeId) || null;
}

// --- TOOLKIT HISTORY ---

export interface ToolkitEntry {
  id: string;
  toolId: string;
  toolName: string;
  inputs: Record<string, string>;
  outputs: Record<string, unknown>;
  createdAt: string;
}

export function getToolkitHistory(userId: string, toolId?: string): ToolkitEntry[] {
  const all = getStore<ToolkitEntry[]>("toolkit_history", userId) || [];
  if (toolId) return all.filter(e => e.toolId === toolId);
  return all;
}

export function saveToolkitEntry(
  userId: string,
  entry: Omit<ToolkitEntry, "id" | "createdAt">
): ToolkitEntry {
  const all = getStore<ToolkitEntry[]>("toolkit_history", userId) || [];
  const full: ToolkitEntry = { ...entry, id: generateId(), createdAt: new Date().toISOString() };
  all.unshift(full);
  setStore("toolkit_history", userId, all.slice(0, 200));
  return full;
}

// --- PRACTICE HISTORY ---

export interface PracticeAttempt {
  id: string;
  practiceId: string;
  practiceName: string;
  score: number;
  details: Record<string, unknown>;
  createdAt: string;
}

export function getPracticeHistory(userId: string, practiceId?: string): PracticeAttempt[] {
  const all = getStore<PracticeAttempt[]>("practice_history", userId) || [];
  if (practiceId) return all.filter(e => e.practiceId === practiceId);
  return all;
}

export function savePracticeAttempt(
  userId: string,
  attempt: Omit<PracticeAttempt, "id" | "createdAt">
): PracticeAttempt {
  const all = getStore<PracticeAttempt[]>("practice_history", userId) || [];
  const full: PracticeAttempt = { ...attempt, id: generateId(), createdAt: new Date().toISOString() };
  all.unshift(full);
  setStore("practice_history", userId, all.slice(0, 200));
  return full;
}

// --- POINTS & LEADERBOARD ---

export interface PointsEntry {
  id: string;
  source: string;
  sourceId: string;
  sourceName: string;
  points: number;
  createdAt: string;
}

export function getUserPoints(userId: string): { total: number; breakdown: PointsEntry[] } {
  const breakdown = getStore<PointsEntry[]>("points", userId) || [];
  const total = breakdown.reduce((s, e) => s + e.points, 0);
  return { total, breakdown };
}

export function awardPoints(userId: string, entry: Omit<PointsEntry, "id" | "createdAt">): void {
  const breakdown = getStore<PointsEntry[]>("points", userId) || [];
  breakdown.unshift({ ...entry, id: generateId(), createdAt: new Date().toISOString() });
  setStore("points", userId, breakdown.slice(0, 500));
}

export function getLeaderboard(): Array<{ userId: string; name: string; points: number; rank: number }> {
  // Collect all users from localStorage who have points entries
  const results: Array<{ userId: string; name: string; points: number }> = [];

  // Seed mock entries so the leaderboard is never empty
  const mockEntries = [
    { userId: "mock-1", name: "Ricardo Almeida", points: 847 },
    { userId: "mock-2", name: "Catarina Ferreira", points: 791 },
    { userId: "mock-3", name: "Miguel Santos", points: 734 },
    { userId: "mock-4", name: "Ana Rodrigues", points: 689 },
    { userId: "mock-5", name: "João Costa", points: 612 },
    { userId: "mock-6", name: "Inês Pereira", points: 558 },
    { userId: "mock-7", name: "Rui Oliveira", points: 423 },
    { userId: "mock-8", name: "Sofia Martins", points: 387 },
  ];

  // Find all real users with points
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith("voice3_points_")) continue;
    const userId = key.replace("voice3_points_", "");
    if (userId.startsWith("mock-")) continue;
    const { total } = getUserPoints(userId);
    if (total > 0) {
      // Look up user name from auth store
      const usersRaw = localStorage.getItem("voice3_users");
      let name = userId;
      if (usersRaw) {
        const users = JSON.parse(usersRaw) as Array<{ id: string; name: string }>;
        const u = users.find(u => u.id === userId);
        if (u) name = u.name;
      }
      results.push({ userId, name, points: total });
    }
  }

  // Merge with mocks, real users override mocks
  const combined = [...results, ...mockEntries.filter(m => !results.find(r => r.userId === m.userId))];
  combined.sort((a, b) => b.points - a.points);

  return combined.map((entry, i) => ({ ...entry, rank: i + 1 }));
}

// --- NOTIFY ME ---

export interface NotifyInterest {
  moduleId: string;
  moduleType: string;
  savedAt: string;
}

export function saveNotifyInterest(userId: string, moduleId: string, moduleType: string): void {
  const all = getStore<NotifyInterest[]>("notify", userId) || [];
  if (all.find(n => n.moduleId === moduleId)) return;
  all.push({ moduleId, moduleType, savedAt: new Date().toISOString() });
  setStore("notify", userId, all);
}

export function getNotifyInterests(userId: string): NotifyInterest[] {
  return getStore<NotifyInterest[]>("notify", userId) || [];
}

// --- AI COACH PERSONA ---

export function getSelectedPersona(userId: string): string | null {
  return localStorage.getItem(`voice3_persona_${userId}`);
}

export function setSelectedPersona(userId: string, personaId: string): void {
  localStorage.setItem(`voice3_persona_${userId}`, personaId);
}

// --- VOCABULARY PROGRESS ---

export interface VocabProgress {
  learnedWords: string[];
  lastDailySet: number; // day index
}

export function getVocabProgress(userId: string): VocabProgress {
  return getStore<VocabProgress>("vocab_progress", userId) || { learnedWords: [], lastDailySet: -1 };
}

export function markWordLearned(userId: string, wordId: string): void {
  const progress = getVocabProgress(userId);
  if (!progress.learnedWords.includes(wordId)) {
    progress.learnedWords.push(wordId);
    setStore("vocab_progress", userId, progress);
  }
}

// --- PEER DEBATES ---

export interface PeerDebatePost {
  id: string;
  authorId: string;
  authorName: string;
  topic: string;
  position: string;
  isPublic: boolean;
  createdAt: string;
  responses: Array<{
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    score: number;
    createdAt: string;
  }>;
}

const PEER_DEBATES_KEY = "voice3_peer_debates";

function getPeerDebates(): PeerDebatePost[] {
  try {
    const raw = localStorage.getItem(PEER_DEBATES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PeerDebatePost[];
  } catch {
    return [];
  }
}

function setPeerDebates(posts: PeerDebatePost[]): void {
  try {
    localStorage.setItem(PEER_DEBATES_KEY, JSON.stringify(posts));
  } catch {
    // ignore
  }
}

export function getAllPeerDebates(): PeerDebatePost[] {
  const existing = getPeerDebates();
  // Seed example posts if empty
  if (existing.length === 0) {
    const seeds: PeerDebatePost[] = [
      {
        id: "seed-1",
        authorId: "mock-1",
        authorName: "Ricardo Almeida",
        topic: "Remote work is more productive than office work",
        position: "I firmly believe remote work drives higher productivity. Teams that work remotely eliminate commute time, reduce office politics, and gain autonomy over their schedules. Studies consistently show remote workers report higher satisfaction and output. The key is establishing clear communication protocols and trust-based management.",
        isPublic: true,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        responses: [],
      },
      {
        id: "seed-2",
        authorId: "mock-2",
        authorName: "Catarina Ferreira",
        topic: "MBA degrees are no longer worth the investment",
        position: "The traditional MBA has lost its competitive edge. With the rise of online courses, executive bootcamps, and direct mentorship programs, professionals can gain equivalent knowledge at a fraction of the cost. The ROI on a top MBA program, factoring in opportunity cost and tuition, rarely justifies itself in today's fast-moving business landscape.",
        isPublic: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        responses: [],
      },
      {
        id: "seed-3",
        authorId: "mock-3",
        authorName: "Miguel Santos",
        topic: "Companies should prioritize profit over sustainability",
        position: "While sustainability is important, companies have a fiduciary duty to their shareholders first. Sustainable initiatives that don't deliver ROI are a luxury that many businesses cannot afford. The market will naturally incentivize sustainability when it becomes financially viable, rather than forcing it through corporate mandates.",
        isPublic: true,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        responses: [],
      },
    ];
    setPeerDebates(seeds);
    return seeds;
  }
  return existing;
}

export function postPeerDebate(
  authorId: string,
  authorName: string,
  topic: string,
  position: string,
  isPublic: boolean
): PeerDebatePost {
  const posts = getPeerDebates();
  const post: PeerDebatePost = {
    id: generateId(),
    authorId,
    authorName,
    topic,
    position,
    isPublic,
    createdAt: new Date().toISOString(),
    responses: [],
  };
  posts.unshift(post);
  setPeerDebates(posts);
  return post;
}

export function respondToPeerDebate(
  postId: string,
  authorId: string,
  authorName: string,
  content: string,
  score: number
): void {
  const posts = getPeerDebates();
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  post.responses.push({
    id: generateId(),
    authorId,
    authorName,
    content,
    score,
    createdAt: new Date().toISOString(),
  });
  setPeerDebates(posts);
}
