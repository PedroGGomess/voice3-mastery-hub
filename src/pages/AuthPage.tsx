import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Navigate, Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Check, CheckCircle2, Shield, Users, Sparkles, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";
import { lovable } from "@/integrations/lovable/index";


interface PackOption {
  name: string;
  slug: string;
  price: number | null;
  sessions: number;
  teacherLessons: number;
  features: string[];
  note?: string;
  popular?: boolean;
}

const PACK_OPTIONS: PackOption[] = [
  { name: "Starter", slug: "starter", price: 149, sessions: 4, teacherLessons: 1, features: ["4 Sessões AI", "1 Sessão ao vivo com professor", "Acompanhamento de progresso", "Certificado"], popular: false },
  { name: "Pro", slug: "pro", price: 349, sessions: 8, teacherLessons: 3, features: ["8 Sessões AI", "3 Sessões ao vivo com professor", "Analytics completo", "Reserva prioritária", "Gravações das sessões"], popular: true },
  { name: "Advanced", slug: "advanced", price: 499, sessions: 12, teacherLessons: 5, features: ["12 Sessões AI", "5 Sessões ao vivo com professor", "Percurso personalizado", "Tudo do Pro incluído"], popular: false },
  { name: "Business Master", slug: "business-master", price: null, sessions: 20, teacherLessons: 10, features: ["Sessões AI ilimitadas", "10 Sessões com professor", "Gestor dedicado", "Dashboard de equipa"], note: "Contacto personalizado" },
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
  if (pw.length < 6) return { level: "weak", label: "Weak", color: "#ef4444", width: "33%" };
  if (pw.length < 10) return { level: "medium", label: "Medium", color: "#f59e0b", width: "66%" };
  return { level: "strong", label: "Strong", color: "#10b981", width: "100%" };
}

const demoUsers = [
  { icon: "🎓", role: "Student",   email: "demo@voice3.pt",      pass: "demo123"    },
  { icon: "👨‍🏫", role: "Coach",     email: "professor@voice3.pt", pass: "prof123"    },
  { icon: "🏢", role: "Company",   email: "empresa@voice3.pt",   pass: "empresa123" },
  { icon: "🔧", role: "Admin",     email: "admin@voice3.pt",     pass: "admin123"   },
];

