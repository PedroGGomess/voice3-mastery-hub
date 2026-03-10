import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Navigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Check, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PackOption {
  name: string;
  price: number | null;
  sessions: number;
  teacherLessons: number;
  features: string[];
  note?: string;
}

const PACK_OPTIONS: PackOption[] = [
  { name: "Starter", price: 149, sessions: 4, teacherLessons: 1, features: ["4 sessões AI", "1 aula com professora", "Certificado"] },
  { name: "Pro", price: 349, sessions: 8, teacherLessons: 2, features: ["8 sessões AI", "2 aulas com professora", "Analytics", "Gravações"] },
  { name: "Advanced", price: 499, sessions: 12, teacherLessons: 3, features: ["12 sessões AI", "3 aulas com professora", "Percurso personalizado"] },
  { name: "Business Master", price: null, sessions: 20, teacherLessons: 4, features: ["20 sessões AI", "4 aulas com professora", "Gestor dedicado"], note: "Contacto personalizado" },
];

interface RegFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
  role: "student" | "company_admin";
}

function getPasswordStrength(pw: string): { level: "weak" | "medium" | "strong"; label: string; color: string; width: string } {
  if (pw.length < 6) return { level: "weak", label: "Fraca", color: "#ef4444", width: "33%" };
  if (pw.length < 10) return { level: "medium", label: "Média", color: "#f59e0b", width: "66%" };
  return { level: "strong", label: "Forte", color: "#10b981", width: "100%" };
}

