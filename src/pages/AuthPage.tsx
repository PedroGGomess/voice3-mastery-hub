import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Navigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import Voice3Logo from "@/components/Voice3Logo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PackOption {
  name: string;
  price: number;
  sessions: number;
  teacherLessons: number;
  features: string[];
}

const PACK_OPTIONS: PackOption[] = [
  { name: "Starter", price: 149, sessions: 4, teacherLessons: 1, features: ["4 sessões AI", "1 aula com professora", "Certificado"] },
  { name: "Pro", price: 349, sessions: 8, teacherLessons: 2, features: ["8 sessões AI", "2 aulas com professora", "Analytics", "Gravações"] },
  { name: "Advanced", price: 499, sessions: 12, teacherLessons: 3, features: ["12 sessões AI", "3 aulas com professora", "Percurso personalizado"] },
  { name: "Business Master", price: 799, sessions: 20, teacherLessons: 4, features: ["20 sessões AI", "4 aulas com professora", "Gestor dedicado"] },
];

interface RegFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
  role: "student" | "company_admin";
}

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [regStep, setRegStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [regData, setRegData] = useState<RegFormData>({ name: "", email: "", password: "", confirmPassword: "", company: "", role: "student" });
  const [selectedPack, setSelectedPack] = useState<PackOption | null>(null);
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading, currentUser } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Navigate to={currentUser?.role === "company_admin" ? "/empresa" : "/app"} replace />;
  }

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await login(data.get("email") as string, data.get("password") as string);
      toast.success("Bem-vindo de volta!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegStep1 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (regData.password !== regData.confirmPassword) { setError("As passwords não coincidem."); return; }
    if (regData.password.length < 6) { setError("A password deve ter pelo menos 6 caracteres."); return; }
    if (regData.role === "student") {
      setRegStep(2);
    } else {
      setRegStep(3);
    }
  };

  const handleRegStep2 = () => {
    if (!selectedPack) { toast.error("Seleciona um pack para continuar."); return; }
    setRegStep(3);
  };

  const handleRegConfirm = async () => {
    setError("");
    setLoading(true);
    try {
      const packDetails = selectedPack
        ? { name: selectedPack.name, sessions: selectedPack.sessions, teacherLessons: selectedPack.teacherLessons, price: selectedPack.price }
        : undefined;
      await register({
        name: regData.name,
        email: regData.email,
        password: regData.password,
        company: regData.company || undefined,
        role: regData.role,
        pack: selectedPack?.name,
        packDetails,
      });
      toast.success("Conta criada com sucesso! 🎉");
      const NAVIGATION_DELAY_MS = 500;
      setTimeout(() => navigate("/app"), NAVIGATION_DELAY_MS);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro.');
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setMode("login");
    setRegStep(1);
    setSelectedPack(null);
    setError("");
    setRegData({ name: "", email: "", password: "", confirmPassword: "", company: "", role: "student" });
  };

  const totalSteps = regData.role === "student" ? 3 : 2;
  const currentStepDisplay = regData.role === "student" ? regStep : regStep === 1 ? 1 : 2;

  return (
    <div className="min-h-screen flex">
      {/* Left — branding */}
      <div className="hidden lg:flex lg:w-1/2 section-dark relative items-center justify-center p-16">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold mb-4">
            <Voice3Logo height={40} variant="full" />
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Designed for professionals who must perform.
          </p>
          <div className="space-y-4 text-white/40 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">AI</div>
              <span>Chatbot disponível 24/7 para dúvidas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">📅</div>
              <span>Aulas com professora após completar sessões</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">📊</div>
              <span>Acompanha o teu progresso em tempo real</span>
            </div>
          </div>
          <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-white/40 mb-2">Demo rápido:</p>
            <p className="text-xs text-white/60">Aluno: demo@voice3.pt / demo123</p>
            <p className="text-xs text-white/60">Empresa: empresa@voice3.pt / empresa123</p>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Voice3Logo height={32} variant="full" />
          </div>

          {mode === "login" ? (
            <>
              <h2 className="text-2xl font-bold mb-2">Bem-vindo de volta</h2>
              <p className="text-muted-foreground mb-8">Entra na tua conta para continuar o teu percurso.</p>
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">{error}</div>
              )}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="joao@empresa.pt" required className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required className="h-11 rounded-xl pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" name="remember" className="rounded" />
                  <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">Lembrar-me</Label>
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 text-base font-medium">
                  {loading ? "A processar..." : "Entrar"}{!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Ainda não tens conta?{" "}
                  <button onClick={() => { setMode("register"); setError(""); }} className="text-primary font-medium hover:underline">Regista-te</button>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < currentStepDisplay ? "bg-primary" : "bg-white/10"}`} />
                ))}
                <span className="text-xs text-white/40 ml-2">{currentStepDisplay}/{totalSteps}</span>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">{error}</div>
              )}

              {/* Step 1: Basic info */}
              {regStep === 1 && (
                <>
                  <h2 className="text-2xl font-bold mb-2">Cria a tua conta</h2>
                  <p className="text-muted-foreground mb-6">Preenche os teus dados para começar.</p>
                  <form onSubmit={handleRegStep1} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nome completo</Label>
                      <Input placeholder="João Silva" required className="h-11 rounded-xl" value={regData.name} onChange={e => setRegData(d => ({ ...d, name: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Empresa (opcional)</Label>
                      <Input placeholder="Tech Corp Portugal" className="h-11 rounded-xl" value={regData.company} onChange={e => setRegData(d => ({ ...d, company: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de conta</Label>
                      <select
                        className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={regData.role}
                        onChange={e => setRegData(d => ({ ...d, role: e.target.value as "student" | "company_admin" }))}
                      >
                        <option value="student">Aluno / Profissional</option>
                        <option value="company_admin">Administrador de Empresa</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="joao@empresa.pt" required className="h-11 rounded-xl" value={regData.email} onChange={e => setRegData(d => ({ ...d, email: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Password</Label>
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••" required className="h-11 rounded-xl pr-10" value={regData.password} onChange={e => setRegData(d => ({ ...d, password: e.target.value }))} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Confirmar Password</Label>
                      <Input type="password" placeholder="••••••••" required className="h-11 rounded-xl" value={regData.confirmPassword} onChange={e => setRegData(d => ({ ...d, confirmPassword: e.target.value }))} />
                    </div>
                    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 text-base font-medium">
                      Continuar <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Já tens conta?{" "}
                      <button onClick={resetToLogin} className="text-primary font-medium hover:underline">Entra aqui</button>
                    </p>
                  </div>
                </>
              )}

              {/* Step 2: Pack selection (students only) */}
              {regStep === 2 && regData.role === "student" && (
                <>
                  <h2 className="text-2xl font-bold mb-2">Escolhe o teu Pack</h2>
                  <p className="text-muted-foreground mb-6">Seleciona o pack que melhor se adapta aos teus objetivos.</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {PACK_OPTIONS.map(pack => (
                      <button
                        key={pack.name}
                        onClick={() => setSelectedPack(pack)}
                        className={`text-left p-4 rounded-xl border transition-all ${
                          selectedPack?.name === pack.name
                            ? "border-primary bg-primary/10"
                            : "border-white/10 bg-white/5 hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-semibold text-sm">{pack.name}</span>
                          {selectedPack?.name === pack.name && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="text-primary font-bold text-lg mb-2">€{pack.price}</div>
                        <ul className="space-y-1">
                          {pack.features.map(f => (
                            <li key={f} className="text-xs text-white/50 flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-primary/50 shrink-0" />{f}
                            </li>
                          ))}
                        </ul>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setRegStep(1)} className="rounded-xl h-11 flex-1">Anterior</Button>
                    <Button
                      onClick={handleRegStep2}
                      disabled={!selectedPack}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 flex-1"
                    >
                      Continuar <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}

              {/* Step 3: Confirmation */}
              {regStep === 3 && (
                <>
                  <h2 className="text-2xl font-bold mb-2">Confirmar Registo</h2>
                  <p className="text-muted-foreground mb-6">Revê os teus dados antes de criar a conta.</p>
                  <div className="premium-card space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Nome</span>
                      <span className="font-medium">{regData.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Email</span>
                      <span className="font-medium">{regData.email}</span>
                    </div>
                    {regData.company && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Empresa</span>
                        <span className="font-medium">{regData.company}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Tipo</span>
                      <span className="font-medium">{regData.role === "student" ? "Aluno" : "Admin Empresa"}</span>
                    </div>
                    {selectedPack && (
                      <>
                        <div className="border-t border-white/10 pt-3 flex justify-between text-sm">
                          <span className="text-white/50">Pack</span>
                          <span className="font-medium text-primary">{selectedPack.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">Preço</span>
                          <span className="font-bold text-primary">€{selectedPack.price}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setRegStep(regData.role === "student" ? 2 : 1)} className="rounded-xl h-11 flex-1">Anterior</Button>
                    <Button
                      onClick={handleRegConfirm}
                      disabled={loading}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 flex-1"
                    >
                      {loading ? "A criar conta..." : "Criar Conta"} {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;

