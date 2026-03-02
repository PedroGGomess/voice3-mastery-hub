import PlatformLayout from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Building, Trophy, Clock, Target, Flame, Lock, CheckCircle2, Star, Zap, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Achievement {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

const Perfil = () => {
  const { currentUser, updateProfile } = useAuth();
  const userId = currentUser?.id || "";

  const [name, setName] = useState(currentUser?.name || "");
  const [company, setCompany] = useState(currentUser?.company || "");
  const [saving, setSaving] = useState(false);

  let progress: Record<number, { completed: boolean; score: number; completedAt: string }> = {};
  try {
    const stored = localStorage.getItem(`voice3_sessions_progress_${userId}`);
    if (stored) progress = JSON.parse(stored);
  } catch (_e) {
    // ignore
  }

  const completedSessions = Object.values(progress).filter(p => p.completed).length;
  const scores = Object.values(progress).filter(p => p.completed).map(p => p.score);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const totalMinutes = completedSessions * 25; // avg 25 min per session

  const achievements: Achievement[] = [
    { id: "first", label: "Primeira Sessão", description: "Completaste a tua primeira sessão", icon: <BookOpen className="h-5 w-5" />, unlocked: completedSessions >= 1 },
    { id: "half", label: "Meio Caminho", description: "Completaste 4 sessões", icon: <Target className="h-5 w-5" />, unlocked: completedSessions >= 4 },
    { id: "all", label: "Mestre do Inglês", description: "Completaste todas as 8 sessões", icon: <Trophy className="h-5 w-5" />, unlocked: completedSessions >= 8 },
    { id: "perfect", label: "Pontuação Perfeita", description: "Obtiveste 100% numa sessão", icon: <Star className="h-5 w-5" />, unlocked: scores.some(s => s === 100) },
    { id: "fast", label: "Aluno Dedicado", description: "Mais de 60 minutos de estudo", icon: <Zap className="h-5 w-5" />, unlocked: totalMinutes >= 60 },
    { id: "streak", label: "Série de Vitórias", description: "3+ sessões com score ≥ 80%", icon: <Flame className="h-5 w-5" />, unlocked: scores.filter(s => s >= 80).length >= 3 },
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      updateProfile({ name, company });
      toast.success("Perfil atualizado com sucesso!");
    } catch {
      toast.error("Erro ao guardar o perfil.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password alterada com sucesso! (demonstração)");
    (e.target as HTMLFormElement).reset();
  };

  const initials = (currentUser?.name || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-2xl font-bold mb-2">Perfil</h1>
        <p className="text-muted-foreground mb-8">Gere as tuas informações e acompanha o teu progresso.</p>

        {/* Avatar + stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 premium-card mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-white shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold">{currentUser?.name}</h2>
            <p className="text-muted-foreground text-sm">{currentUser?.email}</p>
            {currentUser?.company && <p className="text-xs text-primary mt-1">{currentUser.company}</p>}
            <p className="text-xs text-white/30 mt-1">Membro desde {currentUser?.createdAt}</p>
          </div>
          <div className="sm:ml-auto grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{completedSessions}</p>
              <p className="text-xs text-muted-foreground">Sessões</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{avgScore}%</p>
              <p className="text-xs text-muted-foreground">Média</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{totalMinutes}m</p>
              <p className="text-xs text-muted-foreground">Tempo</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Edit profile */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Informações Pessoais</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={currentUser?.email || ""} disabled className="h-11 rounded-xl opacity-50" />
                <p className="text-xs text-muted-foreground">O email não pode ser alterado.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" value={company} onChange={e => setCompany(e.target.value)} placeholder="Nome da empresa" className="h-11 rounded-xl" />
              </div>
              <Button type="submit" disabled={saving} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11">
                {saving ? "A guardar..." : "Guardar Alterações"}
              </Button>
            </form>
          </motion.div>

          {/* Change password */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Lock className="h-4 w-4 text-primary" /> Alterar Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPwd">Password atual</Label>
                <Input id="currentPwd" name="currentPwd" type="password" placeholder="••••••••" required className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPwd">Nova password</Label>
                <Input id="newPwd" name="newPwd" type="password" placeholder="••••••••" required className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPwd">Confirmar nova password</Label>
                <Input id="confirmPwd" name="confirmPwd" type="password" placeholder="••••••••" required className="h-11 rounded-xl" />
              </div>
              <Button type="submit" variant="outline" className="w-full rounded-xl h-11">Alterar Password</Button>
            </form>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="premium-card mt-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Trophy className="h-4 w-4 text-primary" /> Conquistas</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {achievements.map(a => (
              <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${a.unlocked ? "border-primary/30 bg-primary/5" : "border-white/5 opacity-40"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${a.unlocked ? "bg-primary/20 text-primary" : "bg-white/5 text-white/30"}`}>
                  {a.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.description}</p>
                </div>
                {a.unlocked && <CheckCircle2 className="h-4 w-4 text-success ml-auto shrink-0" />}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </PlatformLayout>
  );
};

export default Perfil;
