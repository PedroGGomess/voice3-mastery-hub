import CompanyLayout from "@/components/CompanyLayout";
import { motion } from "framer-motion";
import { Users, BookOpen, GraduationCap, TrendingUp, Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatWidget from "@/components/ChatWidget";

const stats = [
  { label: "Alunos ativos", value: "12", icon: Users, change: "+3 este mês" },
  { label: "Sessões concluídas", value: "87", icon: BookOpen, change: "+24 esta semana" },
  { label: "Aulas marcadas", value: "5", icon: GraduationCap, change: "2 esta semana" },
  { label: "Progresso médio", value: "64%", icon: TrendingUp, change: "+8% este mês" },
];

const students = [
  { name: "Ana Costa", email: "ana@empresa.pt", pack: "Pro", sessions: "7/10", status: "Ativa", teacherStatus: "Marcada" },
  { name: "Pedro Lopes", email: "pedro@empresa.pt", pack: "Advanced", sessions: "12/15", status: "Ativo", teacherStatus: "Concluída" },
  { name: "Maria Silva", email: "maria@empresa.pt", pack: "Starter", sessions: "2/4", status: "Ativa", teacherStatus: "Por marcar" },
  { name: "João Mendes", email: "joao@empresa.pt", pack: "Pro", sessions: "4/10", status: "Ativo", teacherStatus: "Marcada" },
  { name: "Sofia Nunes", email: "sofia@empresa.pt", pack: "Pro", sessions: "0/10", status: "Nova", teacherStatus: "—" },
];

const CompanyDashboard = () => {
  return (
    <CompanyLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl font-bold">Dashboard Empresa</h1>
            <p className="text-muted-foreground">Visão geral do progresso da equipa.</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Aluno
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="premium-card">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-primary mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Students table */}
        <div className="premium-card overflow-hidden p-0">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold">Alunos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Pack</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Sessões</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Aula Professora</th>
                  <th className="px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.email} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">{s.pack}</span>
                    </td>
                    <td className="px-6 py-4 text-sm">{s.sessions}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        s.status === "Nova" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                      }`}>{s.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{s.teacherStatus}</td>
                    <td className="px-6 py-4">
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
      <ChatWidget />
    </CompanyLayout>
  );
};

export default CompanyDashboard;
