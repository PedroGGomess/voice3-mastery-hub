import PlatformLayout from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import { Brain, Play, CheckCircle2, Lock, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatWidget from "@/components/ChatWidget";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { sessionsData } from "@/lib/sessionsData";
import { useState } from "react";

type FilterTab = "todas" | "concluidas" | "progresso" | "bloqueadas";

const Sessoes = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || "";
  const [activeTab, setActiveTab] = useState<FilterTab>("todas");

  let progress: Record<number, { completed: boolean; score: number; completedAt: string }> = {};
  try {
    const stored = localStorage.getItem(`voice3_sessions_progress_${userId}`);
    if (stored) progress = JSON.parse(stored);
  } catch (_e) {
    // ignore
  }

  const getStatus = (id: number): "done" | "progress" | "locked" => {
    if (progress[id]?.completed) return "done";
    // First session is always accessible; others require previous to be complete
    if (id === 1) return "progress";
    if (progress[id - 1]?.completed) return "progress";
    return "locked";
  };

  const sessions = sessionsData.map(s => ({ ...s, status: getStatus(s.id), score: progress[s.id]?.score }));

  const filtered = sessions.filter(s => {
    if (activeTab === "todas") return true;
    if (activeTab === "concluidas") return s.status === "done";
    if (activeTab === "progresso") return s.status === "progress";
    if (activeTab === "bloqueadas") return s.status === "locked";
    return true;
  });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "todas", label: "Todas" },
    { key: "concluidas", label: "Concluídas" },
    { key: "progresso", label: "Em Progresso" },
    { key: "bloqueadas", label: "Bloqueadas" },
  ];

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-2xl font-bold mb-2">Sessões</h1>
        <p className="text-muted-foreground mb-6">Todas as sessões do teu pack. Treina ao teu ritmo.</p>

        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.key ? "bg-primary text-primary-foreground" : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`premium-card flex items-center gap-4 ${s.status === "progress" ? "ring-1 ring-primary" : ""} ${s.status === "locked" ? "opacity-60" : ""}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                s.status === "done" ? "bg-success/10" : s.status === "progress" ? "bg-primary/10" : "bg-secondary"
              }`}>
                {s.status === "done" ? <CheckCircle2 className="h-5 w-5 text-success" /> :
                 s.status === "progress" ? <Play className="h-5 w-5 text-primary" /> :
                 <Lock className="h-5 w-5 text-white/30" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{s.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Brain className="h-3 w-3" /> Quiz + Exercício · <Clock className="h-3 w-3" /> {s.time}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {s.score != null && <span className="text-xs font-medium text-success">{s.score}%</span>}
                {s.status === "progress" && (
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg h-8 text-xs" asChild>
                    <Link to={`/app/sessao/${s.id}`}>Continuar <ArrowRight className="ml-1 h-3 w-3" /></Link>
                  </Button>
                )}
                {s.status === "done" && (
                  <Button size="sm" variant="outline" className="rounded-lg h-8 text-xs" asChild>
                    <Link to={`/app/sessao/${s.id}`}>Rever</Link>
                  </Button>
                )}
                {s.status === "locked" && (
                  <span className="text-xs text-white/40 font-medium px-2 py-1 rounded-lg bg-white/5 flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Bloqueada
                  </span>
                )}
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Nenhuma sessão encontrada nesta categoria.
            </div>
          )}
        </div>
      </motion.div>
      <ChatWidget />
    </PlatformLayout>
  );
};

export default Sessoes;