const GoldDot = () => (
  <span className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#B89A5A" }} />
);

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [regStep, setRegStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [regData, setRegData] = useState<RegFormData>({ name: "", email: "", password: "", confirmPassword: "", company: "", role: "student" });
  const [selectedPack, setSelectedPack] = useState<PackOption | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading, currentUser } = useAuth();

  if (isLoading) return null;
  if (isAuthenticated) {
    if (currentUser?.role === "company_admin") return <Navigate to="/empresa/dashboard" replace />;
    if (currentUser?.role === "professor" || currentUser?.role === "admin") return <Navigate to="/professor/dashboard" replace />;
    return <Navigate to="/app" replace />;
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
      setError(err instanceof Error ? err.message : "Ocorreu um erro.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegStep1 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (regData.password !== regData.confirmPassword) { setError("As passwords não coincidem."); return; }
    if (regData.password.length < 6) { setError("A password deve ter pelo menos 6 caracteres."); return; }
    setRegStep(regData.role === "student" ? 2 : 3);
  };

  const handleRegStep2 = () => {
    if (!selectedPack) { toast.error("Seleciona um pack para continuar."); return; }
    setRegStep(3);
  };

  const handleRegConfirm = async () => {
    setError("");
    setLoading(true);
    try {
      const packDetails = selectedPack && selectedPack.price !== null
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
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro.");
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setMode("login");
    setRegStep(1);
    setSelectedPack(null);
    setError("");
    setSuccess(false);
    setRegData({ name: "", email: "", password: "", confirmPassword: "", company: "", role: "student" });
  };

  const totalSteps = regData.role === "student" ? 3 : 2;
  const currentStepDisplay = regData.role === "student" ? regStep : regStep === 1 ? 1 : 2;
  const pwStrength = getPasswordStrength(regData.password);

  /* ── Success Screen ─────────────────────────────────── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#0B1A2A" }}>
        {/* CSS confetti */}
        <style>{`
          @keyframes confettiFall {
            0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
          }
          .confetti-piece {
            position: absolute;
            top: -20px;
            width: 8px;
            height: 8px;
            border-radius: 2px;
            animation: confettiFall linear infinite;
          }
        `}</style>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${(i * 5) + Math.random() * 5}%`,
              background: i % 3 === 0 ? "#B89A5A" : i % 3 === 1 ? "#F4F2ED" : "#243A5A",
              animationDuration: `${2.5 + (i % 5) * 0.4}s`,
              animationDelay: `${(i % 7) * 0.3}s`,
            }}
          />
        ))}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center max-w-md px-8"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "#B89A5A22", border: "2px solid #B89A5A" }}>
              <CheckCircle2 className="h-10 w-10" style={{ color: "#B89A5A" }} />
            </div>
          </div>
          <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "#F4F2ED" }}>
            VOICE<sup style={{ color: "#B89A5A" }}>³</sup>
          </h1>
          <p className="text-2xl font-semibold mt-4 mb-3" style={{ color: "#F4F2ED" }}>Welcome to VOICE³</p>
          <p className="text-sm mb-8" style={{ color: "#8E96A3" }}>A sua conta foi criada com sucesso. Está pronto para começar.</p>
          <button
            onClick={() => navigate("/app")}
            className="w-full py-3.5 rounded-xl font-semibold text-base transition-all"
            style={{ background: "#B89A5A", color: "#0B1A2A" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#a08040")}
            onMouseLeave={e => (e.currentTarget.style.background = "#B89A5A")}
          >
            Aceder à Plataforma <ArrowRight className="inline h-4 w-4 ml-1" />
          </button>
        </motion.div>
      </div>
    );
  }

  /* ── Main Layout ─────────────────────────────────────── */
  return (
    <div className="min-h-screen flex">
      {/* LEFT — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-16 relative overflow-hidden" style={{ background: "#0B1A2A" }}>
        <div className="absolute inset-0 opacity-[0.035]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #B89A5A 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />
        <div className="relative z-10 max-w-md">
          <h1 className="font-serif text-5xl font-bold mb-4" style={{ color: "#F4F2ED" }}>
            VOICE<sup className="text-2xl" style={{ color: "#B89A5A" }}>³</sup>
          </h1>
          <p className="italic text-lg mb-2" style={{ color: "#8E96A3" }}>
            Designed for professionals who must perform.
          </p>
          <p className="text-xs font-semibold tracking-[0.25em] mb-6" style={{ color: "#B89A5A", textTransform: "uppercase" as const }}>
            Clarity.&nbsp; Control.&nbsp; Command.
          </p>
          <div className="w-12 h-px mb-8" style={{ background: "#B89A5A" }} />
          <div className="space-y-4">
            {[
              "AI-powered performance sessions",
              "Live 1-on-1 professor coaching",
              "Measurable executive communication growth",
            ].map((feat) => (
              <div key={feat} className="flex items-start gap-3">
                <GoldDot />
                <span className="text-sm" style={{ color: "#8E96A3" }}>{feat}</span>
              </div>
            ))}
          </div>
          <div className="mt-12 p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,154,90,0.2)" }}>
            <p className="text-xs mb-3 font-medium tracking-wide uppercase" style={{ color: "#B89A5A" }}>Credenciais Demo</p>
            <p className="text-xs mb-1" style={{ color: "#8E96A3" }}><span style={{ color: "#F4F2ED" }}>Aluno:</span> demo@voice3.pt / demo123</p>
            <p className="text-xs mb-1" style={{ color: "#8E96A3" }}><span style={{ color: "#F4F2ED" }}>Professor:</span> professor@voice3.pt / prof123</p>
            <p className="text-xs" style={{ color: "#8E96A3" }}><span style={{ color: "#F4F2ED" }}>Empresa:</span> empresa@voice3.pt / empresa123</p>
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto" style={{ background: "#1C1F26" }}>
        <motion.div
          key={`${mode}-${regStep}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <span className="font-serif text-2xl font-bold" style={{ color: "#F4F2ED" }}>
              VOICE<sup style={{ color: "#B89A5A" }}>³</sup>
            </span>
          </div>

          {/* ── LOGIN ── */}
          {mode === "login" && (
            <>
              <h2 className="font-serif text-3xl font-bold mb-1" style={{ color: "#F4F2ED" }}>Welcome Back</h2>
              <p className="text-sm mb-8" style={{ color: "#8E96A3" }}>Access your executive training programme.</p>

              {error && (
                <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>{error}</div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label style={{ color: "#8E96A3" }}>Email</Label>
                  <Input
                    id="email" name="email" type="email" placeholder="joao@empresa.pt" required
                    className="h-11 rounded-xl border focus:border-[#B89A5A] transition-colors"
                    style={{ background: "#0B1A2A", borderColor: "#2a3040", color: "#F4F2ED" }}
                  />
                </div>
                <div className="space-y-2">
                  <Label style={{ color: "#8E96A3" }}>Password</Label>
                  <div className="relative">
                    <Input
                      id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required
                      className="h-11 rounded-xl border pr-10 focus:border-[#B89A5A] transition-colors"
                      style={{ background: "#0B1A2A", borderColor: "#2a3040", color: "#F4F2ED" }}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#8E96A3" }}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full h-11 rounded-xl font-semibold text-base transition-all disabled:opacity-60"
                  style={{ background: "#B89A5A", color: "#0B1A2A" }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.background = "#a08040")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#B89A5A")}
                >
                  {loading ? "A processar..." : <>Entrar <ArrowRight className="inline h-4 w-4 ml-1" /></>}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button className="text-sm" style={{ color: "#B89A5A" }}>Esqueceste a password?</button>
              </div>

              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "#2a3040" }} />
                <span className="text-xs" style={{ color: "#8E96A3" }}>— ou —</span>
                <div className="flex-1 h-px" style={{ background: "#2a3040" }} />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setMode("register"); setError(""); }}
                  className="flex-1 h-11 rounded-xl font-semibold text-sm border transition-all"
                  style={{ background: "transparent", borderColor: "#B89A5A", color: "#B89A5A" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#B89A5A22"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  Criar Conta
                </button>
                <button
                  onClick={() => { setMode("register"); setRegData(d => ({ ...d, role: "company_admin" })); setError(""); }}
                  className="flex-1 h-11 rounded-xl font-semibold text-sm border transition-all"
                  style={{ background: "transparent", borderColor: "#2a3040", color: "#8E96A3" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#8E96A3"; e.currentTarget.style.color = "#F4F2ED"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a3040"; e.currentTarget.style.color = "#8E96A3"; }}
                >
                  Acesso Empresa
                </button>
              </div>

              {/* Mobile demo credentials */}
              <div className="lg:hidden mt-6 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(184,154,90,0.2)" }}>
                <p className="text-xs mb-3 font-medium tracking-wide uppercase" style={{ color: "#B89A5A" }}>DEMO CREDENTIALS</p>
                <div className="space-y-1.5">
                  <p className="text-xs" style={{ color: "#8E96A3" }}>👤 <span style={{ color: "#F4F2ED" }}>Aluno:</span> demo@voice3.pt / demo123</p>
                  <p className="text-xs" style={{ color: "#8E96A3" }}>🏢 <span style={{ color: "#F4F2ED" }}>Empresa:</span> empresa@voice3.pt / empresa123</p>
                  <p className="text-xs" style={{ color: "#8E96A3" }}>👩‍🏫 <span style={{ color: "#F4F2ED" }}>Professora:</span> professor@voice3.pt / prof123</p>
                </div>
              </div>

              {/* Demo Credentials Card */}
              <div className="mt-4 rounded-xl p-4 border border-[#B89A5A]/20 bg-[#B89A5A]/5">
                <p className="text-xs font-bold text-[#B89A5A] uppercase tracking-wider mb-2">Demo Credentials</p>
                <div className="space-y-1.5 text-xs text-[#8E96A3]">
                  <div className="flex gap-2"><span>👤 Aluno:</span><span className="text-[#F4F2ED]">demo@voice3.pt / demo123</span></div>
                  <div className="flex gap-2"><span>🏢 Empresa:</span><span className="text-[#F4F2ED]">empresa@voice3.pt / empresa123</span></div>
                  <div className="flex gap-2"><span>👩‍🏫 Professora:</span><span className="text-[#F4F2ED]">professor@voice3.pt / prof123</span></div>
                </div>
              </div>
            </>
          )}

          {/* ── REGISTER ── */}
          {mode === "register" && (
            <>
              {/* Step dots */}
              <div className="flex items-center gap-2 mb-6">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className="h-2 flex-1 rounded-full transition-all duration-300"
                    style={{ background: i < currentStepDisplay ? "#B89A5A" : "#2a3040" }}
                  />
                ))}
                <span className="text-xs ml-2" style={{ color: "#8E96A3" }}>{currentStepDisplay}/{totalSteps}</span>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>{error}</div>
              )}

              <AnimatePresence mode="wait">
                {/* Step 1 */}
                {regStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="font-serif text-3xl font-bold mb-1" style={{ color: "#F4F2ED" }}>Cria a tua conta</h2>
                    <p className="text-sm mb-6" style={{ color: "#8E96A3" }}>Preenche os teus dados para começar.</p>
                    <form onSubmit={handleRegStep1} className="space-y-4">
                      {[
                        { label: "Nome completo", key: "name", type: "text", placeholder: "João Silva", required: true },
                        { label: "Empresa (opcional)", key: "company", type: "text", placeholder: "Tech Corp Portugal", required: false },
                        { label: "Email", key: "email", type: "email", placeholder: "joao@empresa.pt", required: true },
                      ].map(({ label, key, type, placeholder, required }) => (
                        <div key={key} className="space-y-1.5">
                          <Label style={{ color: "#8E96A3" }}>{label}</Label>
                          <Input
                            type={type} placeholder={placeholder} required={required}
                            value={regData[key as keyof RegFormData]}
                            onChange={e => setRegData(d => ({ ...d, [key]: e.target.value }))}
                            className="h-11 rounded-xl border focus:border-[#B89A5A] transition-colors"
                            style={{ background: "#0B1A2A", borderColor: "#2a3040", color: "#F4F2ED" }}
                          />
                        </div>
                      ))}

                      <div className="space-y-1.5">
                        <Label style={{ color: "#8E96A3" }}>Tipo de conta</Label>
                        <select
                          className="flex h-11 w-full rounded-xl px-3 py-2 text-sm outline-none"
                          style={{ background: "#0B1A2A", border: "1px solid #2a3040", color: "#F4F2ED" }}
                          value={regData.role}
                          onChange={e => setRegData(d => ({ ...d, role: e.target.value as "student" | "company_admin" }))}
                        >
                          <option value="student">Aluno / Profissional</option>
                          <option value="company_admin">Administrador de Empresa</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label style={{ color: "#8E96A3" }}>Password</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"} placeholder="••••••••" required
                            value={regData.password}
                            onChange={e => setRegData(d => ({ ...d, password: e.target.value }))}
                            className="h-11 rounded-xl border pr-10 focus:border-[#B89A5A] transition-colors"
                            style={{ background: "#0B1A2A", borderColor: "#2a3040", color: "#F4F2ED" }}
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#8E96A3" }}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {regData.password && (
                          <div className="mt-1.5">
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#2a3040" }}>
                              <div className="h-full rounded-full transition-all duration-300" style={{ width: pwStrength.width, background: pwStrength.color }} />
                            </div>
                            <p className="text-xs mt-1" style={{ color: pwStrength.color }}>{pwStrength.label}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label style={{ color: "#8E96A3" }}>Confirmar Password</Label>
                        <Input
                          type="password" placeholder="••••••••" required
                          value={regData.confirmPassword}
                          onChange={e => setRegData(d => ({ ...d, confirmPassword: e.target.value }))}
                          className="h-11 rounded-xl border focus:border-[#B89A5A] transition-colors"
                          style={{ background: "#0B1A2A", borderColor: "#2a3040", color: "#F4F2ED" }}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full h-11 rounded-xl font-semibold text-base transition-all"
                        style={{ background: "#B89A5A", color: "#0B1A2A" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#a08040")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#B89A5A")}
                      >
                        Continuar <ArrowRight className="inline h-4 w-4 ml-1" />
                      </button>
                    </form>
                    <div className="mt-5 text-center">
                      <p className="text-sm" style={{ color: "#8E96A3" }}>
                        Já tens conta?{" "}
                        <button onClick={resetToLogin} className="font-medium hover:underline" style={{ color: "#B89A5A" }}>Entra aqui</button>
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Pack (students only) */}
                {regStep === 2 && regData.role === "student" && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="font-serif text-3xl font-bold mb-1" style={{ color: "#F4F2ED" }}>Escolhe o teu Pack</h2>
                    <p className="text-sm mb-6" style={{ color: "#8E96A3" }}>Seleciona o pack que melhor se adapta aos teus objetivos.</p>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {PACK_OPTIONS.map(pack => (
                        <button
                          key={pack.name}
                          onClick={() => setSelectedPack(pack)}
                          className="text-left p-4 rounded-xl border transition-all"
                          style={{
                            background: selectedPack?.name === pack.name ? "rgba(184,154,90,0.1)" : "#0B1A2A",
                            borderColor: selectedPack?.name === pack.name ? "#B89A5A" : "#2a3040",
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-semibold text-sm" style={{ color: "#F4F2ED" }}>{pack.name}</span>
                            {selectedPack?.name === pack.name && <Check className="h-4 w-4" style={{ color: "#B89A5A" }} />}
                          </div>
                          {pack.price !== null ? (
                            <div className="font-bold text-lg mb-2" style={{ color: "#B89A5A" }}>€{pack.price}</div>
                          ) : (
                            <div className="mb-2">
                              <div className="font-bold text-sm" style={{ color: "#B89A5A" }}>Sob Consulta</div>
                              {pack.note && <div className="text-xs mt-0.5" style={{ color: "#8E96A3" }}>{pack.note}</div>}
                            </div>
                          )}
                          <ul className="space-y-1">
                            {pack.features.map(f => (
                              <li key={f} className="text-xs flex items-center gap-1.5" style={{ color: "#8E96A3" }}>
                                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: "#B89A5A" }} />{f}
                              </li>
                            ))}
                          </ul>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setRegStep(1)} className="flex-1 h-11 rounded-xl font-semibold text-sm border transition-all" style={{ background: "transparent", borderColor: "#2a3040", color: "#8E96A3" }}>Anterior</button>
                      <button
                        onClick={handleRegStep2} disabled={!selectedPack}
                        className="flex-1 h-11 rounded-xl font-semibold text-sm transition-all disabled:opacity-40"
                        style={{ background: "#B89A5A", color: "#0B1A2A" }}
                        onMouseEnter={e => selectedPack && (e.currentTarget.style.background = "#a08040")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#B89A5A")}
                      >
                        Continuar <ArrowRight className="inline h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Confirmation */}
                {regStep === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="font-serif text-3xl font-bold mb-1" style={{ color: "#F4F2ED" }}>Confirmar Registo</h2>
                    <p className="text-sm mb-6" style={{ color: "#8E96A3" }}>Revê os teus dados antes de criar a conta.</p>
                    <div className="rounded-2xl p-5 mb-6 space-y-3" style={{ background: "#0B1A2A", border: "1px solid #2a3040" }}>
                      {[
                        ["Nome", regData.name],
                        ["Email", regData.email],
                        ...(regData.company ? [["Empresa", regData.company]] : []),
                        ["Tipo", regData.role === "student" ? "Aluno" : "Admin Empresa"],
                        ...(selectedPack ? [["Pack", selectedPack.name], ["Preço", selectedPack.price !== null ? `€${selectedPack.price}` : "Sob Consulta"]] : []),
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between text-sm">
                          <span style={{ color: "#8E96A3" }}>{k}</span>
                          <span className="font-medium" style={{ color: k === "Pack" || k === "Preço" ? "#B89A5A" : "#F4F2ED" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setRegStep(regData.role === "student" ? 2 : 1)} className="flex-1 h-11 rounded-xl font-semibold text-sm border transition-all" style={{ background: "transparent", borderColor: "#2a3040", color: "#8E96A3" }}>Anterior</button>
                      <button
                        onClick={handleRegConfirm} disabled={loading}
                        className="flex-1 h-11 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
                        style={{ background: "#B89A5A", color: "#0B1A2A" }}
                        onMouseEnter={e => !loading && (e.currentTarget.style.background = "#a08040")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#B89A5A")}
                      >
                        {loading ? "A criar conta..." : <>Criar Conta <ArrowRight className="inline h-4 w-4 ml-1" /></>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
