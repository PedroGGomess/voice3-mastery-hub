import { useMemo } from "react";
import PlatformLayout from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { sessionsData } from "@/lib/sessionsData";
import { CheckCircle2, AlertTriangle, Lock, Flame, Target, Clock, BarChart2, Star, Award, Zap, BookOpen, MessageSquare, TrendingUp, TrendingDown } from "lucide-react";

const TOTAL_SESSIONS = 10;

const BADGES = [
  { id: 1, label: "First Step", icon: Star, desc: "Completa a 1ª sessão", req: (c: number, scores: number[]) => c >= 1 },
  { id: 2, label: "Email Pro", icon: MessageSquare, desc: "Completa a sessão de Email", req: (_c: number, _s: number[], prog: Record<number, { completed: boolean }>) => !!prog[2]?.completed },
  { id: 3, label: "Halfway", icon: TrendingUp, desc: "Completa 4 sessões", req: (c: number) => c >= 4 },
  { id: 4, label: "Completionist", icon: Award, desc: "Completa todas as sessões", req: (c: number) => c >= TOTAL_SESSIONS },
  { id: 5, label: "Perfect Score", icon: Target, desc: "Obtém 100% num quiz", req: (_c: number, scores: number[]) => scores.some(s => s >= 100) },
  { id: 6, label: "On Fire", icon: Flame, desc: "5 dias consecutivos", req: (_c: number, scores: number[]) => scores.length >= 5 },
  { id: 7, label: "Communicator", icon: BookOpen, desc: "Completa 6 sessões", req: (c: number) => c >= 6 },
  { id: 8, label: "Dedicated Learner", icon: Zap, desc: "Score médio acima de 80%", req: (_c: number, scores: number[]) => scores.length > 0 && scores.reduce((a, b) => a + b, 0) / scores.length >= 80 },
];

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  return `${h}h ${m}min`;
}

