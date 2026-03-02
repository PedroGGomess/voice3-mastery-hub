import CompanyLayout from "@/components/CompanyLayout";
import { motion } from "framer-motion";
import {
  Users, BookOpen, GraduationCap, TrendingUp, Plus, TrendingDown,
  Activity, FileBarChart, Calendar, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface CompanyStudent {
  name: string;
  email: string;
  pack: string;
  sessionsCompleted: number;
  sessionsTotal: number;
  progress: number;
}

const DEFAULT_STUDENTS: CompanyStudent[] = [
  { name: "Ana Costa", email: "ana@empresa.pt", pack: "Pro", sessionsCompleted: 7, sessionsTotal: 10, progress: 70 },
  { name: "Pedro Lopes", email: "pedro@empresa.pt", pack: "Advanced", sessionsCompleted: 12, sessionsTotal: 15, progress: 80 },
  { name: "Maria Silva", email: "maria@empresa.pt", pack: "Starter", sessionsCompleted: 2, sessionsTotal: 4, progress: 50 },
  { name: "João Mendes", email: "joao@empresa.pt", pack: "Pro", sessionsCompleted: 4, sessionsTotal: 10, progress: 40 },
  { name: "Sofia Nunes", email: "sofia@empresa.pt", pack: "Pro", sessionsCompleted: 0, sessionsTotal: 10, progress: 0 },
];

const ACTIVITY = [
  { text: "Ana Costa completou a sessão #7", time: "há 2h", type: "session" },
  { text: "Pedro Lopes agendou aula com professora", time: "há 5h", type: "lesson" },
  { text: "Maria Silva iniciou o programa Starter", time: "ontem", type: "start" },
  { text: "João Mendes obteve 92% na sessão #4", time: "há 2 dias", type: "score" },
];

const StatCard = ({
  label, value, icon: Icon, change, up,
}: { label: string; value: string; icon: React.ElementType; change: string; up: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl border-t-2 border-[#B89A5A] p-6"
    style={{ background: "#1C1F26" }}
  >
    <div className="flex items-center justify-between mb-4">
      <Icon className="h-5 w-5 text-[#B89A5A]" />
      <span className={`flex items-center gap-1 text-xs font-medium ${up ? "text-emerald-400" : "text-rose-400"}`}>
        {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {change}
      </span>
    </div>
    <p className="text-3xl font-bold text-[#F4F2ED] mb-1">{value}</p>
    <p className="text-sm text-[#8E96A3]">{label}</p>
  </motion.div>
);

const CompanyDashboard = () => {
  const { currentUser } = useAuth();
  const companyName = currentUser?.company || "Tech Solutions, Lda";
  const today = new Date().toLocaleDateString("pt-PT", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const stored = localStorage.getItem(`voice3_company_students_${currentUser?.id}`);
  const students: CompanyStudent[] = stored ? (JSON.parse(stored) as CompanyStudent[]) : DEFAULT_STUDENTS;

  const avgProgress = students.length
    ? Math.round(students.reduce((s, st) => s + st.progress, 0) / students.length)
    : 0;

  return (
    <CompanyLayout>
      <div className="min-h-full" style={{ background: "#0B1A2A" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#F4F2ED]">{companyName}</h1>
            <p className="text-[#8E96A3] text-sm mt-1">Dashboard Empresarial</p>
            <p className="text-[#B89A5A] text-xs mt-1 capitalize">{today}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "#B89A5A", color: "#0B1A2A" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#a08040")}
              onMouseLeave={e => (e.currentTarget.style.background = "#B89A5A")}
            >
              <Plus className="h-4 w-4" /> Adicionar Aluno
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#B89A5A]/40 text-[#B89A5A] hover:border-[#B89A5A] transition-all"
              style={{ background: "transparent" }}
            >
              <FileBarChart className="h-4 w-4" /> Ver Relatório
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#8E96A3]/30 text-[#8E96A3] hover:text-[#F4F2ED] hover:border-[#F4F2ED]/30 transition-all"
              style={{ background: "transparent" }}
            >
              <Calendar className="h-4 w-4" /> Agendar Demo
            </button>
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Alunos ativos" value={String(students.length)} icon={Users} change="+3 este mês" up />
          <StatCard label="Sessões concluídas" value={String(students.reduce((s, st) => s + st.sessionsCompleted, 0))} icon={BookOpen} change="+24 esta semana" up />
          <StatCard label="Aulas marcadas" value="5" icon={GraduationCap} change="2 esta semana" up />
          <StatCard label="Progresso médio" value={`${avgProgress}%`} icon={TrendingUp} change="+8% este mês" up />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Team Progress */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 rounded-2xl p-6"
            style={{ background: "#1C1F26" }}
          >
            <h2 className="text-[#F4F2ED] font-semibold text-lg mb-5 flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#B89A5A]" /> Progresso da Equipa
            </h2>
            <div className="space-y-5">
              {students.map((st) => (
                <div key={st.email}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-sm font-medium text-[#F4F2ED]">{st.name}</span>
                      <span className="ml-2 text-xs text-[#8E96A3]">Pack {st.pack}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#B89A5A]">{st.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "#0B1A2A" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${st.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #B89A5A, #d4b870)" }}
                    />
                  </div>
                  <p className="text-xs text-[#8E96A3] mt-1">{st.sessionsCompleted}/{st.sessionsTotal} sessões</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-6"
            style={{ background: "#1C1F26" }}
          >
            <h2 className="text-[#F4F2ED] font-semibold text-lg mb-5">Actividade Recente</h2>
            <div className="relative pl-5 space-y-6">
              <div className="absolute left-2 top-2 bottom-2 w-px" style={{ background: "#B89A5A22" }} />
              {ACTIVITY.map((item, i) => (
                <div key={i} className="relative">
                  <div
                    className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full border-2"
                    style={{ background: "#B89A5A", borderColor: "#1C1F26" }}
                  />
                  <p className="text-sm text-[#F4F2ED] leading-snug">{item.text}</p>
                  <p className="text-xs text-[#8E96A3] mt-0.5">{item.time}</p>
                </div>
              ))}
              <button className="relative flex items-center gap-1 text-xs text-[#B89A5A] hover:text-[#d4b870] transition-colors mt-2">
                Ver toda a actividade <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanyDashboard;
