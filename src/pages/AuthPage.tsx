import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Check, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";

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
  <span className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#C9A84C" }} />
);

const demoUsers = [
  { icon: "👤", role: "Student",   email: "demo@voice3.pt",      pass: "demo123"    },
  { icon: "👩‍🏫", role: "Professor", email: "professor@voice3.pt", pass: "prof123"    },
  { icon: "🏢", role: "Company",   email: "empresa@voice3.pt",   pass: "empresa123" },
  { icon: "🔧", role: "Admin",     email: "admin@voice3.pt",     pass: "admin123"   },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 52,
  padding: "0 16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "white",
  fontSize: 15,
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [regStep, setRegStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [regData, setRegData] = useState<RegFormData>({ name: "", email: "", password: "", confirmPassword: "", company: "", role: "student" });
  const [selectedPack, setSelectedPack] = useState<PackOption | null>(null);
  const [success, setSuccess] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isShowingDemo, setIsShowingDemo] = useState(false);

  const { t } = useTranslation();
  const { login, register, isAuthenticated, isLoading, currentUser } = useAuth();

  if (isLoading) return null;
  if (isAuthenticated) {
    if (currentUser?.role === "company_admin") return <Navigate to="/empresa/dashboard" replace />;
    if (currentUser?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (currentUser?.role === "professor") return <Navigate to="/professor/dashboard" replace />;
    return <Navigate to="/app" replace />;
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
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
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#0a1628" }}>
        <style>{`
          @keyframes confettiFall {
            0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
          }
          .confetti-piece {
            position: absolute; top: -20px; width: 8px; height: 8px;
            border-radius: 2px; animation: confettiFall linear infinite;
          }
        `}</style>
        {[...Array(20)].map((_, i) => (
          <div key={i} className="confetti-piece" style={{
            left: `${(i * 5) + Math.random() * 5}%`,
            background: i % 3 === 0 ? "#C9A84C" : i % 3 === 1 ? "#F4F2ED" : "#243A5A",
            animationDuration: `${2.5 + (i % 5) * 0.4}s`,
            animationDelay: `${(i % 7) * 0.3}s`,
          }} />
        ))}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 text-center max-w-md px-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.08)", border: "2px solid #C9A84C" }}>
              <CheckCircle2 className="h-10 w-10" style={{ color: "#C9A84C" }} />
            </div>
          </div>
          <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "#F4F2ED" }}>
            VOICE<sup style={{ color: "#C9A84C" }}>³</sup>
          </h1>
          <p className="text-2xl font-semibold mt-4 mb-3" style={{ color: "#F4F2ED" }}>Welcome to VOICE³</p>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>A sua conta foi criada com sucesso. Está pronto para começar.</p>
          <button onClick={() => navigate("/app")} className="w-full py-3.5 rounded-xl font-semibold text-base transition-all"
            style={{ background: "#C9A84C", color: "#060f1d" }}
            onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
            onMouseLeave={e => (e.currentTarget.style.filter = "")}>
            Aceder à Plataforma <ArrowRight className="inline h-4 w-4 ml-1" />
          </button>
        </motion.div>
      </div>
    );
  }

  /* ── REGISTER MODE ─────────────────────────────────── */
  if (mode === "register") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 overflow-y-auto" style={{ background: "#060f1d" }}>
        <motion.div key={`${mode}-${regStep}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="w-full max-w-md">
          <div className="mb-8">
            <span className="font-serif text-2xl font-bold cursor-pointer" style={{ color: "#C9A84C", letterSpacing: "0.1em" }} onClick={resetToLogin}>VOICE³</span>
          </div>
          <div className="flex items-center gap-2 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
                style={{ background: i < currentStepDisplay ? "#C9A84C" : "rgba(255,255,255,0.1)" }} />
            ))}
            <span className="text-xs ml-2" style={{ color: "rgba(255,255,255,0.4)" }}>{currentStepDisplay}/{totalSteps}</span>
          </div>
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>{error}</div>
          )}
          <AnimatePresence mode="wait">
            {regStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-serif text-3xl font-bold mb-1" style={{ color: "#F4F2ED" }}>Cria a tua conta</h2>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>Preenche os teus dados para começar.</p>
                <form onSubmit={handleRegStep1} className="space-y-4">
                  {[
                    { label: "Nome completo", key: "name", type: "text", placeholder: "João Silva", required: true },
                    { label: "Empresa (opcional)", key: "company", type: "text", placeholder: "Tech Corp Portugal", required: false },
                    { label: "Email", key: "email", type: "email", placeholder: "joao@empresa.pt", required: true },
                  ].map(({ label, key, type, placeholder, required }) => (
                    <div key={key} className="space-y-1.5">
                      <Label style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{label}</Label>
                      <Input type={type} placeholder={placeholder} required={required}
                        value={regData[key as keyof RegFormData]}
                        onChange={e => setRegData(d => ({ ...d, [key]: e.target.value }))}
                        style={{ ...inputStyle }} />
                    </div>
                  ))}
                  <div className="space-y-1.5">
                    <Label style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Tipo de conta</Label>
                    <select className="flex w-full rounded-lg px-3 py-2 text-sm outline-none"
                      style={{ ...inputStyle, height: 52, background: "rgba(255,255,255,0.04)" }}
                      value={regData.role}
                      onChange={e => setRegData(d => ({ ...d, role: e.target.value as "student" | "company_admin" }))}>
                      <option value="student">Aluno / Profissional</option>
                      <option value="company_admin">Administrador de Empresa</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Password</Label>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} placeholder="••••••••" required
                        value={regData.password}
                        onChange={e => setRegData(d => ({ ...d, password: e.target.value }))}
                        style={{ ...inputStyle, paddingRight: 44 }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {regData.password && (
                      <div className="mt-1.5">
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                          <div className="h-full rounded-full transition-all duration-300" style={{ width: pwStrength.width, background: pwStrength.color }} />
                        </div>
                        <p className="text-xs mt-1" style={{ color: pwStrength.color }}>{pwStrength.label}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Confirmar Password</Label>
                    <Input type="password" placeholder="••••••••" required
                      value={regData.confirmPassword}
                      onChange={e => setRegData(d => ({ ...d, confirmPassword: e.target.value }))}
                      style={{ ...inputStyle }} />
                  </div>
                  <button type="submit" className="w-full rounded-lg font-semibold text-base transition-all"
                    style={{ height: 52, background: "linear-gradient(135deg,#C9A84C,#B8912A)", color: "#060f1d", border: "none", cursor: "pointer" }}>
                    Continuar <ArrowRight className="inline h-4 w-4 ml-1" />
                  </button>
                </form>
                <div className="mt-5 text-center">
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Já tens conta?{" "}
                    <button onClick={resetToLogin} className="font-medium hover:underline" style={{ color: "#C9A84C", background: "none", border: "none", cursor: "pointer" }}>Entra aqui</button>
                  </p>
                </div>
              </motion.div>
            )}
            {regStep === 2 && regData.role === "student" && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-serif text-3xl font-bold mb-1" style={{ color: "#F4F2ED" }}>Escolhe o teu Pack</h2>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>Seleciona o pack que melhor se adapta.</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {PACK_OPTIONS.map(pack => (
                    <button key={pack.name} onClick={() => setSelectedPack(pack)} className="text-left p-4 rounded-xl border transition-all"
                      style={{ background: selectedPack?.name === pack.name ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.03)", borderColor: selectedPack?.name === pack.name ? "#C9A84C" : "rgba(255,255,255,0.08)", cursor: "pointer" }}>
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-sm" style={{ color: "#F4F2ED" }}>{pack.name}</span>
                        {selectedPack?.name === pack.name && <Check className="h-4 w-4" style={{ color: "#C9A84C" }} />}
                      </div>
                      {pack.price !== null ? (
                        <div className="font-bold text-lg mb-2" style={{ color: "#C9A84C" }}>€{pack.price}</div>
                      ) : (
                        <div className="mb-2">
                          <div className="font-bold text-sm" style={{ color: "#C9A84C" }}>Sob Consulta</div>
                          {pack.note && <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{pack.note}</div>}
                        </div>
                      )}
                      <ul className="space-y-1">
                        {pack.features.map(f => (
                          <li key={f} className="text-xs flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                            <GoldDot />{f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setRegStep(1)} className="flex-1 h-11 rounded-lg font-semibold text-sm border transition-all"
                    style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>Anterior</button>
                  <button onClick={handleRegStep2} disabled={!selectedPack} className="flex-1 h-11 rounded-lg font-semibold text-sm transition-all disabled:opacity-40"
                    style={{ background: "#C9A84C", color: "#060f1d", border: "none", cursor: "pointer" }}>
                    Continuar <ArrowRight className="inline h-4 w-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            )}
            {regStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-serif text-3xl font-bold mb-1" style={{ color: "#F4F2ED" }}>Confirmar Registo</h2>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>Revê os teus dados antes de criar a conta.</p>
                <div className="rounded-xl p-5 mb-6 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {[
                    ["Nome", regData.name],
                    ["Email", regData.email],
                    ...(regData.company ? [["Empresa", regData.company]] : []),
                    ["Tipo", regData.role === "student" ? "Aluno" : "Admin Empresa"],
                    ...(selectedPack ? [["Pack", selectedPack.name], ["Preço", selectedPack.price !== null ? `€${selectedPack.price}` : "Sob Consulta"]] : []),
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>{k}</span>
                      <span className="font-medium" style={{ color: k === "Pack" || k === "Preço" ? "#C9A84C" : "#F4F2ED" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setRegStep(regData.role === "student" ? 2 : 1)} className="flex-1 h-11 rounded-lg font-semibold text-sm border transition-all"
                    style={{ background: "transparent", borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>Anterior</button>
                  <button onClick={handleRegConfirm} disabled={loading} className="flex-1 h-11 rounded-lg font-semibold text-sm transition-all disabled:opacity-60"
                    style={{ background: "#C9A84C", color: "#060f1d", border: "none", cursor: "pointer" }}>
                    {loading ? "A criar conta..." : <span>Criar Conta <ArrowRight className="inline h-4 w-4 ml-1" /></span>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  /* ── LOGIN MODE — 50/50 Split Layout ────────────────── */
  return (
    <div style={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
      {/* LEFT PANEL */}
      <div className="hidden lg:flex" style={{
        width: "50%",
        background: "linear-gradient(160deg, #030810 0%, #0a1628 50%, #0d1f3c 100%)",
        position: "relative",
        overflow: "hidden",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <pattern id="geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0L0 60M30 0L0 30M60 30L30 60" stroke="#C9A84C" strokeWidth="0.5" opacity="0.06" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geo)" />
        </svg>
        <div className="slide-in-left" style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 420, padding: "0 40px" }}>
          <h1 style={{ fontFamily: "serif", fontSize: 52, fontWeight: 700, color: "#C9A84C", letterSpacing: "0.15em", margin: 0 }}>VOICE³</h1>
          <div style={{ width: 48, height: 2, background: "#C9A84C", margin: "28px auto" }} />
          <p style={{ fontFamily: "serif", fontSize: 22, fontStyle: "italic", color: "rgba(255,255,255,0.82)", maxWidth: 380, lineHeight: 1.75, textAlign: "center", margin: 0 }}>
            "You will not improve your English.<br />You will perform with precision."
          </p>
          <p style={{ color: "rgba(201,168,76,0.4)", fontSize: 20, margin: "28px 0" }}>✦</p>
          <div style={{ display: "flex", flexDirection: "row", gap: 8, justifyContent: "center", alignItems: "center" }}>
            <span style={{ color: "#C9A84C", fontSize: 14 }}>★★★★★</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>4.9/5 from 200+ executives</span>
          </div>
          <div style={{ marginTop: 32, display: "flex", gap: 24, justifyContent: "center" }}>
            {["GALP", "NOS", "EDP"].map(name => (
              <span key={name} style={{ fontSize: 12, letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", fontWeight: 600 }}>{name}</span>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 32, left: 32, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#C9A84C,#8B6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#060f1d" }}>SS</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)", margin: 0 }}>Sandra Stuttaford</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>Your Executive Coach</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1,
        background: "#060f1d",
        padding: "clamp(32px, 5vw, 64px) clamp(24px, 5vw, 56px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflowY: "auto",
      }}>
        <div className="lg:hidden" style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: "serif", fontSize: 28, fontWeight: 700, color: "#C9A84C", letterSpacing: "0.1em" }}>VOICE³</span>
        </div>
        <div className="slide-in-right" style={{ maxWidth: 440, width: "100%", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "serif", fontSize: 32, fontWeight: 700, color: "white", marginBottom: 8 }}>Welcome back.</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 36 }}>Sign in to continue your executive training.</p>
          <div style={{ width: 40, height: 2, background: "#C9A84C", marginBottom: 36 }} />
          {error && (
            <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 8, fontSize: 14, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>{error}</div>
          )}
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Email Address</label>
              <input type="email" placeholder="your@email.com" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={inputStyle}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.7)")}
                onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: "block", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showLoginPassword ? "text" : "password"} placeholder="••••••••" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.7)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")} />
                <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
              <button type="button" style={{ fontSize: 13, color: "rgba(201,168,76,0.6)", cursor: "pointer", background: "none", border: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(201,168,76,0.6)")}>
                Forgot password?
              </button>
            </div>
            <button type="submit" disabled={loading} style={{
              width: "100%", height: 52,
              background: loading ? "rgba(201,168,76,0.6)" : "linear-gradient(135deg, #C9A84C 0%, #B8912A 100%)",
              color: "#060f1d", fontWeight: 700, fontSize: 15, letterSpacing: "0.04em",
              borderRadius: 8, border: "none", cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 24px rgba(201,168,76,0.25)", transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.boxShadow = "0 6px 32px rgba(201,168,76,0.4)"; e.currentTarget.style.transform = "scale(1.01)"; } }}
              onMouseLeave={e => { e.currentTarget.style.filter = ""; e.currentTarget.style.boxShadow = "0 4px 24px rgba(201,168,76,0.25)"; e.currentTarget.style.transform = ""; }}>
              {loading ? (
                <>
                  <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid #060f1d", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Signing in...
                </>
              ) : "Sign In  →"}
            </button>
          </form>
          <div style={{ display: "flex", alignItems: "center", margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", padding: "0 12px" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>
          <button onClick={() => setIsShowingDemo(d => !d)} style={{
            width: "100%", height: 46, background: "transparent",
            border: "1px solid rgba(201,168,76,0.25)",
            color: "rgba(201,168,76,0.75)", fontSize: 14,
            borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)"; e.currentTarget.style.color = "rgba(201,168,76,1)"; e.currentTarget.style.background = "rgba(201,168,76,0.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)"; e.currentTarget.style.color = "rgba(201,168,76,0.75)"; e.currentTarget.style.background = "transparent"; }}>
            ▸&nbsp; Explore with Demo Credentials
          </button>
          <div style={{ overflow: "hidden", maxHeight: isShowingDemo ? 300 : 0, transition: "max-height 0.35s ease" }}>
            <div style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.15)", borderRadius: 10, padding: 16, marginTop: 12 }}>
              <p style={{ fontSize: 11, color: "rgba(201,168,76,0.7)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 10 }}>Demo Accounts</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {demoUsers.map(user => (
                  <button key={user.role} onClick={() => { setLoginEmail(user.email); setLoginPassword(user.pass); }}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: 6, cursor: "pointer", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.06)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{user.icon} {user.role}</span>
                    <span style={{ fontSize: 11, color: "rgba(201,168,76,0.7)", fontFamily: "monospace" }}>Use →</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 28, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
              Don't have an account?{" "}
              <button onClick={() => { setMode("register"); setError(""); }} style={{ color: "#C9A84C", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default AuthPage;