const Desempenho = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";

  const progress: Record<number, { completed: boolean; score: number; completedAt: string }> = useMemo(() => {
    try {
      const stored = localStorage.getItem(`voice3_sessions_progress_${userId}`);
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  }, [userId]);

  const completedSessions = sessionsData.filter(s => progress[s.id]?.completed);
  const completedCount = completedSessions.length;
  const scores = completedSessions.map(s => progress[s.id].score || 0);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const totalMinutes = completedSessions.reduce((sum, s) => sum + parseInt(s.time) || 0, 0);

  // Streak: count consecutive days ending today where at least one session was completed
  const streakDays = useMemo(() => {
    const dates = completedSessions
      .map(s => progress[s.id]?.completedAt)
      .filter(Boolean)
      .map(d => new Date(d).toDateString());
    const uniqueDates = [...new Set(dates)];
    if (uniqueDates.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      if (uniqueDates.includes(d.toDateString())) streak++;
      else if (i > 0) break;
    }
    return streak;
  }, [completedSessions, progress]);

  // Weekly stats: sessions in current and previous calendar week (Mon–Sun)
  const { thisWeekSessions, lastWeekSessions, thisWeekMinutes } = useMemo(() => {
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Mon
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    const lastWeekStart = new Date(weekStart);
    lastWeekStart.setDate(weekStart.getDate() - 7);

    let thisW = 0;
    let lastW = 0;
    let thisWMin = 0;
    for (const s of completedSessions) {
      const d = progress[s.id]?.completedAt ? new Date(progress[s.id].completedAt) : null;
      if (!d) continue;
      if (d >= weekStart) { thisW++; thisWMin += parseInt(s.time) || 0; }
      else if (d >= lastWeekStart) lastW++;
    }
    return { thisWeekSessions: thisW, lastWeekSessions: lastW, thisWeekMinutes: thisWMin };
  }, [completedSessions, progress]);

  // Strongest / weakest sessions
  const sortedByScore = [...completedSessions].sort((a, b) => (progress[b.id]?.score || 0) - (progress[a.id]?.score || 0));
  const strongSessions = sortedByScore.slice(0, 3);
  const weakSessions = sortedByScore.slice(-3).reverse();

  const weekImproved = thisWeekSessions >= lastWeekSessions;

  const allScores = sessionsData.map(s => progress[s.id]?.score || 0);

  return (
    <PlatformLayout>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-xs text-[#B89A5A] tracking-[0.2em] uppercase font-medium mb-1">Executive Communication Programme</p>
        <h1 className="font-serif text-2xl font-semibold text-[#F4F2ED] tracking-tight">Desempenho</h1>
        <p className="text-[#8E96A3] text-sm mt-1">Acompanha a tua evolução e métricas de performance.</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Authority Score", value: scores.length > 0 ? `${avgScore}%` : "—", icon: <Target className="h-5 w-5 text-[#B89A5A]" />, sub: scores.length > 0 ? "executive communication precision" : "Sem dados" },
          { label: "Sessões Completas", value: `${completedCount}/${TOTAL_SESSIONS}`, icon: <CheckCircle2 className="h-5 w-5 text-[#B89A5A]" />, sub: `${Math.round((completedCount / TOTAL_SESSIONS) * 100)}% do curso` },
          { label: "Tempo Total", value: totalMinutes > 0 ? formatTime(totalMinutes) : "—", icon: <Clock className="h-5 w-5 text-[#B89A5A]" />, sub: "de aprendizagem" },
          { label: "Streak Atual", value: `${streakDays} dias`, icon: <Flame className="h-5 w-5 text-[#B89A5A]" />, sub: "consecutivos" },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl bg-[#1C1F26] border border-white/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8E96A3] font-medium">{stat.label}</span>
              {stat.icon}
            </div>
            <p className="font-serif text-2xl font-semibold text-[#F4F2ED]">{stat.value}</p>
            <p className="text-xs text-[#8E96A3] mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Bar Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Resultados por Sessão</h2>
          <div className="h-px flex-1 bg-[#B89A5A]/20" />
        </div>
        <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-5">
          <div className="flex items-end gap-1.5 h-40 mb-3 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between pointer-events-none">
              {["100%", "50%", "0%"].map(l => (
                <span key={l} className="text-[10px] text-[#8E96A3]/50 leading-none">{l}</span>
              ))}
            </div>
            {/* Bars */}
            <div className="flex items-end gap-1.5 flex-1 h-full pl-6">
              {sessionsData.map((session, i) => {
                const score = allScores[i];
                const isCompleted = !!progress[session.id]?.completed;
                const heightPct = isCompleted ? Math.max(score, 4) : 0;
                return (
                  <div key={session.id} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                    {/* Tooltip */}
                    {isCompleted && (
                      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-[#0B1A2A] border border-[#B89A5A]/30 rounded px-2 py-1 text-xs text-[#F4F2ED] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                        {score}%
                      </div>
                    )}
                    <div className="w-full bg-white/5 rounded-t-sm relative overflow-hidden" style={{ height: "100%" }}>
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 rounded-t-sm"
                        style={{ background: isCompleted ? "#B89A5A" : "#1C2A3A" }}
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* X-axis */}
          <div className="flex gap-1.5 pl-6">
            {sessionsData.map(s => (
              <div key={s.id} className="flex-1 text-center">
                <span className="text-[9px] text-[#8E96A3]/60">S{s.id}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-[#B89A5A]" /><span className="text-xs text-[#8E96A3]">Concluída</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-white/5" /><span className="text-xs text-[#8E96A3]">Por concluir</span></div>
            {scores.length > 0 && <span className="ml-auto text-xs text-[#B89A5A] font-medium">Authority Score Avg: {avgScore}%</span>}
          </div>
        </div>
      </motion.div>

      {/* Strengths & Areas to Improve */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Pontos Fortes & Áreas a Melhorar</h2>
          <div className="h-px flex-1 bg-[#B89A5A]/20" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Strengths */}
          <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-[#B89A5A]" />
              <h3 className="text-sm font-semibold text-[#F4F2ED]">Pontos Fortes</h3>
            </div>
            {strongSessions.length > 0 ? (
              <ul className="space-y-2">
                {strongSessions.map(s => (
                  <li key={s.id} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#8E96A3] truncate">{s.title}</span>
                    <span className="text-xs font-semibold text-[#B89A5A] shrink-0">{progress[s.id]?.score}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#8E96A3]/60">Completa sessões para ver os teus pontos fortes.</p>
            )}
          </div>

          {/* Areas to improve */}
          <div className="rounded-xl bg-[#1C1F26] border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-[#F4F2ED]">Áreas a Melhorar</h3>
            </div>
            {weakSessions.length > 0 && completedCount > 0 ? (
              <ul className="space-y-2">
                {weakSessions.map(s => (
                  <li key={s.id} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-[#8E96A3] truncate">{s.title}</span>
                    <span className="text-xs font-semibold text-amber-400 shrink-0">{progress[s.id]?.score}%</span>
                  </li>
                ))}
              </ul>
            ) : completedCount === 0 ? (
              <p className="text-xs text-[#8E96A3]/60">Completa sessões para identificar áreas a melhorar.</p>
            ) : (
              <p className="text-xs text-[#B89A5A]/80">Excelente desempenho em todas as áreas!</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Session Details Accordion */}
      {completedSessions.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Detalhe por Sessão</h2>
            <div className="h-px flex-1 bg-[#B89A5A]/20" />
          </div>
          <div className="rounded-xl bg-[#1C1F26] border border-white/5 overflow-hidden divide-y divide-white/[0.04]">
            {completedSessions.map((session, i) => {
              const p = progress[session.id];
              const date = p?.completedAt ? new Date(p.completedAt).toLocaleDateString("pt-PT") : "—";
              return (
                <div key={session.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div>
                      <p className="text-sm font-medium text-[#F4F2ED]">Sessão {session.id} — {session.title}</p>
                      <p className="text-xs text-[#8E96A3]">Concluída em {date}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#B89A5A] shrink-0">{p.score}%</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { label: "Vídeo", done: true },
                      { label: "Áudio", done: true },
                      { label: "Conteúdo", done: true },
                      { label: `Quiz ${p.score}%`, done: true },
                      { label: "Exercício", done: true },
                    ].map((item, j) => (
                      <div key={j} className="flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#B89A5A] shrink-0" />
                        <span className="text-[#8E96A3]">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Conquistas</h2>
          <div className="h-px flex-1 bg-[#B89A5A]/20" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES.map(badge => {
            const Icon = badge.icon;
            const earned = badge.req(completedCount, scores, progress);
            return (
              <div
                key={badge.id}
                className={`rounded-xl p-4 text-center border transition-all ${earned ? "bg-[#B89A5A]/10 border-[#B89A5A]/30" : "bg-[#1C1F26] border-white/5"}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${earned ? "bg-[#B89A5A]/20" : "bg-white/5"}`}>
                  {earned
                    ? <Icon className="h-5 w-5 text-[#B89A5A]" />
                    : <Lock className="h-5 w-5 text-white/15" />}
                </div>
                <p className={`text-xs font-semibold ${earned ? "text-[#F4F2ED]" : "text-white/25"}`}>{badge.label}</p>
                <p className={`text-[10px] mt-0.5 ${earned ? "text-[#8E96A3]" : "text-white/15"}`}>{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Esta Semana */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-xs text-[#8E96A3] uppercase tracking-wider font-medium">Esta Semana</h2>
          <div className="h-px flex-1 bg-[#B89A5A]/20" />
        </div>
        <div
          className="rounded-xl border border-[#B89A5A]/20 p-5"
          style={{ background: "linear-gradient(135deg, #0F2235 0%, #1C2A3A 100%)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="h-5 w-5 text-[#B89A5A]" />
            <h3 className="font-serif text-base font-semibold text-[#F4F2ED]">Resumo Semanal</h3>
            {weekImproved
              ? <span className="ml-auto flex items-center gap-1 text-xs text-emerald-400"><TrendingUp className="h-3.5 w-3.5" />A melhorar</span>
              : <span className="ml-auto flex items-center gap-1 text-xs text-amber-400"><TrendingDown className="h-3.5 w-3.5" />Mantém o ritmo</span>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-[#8E96A3] mb-1">Sessões esta semana</p>
              <p className="font-serif text-xl font-semibold text-[#F4F2ED]">{thisWeekSessions}</p>
              <p className="text-[10px] text-[#8E96A3]">vs {lastWeekSessions} semana passada</p>
            </div>
            <div>
              <p className="text-xs text-[#8E96A3] mb-1">Authority Score</p>
              <p className="font-serif text-xl font-semibold text-[#F4F2ED]">{scores.length > 0 ? `${avgScore}%` : "—"}</p>
              <p className="text-[10px] text-[#8E96A3]">executive precision</p>
            </div>
            <div>
              <p className="text-xs text-[#8E96A3] mb-1">Tempo esta semana</p>
              <p className="font-serif text-xl font-semibold text-[#F4F2ED]">{thisWeekMinutes > 0 ? formatTime(thisWeekMinutes) : "—"}</p>
              <p className="text-[10px] text-[#8E96A3]">de estudo</p>
            </div>
            <div>
              <p className="text-xs text-[#8E96A3] mb-1">Progresso total</p>
              <p className="font-serif text-xl font-semibold text-[#B89A5A]">{Math.round((completedCount / TOTAL_SESSIONS) * 100)}%</p>
              <p className="text-[10px] text-[#8E96A3]">{completedCount}/{TOTAL_SESSIONS} sessões</p>
            </div>
          </div>
        </div>
      </motion.div>
    </PlatformLayout>
  );
};

export default Desempenho;
