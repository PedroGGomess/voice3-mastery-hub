import CompanyLayout from "@/components/CompanyLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { BarChart3, Trophy, TrendingUp, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Student {
  id: string;
  name: string;
  email: string;
  pack: string;
  completedSessions: number;
  totalSessions: number;
  status: string;
}

const Progresso = () => {
  const { currentUser } = useAuth();
  const storageKey = `voice3_company_students_${currentUser?.id}`;

  const getStudents = (): Student[] => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  };

  const [students] = useState<Student[]>(getStudents);

  const avgProgress = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + (s.totalSessions > 0 ? (s.completedSessions / s.totalSessions) * 100 : 0), 0) / students.length)
    : 0;

  const totalCompleted = students.reduce((acc, s) => acc + s.completedSessions, 0);
  const activeStudents = students.filter(s => s.completedSessions > 0).length;

  const sorted = [...students].sort((a, b) => b.completedSessions - a.completedSessions);

  return (
    <CompanyLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-bold">Progresso da Equipa</h1>
          <p className="text-muted-foreground">Acompanha o desempenho dos teus alunos.</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="premium-card">
            <TrendingUp className="h-5 w-5 text-primary mb-3" />
            <p className="text-2xl font-bold">{avgProgress}%</p>
            <p className="text-sm text-muted-foreground">Progresso médio</p>
          </div>
          <div className="premium-card">
            <BarChart3 className="h-5 w-5 text-success mb-3" />
            <p className="text-2xl font-bold">{totalCompleted}</p>
            <p className="text-sm text-muted-foreground">Sessões concluídas</p>
          </div>
          <div className="premium-card">
            <Users className="h-5 w-5 text-warning mb-3" />
            <p className="text-2xl font-bold">{activeStudents}/{students.length}</p>
            <p className="text-sm text-muted-foreground">Alunos ativos</p>
          </div>
        </div>

        {/* Progress bars */}
        <div className="premium-card mb-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Progresso por Aluno</h2>
          {students.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <Users className="h-8 w-8 mx-auto mb-3 opacity-30" />
              Ainda não há alunos registados.
            </div>
          ) : (
            <div className="space-y-4">
              {students.map((s, i) => {
                const pct = s.totalSessions > 0 ? Math.round((s.completedSessions / s.totalSessions) * 100) : 0;
                return (
                  <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">{s.name}</span>
                        <span className="text-xs text-muted-foreground">{s.pack}</span>
                      </div>
                      <span className="text-sm font-medium text-primary">{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.05 }}
                        className={`h-full rounded-full ${pct >= 75 ? "bg-success" : pct >= 40 ? "bg-primary" : "bg-warning"}`} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{s.completedSessions}/{s.totalSessions} sessões</p>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        {sorted.length > 0 && (
          <div className="premium-card">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Trophy className="h-4 w-4 text-warning" /> Leaderboard</h2>
            <div className="space-y-2">
              {sorted.slice(0, 5).map((s, i) => (
                <div key={s.id} className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 ? "bg-warning/10 border border-warning/20" : "bg-white/5"}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i === 0 ? "bg-warning text-black" : i === 1 ? "bg-white/20 text-white" : "bg-white/10 text-white/50"}`}>
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.pack} · {s.completedSessions} sessões</p>
                  </div>
                  {i === 0 && <Trophy className="h-4 w-4 text-warning" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </CompanyLayout>
  );
};

export default Progresso;
