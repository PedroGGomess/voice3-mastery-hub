import PlatformLayout from "@/components/PlatformLayout";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Building, Trophy, Clock, Target, Flame, Lock, CheckCircle2, Star, Zap, BookOpen, Briefcase, CreditCard, Package, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Card, Avatar } from "@/components/ui/VoiceUI";
import { supabase } from "@/integrations/supabase/client";

interface Achievement {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

interface Payment {
  id: string;
  pack: string | null;
  amount: number | null;
  currency: string | null;
  status: string | null;
  created_at: string | null;
}

const packInfoMap: Record<string, { label: string; color: string; sessions: string }> = {
  starter: { label: "Starter", color: "#10b981", sessions: "4 AI + 1 Live" },
  pro: { label: "Pro", color: "#C9A84C", sessions: "8 AI + 3 Live" },
  advanced: { label: "Advanced", color: "#8b5cf6", sessions: "12 AI + 5 Live" },
  "business-master": { label: "Business Master", color: "#f59e0b", sessions: "Ilimitado" },
};

function PackAndPayments({ userId, pack }: { userId: string; pack?: string }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase
      .from("payments")
      .select("id, pack, amount, currency, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setPayments((data as Payment[]) || []);
        setLoading(false);
      });
  }, [userId]);

  const info = pack ? packInfoMap[pack.toLowerCase()] || { label: pack, color: "#C9A84C", sessions: "—" } : null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
      <Card hover>
        <h3 className="font-semibold mb-5 flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" /> Pack & Pagamentos
        </h3>
        <div className="mb-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Pack Ativo</p>
          {info ? (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${info.color}20`, color: info.color }}>
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold" style={{ color: info.color }}>{info.label}</p>
                <p className="text-xs text-muted-foreground">{info.sessions}</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
              <p className="text-sm text-muted-foreground">Nenhum pack ativo</p>
              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
                <Link to="/packs">Escolher Pack <ArrowRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Histórico de Pagamentos</p>
          {loading ? (
            <div className="flex justify-center py-4">
              <span className="inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : payments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-3">Sem pagamentos registados.</p>
          ) : (
            <div className="space-y-2">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{p.pack ? (packInfoMap[p.pack]?.label || p.pack) : "Pagamento"}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.created_at ? new Date(p.created_at).toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {p.amount != null ? `€${(p.amount / 100).toFixed(2)}` : "—"}
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.status === "completed" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                      {p.status === "completed" ? "Pago" : p.status || "Pendente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
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

  let onboardingData: { industry?: string; seniority?: string; challenge?: string; tone?: string; completed?: boolean } | null = null;
  try {
    const stored = localStorage.getItem(`voice3_onboarding_${userId}`);
    if (stored) onboardingData = JSON.parse(stored);
  } catch (_e) {
    // ignore
  }
  const onboardingCompleted = !!onboardingData?.completed;

  return (
    <PlatformLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-2xl font-bold mb-2">Perfil</h1>
        <p className="text-muted-foreground mb-8">Gere as tuas informações e acompanha o teu progresso.</p>

        {/* Avatar + stats */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm flex-col sm:flex-row items-start sm:items-center" style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 24, padding: 24 }}>
          <Avatar name={currentUser?.name || "U"} size={80} />
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

        {/* Pack & Payment History */}
        <PackAndPayments userId={userId} pack={currentUser?.pack} />

        {/* Executive Profile section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6">
          <Card hover>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> Executive Profile</h3>
          {onboardingCompleted && onboardingData ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: "Industry", value: onboardingData.industry },
                { label: "Seniority Level", value: onboardingData.seniority },
                { label: "Primary Challenge", value: onboardingData.challenge },
                { label: "Communication Tone", value: onboardingData.tone },
              ].map(item => item.value && (
                <div key={item.label} className="flex flex-col gap-0.5 p-3 rounded-xl bg-[#B89A5A]/5 border border-[#B89A5A]/10">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-[#F4F2ED]">{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <p className="text-sm text-muted-foreground flex-1">Complete your Executive Profile to unlock personalised training tailored to your industry, role, and communication style.</p>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shrink-0">
                <Link to="/onboarding">Complete Profile →</Link>
              </Button>
            </div>
          )}
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Edit profile */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card hover>
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
            </Card>
          </motion.div>

          {/* Change password */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card hover>
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
            </Card>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
          <Card hover>
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
          </Card>
        </motion.div>
      </motion.div>
    </PlatformLayout>
  );
};

export default Perfil;