const inputClass = "w-full h-[52px] px-4 rounded-xl text-[15px] outline-none transition-all duration-200 placeholder:text-opacity-25 placeholder:text-current";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const navigate = useNavigate();
  const [regStep, setRegStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [regData, setRegData] = useState<RegFormData>({ name: "", email: "", password: "", confirmPassword: "", company: "", role: "student" });

  // Pre-select pack from URL if coming from PacksPage
  const preselectedSlug = searchParams.get("pack");
  const preselectedPack = PACK_OPTIONS.find(p => p.slug === preselectedSlug) || null;
  const [selectedPack, setSelectedPack] = useState<PackOption | null>(preselectedPack);

  const [success, setSuccess] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isShowingDemo, setIsShowingDemo] = useState(false);

  const { t } = useTranslation();
  const { login, register, isAuthenticated, isLoading, currentUser } = useAuth();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
      <div className="text-center">
        <span className="font-serif text-2xl font-bold" style={{ color: "var(--gold)", letterSpacing: "0.1em" }}>VOICE<sup className="text-sm">3</sup></span>
        <div className="mt-6 flex justify-center">
          <span className="inline-block w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--gold)" }} />
        </div>
      </div>
    </div>
  );
  // If authenticated and a pack checkout is pending, redirect to checkout instead of dashboard
  if (isAuthenticated) {
    const pendingPack = searchParams.get("pack");
    const priceMap: Record<string, string> = { starter: "starter", pro: "pro", advanced: "advanced" };
    if (pendingPack && priceMap[pendingPack]) {
      return <Navigate to={`/checkout?price=${priceMap[pendingPack]}`} replace />;
    }
    if (currentUser?.role === "company_admin") return <Navigate to="/empresa/dashboard" replace />;
    if (currentUser?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (currentUser?.role === "professor") return <Navigate to="/professor/dashboard" replace />;
    return <Navigate to="/app" replace />;
  }

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        setError(result.error instanceof Error ? result.error.message : "Error signing in with Google.");
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      toast.success("Bem-vindo!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred.");
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        setError(result.error instanceof Error ? result.error.message : "Error signing in with Apple.");
        setLoading(false);
        return;
      }
      if (result.redirected) return;
      toast.success("Bem-vindo!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred.");
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast.success("Bem-vindo de volta!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred.");
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

      // Use a race between register() and a direct signup fallback to avoid gotrue lock hang
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const signupRes = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({
          email: regData.email,
          password: regData.password,
          data: { name: regData.name },
        }),
      });

      const signupData = await signupRes.json();
      if (!signupRes.ok || !(signupData.id || signupData.user?.id)) {
        throw new Error(signupData.msg || signupData.error_description || signupData.message || 'Erro ao criar conta');
      }

      const userId = signupData.user?.id || signupData.id;
      const email = signupData.user?.email || signupData.email || regData.email;

      // Let the auth context pick up the session in the background
      // (supabase client will eventually process it via onAuthStateChange)

      if (selectedPack && selectedPack.price !== null && selectedPack.slug !== "business-master") {
        toast.success("Conta criada! A redirecionar para pagamento...");
        const priceMap: Record<string, string> = { starter: "starter", pro: "pro", advanced: "advanced" };
        const priceId = priceMap[selectedPack.slug];
        if (priceId) {
          const checkoutParams = new URLSearchParams({
            price: priceId,
            email: email,
            userId: userId,
          });
          navigate(`/checkout?${checkoutParams.toString()}`);
          return;
        }
      }

      toast.success("Conta criada com sucesso!");
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred.");
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setMode("login");
    setRegStep(1);
    setSelectedPack(preselectedPack);
    setError("");
    setSuccess(false);
    setRegData({ name: "", email: "", password: "", confirmPassword: "", company: "", role: "student" });
  };

  const totalSteps = regData.role === "student" ? 3 : 2;
  const currentStepDisplay = regData.role === "student" ? regStep : regStep === 1 ? 1 : 2;
  const pwStrength = getPasswordStrength(regData.password);
  const stepLabels = regData.role === "student" ? ["Details", "Pack", "Confirm"] : ["Details", "Confirm"];

  /* ── Success Screen ─────────────────────────────────── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "var(--bg-base)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, var(--gold-10), transparent 60%)" }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative z-10 text-center max-w-md px-8">
          <div className="flex justify-center mb-8">
            <motion.div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{ background: "var(--gold-10)", border: "2px solid var(--border-gold)" }}
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle2 className="h-12 w-12" style={{ color: "var(--gold)" }} />
            </motion.div>
          </div>
          <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            VOICE<sup style={{ color: "var(--gold)" }}>3</sup>
          </h1>
          <p className="text-2xl font-semibold mt-6 mb-3" style={{ color: "var(--text-primary)" }}>Welcome to VOICE3</p>
          <p className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>Your account has been created successfully. Start your journey.</p>
          <button onClick={() => navigate("/app")} className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, var(--gold), var(--gold-dark, #8B6914))", color: "var(--bg-base)" }}>
            Access Platform <ArrowRight className="inline h-4 w-4 ml-2" />
          </button>
        </motion.div>
      </div>
    );
  }

  /* ── REGISTER MODE ─────────────────────────────────── */
  if (mode === "register") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 overflow-y-auto" style={{ background: "var(--bg-base)" }}>
        {/* Background decoration */}
        <div className="fixed inset-0 pointer-events-none">
          <div style={{ position: "absolute", top: "10%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: "var(--gold-10)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", bottom: "10%", left: "10%", width: 200, height: 200, borderRadius: "50%", background: "var(--bg-elevated)", filter: "blur(60px)" }} />
        </div>

        <motion.div key={`${mode}-${regStep}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="w-full max-w-md relative z-10">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/">
              <span className="font-serif text-2xl font-bold cursor-pointer" style={{ color: "var(--gold)", letterSpacing: "0.1em" }}>VOICE<sup className="text-sm">3</sup></span>
            </Link>
            <LanguageSelector />
          </div>

          {/* Step indicator with labels */}
          <div className="flex items-center gap-2 mb-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className="flex-1">
                <div className="h-1 rounded-full transition-all duration-500"
                  style={{ background: i < currentStepDisplay ? "linear-gradient(90deg, var(--gold), var(--gold-light))" : "var(--bg-surface)" }} />
                <span className="text-[10px] mt-1 block tracking-wider uppercase" style={{ color: i < currentStepDisplay ? "var(--gold)" : "var(--text-muted)" }}>
                  {stepLabels[i]}
                </span>
              </div>
            ))}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3.5 rounded-xl text-sm flex items-center gap-2" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
              <Shield className="h-4 w-4 shrink-0" /> {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {regStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-serif text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Create your account</h2>
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Fill in your details to get started</p>
                <form onSubmit={handleRegStep1} className="space-y-4">
                  {[
                    { label: "Full name", key: "name", type: "text", placeholder: "John Smith", required: true },
                    { label: "Company (optional)", key: "company", type: "text", placeholder: "Tech Corp", required: false },
                    { label: "Email", key: "email", type: "email", placeholder: "john@company.com", required: true },
                  ].map(({ label, key, type, placeholder, required }) => (
                    <div key={key} className="space-y-1.5">
                      <Label className="text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>{label}</Label>
                      <input type={type} placeholder={placeholder} required={required}
                        value={regData[key as keyof RegFormData]}
                        onChange={e => setRegData(d => ({ ...d, [key]: e.target.value }))}
                        className={inputClass}
                        style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                    </div>
                  ))}
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>{t('auth.account_type')}</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "student" as const, icon: <Users className="h-5 w-5" />, title: t('auth.student'), desc: "Individual training" },
                        { id: "company_admin" as const, icon: <Shield className="h-5 w-5" />, title: t('auth.company'), desc: "Corporate team" },
                      ].map(type => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setRegData(d => ({ ...d, role: type.id }))}
                          className="text-left p-4 rounded-xl border-2 transition-all duration-200"
                          style={{
                            background: regData.role === type.id ? "var(--gold-10)" : "var(--bg-surface)",
                            borderColor: regData.role === type.id ? "var(--border-gold)" : "var(--border)",
                            cursor: "pointer",
                          }}
                        >
                          <div className="mb-2" style={{ color: regData.role === type.id ? "var(--gold)" : "var(--text-muted)" }}>{type.icon}</div>
                          <div className="text-sm font-semibold" style={{ color: regData.role === type.id ? "var(--gold)" : "var(--text-primary)" }}>{type.title}</div>
                          <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{type.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>Password</Label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} placeholder="Minimum 6 characters" required
                        value={regData.password}
                        onChange={e => setRegData(d => ({ ...d, password: e.target.value }))}
                        className={inputClass}
                        style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)", paddingRight: 48 }} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {regData.password && (
                      <div className="mt-2">
                        <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--bg-surface)" }}>
                          <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: pwStrength.width }} style={{ background: pwStrength.color }} />
                        </div>
                        <p className="text-[11px] mt-1 font-medium" style={{ color: pwStrength.color }}>{pwStrength.label}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] uppercase tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>Confirm Password</Label>
                    <input type="password" placeholder="Repeat password" required
                      value={regData.confirmPassword}
                      onChange={e => setRegData(d => ({ ...d, confirmPassword: e.target.value }))}
                      className={inputClass}
                      style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
                  </div>
                  <button type="submit" className="w-full h-[52px] rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, var(--gold), var(--gold-dark, #8B6914))", color: "var(--bg-base)", border: "none", cursor: "pointer" }}>
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Already have an account?{" "}
                    <button onClick={resetToLogin} className="font-medium hover:underline" style={{ color: "var(--gold)", background: "none", border: "none", cursor: "pointer" }}>Sign in here</button>
                  </p>
                </div>
              </motion.div>
            )}

            {regStep === 2 && regData.role === "student" && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-serif text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Choose your Pack</h2>
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Select the pack that best fits your needs.</p>
                <div className="space-y-3 mb-6">
                  {PACK_OPTIONS.map(pack => (
                    <button key={pack.name} onClick={() => setSelectedPack(pack)}
                      className="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden"
                      style={{
                        background: selectedPack?.name === pack.name ? "var(--gold-10)" : "var(--bg-surface)",
                        borderColor: selectedPack?.name === pack.name ? "var(--border-gold)" : "var(--border)",
                        cursor: "pointer"
                      }}>
                      {pack.popular && (
                        <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: "var(--gold-15)", color: "var(--gold)", border: "1px solid var(--border-gold)" }}>
                          Popular
                        </span>
                      )}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-base" style={{ color: selectedPack?.name === pack.name ? "var(--gold)" : "var(--text-primary)" }}>{pack.name}</span>
                            {selectedPack?.name === pack.name && <Check className="h-4 w-4" style={{ color: "var(--gold)" }} />}
                          </div>
                          {pack.price !== null ? (
                            <div className="flex items-baseline gap-1">
                              <span className="font-bold text-2xl" style={{ color: "var(--gold)" }}>EUR{pack.price}</span>
                              <span className="text-xs" style={{ color: "var(--text-muted)" }}>/pack</span>
                            </div>
                          ) : (
                            <span className="text-sm font-semibold" style={{ color: "var(--gold)" }}>Custom Quote</span>
                          )}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {pack.features.slice(0, 3).map(f => (
                              <span key={f} className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>{f}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setRegStep(1)} className="flex-1 h-12 rounded-xl font-semibold text-sm border transition-all duration-200"
                    style={{ background: "transparent", borderColor: "var(--border)", color: "var(--text-secondary)", cursor: "pointer" }}>Back</button>
                  <button onClick={handleRegStep2} disabled={!selectedPack} className="flex-1 h-12 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, var(--gold), var(--gold-dark, #8B6914))", color: "var(--bg-base)", border: "none", cursor: "pointer" }}>
                    Continue <ArrowRight className="inline h-4 w-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            )}

            {regStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="font-serif text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Confirm Registration</h2>
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Review your details before creating your account.</p>
                <div className="rounded-xl p-5 mb-6 space-y-3" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                  {[
                    ["Name", regData.name],
                    ["Email", regData.email],
                    ...(regData.company ? [["Company", regData.company]] : []),
                    ["Type", regData.role === "student" ? "Student" : "Company Admin"],
                    ...(selectedPack ? [["Pack", selectedPack.name], ["Price", selectedPack.price !== null ? `EUR${selectedPack.price}` : "Custom Quote"]] : []),
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span style={{ color: "var(--text-secondary)" }}>{k}</span>
                      <span className="font-medium" style={{ color: k === "Pack" || k === "Price" ? "var(--gold)" : "var(--text-primary)" }}>{v}</span>
                    </div>
                  ))}
                </div>
                {selectedPack && selectedPack.price !== null && (
                  <div className="rounded-xl p-4 mb-6 flex items-center gap-3" style={{ background: "var(--gold-10)", border: "1px solid var(--border-gold)" }}>
                    <Sparkles className="h-5 w-5 shrink-0" style={{ color: "var(--gold)" }} />
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      Payment will be processed after account creation. You will receive an email with instructions.
                    </p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setRegStep(regData.role === "student" ? 2 : 1)} className="flex-1 h-12 rounded-xl font-semibold text-sm border transition-all duration-200"
                    style={{ background: "transparent", borderColor: "var(--border)", color: "var(--text-secondary)", cursor: "pointer" }}>Back</button>
                  <button onClick={handleRegConfirm} disabled={loading} className="flex-1 h-12 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-60 hover:shadow-lg"
                    style={{ background: "linear-gradient(135deg, var(--gold), var(--gold-dark, #8B6914))", color: "var(--bg-base)", border: "none", cursor: "pointer" }}>
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--bg-base)" }} />
                        Creating...
                      </span>
                    ) : (
                      <span>Create Account <ArrowRight className="inline h-4 w-4 ml-1" /></span>
                    )}
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
        background: "linear-gradient(160deg, var(--bg-base) 0%, var(--bg-elevated) 50%, var(--bg-surface) 100%)",
        position: "relative",
        overflow: "hidden",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
        {/* Pattern overlay */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}>
          <defs>
            <pattern id="geo" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0L0 60M30 0L0 30M60 30L30 60" stroke="var(--gold)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#geo)" />
        </svg>

        {/* Radial glow */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, var(--gold-10), transparent 60%)" }} />

        <div className="slide-in-left" style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 420, padding: "0 40px" }}>
          <Link to="/"><h1 style={{ fontFamily: "var(--font-serif)", fontSize: 56, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.15em", margin: 0, cursor: "pointer" }}>VOICE<sup style={{ fontSize: 24 }}>3</sup></h1></Link>
          <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, var(--gold), transparent)", margin: "32px auto" }} />
          <p style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontStyle: "italic", color: "var(--text-secondary)", maxWidth: 380, lineHeight: 1.8, textAlign: "center", margin: 0 }}>
            "You will not improve your English.<br />You will perform with precision."
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: 18, margin: "32px 0" }}>---</p>

          {/* Features list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left", maxWidth: 280, margin: "0 auto" }}>
            {[
              { icon: <Award className="h-4 w-4" />, text: "Executive Communication" },
              { icon: <Sparkles className="h-4 w-4" />, text: "AI Coaching" },
              { icon: <Users className="h-4 w-4" />, text: "Live Coach Sessions" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ color: "var(--text-muted)" }}>{item.icon}</div>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item.text}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 36, display: "flex", gap: 12, justifyContent: "center", alignItems: "center" }}>
            <span style={{ color: "var(--gold)", fontSize: 13 }}>★★★★★</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>4.9/5 from 200+ executives</span>
          </div>
          <div style={{ marginTop: 24, display: "flex", gap: 24, justifyContent: "center" }}>
            {["GALP", "NOS", "EDP"].map(name => (
              <span key={name} style={{ fontSize: 11, letterSpacing: "0.15em", color: "var(--text-faint)", fontWeight: 600 }}>{name}</span>
            ))}
          </div>
        </div>

        {/* Coach indicator */}
        <div style={{ position: "absolute", bottom: 32, left: 32, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, var(--gold), var(--gold-dark, #8B6914))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "var(--bg-base)" }}>SS</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Your Executive Coach</p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Sandra Stuttaford</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1,
        background: "var(--bg-base)",
        padding: "clamp(32px, 5vw, 64px) clamp(24px, 5vw, 56px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflowY: "auto",
      }}>
        <div className="lg:hidden flex items-center justify-between" style={{ marginBottom: 32 }}>
          <Link to="/"><span style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.1em" }}>VOICE<sup style={{ fontSize: 14 }}>3</sup></span></Link>
          <LanguageSelector />
        </div>
        <div className="slide-in-right" style={{ maxWidth: 440, width: "100%", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 34, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Welcome back</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 36 }}>Sign in to continue your journey</p>
          <div style={{ width: 40, height: 2, background: "linear-gradient(90deg, var(--gold), transparent)", marginBottom: 36 }} />

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 12, fontSize: 14, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", display: "flex", alignItems: "center", gap: 8 }}>
              <Shield className="h-4 w-4 shrink-0" /> {error}
            </motion.div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Email</label>
              <input type="email" placeholder="your@email.com" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                className={inputClass}
                style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: "block", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showLoginPassword ? "text" : "password"} placeholder="Enter your password" required value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                  className={inputClass}
                  style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)", paddingRight: 48 }} />
                <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
              <button type="button" style={{ fontSize: 13, color: "var(--text-muted)", cursor: "pointer", background: "none", border: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
                Forgot your password?
              </button>
            </div>
            <button type="submit" disabled={loading} style={{
              width: "100%", height: 52,
              background: loading ? "var(--gold-30)" : "linear-gradient(135deg, var(--gold) 0%, var(--gold-dark, #8B6914) 100%)",
              color: "var(--bg-base)", fontWeight: 700, fontSize: 15, letterSpacing: "0.04em",
              borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 24px rgba(201,168,76,0.2)", transition: "all 0.3s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = "0 8px 40px rgba(201,168,76,0.35)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 24px rgba(201,168,76,0.2)"; e.currentTarget.style.transform = ""; }}>
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--bg-base)" }} />
                  Signing in...
                </>
              ) : "Sign In  →"}
            </button>
          </form>

          {/* Social Sign-In */}
          <div style={{ display: "flex", alignItems: "center", margin: "24px 0 16px" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 11, color: "var(--text-muted)", padding: "0 16px", textTransform: "uppercase", letterSpacing: "0.1em" }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                flex: 1, height: 48,
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)", fontSize: 14, fontWeight: 500,
                borderRadius: 12, cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.background = "var(--bg-elevated)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Google
            </button>

            {/* Apple */}
            <button
              onClick={handleAppleSignIn}
              disabled={loading}
              style={{
                flex: 1, height: 48,
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)", fontSize: 14, fontWeight: 500,
                borderRadius: 12, cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.background = "var(--bg-elevated)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Apple
            </button>
          </div>

          <div style={{ marginTop: 16 }} />

          <button onClick={() => setIsShowingDemo(d => !d)} style={{
            width: "100%", height: 46, background: "transparent",
            border: "1px solid var(--border-gold)",
            color: "var(--text-muted)", fontSize: 13,
            borderRadius: 12, cursor: "pointer", transition: "all 0.2s",
            letterSpacing: "0.03em",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.background = "var(--gold-10)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-gold)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}>
            Explore with Demo Credentials
          </button>

          <div style={{ overflow: "hidden", maxHeight: isShowingDemo ? 300 : 0, transition: "max-height 0.4s ease" }}>
            <div style={{ background: "var(--gold-10)", border: "1px solid var(--border-gold)", borderRadius: 12, padding: 16, marginTop: 12 }}>
              <p style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 10 }}>Demo Accounts</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {demoUsers.map(user => (
                  <button key={user.role} onClick={() => { setLoginEmail(user.email); setLoginPassword(user.pass); }}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 8, cursor: "pointer", background: "var(--bg-surface)", border: "1px solid var(--border)", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--gold-10)"; e.currentTarget.style.borderColor = "var(--border-gold)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
                    <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{user.icon} {user.role}</span>
                    <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace" }}>Use →</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 32, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Don't have an account?{" "}
              <button onClick={() => { setMode("register"); setError(""); }} style={{ color: "var(--gold)", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                Register here
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
