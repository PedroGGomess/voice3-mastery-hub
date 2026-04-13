import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface SessionProgress {
  chapter_id: string;
  session_id: string;
  session_type: string;
  status: "started" | "in_progress" | "completed";
  score?: number;
  time_spent_seconds?: number;
  attempts?: number;
  completed_at?: string;
  metadata?: Record<string, any>;
}

export interface ErrorBankEntry {
  id?: string;
  error_text: string;
  correction: string;
  explanation?: string;
  error_type: "grammar" | "vocabulary" | "tone" | "structure" | "pronunciation";
  source_chapter?: string;
  source_session?: string;
  status?: "new" | "reviewing" | "mastered";
}

export interface VaultEntry {
  id?: string;
  phrase: string;
  context?: string;
  why_effective?: string;
  category?: string;
  source_chapter?: string;
  source_session?: string;
  is_starred?: boolean;
}

export interface VoiceDNASnapshot {
  clarity_index?: number;
  words_per_min?: number;
  active_tone?: number;
  vocab_range?: number;
  overall_score?: number;
  source_session?: string;
}

/**
 * Hook for permanent student progress persistence via Supabase.
 * All data is written to Supabase tables and also cached in localStorage
 * for offline/fast access.
 */
export function useStudentProgress() {
  const { currentUser } = useAuth();
  const userId = currentUser?.id;
  const [progress, setProgress] = useState<SessionProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Load progress from Supabase on mount
  useEffect(() => {
    if (!userId) return;

    const loadProgress = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("student_progress" as any)
          .select("*")
          .eq("user_id", userId)
          .order("updated_at", { ascending: false });

        if (error) {
          console.warn("Failed to load progress from Supabase, falling back to localStorage:", error.message);
          loadFromLocalStorage();
          return;
        }

        const mapped = (data || []).map((row: any) => ({
          chapter_id: row.chapter_id,
          session_id: row.session_id,
          session_type: row.session_type,
          status: row.status,
          score: row.score,
          time_spent_seconds: row.time_spent_seconds,
          attempts: row.attempts,
          completed_at: row.completed_at,
          metadata: row.metadata,
        }));

        setProgress(mapped);
        // Sync to localStorage for fast access
        syncToLocalStorage(mapped);
      } catch (err) {
        console.warn("Progress load error:", err);
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [userId]);

  const loadFromLocalStorage = () => {
    if (!userId) return;
    try {
      const stored = localStorage.getItem(`voice3_session_progress_${userId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert old format { sessionId: { status, score } } to array
        const entries = Object.entries(parsed).map(([sessionId, val]: [string, any]) => ({
          chapter_id: "",
          session_id: sessionId,
          session_type: "briefing",
          status: val.status || "started",
          score: val.score,
        }));
        setProgress(entries);
      }
    } catch {}
  };

  const syncToLocalStorage = (entries: SessionProgress[]) => {
    if (!userId) return;
    // Write in old format for backward compatibility with existing components
    const oldFormat: Record<string, { status: string; score?: number }> = {};
    entries.forEach(e => {
      oldFormat[e.session_id] = { status: e.status, score: e.score };
    });
    localStorage.setItem(`voice3_session_progress_${userId}`, JSON.stringify(oldFormat));

    // Also write chapter progress
    const chapterMap: Record<string, { status: string }> = {};
    entries.forEach(e => {
      if (!chapterMap[e.chapter_id]) chapterMap[e.chapter_id] = { status: "available" };
      if (e.status === "completed") {
        // Check if ALL sessions in chapter are completed — simplified heuristic
        chapterMap[e.chapter_id] = { status: "in_progress" };
      }
    });
    localStorage.setItem(`voice3_chapter_progress_${userId}`, JSON.stringify(chapterMap));
  };

  // Save or update session progress
  const saveProgress = useCallback(async (entry: SessionProgress) => {
    if (!userId) return;

    // Optimistic local update
    setProgress(prev => {
      const existing = prev.findIndex(p => p.session_id === entry.session_id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...updated[existing], ...entry };
        syncToLocalStorage(updated);
        return updated;
      }
      const updated = [...prev, entry];
      syncToLocalStorage(updated);
      return updated;
    });

    // Persist to Supabase
    try {
      const { error } = await supabase
        .from("student_progress" as any)
        .upsert({
          user_id: userId,
          chapter_id: entry.chapter_id,
          session_id: entry.session_id,
          session_type: entry.session_type,
          status: entry.status,
          score: entry.score || null,
          time_spent_seconds: entry.time_spent_seconds || 0,
          attempts: entry.attempts || 1,
          completed_at: entry.status === "completed" ? new Date().toISOString() : null,
          metadata: entry.metadata || {},
        } as any, { onConflict: "user_id,chapter_id,session_id" });

      if (error) console.warn("Failed to save progress to Supabase:", error.message);
    } catch (err) {
      console.warn("Progress save error:", err);
    }
  }, [userId]);

  // Save an error to the error bank
  const saveError = useCallback(async (entry: ErrorBankEntry) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("student_error_bank" as any)
        .insert({
          user_id: userId,
          ...entry,
        } as any);

      if (error) console.warn("Failed to save error:", error.message);
    } catch (err) {
      console.warn("Error bank save error:", err);
    }
  }, [userId]);

  // Save a phrase to the vault
  const saveVaultEntry = useCallback(async (entry: VaultEntry) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("student_vault" as any)
        .insert({
          user_id: userId,
          ...entry,
        } as any);

      if (error) console.warn("Failed to save vault entry:", error.message);
    } catch (err) {
      console.warn("Vault save error:", err);
    }
  }, [userId]);

  // Save a Voice DNA snapshot
  const saveVoiceDNA = useCallback(async (snapshot: VoiceDNASnapshot) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("student_voice_dna" as any)
        .insert({
          user_id: userId,
          ...snapshot,
        } as any);

      if (error) console.warn("Failed to save Voice DNA:", error.message);
    } catch (err) {
      console.warn("Voice DNA save error:", err);
    }
  }, [userId]);

  // Get session status
  const getSessionStatus = useCallback((sessionId: string) => {
    return progress.find(p => p.session_id === sessionId);
  }, [progress]);

  // Get chapter completion percentage
  const getChapterProgress = useCallback((chapterId: string, totalSessions: number) => {
    const chapterEntries = progress.filter(p => p.chapter_id === chapterId && p.status === "completed");
    return totalSessions > 0 ? Math.round((chapterEntries.length / totalSessions) * 100) : 0;
  }, [progress]);

  return {
    progress,
    loading,
    saveProgress,
    saveError,
    saveVaultEntry,
    saveVoiceDNA,
    getSessionStatus,
    getChapterProgress,
  };
}
